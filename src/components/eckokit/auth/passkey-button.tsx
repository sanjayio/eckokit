"use client";

import { AuthActionButton } from "@/components/eckokit/auth/auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PasskeyButton() {
  const router = useRouter();
  const { refetch } = authClient.useSession();

  useEffect(() => {
    authClient.signIn
      .passkey(
        { autoFill: true },
        {
          onSuccess() {
            refetch();
            router.push("/dashboard");
          },
        }
      )
      .catch(() => {
        // Silently ignore auto-fill failures (user may not have passkeys)
      });
  }, [router, refetch]);

  return (
    <AuthActionButton
      variant="outline"
      className="w-full"
      action={() =>
        authClient.signIn.passkey(undefined, {
          onSuccess() {
            refetch();
            router.push("/dashboard");
          },
        })
      }
    >
      Use Passkey
    </AuthActionButton>
  );
}
