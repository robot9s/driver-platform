import { deLocalizeUrl, localizeUrl } from "@repo/i18n/paraglide/runtime";
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		// Preload route code + loader data on link hover/focus. Makes
		// navigation feel instant across the protected app.
		defaultPreload: "intent",
		defaultPreloadStaleTime: 30_000,
		rewrite: {
			input: ({ url }) => deLocalizeUrl(url),
			output: ({ url }) => localizeUrl(url),
		},
	});
}
