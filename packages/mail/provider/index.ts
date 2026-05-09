import { logger } from "@repo/logs";

import type { SendEmailHandler } from "../types";

/**
 * Runtime-selectable email provider. The concrete transport is chosen via
 * `MAIL_PROVIDER`; unset or `"console"` prints the email to stdout (useful
 * during development when no provider credentials are configured).
 *
 * Add a new provider by:
 *   1. Implementing `SendEmailHandler` under `./<name>/index.ts`.
 *   2. Adding a case here that lazily imports it.
 *   3. Documenting the required env vars in `.env.local.example`.
 */
const providerName = (process.env.MAIL_PROVIDER ?? "").toLowerCase();

async function loadProvider(): Promise<SendEmailHandler> {
	switch (providerName) {
		case "nodemailer": {
			const { send } = await import("./nodemailer");
			return send;
		}
		case "plunk": {
			const { send } = await import("./plunk");
			return send;
		}
		case "resend": {
			const { send } = await import("./resend");
			return send;
		}
		case "postmark": {
			const { send } = await import("./postmark");
			return send;
		}
		case "mailgun": {
			const { send } = await import("./mailgun");
			return send;
		}
		case "":
		case "console": {
			const { send } = await import("./console");
			return send;
		}
		default: {
			logger.warn(
				`Unknown MAIL_PROVIDER="${providerName}"; falling back to the console provider. ` +
					`Supported values: console, nodemailer, plunk, resend, postmark, mailgun.`,
			);
			const { send } = await import("./console");
			return send;
		}
	}
}

let providerPromise: Promise<SendEmailHandler> | null = null;

export const send: SendEmailHandler = async (params) => {
	providerPromise ??= loadProvider();
	const handler = await providerPromise;
	return handler(params);
};
