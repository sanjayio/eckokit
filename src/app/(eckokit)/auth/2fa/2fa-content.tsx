import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { TotpForm } from "@/components/eckokit/auth/totp-form";
import { BackupCodeTab } from "@/components/eckokit/auth/backup-code-tab";
import Image from "next/image";

export default async function TwoFactorContent() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session !== null) return redirect("/dashboard");

  return (
    <div className="flex pb-8 lg:h-screen lg:pb-0">
      <div className="hidden w-1/2 bg-gray-100 lg:block">
        <Image
          width={1000}
          height={1000}
          src="/waveform.jpg"
          alt="Waveform image"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-md space-y-8 px-4">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold">
              Two-Factor Authentication
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Please verify your account using one of the methods below.
            </p>
          </div>

          <div className="my-6 px-4">
            <Card className="w-full max-w-md mx-auto">
              <CardContent>
                <Tabs defaultValue="totp">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="totp">Authenticator</TabsTrigger>
                    <TabsTrigger value="backup">Backup Code</TabsTrigger>
                  </TabsList>

                  <TabsContent value="totp">
                    <TotpForm />
                  </TabsContent>

                  <TabsContent value="backup">
                    <BackupCodeTab />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
