-- CreateIndex
CREATE INDEX "appointments_start_time_idx" ON "appointments"("start_time");

-- CreateIndex
CREATE INDEX "appointments_business_id_start_time_idx" ON "appointments"("business_id", "start_time");
