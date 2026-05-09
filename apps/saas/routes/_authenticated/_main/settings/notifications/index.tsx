import { useTranslations } from "@i18n/intl";
import { NotificationPreferencesForm } from "@settings/components/NotificationPreferencesForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_main/settings/notifications/")({
	component: SettingsNotificationsPage,
	head: () => ({ meta: [{ title: "Settings — Notifications" }] }),
});

function SettingsNotificationsPage() {
	const t = useTranslations();

	return (
		<div>
			<h2 className="mb-4 font-semibold text-lg">
				{t("settings.menu.account.notifications")}
			</h2>
			<NotificationPreferencesForm />
		</div>
	);
}
