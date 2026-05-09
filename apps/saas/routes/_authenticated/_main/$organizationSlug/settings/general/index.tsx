import { useTranslations } from "@i18n/intl";
import { ChangeOrganizationNameForm } from "@organizations/components/ChangeOrganizationNameForm";
import { DeleteOrganizationForm } from "@organizations/components/DeleteOrganizationForm";
import { OrganizationLogoForm } from "@organizations/components/OrganizationLogoForm";
import { useActiveOrganization } from "@organizations/hooks/use-active-organization";
import { config as authConfig } from "@repo/auth/config";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { SettingsList } from "@shared/components/SettingsList";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/$organizationSlug/settings/general/")({
	beforeLoad: () => {
		if (!authConfig.organizations.enable) {
			throw redirect({ to: "/" });
		}
	},
	component: OrgSettingsGeneralPage,
	head: () => ({ meta: [{ title: "Organization — General" }] }),
});

function OrgSettingsGeneralPage() {
	const t = useTranslations();
	const { activeOrganization, loaded } = useActiveOrganization();

	if (!loaded) {
		return <p className="text-sm text-muted-foreground">…</p>;
	}

	if (!activeOrganization) {
		return <p className="text-sm text-destructive">Could not load organization.</p>;
	}

	return (
		<div>
			<h2 className="mb-4 font-semibold text-lg">
				{t("settings.menu.organization.general")}
			</h2>
			<SettingsList>
				<OrganizationLogoForm />
				<ChangeOrganizationNameForm />
			</SettingsList>
			<Card className="mt-8 border-destructive/40">
				<CardHeader>
					<CardTitle className="text-destructive">
						{t("organizations.settings.dangerZone.title")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<DeleteOrganizationForm />
				</CardContent>
			</Card>
		</div>
	);
}
