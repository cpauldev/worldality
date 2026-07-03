export const WORLDALITY_STUDIO_PATH = "/worldality";
export const WORLDALITY_BRIDGE_STATE_PATH = "/__universa/worldality/state";
export const WORLDALITY_BRIDGE_RUNTIME_STATUS_PATH =
  "/__universa/worldality/runtime/status";

export type StudioStatusTone =
  | "connected"
  | "starting"
  | "unavailable"
  | "error";

export interface StudioStatusSnapshot {
  label: string;
  tone: StudioStatusTone;
  urlLabel: string;
  isLoading: boolean;
}

interface RuntimeStatus {
  phase?: string;
}

interface BridgeState {
  runtime?: RuntimeStatus;
}

export function getStudioStatusClassName(tone: StudioStatusTone): string {
  switch (tone) {
    case "connected":
      return "text-emerald-500";
    case "starting":
      return "text-amber-500";
    case "error":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

export function getStudioUrlLabel(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.origin}${WORLDALITY_STUDIO_PATH}`;
}

export function getInitialStudioStatus(): StudioStatusSnapshot {
  return {
    label: "Checking...",
    tone: "starting",
    urlLabel: getStudioUrlLabel(),
    isLoading: true,
  };
}

function mapStudioStatus(
  status: RuntimeStatus,
): Omit<StudioStatusSnapshot, "urlLabel" | "isLoading"> {
  if (status.phase === "running") {
    return {
      label: "Connected",
      tone: "connected",
    };
  }

  if (status.phase === "starting" || status.phase === "stopping") {
    return {
      label: "Starting...",
      tone: "starting",
    };
  }

  if (status.phase === "error") {
    return {
      label: "Error",
      tone: "error",
    };
  }

  return {
    label: "Ready to launch",
    tone: "unavailable",
  };
}

async function fetchJson(path: string): Promise<{
  ok: boolean;
  status: number;
  body: unknown;
}> {
  const response = await fetch(path, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  const body = response.ok ? await response.json() : null;
  return { ok: response.ok, status: response.status, body };
}

async function fetchRuntimeStatus(): Promise<RuntimeStatus | null> {
  try {
    const state = await fetchJson(WORLDALITY_BRIDGE_STATE_PATH);
    if (state.ok) {
      return (state.body as BridgeState).runtime ?? null;
    }

    const status = await fetchJson(WORLDALITY_BRIDGE_RUNTIME_STATUS_PATH);
    if (status.ok) {
      return status.body as RuntimeStatus;
    }

    if (state.status === 404 || status.status === 404) {
      return null;
    }

    throw new Error("Studio bridge status endpoint is unavailable.");
  } catch {
    throw new Error("Studio bridge status endpoint is unavailable.");
  }
}

export async function fetchStudioStatus(): Promise<StudioStatusSnapshot> {
  const fallback = getInitialStudioStatus();

  try {
    const status = await fetchRuntimeStatus();
    if (!status) {
      return {
        ...fallback,
        label: "Ready to launch",
        tone: "unavailable",
        isLoading: false,
      };
    }

    return {
      ...mapStudioStatus(status),
      urlLabel: getStudioUrlLabel(),
      isLoading: status.phase === "starting" || status.phase === "stopping",
    };
  } catch {
    return {
      ...fallback,
      label: "Unavailable",
      tone: "unavailable",
      isLoading: false,
    };
  }
}
