"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, RefreshCw, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";

export default function TwoFactorLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"totp" | "backup">("totp");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "totp" && (code.length !== 6 || isNaN(Number(code)))) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    if (mode === "backup" && !code.trim()) {
      toast.error("Please enter a backup recovery code");
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (mode === "totp") {
        result = await authClient.twoFactor.verifyTotp({
          code: code,
        });
      } else {
        result = await authClient.twoFactor.verifyBackupCode({
          code: code.trim(),
        });
      }

      const { data, error } = result;

      if (error) {
        toast.error(error.message || `Invalid ${mode === "totp" ? "2FA code" : "backup code"}. Please try again.`);
      } else {
        toast.success("Authentication successful!");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-sm border border-border">
        <div className="text-center space-y-3">
          <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
            {mode === "totp" ? (
              <ShieldCheck className="w-8 h-8 text-primary" />
            ) : (
              <KeyRound className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
            {mode === "totp" ? "Two-Factor Auth" : "Backup Recovery Code"}
          </h1>
          <p className="text-muted-foreground text-sm font-light">
            {mode === "totp" 
              ? "Enter the 6-digit verification code from your authenticator app to log in."
              : "Enter one of your single-use backup recovery codes to access your account."}
          </p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-2">
            {mode === "totp" ? (
              <input
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center font-mono text-2xl tracking-[0.3em] placeholder:text-muted-foreground/30 placeholder:text-sm placeholder:tracking-normal"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                required
                autoFocus
              />
            ) : (
              <input
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center font-mono text-lg placeholder:text-muted-foreground/30 placeholder:text-sm"
                placeholder="Enter backup code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoFocus
              />
            )}
          </div>

          <button
            className="w-full bg-primary text-primary-foreground py-2.5 px-4 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              "Verify & Sign In"
            )}
          </button>
        </form>

        <div className="flex flex-col gap-2 items-center justify-center pt-2">
          {mode === "totp" ? (
            <button 
              type="button" 
              onClick={() => { setMode("backup"); setCode(""); }}
              className="text-xs text-primary hover:underline font-medium"
            >
              Use a backup recovery code instead
            </button>
          ) : (
            <button 
              type="button" 
              onClick={() => { setMode("totp"); setCode(""); }}
              className="text-xs text-primary hover:underline font-medium"
            >
              Use authenticator app code instead
            </button>
          )}

          <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
