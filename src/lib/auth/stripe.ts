import { StripePlan } from "@better-auth/stripe";

const STRIPE_STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID!;
const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!;

export const STRIPE_PLANS = [
  {
    name: "starter",
    priceId: STRIPE_STARTER_PRICE_ID,
    limits: {
      projects: 10,
    },
  },
  {
    name: "pro",
    priceId: STRIPE_PRO_PRICE_ID,
    limits: {
      projects: 50,
    },
  },
] as const satisfies StripePlan[];

export const PLAN_TO_PRICE: Record<string, number> = {
  starter: 149,
  pro: 399,
};
