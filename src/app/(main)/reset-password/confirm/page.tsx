import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ConfirmResetPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}