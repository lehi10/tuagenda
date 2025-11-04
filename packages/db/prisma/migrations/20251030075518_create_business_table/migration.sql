-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateTable
CREATE TABLE "business" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "domain" VARCHAR(255),
    "description" TEXT,
    "logo" VARCHAR(767),
    "coverImage" VARCHAR(767),
    "timeZone" VARCHAR(255) NOT NULL,
    "locale" VARCHAR(10) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" "BusinessStatus" NOT NULL DEFAULT 'active',
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(63) NOT NULL,
    "website" VARCHAR(255),
    "address" VARCHAR(500) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255),
    "country" VARCHAR(255) NOT NULL,
    "postalCode" VARCHAR(20),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_slug_key" ON "business"("slug");
