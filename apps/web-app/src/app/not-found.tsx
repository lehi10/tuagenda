"use client";

import Link from "next/link";
import { Button } from "@/client/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 animate-pulse rounded-full bg-primary/10 blur-3xl" />
          </div>
          <h1 className="relative text-9xl font-bold">
            <span className="bg-gradient-to-br from-primary via-primary to-secondary bg-clip-text text-transparent">
              404
            </span>
          </h1>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">
            Página no encontrada
          </h2>
          <p className="text-lg text-muted-foreground">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted">
              <Search className="h-16 w-16 text-muted-foreground/40" />
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="min-w-[160px]">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ir al inicio
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[160px]"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver atrás
          </Button>
        </div>

        {/* Help text */}
        <div className="mt-12 text-sm text-muted-foreground">
          <p>¿Necesitas ayuda?</p>
          <p className="mt-1">
            Contáctanos en{" "}
            <a
              href="mailto:support@tuagenda.com"
              className="font-medium text-primary hover:underline"
            >
              support@tuagenda.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
