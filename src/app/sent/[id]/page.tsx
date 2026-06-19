import { MailPreview } from "@/components/mail/MailPreview";

/** /sent/[id] — reading pane for a single sent email. */
export default function SentMessagePage({ params }: { params: { id: string } }) {
  return <MailPreview id={params.id} variant="sent" />;
}
