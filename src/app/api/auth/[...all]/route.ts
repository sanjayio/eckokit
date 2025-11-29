import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import arcjet, {
  BotOptions,
  detectBot,
  EmailOptions,
  protectSignup,
  shield,
  slidingWindow,
  SlidingWindowRateLimitOptions,
} from "@arcjet/next";
import { findIp } from "@arcjet/ip";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["userIdOrIp"],
  rules: [shield({ mode: "LIVE" })],
});

const botSettings = {
  mode: "LIVE",
  allow: ["STRIPE_WEBHOOK"],
} satisfies BotOptions;

const restrictiveRateLimitSettings = {
  mode: "LIVE",
  interval: "10m",
  max: 10,
} satisfies SlidingWindowRateLimitOptions<[]>;

const laxRateLimitSettings = {
  mode: "LIVE",
  interval: "1m",
  max: 60,
} satisfies SlidingWindowRateLimitOptions<[]>;

const emailSettings = {
  mode: "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

async function checkArcjet(request: Request) {
  const body = (await request.clone().json()) as unknown;
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const userIdOrIp = (session?.user.id ?? findIp(request)) || "127.0.0.1";
  const url = new URL(request.url);

  if (url.pathname.endsWith("/auth/sign-up")) {
    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      return aj
        .withRule(
          protectSignup({
            email: emailSettings,
            rateLimit: restrictiveRateLimitSettings,
            bots: botSettings,
          })
        )
        .protect(request, {
          email: body.email,
          userIdOrIp,
        });
    } else {
      return aj
        .withRule(detectBot(botSettings))
        .withRule(slidingWindow(restrictiveRateLimitSettings))
        .protect(request, {
          userIdOrIp,
        });
    }
  }

  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(request, {
      userIdOrIp,
    });
}

const authHandler = toNextJsHandler(auth);
export const { GET } = authHandler;

export async function POST(request: Request) {
  const decision = await checkArcjet(request);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Invalid email address format";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email address";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "No MX records found, check email domain.";
      } else {
        message = "Email address is not valid";
      }

      return Response.json(
        {
          message,
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          error: "Unknown error occurred",
        },
        {
          status: 403,
        }
      );
    }
  }
  return await authHandler.POST(request);
}
