const API_BASE = '/api';

interface APIResponse<T> {
  errorMessage: string | null;
  httpCode: number | null;
  data: T | null;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response.json();
}

// Auth API
export const authApi = {
  register: (username: string, password: string) =>
    request<{ token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  login: (username: string, password: string) =>
    request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  createToken: (authToken: string, name: string) =>
    request<{ deviceToken: string; token?: string }>('/auth/token/create', {
      method: 'POST',
      body: JSON.stringify({ authToken, name }),
    }),
};

// Device API
export interface Device {
  id: number;
  name: string;
  deviceId: string;
  tokens?: DeviceToken[];
}

export interface DeviceToken {
  name: string;
  token: string;
  createdAt?: string;
}

export const deviceApi = {
  create: (authToken: string, name: string) =>
    request<{ deviceId: string }>('/device/create', {
      method: 'POST',
      body: JSON.stringify({ authToken, name }),
    }),

  list: (authToken: string) =>
    request<{ devices: Device[] }>('/device/list', {
      method: 'POST',
      body: JSON.stringify({ authToken }),
    }),

  getData: (authToken: string, deviceId: string) =>
    request<{
      device: { id: number; name: string; deviceId: string };
      data: Array<{ id: number; data: Record<string, unknown> }>;
    }>('/device/data/get', {
      method: 'POST',
      body: JSON.stringify({ authToken, deviceId }),
    }),

  submitData: (deviceToken: string, deviceId: string, data: Record<string, unknown>) =>
    request<{ success: boolean }>('/device/data/submit', {
      method: 'POST',
      body: JSON.stringify({ deviceToken, deviceId, data }),
    }),
};
