import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";
import { organization, subscription } from "@/drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

export const organizationRouter = router({
  getOrganizationCanCreateAgent: privateProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { organizationId } = input;

      const dbOrganization = await ctx.db
        .select()
        .from(organization)
        .where(eq(organization.id, organizationId))
        .limit(1);

      if (dbOrganization.length === 0) {
        return c.json({ canCreateAgent: false });
      }

      const orgSubscriptions = await ctx.db
        .select()
        .from(subscription)
        .where(
          and(
            eq(subscription.referenceId, organizationId),
            eq(subscription.status, "active")
          )
        )
        .orderBy(desc(subscription.periodEnd))
        .limit(1);

      if (orgSubscriptions.length === 0) {
        return c.json({ canCreateAgent: false });
      }

      return c.json({ canCreateAgent: true });
    }),
});
