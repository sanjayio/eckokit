import { StripePlan } from "@better-auth/stripe";

export const STRIPE_PLANS = [
  {
    name: "starter",
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    limits: {
      projects: 10,
    },
  },
  {
    name: "pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    limits: {
      projects: 50,
    },
  },
] as const satisfies StripePlan[];

export const PLAN_TO_PRICE: Record<string, number> = {
  starter: 149,
  pro: 399,
};
