"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

interface SignupFormProps extends React.ComponentProps<"div"> {
  onSignupSuccess?: () => void;
  onGoogleSignup?: () => void;
  onLogin?: () => void;
  title?: string;
  description?: string;
  emailLabel?: string;
  passwordLabel?: string;
  confirmPasswordLabel?: string;
  fullNameLabel?: string;
  companyNameLabel?: string;
  signupButtonText?: string;
  googleButtonText?: string;
  orContinueText?: string;
  alreadyHaveAccountText?: string;
  loginText?: string;
  termsText?: string;
  termsOfServiceText?: string;
  privacyPolicyText?: string;
  andText?: string;
}

export function SignupForm({
  className,
  onSignupSuccess,
  onGoogleSignup,
  onLogin,
  title = "Create an account",
  description = "Sign up with your Google account",
  emailLabel = "Email",
  passwordLabel = "Password",
  confirmPasswordLabel = "Confirm Password",
  fullNameLabel = "Full Name",
  companyNameLabel = "Company Name",
  signupButtonText = "Create account",
  googleButtonText = "Sign up with Google",
  orContinueText = "Or continue with",
  alreadyHaveAccountText = "Already have an account?",
  loginText = "Login",
  termsText = "By clicking continue, you agree to our",
  termsOfServiceText = "Terms of Service",
  privacyPolicyText = "Privacy Policy",
  andText = "and",
  ...props
}: SignupFormProps) {
  const { signUp, signInWithGoogle, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
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
      await signUp({
        email,
        password,
        displayName: fullName,
      });
      if (onSignupSuccess) onSignupSuccess();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again."
      );
    }
  };

  const handleGoogleSignUp = async () => {
    setFormError(null);
    try {
      await signInWithGoogle();
      if (onGoogleSignup) onGoogleSignup();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Failed to sign up with Google. Please try again."
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
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
                  {googleButtonText}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                {orContinueText}
              </FieldSeparator>
              {(formError || error) && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {formError || error?.message}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="fullName">{fullNameLabel}</FieldLabel>
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
                <FieldLabel htmlFor="companyName">
                  {companyNameLabel}
                </FieldLabel>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="My Salon"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">{emailLabel}</FieldLabel>
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
                <FieldLabel htmlFor="password">{passwordLabel}</FieldLabel>
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
                  {confirmPasswordLabel}
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
                  {loading ? "Creating account..." : signupButtonText}
                </Button>
                <FieldDescription className="text-center">
                  {alreadyHaveAccountText}{" "}
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onLogin) onLogin();
                    }}
                  >
                    {loginText}
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {termsText}{" "}
        <Link href="/terms-of-service" className="underline">
          {termsOfServiceText}
        </Link>{" "}
        {andText}{" "}
        <Link href="/privacy-policy" className="underline">
          {privacyPolicyText}
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
