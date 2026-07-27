"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/logo.png";
import LogoText from "@/public/logo_text.png";
import { useUIStore } from "@/stores/useUIStore";
import Button from "@/components/Button/Button";

export function AdminMobileTopBar() {
  const { toggleAdminSidebar } = useUIStore();

  return (
    <header className="md:hidden fixed top-0 inset-x-0 z-50 h-14 bg-surface border-b border-outline flex items-center gap-3 px-4">
      <Button
        variant="ghost"
        size="xs"
        onClick={toggleAdminSidebar}
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </Button>
      <Image src={Logo} alt="CYV Logo" width={28} height={28} className="shrink-0" />
      <div className="flex flex-col gap-1">
        <Image src={LogoText} alt="CraftYourVacations" height={16} className="h-4 w-auto" />
        <span className="self-start px-1.5 py-0.5 rounded bg-primary/10 text-primary text-label-sm">Admin</span>
      </div>
    </header>
  );
}
