"use client";

import { AuthActionButton } from "@/components/eckokit/auth/auth-action-button";
import { authClient } from "@/lib/auth/auth-client";

export function SetPasswordButton({ email }: { email: string }) {
  return (
    <AuthActionButton
      variant="outline"
      successMessage="Password reset email sent"
      action={() => {
        return authClient.requestPasswordReset({
          email,
          redirectTo: "/auth/reset-password",
        });
      }}
    >
      Send Password Reset Email
    </AuthActionButton>
  );
}
