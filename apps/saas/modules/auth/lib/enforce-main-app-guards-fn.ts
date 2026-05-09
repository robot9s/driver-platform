import { listPurchases as listPurchasesProcedure } from "@repo/api/modules/payments/procedures/list-purchases";
import { auth } from "@repo/auth";
import { config as authConfig } from "@repo/auth/config";
import { config as paymentsConfig } from "@repo/payments/config";
import { createPurchasesHelper } from "@repo/payments/lib/helper";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const enforceMainAppGuardsFn = createServerFn({ method: "GET" }).handler(async () => {
	const session = await auth.api.getSession({
		headers: getRequestHeaders(),
	});

	if (!session) {
		throw redirect({ href: "/login" });
	}

	if (authConfig.users.enableOnboarding && !session.user.onboardingComplete) {
		throw redirect({ href: "/onboarding" });
	}

	const organizations = await auth.api.listOrganizations({
		headers: getRequestHeaders(),
	});

	if (authConfig.organizations.enable && authConfig.organizations.requireOrganization) {
		const organization =
			organizations.find((org) => org.id === session.session.activeOrganizationId) ||
			organizations[0];

		if (!organization) {
			throw redirect({ href: "/new-organization" });
		}
	}

	if (paymentsConfig.requireActiveSubscription) {
		const organizationId = authConfig.organizations.enable
			? session.session.activeOrganizationId || organizations?.at(0)?.id
			: undefined;

		const purchases = await listPurchasesProcedure.callable({
			context: { headers: getRequestHeaders() },
		})({
			organizationId,
		});

		const { activePlan } = createPurchasesHelper(purchases);

		if (!activePlan) {
			throw redirect({ href: "/choose-plan" });
		}
	}
});
