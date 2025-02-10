"use client";

import React, { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Event } from "@/types";

const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    // Add timeout and proper error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Image upload failed");
    }

    const data = await response.json();
    if (!data.url) {
      throw new Error("Invalid response from server");
    }

    return data.url;
  } catch (error) {
    console.error("Image upload error:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to upload image");
    }
    throw new Error("Failed to upload image. Please try again.");
  }
};

const AdminEvents: React.FC = () => {
  const { toast } = useToast();
  const [, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    date: new Date(),
    time: "12:00",
    description: "",
    imageUrl: "",
    category: "",
    location: "",
    seatsTotal: 100,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Show preview filename
      toast({
        title: "File selected",
        description: `Selected: ${e.target.files[0].name}`,
      });
    }
  };

  const handleCreateEvent = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      if (
        !newEvent.title ||
        !newEvent.date ||
        !newEvent.time ||
        !newEvent.description ||
        !newEvent.category ||
        !newEvent.location ||
        !selectedFile
      ) {
        throw new Error(
          "Please fill in all required fields and upload an image"
        );
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      let imageUrl = "";
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const eventData: Partial<Event> = {
        ...newEvent,
        imageUrl,
        attendees: [],
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(eventData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      const createdEvent = await response.json();
      toast({
        title: "Event Created Successfully",
        description: `${createdEvent.title} has been created and is now live.`,
        variant: "default",
      });

      // Reset form
      setNewEvent({
        title: "",
        date: new Date(),
        time: "12:00",
        description: "",
        imageUrl: "",
        category: "",
        location: "",
        seatsTotal: 100,
      });
      setSelectedFile(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create event";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" mx-auto">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>
            Fill in the details to create a new event.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Title and Category in first row */}
            <div className="space-y-2">
              <Label htmlFor="event-title">Title *</Label>
              <Input
                id="event-title"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-category">Category *</Label>
              <Select
                value={newEvent.category}
                onValueChange={(value) =>
                  setNewEvent({ ...newEvent, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time in second row */}
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newEvent.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEvent.date ? (
                      format(newEvent.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newEvent.date}
                    onSelect={(date) =>
                      setNewEvent({ ...newEvent, date: date || new Date() })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-time">Time *</Label>
              <Input
                id="event-time"
                type="time"
                value={newEvent.time}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, time: e.target.value })
                }
              />
            </div>

            {/* Location and Seats in third row */}
            <div className="space-y-2">
              <Label htmlFor="event-location">Location *</Label>
              <Input
                id="event-location"
                placeholder="Enter event location"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-seats">Total Seats *</Label>
              <Input
                id="event-seats"
                type="number"
                min="1"
                value={newEvent.seatsTotal}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    seatsTotal: parseInt(e.target.value, 10),
                  })
                }
              />
            </div>
          </div>

          {/* Description full width */}
          <div className="space-y-2">
            <Label htmlFor="event-description">Description *</Label>
            <Textarea
              id="event-description"
              placeholder="Enter event description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              className="min-h-[100px]"
            />
          </div>

          {/* Image upload full width */}
          <div className="space-y-2">
            <Label htmlFor="event-thumbnail">Event Thumbnail *</Label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {selectedFile ? "Change Image" : "Upload Image"}
              </Button>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full sm:w-auto"
            onClick={handleCreateEvent}
            disabled={
              isSubmitting ||
              !newEvent.title ||
              !newEvent.date ||
              !newEvent.time ||
              !newEvent.description ||
              !newEvent.category ||
              !newEvent.location ||
              !selectedFile
            }
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminEvents;
