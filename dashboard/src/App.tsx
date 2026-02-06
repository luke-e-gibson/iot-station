import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Thermometer, Droplets, TrendingUp, TrendingDown } from "lucide-react"
import { api, type WeatherRecord, type WeatherStats } from "./services/api"

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestData, statsData] = await Promise.all([
          api.getLatestWeatherRecords(50),
          api.getWeatherStats()
        ])
        setData(latestData)
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [])

  // Data for chart (reversed to show chronological order)
  const chartData = [...data].reverse().map(item => ({
    ...item,
    formattedTime: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }))

  const latest = data[0]

  if (loading && data.length === 0) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Weather Station Dashboard</h1>
          <p className="text-muted-foreground">Real-time temperature and humidity monitoring.</p>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
