import { Icon } from "@/components/ui/Icon";

/** Empty / loading / error placeholder for the list & reading panes. */
export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-container-padding text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-outline-variant bg-surface-container text-primary">
        <Icon name={icon} className="text-[32px]" />
      </div>
      <h3 className="font-display text-title-md font-bold text-on-surface">{title}</h3>
      {description && <p className="max-w-sm text-body-md text-secondary">{description}</p>}
      {action}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-secondary">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
      <p className="text-label-sm">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-container-padding text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-error/20 bg-error-container/10 text-error">
        <Icon name="error" className="text-[32px]" />
      </div>
      <h3 className="font-display text-title-md font-bold text-on-surface">Something went wrong</h3>
      <p className="max-w-sm text-body-md text-secondary">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg border border-outline-variant px-4 py-2 text-label-sm font-bold text-on-surface hover:border-primary"
        >
          Retry
        </button>
      )}
    </div>
  );
}
