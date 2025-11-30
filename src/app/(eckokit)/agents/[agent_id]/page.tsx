import { generateMeta } from "@/lib/utils";
import { redirect } from "next/navigation";
import AgentContent from "./agent-content";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { user } from "@/drizzle/schemas/auth-schema";

export async function generateMetadata() {
  return generateMeta({
    title: "EditAgent",
    description: "Edit an agent",
    canonical: "/agents/[agent_id]",
  });
}

export default async function Page() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    return redirect("/auth/sign-in");
  }

  const currentUser = await db.query.user.findFirst({
    columns: { id: true },
    where: eq(user.id, session.user.id),
  });

  if (!currentUser) {
    return redirect("/auth/sign-in");
  }

  return (
    <>
      <AgentContent user={session.user} />
    </>
  );
}
