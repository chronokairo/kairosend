import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/mail/EmptyState";

export const metadata = { title: "Archive · Kairosend" };

/**
 * Archive — Resend does not expose a mailbox "archive" folder. This view is a
 * placeholder; archive semantics can be layered on locally later via tags.
 */
export default function ArchivePage() {
  return (
    <AppShell title="Archive" searchPlaceholder="Search mail…">
      <section className="flex flex-1 flex-col bg-background">
        <EmptyState
          icon="archive"
          title="Archive is empty"
          description="Resend has no server-side archive folder. Locally archived messages will appear here in a future release."
        />
      </section>
    </AppShell>
  );
}
