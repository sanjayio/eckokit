"use client";

import Link from "next/link";
import Image from "next/image";
import VerifyEmail from "@/components/eckokit/auth/verify-email";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth/auth-client";

export default function VerifyEmailContent() {
  const router = useRouter();
  const toBeVerifiedEmail = useSearchParams().get("email");

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data !== null) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  if (!toBeVerifiedEmail) {
    router.push("/");
  }

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
            <h2 className="mt-6 text-3xl font-bold">Verify your email</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              You will need to verify your email address to continue.
            </p>
          </div>

          <VerifyEmail email={toBeVerifiedEmail!} />

          <div className="mt-6">
            <div className="mt-6 text-center text-sm">
              Sign in with a different email address?{" "}
              <Link href="/auth/sign-in" className="underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
