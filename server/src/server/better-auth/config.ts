import { betterAuth } from "better-auth";
import { apiKey, organization } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { env } from "@/env";
import { db } from "@/server/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"
  }),
  plugins: [
    organization({}),
    apiKey({})
  ],
  emailAndPassword: {
    enabled: true,
    
  },
});

export type Session = typeof auth.$Infer.Session;
