export type EventStatus = "draft" | "published";

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  category?: string;
  images: string[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
  rememberMe?: boolean;
}
