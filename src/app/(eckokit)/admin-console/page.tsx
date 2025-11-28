import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth/auth";
import { Users } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserRow } from "@/components/eckokit/admin-console/user-row";

export default async function Dashboard() {
  const headersList = await headers();

  let session;
  let users;

  try {
    session = await auth.api.getSession({ headers: headersList });

    if (session == null) return redirect("/auth/sign-in");
    const hasAccess = await auth.api.userHasPermission({
      headers: headersList,
      body: { permission: { user: ["list"] } },
    });
    if (!hasAccess.success) return redirect("/dashboard");

    users = await auth.api.listUsers({
      headers: headersList,
      query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
    });
  } catch (error) {
    console.error("Error in admin console:", error);
    return redirect("/auth/sign-in");
  }

  return (
    <div className="max-w-2xl container my-4 px-4">
      <div className="flex-1">
        <div className="flex flex-col gap-1 justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{"Admin Console"}</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({users.total})
          </CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.users.map((user) => (
                  <UserRow key={user.id} user={user} selfId={session.user.id} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
