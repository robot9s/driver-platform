import { auth } from "@repo/auth";
import { logger } from "@repo/logs";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

/**
 * Server-fn used by route guards to check whether the request carries a valid
 * session. Relies on Better Auth's short-lived cookie cache so that navigating
 * between protected pages doesn't hit the DB on every click. Flows that need
 * an authoritative read after a write should call `authClient.getSession({
 * query: { disableCookieCache: true } })` via `reloadSession()` instead.
 */
export const loadSessionForRouteFn = createServerFn({ method: "GET" }).handler(async () => {
	return await auth.api.getSession({
		headers: getRequestHeaders(),
	});
});

export const loadOrganizationListForRouteFn = createServerFn({ method: "GET" }).handler(
	async () => {
		try {
			return await auth.api.listOrganizations({
				headers: getRequestHeaders(),
			});
		} catch (error) {
			logger.error(error);
			throw error;
		}
	},
);

export const loadActiveOrganizationForRouteFn = createServerFn({ method: "GET" })
	.inputValidator((organizationId: string) => organizationId)
	.handler(async ({ data: organizationId }) => {
		try {
			return await auth.api.getFullOrganization({
				query: {
					organizationId,
				},
				headers: getRequestHeaders(),
			});
		} catch (error) {
			logger.error(error);
			return null;
		}
	});
