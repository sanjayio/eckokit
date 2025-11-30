"use client";

import { AgentsList } from "@/components/eckokit/agent/agent-list";
import { Button } from "@/components/ui/button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const queryClient = new QueryClient();

export default function AgentsContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AgentsContentInner />
    </QueryClientProvider>
  );
}

function AgentsContentInner() {
  return (
    <div className="mb-4 p-2 space-y-4">
      <div className="flex flex-row items-start justify-between">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Agents</h1>
          <p className="text-muted-foreground">View and manage your agents.</p>
        </div>
        <Button variant="default" asChild>
          <Link href={`/agents/new`}>
            <PlusIcon />
            New Agent
          </Link>
        </Button>
      </div>

      <AgentsList />
    </div>
  );
}
