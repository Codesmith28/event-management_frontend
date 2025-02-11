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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

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

  // Update form values when filters change
  useEffect(() => {
    form.reset(filters);
  }, [filters, form]);

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
    
    // Update both form and filters
    form.setValue(field, dateStr);
    
    if (field === "endDate" && dateStr < filters.startDate) {
      setFilters({ ...filters, startDate: dateStr, [field]: dateStr });
      form.setValue("startDate", dateStr);
    } else if (field === "startDate" && dateStr > filters.endDate && filters.endDate) {
      setFilters({ ...filters, endDate: dateStr, [field]: dateStr });
      form.setValue("endDate", dateStr);
    } else {
      setFilters({ ...filters, [field]: dateStr });
    }
  };

  const handleCategoryChange = (value: string) => {
    form.setValue("category", value);
    setFilters({
      ...filters,
      category: value === "all" ? "" : value,
    });
  };

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    setFilters({
      ...filters,
      title: data.title,
      category: data.category === "all" ? "" : data.category,
      startDate: data.startDate,
      endDate: data.endDate,
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Accordion type="single" collapsible>
          <AccordionItem value="filters">
            <AccordionTrigger>Search & Filter Events</AccordionTrigger>
            <AccordionContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Search by Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Search events..."
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setFilters({
                                  ...filters,
                                  title: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={handleCategoryChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  handleDateChange("startDate", date)
                                }
                                disabled={(date) =>
                                  date <
                                  new Date(new Date().setHours(0, 0, 0, 0))
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  handleDateChange("endDate", date)
                                }
                                disabled={(date) =>
                                  date <
                                    new Date(new Date().setHours(0, 0, 0, 0)) ||
                                  (!!filters.startDate &&
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
                      type="submit"
                      className="flex items-center gap-2"
                    >
                      <SearchIcon className="h-4 w-4" />
                      Search
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onReset}
                      className="flex items-center gap-2"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Reset Filters
                    </Button>
                  </div>
                </form>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
