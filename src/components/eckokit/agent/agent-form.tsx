"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateAgent,
  useGetAgentById,
  useUpdateAgentById,
} from "@/hooks/use-agent";
import { authClient } from "@/lib/auth/auth-client";
import { supportedLLMAgents } from "@/lib/utils";

const agentFormSchema = z.object({
  agentName: z.string().min(1),
  agentFirstMessage: z.string().min(1),
  agentPrompt: z.string().min(1),
  agentLLM: supportedLLMAgents,
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

interface AgentFormProps {
  action: "create" | "update";
  agentId?: string;
}

// Create Agent Form Component
function CreateAgentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: createAgent } = useCreateAgent();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      agentName: "",
      agentFirstMessage: "",
      agentPrompt: "",
      agentLLM: "gpt-4o-mini",
    },
  });

  const router = useRouter();

  const handleSubmit = async (values: AgentFormValues) => {
    try {
      setIsSubmitting(true);
      createAgent({
        agentName: values.agentName,
        organizationId: activeOrganization?.id ?? "",
        agentFirstMessage: values.agentFirstMessage,
        agentPrompt: values.agentPrompt,
        agentLLM: values.agentLLM,
      });
    } catch (error) {
      console.error("Agent creation error:", error);
      toast.error("Failed to create agent", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter agent name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the name of the agent.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agentFirstMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the first message..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the first message that the agent will say when
                    it is called.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agentPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the prompt..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the prompt that the agent will use to generate
                    its response.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agentLLM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent LLM</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4.1-mini">
                          GPT-4.1 Mini
                        </SelectItem>
                        <SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
                        <SelectItem value="gemini-2.0-flash">
                          Gemini 2.0 Flash
                        </SelectItem>
                        <SelectItem value="gemini-2.5-flash">
                          Gemini 2.5 Flash
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    The LLM that the agent will use to generate its response.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface UpdateAgentFormProps {
  agentId: string;
}

// Update Organization Form Component
function UpdateAgentForm({ agentId }: UpdateAgentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: updateAgent } = useUpdateAgentById();
  const { data: agent } = useGetAgentById(agentId);

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      agentName: "",
      agentFirstMessage: "",
      agentPrompt: "",
      agentLLM: "gpt-4o-mini",
    },
  });

  useEffect(() => {
    if (agent?.agent) {
      form.reset({
        agentName: agent.agent.agentName ?? "",
        agentFirstMessage: agent.agent.agentFirstMessage ?? "",
        agentPrompt: agent.agent.agentPrompt ?? "",
        agentLLM:
          (agent.agent.agentLLM as AgentFormValues["agentLLM"]) ??
          "gpt-4o-mini",
      });
    }
  }, [agent, form]);

  const handleSubmit = async (values: AgentFormValues) => {
    try {
      setIsSubmitting(true);
      updateAgent({
        organizationId: agent?.agent?.organizationId ?? "",
        agentId,
        agentName: values.agentName,
        agentFirstMessage: values.agentFirstMessage,
        agentPrompt: values.agentPrompt,
        agentLLM: values.agentLLM,
      });
    } catch (error) {
      console.error("Agent update error:", error);
      toast.error("Failed to update agent", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter agent name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the name of the agent.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agentFirstMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the first message..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the first message that the agent will say when
                    it is called.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agentPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the prompt..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the prompt that the agent will use to generate
                    its response.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agentLLM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent LLM</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-4.1-mini">
                          GPT-4.1 Mini
                        </SelectItem>
                        <SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
                        <SelectItem value="gemini-2.0-flash">
                          Gemini 2.0 Flash
                        </SelectItem>
                        <SelectItem value="gemini-2.5-flash">
                          Gemini 2.5 Flash
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    The LLM that the agent will use to generate its response.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Main Organization Form Component
export function AgentForm({ action, agentId }: AgentFormProps) {
  if (action === "create") {
    return <CreateAgentForm />;
  }
  if (action === "update") {
    return <UpdateAgentForm agentId={agentId as string} />;
  }
}
