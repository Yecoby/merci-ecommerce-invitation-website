import { NextRequest } from "next/server";
import { PORTAL_COOKIE_NAME } from "@/lib/auth/portal-session";

export async function POST(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieHeader = `${PORTAL_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${
    isProduction ? "; Secure" : ""
  }`;

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookieHeader,
    },
  });
}
