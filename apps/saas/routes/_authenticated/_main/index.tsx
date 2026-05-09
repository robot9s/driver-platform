import {
	loadOrganizationListForRouteFn,
	loadSessionForRouteFn,
} from "@auth/lib/auth-route-loaders";
import { useTranslations } from "@i18n/intl";
import { OrganizationsGrid } from "@organizations/components/OrganizationsGrid";
import { config as authConfig } from "@repo/auth/config";
import { Card } from "@repo/ui";
import { PageHeader } from "@shared/components/PageHeader";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/")({
	loader: async () => {
		const session = await loadSessionForRouteFn();

		if (!session) {
			throw redirect({ href: "/login" });
		}

		const organizations = await loadOrganizationListForRouteFn();

		if (authConfig.organizations.enable && authConfig.organizations.requireOrganization) {
			const organization =
				organizations.find((org) => org.id === session.session.activeOrganizationId) ||
				organizations[0];

			if (!organization) {
				throw redirect({ href: "/new-organization" });
			}

			throw redirect({ href: `/${organization.slug}` });
		}

		return { session };
	},
	component: DashboardHome,
});

function DashboardHome() {
	const { session } = Route.useLoaderData();
	const t = useTranslations();

	return (
		<div className="">
			<PageHeader
				title={t("start.welcome", { name: session?.user.name })}
				subtitle={t("start.subtitle")}
			/>

			<div>
				{authConfig.organizations.enable && <OrganizationsGrid />}

				<Card className="mt-6">
					<div className="h-64 p-8 flex items-center justify-center text-foreground/60">
						Place your content here...
					</div>
				</Card>
			</div>
		</div>
	);
}
