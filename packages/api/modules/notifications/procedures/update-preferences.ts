import { upsertUserNotificationPreferences } from "@repo/database";
import { z } from "zod";

import { protectedProcedure } from "../../../orpc/procedures";

export const updatePreferences = protectedProcedure
	.route({
		method: "POST",
		path: "/notifications/preferences",
		tags: ["Notifications"],
		summary: "Update email notification preferences",
	})
	.input(
		z
			.object({
				emailNewsletter: z.boolean().optional(),
				emailProductUpdates: z.boolean().optional(),
				emailAccountSecurity: z.boolean().optional(),
			})
			.refine(
				(data) =>
					data.emailNewsletter !== undefined ||
					data.emailProductUpdates !== undefined ||
					data.emailAccountSecurity !== undefined,
				{ message: "At least one field is required" },
			),
	)
	.handler(async ({ input, context: { user } }) => {
		return upsertUserNotificationPreferences(user.id, input);
	});
