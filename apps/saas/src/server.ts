import * as paraglideServer from "@repo/i18n/paraglide/server.js";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

export default createServerEntry({
	fetch(req, opts) {
		return paraglideServer.paraglideMiddleware(req, () => handler.fetch(req, opts));
	},
});
