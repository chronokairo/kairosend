/**
 * Kairosend — preload (context bridge).
 * Currently exposes only safe, OS-level helpers to the renderer. The Resend
 * API itself is reached through the Next.js API routes (same-origin), so no
 * credentials cross the bridge.
 */
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("kairosend", {
  version: "0.1.0",
  platform: process.platform, // "win32" | "linux" | "darwin"
  isPackaged: process.versions?.electron ? undefined : undefined,
});
