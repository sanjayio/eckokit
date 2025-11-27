import { BellIcon, ClockIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Notifications = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsInner />
    </QueryClientProvider>
  );
};

const NotificationsInner = () => {
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <>
            <BellIcon className="animate-tada" />
            <span className="bg-destructive absolute end-0 top-0 block size-2 shrink-0 rounded-full">
              1
            </span>
          </>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isMobile ? "center" : "end"}
        className="ms-4 w-80 p-0"
      >
        <DropdownMenuLabel className="bg-background dark:bg-muted sticky top-0 z-10 p-0">
          <div className="flex justify-between border-b px-6 py-4">
            <div className="font-medium">Notifications</div>
            <Button
              variant="link"
              className="h-auto p-0 text-xs"
              size="sm"
              asChild
            >
              <Link href="#">View all</Link>
            </Button>
          </div>
        </DropdownMenuLabel>

        <ScrollArea className="h-[350px]">
          <DropdownMenuItem className="group flex cursor-pointer items-start gap-9 rounded-none border-b px-4 py-3">
            <div className="flex flex-1 items-start gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <div className="dark:group-hover:text-default-800 truncate text-sm font-medium">
                  Your order is placed
                </div>
                <div className="dark:group-hover:text-default-700 text-muted-foreground line-clamp-1 text-xs">
                  Amet minim mollit non deser unt ullamco est sit aliqua.
                </div>
                <div className="dark:group-hover:text-default-500 text-muted-foreground flex items-center gap-1 text-xs">
                  <ClockIcon className="size-3!" />2 days ago
                </div>
                <div className="dark:group-hover:text-default-500 text-muted-foreground flex items-center gap-1 text-xs text-end justify-end cursor-pointer">
                  <TrashIcon className="size-3!" />
                  Click to dismiss
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
