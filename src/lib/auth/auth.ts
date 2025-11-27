import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { sendEmailVerificationEmail } from "../emails/email-verification";
import { sendPasswordResetEmail } from "../emails/password-reset-email";
import { sendWelcomeEmail } from "../emails/welcome-email";
import { createAuthMiddleware } from "better-auth/api";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user, url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({ user, url });
    },
  },
  //   socialProviders: {
  //     github: {
  //       clientId: process.env.GITHUB_CLIENT_ID!,
  //       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  //       enabled: true,
  //     },
  //   },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [nextCookies()],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email,
        };

        if (user != null) {
          await sendWelcomeEmail(user);
        }
      }
    }),
  },
  user: {
    additionalFields: {
      leadSource: {
        type: "string",
        required: true,
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
