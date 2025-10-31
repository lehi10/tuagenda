-- CreateEnum
CREATE TYPE "BusinessRole" AS ENUM ('SUPERADMIN', 'ADMIN', 'EMPLOYEE', 'GUEST');

-- CreateTable
CREATE TABLE "business_users" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "business_id" INTEGER NOT NULL,
    "role" "BusinessRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_users_user_id_business_id_key" ON "business_users"("user_id", "business_id");

-- AddForeignKey
ALTER TABLE "business_users" ADD CONSTRAINT "business_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_users" ADD CONSTRAINT "business_users_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
