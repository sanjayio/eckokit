"use client";

import { authClient } from "@/lib/auth/auth-client";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard() {
  const {
    data: session,
    isPending: isSessionLoading,
    error: sessionError,
  } = authClient.useSession();

  if (sessionError) {
    toast.error(sessionError.message || "Error in dashboard");
    return redirect("/auth/sign-in");
  }

  if (isSessionLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.name}</p>
    </div>
  );
}
