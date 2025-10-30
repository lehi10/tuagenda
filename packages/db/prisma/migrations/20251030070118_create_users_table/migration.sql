/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('hidden', 'visible', 'disabled', 'blocked');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('customer', 'provider', 'manager', 'admin');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'visible',
    "type" "UserType" NOT NULL DEFAULT 'customer',
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "birthday" DATE,
    "phone" VARCHAR(63),
    "gender" "Gender" NOT NULL,
    "note" TEXT,
    "description" TEXT,
    "pictureFullPath" VARCHAR(767),
    "timeZone" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
