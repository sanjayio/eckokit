"use client";

import { AuthActionButton } from "@/components/eckokit/auth/auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import { useEffect, useRef, useState } from "react";

export default function VerifyEmail({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);

  function startEmailVerificationCountdown(time = 30) {
    setTimeToNextResend(time);

    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1;

        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, 1000);
  }

  useEffect(() => {
    startEmailVerificationCountdown(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mt-4 text-center">
        We sent you a verification link. Please check your email and click the
        link to verify your account.
      </p>

      <AuthActionButton
        variant="default"
        className="w-full"
        successMessage="Verification email sent!"
        disabled={timeToNextResend > 0}
        action={() => {
          startEmailVerificationCountdown();
          return authClient.sendVerificationEmail({
            email,
            callbackURL: "/dashboard",
          });
        }}
      >
        {timeToNextResend > 0
          ? `Resend Email (${timeToNextResend})`
          : "Resend Email"}
      </AuthActionButton>
    </div>
  );
}
