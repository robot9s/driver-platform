import { useTranslations } from "@i18n/intl";
import { Card } from "@repo/ui";
import { Label } from "@repo/ui/components/label";
import { toastError, toastSuccess } from "@repo/ui/components/toast";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";

type NotificationPreferenceField =
	| "emailNewsletter"
	| "emailProductUpdates"
	| "emailAccountSecurity";

export function NotificationPreferencesForm() {
	const t = useTranslations();
	const queryClient = useQueryClient();
	const baseId = useId();

	const { data, isLoading } = useQuery(orpc.notifications.getPreferences.queryOptions());

	const update = useMutation({
		...orpc.notifications.updatePreferences.mutationOptions(),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: orpc.notifications.getPreferences.key(),
			});
			toastSuccess(t("settings.account.notificationPreferences.saved"));
		},
		onError: () => {
			toastError(t("auth.errors.unknown"));
		},
	});

	const onToggle = (field: NotificationPreferenceField) => {
		if (!data || update.isPending) {
			return;
		}
		const next = !data[field];
		void update.mutateAsync({ [field]: next });
	};

	if (isLoading || !data) {
		return (
			<Card className="p-6">
				<p className="text-sm text-muted-foreground">…</p>
			</Card>
		);
	}

	const rows: Array<{
		field: NotificationPreferenceField;
		labelKey: string;
		hintKey?: string;
		controlId: string;
	}> = [
		{
			field: "emailNewsletter",
			labelKey: "settings.account.notificationPreferences.emailNewsletter",
			controlId: `${baseId}-newsletter`,
		},
		{
			field: "emailProductUpdates",
			labelKey: "settings.account.notificationPreferences.emailProductUpdates",
			controlId: `${baseId}-product`,
		},
		{
			field: "emailAccountSecurity",
			labelKey: "settings.account.notificationPreferences.emailAccountSecurity",
			hintKey: "settings.account.notificationPreferences.emailAccountSecurityHint",
			controlId: `${baseId}-security`,
		},
	];

	return (
		<Card className="p-6">
			<div className="mb-4">
				<h3 className="font-medium text-sm">
					{t("settings.account.notificationPreferences.title")}
				</h3>
				<p className="mt-1 text-sm text-muted-foreground">
					{t("settings.account.notificationPreferences.description")}
				</p>
			</div>
			<div className="space-y-4">
				{rows.map((row) => (
					<div
						key={row.controlId}
						className="gap-4 p-3 flex items-start justify-between rounded-lg border"
					>
						<div>
							<Label htmlFor={row.controlId} className="cursor-pointer">
								{t(row.labelKey)}
							</Label>
							{row.hintKey ? (
								<p className="mt-1 text-xs text-muted-foreground">
									{t(row.hintKey)}
								</p>
							) : null}
						</div>
						<input
							id={row.controlId}
							type="checkbox"
							className="mt-0.5 h-4 w-4 rounded border-input"
							checked={Boolean(data[row.field])}
							disabled={update.isPending}
							onChange={() => onToggle(row.field)}
						/>
					</div>
				))}
			</div>
		</Card>
	);
}
