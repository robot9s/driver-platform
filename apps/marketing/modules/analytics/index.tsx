/**
 * Entry point for the marketing site's analytics layer. Each shipped provider
 * exposes the same shape:
 *
 *   - `AnalyticsScript()`: emits the provider's loader script. Returns `null`
 *     when the required envs are missing so dev/preview environments don't
 *     ship a broken tag to visitors.
 *   - `useAnalytics()`: returns `{ trackEvent }` that is a no-op when the
 *     provider script hasn't loaded.
 *
 * Pick the active provider by setting `VITE_ANALYTICS_PROVIDER` in your env
 * file. Add new providers under `./provider/<name>/` exporting the same
 * interface and extend the switch below.
 */
import { AnalyticsScript as CustomScript, useAnalytics as useCustom } from "./provider/custom";
import { AnalyticsScript as GoogleScript, useAnalytics as useGoogle } from "./provider/google";
import {
	AnalyticsScript as MixpanelScript,
	useAnalytics as useMixpanel,
} from "./provider/mixpanel";
import { AnalyticsScript as PirschScript, useAnalytics as usePirsch } from "./provider/pirsch";
import {
	AnalyticsScript as PlausibleScript,
	useAnalytics as usePlausible,
} from "./provider/plausible";
import { AnalyticsScript as PosthogScript, useAnalytics as usePosthog } from "./provider/posthog";
import { AnalyticsScript as UmamiScript, useAnalytics as useUmami } from "./provider/umami";
import { AnalyticsScript as VercelScript, useAnalytics as useVercel } from "./provider/vercel";

type AnalyticsHook = {
	trackEvent: (event: string, data?: Record<string, unknown>) => void;
};

const providerName = (import.meta.env.VITE_ANALYTICS_PROVIDER as string | undefined)?.toLowerCase();

export function AnalyticsScript() {
	switch (providerName) {
		case "plausible":
			return <PlausibleScript />;
		case "umami":
			return <UmamiScript />;
		case "pirsch":
			return <PirschScript />;
		case "google":
			return <GoogleScript />;
		case "mixpanel":
			return <MixpanelScript />;
		case "posthog":
			return <PosthogScript />;
		case "vercel":
			return <VercelScript />;
		case "custom":
			return <CustomScript />;
		default:
			return null;
	}
}

const noopAnalytics: AnalyticsHook = {
	trackEvent: () => {
		/* noop: no analytics provider is configured */
	},
};

export function useAnalytics(): AnalyticsHook {
	// Hooks are called unconditionally to preserve rules-of-hooks; only the
	// active provider's return value is used.
	const plausible = usePlausible();
	const umami = useUmami();
	const pirsch = usePirsch();
	const google = useGoogle();
	const mixpanel = useMixpanel();
	const posthog = usePosthog();
	const vercel = useVercel();
	const custom = useCustom();

	switch (providerName) {
		case "plausible":
			return plausible;
		case "umami":
			return umami;
		case "pirsch":
			return pirsch;
		case "google":
			return google;
		case "mixpanel":
			return mixpanel;
		case "posthog":
			return posthog;
		case "vercel":
			return vercel;
		case "custom":
			return custom;
		default:
			return noopAnalytics;
	}
}
