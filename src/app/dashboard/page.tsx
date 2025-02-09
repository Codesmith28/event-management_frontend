"use client";

import { useEffect, useState } from "react";
import { EventList } from "@/components/events/EventList";
import { EventFilter } from "@/components/events/EventFilter";
import socket from "@/lib/socket";
import { Navbar } from "@/components/shared/Navbar";
import { Event } from "@/types";

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchEvents();

    socket.connect();

    socket.on("attendeeUpdate", ({ eventId, count }) => {
      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId ? { ...event, attendees: count } : event
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Event Dashboard</h1>
        <EventFilter filters={filters} setFilters={setFilters} />
        <EventList events={events} />
      </main>
    </div>
  );
}
