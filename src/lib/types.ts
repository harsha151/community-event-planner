export type User = {
  id: string;
  name: string;
  email: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  time: string; // HH:mm
  location: string;
  category: string;
  createdBy: string; // User ID
  attendees: string[]; // List of User IDs
};

export type CreateEventInput = Omit<Event, 'id' | 'attendees' | 'createdBy'>;
