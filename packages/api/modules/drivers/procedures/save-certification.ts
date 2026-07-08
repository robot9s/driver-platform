import { ORPCError } from "@orpc/server";
import { createDriverCertification, updateDriverCertification } from "@repo/database";

import { protectedProcedure } from "../../../orpc/procedures";
import { getOwnDriverProfileOrThrow } from "../lib/driver-profile";
import { driverCertificationInputSchema } from "../types";

export const saveCertification = protectedProcedure
	.route({
		method: "POST",
		path: "/drivers/me/certifications",
		tags: ["Drivers"],
		summary: "Create or update a certification",
		description:
			"Certifications can carry an uploaded evidence file (storageKey) or be marked as provide_upon_request",
	})
	.input(driverCertificationInputSchema)
	.handler(async ({ input: { id, ...values }, context: { user } }) => {
		const profile = await getOwnDriverProfileOrThrow(user.id);

		if (values.evidenceStatus === "uploaded" && !values.storageKey) {
			throw new ORPCError("BAD_REQUEST", {
				message: "An uploaded certification requires a storageKey",
			});
		}

		const certification = id
			? await updateDriverCertification({ id, driverProfileId: profile.id, ...values })
			: await createDriverCertification({ driverProfileId: profile.id, ...values });

		if (!certification) {
			throw new ORPCError("NOT_FOUND", { message: "Certification not found" });
		}

		return { certification };
	});
