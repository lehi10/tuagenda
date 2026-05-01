"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useAuth } from "@/client/contexts";

export function Chatway() {
  return (
    <Script
      id="chatway"
      src="https://cdn.chatway.app/widget.js?id=KsGmkbKbzZvC"
      strategy="afterInteractive"
    />
  );
}

/**
 * Identifies the authenticated user in the Chatway widget.
 * Must be rendered inside AuthProvider.
 */
export function ChatwayIdentifier() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const identify = () => {
      if (typeof window.$chatway === "undefined") return;
      window.$chatway.updateChatwayCustomData("name", `${user.firstName} ${user.lastName}`);
      window.$chatway.updateChatwayCustomData("email", user.email);
      if (user.pictureFullPath) {
        window.$chatway.updateChatwayCustomData("avatar", user.pictureFullPath);
      }
    };

    // If Chatway already loaded, identify immediately; otherwise wait for it
    if (window.$chatway?.isChatwayLoaded()) {
      identify();
    } else {
      window.$chatwayOnLoad = () => identify();
    }
  }, [user]);

  return null;
}
