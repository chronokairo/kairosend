import { redirect } from "next/navigation";

/** Root → Inbox (List Received Emails). */
export default function RootPage() {
  redirect("/inbox");
}
