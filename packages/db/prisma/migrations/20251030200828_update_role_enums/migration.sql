-- AlterEnum: Update UserType enum
-- Remove: provider, manager
-- Keep: customer, admin
-- Add: superadmin

-- Update existing data first (change 'provider' and 'manager' to 'admin')
UPDATE "users" SET "type" = 'admin' WHERE "type" IN ('provider', 'manager');

-- Create new enum without old values
CREATE TYPE "UserType_new" AS ENUM ('customer', 'admin', 'superadmin');

-- Alter table to use new enum
ALTER TABLE "users" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "users"
  ALTER COLUMN "type" TYPE "UserType_new"
  USING ("type"::text::"UserType_new");
ALTER TABLE "users" ALTER COLUMN "type" SET DEFAULT 'customer';

-- Drop old enum and rename new one
DROP TYPE "UserType";
ALTER TYPE "UserType_new" RENAME TO "UserType";


-- AlterEnum: Update BusinessRole enum
-- Remove: SUPERADMIN, ADMIN, GUEST
-- Keep: EMPLOYEE
-- Add: MANAGER

-- Map old roles to new ones:
-- SUPERADMIN -> MANAGER
-- ADMIN -> MANAGER
-- GUEST -> Delete first (customers shouldn't be in business_users)
DELETE FROM "business_users" WHERE "role"::text = 'GUEST';

-- Create new enum
CREATE TYPE "BusinessRole_new" AS ENUM ('MANAGER', 'EMPLOYEE');

-- Alter table to use new enum with mapping
ALTER TABLE "business_users"
  ALTER COLUMN "role" TYPE "BusinessRole_new"
  USING (
    CASE
      WHEN "role"::text IN ('SUPERADMIN', 'ADMIN') THEN 'MANAGER'
      ELSE 'EMPLOYEE'
    END
  )::"BusinessRole_new";

-- Drop old enum and rename new one
DROP TYPE "BusinessRole";
ALTER TYPE "BusinessRole_new" RENAME TO "BusinessRole";
