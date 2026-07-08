import { z } from "zod";

export const CERTIFICATION_TYPES = [
	"class1_licence",
	"air_brake_z",
	"melt_completion",
	"tdg",
	"whmis",
	"lcv_permit",
	"tanker_experience",
	"fast_card",
	"passport",
	"twic",
	"forklift",
	"crane",
	"first_aid",
	"other",
] as const;
export type CertificationType = (typeof CERTIFICATION_TYPES)[number];

export const CERTIFICATION_EVIDENCE_STATUSES = [
	"uploaded",
	"provide_upon_request",
	"verified",
	"expired",
] as const;
export type CertificationEvidenceStatus = (typeof CERTIFICATION_EVIDENCE_STATUSES)[number];

export const DRIVER_DOCUMENT_TYPES = [
	"resume",
	"drivers_abstract",
	"commercial_abstract",
	"cvor_abstract",
	"criminal_record_check",
	"reference_letter",
	"other",
] as const;
export type DriverDocumentType = (typeof DRIVER_DOCUMENT_TYPES)[number];

export const HAUL_TYPES = ["long_haul", "regional", "local", "cross_border_us"] as const;

export const EMPLOYMENT_PREFERENCES = [
	"company_driver",
	"owner_operator",
	"lease_operator",
] as const;

export const AVAILABILITY_STATUSES = ["open", "employed_open", "not_looking"] as const;

export const PROFILE_VISIBILITIES = ["active", "hidden"] as const;

export const TRUCK_TYPES = ["day_cab", "sleeper", "straight_truck", "other"] as const;

export const TRAILER_TYPES = [
	"dry_van",
	"reefer",
	"flatbed",
	"step_deck",
	"tanker",
	"super_b",
	"lowboy",
	"dump",
	"car_hauler",
	"container",
	"other",
] as const;

export const CA_PROVINCES = [
	"AB",
	"BC",
	"MB",
	"NB",
	"NL",
	"NS",
	"NT",
	"NU",
	"ON",
	"PE",
	"QC",
	"SK",
	"YT",
] as const;

export const driverProfileInputSchema = z.object({
	headline: z.string().max(120).optional(),
	bio: z.string().max(5000).optional(),
	yearsExperience: z.number().int().min(0).max(60).optional(),
	licenceClass: z.string().max(20).optional(),
	licenceProvince: z.enum(CA_PROVINCES).optional(),
	homeCity: z.string().max(100).optional(),
	homeProvince: z.enum(CA_PROVINCES).optional(),
	regions: z.array(z.string().max(100)).max(20).optional(),
	haulPreferences: z.array(z.enum(HAUL_TYPES)).optional(),
	employmentPreference: z.enum(EMPLOYMENT_PREFERENCES).optional(),
	availabilityStatus: z.enum(AVAILABILITY_STATUSES).optional(),
	crossBorder: z.boolean().optional(),
	visibility: z.enum(PROFILE_VISIBILITIES).optional(),
});
export type DriverProfileInput = z.infer<typeof driverProfileInputSchema>;

export const driverExperienceInputSchema = z.object({
	id: z.string().optional(),
	employer: z.string().min(1).max(200),
	role: z.string().max(200).optional(),
	startedAt: z.coerce.date().optional(),
	endedAt: z.coerce.date().nullable().optional(),
	equipment: z.array(z.string().max(100)).max(20).optional(),
	freightTypes: z.array(z.string().max(100)).max(20).optional(),
	crossBorderPercent: z.number().int().min(0).max(100).optional(),
	description: z.string().max(5000).optional(),
});
export type DriverExperienceInput = z.infer<typeof driverExperienceInputSchema>;

export const driverCertificationInputSchema = z.object({
	id: z.string().optional(),
	type: z.enum(CERTIFICATION_TYPES),
	otherLabel: z.string().max(200).optional(),
	issuingAuthority: z.string().max(200).optional(),
	province: z.enum(CA_PROVINCES).optional(),
	certificateNumber: z.string().max(100).optional(),
	issuedAt: z.coerce.date().optional(),
	expiresAt: z.coerce.date().optional(),
	evidenceStatus: z.enum(CERTIFICATION_EVIDENCE_STATUSES).default("provide_upon_request"),
	storageKey: z.string().max(500).optional(),
});
export type DriverCertificationInput = z.infer<typeof driverCertificationInputSchema>;

export const driverDocumentInputSchema = z.object({
	type: z.enum(DRIVER_DOCUMENT_TYPES),
	label: z.string().max(200).optional(),
	storageKey: z.string().min(1).max(500),
	mimeType: z.string().max(100).optional(),
});
export type DriverDocumentInput = z.infer<typeof driverDocumentInputSchema>;

export const truckInputSchema = z.object({
	id: z.string().optional(),
	make: z.string().max(100).optional(),
	model: z.string().max(100).optional(),
	year: z.number().int().min(1950).max(2100).optional(),
	truckType: z.enum(TRUCK_TYPES).optional(),
	trailerTypes: z.array(z.enum(TRAILER_TYPES)).optional(),
	photoKeys: z.array(z.string().max(500)).max(10).optional(),
	lastSafetyInspectionAt: z.coerce.date().optional(),
	notes: z.string().max(2000).optional(),
});
export type TruckInput = z.infer<typeof truckInputSchema>;
