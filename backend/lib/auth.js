import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, db } from "./db.js";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:3000",
  ],
});
