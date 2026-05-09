import { auth } from "@repo/auth";
import { getInvitationById } from "@repo/database";
import { getRequestHeaders } from "@tanstack/react-start/server";

export async function getSession() {
	const session = await auth.api.getSession({
		headers: getRequestHeaders(),
		query: {
			disableCookieCache: true,
		},
	});

	return session;
}

export async function getActiveOrganization(slug: string) {
	try {
		const activeOrganization = await auth.api.getFullOrganization({
			query: {
				organizationSlug: slug,
			},
			headers: getRequestHeaders(),
		});

		return activeOrganization;
	} catch {
		return null;
	}
}

export async function getOrganizationList() {
	try {
		const organizationList = await auth.api.listOrganizations({
			headers: getRequestHeaders(),
		});

		return organizationList;
	} catch {
		return [];
	}
}

export async function getUserAccounts() {
	try {
		const userAccounts = await auth.api.listUserAccounts({
			headers: getRequestHeaders(),
		});

		return userAccounts;
	} catch {
		return [];
	}
}

export async function getUserPasskeys() {
	try {
		const userPasskeys = await auth.api.listPasskeys({
			headers: getRequestHeaders(),
		});

		return userPasskeys;
	} catch {
		return [];
	}
}

export async function getInvitation(id: string) {
	try {
		return await getInvitationById(id);
	} catch {
		return null;
	}
}
