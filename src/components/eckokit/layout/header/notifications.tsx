"use client";

import { BellIcon, ClockIcon, TrashIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  useGetNotificationsByUserId,
  useMarkAllNotificationsAsRead,
} from "@/hooks/use-notification";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

const Notifications = () => {
  const isMobile = useIsMobile();
  const { mutate: markAllNotificationsAsRead } =
    useMarkAllNotificationsAsRead();
  const { data: notifications } = useGetNotificationsByUserId();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative"
          aria-label="Open notifications"
        >
          <BellIcon className="animate-tada" aria-hidden="true" />
          <span className="bg-destructive absolute end-0 top-0 block size-2 shrink-0 rounded-full" />
          <span className="sr-only">1 new notification</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isMobile ? "center" : "end"}
        className="ms-4 w-80 p-0"
      >
        <DropdownMenuLabel className="bg-background dark:bg-muted sticky top-0 z-10 p-0">
          <div className="flex items-center justify-between border-b px-4 py-4">
            <div className="font-medium">Notifications</div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => markAllNotificationsAsRead()}
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        </DropdownMenuLabel>

        <ScrollArea className="h-[350px]">
          {notifications?.notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="group flex cursor-pointer items-start gap-9 rounded-none border-b px-4 py-3"
            >
              <div className="flex flex-1 items-start gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <div className="dark:group-hover:text-default-800 truncate text-sm font-medium">
                    {notification.title}
                  </div>
                  <div className="dark:group-hover:text-default-700 text-muted-foreground line-clamp-1 text-xs">
                    {notification.message}
                  </div>
                  <div className="dark:group-hover:text-default-500 text-muted-foreground flex items-center gap-1 text-xs">
                    <ClockIcon className="size-3" />
                    {formatDistanceToNow(new Date(notification.createdAt))}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          {notifications?.notifications.length &&
            notifications?.notifications.length >= 10 && (
              <div className="flex flex-1 items-start gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <div
                    className="dark:group-hover:text-default-800 bg-muted text-center py-4 truncate text-sm font-medium cursor-pointer"
                    onClick={() => markAllNotificationsAsRead()}
                  >
                    Load more
                  </div>
                </div>
              </div>
            )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
