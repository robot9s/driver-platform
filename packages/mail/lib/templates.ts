import { render } from "@react-email/render";
import type { Locale } from "@repo/i18n";
import {
	mail_emailVerification_subject,
	mail_forgotPassword_subject,
	mail_magicLink_subject,
	mail_newUser_subject,
	mail_organizationInvitation_subject,
} from "@repo/i18n/paraglide/messages.js";
import type { ReactElement } from "react";

import { mailTemplates } from "../emails";

const mailSubjects = {
	emailVerification: mail_emailVerification_subject,
	forgotPassword: mail_forgotPassword_subject,
	magicLink: mail_magicLink_subject,
	newUser: mail_newUser_subject,
	organizationInvitation: mail_organizationInvitation_subject,
} as const;

export type TemplateId = keyof typeof mailTemplates;

export async function getTemplate<T extends TemplateId>({
	templateId,
	context,
	locale,
}: {
	templateId: T;
	context: Omit<Parameters<(typeof mailTemplates)[T]>[0], "locale">;
	locale: Locale;
}) {
	const template = mailTemplates[templateId];
	const templateProps = { ...context, locale };
	const email = (template as (props: typeof templateProps) => ReactElement)(templateProps);

	const subject = mailSubjects[templateId]({}, { locale });

	const html = await render(email);
	const text = await render(email, { plainText: true });
	return { html, text, subject };
}
