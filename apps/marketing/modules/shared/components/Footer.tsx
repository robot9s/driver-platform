import { config } from "@config";
import { LocaleLink } from "@i18n/routing";
import {
	marketing_common_footer_blog,
	marketing_common_footer_builtWith,
	marketing_common_footer_features,
	marketing_common_footer_pricing,
	marketing_common_footer_privacyPolicy,
	marketing_common_footer_termsAndConditions,
} from "@repo/i18n/paraglide/messages.js";
import { Logo } from "@repo/ui";

export function Footer() {
	return (
		<footer className="py-8 text-sm border-t text-foreground/60">
			<div className="gap-6 lg:grid-cols-3 container grid grid-cols-1">
				<div>
					<Logo className="opacity-70 grayscale" />
					<p className="mt-3 text-sm opacity-70">
						© {new Date().getFullYear()} {config.appName}.{" "}
						<a href="https://supastarter.dev">{marketing_common_footer_builtWith()}</a>.
					</p>
				</div>

				<div className="gap-2 flex flex-col">
					<LocaleLink href="/blog" className="block">
						{marketing_common_footer_blog()}
					</LocaleLink>

					<a href="#features" className="block">
						{marketing_common_footer_features()}
					</a>

					<a href="/#pricing" className="block">
						{marketing_common_footer_pricing()}
					</a>
				</div>

				<div className="gap-2 flex flex-col">
					<LocaleLink href="/legal/privacy-policy" className="block">
						{marketing_common_footer_privacyPolicy()}
					</LocaleLink>

					<LocaleLink href="/legal/terms" className="block">
						{marketing_common_footer_termsAndConditions()}
					</LocaleLink>
				</div>
			</div>
		</footer>
	);
}
