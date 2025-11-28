"use client";

import { AuthActionButton } from "@/components/eckokit/auth/auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export function InviteInformation({
  invitation,
}: {
  invitation: { id: string; organizationId: string };
}) {
  const router = useRouter();

  function acceptInvite() {
    return authClient.organization.acceptInvitation(
      { invitationId: invitation.id },
      {
        onSuccess: async () => {
          await authClient.organization.setActive({
            organizationId: invitation.organizationId,
          });
          router.push("/organizations");
        },
      }
    );
  }
  function rejectInvite() {
    return authClient.organization.rejectInvitation(
      {
        invitationId: invitation.id,
      },
      { onSuccess: () => router.push("/") }
    );
  }

  return (
    <div className="flex gap-4">
      <AuthActionButton className="flex-grow" action={acceptInvite}>
        Accept
      </AuthActionButton>
      <AuthActionButton
        className="flex-grow"
        variant="destructive"
        action={rejectInvite}
      >
        Reject
      </AuthActionButton>
    </div>
  );
}
