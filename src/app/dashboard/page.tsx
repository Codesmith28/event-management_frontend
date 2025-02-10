"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { EventList } from "@/components/events/EventList";
import { EventFilter } from "@/components/events/EventFilter";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";
import { Event } from "@/types";

export default function DashboardPage() {
  const { isAuthenticated, userRole } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    startDate: "",
    endDate: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  const fetchEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.title) params.append("title", filters.title);
      if (filters.category) params.append("category", filters.category);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const response = await fetch(`/api/events?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch events");
      
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch events. Please try again later.",
      });
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchEvents();
    socket.connect();

    // Listen for all relevant event updates
    socket.on("eventCreated", (event) => {
      setEvents((prev) => [...prev, event]);
    });

    socket.on("eventUpdated", (updatedEvent) => {
      setEvents((prev) =>
        prev.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    });

    socket.on("eventDeleted", ({ id }) => {
      setEvents((prev) => prev.filter((event) => event._id !== id));
    });

    socket.on("attendeeUpdate", ({ eventId, count, seatsAvailable }) => {
      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId
            ? {
                ...event,
                attendees: Array(count).fill('placeholder'), // This maintains the length
                seatsAvailable: seatsAvailable
              }
            : event
        )
      );
    });

    return () => {
      socket.off("eventCreated");
      socket.off("eventUpdated");
      socket.off("eventDeleted");
      socket.off("attendeeUpdate");
      socket.disconnect();
    };
  }, [fetchEvents]);

  const handleEventClick = (event: Event) => {
    router.push(`/events/${event._id}`);
  };

  const handleBookEvent = async (eventId: string) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to book events.",
      });
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/book`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Booking failed");

      toast({
        title: "Success",
        description: "Event booked successfully!",
      });

      fetchEvents(); // Refresh events list
    } catch (error) {
      console.error("Failed to book event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book event. Please try again.",
      });
    }
  };

  const handleResetFilters = () => {
    setFilters({
      title: "",
      category: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div>
      <main className="container mx-auto px-4 py-3">
        <h1 className="text-3xl font-bold mb-8">Event Dashboard</h1>
        <EventFilter filters={filters} setFilters={setFilters} />
        <EventList
          events={events}
          onEventClick={handleEventClick}
          onBookEvent={handleBookEvent}
          readOnly={!isAuthenticated || userRole === "guest"}
        />
      </main>
    </div>
  );
}
