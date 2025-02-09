import axios from "axios";
import { Event } from "@/types";

export const eventService = {
  getAllEvents: async () => {
    const response = await axios.get("/api/events");
    return response.data;
  },

  getEvent: async (id: string) => {
    const response = await axios.get(`/api/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData: Omit<Event, "_id">) => {
    const response = await axios.post("/api/events", eventData);
    return response.data;
  },

  updateEvent: async (id: string, eventData: Partial<Event>) => {
    const response = await axios.put(`/api/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: string) => {
    const response = await axios.delete(`/api/events/${id}`);
    return response.data;
  },

  bookEvent: async (eventId: string) => {
    const response = await axios.post(`/api/events/${eventId}/book`);
    return response.data;
  },
};
