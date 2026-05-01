-- DropIndex
DROP INDEX "public"."appointments_start_time_idx";

-- CreateIndex
CREATE INDEX "appointments_business_id_start_time_status_idx" ON "appointments"("business_id", "start_time", "status");
