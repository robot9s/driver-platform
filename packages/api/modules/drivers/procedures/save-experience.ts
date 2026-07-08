import { ORPCError } from "@orpc/server";
import { createDriverExperience, updateDriverExperience } from "@repo/database";

import { protectedProcedure } from "../../../orpc/procedures";
import { getOwnDriverProfileOrThrow } from "../lib/driver-profile";
import { driverExperienceInputSchema } from "../types";

export const saveExperience = protectedProcedure
	.route({
		method: "POST",
		path: "/drivers/me/experiences",
		tags: ["Drivers"],
		summary: "Create or update a work experience entry",
	})
	.input(driverExperienceInputSchema)
	.handler(async ({ input: { id, ...values }, context: { user } }) => {
		const profile = await getOwnDriverProfileOrThrow(user.id);

		const experience = id
			? await updateDriverExperience({ id, driverProfileId: profile.id, ...values })
			: await createDriverExperience({ driverProfileId: profile.id, ...values });

		if (!experience) {
			throw new ORPCError("NOT_FOUND", { message: "Experience entry not found" });
		}

		return { experience };
	});
