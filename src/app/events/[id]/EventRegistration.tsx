"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import socket from "@/lib/socket";

type EventRegistrationProps = {
  eventId: string;
  currentAttendees: number;
  seatsTotal: number;
  isBooked: boolean;
};

export default function EventRegistration({
  eventId,
  currentAttendees,
  seatsTotal,
  isBooked,
}: EventRegistrationProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [attendees, setAttendees] = useState(currentAttendees);
  const [seatsAvailable, setSeatsAvailable] = useState(
    seatsTotal - currentAttendees
  );
  const [hasBooked, setHasBooked] = useState(isBooked);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to book events.",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const method = hasBooked ? "DELETE" : "POST";
      const response = await fetch(`/api/events/${eventId}/book`, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error(hasBooked ? "Unbooking failed" : "Booking failed");

      const data = await response.json();
      setHasBooked(!hasBooked);
      setAttendees(data.attendees);
      setSeatsAvailable(data.seatsAvailable);

      toast({
        title: "Success",
        description: hasBooked
          ? "Event unbooked successfully!"
          : "Event booked successfully!",
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${
          hasBooked ? "unbook" : "book"
        } event. Please try again.`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    socket.on(
      "attendeeUpdate",
      ({ eventId: updatedEventId, count, seatsAvailable: availableSeats }) => {
        if (eventId === updatedEventId) {
          setAttendees(count);
          setSeatsAvailable(availableSeats);
        }
      }
    );

    return () => {
      socket.off("attendeeUpdate");
    };
  }, [eventId]);

  return (
    <>
      <div className="mb-4 text-center space-y-2">
        <p className="text-sm text-gray-600">Current Attendees: {attendees}</p>
        <p className="text-sm text-gray-600">
          Seats Available: {seatsAvailable}
        </p>
      </div>
      {seatsAvailable > 0 || hasBooked ? (
        <button
          onClick={handleBooking}
          disabled={isProcessing}
          className={`w-full px-6 py-3 rounded-md transition-colors font-semibold disabled:opacity-50 
            ${
              hasBooked
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {isProcessing
            ? hasBooked
              ? "Unbooking..."
              : "Booking..."
            : hasBooked
            ? "Cancel Booking"
            : "Book Event"}
        </button>
      ) : (
        <div className="text-center p-3 bg-gray-100 rounded-md">
          <p className="text-gray-600 font-semibold">Event Fully Booked</p>
        </div>
      )}
    </>
  );
}
