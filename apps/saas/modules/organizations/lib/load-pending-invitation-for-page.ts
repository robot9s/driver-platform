import { getInvitationById } from "@repo/database";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const loadPendingInvitationForPageFn = createServerFn({ method: "GET" })
	.inputValidator((invitationId: string) => invitationId)
	.handler(async ({ data: invitationId }) => {
		const record = await getInvitationById(invitationId);

		if (!record || record.status !== "pending" || !record.organization) {
			throw notFound();
		}

		return {
			invitationId: record.id,
			organizationName: record.organization.name,
			organizationSlug: record.organization.slug,
			logoUrl: record.organization.logo ?? undefined,
		} as const;
	});
