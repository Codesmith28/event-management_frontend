"use client";

import React, { useEffect, useState } from "react";
import AdminEvents from "./createEvents";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Event } from "@/types";
import { EventFilter } from "@/components/events/EventFilter";
import { EventList } from "@/components/events/EventList";
import { useToast } from "@/components/ui/use-toast";
import { useSocket } from "@/contexts/SocketContext";

const initialFilters = {
  title: "",
  category: "",
  startDate: "",
  endDate: "",
};

export default function AdminDashboard() {
  const { isLoaded, userRole } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const socket = useSocket();

  // Redirect non-admin users to the public dashboard
  useEffect(() => {
    if (isLoaded && userRole !== "admin") {
      router.replace("/dashboard");
    }
  }, [isLoaded, userRole, router]);

  // State for filtering and listing events in the "dashboard" tab
  const [filters, setFilters] = useState(initialFilters);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.title) params.append("title", filters.title);
        if (filters.category && filters.category !== "all")
          params.append("category", filters.category);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const response = await fetch(`/api/events?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setEvents(data);
        setError("");
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setError("Failed to fetch events");
        toast({
          title: "Error",
          description: "Failed to fetch events",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [filters, toast]);

  useEffect(() => {
    socket.connect();

    // Add socket event listeners for real-time updates
    socket.on("eventCreated", (newEvent) => {
      setEvents((prev) => [...prev, newEvent]);
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
                attendees: Array(count).fill("placeholder"),
                seatsAvailable: seatsAvailable,
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
  }, [socket]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  // Handle event click (for example, open a modal or navigate to event details)
  const handleEventClick = (event: Event) => {
    console.log("Event clicked:", event);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button asChild variant="outline">
            <Link href="/dashboard">View Public Site</Link>
          </Button>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="events">Add Events</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  View your administration statistics and metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EventFilter
                  filters={filters}
                  setFilters={setFilters}
                  onReset={handleResetFilters}
                />
                {loading && <p>Loading events...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <EventList events={events} onEventClick={handleEventClick} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <AdminEvents />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
