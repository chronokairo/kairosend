"use client";

import { useMemo } from "react";
import { useSettings } from "./settings";

/** Resend-shaped error thrown by the API client. */
export class ApiError extends Error {
  statusCode: number;
  name: string;
  constructor(name: string, message: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  const json = text
    ? ((JSON.parse(text) as unknown) as T & { message?: string; name?: string; statusCode?: number })
    : null;
  if (!res.ok) {
    throw new ApiError(
      json?.name ?? "request_failed",
      json?.message ?? res.statusText,
      json?.statusCode ?? res.status,
    );
  }
  return json as T;
}

/** Fetch helper bound to the local Resend API key (same-origin routes). */
export function useApi() {
  const { settings } = useSettings();
  return useMemo(() => {
    const headers = (extra?: HeadersInit) => {
      const h: Record<string, string> = {
        "Content-Type": "application/json",
        ...(extra as Record<string, string>),
      };
      if (settings.apiKey) h["x-resend-key"] = settings.apiKey;
      return h;
    };

    return {
      get: <T>(path: string, init?: RequestInit) =>
        fetch(path, { ...init, method: "GET", headers: headers(init?.headers) }).then(handle<T>),
      post: <T>(path: string, body?: unknown, init?: RequestInit) =>
        fetch(path, {
          ...init,
          method: "POST",
          headers: headers(init?.headers),
          body: body ? JSON.stringify(body) : undefined,
        }).then(handle<T>),
      patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
        fetch(path, {
          ...init,
          method: "PATCH",
          headers: headers(init?.headers),
          body: body ? JSON.stringify(body) : undefined,
        }).then(handle<T>),
    };
  }, [settings.apiKey]);
}
