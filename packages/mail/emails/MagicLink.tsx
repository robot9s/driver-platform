import { Link, Text } from "@react-email/components";
import {
	mail_common_openLinkInBrowser,
	mail_common_useLink,
	mail_magicLink_body,
	mail_magicLink_login,
} from "@repo/i18n/paraglide/messages.js";
import React from "react";

import PrimaryButton from "../components/PrimaryButton";
import Wrapper from "../components/Wrapper";
import { defaultLocale } from "../lib/translations";
import type { BaseMailProps } from "../types";

export function MagicLink({
	url,
	locale,
}: {
	url: string;
} & BaseMailProps) {
	const l = { locale };

	return (
		<Wrapper>
			<Text>{mail_magicLink_body({}, l)}</Text>

			<Text>{mail_common_useLink({}, l)}</Text>

			<PrimaryButton href={url}>{mail_magicLink_login({}, l)} &rarr;</PrimaryButton>

			<Text className="text-sm text-muted-foreground">
				{mail_common_openLinkInBrowser({}, l)}
				<Link href={url}>{url}</Link>
			</Text>
		</Wrapper>
	);
}

MagicLink.PreviewProps = {
	locale: defaultLocale,
	url: "#",
};

export default MagicLink;
