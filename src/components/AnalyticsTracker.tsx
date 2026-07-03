"use client";

import { useEffect } from "react";

export default function AnalyticsTracker() {
  useEffect(() => {
    // Increment visit log on load
    fetch("/api/analytics/track", { 
      method: "POST",
      headers: { "Content-Type": "application/json" }
    }).catch((err) => {
      // Fail silently to prevent console pollution
    });
  }, []);

  return null;
}
