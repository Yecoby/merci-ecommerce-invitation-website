/**
 * Full Customer & Host Journey E2E Verification Script for MERCI Digital Invitations.
 */

async function main() {
  const baseUrl = "http://localhost:3000";
  console.log("Starting Full Customer Journey verification against", baseUrl);

  // 1. Get CSRF Token
  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
  const csrfCookies = csrfRes.headers.get("set-cookie") || "";
  const { csrfToken } = await csrfRes.json();

  // 2. Log in as verified customer
  const loginRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
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

  const sessionCookie = loginRes.headers.get("set-cookie");
  if (!sessionCookie || !sessionCookie.includes("authjs.session-token")) {
    throw new Error("Failed to acquire session cookie during login");
  }
  const sessionTokenCookieStr = sessionCookie.split(",").map(c => c.trim().split(";")[0]).join("; ");
  console.log("✓ Authenticated session established for customer");

  // 3. Create an invitation via POST /api/invitations
  const createInvRes = await fetch(`${baseUrl}/api/invitations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: sessionTokenCookieStr,
    },
    body: JSON.stringify({
      templateSlug: "serenade-wedding",
      title: "Mateo & Sofia's Nuptials",
      hosts: "Mateo & Sofia",
      eventDate: "2027-02-14",
      time: "3:30 PM PHT",
      venueName: "Sanctuario de San Antonio",
      venueAddress: "Forbes Park, Makati City",
      story: "A love story written under the Manila skies.",
      dressCode: "Formal Garden Attire in Soft Neutrals",
      enableRSVP: true,
      maxGuests: 150,
      allowPlusOne: true,
    }),
  });

  if (createInvRes.status !== 201) {
    throw new Error(`Failed to create invitation, status: ${createInvRes.status}`);
  }
  const invCreated = await createInvRes.json();
  const publicSlug = invCreated.publicSlug;
  if (!publicSlug) throw new Error("No publicSlug returned from creation");
  console.log("✓ Saved new invitation draft with public slug:", publicSlug);

  // 4. Update the invitation to PUBLISHED status via PATCH /api/invitations/[slug]
  const publishRes = await fetch(`${baseUrl}/api/invitations/${publicSlug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: sessionTokenCookieStr,
    },
    body: JSON.stringify({
      status: "PUBLISHED",
      isPublic: true,
    }),
  });
  if (publishRes.status !== 200) {
    throw new Error(`Failed to publish invitation, status: ${publishRes.status}`);
  }
  console.log("✓ Published invitation live to public");

  // 5. Query public invitation details anonymously via GET /api/invitations/[slug]
  const anonViewRes = await fetch(`${baseUrl}/api/invitations/${publicSlug}`);
  if (anonViewRes.status !== 200) {
    throw new Error(`Failed to view public invitation anonymously, status: ${anonViewRes.status}`);
  }
  const anonData = await anonViewRes.json();
  if (anonData.invitation.rsvps !== undefined) {
    throw new Error("SECURITY LEAK: Public anonymous view returned private RSVPs array!");
  }
  console.log("✓ Public invitation viewed anonymously with private RSVP records successfully stripped");

  // 6. Submit a guest RSVP via POST /api/invitations/[slug]/rsvp
  const rsvpSubmitRes = await fetch(`${baseUrl}/api/invitations/${publicSlug}/rsvp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      guestName: "Isabella Martinez",
      email: "isabella@example.ph",
      attendance: "ATTENDING",
      attendeeCount: 2,
      attendeeNames: "Isabella Martinez, Marco Martinez",
      mealChoice: "Roast Beef",
      dietaryNotes: "Nut allergy",
      message: "Congratulations to both of you!",
    }),
  });
  if (rsvpSubmitRes.status !== 201) {
    const err = await rsvpSubmitRes.text();
    throw new Error(`Failed to submit guest RSVP: ${err}`);
  }
  console.log("✓ Guest RSVP submitted successfully with party count and dietary restrictions");

  // 7. Verify host can access their private RSVP list via GET /account/invitations/[slug]/rsvps
  const hostRsvpsPageRes = await fetch(`${baseUrl}/account/invitations/${publicSlug}/rsvps`, {
    headers: {
      Cookie: sessionTokenCookieStr,
    },
  });
  if (hostRsvpsPageRes.status !== 200) {
    throw new Error(`Failed to load host RSVP page, status: ${hostRsvpsPageRes.status}`);
  }
  const hostRsvpsHtml = await hostRsvpsPageRes.text();
  if (!hostRsvpsHtml.includes("Isabella Martinez") || !hostRsvpsHtml.includes("Nut allergy")) {
    throw new Error("Host RSVP dashboard did not display submitted guest details");
  }
  console.log("✓ Host successfully viewed guest RSVP list with headcount and dietary details");

  // 8. Submit custom concierge inquiry via POST /api/inquiries
  const inquiryRes = await fetch(`${baseUrl}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: "Camila Soriano",
      email: "camila@soriano.ph",
      eventType: "Wedding",
      eventDate: "2027-06-20",
      preferredStyle: "celestial-debut",
      guestCount: "200",
      budgetRange: "₱5,000 – ₱8,000",
      desiredFeatures: ["Custom Monogram", "Entourage Palette"],
      notes: "Looking for celestial aesthetics.",
      agreedToPrivacy: true,
    }),
  });
  if (inquiryRes.status !== 201) {
    throw new Error(`Failed to submit custom inquiry, status: ${inquiryRes.status}`);
  }
  console.log("✓ Custom concierge inquiry successfully persisted to database");

  // 9. Submit contact message via POST /api/contact
  const contactRes = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Rafael Alcantara",
      email: "rafael@example.ph",
      subject: "Partnership Inquiry",
      message: "We would like to discuss featuring your digital invitations for our venue.",
    }),
  });
  if (contactRes.status !== 201) {
    throw new Error(`Failed to submit contact message, status: ${contactRes.status}`);
  }
  console.log("✓ Contact message successfully persisted to database");

  console.log("\nALL FULL CUSTOMER JOURNEY TESTS PASSED WITH 100% SUCCESS!");
}

main().catch(err => {
  console.error("Journey verification failed:", err);
  process.exit(1);
});
