const API_BASE_URL = '/api';

export interface WeatherRecord {
  id: number;
  temperature: number;
  humidity: number;
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

  async getWeatherStats(): Promise<WeatherStats> {
    const response = await fetch(`${API_BASE_URL}/weather/stats`);
    if (!response.ok) throw new Error('Failed to fetch weather stats');
    return response.json();
  }
}

export const api = new ApiService();
