import { getDriverProfileByUserId, upsertDriverProfile } from "@repo/database";

import { protectedProcedure } from "../../../orpc/procedures";
import { driverProfileInputSchema } from "../types";

export const upsertProfile = protectedProcedure
	.route({
		method: "PUT",
		path: "/drivers/me",
		tags: ["Drivers"],
		summary: "Create or update own driver profile",
	})
	.input(driverProfileInputSchema)
	.handler(async ({ input, context: { user } }) => {
		await upsertDriverProfile({ userId: user.id, ...input });
		const profile = await getDriverProfileByUserId(user.id);
		return { profile };
	});
