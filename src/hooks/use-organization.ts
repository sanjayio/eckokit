import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

export const useGetOrganizationCanCreateAgent = (organizationId: string) => {
  return useQuery({
    queryKey: [`get-organization-can-create-agent-${organizationId}`],
    queryFn: async () => {
      const res = await client.organizations.getOrganizationCanCreateAgent.$get(
        {
          organizationId,
        }
      );
      return await res.json();
    },
  });
};
