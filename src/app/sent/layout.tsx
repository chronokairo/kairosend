import { AppShell } from "@/components/layout/AppShell";
import { MailList } from "@/components/mail/MailList";
import type { SentEmail } from "@/lib/resend/types";

/** Sent layout — shell + shared sent-email list (persists across previews). */
export default function SentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell title="Sent" searchPlaceholder="Search sent messages…">
      <MailList<SentEmail>
        apiPath="/api/emails"
        variant="sent"
        title="Sent"
        emptyIcon="send"
        emptyTitle="Nothing sent yet"
        emptyDescription="Emails you send with Resend will be listed here."
      />
      {children}
    </AppShell>
  );
}
