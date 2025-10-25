"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/signup-form";
import { useTranslation } from "@/i18n";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          TuAgenda
        </Link>
        <SignupForm
          title={t.auth.createAccount}
          description={t.auth.signUpWith}
          emailLabel={t.auth.email}
          passwordLabel={t.auth.password}
          confirmPasswordLabel={t.auth.confirmPassword}
          fullNameLabel={t.auth.fullName}
          companyNameLabel={t.auth.companyName}
          signupButtonText={t.auth.createAccount}
          appleButtonText={t.auth.signUpWithApple}
          googleButtonText={t.auth.signUpWithGoogle}
          orContinueText={t.auth.orContinueWith}
          alreadyHaveAccountText={t.auth.alreadyHaveAccount}
          loginText={t.auth.login}
          termsText={t.auth.termsAndPrivacy}
          termsOfServiceText={t.legal.termsOfService}
          privacyPolicyText={t.legal.privacyPolicy}
          andText={t.auth.and}
          onSignup={() => router.push("/dashboard")}
          onAppleSignup={() => router.push("/dashboard")}
          onGoogleSignup={() => router.push("/dashboard")}
          onLogin={() => router.push("/login")}
        />
      </div>
    </div>
  );
}
