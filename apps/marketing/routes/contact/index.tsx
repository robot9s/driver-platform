import { ContactForm } from "@home/components/ContactForm";
import {
	marketing_contact_description,
	marketing_contact_title,
} from "@repo/i18n/paraglide/messages.js";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact/")({
	component: ContactPage,
	head: () => ({
		meta: [{ title: String(marketing_contact_title()) }],
	}),
});

function ContactPage() {
	return (
		<div className="max-w-xl py-16 container">
			<div className="mb-12 pt-8 text-center">
				<h1 className="mb-2 font-bold text-5xl">{marketing_contact_title()}</h1>
				<p className="text-lg text-balance opacity-50">{marketing_contact_description()}</p>
			</div>

			<ContactForm />
		</div>
	);
}
