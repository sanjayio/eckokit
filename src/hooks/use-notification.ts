import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { toast } from "sonner";

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      message,
    }: {
      title: string;
      message: string;
    }) => {
      const res = await client.notifications.createNotification.$post({
        title,
        message,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Error creating notification"
      );
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await client.notifications.markAllNotificationsAsRead.$post(
        {}
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error marking all notifications as read"
      );
    },
  });
};

export const useMarkNotificationAsReadById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ notificationId }: { notificationId: string }) => {
      const res = await client.notifications.markNotificationAsReadById.$post({
        notificationId,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-notifications"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error marking notification as read"
      );
    },
  });
};

export const useGetNotificationsByUserId = () => {
  return useQuery({
    queryKey: ["get-notifications"],
    queryFn: async () => {
      const res = await client.notifications.getNotificationsByUserId.$get({});
      return await res.json();
    },
  });
};
