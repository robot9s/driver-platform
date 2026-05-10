import { createLocaleCookieHeader, handleLocaleMiddleware } from "@repo/i18n/server";
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

export default createServerEntry({
	async fetch(req, opts) {
		const { redirect, setCookie } = handleLocaleMiddleware(req);

		if (redirect) {
			return redirect;
		}

		const response = await handler.fetch(req, opts);

		if (setCookie) {
			response.headers.append("Set-Cookie", createLocaleCookieHeader(setCookie.value));
		}

		return response;
	},
});
