"use client";

import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Shield,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserMenu() {
  const { data: session } = authClient.useSession();
  const [hasPermission, setHasPermission] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    authClient.signOut().then(() => {
      router.push("/auth/sign-in");
    });
  };

  useEffect(() => {
    authClient.admin
      .hasPermission({ permission: { user: ["list"] } })
      .then((data) => {
        setHasPermission(data?.data?.success ?? false);
      });
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarFallback className="rounded-lg">
            {session?.user?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-60"
        align="end"
      >
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar>
              <AvatarFallback className="rounded-lg">
                {session?.user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {session?.user?.name}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {session?.user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/pricing" target="_blank">
              <Sparkles /> Upgrade
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account-settings">
              <BadgeCheck /> Account Settings
            </Link>
          </DropdownMenuItem>
          {hasPermission && (
            <DropdownMenuItem asChild>
              <Link href="/admin-console">
                <Shield /> Admin Console
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <div className="flex items-center gap-2">
            <LogOut />
            Log out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
