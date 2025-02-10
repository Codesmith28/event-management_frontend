"use client";

import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { EventForm } from "@/components/forms/EventForm";
import socket from "@/lib/socket";
import { X } from "lucide-react";

type AdminEventCardProps = {
  event: Event;
  onUpdate: () => void;
};

export const AdminEventCard: React.FC<AdminEventCardProps> = ({
  event,
  onUpdate,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentEvent, setCurrentEvent] = useState(event);
  const [formattedDate, setFormattedDate] = useState(
    new Date(event.date).toLocaleDateString()
  );

  useEffect(() => {
    // Listen for event updates
    socket.on("eventUpdated", (updatedEvent) => {
      if (updatedEvent._id === event._id) {
        setCurrentEvent(updatedEvent);
        setFormattedDate(new Date(updatedEvent.date).toLocaleDateString());
      }
    });

    // Listen for attendee updates
    socket.on("attendeeUpdate", ({ eventId, count, seatsAvailable }) => {
      if (eventId === event._id) {
        setCurrentEvent(prev => ({
          ...prev,
          attendees: prev.attendees.slice(0, count),
        }));
      }
    });

    return () => {
      socket.off("eventUpdated");
      socket.off("attendeeUpdate");
    };
  }, [event._id]);

  const handleRemoveAttendee = async (userId: string) => {
    try {
      const response = await fetch(`/api/events/${event._id}/attendees/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove attendee");

      toast({
        title: "Success",
        description: "Attendee removed successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove attendee",
      });
    }
  };

  return (
    <Card className="w-full max-w-sm h-auto">
      {event.imageUrl && (
        <div className="relative h-40">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg'; // Add a placeholder image
            }}
          />
        </div>
      )}
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{event.title}</h2>
            <Badge className="mt-2">{event.category}</Badge>
          </div>
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Edit Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[90vw]">
              <DialogHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl font-bold">
                    Edit Event: {event.title}
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 rounded-full"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <DialogDescription>
                  Make changes to your event details below.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6">
                <EventForm
                  event={event}
                  onSuccess={() => {
                    setIsEditModalOpen(false);
                    onUpdate();
                  }}
                  isEditing={true}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Event Details</h3>
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
              {event.seatsTotal - event.attendees.length}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Attendees ({event.attendees.length})</h3>
            <ScrollArea className="h-32">
              {event.attendees.map((attendee, index) => (
                <div
                  key={typeof attendee === 'string' ? attendee : attendee._id}
                  className="flex justify-between items-center py-2"
                >
                  <span className="text-sm">
                    {typeof attendee === 'string' 
                      ? `Attendee ${index + 1}`
                      : attendee.name}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveAttendee(
                      typeof attendee === 'string' ? attendee : attendee._id
                    )}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6">
        <p className="text-sm text-gray-500">
          Created: {new Date(event.createdAt).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default AdminEventCard; 