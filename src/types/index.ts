export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl: string; // note: using imageUrl for consistency with backend
  category: string;
  organizer: User;
  attendees: User[];
  seatsTotal: number;
  bookedSeats: number;
  createdAt: Date;
  updatedAt: Date;
}
