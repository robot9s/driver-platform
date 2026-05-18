import { Link, Text } from "react-email";
import React from "react";

import PrimaryButton from "../components/PrimaryButton";
import Wrapper from "../components/Wrapper";
import { getMailTranslator } from "../lib/i18n";
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
	const t = getMailTranslator(locale);

	return (
		<Wrapper>
			<Text>{t("newUser.body")}</Text>

			<Text>
				{t("common.otp")}
				<br />
				<strong className="font-bold text-2xl">{otp}</strong>
			</Text>

			<Text>{t("common.useLink")}</Text>

			<PrimaryButton href={url}>{t("newUser.confirmEmail")} &rarr;</PrimaryButton>

			<Text className="text-sm text-muted-foreground">
				{t("common.openLinkInBrowser")}
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
