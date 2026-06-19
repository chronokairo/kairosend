import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background text-center">
      <h1 className="font-display text-display font-bold text-primary">404</h1>
      <p className="text-body-lg text-secondary">This message could not be found.</p>
      <Link
        href="/inbox"
        className="rounded-lg bg-primary px-6 py-2 text-label-sm font-bold text-on-primary transition-all hover:opacity-90 active:scale-95"
      >
        Back to Inbox
      </Link>
    </div>
  );
}
