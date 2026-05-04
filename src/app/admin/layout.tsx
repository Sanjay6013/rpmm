"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { AuthGuard } from "@/components/admin/auth-guard";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LoginForm } from "@/components/admin/login-form";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return <LoginForm />;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <AdminSidebar />
        <div className="lg:pl-64 flex flex-col flex-1">
          <AdminHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
