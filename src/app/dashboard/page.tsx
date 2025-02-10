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
      const response = await fetch("/api/events");
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
  }, [toast]);

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
