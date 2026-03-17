/**
 * Tawk.to Live Chat Component
 *
 * Integrates Tawk.to live chat widget into the Next.js app.
 * Uses next/script for optimal loading performance.
 *
 * Usage in root layout:
 * - Add <TawkTo /> inside <body>
 *
 * @see https://www.tawk.to/
 */

"use client";

import Script from "next/script";

interface TawkToProps {
  propertyId: string;
  widgetId: string;
}

/**
 * Tawk.to Live Chat Script
 * Should be placed in the <body> section
 */
export function TawkTo({ propertyId, widgetId }: TawkToProps) {
  // Don't render in development unless explicitly enabled
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_ENABLE_TAWK_IN_DEV !== "true"
  ) {
    return null;
  }

  return (
    <Script
      id="tawk-to"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/${propertyId}/${widgetId}';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `,
      }}
    />
  );
}
