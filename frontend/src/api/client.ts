import type { ApiResponse, LoginRequest, RegisterRequest, TokenResponse } from '../types';

const API_BASE = '/api/v1';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const isPublicAuthRequest = endpoint === '/auth/login' || endpoint === '/auth/register';
    const token = isPublicAuthRequest ? null : this.getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const payload: unknown = await response.json().catch(() => null);
    const body = payload && typeof payload === 'object'
      ? payload as Record<string, unknown>
      : null;

    if (!response.ok) {
      if (response.status === 401 && token) {
        this.setToken(null);
        window.location.href = '/login';
      }
      const detail = body?.detail && typeof body.detail === 'object'
        ? body.detail as Record<string, unknown>
        : null;
      const error = body?.error && typeof body.error === 'object'
        ? body.error as Record<string, unknown>
        : detail?.error && typeof detail.error === 'object'
          ? detail.error as Record<string, unknown>
          : null;
      const message = typeof error?.message === 'string'
        ? error.message
        : typeof body?.detail === 'string'
          ? body.detail
          : 'An error occurred';
      return {
        success: false,
        data: null,
        error: { message },
      };
    }

    if (body && typeof body.success === 'boolean' && 'data' in body) {
      return body as unknown as ApiResponse<T>;
    }

    // FastAPI auth routes return plain response models, while health routes
    // use the standard API envelope. Normalize both for frontend callers.
    return { success: true, data: payload as T, error: null };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<TokenResponse>> {
    const response = await this.post<TokenResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      this.setToken(response.data.access_token);
    }
    return response;
  }

  async register(data: RegisterRequest): Promise<ApiResponse<TokenResponse>> {
    const response = await this.post<TokenResponse>('/auth/register', data);
    if (response.success && response.data) {
      this.setToken(response.data.access_token);
    }
    return response;
  }

  async logout(): Promise<void> {
    this.setToken(null);
  }

  async me(): Promise<ApiResponse<{ user_id: string; email: string; role: string }>> {
    return this.get('/auth/me');
  }

  // Health
  async health(): Promise<ApiResponse<{ status: string }>> {
    return this.get('/health');
  }

  async healthDatabase(): Promise<ApiResponse<{ status: string; version: string; database_name: string }>> {
    return this.get('/health/database');
  }
}

export const api = new ApiClient();
