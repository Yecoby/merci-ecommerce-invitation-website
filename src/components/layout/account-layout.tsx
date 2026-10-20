import React from "react";
import Link from "next/link";
import { MerciLogo } from "@/components/ui/merci-logo";
import { LogOut, LayoutDashboard, Mail, Settings, User } from "lucide-react";

interface AccountNavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export function AccountNavbar({ user }: AccountNavbarProps) {
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#8B8278]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <MerciLogo size="md" withTagline={false} />
          <nav className="hidden md:flex items-center space-x-6 text-sm tracking-wide text-[#292824]">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-[#292824] hover:text-[#8B8278] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>My Invitations</span>
            </Link>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1.5 text-[#292824] hover:text-[#8B8278] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Orders</span>
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase tracking-wider font-semibold bg-[#292824] text-white rounded-none hover:bg-[#3D3B35] transition-colors"
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-medium text-[#292824]">
              {user?.name || "Customer"}
            </span>
            <span className="text-[11px] text-[#8B8278]">
              {user?.email}
            </span>
          </div>

          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#292824] border border-[#8B8278]/30 hover:border-[#292824] hover:bg-[#292824]/5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
