import { deleteDriverDocument } from "@repo/database";
import { z } from "zod";

import { protectedProcedure } from "../../../orpc/procedures";
import { getOwnDriverProfileOrThrow } from "../lib/driver-profile";

export const deleteDocument = protectedProcedure
	.route({
		method: "POST",
		path: "/drivers/me/documents/delete",
		tags: ["Drivers"],
		summary: "Delete a document",
	})
	.input(z.object({ id: z.string() }))
	.handler(async ({ input: { id }, context: { user } }) => {
		const profile = await getOwnDriverProfileOrThrow(user.id);
		await deleteDriverDocument({ id, driverProfileId: profile.id });
		return { ok: true as const };
	});
