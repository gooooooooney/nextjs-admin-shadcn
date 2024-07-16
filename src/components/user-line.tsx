"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
const chartData = [
  { month: "January", count: 0 },
  { month: "February", count: 0 },
  { month: "March", count: 0 },
  { month: "April", count: 0 },
  { month: "May", count: 0 },
  { month: "June", count: 0 },
  { month: "July", count: 0 },
  { month: "August", count: 0 },
  { month: "September", count: 0 },
  { month: "October", count: 0 },
  { month: "November", count: 0 },
  { month: "December", count: 0 },
]

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function UserLine({ data }: {
  data: Record<string, {
    month: string;
    count: number;
  }[]>
}) {
  const years = Object.keys(data)

  const [year, setYear] = useState(years[0])

  const userData = useMemo(() => {
    years.forEach(year => {
      data[year]?.forEach((user) => {
        const month = chartData.find(v => v.month === user.month)
        if (month) {
          month.count = user.count
        }
      })
    })
    return chartData
  }, [year])


  const onYearChange = (year: string) => {
    setYear(year)

  }

  return (
    <Card className="w-[80%] m-4">
      <CardHeader className="flex-row justify-between">
        <div>
          <CardTitle>User Chart</CardTitle>
          <CardDescription>January - December {year}</CardDescription>
        </div>

        <Select onValueChange={onYearChange} defaultValue={year}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            {
              years.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>

      </CardHeader>
      <CardContent >
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={userData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="count"
              type="natural"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total user registrations for the year
        </div>
      </CardFooter>
    </Card>
  )
}
