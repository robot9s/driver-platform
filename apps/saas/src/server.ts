import * as paraglideServer from "@repo/i18n/paraglide/server.js";
import handler from "@tanstack/react-start/server-entry";

export default {
	fetch(req: Request): Promise<Response> {
		return paraglideServer.paraglideMiddleware(req, () => handler.fetch(req));
	},
};
