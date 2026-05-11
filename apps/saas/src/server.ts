import { createLocaleCookieHeader, handleLocaleMiddleware } from "@repo/i18n/server";
import type { Register } from "@tanstack/react-router";
import type { RequestOptions } from "@tanstack/react-start/server";
import { fetchViteEnv } from "nitro/vite/runtime";

interface NitroMainGlobal {
	__nitro_main__?: string;
}

export default {
	async fetch(req: Request, opts?: RequestOptions<Register>) {
		if ((globalThis as NitroMainGlobal).__nitro_main__ === import.meta.url) {
			return fetchViteEnv("ssr", req);
		}

		const { default: handler } = await import("@tanstack/react-start/server-entry");
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
};
