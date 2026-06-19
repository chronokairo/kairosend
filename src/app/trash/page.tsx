import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/mail/EmptyState";

export const metadata = { title: "Trash · Kairosend" };

/**
 * Trash — Resend has no server-side trash; canceled scheduled sends are the
 * closest concept (managed under Drafts). This view is a placeholder.
 */
export default function TrashPage() {
  return (
    <AppShell title="Trash" searchPlaceholder="Search mail…">
      <section className="flex flex-1 flex-col bg-background">
        <EmptyState
          icon="delete"
          title="Trash is empty"
          description="Resend does not keep a server-side trash. Canceled scheduled emails are listed under Drafts."
        />
      </section>
    </AppShell>
  );
}
