import type { WeatherRecord, WeatherStats } from '../services/api';

interface StatsCardProps {
  latestRecord: WeatherRecord | null;
  stats: WeatherStats | null;
}

export const StatsCard = ({ latestRecord, stats }: StatsCardProps) => {
  if (!latestRecord || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  const formatValue = (value: number | null) => {
    return value !== null ? value.toFixed(1) : 'N/A';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Temperature */}
      <div className="bg-linear-to-br from-red-500 to-orange-500 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Temperature</p>
            <p className="text-4xl font-bold">{latestRecord.temperature.toFixed(1)}°C</p>
            <p className="text-xs opacity-75 mt-1">
              {new Date(latestRecord.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="text-5xl opacity-50">🌡️</div>
        </div>
      </div>

      {/* Current Humidity */}
      <div className="bg-linear-to-br from-blue-500 to-cyan-500 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Humidity</p>
            <p className="text-4xl font-bold">{latestRecord.humidity.toFixed(1)}%</p>
            <p className="text-xs opacity-75 mt-1">
              {new Date(latestRecord.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="text-5xl opacity-50">💧</div>
        </div>
      </div>

      {/* Temperature Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Temperature Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Min:</span>
            <span className="font-semibold text-red-600">{formatValue(stats.temperature.min)}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Max:</span>
            <span className="font-semibold text-red-600">{formatValue(stats.temperature.max)}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Avg:</span>
            <span className="font-semibold text-red-600">{formatValue(stats.temperature.avg)}°C</span>
          </div>
        </div>
      </div>

      {/* Humidity Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Humidity Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Min:</span>
            <span className="font-semibold text-blue-600">{formatValue(stats.humidity.min)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Max:</span>
            <span className="font-semibold text-blue-600">{formatValue(stats.humidity.max)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Avg:</span>
            <span className="font-semibold text-blue-600">{formatValue(stats.humidity.avg)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
