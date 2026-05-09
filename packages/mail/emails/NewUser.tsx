import { Link, Text } from "@react-email/components";
import {
	mail_common_openLinkInBrowser,
	mail_common_otp,
	mail_common_useLink,
	mail_newUser_body,
	mail_newUser_confirmEmail,
} from "@repo/i18n/paraglide/messages.js";
import React from "react";

import PrimaryButton from "../components/PrimaryButton";
import Wrapper from "../components/Wrapper";
import { defaultLocale } from "../lib/translations";
import type { BaseMailProps } from "../types";

export function NewUser({
	url,
	otp,
	locale,
}: {
	url: string;
	name: string;
	otp: string;
} & BaseMailProps) {
	const l = { locale };

	return (
		<Wrapper>
			<Text>{mail_newUser_body({}, l)}</Text>

			<Text>
				{mail_common_otp({}, l)}
				<br />
				<strong className="font-bold text-2xl">{otp}</strong>
			</Text>

			<Text>{mail_common_useLink({}, l)}</Text>

			<PrimaryButton href={url}>{mail_newUser_confirmEmail({}, l)} &rarr;</PrimaryButton>

			<Text className="text-sm text-muted-foreground">
				{mail_common_openLinkInBrowser({}, l)}
				<Link href={url}>{url}</Link>
			</Text>
		</Wrapper>
	);
}

NewUser.PreviewProps = {
	locale: defaultLocale,
	url: "#",
	name: "John Doe",
	otp: "123456",
};

export default NewUser;
