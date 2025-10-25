"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { useTranslation } from "@/i18n";
import Link from "next/link";

export default function LoginPage() {
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
        <LoginForm
          title={t.auth.welcomeBack}
          description={t.auth.loginWith}
          emailLabel={t.auth.email}
          passwordLabel={t.auth.password}
          loginButtonText={t.auth.login}
          appleButtonText={t.auth.loginWithApple}
          googleButtonText={t.auth.loginWithGoogle}
          orContinueText={t.auth.orContinueWith}
          forgotPasswordText={t.auth.forgotPassword}
          dontHaveAccountText={t.auth.dontHaveAccount}
          signupText={t.auth.signUp}
          termsText={t.auth.termsAndPrivacy}
          termsOfServiceText={t.legal.termsOfService}
          privacyPolicyText={t.legal.privacyPolicy}
          andText={t.auth.and}
          onLogin={() => router.push("/dashboard")}
          onAppleLogin={() => router.push("/dashboard")}
          onGoogleLogin={() => router.push("/dashboard")}
          onForgotPassword={() => router.push("/forgot-password")}
          onSignup={() => router.push("/signup")}
        />
      </div>
    </div>
  );
}
