-- CreateTable
CREATE TABLE "casbin_rule" (
    "id" SERIAL NOT NULL,
    "ptype" VARCHAR(100) NOT NULL,
    "v0" VARCHAR(100),
    "v1" VARCHAR(100),
    "v2" VARCHAR(100),
    "v3" VARCHAR(100),
    "v4" VARCHAR(100),
    "v5" VARCHAR(100),

    CONSTRAINT "casbin_rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "casbin_rule_ptype_idx" ON "casbin_rule"("ptype");

-- CreateIndex
CREATE INDEX "casbin_rule_v0_v1_idx" ON "casbin_rule"("v0", "v1");
