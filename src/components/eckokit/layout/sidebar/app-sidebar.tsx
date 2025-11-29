"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Building,
  Check,
  ChevronsUpDown,
  UserCircle2Icon,
  ArrowLeftRight,
} from "lucide-react";
import { PlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/eckokit/layout/sidebar/nav-main";
import { NavUser } from "@/components/eckokit/layout/sidebar/nav-user";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AppSidebarInner {...props} />
    </QueryClientProvider>
  );
}

export function AppSidebarInner({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  function setActiveOrganization(
    organizationId: string,
    organizationName: string
  ) {
    authClient.organization.setActive(
      { organizationId },
      {
        onSuccess: () => {
          toast.success("Switched to organization " + organizationName);
        },
        onError: (error) => {
          toast.error(error.error.message || "Failed to switch organization");
        },
      }
    );
  }

  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [isMobile, setOpenMobile, pathname]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:text-foreground h-10 group-data-[collapsible=icon]:px-0! hover:bg-[var(--primary)]/5">
                  <div className="flex flex-col items-start justify-start group-data-[collapsible=icon]:hidden">
                    <span className="font-regular text-xs text-muted-foreground">
                      Currently viewing as
                    </span>
                    <span className="font-semibold">
                      {activeOrganization?.name ?? "Personal"}
                    </span>
                  </div>
                  <ArrowLeftRight className="hidden group-data-[collapsible=icon]:block size-4 mx-auto" />
                  <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="mt-4 w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel>Switch Views</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={`/dashboard`}>
                  <DropdownMenuItem className="cursor-pointer flex flex-row items-center gap-3 justify-between">
                    <div className="flex flex-row items-center gap-3">
                      <UserCircle2Icon className="text-muted-foreground size-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Personal</span>
                        <span className="text-muted-foreground text-xs">
                          Active
                        </span>
                      </div>
                    </div>
                    {pathname === "/dashboard" && (
                      <Check className="text-muted-foreground size-4" />
                    )}
                  </DropdownMenuItem>
                </Link>
                {activeOrganization && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {organizations?.map((organization) => (
                      <DropdownMenuItem
                        className="cursor-pointer flex flex-row items-center gap-3 justify-between"
                        key={organization.id}
                        onClick={() =>
                          setActiveOrganization(
                            organization.id,
                            organization.name
                          )
                        }
                      >
                        <div className="flex flex-row items-center gap-3">
                          <Building className="text-muted-foreground size-4" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              <span className="text-sm font-medium">
                                {organization.name}
                              </span>
                            </span>
                          </div>
                        </div>
                        {activeOrganization.id === organization.id && (
                          <Check className="text-muted-foreground size-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/organizations">
                    <PlusIcon />
                    New Organization
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <NavMain />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
