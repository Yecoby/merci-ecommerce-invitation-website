/**
 * End-to-end verification script for MERCI Authentication & Authorization.
 * Tests:
 * 1. GET /api/auth/providers (HTTP 200 with credentials provider)
 * 2. Login with incorrect password (rejected)
 * 3. Login with correct password (successful, returns session cookie)
 * 4. GET /api/auth/session with session cookie (persists session, role and id preserved)
 * 5. GET /api/invitations with session cookie (HTTP 200, ownership-isolated)
 * 6. GET /api/admin/inquiries with customer session cookie (HTTP 403 Forbidden)
 * 7. GET /api/admin/inquiries anonymously (HTTP 401 Unauthorized)
 */

async function main() {
  const baseUrl = "http://localhost:3000";
  console.log("Starting Auth E2E verification against", baseUrl);

  // 1. Providers endpoint check
  const providersRes = await fetch(`${baseUrl}/api/auth/providers`);
  if (providersRes.status !== 200) {
    throw new Error(`Expected /api/auth/providers status 200, got ${providersRes.status}`);
  }
  const providersData = await providersRes.json();
  if (!providersData.credentials || providersData.credentials.id !== "credentials") {
    throw new Error("Credentials provider missing from /api/auth/providers response");
  }
  console.log("✓ Step 1: GET /api/auth/providers returned HTTP 200 with credentials provider");

  // Get CSRF Token
  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
  const csrfCookies = csrfRes.headers.get("set-cookie") || "";
  const { csrfToken } = await csrfRes.json();
  if (!csrfToken) throw new Error("Could not fetch CSRF token");

  // 2. Login with INCORRECT password
  const wrongLoginRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: csrfCookies,
    },
    body: new URLSearchParams({
      csrfToken,
      email: "testcustomer@merci.ph",
      password: "WrongPassword999!",
      redirect: "false",
      json: "true",
    }),
  });

  const wrongCookie = wrongLoginRes.headers.get("set-cookie") || "";
  const wrongHasSession = wrongCookie.includes("authjs.session-token");
  if (wrongHasSession) {
    throw new Error("Rejected login issued a session cookie!");
  }
  console.log("✓ Step 2: Login with incorrect password did NOT issue a session cookie (rejected)");

  // 3. Login with CORRECT password
  const correctLoginRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: csrfCookies,
    },
    redirect: "manual",
    body: new URLSearchParams({
      csrfToken,
      email: "testcustomer@merci.ph",
      password: "Password123!",
      callbackUrl: `${baseUrl}/account`,
    }),
  });

  const sessionCookie = correctLoginRes.headers.get("set-cookie");
  if (!sessionCookie || (!sessionCookie.includes("authjs.session-token") && !sessionCookie.includes("__Secure-authjs.session-token"))) {
    throw new Error("Expected authjs.session-token in set-cookie header upon successful login");
  }
  console.log("✓ Step 3: Login with correct password succeeded and issued session cookie");

  // Extract the session token cookie
  const sessionTokenCookieStr = sessionCookie.split(",").map(c => c.trim().split(";")[0]).join("; ");

  // 4. Verify session persistence and role/id preservation via GET /api/auth/session
  const sessionCheckRes = await fetch(`${baseUrl}/api/auth/session`, {
    headers: {
      Cookie: sessionTokenCookieStr,
    },
  });
  if (sessionCheckRes.status !== 200) {
    throw new Error(`Expected /api/auth/session status 200, got ${sessionCheckRes.status}`);
  }
  const sessionData = await sessionCheckRes.json();
  if (!sessionData.user?.id || sessionData.user?.role !== "CUSTOMER" || sessionData.user?.email !== "testcustomer@merci.ph") {
    throw new Error(`Session data invalid or missing role/id: ${JSON.stringify(sessionData)}`);
  }
  console.log("✓ Step 4: GET /api/auth/session confirmed active session with trusted role='CUSTOMER' and id");

  // 5. Test accessing protected customer API: GET /api/invitations
  const invitationsRes = await fetch(`${baseUrl}/api/invitations`, {
    headers: {
      Cookie: sessionTokenCookieStr,
    },
  });
  if (invitationsRes.status !== 200) {
    throw new Error(`Expected /api/invitations status 200 for authenticated customer, got ${invitationsRes.status}`);
  }
  const invData = await invitationsRes.json();
  if (!invData.success) {
    throw new Error("/api/invitations failed");
  }
  console.log("✓ Step 5: Authenticated customer successfully queried their protected /api/invitations");

  // 6. Test vertical authorization escalation: CUSTOMER attempting admin endpoint GET /api/admin/inquiries
  const forbiddenAdminRes = await fetch(`${baseUrl}/api/admin/inquiries`, {
    headers: {
      Cookie: sessionTokenCookieStr,
    },
  });
  if (forbiddenAdminRes.status !== 403) {
    throw new Error(`Expected HTTP 403 Forbidden when customer accesses /api/admin/inquiries, got ${forbiddenAdminRes.status}`);
  }
  console.log("✓ Step 6: Customer account was correctly blocked from /api/admin/inquiries (HTTP 403 Forbidden)");

  // 7. Test anonymous access to protected admin endpoint
  const anonAdminRes = await fetch(`${baseUrl}/api/admin/inquiries`);
  if (anonAdminRes.status !== 401) {
    throw new Error(`Expected HTTP 401 Unauthorized for anonymous /api/admin/inquiries, got ${anonAdminRes.status}`);
  }
  console.log("✓ Step 7: Anonymous request was correctly blocked from /api/admin/inquiries (HTTP 401 Unauthorized)");

  console.log("\nALL AUTHENTICATION & AUTHORIZATION E2E VERIFICATIONS PASSED SUCCESSFULLY!");
}

main().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
