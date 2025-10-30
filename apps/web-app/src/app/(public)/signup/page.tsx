"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { SignupForm } from "@/components/auth/signup-form";
import { PublicRoute } from "@/components/public-route";
import { useTranslation } from "@/i18n";
import Link from "next/link";
import { Suspense } from "react";

export default function SignupPage() {
  const router = useRouter();

  return (
    <Suspense>
      <PublicRoute>
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-br from-secondary/5 via-background to-primary/5 p-4 sm:gap-6 sm:p-6 md:p-10">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0OEE5QTYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptLTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0xNiAwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0tMTYgMTZjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTE2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTM2IDBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bS0xNi0xNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

          <div className="relative flex w-full max-w-sm flex-col gap-4 sm:gap-6">
            <Link
              href="/"
              className="group flex items-center justify-center self-center"
            >
              <Image
                src="/icons/2_vertical_color.png"
                alt="TuAgenda"
                width={120}
                height={80}
                className="h-20 w-auto transition-opacity group-hover:opacity-90"
                priority
              />
            </Link>
            <SignupForm
              onSignupSuccess={() => router.push("/dashboard")}
              onGoogleSignup={() => router.push("/dashboard")}
              onLogin={() => router.push("/login")}
            />
          </div>
        </div>
      </PublicRoute>
    </Suspense>
  );
}
