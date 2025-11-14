"use client";

import { useEffect } from "react";
import { Button } from "@/client/components/ui/button";
import { Home, RefreshCcw, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Animated 500 */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 animate-pulse rounded-full bg-destructive/10 blur-3xl" />
          </div>
          <h1 className="relative text-9xl font-bold">
            <span className="bg-gradient-to-br from-destructive via-destructive to-orange-500 bg-clip-text text-transparent">
              500
            </span>
          </h1>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <h2 className="text-3xl font-bold tracking-tight">
              Algo salió mal
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Lo sentimos, ocurrió un error inesperado en el servidor.
          </p>
          <p className="text-sm text-muted-foreground">
            Nuestro equipo ha sido notificado y está trabajando en solucionarlo.
          </p>
        </div>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-8 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-mono text-left break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted">
              <AlertTriangle className="h-16 w-16 text-muted-foreground/40" />
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 animate-pulse">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={reset} size="lg" className="min-w-[160px]">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Intentar de nuevo
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[160px]">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ir al inicio
            </Link>
          </Button>
        </div>

        {/* Help text */}
        <div className="mt-12 text-sm text-muted-foreground">
          <p>Si el problema persiste, por favor contáctanos</p>
          <p className="mt-1">
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
