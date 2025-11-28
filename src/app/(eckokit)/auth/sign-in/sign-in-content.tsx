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
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { SocialAuthButtons } from "@/components/eckokit/auth/social-auth-buttons";
import { PasskeyButton } from "@/components/eckokit/auth/passkey-button";

const signInSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(8),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInContent() {
  const router = useRouter();
  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data !== null) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleSignIn = async (data: SignInForm) => {
    await authClient.signIn.email(
      { ...data, callbackURL: "/dashboard" },
      {
        onError: (error) => {
          if (error.error.code === "EMAIL_NOT_VERIFIED") {
            router.push(`/auth/verify-email?email=${data.email}`);
          }
          toast.error(error.error.message || "Failed to sign in");
        },
        onSuccess: () => {
          toast.success("Sign in successful");
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
            <h2 className="mt-6 text-3xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Please sign in to your account
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignIn)}
              className="space-y-4"
            >
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="email webauthn"
                            placeholder="example@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            autoComplete="current-password webauthn"
                            placeholder="Password"
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
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </Form>

          <Separator />

          <div className="grid grid-cols-1 gap-3">
            <SocialAuthButtons />
            <PasskeyButton />
          </div>

          <div className="mt-6">
            <div className="mt-3 text-center text-sm">
              Forgot your password?{" "}
              <Link href="/auth/forgot-password" className="underline">
                Reset password
              </Link>
            </div>
            <div className="mt-3 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
