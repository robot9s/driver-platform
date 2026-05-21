import { useOrganizationMemberRoleOptions } from "@organizations/hooks/member-roles";
import type { OrganizationMemberRole } from "@repo/auth";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";

export function OrganizationRoleSelect({
	value,
	onSelect,
	disabled,
}: {
	value?: OrganizationMemberRole;
	onSelect: (value: OrganizationMemberRole) => void;
	disabled?: boolean;
}) {
	const roleOptions = useOrganizationMemberRoleOptions();

	return (
		<Select
			value={value}
			items={roleOptions}
			onValueChange={(v) => {
				if (v === null) {
					return;
				}
				onSelect(v as OrganizationMemberRole);
			}}
			disabled={disabled}
		>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent className="min-w-72">
				{roleOptions.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						<div className="flex flex-col gap-0.5 py-0.5 text-left">
							<span>{option.label}</span>
							<span className="text-foreground/60 text-xs leading-snug">
								{option.description}
							</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
