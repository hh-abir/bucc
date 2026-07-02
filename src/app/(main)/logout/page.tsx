"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    let redirected = false;

    const handleRedirect = () => {
      if (!redirected) {
        redirected = true;
        router.push("/");
        router.refresh();
      }
    };

    // Perform sign out
    authClient.signOut()
      .then(handleRedirect)
      .catch((err) => {
        console.error("Sign out error:", err);
        handleRedirect();
      });

    // Fallback: Redirect after 1.5 seconds if the request hangs/takes too long
    const timer = setTimeout(handleRedirect, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground font-serif">
      <p className="text-lg animate-pulse">Signing out...</p>
    </div>
  );
}
