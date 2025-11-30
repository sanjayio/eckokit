import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";
import { member, organization, subscription } from "@/drizzle/schema";
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

      // Verify user is a member of the organization
      const membership = await ctx.db
        .select()
        .from(member)
        .where(
          and(
            eq(member.organizationId, organizationId),
            eq(member.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (membership.length === 0) {
        return c.json({ canCreateAgent: false });
      }

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
