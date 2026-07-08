import { createId as cuid } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const purchaseTypeEnum = pgEnum("PurchaseType", ["SUBSCRIPTION", "ONE_TIME"]);

export const notificationTypeEnum = pgEnum("NotificationType", ["WELCOME", "APP_UPDATE"]);

export const notificationTargetEnum = pgEnum("NotificationTarget", ["IN_APP", "EMAIL"]);

export const user = pgTable("user", {
	id: text("id")
		.$defaultFn(() => cuid())
		.primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	role: text("role"),
	banned: boolean("banned").default(false),
	banReason: text("banReason"),
	banExpires: timestamp("banExpires"),
	twoFactorEnabled: boolean("twoFactorEnabled").default(false),
	onboardingComplete: boolean("onboardingComplete"),
	paymentsCustomerId: text("paymentsCustomerId"),
	locale: text("locale"),
	lastActiveOrganizationId: text("lastActiveOrganizationId"),
	userType: text("userType"),
});

export const session = pgTable(
	"session",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		expiresAt: timestamp("expiresAt").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ipAddress"),
		userAgent: text("userAgent"),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		impersonatedBy: text("impersonatedBy"),
		activeOrganizationId: text("activeOrganizationId"),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		accountId: text("accountId").notNull(),
		providerId: text("providerId").notNull(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("accessToken"),
		refreshToken: text("refreshToken"),
		idToken: text("idToken"),
		accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
		refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expiresAt").notNull(),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const passkey = pgTable(
	"passkey",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		name: text("name"),
		publicKey: text("publicKey").notNull(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		credentialID: text("credentialID").notNull(),
		counter: integer("counter").notNull(),
		deviceType: text("deviceType").notNull(),
		backedUp: boolean("backedUp").notNull(),
		transports: text("transports"),
		createdAt: timestamp("createdAt"),
		aaguid: text("aaguid"),
	},
	(table) => [
		index("passkey_userId_idx").on(table.userId),
		index("passkey_credentialID_idx").on(table.credentialID),
	],
);

export const organization = pgTable(
	"organization",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		logo: text("logo"),
		createdAt: timestamp("createdAt").notNull(),
		metadata: text("metadata"),
		paymentsCustomerId: text("paymentsCustomerId"),
	},
	(table) => [uniqueIndex("organization_slug_uidx").on(table.slug)],
);

export const member = pgTable(
	"member",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: text("role").default("member").notNull(),
		createdAt: timestamp("createdAt").notNull(),
	},
	(table) => [
		uniqueIndex("member_user_org_idx").on(table.userId, table.organizationId),
		index("member_organizationId_idx").on(table.organizationId),
		index("member_userId_idx").on(table.userId),
	],
);

export const invitation = pgTable(
	"invitation",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		organizationId: text("organizationId")
			.notNull()
			.references(() => organization.id, { onDelete: "cascade" }),
		email: text("email").notNull(),
		role: text("role"),
		status: text("status").default("pending").notNull(),
		expiresAt: timestamp("expiresAt").notNull(),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		inviterId: text("inviterId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [
		index("invitation_organizationId_idx").on(table.organizationId),
		index("invitation_email_idx").on(table.email),
	],
);

export const twoFactor = pgTable(
	"twoFactor",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		secret: text("secret").notNull(),
		backupCodes: text("backupCodes").notNull(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [
		index("twoFactor_secret_idx").on(table.secret),
		index("twoFactor_userId_idx").on(table.userId),
	],
);

export const purchase = pgTable("purchase", {
	id: text("id")
		.$defaultFn(() => cuid())
		.primaryKey(),
	organizationId: text("organizationId").references(() => organization.id, {
		onDelete: "cascade",
	}),
	userId: text("userId").references(() => user.id, {
		onDelete: "cascade",
	}),
	type: purchaseTypeEnum("type").notNull(),
	customerId: text("customerId").notNull(),
	subscriptionId: text("subscriptionId").unique(),
	priceId: text("priceId").notNull(),
	status: text("status"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt"),
});

export const notification = pgTable(
	"notification",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: text("type").notNull(),
		title: text("title").notNull(),
		body: text("body").notNull(),
		link: text("link"),
		readAt: timestamp("readAt"),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
	},
	(table) => [
		index("notification_userId_idx").on(table.userId),
		index("notification_userId_readAt_idx").on(table.userId, table.readAt),
	],
);

export const userNotificationPreference = pgTable(
	"user_notification_preference",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: notificationTypeEnum("type").notNull(),
		target: notificationTargetEnum("target").notNull(),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
	},
	(table) => [
		index("user_notification_preference_userId_idx").on(table.userId),
		uniqueIndex("user_notification_preference_user_type_target_uidx").on(
			table.userId,
			table.type,
			table.target,
		),
	],
);

export const userNotificationPreferences = pgTable("user_notification_preferences", {
	userId: text("userId")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	emailNewsletter: boolean("emailNewsletter").default(true).notNull(),
	emailProductUpdates: boolean("emailProductUpdates").default(true).notNull(),
	emailAccountSecurity: boolean("emailAccountSecurity").default(true).notNull(),
	updatedAt: timestamp("updatedAt")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const driverProfile = pgTable(
	"driver_profile",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		headline: text("headline"),
		bio: text("bio"),
		aiSummary: text("aiSummary"),
		yearsExperience: integer("yearsExperience"),
		licenceClass: text("licenceClass").default("class_1").notNull(),
		licenceProvince: text("licenceProvince"),
		homeCity: text("homeCity"),
		homeProvince: text("homeProvince"),
		regions: text("regions").array().default([]).notNull(),
		haulPreferences: text("haulPreferences").array().default([]).notNull(),
		employmentPreference: text("employmentPreference"),
		availabilityStatus: text("availabilityStatus").default("open").notNull(),
		crossBorder: boolean("crossBorder").default(false).notNull(),
		visibility: text("visibility").default("active").notNull(),
		verificationStatus: text("verificationStatus").default("unverified").notNull(),
		profileCompleteness: integer("profileCompleteness").default(0).notNull(),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		uniqueIndex("driver_profile_userId_uidx").on(table.userId),
		index("driver_profile_homeProvince_idx").on(table.homeProvince),
		index("driver_profile_availabilityStatus_idx").on(table.availabilityStatus),
		index("driver_profile_visibility_idx").on(table.visibility),
	],
);

export const driverExperience = pgTable(
	"driver_experience",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		driverProfileId: text("driverProfileId")
			.notNull()
			.references(() => driverProfile.id, { onDelete: "cascade" }),
		employer: text("employer").notNull(),
		role: text("role"),
		startedAt: timestamp("startedAt"),
		endedAt: timestamp("endedAt"),
		equipment: text("equipment").array().default([]).notNull(),
		freightTypes: text("freightTypes").array().default([]).notNull(),
		crossBorderPercent: integer("crossBorderPercent"),
		description: text("description"),
		aiTags: text("aiTags").array().default([]).notNull(),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("driver_experience_driverProfileId_idx").on(table.driverProfileId)],
);

export const driverCertification = pgTable(
	"driver_certification",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		driverProfileId: text("driverProfileId")
			.notNull()
			.references(() => driverProfile.id, { onDelete: "cascade" }),
		type: text("type").notNull(),
		otherLabel: text("otherLabel"),
		issuingAuthority: text("issuingAuthority"),
		province: text("province"),
		certificateNumber: text("certificateNumber"),
		issuedAt: timestamp("issuedAt"),
		expiresAt: timestamp("expiresAt"),
		evidenceStatus: text("evidenceStatus").default("provide_upon_request").notNull(),
		storageKey: text("storageKey"),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index("driver_certification_driverProfileId_idx").on(table.driverProfileId),
		index("driver_certification_type_idx").on(table.type),
		index("driver_certification_expiresAt_idx").on(table.expiresAt),
	],
);

export const driverDocument = pgTable(
	"driver_document",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		driverProfileId: text("driverProfileId")
			.notNull()
			.references(() => driverProfile.id, { onDelete: "cascade" }),
		type: text("type").notNull(),
		label: text("label"),
		storageKey: text("storageKey").notNull(),
		mimeType: text("mimeType"),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
	},
	(table) => [index("driver_document_driverProfileId_idx").on(table.driverProfileId)],
);

export const truck = pgTable(
	"truck",
	{
		id: text("id")
			.$defaultFn(() => cuid())
			.primaryKey(),
		driverProfileId: text("driverProfileId")
			.notNull()
			.references(() => driverProfile.id, { onDelete: "cascade" }),
		make: text("make"),
		model: text("model"),
		year: integer("year"),
		truckType: text("truckType"),
		trailerTypes: text("trailerTypes").array().default([]).notNull(),
		photoKeys: text("photoKeys").array().default([]).notNull(),
		lastSafetyInspectionAt: timestamp("lastSafetyInspectionAt"),
		notes: text("notes"),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("truck_driverProfileId_idx").on(table.driverProfileId)],
);

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const passkeyRelations = relations(passkey, ({ one }) => ({
	user: one(user, {
		fields: [passkey.userId],
		references: [user.id],
	}),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
	members: many(member),
	invitations: many(invitation),

	purchases: many(purchase),
}));

export const memberRelations = relations(member, ({ one }) => ({
	organization: one(organization, {
		fields: [member.organizationId],
		references: [organization.id],
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id],
	}),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
	organization: one(organization, {
		fields: [invitation.organizationId],
		references: [organization.id],
	}),
	user: one(user, {
		fields: [invitation.inviterId],
		references: [user.id],
	}),
}));

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
	user: one(user, {
		fields: [twoFactor.userId],
		references: [user.id],
	}),
}));

export const purchaseRelations = relations(purchase, ({ one }) => ({
	organization: one(organization, {
		fields: [purchase.organizationId],
		references: [organization.id],
	}),
	user: one(user, {
		fields: [purchase.userId],
		references: [user.id],
	}),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
	user: one(user, {
		fields: [notification.userId],
		references: [user.id],
	}),
}));

export const userNotificationPreferencesRelations = relations(
	userNotificationPreferences,
	({ one }) => ({
		user: one(user, {
			fields: [userNotificationPreferences.userId],
			references: [user.id],
		}),
	}),
);

export const userNotificationPreferenceRelations = relations(
	userNotificationPreference,
	({ one }) => ({
		user: one(user, {
			fields: [userNotificationPreference.userId],
			references: [user.id],
		}),
	}),
);

export const driverProfileRelations = relations(driverProfile, ({ one, many }) => ({
	user: one(user, {
		fields: [driverProfile.userId],
		references: [user.id],
	}),
	experiences: many(driverExperience),
	certifications: many(driverCertification),
	documents: many(driverDocument),
	trucks: many(truck),
}));

export const driverExperienceRelations = relations(driverExperience, ({ one }) => ({
	driverProfile: one(driverProfile, {
		fields: [driverExperience.driverProfileId],
		references: [driverProfile.id],
	}),
}));

export const driverCertificationRelations = relations(driverCertification, ({ one }) => ({
	driverProfile: one(driverProfile, {
		fields: [driverCertification.driverProfileId],
		references: [driverProfile.id],
	}),
}));

export const driverDocumentRelations = relations(driverDocument, ({ one }) => ({
	driverProfile: one(driverProfile, {
		fields: [driverDocument.driverProfileId],
		references: [driverProfile.id],
	}),
}));

export const truckRelations = relations(truck, ({ one }) => ({
	driverProfile: one(driverProfile, {
		fields: [truck.driverProfileId],
		references: [driverProfile.id],
	}),
}));
