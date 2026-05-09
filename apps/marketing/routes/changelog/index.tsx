import { ChangelogSection } from "@changelog/components/ChangelogSection";
import {
	marketing_changelog_description,
	marketing_changelog_title,
} from "@repo/i18n/paraglide/messages.js";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/changelog/")({
	component: ChangelogPage,
});

function ChangelogPage() {
	return (
		<div className="max-w-3xl py-16 container">
			<div className="mb-12 pt-8 text-center text-balance">
				<h1 className="mb-2 font-bold text-5xl">{marketing_changelog_title()}</h1>
				<p className="text-lg opacity-50">{marketing_changelog_description()}</p>
			</div>

			<ChangelogSection />
		</div>
	);
}
