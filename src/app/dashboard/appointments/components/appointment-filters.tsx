"use client";

import { useState } from "react";
import { FilterIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calender";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export function AppointmentFilters() {
  const [open, setOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["CONFIRMED", "REQUESTED"]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const statuses = [
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "REQUESTED", label: "Requested" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "DECLINED", label: "Declined" },
  ];

  const toggleStatus = (status: string) => {
    setSelectedStatuses((current) => {
      if (current.includes(status)) {
        return current.filter((s) => s !== status);
      }
      return [...current, status];
    });
  };

  const handleReset = () => {
    setSelectedStatuses(["CONFIRMED", "REQUESTED"]);
    setDateRange(undefined);
  };

  let selectedText = "Filter";
  if (selectedStatuses.length < 5 || (dateRange && (dateRange.from || dateRange.to))) {
    const filtersCount = 
      (selectedStatuses.length < 5 ? 1 : 0) + 
      (dateRange && (dateRange.from || dateRange.to) ? 1 : 0);
    selectedText = `${filtersCount} filter${filtersCount > 1 ? 's' : ''} applied`;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          <span>{selectedText}</span>
          {(selectedStatuses.length < 5 || (dateRange && (dateRange.from || dateRange.to))) && (
            <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
              {selectedStatuses.length < 5 ? selectedStatuses.length : ""}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-4" align="end">
        <div className="space-y-4">
          <h4 className="font-medium">Filter Appointments</h4>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Status</h5>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Badge
                  key={status.value}
                  variant="outline"
                  className={`cursor-pointer ${
                    selectedStatuses.includes(status.value)
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted/50 hover:bg-muted"
                  }`}
                  onClick={() => toggleStatus(status.value)}
                >
                  {selectedStatuses.includes(status.value) && (
                    <CheckIcon className="mr-1 h-3 w-3" />
                  )}
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h5 className="text-sm font-medium">Date Range</h5>
            <div className="flex flex-col gap-2">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">From</div>
                  <div className="text-sm font-medium">
                    {dateRange?.from ? format(dateRange.from, "PPP") : "Any date"}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">To</div>
                  <div className="text-sm font-medium">
                    {dateRange?.to ? format(dateRange.to, "PPP") : "Any date"}
                  </div>
                </div>
              </div>
              
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                className="rounded-md border"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-sm"
            >
              Reset Filters
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}