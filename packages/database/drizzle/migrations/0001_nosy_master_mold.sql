ALTER TABLE "user" ADD COLUMN "lastActiveOrganizationId" text;--> statement-breakpoint
CREATE UNIQUE INDEX "member_user_org_idx" ON "member" USING btree ("userId","organizationId");