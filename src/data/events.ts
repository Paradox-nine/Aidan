import { Event } from '../types/event';

/**
 * Sample / Demo Event Data for WYTU Events & Announcements System.
 * These realistic placeholder entries are strictly used for UI development and demonstration.
 */
export const MOCK_EVENTS: Event[] = [
  {
    id: "evt-001",
    slug: "wytu-technology-exhibition-2026",
    title: "WYTU Technology Exhibition 2026",
    description: "An annual university showcase featuring innovative research projects, student technological creations, automated robotics demonstrations, and software applications developed by West Yangon Technological University engineering and IT departments.",
    date: "15 November 2026",
    time: "09:00 AM - 04:00 PM",
    location: "Main Auditorium, WYTU Campus",
    category: "Exhibition",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "published",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-15T10:30:00Z"
  },
  {
    id: "evt-002",
    slug: "annual-coding-hackathon-2026",
    title: "Annual University Coding Hackathon 2026",
    description: "A 24-hour intensive competitive programming and product creation sprint. Teams of 3-4 students collaborate to solve real-world problems through innovative web and mobile application prototypes.",
    date: "28 November 2026",
    time: "08:30 AM - 08:30 AM (Next Day)",
    location: "Computer Engineering Lab 3 & 4",
    category: "Competition",
    images: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "published",
    createdAt: "2026-01-20T09:00:00Z",
    updatedAt: "2026-01-22T14:15:00Z"
  },
  {
    id: "evt-003",
    slug: "ai-machine-learning-workshop",
    title: "Hands-on AI & Machine Learning Workshop",
    description: "An interactive technical workshop covering fundamental principles of artificial intelligence, neural networks, and practical model training using Python and modern machine learning frameworks.",
    date: "05 December 2026",
    time: "01:00 PM - 05:00 PM",
    location: "Seminar Hall B",
    category: "Workshop",
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "published",
    createdAt: "2026-02-01T11:00:00Z",
    updatedAt: "2026-02-03T16:00:00Z"
  },
  {
    id: "evt-004",
    slug: "cybersecurity-seminar-2026",
    title: "Cybersecurity & Network Defense Seminar",
    description: "Distinguished guest lecture and interactive panel with industry cybersecurity leaders discussing current threat landscapes, ethical hacking practices, and infrastructure defense techniques.",
    date: "12 December 2026",
    time: "10:00 AM - 01:00 PM",
    location: "WYTU Conference Center",
    category: "Seminar",
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "published",
    createdAt: "2026-02-10T10:00:00Z",
    updatedAt: "2026-02-12T12:00:00Z"
  },
  {
    id: "evt-005",
    slug: "campus-tech-meetup",
    title: "Student Tech Community Meetup",
    description: "A relaxed community networking gathering for tech enthusiasts, open-source contributors, and aspiring engineers across all departments to share projects, ideas, and career insights.",
    date: "18 December 2026",
    time: "03:00 PM - 05:30 PM",
    location: "Student Activity Center Lounge",
    category: "Community",
    images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "published",
    createdAt: "2026-02-15T14:00:00Z",
    updatedAt: "2026-02-16T11:20:00Z"
  },
  {
    id: "evt-006",
    slug: "upcoming-faculty-symposium",
    title: "Draft Faculty Research Symposium",
    description: "Internal academic draft event for faculty members to present peer-reviewed papers.",
    date: "22 December 2026",
    time: "09:00 AM - 03:00 PM",
    location: "Faculty Lounge",
    category: "Academic",
    images: [
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80"
    ],
    status: "draft",
    createdAt: "2026-02-18T09:00:00Z",
    updatedAt: "2026-02-18T09:00:00Z"
  }
];
