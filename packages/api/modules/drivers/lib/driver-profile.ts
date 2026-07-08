import { ORPCError } from "@orpc/server";
import { getDriverProfileByUserId } from "@repo/database";

export async function getOwnDriverProfileOrThrow(userId: string) {
	const profile = await getDriverProfileByUserId(userId);

	if (!profile) {
		throw new ORPCError("NOT_FOUND", {
			message: "Driver profile not found. Create a profile first.",
		});
	}

	return profile;
}
