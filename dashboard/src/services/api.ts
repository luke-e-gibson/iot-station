let API_BASE_URL: string;
if(import.meta.env.DEV) {
  API_BASE_URL = import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL + "/api" : 'http://localhost:3000/api';
} else {
  API_BASE_URL = '/api';
}

export interface WeatherRecord {
  id: number;
  temperature: number;
  humidity: number;
  device: string;
  timestamp: string;
}

export interface WeatherStats {
  count: number;
  temperature: {
    min: number | null;
    max: number | null;
    avg: number | null;
  };
  humidity: {
    min: number | null;
    max: number | null;
    avg: number | null;
  };
}

class ApiService {
  async getAllWeatherRecords(): Promise<WeatherRecord[]> {
    const response = await fetch(`${API_BASE_URL}/weather`);
    if (!response.ok) throw new Error('Failed to fetch weather records');
    return response.json();
  }

  async getLatestWeatherRecords(count: number = 50): Promise<WeatherRecord[]> {
    const response = await fetch(`${API_BASE_URL}/weather/latest?count=${count}`);
    if (!response.ok) throw new Error('Failed to fetch latest weather records');
    return response.json();
  }

  async getDeviceLatestWeatherRecords(device: string, count: number = 50): Promise<WeatherRecord[]> {
    const response = await fetch(`${API_BASE_URL}/devices/${encodeURIComponent(device)}/weather/latest?count=${count}`);
    if (!response.ok) throw new Error('Failed to fetch latest weather records for device');
    return response.json();
  }

  async getDeviceWeatherRecords(device: string): Promise<WeatherRecord[]> {
    const response = await fetch(`${API_BASE_URL}/devices/${encodeURIComponent(device)}/weather`);
    if (!response.ok) throw new Error('Failed to fetch weather records for device');
    return response.json();
  }

  async getDevices(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/devices/get`);
    if (!response.ok) throw new Error('Failed to fetch devices');
    const payload = await response.json();
    if (Array.isArray(payload?.devices)) return payload.devices as string[];
    return [];
  }

  async getWeatherStats(): Promise<WeatherStats> {
    const response = await fetch(`${API_BASE_URL}/weather/stats`);
    if (!response.ok) throw new Error('Failed to fetch weather stats');
    return response.json();
  }

  async createMockData(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/_debug/create-weather-records`);
    if (!response.ok) throw new Error('Failed to create mock data');
    return response.json();
  }
}

export const api = new ApiService();
export const isDevelopment = import.meta.env.DEV;
