-- AlterTable
ALTER TABLE "services" ADD COLUMN     "is_virtual" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requires_online_payment" BOOLEAN NOT NULL DEFAULT false;
