"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, SearchIcon, XCircleIcon } from "lucide-react";
import { format } from "date-fns";

interface FilterProps {
  filters: {
    title: string;
    category: string;
    startDate: string;
    endDate: string;
  };
  setFilters: (filters: {
    title: string;
    category: string;
    startDate: string;
    endDate: string;
  }) => void;
  onReset: () => void;
}

const filterSchema = z.object({
  title: z.string(),
  category: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export function EventFilter({ filters, setFilters, onReset }: FilterProps) {
  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: filters,
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "conference", label: "Conference" },
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "networking", label: "Networking" },
    { value: "other", label: "Other" },
  ];

  const handleDateChange = (
    field: "startDate" | "endDate",
    value: Date | undefined
  ) => {
    if (!value) return;

    const dateStr = format(value, "yyyy-MM-dd");

    if (field === "endDate" && dateStr < filters.startDate) {
      // If end date is before start date, adjust start date
      setFilters({ ...filters, startDate: dateStr, [field]: dateStr });
    } else if (
      field === "startDate" &&
      dateStr > filters.endDate &&
      filters.endDate
    ) {
      // If start date is after end date, adjust end date
      setFilters({ ...filters, endDate: dateStr, [field]: dateStr });
    } else {
      setFilters({ ...filters, [field]: dateStr });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFilters({
      ...filters,
      category: value === "all" ? "" : value,
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Form {...form}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Search Title
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search events..."
                          className="pl-8"
                          value={filters.title}
                          onChange={(e) =>
                            setFilters({ ...filters, title: e.target.value })
                          }
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Category
                    </FormLabel>
                    <Select
                      value={filters.category || "all"}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">
                      Start Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            handleDateChange("startDate", date)
                          }
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium">
                      End Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => handleDateChange("endDate", date)}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                            (filters.startDate &&
                              date < new Date(filters.startDate))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={onReset}
                className="flex items-center gap-2"
              >
                <XCircleIcon className="h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
