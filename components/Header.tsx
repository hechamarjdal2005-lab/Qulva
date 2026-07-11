"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const DEFAULT_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBn-TRAhUnCP49ltKLp4DBzEby5vxXSob1PXhDhzwq0SRR6tp4YYRdG1GHAimX5VvCplzvIfTTeK1JR4fDwKS5dddkN1tsrTn10nHp5A-rjjXA6jY-ZuBpm6XLqfD_aSqtL5i3thJUSdlKp_0JdqYttuUuvOw4VP9Faj6LoptlQlAlUeEJ-PqLNGhBoFNqK1ZSWVATciM2aw57WbIkN8WVhM1aCCcCw7epSiX6V_dGEg6b9iBKnp7_OWPn63MDnhMqR6-My5R3Rtg";

interface HeaderProps {
  brandName: string;
  logoUrl: string;
}

export default function Header({ brandName, logoUrl }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const logo = logoUrl || DEFAULT_LOGO;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 md:px-8 md:pt-5">
        <div className="max-w-[1280px] mx-auto bg-stone-100/95 backdrop-blur-xl rounded-full border border-stone-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between px-4 py-2 md:px-8 md:py-3.5">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                alt={`${brandName} Logo`}
                className="h-13 w-auto transition-transform duration-500 group-hover:scale-105"
                src={logo}
                referrerPolicy="no-referrer"
              />
              <span className="text-headline-md font-bold tracking-tight text-stone-900 hidden sm:block">
                {brandName}
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] rounded-full transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-stone-900 bg-stone-900/10"
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-900/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-stone-600 hover:text-stone-900 transition-colors p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden max-w-[1280px] mx-auto mt-2 bg-stone-100/95 backdrop-blur-xl rounded-3xl border border-stone-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-5 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-[11px] font-medium uppercase tracking-[0.15em] rounded-2xl transition-all ${
                    isActive(item.href)
                      ? "text-stone-900 bg-stone-900/10"
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-900/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to offset the fixed navbar height */}
      <div className="h-16 md:h-24" aria-hidden="true" />
    </>
  );
}
