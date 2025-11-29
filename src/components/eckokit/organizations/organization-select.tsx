"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export function OrganizationSelect() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  if (organizations == null || organizations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 text-muted-foreground text-sm w-full border border-dashed border-gray-300 rounded-md p-4">
        <svg
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-muted-foreground"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M4 20h5m-6 0v-2a4 4 0 013-3.87M6 7V6a6 6 0 1112 0v1m-9 4h6m2 8a2 2 0 11-4 0"
          />
        </svg>
        You don&apos;t have any organizations
      </div>
    );
  }

  function setActiveOrganization(
    organizationId: string,
    organizationName: string
  ) {
    authClient.organization.setActive(
      { organizationId },
      {
        onSuccess: () => {
          toast.success("Switched to organization " + organizationName);
        },
        onError: (error) => {
          toast.error(error.error.message || "Failed to switch organization");
        },
      }
    );
  }

  return (
    <Select
      value={activeOrganization?.id ?? ""}
      onValueChange={(value) =>
        setActiveOrganization(
          value,
          organizations?.find((org) => org.id === value)?.name ?? ""
        )
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
