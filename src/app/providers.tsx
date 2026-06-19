"use client";

import { SettingsProvider } from "@/lib/settings";

/** Wraps the app with client-side providers (settings store for the API key). */
export function Providers({ children }: { children: React.ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>;
}
