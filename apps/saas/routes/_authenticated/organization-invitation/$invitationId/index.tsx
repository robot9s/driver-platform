import { OrganizationInvitationModal } from "@organizations/components/OrganizationInvitationModal";
import { loadPendingInvitationForPageFn } from "@organizations/lib/load-pending-invitation-for-page";
import { Card, CardContent } from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/organization-invitation/$invitationId/")({
	loader: async ({ params }) => {
		return loadPendingInvitationForPageFn({ data: params.invitationId });
	},
	component: OrganizationInvitationPage,
	head: () => ({ meta: [{ title: "Organization invitation" }] }),
});

function OrganizationInvitationPage() {
	const data = Route.useLoaderData();

	return (
		<div className="max-w-md p-6 mx-auto">
			<Card>
				<CardContent className="p-6">
					<OrganizationInvitationModal
						invitationId={data.invitationId}
						organizationName={data.organizationName}
						organizationSlug={data.organizationSlug}
						logoUrl={data.logoUrl}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
