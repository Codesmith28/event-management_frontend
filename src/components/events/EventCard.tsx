"use client";

import React from "react";
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
  onBook,
  onClick,
}) => {
  // Get user role from auth context
  const { userRole } = useAuth();

  // Formatting event details
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleString();
  const seatsAvailable = event.seatsTotal - event.bookedSeats;

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
      className={`mb-4 ${cardClassName}`}
      onClick={() => !isGuest && onClick && onClick(event._id)}
    >
      {event.imageUrl && (
        <div className="relative h-48">
          <CldImage
            src={event.imageUrl}
            alt={event.title}
            width={100}
            height={100}
            className="object-cover rounded-t-lg"
          />
        </div>
      )}
      <CardHeader>
        <h2 className="text-xl font-bold">{event.title}</h2>
        <Badge>{event.category}</Badge>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{event.description}</p>
        <p className="text-sm text-gray-500">
          <strong>Date:</strong> {formattedDate}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Location:</strong> {event.location}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Organizer:</strong> {event.organizer.name}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Total Seats:</strong> {event.seatsTotal}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Booked Seats:</strong> {event.bookedSeats}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Attendees:</strong> {event.attendees.length}
        </p>
        <p className="text-xs text-gray-400">
          Created: {new Date(event.createdAt).toLocaleDateString()} | Updated:{" "}
          {new Date(event.updatedAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {userRole === "admin" && (
          <Button variant="outline" onClick={() => onEdit && onEdit(event._id)}>
            Edit
          </Button>
        )}
        {userRole === "user" && (
          <Button
            onClick={() => onBook && onBook(event._id)}
            disabled={seatsAvailable <= 0}
          >
            {seatsAvailable <= 0 ? "Sold Out" : "Book Event"}
          </Button>
        )}
        {userRole === "guest" && (
          <span className="text-gray-600 text-sm">Login to Book or Edit</span>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
