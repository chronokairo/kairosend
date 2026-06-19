import { EmptyState } from "@/components/mail/EmptyState";

/** /inbox — default reading pane before a message is selected. */
export default function InboxIndexPage() {
  return (
    <section className="flex flex-1 flex-col bg-background">
      <EmptyState
        icon="mark_email_unread"
        title="Select a message"
        description="Choose an item from the list to read it here."
      />
    </section>
  );
}
