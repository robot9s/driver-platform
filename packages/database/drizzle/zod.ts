import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import {
	account,
	driverCertification,
	driverDocument,
	driverExperience,
	driverProfile,
	invitation,
	member,
	notification,
	organization,
	passkey,
	purchase,
	session,
	truck,
	user,
	userNotificationPreference,
	userNotificationPreferences,
	verification,
} from "./schema";

export const UserSchema = createSelectSchema(user);
export const UserUpdateSchema = createUpdateSchema(user, {
	id: z.string(),
});
export const OrganizationSchema = createSelectSchema(organization);
export const OrganizationUpdateSchema = createUpdateSchema(organization, {
	id: z.string(),
});
export const MemberSchema = createSelectSchema(member);
export const InvitationSchema = createSelectSchema(invitation);
export const PurchaseSchema = createSelectSchema(purchase);
export type Purchase = typeof purchase.$inferSelect;
export const PurchaseInsertSchema = createInsertSchema(purchase);
export const PurchaseUpdateSchema = createUpdateSchema(purchase, {
	id: z.string(),
});
export const SessionSchema = createSelectSchema(session);
export const AccountSchema = createSelectSchema(account);
export const VerificationSchema = createSelectSchema(verification);
export const PasskeySchema = createSelectSchema(passkey);
export const NotificationSchema = createSelectSchema(notification);
export const UserNotificationPreferenceSchema = createSelectSchema(userNotificationPreference);
export const UserNotificationPreferencesSchema = createSelectSchema(userNotificationPreferences);

export const DriverProfileSchema = createSelectSchema(driverProfile);
export type DriverProfile = typeof driverProfile.$inferSelect;
export const DriverProfileInsertSchema = createInsertSchema(driverProfile);
export const DriverProfileUpdateSchema = createUpdateSchema(driverProfile, {
	id: z.string(),
});
export const DriverExperienceSchema = createSelectSchema(driverExperience);
export type DriverExperience = typeof driverExperience.$inferSelect;
export const DriverCertificationSchema = createSelectSchema(driverCertification);
export type DriverCertification = typeof driverCertification.$inferSelect;
export const DriverDocumentSchema = createSelectSchema(driverDocument);
export type DriverDocument = typeof driverDocument.$inferSelect;
export const TruckSchema = createSelectSchema(truck);
export type Truck = typeof truck.$inferSelect;
