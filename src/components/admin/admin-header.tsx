"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { AdminSidebar } from "./admin-sidebar";

export function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-card flex items-center px-6 gap-4">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] p-0">
          <div className="flex h-16 items-center gap-2 px-6 border-b font-bold text-lg">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span>RPMM Admin</span>
          </div>
          <div className="py-4 px-3">
            <AdminSidebar />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <span className="text-sm text-muted-foreground hidden sm:block">
        {session?.user?.name}
      </span>

      <ThemeToggle />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/admin" })}
      >
        <LogOut className="h-4 w-4 mr-1" />
        Logout
      </Button>
    </header>
  );
}
