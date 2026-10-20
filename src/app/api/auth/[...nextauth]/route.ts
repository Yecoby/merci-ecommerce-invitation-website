/**
 * Auth.js route handler for /api/auth/[...nextauth].
 * This single file handles all auth callbacks (sign-in, sign-out, session, etc.)
 */
import { handlers } from "@/lib/auth/auth";

export const { GET, POST } = handlers;

