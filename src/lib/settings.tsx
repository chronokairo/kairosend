"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "kairosend.settings.v2";
const LEGACY_STORAGE_KEY = "kairosend.settings.v1";

export interface KairosendSettings {
  id: string;
  /** User's Resend API key (re_...). Stored locally only. */
  apiKey: string;
  /** Default "from" address / display name for the composer. */
  fromAddress: string;
  /** Display name shown in the sidebar profile chip. */
  displayName: string;
  /** Subtitle shown under the profile chip. */
  role: string;
}

const DEFAULTS: Omit<KairosendSettings, "id"> = {
  apiKey: "",
  fromAddress: "",
  displayName: "Executive",
  role: "Resend Account",
};

interface SettingsState {
  accounts: KairosendSettings[];
  activeId: string | null;
}

interface SettingsContextValue {
  settings: KairosendSettings;
  accounts: KairosendSettings[];
  ready: boolean;
  isConfigured: boolean;
  update: (patch: Partial<KairosendSettings>) => void;
  reset: () => void;
  switchAccount: (id: string) => void;
  addAccount: (account?: Partial<KairosendSettings>) => void;
  removeAccount: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SettingsState>({ accounts: [], activeId: null });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let loaded: SettingsState | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) loaded = JSON.parse(raw);
    } catch {
      /* ignore malformed storage */
    }

    // Migration from v1
    if (!loaded) {
      try {
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          const parsed = JSON.parse(legacy);
          const newId = generateId();
          loaded = {
            accounts: [{ ...DEFAULTS, ...parsed, id: newId }],
            activeId: newId,
          };
        }
      } catch {
        // ignore
      }
    }

    if (!loaded || !loaded.accounts || loaded.accounts.length === 0) {
      const newId = generateId();
      loaded = {
        accounts: [{ ...DEFAULTS, id: newId }],
        activeId: newId,
      };
    }

    setState(loaded);
    setReady(true);
  }, []);

  const persist = (next: SettingsState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const activeAccount = useMemo(() => {
    return state.accounts.find((a) => a.id === state.activeId) || state.accounts[0] || { ...DEFAULTS, id: "temp" };
  }, [state]);

  const value = useMemo<SettingsContextValue>(() => {
    return {
      settings: activeAccount,
      accounts: state.accounts,
      ready,
      isConfigured: Boolean(activeAccount.apiKey),
      update: (patch) => {
        persist({
          ...state,
          accounts: state.accounts.map((a) => (a.id === activeAccount.id ? { ...a, ...patch } : a)),
        });
      },
      reset: () => {
        persist({
          ...state,
          accounts: state.accounts.map((a) => (a.id === activeAccount.id ? { ...DEFAULTS, id: a.id } : a)),
        });
      },
      switchAccount: (id: string) => {
        if (state.accounts.some((a) => a.id === id)) {
          persist({ ...state, activeId: id });
        }
      },
      addAccount: (account) => {
        const newId = generateId();
        persist({
          accounts: [...state.accounts, { ...DEFAULTS, ...account, id: newId }],
          activeId: newId,
        });
      },
      removeAccount: (id: string) => {
        const nextAccounts = state.accounts.filter((a) => a.id !== id);
        if (nextAccounts.length === 0) {
          const newId = generateId();
          persist({ accounts: [{ ...DEFAULTS, id: newId }], activeId: newId });
        } else {
          persist({
            accounts: nextAccounts,
            activeId: state.activeId === id ? nextAccounts[0].id : state.activeId,
          });
        }
      },
    };
  }, [state, activeAccount, ready]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within <SettingsProvider>");
  return ctx;
}
