import { CreateOrganizationForm } from "@organizations/components/CreateOrganizationForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/new-organization/")({
	component: NewOrganizationPage,
	head: () => ({
		meta: [{ title: "New organization" }],
	}),
});

function NewOrganizationPage() {
	return (
		<div className="max-w-lg p-6 mx-auto">
			<CreateOrganizationForm />
		</div>
	);
}
