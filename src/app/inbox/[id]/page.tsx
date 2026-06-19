import { MailPreview } from "@/components/mail/MailPreview";

/** /inbox/[id] — reading pane for a single received email. */
export default function InboxMessagePage({ params }: { params: { id: string } }) {
  return <MailPreview id={params.id} variant="received" />;
}
