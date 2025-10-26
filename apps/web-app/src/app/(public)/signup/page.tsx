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
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-br from-secondary/5 via-background to-primary/5 p-4 sm:gap-6 sm:p-6 md:p-10">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0OEE5QTYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptLTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0xNiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMTZjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTM2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xNi0xNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

      <div className="relative flex w-full max-w-sm flex-col gap-4 sm:gap-6">
        <Link
          href="/"
          className="group flex items-center gap-2 self-center font-medium"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-75 blur-sm transition-opacity group-hover:opacity-100" />
            <div className="relative flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg sm:size-8">
              <GalleryVerticalEnd className="size-4 sm:size-5" />
            </div>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent sm:text-xl">
            TuAgenda
          </span>
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
