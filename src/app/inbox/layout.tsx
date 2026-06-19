import { AppShell } from "@/components/layout/AppShell";
import { MailList } from "@/components/mail/MailList";
import type { ReceivedEmailListItem } from "@/lib/resend/types";

/**
 * Inbox layout — renders the shell + the shared received-email list so it
 * persists while the reading pane (`children`) swaps per selected message.
 */
export default function InboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell title="Inbox" searchPlaceholder="Search received mail…">
      <MailList<ReceivedEmailListItem>
        apiPath="/api/receiving"
        variant="received"
        title="Inbox"
        emptyIcon="inbox"
        emptyTitle="No new mail"
        emptyDescription="Messages received by your verified domain will appear here."
      />
      {children}
    </AppShell>
  );
}
