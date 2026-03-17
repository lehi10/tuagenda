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
  const { user, loading: authLoading, signUp, signIn, signInWithGoogle, refreshUser } = useAuth();
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
          setError(t.auth.errors.invalidCredentials || "Please enter email and password");
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
        error instanceof Error ? error.message : t.auth.errors.signInFailed || "Failed to sign in with Google";
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
      {/* Header - Standardized */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t.booking.contact.title}
        </h2>
        <p className="text-muted-foreground">{t.booking.contact.description}</p>
      </div>

      {/* Show authenticated user info */}
      {isAuthenticated && user && (
        <>
          <div className="rounded-lg border bg-muted/50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-lg font-medium">
                  {user.firstName[0]}
                  {user.lastName?.[0] || ""}
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-lg font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {user.email}
                </p>
                {user.phone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {user.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
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
            setError(null); // Clear errors when switching tabs
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guest">
              {t.booking.contact.guestTab}
            </TabsTrigger>
            <TabsTrigger value="login">
              {t.booking.contact.loginTab}
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Guest user / No account */}
          <TabsContent value="guest" className="space-y-4">
            {/* Error message display */}
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
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
                className="w-full"
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
            {/* Error message display */}
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
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
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? t.booking.contact.loading : t.auth.login}
              </Button>

              <div className="relative">
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
                className="w-full"
                onClick={() => handleSocialLogin("Google")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Google
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
