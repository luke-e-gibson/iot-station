import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WeatherRecord } from '../services/api';

interface LiveChartProps {
  data: WeatherRecord[];
}

export const LiveChart = ({ data }: LiveChartProps) => {
  const chartData = useMemo(() => {
    return data.map((record) => ({
      time: new Date(record.timestamp).toLocaleTimeString(),
      temperature: record.temperature,
      humidity: record.humidity,
    })).reverse(); // Reverse to show oldest to newest
  }, [data]);

  return (
    <div className="w-full h-100 bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Real-Time Weather Data</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="temperature" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Temperature (°C)"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="humidity" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Humidity (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
