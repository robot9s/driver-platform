import { ORPCError } from "@orpc/server";
import { createTruck, updateTruck } from "@repo/database";

import { protectedProcedure } from "../../../orpc/procedures";
import { getOwnDriverProfileOrThrow } from "../lib/driver-profile";
import { truckInputSchema } from "../types";

export const saveTruck = protectedProcedure
	.route({
		method: "POST",
		path: "/drivers/me/trucks",
		tags: ["Drivers"],
		summary: "Create or update a truck listing (owner-operators)",
	})
	.input(truckInputSchema)
	.handler(async ({ input: { id, ...values }, context: { user } }) => {
		const profile = await getOwnDriverProfileOrThrow(user.id);

		const savedTruck = id
			? await updateTruck({ id, driverProfileId: profile.id, ...values })
			: await createTruck({ driverProfileId: profile.id, ...values });

		if (!savedTruck) {
			throw new ORPCError("NOT_FOUND", { message: "Truck not found" });
		}

		return { truck: savedTruck };
	});
