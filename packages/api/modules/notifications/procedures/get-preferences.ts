import { getUserNotificationPreferences } from "@repo/database";

import { protectedProcedure } from "../../../orpc/procedures";

export const getPreferences = protectedProcedure
	.route({
		method: "GET",
		path: "/notifications/preferences",
		tags: ["Notifications"],
		summary: "Get email notification preferences",
	})
	.handler(async ({ context: { user } }) => {
		return getUserNotificationPreferences(user.id);
	});
