"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";

const resetPasswordSchema = z.object({
  password: z.string().min(6),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordContent() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const error = useSearchParams().get("error");

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  if (token === null || error !== null) {
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
              <h2 className="mt-6 text-3xl font-bold">Uh oh!</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                We&apos;ve receoved an invalid token or it has expired. Please
                try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleResetPassword = async (data: ResetPasswordForm) => {
    await authClient.resetPassword(
      {
        newPassword: data.password,
        token: token,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to reset password");
        },
        onSuccess: () => {
          toast.success("Password reset successful", {
            description: "Redirection to login...",
          });
          setTimeout(() => {
            router.push("/auth/sign-in");
          }, 1000);
        },
      }
    );
  };

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
            <h2 className="mt-6 text-3xl font-bold">Reset your password</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Please enter your new password to reset your account password.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleResetPassword)}
              className="space-y-4"
            >
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="New password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Resetting password..." : "Reset password"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
