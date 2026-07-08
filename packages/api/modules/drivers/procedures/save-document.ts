import { createDriverDocument } from "@repo/database";

import { protectedProcedure } from "../../../orpc/procedures";
import { getOwnDriverProfileOrThrow } from "../lib/driver-profile";
import { driverDocumentInputSchema } from "../types";

export const saveDocument = protectedProcedure
	.route({
		method: "POST",
		path: "/drivers/me/documents",
		tags: ["Drivers"],
		summary: "Register an uploaded document",
		description:
			"Persists document metadata after the file has been uploaded via a signed upload URL",
	})
	.input(driverDocumentInputSchema)
	.handler(async ({ input, context: { user } }) => {
		const profile = await getOwnDriverProfileOrThrow(user.id);
		const document = await createDriverDocument({ driverProfileId: profile.id, ...input });
		return { document };
	});
