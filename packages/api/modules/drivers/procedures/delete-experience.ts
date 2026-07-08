import { deleteDriverExperience } from "@repo/database";
import { z } from "zod";

import { protectedProcedure } from "../../../orpc/procedures";
import { getOwnDriverProfileOrThrow } from "../lib/driver-profile";

export const deleteExperience = protectedProcedure
	.route({
		method: "POST",
		path: "/drivers/me/experiences/delete",
		tags: ["Drivers"],
		summary: "Delete a work experience entry",
	})
	.input(z.object({ id: z.string() }))
	.handler(async ({ input: { id }, context: { user } }) => {
		const profile = await getOwnDriverProfileOrThrow(user.id);
		await deleteDriverExperience({ id, driverProfileId: profile.id });
		return { ok: true as const };
	});
