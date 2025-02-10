"use client";

import React, { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface EventFormData {
  title: string;
  description: string;
  date: string;
  category: string;
  image?: File;
  imageUrl?: string;
}

const uploadImage = async (file: File): Promise<string> => {
  try {
    if (!file) {
      throw new Error("No file selected");
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 5MB limit");
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload JPEG, PNG, or WebP images only"
      );
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};

const AdminEvents: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [newEvent, setNewEvent] = useState<EventFormData>({
    title: "",
    date: "",
    description: "",
    imageUrl: "",
    category: "",
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
        !newEvent.category
      ) {
        throw new Error("Please fill in all required fields");
      }

      let imageUrl = "";
      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error.message || "Failed to upload image");
          } else {
            setError("Failed to upload image");
          }
          return;
        }
      }

      const eventData: EventFormData = {
        ...newEvent,
        imageUrl,
      };

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      // Reset form
      setNewEvent({
        title: "",
        date: "",
        description: "",
        imageUrl: "",
        category: "",
      });
      setSelectedFile(null);

      // Redirect to events page
      router.push("/admin/events");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create event");
      }
      console.error("Event creation error:", error);
    }
  };

  return (
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
          <Label htmlFor="event-date" className="mb-1 block">
            Date
          </Label>
          <Input
            id="event-date"
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
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
        <Button
          onClick={handleCreateEvent}
          className="w-full"
          disabled={
            !newEvent.title ||
            !newEvent.date ||
            !newEvent.description ||
            !newEvent.category
          }
        >
          Create Event
        </Button>
      </div>
    </div>
  );
};

export default AdminEvents;
