import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ComposeForm } from "@/components/mail/ComposeForm";
import { LoadingState } from "@/components/mail/EmptyState";

export const metadata = { title: "Compose · Kairosend" };

/** Compose — Send Email (POST /api/emails/send), with optional scheduling. */
export default function ComposePage() {
  return (
    <AppShell title="Compose" searchPlaceholder="Search mail…">
      <section className="custom-scrollbar pane-rise flex flex-1 flex-col overflow-y-auto bg-surface-dim p-gutter lg:p-container-padding">
        <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
          <Suspense fallback={<LoadingState label="Loading composer…" />}>
            <ComposeForm />
          </Suspense>
        </div>
      </section>
    </AppShell>
  );
}
