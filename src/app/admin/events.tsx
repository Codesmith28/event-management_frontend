import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await axios.get("/api/events");
    setEvents(response.data);
  };

  const createEvent = async () => {
    await axios.post("/api/events", newEvent);
    fetchEvents();
  };

  const updateEvent = async (id, updatedEvent) => {
    await axios.put(`/api/events/${id}`, updatedEvent);
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await axios.delete(`/api/events/${id}`);
    fetchEvents();
  };

  return (
    <div>
      <h1>Manage Events</h1>
      <div>
        <input
          type="text"
          placeholder="Event Name"
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
        />
        <input
          type="date"
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />
        <textarea
          placeholder="Description"
          onChange={(e) =>
            setNewEvent({ ...newEvent, description: e.target.value })
          }
        ></textarea>
        <button onClick={createEvent}>Create Event</button>
      </div>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <h2>{event.name}</h2>
            <p>{event.date}</p>
            <p>{event.description}</p>
            <button
              onClick={() =>
                updateEvent(event.id, { ...event, name: "Updated Name" })
              }
            >
              Update
            </button>
            <button onClick={() => deleteEvent(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminEvents;
