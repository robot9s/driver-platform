import { useTranslations } from "@i18n/intl";
import { toastError, toastSuccess } from "@repo/ui/components/toast";
import { SettingsItem } from "@shared/components/SettingsItem";

import { UserAvatarUpload } from "./UserAvatarUpload";

export function UserAvatarForm() {
	const t = useTranslations();

	return (
		<SettingsItem
			title={t("settings.account.avatar.title")}
			description={t("settings.account.avatar.description")}
		>
			<UserAvatarUpload
				onSuccess={() => {
					toastSuccess(t("settings.account.avatar.notifications.success"));
				}}
				onError={() => {
					toastError(t("settings.account.avatar.notifications.error"));
				}}
			/>
		</SettingsItem>
	);
}
