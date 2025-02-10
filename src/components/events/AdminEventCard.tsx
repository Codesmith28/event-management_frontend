"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
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
} from "@/components/ui/dialog";
import { EventForm } from "@/components/forms/EventForm";
import { Edit, ExternalLink } from "lucide-react";

type AdminEventCardProps = {
  event: Event;
  onUpdate: () => void;
};

export const AdminEventCard: React.FC<AdminEventCardProps> = ({
  event,
  onUpdate,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/admin/events/${event._id}`);
  };

  return (
    <Card className="w-full max-w-sm h-[300px] hover:shadow-lg transition-shadow cursor-pointer">
      <div className="h-full flex flex-col" onClick={handleCardClick}>
        {event.imageUrl && (
          <div className="relative h-32">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover rounded-t-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
              }}
            />
          </div>
        )}
        <CardHeader className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-lg font-bold line-clamp-1">{event.title}</h2>
              <Badge>{event.category}</Badge>
            </div>
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-[90vw]" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle>Edit Event: {event.title}</DialogTitle>
                </DialogHeader>
                <EventForm
                  event={event}
                  onSuccess={() => {
                    setIsEditModalOpen(false);
                    onUpdate();
                  }}
                  isEditing={true}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="font-medium">Date:</span>{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Available Seats:</span>{" "}
              {event.seatsTotal - event.attendees.length}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default AdminEventCard; 