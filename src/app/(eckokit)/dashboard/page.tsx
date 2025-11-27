"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export default function Dashboard() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  if (isSessionLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.name}</p>
      <Button onClick={() => authClient.signOut()}>Sign out</Button>
    </div>
  );
}
