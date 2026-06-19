"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { EmptyState, ErrorState, LoadingState } from "./EmptyState";
import { MailListItem } from "./MailListItem";
import { toReceivedRow, toSentRow } from "./types";
import type { MailRow } from "./types";
import { useList } from "@/lib/hooks";
import { useSettings } from "@/lib/settings";
import type { ReceivedEmailListItem, SentEmail } from "@/lib/resend/types";

/** Reusable 380px list pane for inbox & sent views. */
export function MailList<T extends { id: string }>({
  apiPath,
  variant,
  selectedId,
  title,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: {
  apiPath: string;
  variant: "received" | "sent";
  /** Override; otherwise derived from the current URL. */
  selectedId?: string;
  title: string;
  emptyIcon?: string;
  emptyTitle: string;
  emptyDescription?: string;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const base = variant === "received" ? "/inbox" : "/sent";
  const activeId = selectedId ?? deriveActiveId(pathname, base);
  const { isConfigured } = useSettings();
  const { data, loading, error, hasMore, loadingMore, loadMore, reload } = useList<T>(
    isConfigured ? apiPath : null,
  );

  // Transform is selected here (not passed as a prop) so this client component
  // can be rendered from a server layout without crossing the RSC boundary.
  const transform = (item: T): MailRow =>
    variant === "received"
      ? toReceivedRow(item as unknown as ReceivedEmailListItem)
      : toSentRow(item as unknown as SentEmail);
  const rows = data.map(transform);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push(base);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, base]);

  return (
    <section className="flex w-list-width flex-col border-r border-outline-variant bg-surface-container-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant p-container-padding">
        <h2 className="font-display text-title-md font-bold">{title}</h2>
        <button onClick={reload} className="text-label-sm text-primary hover:underline" title="Refresh">
          Refresh
        </button>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto">
        {!isConfigured ? (
          <EmptyState
            icon="key"
            title="Connect your account"
            description="Open Settings and paste your Resend API key to load mail."
          />
        ) : loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : rows.length === 0 ? (
          <EmptyState icon={emptyIcon ?? "inbox"} title={emptyTitle} description={emptyDescription} />
        ) : (
          <>
            {rows.map((row) => (
              <MailListItem
                key={row.id}
                row={row}
                variant={variant}
                href={`${base}/${row.id}`}
                active={activeId === row.id}
              />
            ))}
            {hasMore && (
              <div className="p-container-padding text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="text-label-sm text-primary hover:underline disabled:opacity-50"
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/** Extract the selected message id from a path like /inbox/<id>. */
function deriveActiveId(pathname: string, base: string): string | undefined {
  if (!pathname.startsWith(base + "/")) return undefined;
  const seg = pathname.slice(base.length + 1).split("/")[0];
  return seg || undefined;
}
