"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useSettings } from "@/lib/settings";

/** Modal for the per-user Resend API key + sender identity. */
export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, update, isConfigured, accounts, switchAccount, addAccount, removeAccount } = useSettings();
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [fromAddress, setFromAddress] = useState(settings.fromAddress);
  const [displayName, setDisplayName] = useState(settings.displayName);
  const [role, setRole] = useState(settings.role);
  const [reveal, setReveal] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setApiKey(settings.apiKey);
      setFromAddress(settings.fromAddress);
      setDisplayName(settings.displayName);
      setRole(settings.role || "");
      setSaved(false);
    }
  }, [open, settings]);

  if (!open) return null;

  const save = () => {
    update({ apiKey: apiKey.trim(), fromAddress: fromAddress.trim(), displayName: displayName.trim(), role: role.trim() });
    setSaved(true);
    setTimeout(onClose, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-container-padding backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-panel w-full max-w-lg overflow-hidden rounded-xl border border-outline-variant shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-outline-variant/30 p-container-padding">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="settings" className="text-primary" filled />
              <h2 className="font-display text-title-md font-bold">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-secondary transition-colors hover:bg-surface-variant hover:text-error"
              aria-label="Close"
            >
              <Icon name="close" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => switchAccount(acc.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-1.5 text-label-sm transition-all ${
                  settings.id === acc.id
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-outline-variant text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                <Icon name="person" className="text-[16px]" />
                {acc.displayName || acc.id}
              </button>
            ))}
            <button
              onClick={() => addAccount()}
              className="flex items-center gap-1 rounded-lg border border-dashed border-outline-variant px-3 py-1.5 text-label-sm text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              <Icon name="add" className="text-[16px]" /> New
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-stack-md p-container-padding max-h-[60vh] overflow-y-auto custom-scrollbar">
          <p className="text-body-md text-secondary">
            Kairosend is local-first. Your Resend API key is stored only on this device.
          </p>

          <Field label="Resend API Key" hint="From resend.com/api-keys (starts with re_)">
            <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 transition-colors focus-within:border-primary">
              <Icon name="key" className="text-secondary" />
              <input
                type={reveal ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="re_xxxxxxxxxxxxxxxxx"
                className="w-full bg-transparent text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setReveal((r) => !r)}
                className="text-secondary hover:text-primary"
                aria-label={reveal ? "Hide key" : "Show key"}
              >
                <Icon name={reveal ? "visibility_off" : "visibility"} />
              </button>
            </div>
          </Field>

          <Field label="Display name" hint="Shown in your profile chip">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Julian Thorne"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
            />
          </Field>

          <Field label="Default From address" hint='e.g. "Julian Thorne <julian@aureate.com>"'>
            <input
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              placeholder="Name <you@yourdomain.com>"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
            />
          </Field>

          <Field label="Role / Subtitle" hint="Shown beneath your display name">
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Resend Account"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
            />
          </Field>

          {!isConfigured && (
            <div className="flex items-center gap-2 rounded-lg border border-error/20 bg-error-container/10 p-3 text-label-sm text-error">
              <Icon name="info" className="text-[18px]" />
              Configure your API key to start sending & receiving.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-outline-variant/30 bg-surface-container-low p-container-padding">
          <a
            href="https://resend.com/api-keys"
            target="_blank"
            rel="noreferrer"
            className="text-label-sm text-primary hover:underline"
          >
            Get an API key →
          </a>
          <div className="flex items-center gap-stack-md">
            {accounts.length > 1 && (
              <button
                onClick={() => removeAccount(settings.id)}
                className="text-label-sm font-bold text-error hover:underline mr-4"
              >
                Delete Account
              </button>
            )}
            {saved && (
              <span className="flex items-center gap-1 text-label-sm text-primary">
                <Icon name="check_circle" className="text-[16px]" filled /> Saved
              </span>
            )}
            <button
              onClick={save}
              className="rounded-lg bg-primary px-6 py-2 text-label-sm font-bold text-on-primary transition-all hover:opacity-90 active:scale-95"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-label-sm font-bold uppercase tracking-widest text-secondary opacity-70">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-label-xs text-outline">{hint}</span>}
    </label>
  );
}
