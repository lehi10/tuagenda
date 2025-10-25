import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

interface ForgotPasswordFormProps extends React.ComponentProps<"div"> {
  onSubmit?: () => void
  onBackToLogin?: () => void
  title?: string
  description?: string
  emailLabel?: string
  submitButtonText?: string
  backToLoginText?: string
}

export function ForgotPasswordForm({
  className,
  onSubmit,
  onBackToLogin,
  title = "Reset password",
  description = "Enter your email address and we'll send you a link to reset your password.",
  emailLabel = "Email",
  submitButtonText = "Send reset link",
  backToLoginText = "Back to login",
  ...props
}: ForgotPasswordFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) onSubmit()
  }

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
                <FieldLabel htmlFor="email">{emailLabel}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  {submitButtonText}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Button
        variant="ghost"
        className="w-full"
        onClick={onBackToLogin}
        type="button"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {backToLoginText}
      </Button>
    </div>
  )
}
