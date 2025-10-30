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
import { logger } from "@/lib/logger";

interface SignupFormProps extends React.ComponentProps<"div"> {
  onSignupSuccess?: () => void;
  onGoogleSignup?: () => void;
  onLogin?: () => void;
}

export function SignupForm({
  className,
  onSignupSuccess,
  onGoogleSignup,
  onLogin,
  ...props
}: SignupFormProps) {
  const { t } = useTranslation();
  const { signUp, signInWithGoogle, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    try {
      // Step 1: Create user in Firebase Auth
      toast.loading("Creating your account...");
      const firebaseUser = await signUp({
        email,
        password,
        displayName: fullName,
      });
      toast.dismiss();
      toast.success("Account created in Firebase");

      // Step 2: Split full name into first and last name
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || nameParts[0] || "";

      // Step 3: Create user in PostgreSQL database as 'customer'
      logger.info(
        "SignupForm.handleSubmit",
        firebaseUser.uid,
        `Creating user in database - Email: ${firebaseUser.email || email}, Name: ${firstName} ${lastName}`
      );

      toast.loading("Saving your profile...");
      const dbResult = await createUserInDatabase({
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        firstName,
        lastName,
        pictureFullPath: firebaseUser.photoURL,
      });
      toast.dismiss();

      if (!dbResult.success) {
        logger.error(
          "SignupForm.handleSubmit",
          firebaseUser.uid,
          `Failed to create user in database: ${dbResult.error}`
        );
        toast.error(`Failed to save profile: ${dbResult.error}`);
        setFormError(
          `Account created but profile save failed: ${dbResult.error}`
        );
        return; // Don't proceed if DB creation fails
      }

      logger.info(
        "SignupForm.handleSubmit",
        dbResult.userId,
        "User created successfully in database"
      );
      toast.success("Account created successfully! 🎉");

      if (onSignupSuccess) onSignupSuccess();
    } catch (err) {
      toast.dismiss();
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again.";
      toast.error(errorMessage);
      setFormError(errorMessage);
    }
  };

  const handleGoogleSignUp = async () => {
    setFormError(null);
    try {
      // Step 1: Sign in with Google (Firebase)
      toast.loading("Signing in with Google...");
      const firebaseUser = await signInWithGoogle();
      toast.dismiss();
      toast.success("Google authentication successful");

      // Step 2: Extract first and last name from displayName
      const displayName = firebaseUser.displayName || "";
      const nameParts = displayName.trim().split(/\s+/);
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Step 3: Create user in PostgreSQL database as 'customer'
      logger.info(
        "SignupForm.handleGoogleSignUp",
        firebaseUser.uid,
        `Creating user in database (Google signup) - Email: ${firebaseUser.email}, Name: ${firstName} ${lastName}`
      );

      toast.loading("Saving your profile...");
      const dbResult = await createUserInDatabase({
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        firstName,
        lastName,
        pictureFullPath: firebaseUser.photoURL,
      });
      toast.dismiss();

      if (!dbResult.success) {
        logger.error(
          "SignupForm.handleGoogleSignUp",
          firebaseUser.uid,
          `Failed to create user in database: ${dbResult.error}`
        );
        toast.error(`Failed to save profile: ${dbResult.error}`);
        setFormError(
          `Google signup successful, but failed to save profile: ${dbResult.error}`
        );
        return; // Don't proceed if DB creation fails
      }

      logger.info(
        "SignupForm.handleGoogleSignUp",
        dbResult.userId,
        "User created successfully in database"
      );
      toast.success("Account created successfully! 🎉");

      if (onGoogleSignup) onGoogleSignup();
    } catch (err) {
      toast.dismiss();
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to sign up with Google. Please try again.";
      toast.error(errorMessage);
      setFormError(errorMessage);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t.auth.createAccount}</CardTitle>
          <CardDescription>{t.auth.signUpWith}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {t.auth.signUpWithGoogle}
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
                <FieldLabel htmlFor="fullName">{t.auth.fullName}</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>
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
                <FieldLabel htmlFor="password">{t.auth.password}</FieldLabel>
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
                <FieldLabel htmlFor="confirmPassword">
                  {t.auth.confirmPassword}
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t.auth.creatingAccount : t.auth.createAccount}
                </Button>
                <FieldDescription className="text-center">
                  {t.auth.alreadyHaveAccount}{" "}
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onLogin) onLogin();
                    }}
                  >
                    {t.auth.login}
                  </Link>
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
