/**
 * Kairosend — Electron main process.
 *
 * Targets Windows & Linux. In development it attaches to the Next.js dev
 * server (http://localhost:3000). In production it spawns `next start` from
 * the packaged app, then loads the rendered window.
 */
const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

const isDev = process.env.NODE_ENV === "development" || !!process.env.ELECTRON_IS_DEV;
const PORT = process.env.KAIROSEND_PORT || "3000";
const URL = `http://localhost:${PORT}`;

let nextServer = null;

/** Start the bundled Next.js production server. */
function startNextServer() {
  const cwd = app.isPackaged ? process.resourcesPath : app.getAppPath();
  nextServer = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", PORT], {
    cwd,
    env: { ...process.env, PORT },
    stdio: ["ignore", "pipe", "pipe"],
  });
  nextServer.stdout.on("data", (d) => console.log(`[next] ${d}`.trim()));
  nextServer.stderr.on("data", (d) => console.error(`[next] ${d}`.trim()));
}

/** Wait until the local Next server responds before loading it. */
function waitForServer(url, timeoutMs = 60000) {
  const http = require("http");
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      http
        .get(url, (res) => {
          if (res.statusCode && res.statusCode < 500) return resolve();
          if (Date.now() - start > timeoutMs) return reject(new Error("Next server timeout"));
          setTimeout(attempt, 500);
        })
        .on("error", () => {
          if (Date.now() - start > timeoutMs) return reject(new Error("Next server timeout"));
          setTimeout(attempt, 500);
        });
    };
    attempt();
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1080,
    minHeight: 640,
    backgroundColor: "#111415",
    title: "Kairosend",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: true,
    },
  });

  win.once("ready-to-show", () => win.show());

  // Open external links in the system browser, never inside Kairosend.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "permit" };
  });

  win.loadURL(URL);
}

async function bootstrap() {
  if (app.isPackaged) {
    startNextServer();
    await waitForServer(URL);
  } else if (isDev) {
    await waitForServer(URL);
  }
  createWindow();
}

// Single-instance lock (avoids double Next server spawns in production).
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const [win] = BrowserWindow.getAllWindows();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    bootstrap();
  });

  app.on("window-all-closed", () => {
    if (nextServer) nextServer.kill();
    if (process.platform !== "darwin") app.quit();
  });

  app.on("before-quit", () => {
    if (nextServer) nextServer.kill();
  });
}
