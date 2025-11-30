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
import { BrushCleaningIcon } from "lucide-react";
import { useGetConversationsByAgentId } from "@/hooks/use-agent";

interface AgentConversationsProps {
  agentId: string;
}

export function AgentConversations({ agentId }: AgentConversationsProps) {
  const { data: conversations, isPending: isConversationsLoading } =
    useGetConversationsByAgentId(agentId);

  if (isConversationsLoading) {
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

  if (conversations?.conversations?.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-border overflow-hidden py-12">
          <div className="flex items-center justify-center flex-col h-full w-full gap-4">
            <BrushCleaningIcon className="size-12 mr-2" />
            <p className="text-sm text-muted-foreground">
              No conversations found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full divide-y bg-background">
            <TableHeader className="bg-background">
              <TableRow>
                <TableHead
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Conversation ID
                </TableHead>
                <TableHead
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Conversation Summary
                </TableHead>
                <TableHead
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Conversation Start Time
                </TableHead>
                <TableHead
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Conversation Duration
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-background divide-y border-border">
              {conversations?.conversations?.map((conversation) => (
                <TableRow key={conversation.conversationId}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {conversation.conversationId}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {conversation.transcriptSummary?.substring(0, 50)}...
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground flex gap-2">
                    {new Date(
                      conversation.startTimeUnixSecs * 1000
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {conversation.callDurationSecs} seconds
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
