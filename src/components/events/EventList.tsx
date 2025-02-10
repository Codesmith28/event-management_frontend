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
  onBookEvent,
  onEventClick,
  readOnly = false,
}: EventListProps) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event._id}
          className={readOnly ? "cursor-not-allowed opacity-60" : ""}
        >
          <EventCard
            event={event}
            onBook={(id) => {
              if (!readOnly && onBookEvent) {
                onBookEvent(id);
              }
            }}
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
