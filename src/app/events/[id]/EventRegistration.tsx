"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import socket from "@/lib/socket";

type EventRegistrationProps = {
  ticketsAvailable: boolean;
  eventId: string;
  currentAttendees: number;
};

export default function EventRegistration({
  ticketsAvailable,
  eventId,
  currentAttendees,
}: EventRegistrationProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [attendees, setAttendees] = useState(currentAttendees);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to book events.",
      });
      return;
    }

    try {
      setIsRegistering(true);
      const response = await fetch(`/api/events/${eventId}/book`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Booking failed");

      toast({
        title: "Success",
        description: "Event booked successfully!",
      });

      // Socket will handle the attendee count update
    } catch (error) {
      console.error("Error booking event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book event. Please try again.",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // Listen for socket updates
  useEffect(() => {
    socket.on("attendeeUpdate", ({ eventId: updatedEventId, count }) => {
      if (eventId === updatedEventId) {
        setAttendees(count);
      }
    });

    return () => {
      socket.off("attendeeUpdate");
    };
  }, [eventId]);

  return (
    <>
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600">Current Attendees: {attendees}</p>
      </div>
      {ticketsAvailable ? (
        <button
          onClick={handleRegister}
          disabled={isRegistering}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
        >
          {isRegistering ? "Registering..." : "Register Now"}
        </button>
      ) : (
        <div className="text-center p-3 bg-gray-100 rounded-md">
          <p className="text-gray-600 font-semibold">Registration Closed</p>
        </div>
      )}
    </>
  );
}
