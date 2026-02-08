import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Thermometer, Droplets, TrendingUp, TrendingDown, Database } from "lucide-react"
import { api, isDevelopment, type WeatherRecord, type WeatherStats } from "./services/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "var(--chart-1)",
  },
  humidity: {
    label: "Humidity",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function App() {
  const [data, setData] = useState<WeatherRecord[]>([])
  const [stats, setStats] = useState<WeatherStats | null>(null)
  const [devices, setDevices] = useState<string[]>([])
  const [selectedDevice, setSelectedDevice] = useState("all")
  const [loading, setLoading] = useState(true)
  const [creatingMockData, setCreatingMockData] = useState(false)

  const computeStats = (records: WeatherRecord[]): WeatherStats => {
    if (records.length === 0) {
      return {
        count: 0,
        temperature: { min: null, max: null, avg: null },
        humidity: { min: null, max: null, avg: null },
      }
    }

    const temps = records.map(r => r.temperature)
    const humidities = records.map(r => r.humidity)

    return {
      count: records.length,
      temperature: {
        min: Math.min(...temps),
        max: Math.max(...temps),
        avg: temps.reduce((a, b) => a + b, 0) / temps.length,
      },
      humidity: {
        min: Math.min(...humidities),
        max: Math.max(...humidities),
        avg: humidities.reduce((a, b) => a + b, 0) / humidities.length,
      },
    }
  }

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      try {
        const deviceList = await api.getDevices()
        const discovered = new Set<string>(deviceList)

        if (!discovered.has(selectedDevice) && selectedDevice !== "all") {
          setSelectedDevice("all")
          return
        }

        setDevices(Array.from(discovered).sort())

        if (selectedDevice === "all") {
          const [latestData, statsData] = await Promise.all([
            api.getLatestWeatherRecords(50),
            api.getWeatherStats(),
          ])
          if (!active) return
          setData(latestData)
          setStats(statsData)
        } else {
          const latestData = await api.getDeviceLatestWeatherRecords(selectedDevice, 50)
          if (!active) return
          setData(latestData)
          setStats(computeStats(latestData))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [selectedDevice])

  // Data for chart (reversed to show chronological order)
  const chartData = data.slice().reverse().map(item => ({
    ...item,
    formattedTime: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }))
  const latest = data[0]

  const handleCreateMockData = async () => {
    setCreatingMockData(true)
    try {
      await api.createMockData()
      // Data will be refreshed by the existing interval
    } catch (error) {
      console.error("Error creating mock data:", error)
      alert("Failed to create mock data. Make sure the server is running in development mode.")
    } finally {
      setCreatingMockData(false)
    }
  }

  if (loading && data.length === 0) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Weather Station Dashboard</h1>
            <p className="text-muted-foreground">Real-time temperature and humidity monitoring.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-end">
            <div className="flex w-full flex-col gap-1 sm:w-auto">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Device</span>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger className="w-full min-w-[220px] sm:w-[260px]">
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All devices</SelectItem>
                  {devices.map(device => (
                    <SelectItem key={device} value={device}>
                      {device}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isDevelopment && (
              <Button 
                onClick={handleCreateMockData} 
                disabled={creatingMockData}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Database className="mr-2 h-4 w-4" />
                {creatingMockData ? "Creating..." : "Create Mock Data"}
              </Button>
            )}
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latest ? `${latest.temperature.toFixed(1)}°C` : "--"}
              </div>
              {stats && stats.temperature.avg !== null && (
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: {stats.temperature.avg.toFixed(1)}°C
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Humidity</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latest ? `${latest.humidity.toFixed(1)}%` : "--"}
              </div>
              {stats && stats.humidity.avg !== null && (
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: {stats.humidity.avg.toFixed(1)}%
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature Range</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats && stats.temperature.max !== null ? `${stats.temperature.max.toFixed(1)}°C` : "--"}
              </div>
              {stats && stats.temperature.min !== null && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  Min: {stats.temperature.min.toFixed(1)}°C
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humidity Range</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats && stats.humidity.max !== null ? `${stats.humidity.max.toFixed(1)}%` : "--"}
              </div>
              {stats && stats.humidity.min !== null && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  Min: {stats.humidity.min.toFixed(1)}%
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full">
              {data.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No data available for this device yet.
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="formattedTime"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                      />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="var(--color-temperature)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="humidity"
                        stroke="var(--color-humidity)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
