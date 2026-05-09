import * as paraglideServer from "@repo/i18n/paraglide/server.js";
import handler from "@tanstack/react-start/server-entry";

/**
 * Paraglide middleware sets locale context and keeps cookies in sync.
 * TanStack Router applies `deLocalizeUrl` / `localizeUrl` via `rewrite`, so the
 * handler receives the original request URL (see Paraglide TanStack Start docs).
 */
export default {
	fetch(req: Request): Promise<Response> {
		return paraglideServer.paraglideMiddleware(req, () => handler.fetch(req));
	},
};
