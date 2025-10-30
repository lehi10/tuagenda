"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createUserInDatabase } from "@/actions/user";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/contexts";
import { useTranslation } from "@/i18n";

interface LoginFormProps extends React.ComponentProps<"div"> {
  onLoginSuccess?: () => void;
  onGoogleLogin?: () => void;
  onForgotPassword?: () => void;
  onSignup?: () => void;
}

export function LoginForm({
  className,
  onLoginSuccess,
  onGoogleLogin,
  onForgotPassword,
  onSignup,
  ...props
}: LoginFormProps) {
  const { t } = useTranslation();
  const { signIn, signInWithGoogle, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      await signIn({ email, password });
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Failed to sign in. Please try again."
      );
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    try {
      // Step 1: Authenticate with Google (Firebase)
      toast.loading("Signing in with Google...");
      const firebaseUser = await signInWithGoogle();
      toast.dismiss();
      toast.success("Google authentication successful");

      // Step 2: Extract first and last name from displayName
      const displayName = firebaseUser.displayName || "";
      const nameParts = displayName.trim().split(/\s+/);
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Step 3: Create/update user in PostgreSQL database as 'customer'
      // This handles both first-time login (creates user) and returning users (no-op)
      console.log("🔄 Attempting to sync user with database...", {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName,
        lastName,
      });

      toast.loading("Syncing profile...");
      const dbResult = await createUserInDatabase({
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        firstName,
        lastName,
        pictureFullPath: firebaseUser.photoURL,
      });
      toast.dismiss();

      if (!dbResult.success) {
        console.error("❌ Failed to sync user with database:", dbResult.error);
        toast.error(`Failed to sync profile: ${dbResult.error}`);
        setFormError(
          `Authentication successful, but failed to sync user data: ${dbResult.error}`
        );
        return; // Don't proceed if DB sync fails
      }

      console.log("✅ User synced successfully to database:", dbResult.userId);
      toast.success("Welcome back! 🎉");

      if (onGoogleLogin) onGoogleLogin();
    } catch (err) {
      toast.dismiss();
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to sign in with Google. Please try again.";
      toast.error(errorMessage);
      setFormError(errorMessage);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t.auth.welcomeBack}</CardTitle>
          <CardDescription>{t.auth.loginWith}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {t.auth.loginWithGoogle}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                {t.auth.orContinueWith}
              </FieldSeparator>
              {(formError || error) && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {formError || error?.message}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email">{t.auth.email}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{t.auth.password}</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onForgotPassword) onForgotPassword();
                    }}
                  >
                    {t.auth.forgotPassword}
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in..." : t.auth.login}
                </Button>
                <FieldDescription className="text-center">
                  {t.auth.dontHaveAccount}{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onSignup) onSignup();
                    }}
                  >
                    {t.auth.signUp}
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {t.auth.termsAndPrivacy}{" "}
        <Link href="/terms-of-service" className="underline">
          {t.legal.termsOfService}
        </Link>{" "}
        {t.auth.and}{" "}
        <Link href="/privacy-policy" className="underline">
          {t.legal.privacyPolicy}
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
