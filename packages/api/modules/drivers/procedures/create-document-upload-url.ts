import { getSignedUploadUrl } from "@repo/storage";
import { nanoid } from "nanoid";
import { z } from "zod";

import { protectedProcedure } from "../../../orpc/procedures";

const ALLOWED_EXTENSIONS = ["pdf", "png", "jpg", "jpeg", "webp"] as const;

export const createDocumentUploadUrl = protectedProcedure
	.route({
		method: "POST",
		path: "/drivers/me/document-upload-url",
		tags: ["Drivers"],
		summary: "Create document upload URL",
		description:
			"Create a signed upload URL for a certification, document or truck photo. Files are stored in the private documents bucket, scoped to the caller",
	})
	.input(
		z.object({
			extension: z.enum(ALLOWED_EXTENSIONS),
		}),
	)
	.handler(async ({ input: { extension }, context: { user } }) => {
		const path = `${user.id}/${nanoid()}.${extension}`;
		const signedUploadUrl = await getSignedUploadUrl(path, {
			bucket: "documents",
		});

		return { signedUploadUrl, path };
	});
