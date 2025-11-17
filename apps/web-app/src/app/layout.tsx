import { Poppins } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/client/i18n";
import { AuthProvider, BusinessProvider } from "@/client/contexts";
import { TRPCProvider } from "@/client/lib/trpc";
import { Toaster } from "@/client/components/ui/toaster";
import type { Metadata } from "next";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TuAgenda - Gestión de Citas",
  description: "Sistema de gestión de citas y clientes para tu negocio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} antialiased font-sans`}>
        <TRPCProvider>
          <AuthProvider>
            <BusinessProvider>
              <I18nProvider>{children}</I18nProvider>
            </BusinessProvider>
          </AuthProvider>
        </TRPCProvider>
        <Toaster
          theme="light"
          richColors
          closeButton
          toastOptions={{
            style: { animationDuration: "200ms" },
            className: "animate-in fade-in-0 slide-in-from-right-5",
          }}
          duration={10000}
          position="top-right"
        />
      </body>
    </html>
  );
}
