import { deleteTruck as deleteTruckQuery } from "@repo/database";
import { z } from "zod";

import { protectedProcedure } from "../../../orpc/procedures";
import { getOwnDriverProfileOrThrow } from "../lib/driver-profile";

export const deleteTruck = protectedProcedure
	.route({
		method: "POST",
		path: "/drivers/me/trucks/delete",
		tags: ["Drivers"],
		summary: "Delete a truck listing",
	})
	.input(z.object({ id: z.string() }))
	.handler(async ({ input: { id }, context: { user } }) => {
		const profile = await getOwnDriverProfileOrThrow(user.id);
		await deleteTruckQuery({ id, driverProfileId: profile.id });
		return { ok: true as const };
	});
