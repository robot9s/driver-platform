import { Heading, Link, Text } from "@react-email/components";
import {
	mail_common_openLinkInBrowser,
	mail_organizationInvitation_body,
	mail_organizationInvitation_headline,
	mail_organizationInvitation_join,
} from "@repo/i18n/paraglide/messages.js";
import React from "react";

import PrimaryButton from "../components/PrimaryButton";
import Wrapper from "../components/Wrapper";
import { defaultLocale } from "../lib/translations";
import type { BaseMailProps } from "../types";

export function OrganizationInvitation({
	url,
	organizationName,
	locale,
}: {
	url: string;
	organizationName: string;
} & BaseMailProps) {
	const l = { locale };

	return (
		<Wrapper>
			<Heading className="text-xl">
				{mail_organizationInvitation_headline({ organizationName }, l)}
			</Heading>
			<Text>{mail_organizationInvitation_body({ organizationName }, l)}</Text>

			<PrimaryButton href={url}>{mail_organizationInvitation_join({}, l)}</PrimaryButton>

			<Text className="mt-4 text-sm text-muted-foreground">
				{mail_common_openLinkInBrowser({}, l)}
				<Link href={url}>{url}</Link>
			</Text>
		</Wrapper>
	);
}

OrganizationInvitation.PreviewProps = {
	locale: defaultLocale,
	url: "#",
	organizationName: "Acme",
};

export default OrganizationInvitation;
