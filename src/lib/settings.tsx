"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "kairosend.settings.v1";

export interface KairosendSettings {
  /** User's Resend API key (re_...). Stored locally only. */
  apiKey: string;
  /** Default "from" address / display name for the composer. */
  fromAddress: string;
  /** Display name shown in the sidebar profile chip. */
  displayName: string;
  /** Subtitle shown under the profile chip. */
  role: string;
}

const DEFAULTS: KairosendSettings = {
  apiKey: "",
  fromAddress: "",
  displayName: "Executive",
  role: "Resend Account",
};

interface SettingsContextValue {
  settings: KairosendSettings;
  ready: boolean;
  update: (patch: Partial<KairosendSettings>) => void;
  reset: () => void;
  isConfigured: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<KairosendSettings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore malformed storage */
    }
    setReady(true);
  }, []);

  const persist = (next: KairosendSettings) => {
    setSettings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep in-memory */
    }
  };

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      ready,
      update: (patch) => persist({ ...settings, ...patch }),
      reset: () => persist(DEFAULTS),
      isConfigured: Boolean(settings.apiKey),
    }),
    [settings, ready],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within <SettingsProvider>");
  return ctx;
}
