import { SessionProvider } from "@auth/components/SessionProvider";
import {
	loadActiveOrganizationForRouteFn,
	loadSessionForRouteFn,
} from "@auth/lib/auth-route-loaders";
import { ActiveOrganizationProvider } from "@organizations/components/ActiveOrganizationProvider";
import { ConfirmationAlertProvider } from "@shared/components/ConfirmationAlertProvider";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	loader: async () => {
		const session = await loadSessionForRouteFn();
		if (!session) {
			throw redirect({ href: "/login" });
		}
		const activeOrganization = session.session.activeOrganizationId
			? await loadActiveOrganizationForRouteFn({
					data: session.session.activeOrganizationId,
				})
			: null;

		return { activeOrganization, session };
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const { activeOrganization, session } = Route.useLoaderData();

	return (
		<SessionProvider initialSession={session}>
			<ActiveOrganizationProvider initialActiveOrganization={activeOrganization}>
				<ConfirmationAlertProvider>
					<Outlet />
				</ConfirmationAlertProvider>
			</ActiveOrganizationProvider>
		</SessionProvider>
	);
}
