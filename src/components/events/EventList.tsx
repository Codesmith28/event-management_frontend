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
  readOnly?: boolean;
}

export function EventList({
  events,
  onEventClick,
  onUpdate,
  readOnly = false,
}: EventListProps) {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";

  // Ensure events is an array
  const eventArray = Array.isArray(events) ? events : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4">
      {eventArray.map((event) => (
        <div key={event._id}>
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
      {eventArray.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No events found
        </div>
      )}
    </div>
  );
}
