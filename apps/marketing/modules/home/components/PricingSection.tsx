import { config } from "@config";
import { LocaleLink } from "@i18n/routing";
import {
	marketing_pricing_contactSales,
	marketing_pricing_description,
	marketing_pricing_getStarted,
	marketing_pricing_month,
	marketing_pricing_products_basic_description,
	marketing_pricing_products_basic_features_anotherFeature,
	marketing_pricing_products_basic_features_limitedSupport,
	marketing_pricing_products_basic_title,
	marketing_pricing_products_enterprise_description,
	marketing_pricing_products_enterprise_features_enterpriseSupport,
	marketing_pricing_products_enterprise_features_unlimitedProjects,
	marketing_pricing_products_enterprise_title,
	marketing_pricing_products_free_description,
	marketing_pricing_products_free_features_anotherFeature,
	marketing_pricing_products_free_features_limitedSupport,
	marketing_pricing_products_free_title,
	marketing_pricing_products_lifetime_description,
	marketing_pricing_products_lifetime_features_extendSupport,
	marketing_pricing_products_lifetime_features_noRecurringCosts,
	marketing_pricing_products_lifetime_title,
	marketing_pricing_products_pro_description,
	marketing_pricing_products_pro_features_anotherFeature,
	marketing_pricing_products_pro_features_fiveMembers,
	marketing_pricing_products_pro_features_fullSupport,
	marketing_pricing_products_pro_title,
	marketing_pricing_recommended,
	marketing_pricing_title,
	marketing_pricing_trialPeriod,
	marketing_pricing_year,
	marketing_pricing_monthly,
	marketing_pricing_yearly,
} from "@repo/i18n/paraglide/messages.js";
import { getLocale } from "@repo/i18n/paraglide/runtime";
import { config as paymentsConfig } from "@repo/payments/config";
import type { PaidPlan } from "@repo/payments/types";
import { cn } from "@repo/ui";
import { Button } from "@repo/ui/components/button";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { ArrowRightIcon, BadgePercentIcon, CheckIcon, StarIcon } from "lucide-react";
import { useMemo, useState, type ComponentPropsWithoutRef } from "react";

function productFeatures(planId: string): string[] {
	switch (planId) {
		case "free":
			return [
				marketing_pricing_products_free_features_anotherFeature(),
				marketing_pricing_products_free_features_limitedSupport(),
			];
		case "basic":
			return [
				marketing_pricing_products_basic_features_anotherFeature(),
				marketing_pricing_products_basic_features_limitedSupport(),
			];
		case "pro":
			return [
				marketing_pricing_products_pro_features_anotherFeature(),
				marketing_pricing_products_pro_features_fiveMembers(),
				marketing_pricing_products_pro_features_fullSupport(),
			];
		case "enterprise":
			return [
				marketing_pricing_products_enterprise_features_enterpriseSupport(),
				marketing_pricing_products_enterprise_features_unlimitedProjects(),
			];
		case "lifetime":
			return [
				marketing_pricing_products_lifetime_features_extendSupport(),
				marketing_pricing_products_lifetime_features_noRecurringCosts(),
			];
		default:
			return [];
	}
}

function productTitle(planId: string): string {
	switch (planId) {
		case "free":
			return marketing_pricing_products_free_title();
		case "basic":
			return marketing_pricing_products_basic_title();
		case "pro":
			return marketing_pricing_products_pro_title();
		case "enterprise":
			return marketing_pricing_products_enterprise_title();
		case "lifetime":
			return marketing_pricing_products_lifetime_title();
		default:
			return planId;
	}
}

function productDescription(planId: string): string {
	switch (planId) {
		case "free":
			return marketing_pricing_products_free_description();
		case "basic":
			return marketing_pricing_products_basic_description();
		case "pro":
			return marketing_pricing_products_pro_description();
		case "enterprise":
			return marketing_pricing_products_enterprise_description();
		case "lifetime":
			return marketing_pricing_products_lifetime_description();
		default:
			return "";
	}
}

export function PricingSection() {
	const locale = getLocale();
	const [interval, setBillingInterval] = useState<"month" | "year">("month");

	const signupUrl = useMemo(
		() => config.saasUrl && `${String(config.saasUrl).replace(/\/$/, "")}/signup`,
		[],
	);

	const plans = useMemo(() => {
		const result: Array<{
			id: string;
			title: string;
			description: string;
			features: string[];
			cta: string;
			recommended?: boolean;
			isEnterprise?: boolean;
			prices?: PaidPlan["prices"];
			to: string;
		}> = [];

		if (!paymentsConfig.requireActiveSubscription) {
			result.push({
				id: "free",
				title: marketing_pricing_products_free_title(),
				description: marketing_pricing_products_free_description(),
				features: productFeatures("free"),
				cta: marketing_pricing_getStarted(),
				to: signupUrl ?? "#",
			});
		}

		for (const [planId, plan] of Object.entries(paymentsConfig.plans)) {
			const isEnterprise = "isEnterprise" in plan;
			const prices = "prices" in plan ? (plan as PaidPlan).prices : undefined;

			result.push({
				id: planId,
				title: productTitle(planId),
				description: productDescription(planId),
				features: productFeatures(planId),
				cta: isEnterprise
					? marketing_pricing_contactSales()
					: marketing_pricing_getStarted(),
				recommended: plan.recommended,
				isEnterprise,
				prices,
				to: signupUrl ?? "#",
			});
		}

		return result;
	}, [signupUrl]);

	const hasSubscriptions = plans.some((p) =>
		p.prices?.some((price) => price.type === "subscription"),
	);

	return (
		<section id="pricing" className="scroll-mt-16 py-12 lg:py-16 border-y">
			<div className="container">
				<div className="mb-6 max-w-3xl mx-auto text-center">
					<h1 className="font-medium text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight text-foreground">
						{marketing_pricing_title()}
					</h1>
					<p className="mt-2 text-sm sm:text-lg text-foreground/60">
						{marketing_pricing_description()}
					</p>
				</div>

				<div className="@container">
					{hasSubscriptions && (
						<div className="mb-8 flex justify-center">
							<Tabs
								value={interval}
								onValueChange={(value) =>
									setBillingInterval(value as "month" | "year")
								}
								data-test="price-table-interval-tabs"
							>
								<TabsList className="border-foreground/10">
									<TabsTrigger value="month">
										{marketing_pricing_monthly()}
									</TabsTrigger>
									<TabsTrigger value="year">
										{marketing_pricing_yearly()}
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
					)}
					<div
						className={cn(
							"gap-4 grid grid-cols-1",
							plans.length >= 2 && "@xl:grid-cols-2",
							plans.length >= 3 && "@3xl:grid-cols-3",
							plans.length >= 4 && "@4xl:grid-cols-4",
						)}
					>
						{plans.map((plan) => {
							const isFree = !plan.prices && !plan.isEnterprise;
							const price = isFree
								? undefined
								: plan.prices?.find(
										(p) => p.type === "one-time" || p.interval === interval,
									);
							const trialPeriodDays =
								price && "trialPeriodDays" in price && price.trialPeriodDays
									? price.trialPeriodDays
									: undefined;

							return (
								<div
									key={plan.id}
									className={cn(
										"p-6 relative rounded-3xl border bg-card",
										plan.recommended ? "border-primary" : "border-primary/20",
									)}
									data-test="price-table-plan"
								>
									{plan.recommended && (
										<div className="-top-3 px-2 py-1 font-semibold text-xs absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-primary text-center text-primary-foreground">
											<StarIcon className="mr-1.5 size-3 inline-block" />
											{marketing_pricing_recommended()}
										</div>
									)}
									<div className="gap-4 flex h-full flex-col justify-between">
										<div>
											<h3 className="my-0 font-semibold text-2xl">
												{plan.title}
											</h3>
											{plan.description && (
												<div className="prose mt-2 text-sm text-foreground/60">
													{plan.description}
												</div>
											)}

											{!!plan.features?.length && (
												<ul className="mt-4 gap-2 text-sm grid list-none">
													{plan.features.map((feature, key) => (
														<li
															key={key}
															className="flex items-center justify-start"
														>
															<CheckIcon className="mr-2 size-4 text-primary" />
															<span>{feature}</span>
														</li>
													))}
												</ul>
											)}

											{trialPeriodDays !== undefined &&
												trialPeriodDays > 0 && (
													<div className="mt-4 font-medium text-sm flex items-center justify-start text-primary opacity-80">
														<BadgePercentIcon className="mr-2 size-4" />
														{marketing_pricing_trialPeriod({
															days: String(trialPeriodDays),
														})}
													</div>
												)}
										</div>

										<div>
											{isFree && (
												<strong
													className="font-medium text-2xl lg:text-3xl block"
													data-test="price-table-plan-price"
												>
													{new Intl.NumberFormat(locale, {
														style: "currency",
														currency: "USD",
													}).format(0)}
												</strong>
											)}

											{price && (
												<strong
													className="font-medium text-2xl lg:text-3xl block"
													data-test="price-table-plan-price"
												>
													{new Intl.NumberFormat(locale, {
														style: "currency",
														currency: price.currency,
													}).format(price.amount)}
													{price.type === "subscription" && (
														<span className="font-normal text-xs opacity-60">
															/
															{price.interval === "year"
																? marketing_pricing_year()
																: marketing_pricing_month()}
														</span>
													)}
												</strong>
											)}

											{plan.to.startsWith("/") ? (
												<Button
													className="mt-4 w-full"
													variant={
														plan.recommended ? "primary" : "secondary"
													}
													render={(props) => (
														<LocaleLink
															href={plan.to}
															{...(props as Record<string, unknown>)}
														/>
													)}
												>
													{plan.cta}
													<ArrowRightIcon className="ml-2 size-4" />
												</Button>
											) : (
												<Button
													className="mt-4 w-full"
													variant={
														plan.recommended ? "primary" : "secondary"
													}
													render={(props) => {
														const { children: linkChildren, ...rest } =
															props;
														return (
															<a
																href={plan.to}
																{...(rest as unknown as ComponentPropsWithoutRef<"a">)}
															>
																{linkChildren}
															</a>
														);
													}}
												>
													{plan.cta}
													<ArrowRightIcon className="ml-2 size-4" />
												</Button>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
