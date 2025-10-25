"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/i18n";

interface ClientInfoStepProps {
  onContinue: (data: {
    fullName: string;
    phone: string;
    email: string;
    password?: string;
    createAccount: boolean;
  }) => void;
  isAuthenticated?: boolean;
}

export function ClientInfoStep({
  onContinue,
  isAuthenticated = false,
}: ClientInfoStepProps) {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createAccount, setCreateAccount] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue({
      fullName,
      phone,
      email,
      password: createAccount ? password : undefined,
      createAccount,
    });
  };

  const handleLoginClick = () => {
    // TODO: Implement login modal/redirect
    console.log("Login clicked");
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login
    console.log(`${provider} login clicked`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Información de Contacto</h2>
        <p className="mt-2 text-muted-foreground">
          Completa tus datos para confirmar la reserva
        </p>
      </div>

      {!isAuthenticated && (
        <>
          {/* TODO: ANALIZAR COMPORTAMIENTO DE LOGIN/SIGNUP CON REDES SOCIALES
           * Consideraciones:
           * 1. Los botones de Google/Apple deben funcionar tanto para login como para signup
           * 2. Si el usuario hace click en Google/Apple:
           *    - Si ya tiene cuenta: hacer login y preservar datos del formulario
           *    - Si no tiene cuenta: crear cuenta automáticamente
           * 3. Usar modal/popup para OAuth para no perder progreso del booking
           * 4. Al completar OAuth, volver a este paso con la info autocompletada
           */}
          <div className="mx-auto max-w-md rounded-lg border bg-muted/50 p-4">
            <p className="mb-3 text-center text-sm font-medium">
              ¿Ya tienes una cuenta?
            </p>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoginClick}
              >
                {t.auth.login}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-muted/50 px-2 text-muted-foreground">
                    {t.auth.orContinueWith}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialLogin("Google")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSocialLogin("Apple")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Apple
                </Button>
              </div>
            </div>
          </div>

          <Separator />
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="fullName">Nombre Completo *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Juan Pérez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+51 999 888 777"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {!isAuthenticated && (
          <>
            {/* TODO: ANALIZAR FLUJO DE CREACIÓN DE CUENTA
             * Consideraciones:
             * 1. ¿El checkbox "crear cuenta" debe ser la única forma de crear cuenta con email/password?
             * 2. ¿Qué pasa si el usuario quiere crear cuenta con Google/Apple?
             *    - Opción A: Los botones de arriba pueden crear cuenta automáticamente (sin checkbox)
             *    - Opción B: Mostrar un modal/popup para no perder el progreso del usuario
             * 3. ¿Necesitamos distinguir entre "continuar como invitado" vs "crear cuenta"?
             * 4. ¿El flujo de Google/Apple debe preservar los datos ya ingresados en el formulario?
             *
             * Flujo actual:
             * - Checkbox desmarcado + no autenticado = continuar como invitado
             * - Checkbox marcado = crear cuenta con email/password (requiere contraseña)
             * - Botones sociales arriba = ¿crear cuenta o solo login? (por definir)
             */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="createAccount"
                checked={createAccount}
                onCheckedChange={(checked) =>
                  setCreateAccount(checked === true)
                }
              />
              <Label
                htmlFor="createAccount"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Crear una cuenta para futuras reservas
              </Label>
            </div>

            {createAccount && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={createAccount}
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 6 caracteres
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirmar Contraseña *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required={createAccount}
                    minLength={6}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <Button type="submit" className="w-full" size="lg">
          Continuar
        </Button>
      </form>
    </div>
  );
}
