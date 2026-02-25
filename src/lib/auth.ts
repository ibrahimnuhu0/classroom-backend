import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; // your drizzle instance
import * as schema  from "../db/schema/auth"

    const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
    const frontendUrl = process.env.FRONTEND_URL;

    if (!betterAuthSecret) throw new Error("BETTER_AUTH_SECRET is not set");
    if (!frontendUrl) throw new Error("FRONTEND_URL is not set");

export const auth = betterAuth({
   secret: betterAuthSecret,
   trustedOrigins: [frontendUrl],
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema,
    }),

    emailAndPassword:{
      enabled: true,
    },
    user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "student",
         input: false, // Prevent client-side role assignment
      },
      imageCldPubId: {
        type: "string",
        required: false,
        input: true, // Allow imageCldPubId to be set during registration
      },
    },
  },
});