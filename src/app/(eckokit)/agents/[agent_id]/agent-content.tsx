"use client";

import { Button } from "@/components/ui/button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BotIcon, Copy, Pause, Play, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect, useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useCreateNotification } from "@/hooks/use-notification";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import {
  useDeleteAgentById,
  useGetAgentById,
  useToggleAgentById,
} from "@/hooks/use-agent";
import { AgentForm } from "@/components/eckokit/agent/agent-form";
import { AgentToolsForm } from "@/components/eckokit/agent/agent-tools";
import { useConversation } from "@elevenlabs/react";
import { toast } from "sonner";
import { AgentConversations } from "@/components/eckokit/agent/agent-conversations";
import { authClient } from "@/lib/auth/auth-client";
import { User } from "better-auth/types";
import { formatDatetimeToAus } from "@/lib/utils";

const queryClient = new QueryClient();

export default function AgentContent({ user }: { user: User }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AgentContentInner user={user} />
    </QueryClientProvider>
  );
}

function AgentContentInner({ user }: { user: User }) {
  const { agent_id } = useParams();
  const { data: agent, isPending } = useGetAgentById(agent_id as string);
  const [currentlyTogglingAgentId, setCurrentlyTogglingAgentId] = useState<
    string | undefined
  >(undefined);
  const { mutate: toggleAgent } = useToggleAgentById(
    setCurrentlyTogglingAgentId
  );
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const [isConnectingToAgent, setIsConnectingToAgent] = useState(false);
  const conversation = useConversation({
    onConnect: () => {
      toast.success("Connected to agent");
      setIsConnectingToAgent(false);
    },
    onDisconnect: () => {
      toast.success("Disconnected from agent");
      setIsConnectingToAgent(false);
    },
    onError: (error) => {
      toast.error("Error connecting to agent", {
        description: error as string,
      });
      setIsConnectingToAgent(false);
    },
  });
  const handleStartConversation = async () => {
    try {
      setIsConnectingToAgent(true);

      // Request to microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation
      await conversation.startSession({
        agentId: agent?.agent?.agentExternalId ?? "",
        connectionType: "webrtc",
      });
    } catch (error) {
      toast.error("Error starting conversation", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      setIsConnectingToAgent(false);
    }
  };

  const handleEndConversation = async () => {
    await conversation.endSession();
  };

  const { mutate: createNotification } = useCreateNotification();
  const [currentlyDeletingAgentId, setCurrentlyDeletingAgentId] = useState<
    string | undefined
  >(undefined);
  const [currentlyDeletingAgentName, setCurrentlyDeletingAgentName] = useState<
    string | undefined
  >(undefined);
  const { mutate: deleteAgent, isPending: isDeletingAgent } =
    useDeleteAgentById(setCurrentlyDeletingAgentId);

  if (isPending) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
            {agent?.agent?.agentName}
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Agent ID: {agent?.agent?.agentExternalId}
            </p>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="p-1 h-5 w-5"
              title="Copy Agent ID"
              onClick={() => {
                navigator.clipboard.writeText(
                  agent?.agent?.agentExternalId ?? ""
                );
                toast.success("Copied to clipboard");
              }}
              disabled={!agent?.agent?.agentExternalId}
            >
              <Copy className="size-3.5 text-muted-foreground" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Created on{" "}
            {formatDatetimeToAus(new Date(agent?.agent?.createdAt ?? ""))}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {!agent?.agent?.archived ? (
            <Button
              onClick={() => {
                toggleAgent({
                  id: agent?.agent?.id ?? "",
                  organizationId: activeOrganization?.id ?? "",
                });
                createNotification({
                  title: `${agent?.agent?.agentName} has been unpublished`,
                  message: `${user.name} has unpublished the agent ${agent?.agent?.agentName}`,
                });
              }}
              disabled={currentlyTogglingAgentId === agent?.agent?.id}
            >
              {currentlyTogglingAgentId === agent?.agent?.id ? (
                <LoadingSpinner />
              ) : null}
              <Pause />
              Unpublish
            </Button>
          ) : (
            <Button
              onClick={() => {
                toggleAgent({
                  id: agent?.agent?.id ?? "",
                  organizationId: activeOrganization?.id ?? "",
                });
                createNotification({
                  title: `${agent?.agent?.agentName} has been published`,
                  message: `${user.name} has published the agent ${agent?.agent?.agentName}`,
                });
              }}
              disabled={currentlyTogglingAgentId === agent?.agent?.id}
            >
              {currentlyTogglingAgentId === agent?.agent?.id ? (
                <LoadingSpinner />
              ) : null}
              <Play />
              Publish
            </Button>
          )}
          {conversation.status === "connected" ? (
            <Button
              onClick={handleEndConversation}
              disabled={agent?.agent?.deleted || agent?.agent?.archived}
            >
              <BotIcon className="size-4" /> End Conversation
            </Button>
          ) : (
            <Button
              onClick={handleStartConversation}
              disabled={agent?.agent?.deleted || agent?.agent?.archived}
            >
              {isConnectingToAgent ? (
                <LoadingSpinner />
              ) : (
                <BotIcon className="size-4" />
              )}{" "}
              {agent?.agent?.deleted || agent?.agent?.archived
                ? "Publish to talk"
                : "Talk to Agent"}
            </Button>
          )}
          <Button
            onClick={() => {
              setCurrentlyDeletingAgentId(agent?.agent?.id ?? "");
              setCurrentlyDeletingAgentName(agent?.agent?.agentName ?? "");
            }}
            disabled={isDeletingAgent}
            variant="destructive"
          >
            {isDeletingAgent ? <LoadingSpinner /> : null}
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <AgentForm action="update" agentId={agent?.agent?.id ?? ""} />
        </TabsContent>
        <TabsContent value="tools">
          <AgentToolsForm />
        </TabsContent>
        <TabsContent value="conversations">
          <AgentConversations agentId={agent_id as string} />
        </TabsContent>
      </Tabs>

      <Modal
        showModal={!!currentlyDeletingAgentId}
        setShowModal={() => setCurrentlyDeletingAgentId(undefined)}
        className="max-w-md p-8"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-foreground">
              Delete Agent
            </h2>
            <p className="text-sm/6 text-foreground">
              Are you sure you want to delete your agent{" "}
              <span className="font-semibold">
                {currentlyDeletingAgentName}
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentlyDeletingAgentId(undefined)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                if (currentlyDeletingAgentId) {
                  deleteAgent({ id: currentlyDeletingAgentId });
                  redirect("/organizations");
                }
              }}
              disabled={isDeletingAgent}
            >
              {isDeletingAgent ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
