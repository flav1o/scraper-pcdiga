"use client"

import { useState } from "react"
import { CalendarDays, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DateRangePickerProps {
  startDate?: Date
  endDate?: Date
  onStartDateChange: (date: Date | undefined) => void
  onEndDateChange: (date: Date | undefined) => void
  className?: string
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: DateRangePickerProps) {
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isEndOpen, setIsEndOpen] = useState(false)

  const clearDates = () => {
    onStartDateChange(undefined)
    onEndDateChange(undefined)
    setIsStartOpen(false)
    setIsEndOpen(false)
  }

  const today = new Date()

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      {/* Start Date Picker */}
      <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[140px] justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "MMM dd") : "Data início"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(date) => {
              onStartDateChange(date)
              setIsStartOpen(false)
            }}
            initialFocus
            disabled={(date) => date > today}
          />
        </PopoverContent>
      </Popover>

      {/* End Date Picker */}
      <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[140px] justify-start text-left font-normal",
              !endDate && "text-muted-foreground"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "MMM dd") : "Data fim"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(date) => {
              onEndDateChange(date)
              setIsEndOpen(false)
            }}
            initialFocus
            disabled={(date) => startDate ? date < startDate : false}
          />
        </PopoverContent>
      </Popover>

      {/* Clear Button */}
      {(startDate || endDate) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearDates}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 