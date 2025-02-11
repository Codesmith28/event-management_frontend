"use client";

import React from "react";
import { Event } from "@/types";
import EventCard from "@/components/events/EventCard";
import AdminEventCard from "@/components/events/AdminEventCard";
import { useAuth } from "@/context/AuthContext";

interface EventListProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onUpdate?: () => void;
  onBookEvent?: (eventId: string) => Promise<void>;
  readOnly?: boolean;
  loading?: boolean;
}

export function EventList({
  events,
  onEventClick,
  onUpdate,
  // onBookEvent,
  readOnly = false,
  loading = false,
}: EventListProps) {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";

  // Ensure events is an array
  const eventArray = Array.isArray(events) ? events : [];

  if (loading) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        Loading events...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {eventArray.map((event) => (
          <div key={event._id} className="w-full max-w-sm">
            {isAdmin ? (
              <AdminEventCard
                event={event}
                onUpdate={() => onUpdate && onUpdate()}
              />
            ) : (
              <EventCard
                event={event}
                onClick={() => {
                  if (!readOnly && onEventClick) {
                    onEventClick(event);
                  }
                }}
              />
            )}
          </div>
        ))}
        {eventArray.length === 0 && !loading && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No events found
          </div>
        )}
      </div>
    </div>
  );
}
