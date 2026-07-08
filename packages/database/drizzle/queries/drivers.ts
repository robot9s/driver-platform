import { and, eq } from "drizzle-orm";

import { db } from "../client";
import {
	driverCertification,
	driverDocument,
	driverExperience,
	driverProfile,
	truck,
} from "../schema/postgres";

export async function getDriverProfileByUserId(userId: string) {
	return await db.query.driverProfile.findFirst({
		where: (profile, { eq }) => eq(profile.userId, userId),
		with: {
			experiences: true,
			certifications: true,
			documents: true,
			trucks: true,
		},
	});
}

export async function getDriverProfileById(id: string) {
	return await db.query.driverProfile.findFirst({
		where: (profile, { eq }) => eq(profile.id, id),
		with: {
			experiences: true,
			certifications: true,
			documents: true,
			trucks: true,
		},
	});
}

export async function upsertDriverProfile({
	userId,
	...values
}: { userId: string } & Partial<
	Omit<typeof driverProfile.$inferInsert, "id" | "userId" | "createdAt" | "updatedAt">
>) {
	const [profile] = await db
		.insert(driverProfile)
		.values({ userId, ...values })
		.onConflictDoUpdate({
			target: driverProfile.userId,
			set: values,
		})
		.returning();

	return profile;
}

export async function createDriverExperience(
	values: Omit<typeof driverExperience.$inferInsert, "id" | "createdAt" | "updatedAt">,
) {
	const [experience] = await db.insert(driverExperience).values(values).returning();
	return experience;
}

export async function updateDriverExperience({
	id,
	driverProfileId,
	...values
}: { id: string; driverProfileId: string } & Partial<
	Omit<typeof driverExperience.$inferInsert, "id" | "driverProfileId">
>) {
	const [experience] = await db
		.update(driverExperience)
		.set(values)
		.where(and(eq(driverExperience.id, id), eq(driverExperience.driverProfileId, driverProfileId)))
		.returning();
	return experience;
}

export async function deleteDriverExperience({
	id,
	driverProfileId,
}: {
	id: string;
	driverProfileId: string;
}) {
	await db
		.delete(driverExperience)
		.where(and(eq(driverExperience.id, id), eq(driverExperience.driverProfileId, driverProfileId)));
}

export async function createDriverCertification(
	values: Omit<typeof driverCertification.$inferInsert, "id" | "createdAt" | "updatedAt">,
) {
	const [certification] = await db.insert(driverCertification).values(values).returning();
	return certification;
}

export async function updateDriverCertification({
	id,
	driverProfileId,
	...values
}: { id: string; driverProfileId: string } & Partial<
	Omit<typeof driverCertification.$inferInsert, "id" | "driverProfileId">
>) {
	const [certification] = await db
		.update(driverCertification)
		.set(values)
		.where(
			and(eq(driverCertification.id, id), eq(driverCertification.driverProfileId, driverProfileId)),
		)
		.returning();
	return certification;
}

export async function deleteDriverCertification({
	id,
	driverProfileId,
}: {
	id: string;
	driverProfileId: string;
}) {
	await db
		.delete(driverCertification)
		.where(
			and(eq(driverCertification.id, id), eq(driverCertification.driverProfileId, driverProfileId)),
		);
}

export async function createDriverDocument(
	values: Omit<typeof driverDocument.$inferInsert, "id" | "createdAt">,
) {
	const [document] = await db.insert(driverDocument).values(values).returning();
	return document;
}

export async function deleteDriverDocument({
	id,
	driverProfileId,
}: {
	id: string;
	driverProfileId: string;
}) {
	await db
		.delete(driverDocument)
		.where(and(eq(driverDocument.id, id), eq(driverDocument.driverProfileId, driverProfileId)));
}

export async function createTruck(
	values: Omit<typeof truck.$inferInsert, "id" | "createdAt" | "updatedAt">,
) {
	const [createdTruck] = await db.insert(truck).values(values).returning();
	return createdTruck;
}

export async function updateTruck({
	id,
	driverProfileId,
	...values
}: { id: string; driverProfileId: string } & Partial<
	Omit<typeof truck.$inferInsert, "id" | "driverProfileId">
>) {
	const [updatedTruck] = await db
		.update(truck)
		.set(values)
		.where(and(eq(truck.id, id), eq(truck.driverProfileId, driverProfileId)))
		.returning();
	return updatedTruck;
}

export async function deleteTruck({
	id,
	driverProfileId,
}: {
	id: string;
	driverProfileId: string;
}) {
	await db.delete(truck).where(and(eq(truck.id, id), eq(truck.driverProfileId, driverProfileId)));
}
