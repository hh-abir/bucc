import { headers } from "next/headers";
import { auth as betterAuth } from "@/lib/auth";

export async function auth() {
  return betterAuth.api.getSession({
    headers: await headers(),
  });
}

export async function signOut() {
  return null;
}
