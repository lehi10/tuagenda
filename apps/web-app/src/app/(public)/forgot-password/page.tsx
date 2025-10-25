"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { useTranslation } from "@/i18n"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [emailSent, setEmailSent] = useState(false)

  if (emailSent) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            TuAgenda
          </a>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{t.auth.checkYourEmail}</CardTitle>
              <CardDescription>{t.auth.resetLinkSent}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => router.push("/login")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.auth.backToLogin}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          TuAgenda
        </a>
        <ForgotPasswordForm
          title={t.auth.resetPassword}
          description={t.auth.resetPasswordDescription}
          emailLabel={t.auth.email}
          submitButtonText={t.auth.sendResetLink}
          backToLoginText={t.auth.backToLogin}
          onSubmit={() => setEmailSent(true)}
          onBackToLogin={() => router.push("/login")}
        />
      </div>
    </div>
  )
}
