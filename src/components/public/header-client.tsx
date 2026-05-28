"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  GraduationCap,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface HeaderClientProps {
  schoolName: string;
  schoolFullName: string;
  tagline: string;
  phone: string | null;
  email: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
}

export function HeaderClient({
  schoolName,
  schoolFullName,
  tagline,
  phone,
  email,
  facebookUrl,
  twitterUrl,
  instagramUrl,
  youtubeUrl,
}: HeaderClientProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const socialLinks = [
    { href: facebookUrl, label: "FB" },
    { href: twitterUrl, label: "X" },
    { href: instagramUrl, label: "IG" },
    { href: youtubeUrl, label: "YT" },
  ].filter((s) => s.href);

  return (
    <header className={cn("sticky top-0 z-50 w-full transition-all duration-300")}>
      {/* Top Utility Bar */}
      <div
        className={cn(
          "gradient-primary text-white transition-all duration-300 overflow-hidden",
          scrolled ? "h-0 opacity-0" : "h-9 opacity-100"
        )}
      >
        <div className="container mx-auto flex h-9 items-center justify-between px-4 text-xs">
          <div className="hidden sm:flex items-center gap-4">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
              >
                <Phone className="h-3 w-3" />
                <span>{phone}</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
              >
                <Mail className="h-3 w-3" />
                <span>{email}</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors text-[10px] font-bold tracking-wide border border-white/20 rounded px-1.5 py-0.5 hover:border-white/40"
                aria-label={social.label}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={cn(
          "transition-all duration-300 border-b",
          scrolled
            ? "bg-background/80 backdrop-blur-md border-border shadow-sm"
            : "gradient-primary border-transparent"
        )}
      >
        <div className="container mx-auto flex h-18 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <GraduationCap
              className={cn(
                "h-7 w-7 transition-colors",
                scrolled ? "text-primary" : "text-white"
              )}
            />
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-bold text-lg leading-tight transition-colors",
                  scrolled ? "text-foreground" : "text-white"
                )}
              >
                {schoolName}
              </span>
              <span
                className={cn(
                  "text-xs leading-tight transition-colors hidden sm:block",
                  scrolled ? "text-muted-foreground" : "text-white/70"
                )}
              >
                {tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "header-nav-link relative px-3 py-2 text-sm font-medium transition-colors rounded-md",
                    isActive
                      ? scrolled
                        ? "text-primary"
                        : "text-white"
                      : scrolled
                        ? "text-muted-foreground hover:text-foreground"
                        : "text-white/75 hover:text-white"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className={cn(
                        "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full gradient-primary w-6"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <div
              className={cn(
                "transition-colors",
                scrolled ? "[&>button]:text-muted-foreground [&>button]:hover:text-foreground [&>button]:hover:bg-accent"
                  : "[&>button]:text-white/80 [&>button]:hover:text-white [&>button]:hover:bg-white/15"
              )}
            >
              <ThemeToggle />
            </div>
            <Link href="/contact">
              <Button
                size="sm"
                className={cn(
                  "rounded-full gap-1.5 text-xs font-semibold shadow-md transition-all",
                  scrolled
                    ? "gradient-primary text-white shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                    : "bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm border border-white/20"
                )}
              >
                Contact Us
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex md:hidden items-center gap-1">
            <div
              className={cn(
                "transition-colors",
                scrolled
                  ? "[&>button]:text-muted-foreground"
                  : "[&>button]:text-white/80"
              )}
            >
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cn(
                "inline-flex items-center justify-center rounded-md h-9 w-9 cursor-pointer transition-colors hover:bg-white/20",
                scrolled ? "text-foreground hover:bg-accent" : "text-white"
              )}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[280px] bg-popover shadow-xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="gradient-primary p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/15 rounded-xl p-1.5">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">{schoolName}</p>
                <p className="text-[10px] tracking-wide uppercase text-white/70">
                  {tagline}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Items */}
        <nav className="flex flex-col p-4 gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full gradient-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile CTA */}
        <div className="p-4 border-t">
          <Link href="/contact" onClick={() => setOpen(false)}>
            <Button className="w-full gradient-primary text-white rounded-lg gap-2">
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          {(phone || email) && (
            <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Phone className="h-3 w-3" />
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  {email}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
