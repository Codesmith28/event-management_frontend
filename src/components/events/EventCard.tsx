"use client";

import React, { useState, useEffect } from "react";
// import Image from "next/image";

import { CldImage } from "next-cloudinary";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types";
import { useAuth } from "@/context/AuthContext";

type EventCardProps = {
  event: Event;
  onEdit?: (eventId: string) => void;
  onBook?: (eventId: string) => void;
  onClick?: (eventId: string) => void;
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onClick,
}) => {
  const { userRole } = useAuth();
  const [formattedDate, setFormattedDate] = useState<string>("");
  const seatsAvailable = event.seatsTotal - event.attendees.length;

  useEffect(() => {
    const date = new Date(event.date);
    setFormattedDate(date.toLocaleDateString());
  }, [event.date]);

  // For guests, visually gray out the card and disable pointer events
  const isGuest = userRole === "guest";
  const cardClassName = isGuest
    ? "opacity-50 pointer-events-none"
    : "cursor-pointer";

  // const updateEvent = async (id: string, updatedEvent: Partial<Event>) => {
  //   try {
  //     await axios.put(`/api/events/${id}`, updatedEvent);
  //     fetchEvents();
  //   } catch (error) {
  //     console.error("Failed to update event:", error);
  //   }
  // };

  // const deleteEvent = async (id: string) => {
  //   try {
  //     await axios.delete(`/api/events/${id}`);
  //     fetchEvents();
  //   } catch (error) {
  //     console.error("Failed to delete event:", error);
  //   }
  // };

  return (
    <Card
      className={`w-full sm:w-full max-w-sm h-[450px] flex flex-col ${cardClassName}`}
      onClick={() => !isGuest && onClick && onClick(event._id)}
    >
      {event.imageUrl && (
        <div className="relative h-40">
          <CldImage
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
      )}
      <CardHeader className="p-6">
        <h2 className="text-xl font-bold line-clamp-1">{event.title}</h2>
        <Badge className="mt-2">{event.category}</Badge>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <p className="text-sm mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            <strong>Date:</strong> {formattedDate}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Time:</strong> {event.time}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Location:</strong> {event.location}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Available Seats:</strong>{" "}
            {seatsAvailable <= 0 ? (
              <span className="text-red-500 font-semibold">Sold Out</span>
            ) : (
              seatsAvailable
            )}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-6 flex justify-end space-x-2">
        {userRole === "admin" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit && onEdit(event._id)}
          >
            Edit
          </Button>
        )}
        {userRole === "guest" && (
          <span className="text-gray-600 text-sm">Login to View Details</span>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
