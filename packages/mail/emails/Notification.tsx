import { Link, Text } from "@react-email/components";
import {
	mail_common_openLinkInBrowser,
	mail_notification_openInApp,
	mail_notification_view,
} from "@repo/i18n/paraglide/messages.js";
import React from "react";

import PrimaryButton from "../components/PrimaryButton";
import Wrapper from "../components/Wrapper";
import { defaultLocale } from "../lib/translations";
import type { BaseMailProps } from "../types";

export function Notification({
	title,
	message,
	link,
	locale,
}: {
	title: string;
	message?: string;
	link?: string;
} & BaseMailProps) {
	const l = { locale };

	return (
		<Wrapper>
			<Text className="font-semibold text-lg">{title}</Text>
			{message ? <Text>{message}</Text> : null}
			{link ? (
				<>
					<Text>{mail_notification_openInApp({}, l)}</Text>
					<PrimaryButton href={link}>
						{mail_notification_view({}, l)} &rarr;
					</PrimaryButton>
					<Text className="text-sm text-muted-foreground">
						{mail_common_openLinkInBrowser({}, l)}
						<br />
						<Link href={link}>{link}</Link>
					</Text>
				</>
			) : null}
		</Wrapper>
	);
}

Notification.PreviewProps = {
	locale: defaultLocale,
	title: "Example",
	message: "This is a notification email.",
	link: "https://example.com",
};

export default Notification;
