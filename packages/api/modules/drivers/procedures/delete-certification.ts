import { deleteDriverCertification } from "@repo/database";
import { z } from "zod";

import { protectedProcedure } from "../../../orpc/procedures";
import { getOwnDriverProfileOrThrow } from "../lib/driver-profile";

export const deleteCertification = protectedProcedure
	.route({
		method: "POST",
		path: "/drivers/me/certifications/delete",
		tags: ["Drivers"],
		summary: "Delete a certification",
	})
	.input(z.object({ id: z.string() }))
	.handler(async ({ input: { id }, context: { user } }) => {
		const profile = await getOwnDriverProfileOrThrow(user.id);
		await deleteDriverCertification({ id, driverProfileId: profile.id });
		return { ok: true as const };
	});
