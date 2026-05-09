import { logger } from "@repo/logs";

import type {
	CancelSubscription,
	CreateCheckoutLink,
	CreateCustomerPortalLink,
	SetSubscriptionSeats,
	WebhookHandler,
} from "../types";

/**
 * Runtime-selectable payments provider. The concrete implementation is chosen
 * via `PAYMENT_PROVIDER`; every shipped provider exports the same five
 * functions (`createCheckoutLink`, `createCustomerPortalLink`,
 * `setSubscriptionSeats`, `cancelSubscription`, `webhookHandler`).
 *
 * Add a new provider by:
 *   1. Implementing the handlers under `./<name>/index.ts`.
 *   2. Extending the switch in `loadProvider()`.
 *   3. Documenting the required env vars in `.env.local.example`.
 */
interface PaymentProviderModule {
	createCheckoutLink: CreateCheckoutLink;
	createCustomerPortalLink: CreateCustomerPortalLink;
	setSubscriptionSeats: SetSubscriptionSeats;
	cancelSubscription: CancelSubscription;
	webhookHandler: WebhookHandler;
}

const providerName = (process.env.PAYMENT_PROVIDER ?? "stripe").toLowerCase();

async function loadProvider(): Promise<PaymentProviderModule> {
	switch (providerName) {
		case "stripe":
			return import("./stripe");
		case "lemonsqueezy":
			return import("./lemonsqueezy");
		case "polar":
			return import("./polar");
		case "creem":
			return import("./creem");
		case "dodopayments":
			return import("./dodopayments");
		default:
			logger.warn(
				`Unknown PAYMENT_PROVIDER="${providerName}"; falling back to Stripe. Supported ` +
					`values: stripe, lemonsqueezy, polar, creem, dodopayments.`,
			);
			return import("./stripe");
	}
}

let providerPromise: Promise<PaymentProviderModule> | null = null;

function getProvider(): Promise<PaymentProviderModule> {
	providerPromise ??= loadProvider();
	return providerPromise;
}

export const createCheckoutLink: CreateCheckoutLink = async (params) =>
	(await getProvider()).createCheckoutLink(params);

export const createCustomerPortalLink: CreateCustomerPortalLink = async (params) =>
	(await getProvider()).createCustomerPortalLink(params);

export const setSubscriptionSeats: SetSubscriptionSeats = async (params) =>
	(await getProvider()).setSubscriptionSeats(params);

export const cancelSubscription: CancelSubscription = async (id) =>
	(await getProvider()).cancelSubscription(id);

export const webhookHandler: WebhookHandler = async (req) =>
	(await getProvider()).webhookHandler(req);
