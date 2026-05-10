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
		const preferences = await getUserNotificationPreferences(user.id);
		const disabled: Array<{ type: "WELCOME" | "APP_UPDATE"; target: "EMAIL" }> = [];

		if (!preferences.emailAccountSecurity) {
			disabled.push({ type: "WELCOME", target: "EMAIL" });
		}

		if (!preferences.emailProductUpdates) {
			disabled.push({ type: "APP_UPDATE", target: "EMAIL" });
		}

		return {
			...preferences,
			disabled,
		};
	});
