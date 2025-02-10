"use client";

import React from "react";
import { Event } from "@/types";
import EventCard from "@/components/events/EventCard";

interface EventListProps {
  events: Event[];
  onBookEvent?: (eventId: string) => void;
  onEventClick?: (event: Event) => void;
  readOnly?: boolean;
}

export function EventList({
  events,
  onEventClick,
  readOnly = false,
}: EventListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4">
      {events.map((event) => (
        <div
          key={event._id}
          className={readOnly ? "cursor-not-allowed opacity-60" : ""}
        >
          <EventCard
            event={event}
            onClick={() => {
              if (!readOnly && onEventClick) {
                onEventClick(event);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}
