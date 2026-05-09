import { Link, Text } from "@react-email/components";
import {
	mail_common_openLinkInBrowser,
	mail_emailVerification_body,
	mail_emailVerification_confirmEmail,
} from "@repo/i18n/paraglide/messages.js";
import React from "react";

import PrimaryButton from "../components/PrimaryButton";
import Wrapper from "../components/Wrapper";
import { defaultLocale } from "../lib/translations";
import type { BaseMailProps } from "../types";

export function EmailVerification({
	url,
	locale,
}: {
	url: string;
	name: string;
} & BaseMailProps) {
	const l = { locale };

	return (
		<Wrapper>
			<Text>{mail_emailVerification_body({}, l)}</Text>

			<PrimaryButton href={url}>
				{mail_emailVerification_confirmEmail({}, l)} &rarr;
			</PrimaryButton>

			<Text className="text-sm text-muted-foreground">
				{mail_common_openLinkInBrowser({}, l)}
				<Link href={url} className="break-all">
					{url}
				</Link>
			</Text>
		</Wrapper>
	);
}

EmailVerification.PreviewProps = {
	locale: defaultLocale,
	url: "#",
	name: "John Doe",
};

export default EmailVerification;
