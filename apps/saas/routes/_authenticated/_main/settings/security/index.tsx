import { useTranslations } from "@i18n/intl";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { ActiveSessionsBlock } from "@settings/components/ActiveSessionsBlock";
import { ConnectedAccountsBlock } from "@settings/components/ConnectedAccountsBlock";
import { DeleteAccountForm } from "@settings/components/DeleteAccountForm";
import { PasskeysBlock } from "@settings/components/PasskeysBlock";
import { PasswordAccountSettings } from "@settings/components/PasswordAccountSettings";
import { TwoFactorBlock } from "@settings/components/TwoFactorBlock";
import { SettingsList } from "@shared/components/SettingsList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/settings/security/")({
	component: SettingsSecurityPage,
	head: () => ({ meta: [{ title: "Settings — Security" }] }),
});

function SettingsSecurityPage() {
	const t = useTranslations();

	return (
		<div>
			<h2 className="mb-4 font-semibold text-lg">{t("settings.menu.account.security")}</h2>
			<SettingsList>
				<PasswordAccountSettings />
				<PasskeysBlock />
				<TwoFactorBlock />
				<ConnectedAccountsBlock />
				<ActiveSessionsBlock />
			</SettingsList>

			<Card className="mt-8 border-destructive/40">
				<CardHeader>
					<CardTitle className="text-destructive">
						{t("settings.account.dangerZone.title")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<DeleteAccountForm />
				</CardContent>
			</Card>
		</div>
	);
}
