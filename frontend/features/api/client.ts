import type {
  ApiResponse,
  DatabaseHealth,
  HealthStatus,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "@/shared/apiTypes";

const API_BASE = "/api/v1";
const TOKEN_KEY = "access_token";

let memoryToken: string | null = null;
let redirecting = false;

export function readToken(): string | null {
  if (typeof window === "undefined") return memoryToken;
  return (
    window.localStorage.getItem(TOKEN_KEY) ??
    window.sessionStorage.getItem(TOKEN_KEY) ??
    memoryToken
  );
}

export function writeToken(token: string | null, persist = true): void {
  memoryToken = token;
  if (token) redirecting = false;
  if (typeof window === "undefined") return;
  if (!token) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
    return;
  }
  if (persist) {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.sessionStorage.removeItem(TOKEN_KEY);
  } else {
    window.sessionStorage.setItem(TOKEN_KEY, token);
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

function extractErrorMessage(body: Record<string, unknown> | null): string {
  const detail =
    body?.detail && typeof body.detail === "object"
      ? (body.detail as Record<string, unknown>)
      : null;
  const nested =
    detail?.error && typeof detail.error === "object"
      ? (detail.error as Record<string, unknown>)
      : null;
  const error =
    body?.error && typeof body.error === "object"
      ? (body.error as Record<string, unknown>)
      : null;

  if (typeof nested?.message === "string") return nested.message;
  if (typeof error?.message === "string") return error.message;
  if (typeof body?.detail === "string") return body.detail;
  return "An error occurred";
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  const isPublicAuthRequest =
    endpoint === "/auth/login" || endpoint === "/auth/register";
  const token = isPublicAuthRequest ? null : readToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const payload: unknown = await response.json().catch(() => null);
    const body =
      payload && typeof payload === "object"
        ? (payload as Record<string, unknown>)
        : null;

    if (!response.ok) {
      if (response.status === 401 && token && !redirecting) {
        redirecting = true;
        writeToken(null);
        // The portal's RequireAuth guard owns navigation, so the API layer
        // only announces that the session is gone instead of hard-redirecting.
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("openclinic:unauthorized"));
        }
      }
      return {
        success: false,
        data: null,
        error: { message: extractErrorMessage(body) },
      };
    }

    if (body && typeof body.success === "boolean" && "data" in body) {
      return body as unknown as ApiResponse<T>;
    }

    return { success: true, data: payload as T, error: null };
  } catch {
    return {
      success: false,
      data: null,
      error: {
        message:
          "Cannot reach the clinic API. Check that the FastAPI server is running.",
      },
    };
  }
}

export const apiClient = {
  get<T>(endpoint: string) {
    return request<T>(endpoint, { method: "GET" });
  },
  post<T>(endpoint: string, body: unknown) {
    return request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  async login(credentials: LoginRequest) {
    const response = await request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (response.success && response.data) {
      writeToken(response.data.access_token);
    }
    return response;
  },
  async register(data: RegisterRequest) {
    const response = await request<TokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.success && response.data) {
      writeToken(response.data.access_token);
    }
    return response;
  },
  logout() {
    writeToken(null);
  },
  me() {
    return request<User>("/auth/me", { method: "GET" });
  },
  health() {
    return request<HealthStatus>("/health", { method: "GET" });
  },
  healthDatabase() {
    return request<DatabaseHealth>("/health/database", { method: "GET" });
  },
};

export { extractErrorMessage };
