import { z } from "zod";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";
import { notification } from "@/drizzle/schema";
import { eq, desc, and, inArray } from "drizzle-orm";

export const notificationRouter = router({
  createNotification: privateProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        message: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { title, message } = input;
      const { user } = ctx;

      const newNotification = await ctx.db
        .insert(notification)
        .values({
          title,
          message,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return c.json({ notification: newNotification[0] });
    }),

  markAllNotificationsAsRead: privateProcedure.mutation(async ({ c, ctx }) => {
    const { user } = ctx;

    const dbNotifications = await ctx.db
      .select({ id: notification.id })
      .from(notification)
      .where(
        and(eq(notification.userId, user.id), eq(notification.read, false))
      )
      .orderBy(desc(notification.createdAt))
      .limit(10);

    const notificationIds = dbNotifications.map(
      (notification) => notification.id
    );

    if (notificationIds.length !== 0) {
      await ctx.db
        .update(notification)
        .set({ read: true, updatedAt: new Date() })
        .where(inArray(notification.id, notificationIds));
    }

    return c.json({ success: true });
  }),

  markNotificationAsReadById: privateProcedure
    .input(
      z.object({
        notificationId: z.string(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { notificationId } = input;
      const { user } = ctx;

      const dbNotification = await ctx.db
        .select()
        .from(notification)
        .where(
          and(
            eq(notification.id, notificationId),
            eq(notification.userId, user.id)
          )
        )
        .limit(1);

      if (dbNotification.length === 0) {
        throw new Error("Notification not found");
      }

      try {
        // Update notification in database
        const updatedNotification = await ctx.db
          .update(notification)
          .set({
            read: true,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(notification.id, notificationId),
              eq(notification.userId, user.id)
            )
          )
          .returning();

        return c.json({ notification: updatedNotification[0] });
      } catch (error) {
        console.error("Error updating notification", error);
        throw new Error(
          error instanceof Error ? error.message : "Error updating notification"
        );
      }
    }),

  getNotificationsByUserId: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx;

    const notifications = await ctx.db
      .select()
      .from(notification)
      .where(
        and(eq(notification.userId, user.id), eq(notification.read, false))
      )
      .orderBy(desc(notification.createdAt))
      .limit(10);

    return c.json({ notifications: notifications });
  }),
});
