import { EmptyState } from "@/components/mail/EmptyState";

/** /sent — default reading pane before a message is selected. */
export default function SentIndexPage() {
  return (
    <section className="flex flex-1 flex-col bg-background">
      <EmptyState
        icon="forward_to_inbox"
        title="Select a message"
        description="Choose a sent item from the list to view its content and status."
      />
    </section>
  );
}
