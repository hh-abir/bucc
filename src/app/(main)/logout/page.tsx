"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    authClient.signOut().then(() => {
      router.push("/");
      router.refresh();
    });
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground font-serif">
      <p className="text-lg animate-pulse">Signing out...</p>
    </div>
  );
}
