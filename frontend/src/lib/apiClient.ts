const API_URL = import.meta.env.VITE_API_URL || "";

let authToken: string | null = localStorage.getItem("cold-dialer-token");

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("cold-dialer-token", token);
  } else {
    localStorage.removeItem("cold-dialer-token");
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  auth: {
    signup: (email: string, password: string, fullName: string) =>
      request<{ user: any; token: string }>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, fullName }),
      }),
    login: (email: string, password: string) =>
      request<{ user: any; token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    me: () => request<any>("/api/auth/me"),
  },

  leads: {
    list: () => request<any[]>("/api/leads"),
    get: (id: string) => request<any>(`/api/leads/${id}`),
    create: (data: any) =>
      request<any>("/api/leads", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/api/leads/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/api/leads/${id}`, { method: "DELETE" }),
    import: (rows: any[]) =>
      request<{ imported: number; total: number }>("/api/leads/import", {
        method: "POST",
        body: JSON.stringify({ rows }),
      }),
  },

  campaigns: {
    list: () => request<any[]>("/api/campaigns"),
    get: (id: string) => request<any>(`/api/campaigns/${id}`),
    create: (data: any) =>
      request<any>("/api/campaigns", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/api/campaigns/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/api/campaigns/${id}`, { method: "DELETE" }),
  },

  callLogs: {
    list: () => request<any[]>("/api/call-logs"),
    getByLead: (leadId: string) => request<any[]>(`/api/call-logs/lead/${leadId}`),
    get: (id: string) => request<any>(`/api/call-logs/${id}`),
    create: (data: any) =>
      request<any>("/api/call-logs", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/api/call-logs/${id}`, { method: "DELETE" }),
  },

  scripts: {
    list: () => request<any[]>("/api/scripts"),
    get: (id: string) => request<any>(`/api/scripts/${id}`),
    create: (data: any) =>
      request<any>("/api/scripts", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request<any>(`/api/scripts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/api/scripts/${id}`, { method: "DELETE" }),
  },
};
