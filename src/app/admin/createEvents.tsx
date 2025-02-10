"use client";

import React, { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const uploadImage = async (imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

const createEvent = async (eventData: {
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  category: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create event:", error);
    throw error;
  }
};

const AdminEvents: React.FC = () => {
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
    imageUrl: "",
    category: "", // Add category field
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const imageUrl = selectedFile ? await uploadImage(selectedFile) : "";

      const payload = {
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        imageUrl: imageUrl,
        category: newEvent.category, // Include category in payload
      };

      await createEvent(payload);
      setNewEvent({
        title: "",
        date: "",
        description: "",
        imageUrl: "",
        category: "", // Reset category
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>
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
        <Button onClick={handleCreateEvent}>Create Event</Button>
      </div>
    </div>
  );
};

export default AdminEvents;
