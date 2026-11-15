"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Library", href: "/explore" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">

        {/* Logo */}

        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-background font-editorial text-2xl">
            R
          </div>

          <div>
            <h1 className="font-editorial text-2xl font-bold leading-none">
              RootScroll
            </h1>

            <p className="text-[9px] tracking-[0.2em] text-muted uppercase mt-1">
              A library of code & thought
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}

        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors duration-300 ${
                  active
                    ? "text-primary font-semibold"
                    : "text-muted hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions */}

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          <Link
            href="/login"
            className="text-sm text-foreground hover:text-primary transition"
          >
            Sign in
          </Link>

          <Link
            href="/explore"
            className="px-5 py-3 rounded-full bg-primary text-background text-sm font-medium hover:opacity-90 transition"
          >
            Explore Books
          </Link>
        </div>

        {/* Mobile Menu Button */}

        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="h-10 w-10 flex items-center justify-center rounded-lg border border-border"
          >
            <span className="text-2xl">
              {menuOpen ? "×" : "☰"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}

      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-border px-5 py-6 space-y-5 animate-fade-up">

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="block text-sm"
          >
            Sign in
          </Link>

          <Link
            href="/explore"
            onClick={() => setMenuOpen(false)}
            className="block text-center bg-primary text-background py-3 rounded-full text-sm"
          >
            Explore Books
          </Link>
        </div>
      )}
    </header>
  );
}