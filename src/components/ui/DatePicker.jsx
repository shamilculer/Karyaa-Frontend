"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ date, setDate }) {
  const [open, setOpen] = React.useState(false)

  // the calendar component expects a Date object, but we might just pass an ISO string from the form
  const parsedDate = (typeof date === "string" && date) ? new Date(date) : (date || undefined);

  const handleSelect = (selectedDate) => {
    setDate(selectedDate)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
            type="button"
          >
            {parsedDate ? parsedDate.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={parsedDate}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
