"use client";

import { authClient } from "@/lib/auth/auth-client";
import { UserX } from "lucide-react";
import { AuthActionButton } from "@/components/eckokit/auth/auth-action-button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ImpersonationIndicator() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();

  if (session?.session.impersonatedBy == null) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <AuthActionButton
        action={() =>
          authClient.admin.stopImpersonating(undefined, {
            onError: (error) => {
              console.error("Failed to stop impersonating:", error);
            },
            onSuccess: () => {
              router.push("/admin-console");
              refetch();
            },
          })
        }
        variant="destructive"
        className="w-full"
      >
        <UserX className="size-4" />
        Stop Impersonating
      </AuthActionButton>
    </div>
  );
}
