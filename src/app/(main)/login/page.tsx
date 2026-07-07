"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        toast.error(error.message || "Invalid credentials");
      } else {
        toast.success("Login successful!");
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
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Sign In</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email and password to access the portal.
          </p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
            <input
              id="email"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
            <input
              id="password"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 text-sm">
            <div className="flex justify-between items-center">
              <a href="/reset-password" className="font-medium text-muted-foreground hover:text-foreground transition-colors">
                Forgot password?
              </a>
              <a href="/registration" className="font-medium text-muted-foreground hover:text-foreground transition-colors">
                Recruitment Intake
              </a>
            </div>
            <div className="border-t border-border/50 pt-3 text-center">
              <a href="/member-registration" className="font-semibold text-primary hover:underline transition-all">
                Existing BUCC Member / Alumni Registration
              </a>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
