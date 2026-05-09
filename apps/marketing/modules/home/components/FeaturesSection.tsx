import {
	marketing_home_features_badge,
	marketing_home_features_description,
	marketing_home_features_feature1_benefit1_description,
	marketing_home_features_feature1_benefit1_title,
	marketing_home_features_feature1_benefit2_description,
	marketing_home_features_feature1_benefit2_title,
	marketing_home_features_feature1_benefit3_description,
	marketing_home_features_feature1_benefit3_title,
	marketing_home_features_feature1_description,
	marketing_home_features_feature1_subtitle,
	marketing_home_features_feature1_title,
	marketing_home_features_feature2_benefit1_description,
	marketing_home_features_feature2_benefit1_title,
	marketing_home_features_feature2_benefit2_description,
	marketing_home_features_feature2_benefit2_title,
	marketing_home_features_feature2_benefit3_description,
	marketing_home_features_feature2_benefit3_title,
	marketing_home_features_feature2_description,
	marketing_home_features_feature2_subtitle,
	marketing_home_features_feature2_title,
	marketing_home_features_title,
} from "@repo/i18n/paraglide/messages.js";
import { cn } from "@repo/ui";
import { CloudIcon, ComputerIcon, SmartphoneIcon, StarIcon, WandIcon } from "lucide-react";
import type { JSXElementConstructor, ReactNode } from "react";

interface FeatureTab {
	id: string;
	title: string;
	icon: JSXElementConstructor<{
		className?: string;
		width?: string;
		height?: string;
	}>;
	subtitle?: string;
	description?: ReactNode;
	image?: string;
	imageBorder?: boolean;
	stack?: {
		title: string;
		href: string;
		icon: JSXElementConstructor<any>;
	}[];
	highlights?: {
		title: string;
		description: string;
		icon: JSXElementConstructor<any>;
		demoLink?: string;
		docsUrl?: string;
	}[];
}

export function FeaturesSection() {
	const featureTabs: FeatureTab[] = [
		{
			id: "feature1",
			title: marketing_home_features_feature1_title(),
			icon: StarIcon,
			subtitle: marketing_home_features_feature1_subtitle(),
			description: marketing_home_features_feature1_description(),
			stack: [],
			image: "https://placehold.co/1280x720/EAF2FC/3875C8.png",
			imageBorder: false,
			highlights: [
				{
					title: marketing_home_features_feature1_benefit1_title(),
					description: marketing_home_features_feature1_benefit1_description(),
					icon: WandIcon,
				},
				{
					title: marketing_home_features_feature1_benefit2_title(),
					description: marketing_home_features_feature1_benefit2_description(),
					icon: ComputerIcon,
				},
				{
					title: marketing_home_features_feature1_benefit3_title(),
					description: marketing_home_features_feature1_benefit3_description(),
					icon: SmartphoneIcon,
				},
			],
		},
		{
			id: "feature2",
			title: marketing_home_features_feature2_title(),
			icon: CloudIcon,
			subtitle: marketing_home_features_feature2_subtitle(),
			description: marketing_home_features_feature2_description(),
			stack: [],
			image: "https://placehold.co/1280x720/F0F6FD/2D5FA3.png",
			imageBorder: false,
			highlights: [
				{
					title: marketing_home_features_feature2_benefit1_title(),
					description: marketing_home_features_feature2_benefit1_description(),
					icon: WandIcon,
				},
				{
					title: marketing_home_features_feature2_benefit2_title(),
					description: marketing_home_features_feature2_benefit2_description(),
					icon: ComputerIcon,
				},
				{
					title: marketing_home_features_feature2_benefit3_title(),
					description: marketing_home_features_feature2_benefit3_description(),
					icon: SmartphoneIcon,
				},
			],
		},
	];

	return (
		<section id="features" className="scroll-my-20 py-12 lg:py-16">
			<div className="container">
				<div className="mb-6 lg:mb-0 max-w-3xl mx-auto text-center">
					<small className="font-medium text-xs tracking-wider mb-4 block text-primary uppercase">
						{marketing_home_features_badge()}
					</small>
					<h2 className="text-3xl lg:text-4xl xl:text-5xl font-medium">
						{marketing_home_features_title()}
					</h2>
					<p className="mt-2 text-base lg:text-lg text-balance text-foreground/60">
						{marketing_home_features_description()}
					</p>
				</div>
			</div>

			<div>
				<div className="mt-8 lg:mt-12 gap-8 container grid grid-cols-1">
					{featureTabs.map((tab, index) => {
						const filteredStack = tab.stack || [];
						const filteredHighlights = tab.highlights || [];
						const isReversed = index % 2 === 1;
						return (
							<div
								key={tab.id}
								className="p-6 md:p-8 lg:p-12 rounded-4xl border bg-card"
							>
								<div className="gap-8 md:grid-cols-2 grid grid-cols-1 items-center">
									<div
										className={cn("flex justify-center", {
											"md:order-2": isReversed,
										})}
									>
										{tab.image && (
											<div className="max-w-xl w-full">
												<img
													src={tab.image}
													alt={tab.title}
													width={1280}
													height={720}
													className={cn(
														"aspect-video h-auto w-full rounded-xl object-cover",
														{
															"border-4": tab.imageBorder,
														},
													)}
												/>
											</div>
										)}
									</div>

									<div
										className={cn({
											"md:order-1": isReversed,
										})}
									>
										<h3 className="font-normal text-lg leading-tight md:text-xl lg:text-2xl text-foreground">
											<span className="font-medium">{tab.title}. </span>
											<span className="font-sans">{tab.subtitle}</span>
										</h3>

										{tab.description && (
											<p className="mt-4 text-foreground/60">
												{tab.description}
											</p>
										)}

										{filteredStack?.length > 0 && (
											<div className="mt-4 gap-6 flex flex-wrap">
												{filteredStack.map((tool, k) => (
													<a
														href={tool.href}
														target="_blank"
														key={`stack-tool-${k}`}
														className="gap-2 flex items-center"
														rel="noreferrer"
													>
														<tool.icon className="size-6" />
														<strong className="text-sm block">
															{tool.title}
														</strong>
													</a>
												))}
											</div>
										)}
									</div>
								</div>

								{filteredHighlights.length > 0 && (
									<div className="mt-8 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:mt-12 grid">
										{filteredHighlights.map((highlight, k) => (
											<div
												key={`highlight-${k}`}
												className="p-4 lg:p-6 flex flex-col items-stretch justify-between rounded-2xl bg-background"
											>
												<div>
													<highlight.icon
														className="text-xl text-primary"
														width="1em"
														height="1em"
													/>
													<strong className="mt-2 font-medium text-lg block">
														{highlight.title}
													</strong>
													<p className="mt-1 text-sm">
														{highlight.description}
													</p>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
