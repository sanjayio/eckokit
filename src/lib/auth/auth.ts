import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { sendEmailVerificationEmail } from "../emails/email-verification";
import { sendPasswordResetEmail } from "../emails/password-reset-email";
import { sendWelcomeEmail } from "../emails/welcome-email";
import { createAuthMiddleware } from "better-auth/api";
import { sendDeleteAccountVerificationEmail } from "../emails/delete-account-verification";
import { twoFactor } from "better-auth/plugins/two-factor";
import { passkey } from "@better-auth/passkey";
import {
  ac,
  admin as adminRole,
  user as userRole,
} from "@/components/eckokit/auth/permissions";
import { admin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";
import { sendOrganizationInviteEmail } from "../emails/organization-invite-email";
import { member } from "@/drizzle/schemas/auth-schema";
import { and, desc, eq } from "drizzle-orm";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import { STRIPE_PLANS } from "@/lib/auth/stripe";

const stripeApiKey = process.env.STRIPE_SECRET_KEY;
if (!stripeApiKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}
const stripeClient = new Stripe(stripeApiKey, {
  apiVersion: "2025-11-17.clover",
});

export const auth = betterAuth({
  appName: "Eckokit",
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
  socialProviders: {
    github: {
      clientId: process.env.GH_CLIENT_ID!,
      clientSecret: process.env.GH_CLIENT_SECRET!,
      mapProfileToUser: () => {
        return {
          leadSource: "github",
        };
      },
      enabled: true,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [
    nextCookies(),
    twoFactor(),
    passkey(),
    admin({
      ac,
      roles: {
        admin: adminRole,
        user: userRole,
      },
    }),
    organization({
      sendInvitationEmail: async (data, request) => {
        await sendOrganizationInviteEmail({
          invitation: data.invitation,
          inviter: data.inviter.user,
          organization: data.organization,
          email: data.email,
        });
      },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        authorizeReference: async ({ user, referenceId, action }) => {
          const memberItem = await db.query.member.findFirst({
            where: and(
              eq(member.organizationId, referenceId),
              eq(member.userId, user.id)
            ),
          });

          if (
            action === "upgrade-subscription" ||
            action === "cancel-subscription" ||
            action === "restore-subscription" ||
            action === "billing-portal"
          ) {
            return memberItem?.role === "owner";
          }

          return memberItem != null;
        },
        enabled: true,
        plans: STRIPE_PLANS,
      },
    }),
  ],
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
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }) => {
        await sendEmailVerificationEmail({
          user: { ...user, email: newEmail },
          url,
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerificationEmail({ user, url });
      },
    },
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
  databaseHooks: {
    session: {
      create: {
        before: async (userSession) => {
          const membership = await db.query.member.findFirst({
            where: eq(member.userId, userSession.userId),
            orderBy: desc(member.createdAt),
            columns: { organizationId: true },
          });

          return {
            data: {
              ...userSession,
              activeOrganizationId: membership?.organizationId,
            },
          };
        },
      },
    },
  },
});
