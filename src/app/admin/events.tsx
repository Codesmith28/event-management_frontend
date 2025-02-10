"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { Event } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { CldImage } from "next-cloudinary";

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
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
    imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

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
        category: "Entertainment",
      };

      await createEvent(payload);
      setNewEvent({
        title: "",
        date: "",
        description: "",
        imageUrl: "",
      });
      setSelectedFile(null);
      fetchEvents();
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const updateEvent = async (id: string, updatedEvent: Partial<Event>) => {
    try {
      await axios.put(`/api/events/${id}`, updatedEvent);
      fetchEvents();
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await axios.delete(`/api/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
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
        <Button onClick={handleCreateEvent}>Create Event</Button>
      </div>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event._id} className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-600">
              {new Date(event.date).toLocaleDateString()}
            </p>
            {event.imageUrl && (
              <CldImage
                src={event.imageUrl}
                alt="Event thumbnail"
                className="mt-2 w-32 h-32 object-cover"
              />
            )}
            <p className="mt-2">{event.description}</p>
            <div className="mt-4 flex space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  updateEvent(event._id, { ...event, title: "Updated Title" })
                }
              >
                Update
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteEvent(event._id)}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminEvents;
