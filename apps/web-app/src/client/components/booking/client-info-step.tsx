"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/client/components/ui/tabs";
import { useTranslation } from "@/client/i18n";
import { useClientInfoStep } from "@/client/components/booking/client-info/use-client-info-step";
import { AuthenticatedUserCard } from "@/client/components/booking/client-info/authenticated-user-card";
import { GuestForm } from "@/client/components/booking/client-info/guest-form";
import { LoginForm } from "@/client/components/booking/client-info/login-form";
import type { ClientInfoData } from "@/client/components/booking/client-info/use-client-info-step";

interface ClientInfoStepProps {
  onContinue: (data: ClientInfoData) => void;
  initialData?: ClientInfoData;
}

export function ClientInfoStep({
  onContinue,
  initialData,
}: ClientInfoStepProps) {
  const { t } = useTranslation();
  const {
    user,
    authLoading,
    formData,
    updateField,
    isSubmitting,
    error,
    activeTab,
    setActiveTab,
    submitForm,
    handleFormSubmit,
    handleSocialLogin,
  } = useClientInfoStep(onContinue, initialData);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {t.booking.contact.loading}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          {t.booking.contact.almostReady}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">
          {t.booking.contact.title}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t.booking.contact.description}
        </p>
      </div>

      {user ? (
        <AuthenticatedUserCard
          user={user}
          isSubmitting={isSubmitting}
          onContinue={submitForm}
        />
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "guest" | "login")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-11 rounded-xl">
            <TabsTrigger value="guest" className="rounded-lg font-semibold">
              {t.booking.contact.guestTab}
            </TabsTrigger>
            <TabsTrigger value="login" className="rounded-lg font-semibold">
              {t.booking.contact.loginTab}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guest" className="space-y-4">
            <GuestForm
              formData={formData}
              error={error}
              isSubmitting={isSubmitting}
              onFieldChange={updateField}
              onSubmit={handleFormSubmit}
            />
          </TabsContent>

          <TabsContent value="login" className="space-y-4">
            <LoginForm
              formData={formData}
              error={error}
              isSubmitting={isSubmitting}
              onFieldChange={updateField}
              onSubmit={handleFormSubmit}
              onSocialLogin={handleSocialLogin}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
