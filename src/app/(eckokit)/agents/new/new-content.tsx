"use client";

import { AgentForm } from "@/components/eckokit/agent/agent-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function NewContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <NewContentInner />
    </QueryClientProvider>
  );
}

function NewContentInner() {
  return (
    <div className="mb-4 p-2 flex flex-col space-y-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create new Agent</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new AI Voice Agent for your organization.
        </p>
      </div>

      <AgentForm action="create" />
    </div>
  );
}
