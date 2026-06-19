"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
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
  const { isConfigured, settings } = useSettings();
  const { data, loading, error, hasMore, loadingMore, loadMore, reload } = useList<T>(
    isConfigured ? apiPath : null,
  );


  // Extract email address for filtering
  const filterEmail = useMemo(() => {
    const match = settings.fromAddress?.match(/<([^>]+)>/);
    return (match ? match[1] : settings.fromAddress?.trim())?.toLowerCase() || "";
  }, [settings.fromAddress]);

  const rows = useMemo(() => {
    // Transform is selected here (not passed as a prop) so this client component
    // can be rendered from a server layout without crossing the RSC boundary.
    const transform = (item: T): MailRow =>
      variant === "received"
        ? toReceivedRow(item as unknown as ReceivedEmailListItem)
        : toSentRow(item as unknown as SentEmail);

    const allRows = data.map(transform);
    if (!filterEmail) return allRows;

    return allRows.filter((row) => {
      if (variant === "received") {
        return row.to?.some((t) => t.toLowerCase().includes(filterEmail));
      } else {
        return row.from?.toLowerCase().includes(filterEmail);
      }
    });
  }, [data, filterEmail, variant]);

  // Auto-fetch if local filtering emptied the chunk but more data exists on the server
  useEffect(() => {
    if (data.length > 0 && rows.length === 0 && hasMore && !loading && !loadingMore) {
      loadMore();
    }
  }, [data.length, rows.length, hasMore, loading, loadingMore, loadMore]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push(base);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, base]);

  return (
    <section className="relative flex w-list-width flex-col bg-surface-container-lowest">
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-outline-variant/40 to-transparent z-10" />
      <div className="relative flex items-center justify-between p-container-padding">
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-outline-variant/40 to-transparent" />
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
