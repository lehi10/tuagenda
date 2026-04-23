"use client";

import { useState, useEffect } from "react";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Checkbox } from "@/client/components/ui/checkbox";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/client/components/ui/tabs";
import { useTranslation } from "@/client/i18n";
import { useAuth } from "@/client/contexts";
import { useTrpc } from "@/client/lib/trpc";

interface ClientInfoStepProps {
  onContinue: (_data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password?: string;
    createAccount: boolean;
    userId?: string;
  }) => void;
}

export function ClientInfoStep({ onContinue }: ClientInfoStepProps) {
  const { t } = useTranslation();
  const {
    user,
    loading: authLoading,
    signUp,
    signIn,
    signInWithGoogle,
    refreshUser,
  } = useAuth();
  const createGuestMutation = useTrpc.user.createGuest.useMutation();
  const createUserMutation = useTrpc.user.create.useMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    createAccount: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"guest" | "login">("guest");

  // Auto-fill data if user is authenticated
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName || "",
        email: user.email,
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
        createAccount: false,
      });
    }
  }, [user]);

  // Helper to update form data
  const updateField = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // If authenticated user, just continue
      if (user) {
        onContinue({
          firstName: user.firstName,
          lastName: user.lastName || "",
          phone: user.phone || "",
          email: user.email,
          createAccount: false,
          userId: user.id,
        });
        return;
      }

      // If we're in the login tab, handle login
      if (activeTab === "login") {
        // Validate we have email and password
        if (!formData.email || !formData.password) {
          setError(
            t.auth.errors.invalidCredentials ||
              "Please enter email and password"
          );
          return;
        }

        // Login with email/password
        await signIn({
          email: formData.email,
          password: formData.password,
        });

        // The auth context will automatically update and the component will re-render
        // with the authenticated user, so we don't call onContinue here
        return;
      }

      // If user wants to create account with email/password
      if (formData.createAccount) {
        // Validate password match
        if (formData.password !== formData.confirmPassword) {
          setError(t.auth.errors.passwordsDoNotMatch);
          return;
        }

        // Validate password length
        if (formData.password.length < 6) {
          setError(t.auth.errors.passwordTooShort);
          return;
        }

        // Step 1: Create Firebase account
        const firebaseUser = await signUp({
          email: formData.email,
          password: formData.password,
          displayName: `${formData.firstName} ${formData.lastName}`,
        });

        // Step 2: Create user in database with all info (including phone)
        // This prevents the auth-context from creating a user without phone
        await createUserMutation.mutateAsync({
          id: firebaseUser.uid,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || null,
        });

        // Step 3: Refresh user data to load the newly created user
        await refreshUser();

        // The component will re-render and show the authenticated user
        // so we don't call onContinue here
        return;
      }

      // Otherwise, create guest user
      const result = await createGuestMutation.mutateAsync({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || null,
      });

      onContinue({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        createAccount: false,
        userId: result.user.id,
      });
    } catch (error) {
      console.error("Error submitting client info:", error);
      const errorMessage =
        error instanceof Error ? error.message : t.auth.errors.signUpFailed;
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    if (provider !== "Google") {
      setError(`${provider} login not implemented yet`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Sign in with Google
      await signInWithGoogle();

      // The auth context will automatically update and the component will re-render
      // with the authenticated user
    } catch (error) {
      console.error("Error signing in with Google:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t.auth.errors.signInFailed || "Failed to sign in with Google";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAuthenticated = !!user;

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">
            {t.booking.contact.loading}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Casi listo 🎉</p>
        <h2 className="text-2xl font-semibold tracking-tight">
          {t.booking.contact.title}
        </h2>
        <p className="text-muted-foreground text-sm">{t.booking.contact.description}</p>
      </div>

      {/* Show authenticated user info */}
      {isAuthenticated && user && (
        <>
          <div className="rounded-2xl border bg-primary/5 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                {user.firstName[0]}
                {user.lastName?.[0] || ""}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                {user.phone && (
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl font-semibold"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t.booking.contact.loading
              : t.booking.summary.continue}
          </Button>
        </>
      )}

      {/* Only show tabs if user is NOT authenticated */}
      {!isAuthenticated && (
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as "guest" | "login");
            setError(null);
          }}
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

          {/* Tab 1: Guest user / No account */}
          <TabsContent value="guest" className="space-y-4">
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Contact form for guest users */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {t.booking.contact.firstName}
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={t.booking.contact.placeholders.firstName}
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">{t.booking.contact.lastName}</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={t.booking.contact.placeholders.lastName}
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t.booking.contact.phoneNumber}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t.booking.contact.placeholders.phone}
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t.booking.contact.emailAddress}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.booking.contact.placeholders.email}
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* TODO: ANALIZAR FLUJO DE CREACIÓN DE CUENTA
               * Consideraciones:
               * 1. ¿El checkbox "crear cuenta" debe ser la única forma de crear cuenta con email/password?
               * 2. ¿Qué pasa si el usuario quiere crear cuenta con Google/Apple?
               *    - Opción A: Los botones de arriba pueden crear cuenta automáticamente (sin checkbox)
               *    - Opción B: Mostrar un modal/popup para no perder el progreso del usuario
               * 3. ¿Necesitamos distinguir entre "continuar como invitado" vs "crear cuenta"?
               * 4. ¿El flujo de Google/Apple debe preservar los datos ya ingresados en el formulario?
               *
               * Flujo actual:
               * - Checkbox desmarcado + no autenticado = continuar como invitado
               * - Checkbox marcado = crear cuenta con email/password (requiere contraseña)
               * - Botones sociales arriba = ¿crear cuenta o solo login? (por definir)
               */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createAccount"
                  checked={formData.createAccount}
                  onCheckedChange={(checked) =>
                    updateField("createAccount", checked === true)
                  }
                />
                <Label
                  htmlFor="createAccount"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t.booking.contact.createAccountOption}
                </Label>
              </div>

              {formData.createAccount && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {t.booking.contact.currentPassword}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t.booking.contact.placeholders.password}
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      required={formData.createAccount}
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t.booking.contact.passwordHelp}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      {t.booking.contact.confirmPassword}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder={t.booking.contact.placeholders.password}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      required={formData.createAccount}
                      minLength={6}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl font-semibold"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t.booking.contact.loading
                  : t.booking.summary.continue}
              </Button>
            </form>
          </TabsContent>

          {/* Tab 2: Login / I have an account */}
          <TabsContent value="login" className="space-y-4">
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginEmail">
                  {t.booking.contact.emailAddress}
                </Label>
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder={t.booking.contact.placeholders.email}
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginPassword">
                  {t.booking.contact.currentPassword}
                </Label>
                <Input
                  id="loginPassword"
                  type="password"
                  placeholder={t.booking.contact.placeholders.password}
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl font-semibold"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? t.booking.contact.loading : t.auth.login}
              </Button>

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t.auth.orContinueWith}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl font-semibold gap-3"
                onClick={() => handleSocialLogin("Google")}
              >
                <svg viewBox="0 0 22 22" className="h-5 w-5 shrink-0">
                  <path d="M20.64 11.2c0-.64-.06-1.25-.16-1.84H11v3.49h5.4a4.62 4.62 0 01-2 3.03v2.52h3.24c1.9-1.75 3-4.33 3-7.2z" fill="#4285F4"/>
                  <path d="M11 21c2.7 0 4.96-.9 6.62-2.42l-3.24-2.52c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H2.08v2.6A10 10 0 0011 21z" fill="#34A853"/>
                  <path d="M5.41 12.9A6.01 6.01 0 015.1 11c0-.66.11-1.3.31-1.9V6.5H2.08A10 10 0 001 11c0 1.61.38 3.13 1.08 4.5l3.33-2.6z" fill="#FBBC05"/>
                  <path d="M11 4.98c1.46 0 2.77.5 3.8 1.5L17.7 3.5A10 10 0 0011 1 10 10 0 002.08 6.5l3.33 2.6C6.2 6.74 8.4 4.98 11 4.98z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
