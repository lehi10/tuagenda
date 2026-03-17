-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('hidden', 'visible', 'disabled', 'blocked');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('customer', 'admin', 'superadmin');

-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "BusinessRole" AS ENUM ('MANAGER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "business" (
    "id" UUID NOT NULL,
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

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'visible',
    "type" "UserType" NOT NULL DEFAULT 'customer',
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "birthday" DATE,
    "phone" VARCHAR(63),
    "countryCode" VARCHAR(10),
    "note" TEXT,
    "description" TEXT,
    "pictureFullPath" TEXT,
    "timeZone" VARCHAR(255),
    "is_guest" BOOLEAN NOT NULL DEFAULT false,
    "guest_created_at" TIMESTAMP(3),
    "converted_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_users" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "business_id" UUID NOT NULL,
    "role" "BusinessRole" NOT NULL,
    "display_name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_categories" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "category_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_services" (
    "business_user_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_services_pkey" PRIMARY KEY ("business_user_id","service_id")
);

-- CreateTable
CREATE TABLE "employee_availabilities" (
    "id" UUID NOT NULL,
    "business_user_id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "day_of_week" SMALLINT NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_exceptions" (
    "id" UUID NOT NULL,
    "business_user_id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "is_all_day" BOOLEAN NOT NULL DEFAULT true,
    "start_time" TIME,
    "end_time" TIME,
    "is_available" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_exceptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" UUID NOT NULL,
    "customer_id" TEXT,
    "provider_business_user_id" UUID,
    "business_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_group" BOOLEAN NOT NULL DEFAULT false,
    "capacity" INTEGER,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_slug_key" ON "business"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "business_users_user_id_business_id_key" ON "business_users"("user_id", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_users_id_business_id_key" ON "business_users"("id", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_categories_business_id_name_key" ON "service_categories"("business_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "services_id_business_id_key" ON "services"("id", "business_id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_availabilities_business_user_id_day_of_week_start__key" ON "employee_availabilities"("business_user_id", "day_of_week", "start_time");

-- CreateIndex
CREATE INDEX "employee_exceptions_business_user_id_date_idx" ON "employee_exceptions"("business_user_id", "date");

-- CreateIndex
CREATE INDEX "appointments_business_id_idx" ON "appointments"("business_id");

-- CreateIndex
CREATE INDEX "appointments_service_id_idx" ON "appointments"("service_id");

-- CreateIndex
CREATE INDEX "appointments_customer_id_idx" ON "appointments"("customer_id");

-- CreateIndex
CREATE INDEX "appointments_provider_business_user_id_idx" ON "appointments"("provider_business_user_id");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- AddForeignKey
ALTER TABLE "business_users" ADD CONSTRAINT "business_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_users" ADD CONSTRAINT "business_users_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_categories" ADD CONSTRAINT "service_categories_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_services" ADD CONSTRAINT "employee_services_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_services" ADD CONSTRAINT "employee_services_business_user_id_business_id_fkey" FOREIGN KEY ("business_user_id", "business_id") REFERENCES "business_users"("id", "business_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_services" ADD CONSTRAINT "employee_services_service_id_business_id_fkey" FOREIGN KEY ("service_id", "business_id") REFERENCES "services"("id", "business_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_availabilities" ADD CONSTRAINT "employee_availabilities_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_availabilities" ADD CONSTRAINT "employee_availabilities_business_user_id_business_id_fkey" FOREIGN KEY ("business_user_id", "business_id") REFERENCES "business_users"("id", "business_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_exceptions" ADD CONSTRAINT "employee_exceptions_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_exceptions" ADD CONSTRAINT "employee_exceptions_business_user_id_business_id_fkey" FOREIGN KEY ("business_user_id", "business_id") REFERENCES "business_users"("id", "business_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_provider_business_user_id_business_id_fkey" FOREIGN KEY ("provider_business_user_id", "business_id") REFERENCES "business_users"("id", "business_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_business_id_fkey" FOREIGN KEY ("service_id", "business_id") REFERENCES "services"("id", "business_id") ON DELETE RESTRICT ON UPDATE CASCADE;
