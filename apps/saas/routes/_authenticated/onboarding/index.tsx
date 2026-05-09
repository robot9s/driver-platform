import { OnboardingForm } from "@onboarding/components/OnboardingForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/onboarding/")({
	component: OnboardingPage,
	head: () => ({
		meta: [{ title: "Onboarding" }],
	}),
});

function OnboardingPage() {
	return <OnboardingForm />;
}
