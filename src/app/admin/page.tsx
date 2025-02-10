"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminEvents from "./events";
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

export default function AdminDashboard() {
  const { isLoaded, userRole } = useAuth();
  const router = useRouter();

  // Redirect non-admin users to the public dashboard
  useEffect(() => {
    if (isLoaded && userRole !== "admin") {
      router.replace("/dashboard");
    }
  }, [isLoaded, userRole, router]);

  // State for filtering and listing events in the "dashboard" tab
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    startDate: "",
    endDate: "",
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch events whenever filters change
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.title) params.append("title", filters.title);
        if (filters.category) params.append("category", filters.category);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const response = await axios.get("/api/events", { params });
        setEvents(response.data);
        setError("");
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filters]);

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
                <EventFilter filters={filters} setFilters={setFilters} />
                {loading && <p>Loading events...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <EventList events={events} onEventClick={handleEventClick} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Events Management</CardTitle>
                <CardDescription>
                  Create, edit, and manage all events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminEvents />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
