/**
 * Thin adapters over Paraglide.
 *
 * `useTranslations()` is kept as an ergonomic wrapper so call sites can write
 * `t("settings.account.avatar.title")` and we re-render on locale change, but
 * resolution goes straight to the compiled Paraglide message functions in
 * `@repo/i18n/paraglide/messages`. No JSON bundle is shipped to the client and
 * no parallel messages store is maintained — Paraglide is the single source
 * of truth.
 *
 * For new code, prefer importing the message function directly:
 *
 *     import { m } from "@repo/i18n/paraglide/messages";
 *     <h1>{m.settings_account_avatar_title()}</h1>
 *
 * This hook exists mainly to keep existing call sites stable.
 */
import { m } from "@repo/i18n/paraglide/messages";
import { getLocale } from "@repo/i18n/paraglide/runtime";
import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

type MessageFn = (values?: Record<string, unknown>) => string;

const PARAGLIDE_MESSAGES = m as unknown as Record<string, MessageFn | undefined>;

interface Translator {
	(key: string, values?: Record<string, unknown>): string;
	/**
	 * Returns a grouped object of sibling messages that share a common prefix.
	 * Useful when binding a translation "namespace" to something like a
	 * Select, where every child message is read as a static string.
	 */
	raw: (key: string) => Record<string, string> | undefined;
}

interface Formatter {
	number: (value: number, options?: Intl.NumberFormatOptions) => string;
	dateTime: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
	relativeTime: (
		value: number,
		unit: Intl.RelativeTimeFormatUnit,
		options?: Intl.RelativeTimeFormatOptions,
	) => string;
}

function normalizeKey(key: string): string {
	// Messages are emitted as `section_subsection_key`. Accept dots, slashes,
	// spaces, etc. and canonicalize to underscore segments.
	return key.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function resolveMessageFn(key: string): MessageFn | undefined {
	const normalized = normalizeKey(key);
	const candidates = [normalized, `saas_${normalized}`, `shared_${normalized}`];
	for (const candidate of candidates) {
		const fn = PARAGLIDE_MESSAGES[candidate];
		if (typeof fn === "function") {
			return fn;
		}
	}
	return undefined;
}

function resolveRawGroup(key: string): Record<string, string> | undefined {
	const normalized = normalizeKey(key);
	const candidates = [normalized, `saas_${normalized}`, `shared_${normalized}`];
	for (const candidate of candidates) {
		const prefix = `${candidate}_`;
		const matches = Object.keys(PARAGLIDE_MESSAGES).filter((entry) => entry.startsWith(prefix));
		if (matches.length === 0) {
			continue;
		}
		const group: Record<string, string> = {};
		for (const entry of matches) {
			const fn = PARAGLIDE_MESSAGES[entry];
			if (typeof fn === "function") {
				group[entry.slice(prefix.length)] = fn({});
			}
		}
		return group;
	}
	return undefined;
}

export function useTranslations(namespace?: string): Translator {
	// Re-render on locale-affecting path changes so translated content updates.
	useRouterState({ select: (s) => s.location.pathname });

	return useMemo(() => {
		const resolveKey = (key: string) => (namespace ? `${namespace}.${key}` : key);

		const translate = ((key: string, values?: Record<string, unknown>) => {
			const resolvedKey = resolveKey(key);
			const fn = resolveMessageFn(resolvedKey);
			return fn ? fn(values ?? {}) : resolvedKey;
		}) as Translator;

		translate.raw = (key: string) => resolveRawGroup(resolveKey(key));

		return translate;
	}, [namespace]);
}

export function useFormatter(): Formatter {
	useRouterState({ select: (s) => s.location.pathname });
	const locale = getLocale();

	return useMemo(
		() => ({
			number: (value, options) => new Intl.NumberFormat(locale, options).format(value),
			dateTime: (value, options) =>
				new Intl.DateTimeFormat(locale, options).format(new Date(value)),
			relativeTime: (value, unit, options) =>
				new Intl.RelativeTimeFormat(locale, options).format(value, unit),
		}),
		[locale],
	);
}
