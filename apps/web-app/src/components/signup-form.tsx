import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface SignupFormProps extends React.ComponentProps<"div"> {
  onSignup?: () => void
  onAppleSignup?: () => void
  onGoogleSignup?: () => void
  onLogin?: () => void
  title?: string
  description?: string
  emailLabel?: string
  passwordLabel?: string
  confirmPasswordLabel?: string
  fullNameLabel?: string
  companyNameLabel?: string
  signupButtonText?: string
  appleButtonText?: string
  googleButtonText?: string
  orContinueText?: string
  alreadyHaveAccountText?: string
  loginText?: string
  termsText?: string
  termsOfServiceText?: string
  privacyPolicyText?: string
  andText?: string
}

export function SignupForm({
  className,
  onSignup,
  onAppleSignup,
  onGoogleSignup,
  onLogin,
  title = "Create an account",
  description = "Sign up with your Apple or Google account",
  emailLabel = "Email",
  passwordLabel = "Password",
  confirmPasswordLabel = "Confirm Password",
  fullNameLabel = "Full Name",
  companyNameLabel = "Company Name",
  signupButtonText = "Create account",
  appleButtonText = "Sign up with Apple",
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSignup) onSignup()
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
                <Button variant="outline" type="button" onClick={onAppleSignup}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  {appleButtonText}
                </Button>
                <Button variant="outline" type="button" onClick={onGoogleSignup}>
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
              <Field>
                <FieldLabel htmlFor="fullName">{fullNameLabel}</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="companyName">{companyNameLabel}</FieldLabel>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="My Salon"
                  required
                />
              </Field>
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
                <FieldLabel htmlFor="password">{passwordLabel}</FieldLabel>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  {confirmPasswordLabel}
                </FieldLabel>
                <Input id="confirmPassword" type="password" required />
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  {signupButtonText}
                </Button>
                <FieldDescription className="text-center">
                  {alreadyHaveAccountText}{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (onLogin) onLogin()
                    }}
                  >
                    {loginText}
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {termsText}{" "}
        <a href="/terms-of-service" className="underline">
          {termsOfServiceText}
        </a>{" "}
        {andText}{" "}
        <a href="/privacy-policy" className="underline">
          {privacyPolicyText}
        </a>
        .
      </FieldDescription>
    </div>
  )
}
