import { Link, Text } from "@react-email/components";
import {
	mail_common_openLinkInBrowser,
	mail_forgotPassword_body,
	mail_forgotPassword_resetPassword,
} from "@repo/i18n/paraglide/messages.js";
import React from "react";

import PrimaryButton from "../components/PrimaryButton";
import Wrapper from "../components/Wrapper";
import { defaultLocale } from "../lib/translations";
import type { BaseMailProps } from "../types";

export function ForgotPassword({
	url,
	locale,
}: {
	url: string;
	name: string;
} & BaseMailProps) {
	const l = { locale };

	return (
		<Wrapper>
			<Text>{mail_forgotPassword_body({}, l)}</Text>

			<PrimaryButton href={url}>
				{mail_forgotPassword_resetPassword({}, l)} &rarr;
			</PrimaryButton>

			<Text className="text-sm text-muted-foreground">
				{mail_common_openLinkInBrowser({}, l)}
				<Link href={url}>{url}</Link>
			</Text>
		</Wrapper>
	);
}

ForgotPassword.PreviewProps = {
	locale: defaultLocale,
	url: "#",
	name: "John Doe",
};

export default ForgotPassword;
