import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";
import {
  ac,
  admin as adminRole,
  user as userRole,
} from "@/components/eckokit/auth/permissions";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    passkeyClient(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = "/auth/2fa";
      },
    }),
    adminClient({
      ac,
      roles: {
        admin: adminRole,
        user: userRole,
      },
    }),
    organizationClient(),
    stripeClient({
      subscription: true,
    }),
  ],
});
