/**
 * Google Analytics Component
 *
 * Integrates Google Analytics 4 (GA4) into the Next.js app.
 * Uses next/script for optimal loading performance.
 *
 * Usage in root layout:
 * - Add <GoogleAnalytics /> inside <head>
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 */

"use client";

import Script from "next/script";

interface GoogleAnalyticsProps {
  measurementId: string;
}

/**
 * Google Analytics Script
 * Should be placed in the <head> section
 */
export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  // Don't render in development unless explicitly enabled
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_ENABLE_GA_IN_DEV !== "true"
  ) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `,
        }}
      />
    </>
  );
}
