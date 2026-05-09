import { LoginForm } from "@auth/components/LoginForm";
import { AuthWrapper } from "@shared/components/AuthWrapper";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login/")({
	component: LoginPage,
	head: () => ({
		meta: [{ title: "Login" }],
	}),
});

function LoginPage() {
	return (
		<AuthWrapper>
			<LoginForm />
		</AuthWrapper>
	);
}
