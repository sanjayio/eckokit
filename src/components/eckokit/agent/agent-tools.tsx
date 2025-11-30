"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon, Save } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Switch } from "@/components/ui/switch";
import { useGetAgentById, useUpdateAgentToolsById } from "@/hooks/use-agent";
import { Input } from "@/components/ui/input";

type AgentToolsValues = {
  end_call_tool: boolean;
  skip_turn_tool: boolean;
  transfer_to_number_tool: boolean;
  transfer_to_number_phone: string;
};

// Update Agent Tools Form Component
function UpdateAgentToolsForm() {
  const { agent_id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: agent, isPending } = useGetAgentById(agent_id as string);
  const { mutate: updateAgentTools } = useUpdateAgentToolsById();
  const [agentToolsValues, setAgentToolsValues] = useState<AgentToolsValues>({
    end_call_tool: agent?.agent?.end_call_tool ?? false,
    skip_turn_tool: agent?.agent?.skip_turn_tool ?? false,
    transfer_to_number_tool: agent?.agent?.transfer_to_number_tool ?? false,
    transfer_to_number_phone: agent?.agent?.transfer_to_number_phone ?? "",
  });

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (
        agentToolsValues?.transfer_to_number_tool &&
        agentToolsValues?.transfer_to_number_phone?.length === 0
      ) {
        toast.error(
          "Phone number is required when transfer to human is enabled"
        );
        setIsSubmitting(false);
        return;
      }
      updateAgentTools(
        {
          agentId: agent_id as string,
          end_call: agentToolsValues?.end_call_tool ?? false,
          skip_turn: agentToolsValues?.skip_turn_tool ?? false,
          transfer_to_human: agentToolsValues?.transfer_to_number_tool ?? false,
          transfer_to_human_phone:
            agentToolsValues?.transfer_to_number_phone ?? "",
        },
        {
          onSettled: () => setIsSubmitting(false),
        }
      );
    } catch (error) {
      console.error("Agent tools update error:", error);
      toast.error("Failed to update agent tools", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center flex-1 h-full w-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle>Tools</CardTitle>
            <CardDescription>Set your agent tools</CardDescription>
          </div>
          <div className="flex items-center justify-end">
            <Button onClick={() => handleSubmit()} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Save />
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-border ">
              <TableHeader className="bg-background">
                <TableRow>
                  <TableHead
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider"
                  >
                    Tool
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider"
                  >
                    Enabled?
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider"
                  >
                    Params
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-background divide-y divide-border">
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <div className="flex flex-col gap-1">
                      <span className="text-foreground">End Call</span>
                      <span className="text-muted-foreground text-xs">
                        Agents can end the call when enabled.
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <Switch
                      checked={agentToolsValues?.end_call_tool ?? false}
                      onCheckedChange={(checked) => {
                        setAgentToolsValues((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            end_call_tool: checked,
                          };
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <div className="flex flex-col gap-1">
                      <span className="text-foreground">Skip Turn</span>
                      <span className="text-muted-foreground text-xs">
                        Agents can skip their turn when the caller explicitly
                        indicates they need a moment.
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <Switch
                      checked={agentToolsValues?.skip_turn_tool ?? false}
                      onCheckedChange={(checked) => {
                        setAgentToolsValues((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            skip_turn_tool: checked,
                          };
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground"></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <div className="flex flex-col gap-1">
                      <span className="text-foreground">Transfer to Human</span>
                      <span className="text-muted-foreground text-xs">
                        Agents can transfer the call to a human when requested.
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <Switch
                      checked={
                        agentToolsValues?.transfer_to_number_tool ?? false
                      }
                      onCheckedChange={(checked) => {
                        setAgentToolsValues((prev) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            transfer_to_number_tool: checked,
                          };
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    <div className="flex flex-col gap-1">
                      <span className="text-foreground">Phone Number</span>
                      <Input
                        onChange={(e) => {
                          setAgentToolsValues((prev) => {
                            if (!prev) return prev;
                            return {
                              ...prev,
                              transfer_to_number_phone: e.target.value,
                            };
                          });
                        }}
                        disabled={!agentToolsValues?.transfer_to_number_tool}
                        placeholder="+61444444444"
                        value={agentToolsValues?.transfer_to_number_phone ?? ""}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Organization Form Component
export function AgentToolsForm() {
  return <UpdateAgentToolsForm />;
}
