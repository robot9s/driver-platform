import { and, count, eq, isNull } from "drizzle-orm";

import { db } from "../client";
import { notification, userNotificationPreferences } from "../schema/postgres";

const defaultPreferences = {
	emailNewsletter: true,
	emailProductUpdates: true,
	emailAccountSecurity: true,
} as const;

export async function listNotificationsByUserId(userId: string, limit: number) {
	return db.query.notification.findMany({
		where: (n, { eq: eqFn }) => eqFn(n.userId, userId),
		orderBy: (n, { desc: descFn }) => [descFn(n.createdAt)],
		limit,
	});
}

export async function getUnreadNotificationCountByUserId(userId: string) {
	const [row] = await db
		.select({ c: count() })
		.from(notification)
		.where(and(eq(notification.userId, userId), isNull(notification.readAt)));
	return Number(row?.c ?? 0);
}

export async function markNotificationAsReadById(notificationId: string, userId: string) {
	const [updated] = await db
		.update(notification)
		.set({ readAt: new Date() })
		.where(and(eq(notification.id, notificationId), eq(notification.userId, userId)))
		.returning({ id: notification.id });
	return updated ?? null;
}

export async function markAllNotificationsAsReadForUser(userId: string) {
	await db
		.update(notification)
		.set({ readAt: new Date() })
		.where(and(eq(notification.userId, userId), isNull(notification.readAt)));
}

export async function getUserNotificationPreferences(userId: string) {
	const row = await db.query.userNotificationPreferences.findFirst({
		where: (p, { eq: eqFn }) => eqFn(p.userId, userId),
	});
	if (row) {
		return {
			emailNewsletter: row.emailNewsletter,
			emailProductUpdates: row.emailProductUpdates,
			emailAccountSecurity: row.emailAccountSecurity,
		};
	}
	return { ...defaultPreferences };
}

type PreferencesUpdate = {
	emailNewsletter?: boolean;
	emailProductUpdates?: boolean;
	emailAccountSecurity?: boolean;
};

export async function upsertUserNotificationPreferences(userId: string, patch: PreferencesUpdate) {
	const existing = await db.query.userNotificationPreferences.findFirst({
		where: (p, { eq: eqFn }) => eqFn(p.userId, userId),
	});
	const next = {
		emailNewsletter:
			patch.emailNewsletter ??
			existing?.emailNewsletter ??
			defaultPreferences.emailNewsletter,
		emailProductUpdates:
			patch.emailProductUpdates ??
			existing?.emailProductUpdates ??
			defaultPreferences.emailProductUpdates,
		emailAccountSecurity:
			patch.emailAccountSecurity ??
			existing?.emailAccountSecurity ??
			defaultPreferences.emailAccountSecurity,
	};

	if (existing) {
		await db
			.update(userNotificationPreferences)
			.set({
				...next,
				updatedAt: new Date(),
			})
			.where(eq(userNotificationPreferences.userId, userId));
	} else {
		await db.insert(userNotificationPreferences).values({
			userId,
			...next,
		});
	}

	return next;
}

/**
 * Inserts an in-app notification for a user. Call from API procedures, webhooks, or jobs
 * when something should appear in the notification center (`link` should be an in-app path
 * like `/settings` or `/my-org/settings/general` when the item is clickable).
 */
export async function createNotificationForUser({
	userId,
	type,
	title,
	body,
	link,
}: {
	userId: string;
	type: string;
	title: string;
	body: string;
	link?: string | null;
}) {
	const [row] = await db
		.insert(notification)
		.values({
			userId,
			type,
			title,
			body,
			link: link ?? null,
		})
		.returning();
	return row;
}
