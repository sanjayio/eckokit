import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OrganizationSelect } from "@/components/eckokit/organizations/organization-select";
import { CreateOrganizationButton } from "@/components/eckokit/organizations/create-organization-button";
import { OrganizationTabs } from "@/components/eckokit/organizations/organization-tabs";

export default async function OrganizationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return redirect("/auth/sign-in");

  return (
    <div className="container mx-auto my-6 px-4">
      <div className="flex items-center mb-8 gap-2 max-w-2xl">
        <OrganizationSelect />
        <CreateOrganizationButton />
      </div>

      <OrganizationTabs />
    </div>
  );
}
