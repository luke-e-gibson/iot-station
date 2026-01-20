"use client";

import * as React from "react";
import {
  Play,
  Download,
  Trash2,
  Save,
  History,
  BarChart3,
  Table as TableIcon,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data that would come from SQL query
const mockQueryResults = {
  columns: ["timestamp", "device_id", "temperature", "humidity", "wind_speed"],
  rows: [
    ["2026-01-21 10:00", "device-1", 22.5, 65, 12.5],
    ["2026-01-21 10:00", "device-2", 24.1, 58, 8.3],
    ["2026-01-21 10:00", "device-3", 21.8, 72, 15.2],
    ["2026-01-21 11:00", "device-1", 23.1, 63, 11.8],
    ["2026-01-21 11:00", "device-2", 24.5, 56, 9.1],
    ["2026-01-21 11:00", "device-3", 22.3, 70, 14.5],
  ],
  rowCount: 6,
  executionTime: 0.042,
};

// Sample SQL queries for quick access
const sampleQueries = [
  {
    name: "All Device Readings",
    query: `SELECT 
  device_id, 
  temperature, 
  humidity, 
  wind_speed, 
  timestamp 
FROM device_readings 
WHERE timestamp > NOW() - INTERVAL '24 hours' 
ORDER BY timestamp DESC 
LIMIT 100;`,
  },
  {
    name: "Average Temperature by Device",
    query: `SELECT 
  device_id,
  AVG(temperature) as avg_temp,
  AVG(humidity) as avg_humidity,
  COUNT(*) as reading_count
FROM device_readings
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY device_id
ORDER BY avg_temp DESC;`,
  },
  {
    name: "Hourly Aggregates",
    query: `SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  AVG(temperature) as avg_temp,
  MAX(temperature) as max_temp,
  MIN(temperature) as min_temp,
  AVG(humidity) as avg_humidity
FROM device_readings
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour;`,
  },
  {
    name: "High Wind Alerts",
    query: `SELECT 
  device_id,
  timestamp,
  wind_speed,
  temperature
FROM device_readings
WHERE wind_speed > 15.0
  AND timestamp > NOW() - INTERVAL '7 days'
ORDER BY wind_speed DESC;`,
  },
];

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Humidity",
    color: "hsl(var(--chart-2))",
  },
  windSpeed: {
    label: "Wind Speed",
    color: "hsl(var(--chart-3))",
  },
};

export function QueryClient() {
  const [query, setQuery] = React.useState("");
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [results, setResults] = React.useState<typeof mockQueryResults | null>(
    null
  );
  const [error, setError] = React.useState<string | null>(null);
  const [queryHistory, setQueryHistory] = React.useState<string[]>([]);
  const [visualizationType, setVisualizationType] = React.useState<
    "table" | "chart"
  >("table");

  const handleExecuteQuery = async () => {
    if (!query.trim()) return;

    setIsExecuting(true);
    setError(null);

    // Simulate API call delay
    setTimeout(() => {
      try {
        // Add to history
        setQueryHistory((prev) => [query, ...prev.slice(0, 9)]);

        // Mock successful response
        setResults(mockQueryResults);
        setIsExecuting(false);
      } catch (err) {
        setError("Failed to execute query. Please check your syntax.");
        setIsExecuting(false);
      }
    }, 500);
  };

  const handleClearQuery = () => {
    setQuery("");
    setResults(null);
    setError(null);
  };

  const handleLoadSample = (sampleQuery: string) => {
    setQuery(sampleQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Execute query with Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleExecuteQuery();
    }

    // Handle Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = query.substring(0, start) + "  " + query.substring(end);
      setQuery(newValue);
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
          start + 2;
      }, 0);
    }
  };

  // Convert results to chart data
  const getChartData = () => {
    if (!results) return [];

    return results.rows.map((row) => ({
      timestamp: row[0] as string,
      device: row[1] as string,
      temperature: row[2] as number,
      humidity: row[3] as number,
      windSpeed: row[4] as number,
    }));
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SQL Query Editor</h1>
            <p className="text-muted-foreground">
              Query your IoT device data with SQL
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main Query Editor */}
          <div className="space-y-6">
            {/* SQL Editor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Query Editor</CardTitle>
                    <CardDescription>
                      Write your SQL query below. Press Ctrl+Enter to execute
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearQuery}
                      disabled={!query}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleExecuteQuery}
                      disabled={isExecuting || !query.trim()}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isExecuting ? "Executing..." : "Execute"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="SELECT * FROM device_readings WHERE..."
                  className="w-full min-h-[300px] rounded-md border bg-muted/50 p-4 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                  spellCheck={false}
                />
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {query.split("\n").length} lines · {query.length} characters
                  </span>
                  <span>Tip: Use Ctrl+Enter to execute, Tab for indentation</span>
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="border-red-600">
                <CardHeader>
                  <CardTitle className="text-red-600">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Results Display */}
            {results && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Query Results</CardTitle>
                      <CardDescription>
                        {results.rowCount} rows in {results.executionTime}s
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                      <Tabs value={visualizationType} onValueChange={(v) => setVisualizationType(v as "table" | "chart")}>
                        <TabsList>
                          <TabsTrigger value="table" className="px-3">
                            <TableIcon className="h-4 w-4" />
                          </TabsTrigger>
                          <TabsTrigger value="chart" className="px-3">
                            <BarChart3 className="h-4 w-4" />
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {visualizationType === "table" ? (
                    <div className="rounded-md border overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {results.columns.map((col) => (
                              <TableHead key={col} className="font-mono text-xs">
                                {col}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.rows.map((row, idx) => (
                            <TableRow key={idx}>
                              {row.map((cell, cellIdx) => (
                                <TableCell key={cellIdx} className="font-mono text-xs">
                                  {cell}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Temperature Chart */}
                      <div>
                        <h4 className="text-sm font-medium mb-4">Temperature</h4>
                        <ChartContainer config={chartConfig} className="h-[200px] w-full">
                          <AreaChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="timestamp"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                              type="monotone"
                              dataKey="temperature"
                              stroke="hsl(var(--chart-1))"
                              fill="hsl(var(--chart-2))"
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ChartContainer>
                      </div>

                      {/* Humidity Chart */}
                      <div>
                        <h4 className="text-sm font-medium mb-4">Humidity</h4>
                        <ChartContainer config={chartConfig} className="h-[200px] w-full">
                          <AreaChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="timestamp"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                              type="monotone"
                              dataKey="humidity"
                              stroke="hsl(var(--chart-2))"
                              fill="hsl(var(--chart-2))"
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ChartContainer>
                      </div>

                      {/* Wind Speed Chart */}
                      <div>
                        <h4 className="text-sm font-medium mb-4">Wind Speed</h4>
                        <ChartContainer config={chartConfig} className="h-[200px] w-full">
                          <BarChart data={getChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="timestamp"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                              dataKey="windSpeed"
                              fill="hsl(var(--chart-3))"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ChartContainer>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar with Sample Queries and History */}
          <div className="space-y-6">
            {/* Sample Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sample Queries</CardTitle>
                <CardDescription>Click to load a template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleQueries.map((sample, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => handleLoadSample(sample.query)}
                    >
                      <FileText className="h-4 w-4 mr-2 shrink-0" />
                      <span className="text-sm">{sample.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Query History */}
            {queryHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Queries</CardTitle>
                  <CardDescription>Last {queryHistory.length} queries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {queryHistory.map((historyQuery, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left rounded-md border p-3 hover:bg-muted/50 transition-colors"
                        onClick={() => setQuery(historyQuery)}
                      >
                        <p className="text-xs font-mono text-muted-foreground line-clamp-2">
                          {historyQuery}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Database Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Available Tables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium font-mono">device_readings</p>
                    <p className="text-xs text-muted-foreground">
                      id, device_id, temperature, humidity, pressure, wind_speed,
                      timestamp
                    </p>
                  </div>
                  <div>
                    <p className="font-medium font-mono">devices</p>
                    <p className="text-xs text-muted-foreground">
                      id, name, location, status, created_at
                    </p>
                  </div>
                  <div>
                    <p className="font-medium font-mono">alerts</p>
                    <p className="text-xs text-muted-foreground">
                      id, device_id, type, message, created_at
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
