export interface StorageBucketNamesConfig {
	/**
	 * Bucket used for user and organization avatar uploads.
	 */
	avatars: string;
	/**
	 * Bucket for driver certifications, documents and truck photos.
	 * Must stay private — files are only served via short-lived signed URLs.
	 */
	documents: string;
}

export interface StorageConfig {
	/**
	 * Logical storage bucket names used throughout the application.
	 */
	bucketNames: StorageBucketNamesConfig;
}

export type CreateBucketHandler = (
	name: string,
	options?: {
		public?: boolean;
	},
) => Promise<void>;

export type GetSignedUploadUrlHandler = (
	path: string,
	options: {
		bucket: keyof StorageBucketNamesConfig;
	},
) => Promise<string>;

export type GetSignedUrlHander = (
	path: string,
	options: {
		bucket: keyof StorageBucketNamesConfig;
		expiresIn?: number;
	},
) => Promise<string>;
