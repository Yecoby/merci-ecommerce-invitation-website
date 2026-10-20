import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/permissions";
import { AccountNavbar } from "@/components/layout/account-layout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/account");
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <AccountNavbar user={user} />
      <div className="bg-[#292824] text-[#FAF8F3] py-2 px-4 text-center text-xs tracking-widest uppercase">
        MERCI Studio · Admin Workspace
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
