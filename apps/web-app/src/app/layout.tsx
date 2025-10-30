import { Poppins } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/i18n";
import { AuthProvider } from "@/contexts";
import { QueryProvider } from "@/lib/query";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";

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
        <QueryProvider>
          <AuthProvider>
            <I18nProvider>{children}</I18nProvider>
          </AuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
