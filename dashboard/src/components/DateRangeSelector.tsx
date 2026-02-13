import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type DateRangePreset = "24h" | "7d" | "30d" | "all"

export interface DateRange {
  start: string | null
  end: string | null
}

interface DateRangeSelectorProps {
  value: DateRangePreset
  onValueChange: (value: DateRangePreset) => void
}

export function DateRangeSelector({ value, onValueChange }: DateRangeSelectorProps) {
  return (
    <div className="flex w-full flex-col gap-1 sm:w-auto">
      <span className="text-xs font-semibold uppercase text-muted-foreground">Time Range</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full min-w-[220px] sm:w-[220px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24h">Last 24 hours</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function getDateRangeFromPreset(preset: DateRangePreset): DateRange {
  const now = new Date()
  const end = now.toISOString()
  
  if (preset === "all") {
    return { start: null, end: null }
  }
  
  const start = new Date(now)
  
  switch (preset) {
    case "24h":
      start.setHours(now.getHours() - 24)
      break
    case "7d":
      start.setDate(now.getDate() - 7)
      break
    case "30d":
      start.setDate(now.getDate() - 30)
      break
  }
  
  return { start: start.toISOString(), end }
}
