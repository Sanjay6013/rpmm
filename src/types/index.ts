import type { Role } from "@/generated/prisma/enums";

export interface NavItem {
  label: string;
  href: string;
}

export interface AdminNavItem extends NavItem {
  icon: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon?: string;
}

export interface HighlightItem {
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
}

export interface InfrastructureItem {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface ValueItem {
  title: string;
  description: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    };
  }
}
