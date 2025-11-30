"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  BrushCleaningIcon,
  Copy,
  Pause,
  Pencil,
  Play,
  PlusIcon,
  SparklesIcon,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useDeleteAgentById,
  useGetAgentsByOrganizationId,
  useToggleAgentById,
} from "@/hooks/use-agent";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { useGetOrganizationCanCreateAgent } from "@/hooks/use-organization";
import { formatDatetimeToAus } from "@/lib/utils";

export function AgentsList() {
  const [currentlyDeletingAgent, setCurrentlyDeletingAgent] = useState<
    string | undefined
  >(undefined);
  const [currentlyDeletingAgentName, setCurrentlyDeletingAgentName] = useState<
    string | undefined
  >(undefined);
  const { data: activeOrganization, isPending: isActiveOrganizationLoading } =
    authClient.useActiveOrganization();

  const { mutate: deleteAgent, isPending: isDeletingAgent } =
    useDeleteAgentById(setCurrentlyDeletingAgent);

  const { data: canCreateAgent, isPending: isCanCreateAgentLoading } =
    useGetOrganizationCanCreateAgent(activeOrganization?.id ?? "");

  const { data: agents, isPending: isAgentsLoading } =
    useGetAgentsByOrganizationId(activeOrganization?.id ?? "");

  const [currentlyTogglingAgentId, setCurrentlyTogglingAgentId] = useState<
    string | undefined
  >(undefined);
  const { mutate: toggleAgent } = useToggleAgentById(
    setCurrentlyTogglingAgentId
  );

  const router = useRouter();

  if (
    isAgentsLoading ||
    isCanCreateAgentLoading ||
    isActiveOrganizationLoading
  ) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-border overflow-hidden py-12">
          <div className="flex items-center justify-center flex-col h-full w-full gap-4">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (agents?.agents?.length === 0 && canCreateAgent?.canCreateAgent) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-border overflow-hidden py-12">
          <div className="flex items-center justify-center flex-col h-full w-full gap-4">
            <BrushCleaningIcon className="size-12 mr-2" />
            <p className="text-sm text-muted-foreground">No agents found</p>
            <Button
              variant="outline"
              onClick={() => router.push("/agents/new")}
            >
              <PlusIcon />
              New Agent
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (agents?.agents?.length === 0 && !canCreateAgent?.canCreateAgent) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-border overflow-hidden py-12">
          <div className="flex items-center justify-center flex-col h-full w-full gap-4">
            <SparklesIcon className="size-12 mr-2" />
            <p className="text-sm text-muted-foreground">
              You need to upgrade to your plan to create an agent.
            </p>
            <Button
              variant="default"
              onClick={() => router.push("/organizations")}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y bg-background">
            <TableHeader className="bg-background">
              <TableRow>
                <TableHead
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Agent
                </TableHead>
                <TableHead
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created At
                </TableHead>
                <TableHead
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-background divide-y border-border">
              {agents?.agents?.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <div className="flex flex-col items-start justify-start">
                      {agent.agentName}
                      <div className="flex items-center gap-1 mt-1">
                        {!agent.archived ? (
                          <>
                            <span className="text-xs text-green-500">
                              Agent ID: {agent.agentExternalId}
                            </span>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="p-1 h-5 w-5"
                              title="Copy Agent ID"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  agent.agentExternalId
                                );
                                toast.success("Copied to clipboard");
                              }}
                            >
                              <Copy className="size-3.5 text-muted-foreground" />
                            </Button>
                          </>
                        ) : agent.deleted ? (
                          <span className="text-xs text-red-500">Deleted</span>
                        ) : (
                          <span className="text-xs text-yellow-500">
                            Unpublished
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {formatDatetimeToAus(new Date(agent.createdAt))}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground flex gap-2">
                    {!agent.archived ? (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          toggleAgent({
                            id: agent.id,
                            organizationId: activeOrganization?.id ?? "",
                          });
                        }}
                        disabled={
                          currentlyTogglingAgentId === agent.id || agent.deleted
                        }
                      >
                        {currentlyTogglingAgentId === agent.id ? (
                          <LoadingSpinner />
                        ) : (
                          <Pause className="size-5" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          toggleAgent({
                            id: agent.id,
                            organizationId: activeOrganization?.id ?? "",
                          });
                        }}
                        disabled={
                          currentlyTogglingAgentId === agent.id || agent.deleted
                        }
                      >
                        {currentlyTogglingAgentId === agent.id ? (
                          <LoadingSpinner />
                        ) : (
                          <Play className="size-5" />
                        )}
                      </Button>
                    )}
                    {!agent.deleted ? (
                      <Link href={`/agents/${agent.id}`}>
                        <Button variant="outline" size="icon">
                          <Pencil className="size-5" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={agent.deleted}
                      >
                        <Pencil className="size-5" />
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setCurrentlyDeletingAgent(agent.id);
                        setCurrentlyDeletingAgentName(agent.agentName);
                      }}
                      disabled={agent.deleted}
                    >
                      <Trash2 className="size-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        showModal={!!currentlyDeletingAgent}
        setShowModal={() => setCurrentlyDeletingAgent(undefined)}
        className="max-w-md p-8"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-foreground">
              Delete Agent
            </h2>
            <p className="text-sm/6 text-foreground">
              Are you sure you want to delete this agent{" "}
              <span className="font-semibold">
                {currentlyDeletingAgentName}
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentlyDeletingAgent(undefined)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                if (currentlyDeletingAgent) {
                  deleteAgent({ id: currentlyDeletingAgent });
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
