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
  imageUrl: string;
  category: string;
  organizer: User | string;
  attendees: string[];
  seatsTotal: number;
  createdAt: Date;
  updatedAt: Date;
}
