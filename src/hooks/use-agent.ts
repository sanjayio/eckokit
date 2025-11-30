import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useGetAgentsByOrganizationId = (organizationId: string) => {
  return useQuery({
    queryKey: [`get-agents-by-organization-id-${organizationId}`],
    queryFn: async () => {
      const res = await client.agents.getAllAgentsByOrganizationId.$get({
        organizationId,
      });
      return await res.json();
    },
  });
};

export const useGetAgentById = (agentId: string) => {
  return useQuery({
    queryKey: [`get-agent-by-id-${agentId}`],
    queryFn: async () => {
      const res = await client.agents.getAgentById.$get({
        id: agentId,
      });
      return await res.json();
    },
  });
};

export const useToggleAgentById = (
  setCurrentlyTogglingAgent: (agentId: string | undefined) => void
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      id,
      organizationId,
    }: {
      id: string;
      organizationId: string;
    }) => {
      setCurrentlyTogglingAgent(id);
      const res = await client.agents.toggleAgentById.$post({
        id,
        organizationId,
      });
      return await res.json();
    },
    onSuccess: ({ agent }) => {
      setCurrentlyTogglingAgent(undefined);
      if (!agent.archived) {
        toast.success("Agent published successfully!");
      } else {
        toast.success("Agent unpublished successfully!");
      }
      queryClient.invalidateQueries({
        queryKey: [`get-agent-by-id-${agent.id}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`get-agents-by-organization-id-${agent.organizationId}`],
      });
      router.refresh();
    },
    onError: (error) => {
      setCurrentlyTogglingAgent(undefined);
      toast.error(
        error instanceof Error ? error.message : "Error toggling agent"
      );
    },
  });
};

export const useGetConversationsByAgentId = (agentId: string) => {
  return useQuery({
    queryKey: [`get-conversations-by-agent-id-${agentId}`],
    queryFn: async () => {
      const res = await client.agents.getConversationsByAgentId.$get({
        agentId,
      });
      return await res.json();
    },
  });
};

export const useGetUsageByOrganizationId = (organizationId: string) => {
  return useQuery({
    queryKey: [`get-usage-by-organization-id-${organizationId}`],
    queryFn: async () => {
      const res = await client.agents.getUsageByOrganizationId.$get({
        organizationId,
      });
      return await res.json();
    },
  });
};

export const useDeleteAgentById = (
  setCurrentlyDeletingAgent: (agentId: string | undefined) => void
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      setCurrentlyDeletingAgent(id);
      const res = await client.agents.deleteAgentById.$post({ id });
      return await res.json();
    },
    onSuccess: ({ organizationId }) => {
      setCurrentlyDeletingAgent(undefined);
      toast.success("Agent deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: [`get-agents-by-organization-id-${organizationId}`],
      });
      router.push(`/agents`);
    },
    onError: (error) => {
      setCurrentlyDeletingAgent(undefined);
      toast.error(
        error instanceof Error ? error.message : "Error deleting agent"
      );
    },
  });
};

export const useUpdateAgentToolsById = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      agentId,
      end_call,
      skip_turn,
      transfer_to_human,
      transfer_to_human_phone,
    }: {
      agentId: string;
      end_call: boolean;
      skip_turn: boolean;
      transfer_to_human: boolean;
      transfer_to_human_phone: string;
    }) => {
      const res = await client.agents.updateAgentToolsById.$post({
        id: agentId,
        end_call,
        skip_turn,
        transfer_to_human,
        transfer_to_human_phone,
      });
      return await res.json();
    },
    onSuccess: ({ agentId }) => {
      queryClient.invalidateQueries({
        queryKey: [`get-agent-by-id-${agentId}`],
      });
      toast.success("Agent tools updated successfully!");
      router.refresh();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Error updating agent tools"
      );
    },
  });
};

export const useUpdateAgentById = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      organizationId,
      agentId,
      agentName,
      agentFirstMessage,
      agentPrompt,
      agentLLM,
    }: {
      organizationId: string;
      agentId: string;
      agentName: string;
      agentFirstMessage: string;
      agentPrompt: string;
      agentLLM:
        | "gpt-4o-mini"
        | "gpt-4o"
        | "gpt-4.1-mini"
        | "gpt-4.1"
        | "gemini-2.0-flash"
        | "gemini-2.5-flash";
    }) => {
      const res = await client.agents.updateAgentById.$post({
        organizationId,
        agentId,
        agentName,
        agentFirstMessage,
        agentPrompt,
        agentLLM,
      });
      return await res.json();
    },
    onSuccess: ({ agentId }) => {
      queryClient.invalidateQueries({
        queryKey: [`get-agent-by-id-${agentId}`],
      });
      toast.success("Agent updated successfully!");
      router.refresh();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Error updating agent"
      );
    },
  });
};

export const useCreateAgent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      organizationId,
      agentName,
      agentFirstMessage,
      agentPrompt,
      agentLLM,
    }: {
      organizationId: string;
      agentName: string;
      agentFirstMessage: string;
      agentPrompt: string;
      agentLLM:
        | "gpt-4o-mini"
        | "gpt-4o"
        | "gpt-4.1-mini"
        | "gpt-4.1"
        | "gemini-2.0-flash"
        | "gemini-2.5-flash";
    }) => {
      const res = await client.agents.createAgent.$post({
        organizationId,
        agentName,
        agentFirstMessage,
        agentPrompt,
        agentLLM,
      });
      return await res.json();
    },
    onSuccess: ({ organizationId }) => {
      queryClient.invalidateQueries({
        queryKey: [`get-agents-by-organization-id-${organizationId}`],
      });
      toast.success("Agent created successfully!");
      router.push(`/agents`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Error creating agent"
      );
    },
  });
};
