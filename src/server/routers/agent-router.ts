import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";
import { agent, organization, subscription } from "@/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { supportedLLMAgents } from "@/lib/utils";
import { Llm } from "@elevenlabs/elevenlabs-js/api/types";

const client = new ElevenLabsClient({
  environment: "https://api.elevenlabs.io",
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export const agentRouter = router({
  deleteAgentById: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { id } = input;

      const dbAgent = await ctx.db
        .select()
        .from(agent)
        .where(eq(agent.id, id))
        .limit(1);

      if (dbAgent.length === 0) {
        throw new Error("Agent not found");
      }

      await client.conversationalAi.agents.update(dbAgent[0].agentExternalId, {
        platformSettings: {
          archived: true,
        },
      });

      await ctx.db
        .update(agent)
        .set({ archived: true, deleted: true, updatedAt: new Date() })
        .where(eq(agent.id, id));

      return c.json({
        organizationId: dbAgent[0].organizationId,
        agentId: dbAgent[0].id,
      });
    }),

  getAgentById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { id } = input;

      const dbAgent = await ctx.db
        .select()
        .from(agent)
        .where(and(eq(agent.id, id), eq(agent.deleted, false)))
        .limit(1);

      if (dbAgent.length === 0) {
        throw new Error("Agent not found");
      }

      return c.json({ agent: dbAgent[0] });
    }),

  getUsageByOrganizationId: privateProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { organizationId } = input;

      const dbOrganization = await ctx.db
        .select()
        .from(organization)
        .where(eq(organization.id, organizationId))
        .limit(1);

      if (dbOrganization.length === 0) {
        throw new Error("Organization not found");
      }

      const dbAgents = await ctx.db
        .select({ agentExternalId: agent.agentExternalId })
        .from(agent)
        .where(eq(agent.organizationId, organizationId));

      if (dbAgents.length === 0) {
        throw new Error("Agents not found");
      }

      const agentIds = dbAgents.map((agent) => agent.agentExternalId);

      const allConversations = [];
      let cursor: string | undefined = undefined;

      for (const agentId of agentIds) {
        cursor = undefined;
        while (true) {
          const conversations =
            await client.conversationalAi.conversations.list({
              agentId: agentId,
              cursor,
            });

          allConversations.push(...conversations.conversations);
          cursor = conversations.nextCursor;

          if (!conversations.hasMore) {
            break;
          }
        }
      }

      const totalMinutes = allConversations.reduce((acc, conversation) => {
        return acc + conversation.callDurationSecs / 60;
      }, 0);

      const totalCalls = allConversations.length;

      return c.json({ totalMinutes, totalCalls });
    }),

  getConversationsByAgentId: privateProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { agentId } = input;

      const dbAgent = await ctx.db
        .select()
        .from(agent)
        .where(and(eq(agent.id, agentId), eq(agent.deleted, false)))
        .limit(1);

      if (dbAgent.length === 0) {
        throw new Error("Agent not found");
      }

      const allConversations = [];
      let cursor: string | undefined = undefined;

      while (true) {
        const conversations = await client.conversationalAi.conversations.list({
          summaryMode: "include",
          agentId: dbAgent[0].agentExternalId,
          cursor,
        });

        allConversations.push(...conversations.conversations);
        cursor = conversations.nextCursor;

        if (!conversations.hasMore) {
          break;
        }
      }
      return c.json({ conversations: allConversations });
    }),

  updateAgentToolsById: privateProcedure
    .input(
      z.object({
        id: z.string(),
        end_call: z.boolean(),
        skip_turn: z.boolean(),
        transfer_to_human: z.boolean(),
        transfer_to_human_phone: z.string().optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const {
        id,
        end_call,
        skip_turn,
        transfer_to_human,
        transfer_to_human_phone,
      } = input;

      const dbAgent = await ctx.db
        .select()
        .from(agent)
        .where(and(eq(agent.id, id), eq(agent.deleted, false)))
        .limit(1);

      if (dbAgent.length === 0) {
        throw new Error("Agent not found");
      }

      const newBuiltInTools: Record<
        string,
        { name: string; params: { systemToolType: string } }
      > = {};

      if (end_call) {
        newBuiltInTools["endCall"] = {
          name: "end_call",
          params: {
            systemToolType: "end_call" as const,
          },
        };
      }
      if (skip_turn) {
        newBuiltInTools["skipTurn"] = {
          name: "skip_turn",
          params: {
            systemToolType: "skip_turn" as const,
          },
        };
      }

      if (transfer_to_human && !transfer_to_human_phone?.trim()) {
        throw new Error(
          "Error updating agent tools: Phone number is required when transfer to human is enabled"
        );
      }

      if (transfer_to_human) {
        newBuiltInTools["transferToNumber"] = {
          name: "transfer_to_number",
          params: {
            systemToolType: "transfer_to_number" as const,
            // @ts-expect-error: 'transfers' is not part of the type but required by runtime
            transfers: [
              {
                condition: "When the caller wants to talk to a human",
                phoneNumber: transfer_to_human_phone ?? "",
                transferDestination: {
                  type: "phone",
                  phoneNumber: transfer_to_human_phone ?? "",
                },
                transferType: "conference",
              },
            ],
          },
        };
      }

      try {
        await client.conversationalAi.agents.update(
          dbAgent[0].agentExternalId,
          {
            conversationConfig: {
              agent: {
                prompt: {
                  builtInTools: newBuiltInTools,
                },
              },
            },
          }
        );
      } catch (error) {
        console.error("Error updating agent tools:", error);
        throw new Error("Error updating agent tools");
      }

      await ctx.db
        .update(agent)
        .set({
          end_call_tool: end_call,
          skip_turn_tool: skip_turn,
          transfer_to_number_tool: transfer_to_human,
          transfer_to_number_phone: transfer_to_human_phone,
          updatedAt: new Date(),
        })
        .where(eq(agent.id, id));

      return c.json({ success: true, agentId: id });
    }),

  updateAgentById: privateProcedure
    .input(
      z.object({
        organizationId: z.string(),
        agentId: z.string(),
        agentName: z.string().min(1),
        agentFirstMessage: z.string().min(1),
        agentPrompt: z.string().min(1),
        agentLLM: supportedLLMAgents,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const {
        organizationId,
        agentId,
        agentName,
        agentFirstMessage,
        agentPrompt,
        agentLLM,
      } = input;

      const existingAgent = await ctx.db
        .select()
        .from(agent)
        .where(and(eq(agent.id, agentId), eq(agent.deleted, false)))
        .limit(1);

      if (existingAgent.length === 0) {
        throw new Error("Agent not found");
      }

      await client.conversationalAi.agents.update(
        existingAgent[0].agentExternalId,
        {
          name: `${organizationId}--${agentName}`,
          conversationConfig: {
            agent: {
              firstMessage: agentFirstMessage,
              prompt: {
                prompt: agentPrompt,
                llm: agentLLM as Llm,
              },
            },
          },
        }
      );

      await ctx.db
        .update(agent)
        .set({
          agentName,
          agentFirstMessage,
          agentPrompt,
          agentLLM,
          updatedAt: new Date(),
        })
        .where(eq(agent.id, agentId));

      return c.json({ success: true, agentId });
    }),

  toggleAgentById: privateProcedure
    .input(
      z.object({
        id: z.string(),
        organizationId: z.string(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { id, organizationId } = input;

      const dbAgent = await ctx.db
        .select()
        .from(agent)
        .where(
          and(
            eq(agent.id, id),
            eq(agent.organizationId, organizationId),
            eq(agent.deleted, false)
          )
        )
        .limit(1);

      if (dbAgent.length === 0) {
        throw new Error("Agent not found");
      }

      await client.conversationalAi.agents.update(dbAgent[0].agentExternalId, {
        platformSettings: {
          archived: !dbAgent[0].archived,
        },
      });

      const updatedAgent = await ctx.db
        .update(agent)
        .set({
          archived: !dbAgent[0].archived,
          updatedAt: new Date(),
        })
        .where(eq(agent.id, id))
        .returning();

      return c.json({ agent: updatedAgent[0] });
    }),

  createAgent: privateProcedure
    .input(
      z.object({
        organizationId: z.string(),
        agentName: z.string().min(1),
        agentFirstMessage: z.string().min(1),
        agentPrompt: z.string().min(1),
        agentLLM: supportedLLMAgents,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const {
        organizationId,
        agentName,
        agentFirstMessage,
        agentPrompt,
        agentLLM,
      } = input;

      const { user: currentUser } = ctx;

      const orgSubscriptions = await ctx.db
        .select()
        .from(subscription)
        .where(
          and(
            eq(subscription.referenceId, organizationId),
            eq(subscription.status, "active")
          )
        )
        .limit(1);

      if (orgSubscriptions.length === 0) {
        throw new Error("Organization does not have an active subscription");
      }

      const createdAgent = await client.conversationalAi.agents.create({
        tags: [
          "zenvoflow",
          `user_${currentUser.id}`,
          `organization_${organizationId}`,
        ],
        name: `${organizationId}--${agentName}`,
        platformSettings: {
          archived: true,
          callLimits: {
            agentConcurrencyLimit: 1,
            dailyLimit: 20,
            burstingEnabled: false,
          },
          privacy: {
            retentionDays: 7,
            deleteAudio: true,
            deleteTranscriptAndPii: true,
            applyToExistingConversations: true,
          },
        },
        conversationConfig: {
          turn: {
            turnTimeout: 10,
            silenceEndCallTimeout: 10,
          },
          tts: {
            modelId: "eleven_flash_v2",
          },
          conversation: {
            maxDurationSeconds: 180,
          },
          agent: {
            firstMessage: agentFirstMessage,
            disableFirstMessageInterruptions: true,
            prompt: {
              prompt: agentPrompt,
              llm: agentLLM as Llm,
              timezone: "Australia/Sydney",
            },
          },
        },
      });

      await ctx.db.insert(agent).values({
        agentExternalId: createdAgent.agentId,
        agentName,
        agentFirstMessage,
        agentPrompt,
        agentLLM,
        organizationId,
        userId: currentUser.id,
        archived: true,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return c.json({ agentId: createdAgent.agentId, organizationId });
    }),

  getAllAgentsByOrganizationId: privateProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { organizationId } = input;

      const dbOrganizations = await ctx.db
        .select({ id: organization.id })
        .from(organization)
        .where(eq(organization.id, organizationId))
        .limit(1);

      if (dbOrganizations.length === 0) {
        return c.json({ agents: [] });
      }

      const agents = await ctx.db
        .select()
        .from(agent)
        .where(eq(agent.organizationId, organizationId))
        .orderBy(desc(agent.createdAt));

      return c.json({ agents });
    }),
});
