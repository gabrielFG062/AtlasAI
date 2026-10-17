/**
 * Cliente de API para o backend AtlasAI (FastAPI).
 * Base URL e tokens são resolvidos em runtime no cliente ou via variável de ambiente.
 */

export const AUTH_TOKEN_KEY = "atlas_token";

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type UserRead = {
  id: number;
  name: string;
  last_name: string | null;
  email: string;
  custom_instructions: string | null;
  deletion_requested_at: string | null;
  deletion_scheduled_for: string | null;
  created_at: string;
};

export type UserUpdate = {
  name?: string | null;
  last_name?: string | null;
  email?: string | null;
  custom_instructions?: string | null;
};

export type MessageRole = "user" | "assistant";

export type MessageRead = {
  id: number;
  role: MessageRole;
  content: string;
  created_at: string;
};

export type ConversationRead = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

export type ConversationDetail = ConversationRead & {
  messages: MessageRead[];
};

export type ChatExchange = {
  user_message: MessageRead;
  assistant_message: MessageRead;
};

export type AdPlatformBackend = "meta_ads" | "google_ads" | "tiktok_ads";
export type AdAccountStatus = "active" | "revoked" | "expired";

export type AdAccountRead = {
  id: number;
  platform: AdPlatformBackend;
  external_account_id: string;
  token_expires_at: string | null;
  granted_scopes: string | null;
  status: AdAccountStatus;
  connected_at: string;
};

export type AdAccountCreate = {
  platform: AdPlatformBackend;
  external_account_id: string;
  access_token: string;
  refresh_token?: string | null;
  token_expires_at?: string | null;
  granted_scopes?: string | null;
};

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "/api/backend";
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // ignorar falha de localStorage em ambientes restritos
  }
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignorar
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  const headers = new Headers(options.headers || {});

  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    let errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;

    if (isJson) {
      try {
        const errorData = await response.json();
        if (typeof errorData?.detail === "string") {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData?.detail)) {
          errorMessage = errorData.detail
            .map((item: { msg?: string }) => item.msg || JSON.stringify(item))
            .join("; ");
        }
      } catch {
        // Usa mensagem padrão
      }
    } else {
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch {
        // Usa mensagem padrão
      }
    }

    throw new Error(errorMessage);
  }

  if (isJson) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}

export const api = {
  // Autenticação
  async login(email: string, password: string): Promise<TokenResponse> {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const token = await request<TokenResponse>("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (token?.access_token) {
      setAuthToken(token.access_token);
    }

    return token;
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserRead> {
    return request<UserRead>("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  // Usuários
  async getMe(): Promise<UserRead> {
    return request<UserRead>("/users/me");
  },

  async updateMe(data: UserUpdate): Promise<UserRead> {
    return request<UserRead>("/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  async requestAccountDeletion(password: string): Promise<UserRead> {
    return request<UserRead>("/users/me/deletion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
  },

  // Conversas e Mensagens (IA Gemini)
  async listConversations(
    limit = 50,
    offset = 0
  ): Promise<ConversationRead[]> {
    return request<ConversationRead[]>(
      `/conversations?limit=${limit}&offset=${offset}`
    );
  },

  async createConversation(title?: string): Promise<ConversationRead> {
    return request<ConversationRead>("/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(title ? { title } : {}),
    });
  },

  async getConversation(id: number | string): Promise<ConversationDetail> {
    return request<ConversationDetail>(`/conversations/${id}`);
  },

  async renameConversation(
    id: number | string,
    title: string
  ): Promise<ConversationRead> {
    return request<ConversationRead>(`/conversations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
  },

  async deleteConversation(id: number | string): Promise<void> {
    return request<void>(`/conversations/${id}`, {
      method: "DELETE",
    });
  },

  async sendMessage(
    id: number | string,
    content: string
  ): Promise<ChatExchange> {
    return request<ChatExchange>(`/conversations/${id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
  },

  // Contas de Anúncios / Integrações
  async listAdAccounts(): Promise<AdAccountRead[]> {
    return request<AdAccountRead[]>("/ad-accounts");
  },

  async createAdAccount(data: AdAccountCreate): Promise<AdAccountRead> {
    return request<AdAccountRead>("/ad-accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  async deleteAdAccount(id: number): Promise<void> {
    return request<void>(`/ad-accounts/${id}`, {
      method: "DELETE",
    });
  },
};

