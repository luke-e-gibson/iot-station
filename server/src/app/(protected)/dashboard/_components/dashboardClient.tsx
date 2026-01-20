"use client";

import * as React from "react";
import {
  Activity,
  AlertTriangle,
  CloudRain,
  Droplets,
  Server,
  Thermometer,
  Wind,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Line,
  LineChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data for temperature trends (last 24 hours)
const temperatureData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  temperature: 18 + Math.sin(i / 3) * 5 + Math.random() * 2,
  humidity: 60 + Math.cos(i / 4) * 15 + Math.random() * 5,
}));

// Mock data for device readings
const deviceReadings = [
  {
    id: "device-1",
    name: "Weather Station Alpha",
    location: "Building A - Roof",
    temperature: 22.5,
    humidity: 65,
    pressure: 1013.25,
    windSpeed: 12.5,
    lastUpdate: "2 min ago",
    status: "online",
  },
  {
    id: "device-2",
    name: "Weather Station Beta",
    location: "Building B - Garden",
    temperature: 24.1,
    humidity: 58,
    pressure: 1012.8,
    windSpeed: 8.3,
    lastUpdate: "5 min ago",
    status: "online",
  },
  {
    id: "device-3",
    name: "Weather Station Gamma",
    location: "Building C - Parking",
    temperature: 21.8,
    humidity: 72,
    pressure: 1014.1,
    windSpeed: 15.2,
    lastUpdate: "3 min ago",
    status: "online",
  },
  {
    id: "device-4",
    name: "Weather Station Delta",
    location: "Main Entrance",
    temperature: null,
    humidity: null,
    pressure: null,
    windSpeed: null,
    lastUpdate: "45 min ago",
    status: "offline",
  },
];

// Mock alerts
const recentAlerts = [
  {
    id: 1,
    device: "Weather Station Alpha",
    type: "warning",
    message: "High wind speed detected (15.2 m/s)",
    time: "10 min ago",
  },
  {
    id: 2,
    device: "Weather Station Delta",
    type: "error",
    message: "Device offline - no data received",
    time: "45 min ago",
  },
  {
    id: 3,
    device: "Weather Station Beta",
    type: "info",
    message: "Humidity levels rising rapidly",
    time: "1 hour ago",
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
};

export function DashboardClient() {
  const totalDevices = deviceReadings.length;
  const onlineDevices = deviceReadings.filter((d) => d.status === "online").length;
  const offlineDevices = totalDevices - onlineDevices;
  const avgTemperature =
    deviceReadings
      .filter((d) => d.temperature !== null)
      .reduce((sum, d) => sum + (d.temperature || 0), 0) /
    deviceReadings.filter((d) => d.temperature !== null).length;
  const avgHumidity =
    deviceReadings
      .filter((d) => d.humidity !== null)
      .reduce((sum, d) => sum + (d.humidity || 0), 0) /
    deviceReadings.filter((d) => d.humidity !== null).length;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Header Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDevices}</div>
              <p className="text-xs text-muted-foreground">
                {onlineDevices} online, {offlineDevices} offline
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgTemperature.toFixed(1)}°C</div>
              <p className="text-xs text-muted-foreground">Across all stations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Humidity</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgHumidity.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">Relative humidity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Temperature Trend</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Humidity Trend</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
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
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Device List and Alerts */}
        <Tabs defaultValue="devices" className="w-full">
          <TabsList>
            <TabsTrigger value="devices">Device Status</TabsTrigger>
            <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Weather Stations</CardTitle>
                <CardDescription>Real-time readings from all devices</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Temp (°C)</TableHead>
                      <TableHead className="text-right">Humidity (%)</TableHead>
                      <TableHead className="text-right">Wind (m/s)</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deviceReadings.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell className="font-medium">{device.name}</TableCell>
                        <TableCell>{device.location}</TableCell>
                        <TableCell className="text-right">
                          {device.temperature !== null
                            ? device.temperature.toFixed(1)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {device.humidity !== null ? device.humidity.toFixed(0) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {device.windSpeed !== null
                            ? device.windSpeed.toFixed(1)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {device.lastUpdate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              device.status === "online" ? "default" : "destructive"
                            }
                          >
                            {device.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent warnings and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-4 rounded-lg border p-4"
                    >
                      <div
                        className={`mt-0.5 rounded-full p-1 ${
                          alert.type === "error"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                            : alert.type === "warning"
                              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{alert.device}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
