"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "@/components/forms/EventForm";
import { socket } from "@/lib/socket";

export default function AdminEventPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch event");
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch event details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  useEffect(() => {
    socket.connect();

    socket.on("eventUpdated", (updatedEvent) => {
      if (updatedEvent._id === event?._id) {
        setEvent(updatedEvent);
      }
    });

    return () => {
      socket.off("eventUpdated");
      socket.disconnect();
    };
  }, [event?._id]);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    fetchEvent(); // Refresh event data
    toast({
      title: "Success",
      description: "Event updated successfully",
    });
  };

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
                <Badge className="mt-2">{event.category}</Badge>
              </div>
              <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                Edit Event
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {event.imageUrl && (
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Event Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Time:</span> {event.time}</p>
                  <p><span className="font-medium">Location:</span> {event.location}</p>
                  <p><span className="font-medium">Total Seats:</span> {event.seatsTotal}</p>
                  <p><span className="font-medium">Available Seats:</span> {event.seatsTotal - event.attendees.length}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{event.description}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Attendees ({event.attendees.length})</h3>
              {/* Add attendee management here */}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Event: {event.title}</DialogTitle>
            </DialogHeader>
            <EventForm
              event={event}
              onSuccess={handleEditSuccess}
              isEditing={true}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 