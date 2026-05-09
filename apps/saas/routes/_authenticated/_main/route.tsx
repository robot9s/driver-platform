import { enforceMainAppGuardsFn } from "@auth/lib/enforce-main-app-guards-fn";
import { AppWrapper } from "@shared/components/AppWrapper";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main")({
	loader: async () => {
		await enforceMainAppGuardsFn();
		return {};
	},
	component: MainLayout,
});

function MainLayout() {
	return (
		<AppWrapper>
			<Outlet />
		</AppWrapper>
	);
}
