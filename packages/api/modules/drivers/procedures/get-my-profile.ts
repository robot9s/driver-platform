import { getDriverProfileByUserId } from "@repo/database";

import { protectedProcedure } from "../../../orpc/procedures";

export const getMyProfile = protectedProcedure
	.route({
		method: "GET",
		path: "/drivers/me",
		tags: ["Drivers"],
		summary: "Get own driver profile",
		description:
			"Returns the caller's driver profile with experiences, certifications, documents and trucks, or null if no profile exists yet",
	})
	.handler(async ({ context: { user } }) => {
		const profile = await getDriverProfileByUserId(user.id);
		return { profile: profile ?? null };
	});
