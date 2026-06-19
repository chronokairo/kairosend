"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { SettingsDialog } from "@/components/settings/SettingsDialog";

/** Three-pane shell: Sidebar (280px) + main content area with a top bar. */
export function AppShell({
  children,
  title,
  searchPlaceholder,
  onSearch,
}: {
  children: React.ReactNode;
  title: string;
  searchPlaceholder?: string;
  onSearch?: (q: string) => void;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <>
      <Sidebar onOpenSettings={() => setSettingsOpen(true)} />
      <TopBar title={title} searchPlaceholder={searchPlaceholder} onSearch={onSearch} />
      <main className="ml-sidebar-width flex h-screen pt-16 overflow-hidden">{children}</main>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
