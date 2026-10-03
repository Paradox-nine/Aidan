export type Event = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  category?: string;
  images: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};
