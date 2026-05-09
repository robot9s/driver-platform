/**
 * Merges per-scope JSON under translations/ into flat messages/{locale}.json for Paraglide.
 * Mirrors getMessagesForLocale() merge + fallback behavior, then flattens with underscore keys
 * (e.g. marketing.home.hero.title → marketing_home_hero_title).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { toMerged } from "es-toolkit";

import { config, type Locale } from "../config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");

const LOCALES = Object.keys(config.locales) as Locale[];

function loadJson(relativePath: string): Record<string, unknown> {
	return JSON.parse(readFileSync(join(packageRoot, relativePath), "utf8")) as Record<
		string,
		unknown
	>;
}

function mergeScope(locale: Locale, scope: "marketing" | "saas" | "mail"): Record<string, unknown> {
	const localeMessages = loadJson(`translations/${locale}/${scope}.json`);
	const sharedMessages = loadJson(`translations/${locale}/shared.json`);
	let messages = toMerged(localeMessages, sharedMessages) as Record<string, unknown>;

	if (locale !== config.defaultLocale) {
		const defaultLocaleMessages = loadJson(
			`translations/${config.defaultLocale}/${scope}.json`,
		);
		const defaultSharedMessages = loadJson(`translations/${config.defaultLocale}/shared.json`);
		const defaultMessages = toMerged(defaultLocaleMessages, defaultSharedMessages) as Record<
			string,
			unknown
		>;
		messages = toMerged(defaultMessages, messages) as Record<string, unknown>;
	}

	return messages;
}

function flattenStrings(obj: Record<string, unknown>, prefix: string): Record<string, string> {
	const out: Record<string, string> = {};
	for (const [k, v] of Object.entries(obj)) {
		const key = prefix ? `${prefix}_${k}` : k;
		if (typeof v === "string") {
			out[key] = v;
		} else if (v !== null && typeof v === "object" && !Array.isArray(v)) {
			Object.assign(out, flattenStrings(v as Record<string, unknown>, key));
		}
	}
	return out;
}

function main(): void {
	mkdirSync(join(packageRoot, "messages"), { recursive: true });

	for (const locale of LOCALES) {
		const bundle = {
			...flattenStrings(mergeScope(locale, "marketing"), "marketing"),
			...flattenStrings(mergeScope(locale, "saas"), "saas"),
			...flattenStrings(mergeScope(locale, "mail"), "mail"),
		};
		writeFileSync(
			join(packageRoot, "messages", `${locale}.json`),
			`${JSON.stringify(bundle, null, "\t")}\n`,
			"utf8",
		);
	}
}

main();
