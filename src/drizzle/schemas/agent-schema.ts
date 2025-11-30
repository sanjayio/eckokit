import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { organization, user } from "./auth-schema";

export const agent = pgTable(
  "agent",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    agentExternalId: text("agent_external_id").notNull(),
    agentName: text("agent_name").notNull(),
    agentFirstMessage: text("agent_first_message"),
    agentPrompt: text("agent_prompt"),
    agentLLM: text("agent_llm").notNull(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    end_call_tool: boolean("end_call_tool").default(false).notNull(),
    skip_turn_tool: boolean("skip_turn_tool").default(false).notNull(),
    transfer_to_number_tool: boolean("transfer_to_number_tool")
      .default(false)
      .notNull(),
    transfer_to_number_phone: text("transfer_to_number_phone"),
    archived: boolean("archived").default(true).notNull(),
    deleted: boolean("deleted").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("agent_organizationId_idx").on(table.organizationId),
    index("agent_userId_idx").on(table.userId),
  ]
);
