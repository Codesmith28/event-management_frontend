"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
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
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string>("");
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    date: new Date(),
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
    }
  };

  const handleCreateEvent = async () => {
    try {
      setError("");
      if (
        !newEvent.title ||
        !newEvent.date ||
        !newEvent.description ||
        !newEvent.category ||
        !newEvent.location
      ) {
        throw new Error("Please fill in all required fields");
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

      // Reset form
      setNewEvent({
        title: "",
        date: new Date(),
        description: "",
        imageUrl: "",
        category: "",
        location: "",
        seatsTotal: 100,
      });
      setSelectedFile(null);

      toast({
        title: "Success",
        description: "Event created successfully!",
        variant: "default",
      });

      router.push("/admin/events");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create event";
      setError(errorMessage);
      console.error("Event creation error:", error);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="space-y-4 mb-8">
          <div>
            <Label htmlFor="event-title" className="mb-1 block">
              Event Title
            </Label>
            <Input
              id="event-title"
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="event-location" className="mb-1 block">
              Location
            </Label>
            <Input
              id="event-location"
              type="text"
              placeholder="Event Location"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="event-date" className="mb-1 block">
              Date
            </Label>
            <Input
              id="event-date"
              type="date"
              value={(newEvent.date ?? new Date()).toISOString().split("T")[0]}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: new Date(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="event-description" className="mb-1 block">
              Description
            </Label>
            <Textarea
              id="event-description"
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="event-thumbnail" className="mb-1 block">
              Event Thumbnail
            </Label>
            <Input
              id="event-thumbnail"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="event-category" className="mb-1 block">
              Category
            </Label>
            <select
              id="event-category"
              value={newEvent.category}
              onChange={(e) =>
                setNewEvent({ ...newEvent, category: e.target.value })
              }
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Category</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
            </select>
          </div>
          <div>
            <Label htmlFor="event-seats" className="mb-1 block">
              Total Seats
            </Label>
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
              className="w-full"
            />
          </div>
          <Button
            onClick={handleCreateEvent}
            className="w-full"
            disabled={
              !newEvent.title ||
              !newEvent.date ||
              !newEvent.description ||
              !newEvent.category ||
              !newEvent.location
            }
          >
            Create Event
          </Button>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default AdminEvents;
