import { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { Event } from "@/types";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { formatDate, cn } from "@/lib/utils";

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
  const { isAuthenticated, userRole } = useAuth();

  const getEventStatus = (event: Event) => {
    const isFull = event.bookedSeats >= event.seatsTotal;
    const isPast = new Date(event.date) < new Date();

    if (isPast) return { label: "Ended", variant: "secondary" as const };
    if (isFull) return { label: "Full", variant: "destructive" as const };
    return { label: "Available", variant: "default" as const };
  };

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const status = getEventStatus(event);
        const seatsAvailable = event.seatsTotal - event.bookedSeats;

        return (
          <div
            key={event._id}
            className={cn(
              "rounded-lg border p-4 transition-colors",
              readOnly
                ? "cursor-not-allowed opacity-60 bg-muted"
                : "cursor-pointer hover:bg-accent"
            )}
            onClick={() => !readOnly && onEventClick?.(event)}
            role={!readOnly ? "button" : "article"}
            aria-disabled={readOnly}
          >
            <div className="relative aspect-video w-full">
              {event.imageUrl ? (
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover rounded-t-lg"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {event.title}
                  </h3>
                  <Badge variant="outline" className="mt-2">
                    {event.category}
                  </Badge>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {event.description}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(event.date.toString())}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {seatsAvailable} seats available ({event.bookedSeats}/
                    {event.seatsTotal})
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-4">
              {isAuthenticated ? (
                <Button
                  onClick={() => onBookEvent?.(event._id)}
                  disabled={seatsAvailable <= 0 || userRole === "guest"}
                  className="w-full"
                  variant={seatsAvailable <= 0 ? "secondary" : "default"}
                >
                  {seatsAvailable <= 0
                    ? "Sold Out"
                    : userRole === "guest"
                    ? "Login to Book"
                    : "Book Event"}
                </Button>
              ) : (
                <Button variant="secondary" className="w-full" disabled>
                  Login to Book
                </Button>
              )}
            </CardFooter>
          </div>
        );
      })}
    </div>
  );
}
