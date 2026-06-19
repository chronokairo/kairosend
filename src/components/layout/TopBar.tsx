"use client";

import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/** Top app bar with search + section title. Mirrors the mockup header. */
export function TopBar({
  title,
  searchPlaceholder = "Search mail...",
  onSearch,
}: {
  title: string;
  searchPlaceholder?: string;
  onSearch?: (q: string) => void;
}) {
  return (
    <header className="fixed left-sidebar-width right-0 top-0 z-20 flex h-16 items-center justify-between bg-surface px-container-padding">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-outline-variant/40 to-transparent" />
      <div className="flex flex-1 items-center gap-stack-md">
        <div className="relative w-full max-w-xl">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-secondary"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2 pl-10 pr-4 text-body-md transition-all placeholder:text-outline focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-stack-md">
        <IconButton className="relative" aria-label="Notifications">
          <Icon name="notifications" />
        </IconButton>
        <IconButton aria-label="Apps">
          <Icon name="apps" />
        </IconButton>
        <div className={cn("mx-2 h-6 w-px bg-outline-variant")} />
        <p className="font-display text-body-md font-bold text-primary">{title}</p>
      </div>
    </header>
  );
}
