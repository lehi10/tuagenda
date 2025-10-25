"use client";

import { useTranslation } from "@/i18n";
import { PaymentStats } from "@/features/payments/components/payment-stats";
import { PaymentList } from "@/features/payments/components/payment-list";

export default function PaymentsPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.pages.payments.title}</h1>
        <p className="text-sm text-muted-foreground">
          Track revenue and payment history
        </p>
      </div>
      <PaymentStats />
      <PaymentList />
    </div>
  );
}
