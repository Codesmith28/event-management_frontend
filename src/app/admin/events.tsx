"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Event } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    description: "",
  });

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

  const createEvent = async () => {
    try {
      await axios.post("/api/events", newEvent);
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
          <Label htmlFor="event-name" className="mb-1 block">
            Event Name
          </Label>
          <Input
            id="event-name"
            type="text"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
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
        <Button onClick={createEvent}>Create Event</Button>
      </div>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event._id} className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-600">
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="mt-2">{event.description}</p>
            <div className="mt-4 flex space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  updateEvent(event._id, { ...event, title: "Updated Name" })
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
