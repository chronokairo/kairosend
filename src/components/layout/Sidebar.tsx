"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { useSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/inbox", label: "Inbox", icon: "inbox" },
  { href: "/sent", label: "Sent", icon: "send" },
  { href: "/drafts", label: "Drafts", icon: "drafts" },
  { href: "/archive", label: "Archive", icon: "archive" },
  { href: "/trash", label: "Trash", icon: "delete" },
] as const;

/** Sidebar navigation — DESIGN.md § Layout (Collapsible Sidebar 280px). */
export function Sidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const pathname = usePathname();
  const { settings, isConfigured } = useSettings();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-sidebar-width flex-col border-r border-outline-variant bg-surface py-container-padding">
      {/* Brand */}
      <div className="mb-stack-lg px-container-padding">
        <h1 className="mb-1 font-display text-title-md font-bold text-primary">Kairosend</h1>
        <p className="text-label-sm uppercase tracking-widest text-secondary opacity-60">
          Resend · Executive Mail
        </p>
      </div>

      {/* Compose FAB-equivalent */}
      <div className="mb-stack-lg px-container-padding">
        <Link
          href="/compose"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-3 px-4 font-display text-body-lg font-bold text-on-primary-container shadow-gold transition-all hover:opacity-90 active:scale-95"
        >
          <Icon name="edit" className="text-[20px]" filled />
          Compose
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-container-padding py-stack-sm transition-colors duration-200",
                active
                  ? "email-item-active text-primary"
                  : "text-secondary hover:text-primary",
              )}
            >
              <Icon name={item.icon} filled={active} />
              <span className="font-display text-body-lg">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-outline-variant pt-stack-md">
        <button
          onClick={onOpenSettings}
          className="flex w-full items-center gap-3 px-container-padding py-stack-sm text-secondary transition-colors hover:text-primary"
        >
          <Icon name="settings" />
          <span className="font-display text-body-lg">Settings</span>
          {!isConfigured && (
            <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-primary" />
          )}
        </button>
        <a
          href="https://resend.com/docs"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-container-padding py-stack-sm text-secondary transition-colors hover:text-primary"
        >
          <Icon name="help" />
          <span className="font-display text-body-lg">Support</span>
        </a>

        <div className="mt-stack-md flex items-center gap-3 px-container-padding">
          <Avatar label={settings.displayName} size={32} />
          <div className="overflow-hidden">
            <p className="truncate text-label-sm font-bold">{settings.displayName}</p>
            <p className="truncate text-[10px] text-secondary">{settings.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
