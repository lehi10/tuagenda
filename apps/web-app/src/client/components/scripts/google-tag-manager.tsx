/**
 * Google Tag Manager Component
 *
 * Integrates Google Tag Manager (GTM) into the Next.js app.
 * GTM allows you to manage all tracking scripts (GA, Facebook Pixel, LinkedIn, etc.)
 * from a single interface without code changes.
 *
 * Usage in root layout:
 * - Add <GoogleTagManagerHead /> inside <head>
 * - Add <GoogleTagManagerBody /> right after opening <body>
 *
 * @see https://developers.google.com/tag-platform/tag-manager/web
 */

"use client";

import Script from "next/script";

interface GoogleTagManagerProps {
  gtmId: string;
}

/**
 * GTM Script for <head> section
 * Should be placed as high as possible in the <head>
 */
export function GoogleTagManagerHead({ gtmId }: GoogleTagManagerProps) {
  // Don't render in development unless explicitly enabled
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_ENABLE_GTM_IN_DEV !== "true"
  ) {
    return null;
  }

  return (
    <Script
      id="google-tag-manager"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `,
      }}
    />
  );
}

/**
 * GTM NoScript fallback for <body> section
 * Should be placed immediately after opening <body> tag
 */
export function GoogleTagManagerBody({ gtmId }: GoogleTagManagerProps) {
  // Don't render in development unless explicitly enabled
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_ENABLE_GTM_IN_DEV !== "true"
  ) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
