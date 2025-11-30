import { useGetUsageByOrganizationId } from "@/hooks/use-agent";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";

const UsageWidget = () => {
  const { data: activeOrganization, isPending: isActiveOrganizationLoading } =
    authClient.useActiveOrganization();

  const { data: usage, isPending: isUsageLoading } =
    useGetUsageByOrganizationId(activeOrganization?.id ?? "");

  if (isUsageLoading || isActiveOrganizationLoading || !usage) {
    return (
      <div className="bg-foreground/10 mt-1.5 rounded-md border">
        <div className="space-y-3 p-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Minutes</h4>
            <div className="text-muted-foreground flex items-center text-sm">
              <span className="mx-1">Unavailable</span>
            </div>
          </div>
          <Progress value={0} />
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Calls</h4>
            <div className="text-muted-foreground flex items-center text-sm">
              <span className="mx-1">Unavailable</span>
            </div>
          </div>
          <Progress value={0} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-foreground/10 mt-1.5 rounded-md border">
      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Minutes</h4>
          <div className="text-muted-foreground flex items-center text-sm">
            <span className="mx-1">{usage.totalMinutes.toFixed(2)} / 200</span>
            mins
          </div>
        </div>
        <Progress value={(usage.totalMinutes / 200) * 100} />
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Calls</h4>
          <div className="text-muted-foreground flex items-center text-sm">
            <span className="mx-1">{usage?.totalCalls} / 155</span>
            calls
          </div>
        </div>
        <Progress value={(usage.totalCalls / 155) * 100} />
        <div className="text-muted-foreground flex items-center justify-end text-sm">
          <Button asChild className="w-full">
            <Link href="/organizations" target="_blank">
              Upgrade
              <ArrowTopRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsageWidget;
