"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Settings,
  Users,
  Mail,
  Image,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Content", href: "/admin/content", icon: FileText },
  { label: "Articles", href: "/admin/articles", icon: Newspaper },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Waitlist", href: "/admin/waitlist", icon: Users },
  { label: "Contacts", href: "/admin/contacts", icon: Mail },
  { label: "Media", href: "/admin/media", icon: Image },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-black text-white p-2"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white z-40 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="text-headline-md font-bold tracking-tight">
            QULVA
          </Link>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-label-sm uppercase tracking-widest transition-all ${
                  isActive(item.href)
                    ? "bg-white text-black font-bold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/50 px-4 mb-3 truncate">
            {userEmail}
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-label-sm uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/10 w-full transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
