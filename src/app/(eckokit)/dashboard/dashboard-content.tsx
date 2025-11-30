"use client";

import { authClient } from "@/lib/auth/auth-client";

export default function DashboardContent() {
  const { data: session } = authClient.useSession();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.name}</p>
    </div>
  );
}
