import type { StorageConfig } from "./types";

export const config = {
	bucketNames: {
		avatars: process.env.VITE_AVATARS_BUCKET_NAME ?? "avatars",
		documents: process.env.VITE_DOCUMENTS_BUCKET_NAME ?? "documents",
	},
} as const satisfies StorageConfig;
