import { Poppins } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/client/i18n";
import { AuthProvider, BusinessProvider } from "@/client/contexts";
import { TRPCProvider, QueryProvider } from "@/client/lib/trpc";
import { Toaster } from "@/client/components/ui/toaster";
import {
  GoogleAnalytics,
  Chatway,
  ChatwayIdentifier,
} from "@/client/components/scripts";
// NOTE: @vercel/analytics and @vercel/speed-insights are Vercel-specific integrations.
// Both imports and their usages must be removed when migrating to AWS.
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="es">
      <head>{gaId && <GoogleAnalytics measurementId={gaId} />}</head>
      <body className={`${poppins.variable} antialiased font-sans`}>
        <AuthProvider>
          <QueryProvider>
            <BusinessProvider>
              <TRPCProvider>
                <I18nProvider>{children}</I18nProvider>
              </TRPCProvider>
            </BusinessProvider>
          </QueryProvider>
          <ChatwayIdentifier />
        </AuthProvider>
        <Toaster
          theme="light"
          richColors
          closeButton
          toastOptions={{
            style: { animationDuration: "200ms" },
            className: "animate-in fade-in-0 slide-in-from-right-5",
          }}
          duration={6000}
          position="top-right"
          offset={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
        />
        <Analytics />
        <SpeedInsights />
        <Chatway />
      </body>
    </html>
  );
}
