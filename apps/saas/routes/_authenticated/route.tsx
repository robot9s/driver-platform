import { loadSessionForRouteFn } from "@auth/lib/auth-route-loaders";
import { ActiveOrganizationProvider } from "@organizations/components/ActiveOrganizationProvider";
import { ConfirmationAlertProvider } from "@shared/components/ConfirmationAlertProvider";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const session = await loadSessionForRouteFn();
		if (!session) {
			throw redirect({ to: "/login" });
		}
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return (
		<ActiveOrganizationProvider>
			<ConfirmationAlertProvider>
				<Outlet />
			</ConfirmationAlertProvider>
		</ActiveOrganizationProvider>
	);
}
