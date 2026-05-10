import { upsertUserNotificationPreferences } from "@repo/database";
import { z } from "zod";

import { protectedProcedure } from "../../../orpc/procedures";

const notificationTypeSchema = z.enum(["WELCOME", "APP_UPDATE"]);
const notificationTargetSchema = z.enum(["IN_APP", "EMAIL"]);

export const updatePreference = protectedProcedure
	.route({
		method: "POST",
		path: "/notifications/preference",
		tags: ["Notifications"],
		summary: "Update one notification preference",
	})
	.input(
		z.object({
			type: notificationTypeSchema,
			target: notificationTargetSchema,
			disabled: z.boolean(),
		}),
	)
	.handler(async ({ input, context: { user } }) => {
		if (input.target === "IN_APP") {
			return { ok: true as const };
		}

		const enabled = !input.disabled;
		const patch =
			input.type === "WELCOME"
				? { emailAccountSecurity: enabled }
				: { emailProductUpdates: enabled };

		await upsertUserNotificationPreferences(user.id, patch);
		return { ok: true as const };
	});
