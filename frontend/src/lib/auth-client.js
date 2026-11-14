import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client configuration for KeenKeeper Next.js frontend.
 * Provides hooks for user sessions and authentication actions.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

export const { signIn, signUp, useSession, signOut } = authClient;
