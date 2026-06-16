#!/usr/bin/env bun

import { type ChildProcess, exec, execFileSync, spawn } from "child_process";
import { existsSync, readFileSync, unlinkSync } from "fs";
import { platform } from "os";
import { delimiter, dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = existsSync(join(__dirname, "..", "package.json"))
  ? join(__dirname, "..")
  : join(__dirname, "../..");
const EXAMPLES_ROOT = existsSync(join(ROOT_DIR, "examples"))
  ? join(ROOT_DIR, "examples")
  : ROOT_DIR;
const ROOT_BIN_DIR = join(ROOT_DIR, "node_modules", ".bin");
const PORT_RANGE_START = 4600;
const PORT_CLEANUP_SPAN = 20;
const OUTPUT_TAIL_LINES = 25;
const READY_MARKERS = [
  "ready",
  "http://localhost",
  "Local:",
  "started",
  "listening",
  "Ready in",
];
const ISSUE_MARKERS = ["ERROR", "error", "warn"];
const ERROR_MARKERS = ["ERROR", "Error", "error", "Unable to acquire lock"];
const NEXT_DEV_LOCK_PATHS = [
  join(".next", "dev", "lock"),
  join(".next", "lock"),
];
const STRICT_PORT_ARGS = ["--strictPort"];

interface ExampleDefinition {
  id: string;
  name: string;
  dir: string;
  port: number;
  env?: Record<string, string>;
  devArgs?: string[];
  confirmUrl?: boolean;
}

interface RuntimeExample extends Omit<ExampleDefinition, "env" | "devArgs"> {
  cwd: string;
  command: string;
  args: string[];
  env: Record<string, string>;
}

interface ExamplePackageManifest {
  scripts?: Record<string, string>;
}

const EXAMPLES: ExampleDefinition[] = [
  {
    id: "react",
    name: "React",
    dir: "react",
    port: PORT_RANGE_START,
    devArgs: STRICT_PORT_ARGS,
  },
  {
    id: "react-router",
    name: "React Router",
    dir: "react-router",
    port: PORT_RANGE_START + 1,
    devArgs: STRICT_PORT_ARGS,
    confirmUrl: true,
  },
  {
    id: "vue",
    name: "Vue",
    dir: "vue",
    port: PORT_RANGE_START + 2,
    devArgs: STRICT_PORT_ARGS,
  },
  {
    id: "sveltekit",
    name: "SvelteKit",
    dir: "sveltekit",
    port: PORT_RANGE_START + 3,
    devArgs: STRICT_PORT_ARGS,
  },
  {
    id: "solid",
    name: "Solid",
    dir: "solid",
    port: PORT_RANGE_START + 4,
    devArgs: STRICT_PORT_ARGS,
  },
  {
    id: "astro",
    name: "Astro",
    dir: "astro",
    port: PORT_RANGE_START + 5,
  },
  {
    id: "nextjs",
    name: "Next.js",
    dir: "nextjs",
    port: PORT_RANGE_START + 6,
  },
  {
    id: "nuxt",
    name: "Nuxt",
    dir: "nuxt",
    port: PORT_RANGE_START + 7,
    confirmUrl: true,
  },
  {
    id: "vanilla",
    name: "Vanilla",
    dir: "vanilla",
    port: PORT_RANGE_START + 8,
    devArgs: STRICT_PORT_ARGS,
  },
];

const runningProcesses: ChildProcess[] = [];

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
};

const EXAMPLE_COLORS = [
  COLORS.cyan,
  COLORS.green,
  COLORS.yellow,
  COLORS.blue,
  COLORS.magenta,
  COLORS.cyan,
];

function log(message: string, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function openInBrowser(url: string) {
  const os = platform();
  const command =
    os === "win32"
      ? `start ${url}`
      : os === "darwin"
        ? `open ${url}`
        : `xdg-open ${url}`;

  exec(command, (error) => {
    if (error) console.error(`Failed to open browser: ${error.message}`);
  });
}

function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function stopProcessTree(pid: number): void {
  if (pid === process.pid) {
    return;
  }

  if (platform() === "win32") {
    execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], {
      stdio: "ignore",
    });
    return;
  }

  process.kill(pid, "SIGTERM");
}

function stopProcessTreeIfAlive(pid: number, label?: string): void {
  if (!Number.isFinite(pid) || pid <= 0 || pid === process.pid) {
    return;
  }

  if (!isProcessAlive(pid)) {
    return;
  }

  try {
    if (label) {
      log(`Stopping existing ${label} process (pid ${pid})...`, COLORS.yellow);
    }
    stopProcessTree(pid);
  } catch {
    // The process may have exited between the liveness check and termination.
  }
}

function parseWindowsPortOwners(output: string, port: number): number[] {
  const owners = new Set<number>();
  const portPattern = new RegExp(`[:.]${port}$`);

  for (const line of output.split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 5 || parts[3] !== "LISTENING") {
      continue;
    }

    if (!portPattern.test(parts[1])) {
      continue;
    }

    const pid = Number.parseInt(parts[4] ?? "", 10);
    if (Number.isFinite(pid) && pid > 0) {
      owners.add(pid);
    }
  }

  return [...owners];
}

function getPortOwners(port: number): number[] {
  try {
    if (platform() === "win32") {
      return parseWindowsPortOwners(
        execFileSync("netstat", ["-ano"], {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        }),
        port,
      );
    }

    const output = execFileSync(
      "lsof",
      ["-ti", `tcp:${port}`, "-sTCP:LISTEN"],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    );

    return output
      .split(/\r?\n/)
      .map((line) => Number.parseInt(line.trim(), 10))
      .filter((pid) => Number.isFinite(pid) && pid > 0);
  } catch {
    return [];
  }
}

function getCleanupPorts(examples: ExampleDefinition[]): number[] {
  const ports = new Set(examples.map((example) => example.port));
  for (
    let port = PORT_RANGE_START;
    port < PORT_RANGE_START + PORT_CLEANUP_SPAN;
    port += 1
  ) {
    ports.add(port);
  }
  return [...ports].sort((a, b) => a - b);
}

function stopExistingPortOwners(examples: ExampleDefinition[]): void {
  const ownersByPid = new Map<number, string[]>();
  const namesByPort = new Map(
    examples.map((example) => [
      example.port,
      `${example.name} port ${example.port}`,
    ]),
  );

  for (const port of getCleanupPorts(examples)) {
    for (const pid of getPortOwners(port)) {
      const labels = ownersByPid.get(pid) ?? [];
      labels.push(namesByPort.get(port) ?? `stale example port ${port}`);
      ownersByPid.set(pid, labels);
    }
  }

  for (const [pid, labels] of ownersByPid.entries()) {
    stopProcessTreeIfAlive(pid, labels.join(", "));
  }
}

function sleep(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function waitForPortsAvailable(
  examples: ExampleDefinition[],
  timeoutMs = 10000,
): void {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const busyExamples = examples.filter(
      (example) => getPortOwners(example.port).length > 0,
    );

    if (busyExamples.length === 0) {
      return;
    }

    sleep(250);
  }

  const busyPorts = examples
    .map((example) => ({
      example,
      owners: getPortOwners(example.port),
    }))
    .filter(({ owners }) => owners.length > 0)
    .map(
      ({ example, owners }) =>
        `${example.name} port ${example.port} (pid${owners.length > 1 ? "s" : ""} ${owners.join(", ")})`,
    );

  if (busyPorts.length > 0) {
    throw new Error(
      `Could not free example ports: ${busyPorts.join("; ")}. Stop those processes and run the examples again.`,
    );
  }
}

function resolvePathKey(env: NodeJS.ProcessEnv): string {
  return Object.keys(env).find((key) => key.toLowerCase() === "path") ?? "PATH";
}

function buildExamplePathEnv(exampleDir: string): Record<string, string> {
  const pathKey = resolvePathKey(process.env);
  const currentPath = process.env[pathKey] ?? process.env.PATH ?? "";
  const exampleBinDir = join(exampleDir, "node_modules", ".bin");

  return {
    [pathKey]: [exampleBinDir, ROOT_BIN_DIR, currentPath]
      .filter(Boolean)
      .join(delimiter),
  };
}

function shellEscape(value: string): string {
  if (/^[\w./:=+-]+$/.test(value)) {
    return value;
  }

  if (platform() === "win32") {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function resolveShellInvocation(commandLine: string): {
  command: string;
  args: string[];
} {
  if (platform() === "win32") {
    return {
      command: process.env.ComSpec || "cmd.exe",
      args: ["/d", "/s", "/c", commandLine],
    };
  }

  return {
    command: process.env.SHELL || "sh",
    args: ["-lc", commandLine],
  };
}

function resolveExampleDevScript(
  exampleDir: string,
  exampleName: string,
): string {
  const packageJsonPath = join(exampleDir, "package.json");
  const packageJson = JSON.parse(
    readFileSync(packageJsonPath, "utf8"),
  ) as ExamplePackageManifest;
  const devScript = packageJson.scripts?.dev?.trim();

  if (!devScript) {
    throw new Error(`Missing "dev" script for ${exampleName} (${exampleDir})`);
  }

  return devScript;
}

function clearNextDevLocks(example: RuntimeExample) {
  if (example.id !== "nextjs") {
    return;
  }

  for (const relativePath of NEXT_DEV_LOCK_PATHS) {
    const lockPath = join(example.cwd, relativePath);
    try {
      if (existsSync(lockPath)) {
        unlinkSync(lockPath);
      }
    } catch {
      // Best-effort cleanup.
    }
  }
}

function includesAny(value: string, markers: string[]): boolean {
  return markers.some((marker) => value.includes(marker));
}

async function pollUntilServing(url: string, timeoutMs = 20000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.status !== 404) return;
      const body = await res.text();
      if (!body.includes("Cannot GET")) return;
    } catch {
      // Server not accepting connections yet — keep waiting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

function toRuntimeExample(definition: ExampleDefinition): RuntimeExample {
  const { env, devArgs, ...runtimeDefinition } = definition;
  const cwd = join(EXAMPLES_ROOT, definition.dir);
  const extraArgs = devArgs ?? [];
  const devScript = resolveExampleDevScript(cwd, definition.name);
  const launchCommand = [
    devScript,
    ...["--port", String(definition.port), ...extraArgs].map(shellEscape),
  ].join(" ");
  const shellInvocation = resolveShellInvocation(launchCommand);

  return {
    ...runtimeDefinition,
    cwd,
    command: shellInvocation.command,
    args: shellInvocation.args,
    env: {
      PORT: String(definition.port),
      ...buildExamplePathEnv(cwd),
      ...(env ?? {}),
    },
  };
}

function resolveRuntimeExamples(
  definitions: ExampleDefinition[],
): RuntimeExample[] {
  return definitions.map(toRuntimeExample);
}

function pushOutputTail(outputTail: string[], chunk: string) {
  const lines = chunk
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return;

  outputTail.push(...lines);
  if (outputTail.length > OUTPUT_TAIL_LINES) {
    outputTail.splice(0, outputTail.length - OUTPUT_TAIL_LINES);
  }
}

function printUsageAndExit() {
  log(
    `${COLORS.red}Error: No valid examples specified.${COLORS.reset}`,
    COLORS.red,
  );
  log(
    `\nAvailable examples: ${EXAMPLES.map((example) => example.id).join(", ")}\n`,
    COLORS.yellow,
  );
  log("Usage:", COLORS.bright);
  log("  bun run examples                    # Run all examples");
  log("  bun run examples react-router nuxt  # Run specific examples");
  log(
    "  bun run examples --no-open          # Run without opening browser tabs\n",
  );
  process.exit(1);
}

function parseArguments(argv: string[]): {
  openBrowser: boolean;
  selectedExamples: ExampleDefinition[];
} {
  const args = [...argv];
  let openBrowser = true;

  const noOpenIndex = args.indexOf("--no-open");
  if (noOpenIndex !== -1) {
    openBrowser = false;
    args.splice(noOpenIndex, 1);
  }

  if (args.length === 0) {
    return { openBrowser, selectedExamples: EXAMPLES };
  }

  const requestedIds = args.map((arg) => arg.toLowerCase());
  const selectedExamples = EXAMPLES.filter((example) =>
    requestedIds.includes(example.id),
  );

  if (selectedExamples.length === 0) {
    printUsageAndExit();
  }

  return { openBrowser, selectedExamples };
}

function cleanupAndExit(code = 0) {
  log("\n\nShutting down all servers...", COLORS.yellow);
  for (const processHandle of runningProcesses) {
    if (processHandle.pid) {
      stopProcessTreeIfAlive(processHandle.pid);
    } else {
      processHandle.kill();
    }
  }
  process.exit(code);
}

function startExample(
  example: RuntimeExample,
  index: number,
  openBrowser = true,
) {
  const color = EXAMPLE_COLORS[index % EXAMPLE_COLORS.length];
  const url = `http://localhost:${example.port}`;
  const outputTail: string[] = [];
  clearNextDevLocks(example);
  let hasShownReady = false;

  const childProcess = spawn(example.command, example.args, {
    cwd: example.cwd,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      ...example.env,
      FORCE_COLOR: "1",
    },
  });

  runningProcesses.push(childProcess);

  childProcess.stdout?.on("data", async (data) => {
    const output = data.toString();
    pushOutputTail(outputTail, output);

    if (!hasShownReady && includesAny(output, READY_MARKERS)) {
      hasShownReady = true;
      if (example.confirmUrl) {
        await pollUntilServing(url);
      }
      log(
        `${COLORS.green}✓${COLORS.reset} ${example.name.padEnd(12)} ${COLORS.bright}${url}${COLORS.reset}`,
      );
      if (openBrowser) openInBrowser(url);
    }

    if (includesAny(output, ISSUE_MARKERS)) {
      console.log(`${color}[${example.name}]${COLORS.reset} ${output.trim()}`);
    }
  });

  childProcess.stderr?.on("data", (data) => {
    const output = data.toString();
    pushOutputTail(outputTail, output);
    if (includesAny(output, ERROR_MARKERS)) {
      console.error(
        `${COLORS.red}[${example.name}]${COLORS.reset} ${output.trim()}`,
      );
    }
  });

  childProcess.on("error", (error) => {
    log(
      `${COLORS.red}✗${COLORS.reset} ${example.name} failed: ${error.message}`,
      COLORS.red,
    );
  });

  childProcess.on("close", (code) => {
    const processIndex = runningProcesses.indexOf(childProcess);
    if (processIndex !== -1) {
      runningProcesses.splice(processIndex, 1);
    }

    if (code !== 0 && code !== null) {
      process.exitCode = 1;
      log(
        `${COLORS.red}✗${COLORS.reset} ${example.name} exited with code ${code}`,
        COLORS.red,
      );

      if (outputTail.length > 0) {
        console.error(
          `${COLORS.red}[${example.name}]${COLORS.reset} Last output:\n${outputTail.join("\n")}`,
        );
      }
    }
  });
}

function main() {
  const { openBrowser, selectedExamples } = parseArguments(
    process.argv.slice(2),
  );
  process.on("SIGINT", () => cleanupAndExit(0));
  process.on("SIGTERM", () => cleanupAndExit(0));

  stopExistingPortOwners(selectedExamples);
  waitForPortsAvailable(selectedExamples);

  log(
    `${COLORS.bright}Starting ${selectedExamples.length} example${selectedExamples.length > 1 ? "s" : ""}...${COLORS.reset}`,
    COLORS.cyan,
  );
  log(`${COLORS.yellow}Press Ctrl+C to stop all servers${COLORS.reset}\n`);

  const runtimeExamples = resolveRuntimeExamples(selectedExamples);
  runtimeExamples.forEach((example, index) => {
    startExample(example, index, openBrowser);
  });
}

try {
  main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  log(
    `${COLORS.red}Failed to start examples: ${message}${COLORS.reset}`,
    COLORS.red,
  );
  cleanupAndExit(1);
}
