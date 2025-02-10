"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { CldImage } from "next-cloudinary";
import EventRegistration from "./EventRegistration";
import { getEvent } from "./getEvent";
import { Event } from "@/types";
import { useAuth } from "@/context/AuthContext";

// Move date formatting to a separate function
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function EventPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  // Add state for formatted date to avoid hydration mismatch
  const [formattedDate, setFormattedDate] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await getEvent(params.id as string);
      setEvent(data);
      if (data?.date) {
        setFormattedDate(formatDate(data.date));
      }
      setLoading(false);
    };
    fetchEvent();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section with Image */}
        <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-xl overflow-hidden">
          <CldImage
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Event Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formattedDate}
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {event.location}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="md:col-span-2">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">About this Event</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>

          {/* Right Column - Registration & Details */}
          <div className="md:col-span-1">
            <div className="bg-white shadow-lg rounded-lg p-6 sticky top-4">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Event Details</h3>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <span className="font-semibold">Date:</span> {formattedDate}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Time:</span> {event.time}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Category:</span>{" "}
                    {event.category}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Total Seats:</span>{" "}
                    {event.seatsTotal}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Organizer:</span>{" "}
                    {event.organizer.name}
                  </p>
                </div>
              </div>

              <EventRegistration
                eventId={event._id}
                currentAttendees={event.attendees.length}
                seatsTotal={event.seatsTotal}
                isBooked={event.attendees.includes(user?.id || "")}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
