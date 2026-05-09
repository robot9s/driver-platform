import { LocaleLink } from "@i18n/routing";
import {
	marketing_notFound_code,
	marketing_notFound_goToHomepage,
	marketing_notFound_title,
} from "@repo/i18n/paraglide/messages.js";
import { Button } from "@repo/ui";
import { ArrowLeftIcon } from "lucide-react";

export function NotFoundPage() {
	return (
		<div className="flex h-full min-h-[calc(100vh-16rem)] flex-col items-center justify-center">
			<h1 className="font-bold text-5xl">{marketing_notFound_code()}</h1>
			<p className="mt-2 text-2xl">{marketing_notFound_title()}</p>

			<Button className="mt-4" render={(props) => <LocaleLink href="/" {...props} />}>
				<ArrowLeftIcon className="mr-2 size-4" /> {marketing_notFound_goToHomepage()}
			</Button>
		</div>
	);
}
