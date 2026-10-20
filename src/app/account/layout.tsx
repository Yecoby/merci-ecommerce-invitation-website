/**
 * Account section layout.
 * Protects all /account/* routes — redirects unauthenticated users to /login.
 * The redirect happens server-side, before the page renders.
 */
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { AccountNavbar } from "@/components/layout/account-layout";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <AccountNavbar user={session.user} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  );
}

