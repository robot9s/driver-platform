import { config } from "@i18n/config";
import { getLocale } from "@repo/i18n/paraglide/runtime";

export function useLocaleCurrency() {
	const locale = getLocale();
	const localeCurrency =
		Object.entries(config.locales).find(([key]) => key === locale)?.[1].currency ??
		config.defaultCurrency;

	return localeCurrency;
}
