"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Info,
  Image,
  Calendar,
  Newspaper,
  Megaphone,
  Mail,
  Settings,
  Users,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Home,
  Info,
  Image,
  Calendar,
  Newspaper,
  Megaphone,
  Mail,
  Settings,
  Users,
};

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Home Page", href: "/admin/content/home", icon: "Home" },
  { label: "About Page", href: "/admin/content/about", icon: "Info" },
  { label: "Gallery", href: "/admin/content/gallery", icon: "Image" },
  { label: "Events", href: "/admin/content/events", icon: "Calendar" },
  { label: "News", href: "/admin/content/news", icon: "Newspaper" },
  { label: "Announcements", href: "/admin/announcements", icon: "Megaphone" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "Mail" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
  { label: "Users", href: "/admin/users", icon: "Users" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-card">
      <AdminSidebarNav pathname={pathname} />
    </aside>
  );
}

export function AdminSidebarNav({ pathname }: { pathname: string }) {
  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3">
      <ul className="space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "gradient-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
