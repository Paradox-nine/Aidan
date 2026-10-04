/* ============================================================
   WEST YANGON TECHNOLOGICAL UNIVERSITY (WYTU)
   EVENTS INITIAL DATA (data/events.js)
   ============================================================ */

const INITIAL_EVENTS = [
  {
    id: "event-001",
    slug: "annual-tech-symposium-2026",
    title: "WYTU Annual Technology & Innovation Symposium 2026",
    description: "Join leading technological experts, faculty, and engineering students as they present cutting-edge engineering research and student capstone projects.",
    fullContent: "West Yangon Technological University is proud to host the Annual Technology & Innovation Symposium 2026. This prestigious university event brings together researchers, industry partners, faculty, and student innovators across all core engineering majors. The symposium features keynote speeches from prominent engineers, technical paper presentations, interactive laboratory demonstrations, and competitive project showcases. All engineering students and members of the public are invited to attend.",
    date: "2026-11-15",
    time: "09:00 AM - 04:30 PM",
    location: "WYTU Main Assembly Hall & Innovation Center",
    category: "Academic & Tech",
    images: [
      "images/events/sample-1.svg",
      "images/events/tech-symposium.svg",
      "images/events/sample-2.svg"
    ],
    status: "published"
  },
  {
    id: "event-002",
    slug: "robotics-automation-workshop",
    title: "Inter-Departmental Robotics & Automation Workshop",
    description: "Hands-on training session on industrial PLC systems, microcontroller design, and autonomous robotics hosted by the Department of Mechatronics.",
    fullContent: "The Department of Mechatronics Engineering invites students from Mechatronics, CEIT, Electrical Power, and Communication Engineering to participate in an intensive hands-on workshop on Robotics and Industrial Automation. Participants will gain practical experience in configuring programmable logic controllers (PLCs), integrating sensors, and programming autonomous robotic arms. Certificates will be awarded upon completion.",
    date: "2026-12-02",
    time: "10:00 AM - 03:00 PM",
    location: "Mechatronics Automation Laboratory",
    category: "Workshop",
    images: [
      "images/events/sample-2.svg",
      "images/events/sample-1.svg"
    ],
    status: "published"
  },
  {
    id: "event-003",
    slug: "campus-career-fair-2026",
    title: "WYTU Campus Career & Industry Placement Fair",
    description: "Connect with top engineering, architecture, IT, and industrial leaders for internship opportunities, graduate recruitment, and career guidance.",
    fullContent: "The WYTU Student Career Guidance & Placement Center is hosting the 2026 WYTU Campus Career & Industry Placement Fair. Representatives from over 30 leading engineering firms, construction companies, telecom operators, software houses, and manufacturing plants will be on campus to interview graduating seniors and offer internship opportunities. Bring your updated CVs and portfolios.",
    date: "2026-12-18",
    time: "09:30 AM - 04:00 PM",
    location: "WYTU Recreation Center & Grand Lawn",
    category: "Career & Industry",
    images: [
      "images/events/sample-3.svg"
    ],
    status: "published"
  },
  {
    id: "event-004",
    slug: "freshers-welcome-ceremony",
    title: "Freshers Welcome & Orientation Ceremony 2026",
    description: "Welcoming the incoming batch of first-year engineering and architecture students to the West Yangon Technological University campus.",
    fullContent: "West Yangon Technological University cordially welcomes all newly admitted first-year engineering and architecture students to the official Orientation and Welcome Ceremony. The Rector, department heads, and faculty members will deliver introductory remarks. Student association leaders will guide campus tours and introduce student clubs, library facilities, and sports activities.",
    date: "2026-10-05",
    time: "08:30 AM - 12:00 PM",
    location: "WYTU Main Auditorium",
    category: "University Event",
    images: [
      "images/events/welcome-ceremony.svg",
      "images/events/convocation.svg"
    ],
    status: "published"
  },
  {
    id: "event-005",
    slug: "annual-sports-meet-2026",
    title: "WYTU Annual Inter-Departmental Sports Meet",
    description: "Celebrate athletic spirit and teamwork across track and field events, football, volleyball, badminton, and chess competitions.",
    fullContent: "The WYTU Sports Council is excited to announce the commencement of the Annual Inter-Departmental Sports Meet. Students from all 15 academic departments will compete for the coveted Champion Trophy. Events include football tournaments, volleyball matches, track & field events, table tennis, and badminton.",
    date: "2027-01-10",
    time: "08:00 AM - 05:00 PM",
    location: "WYTU Campus Sports Complex & Oval Ground",
    category: "Sports & Life",
    images: [
      "images/events/sports-day.svg"
    ],
    status: "published"
  },
  {
    id: "event-006",
    slug: "research-grant-planning-meeting",
    title: "Faculty Research Grant & Innovation Planning (Internal Draft)",
    description: "Internal faculty discussion regarding incoming research grant applications and joint university-industry technical proposals.",
    fullContent: "Internal administrative meeting for department heads and research program directors to review upcoming research grant applications, laboratory equipment allocation, and technical collaboration frameworks.",
    date: "2027-02-01",
    time: "01:30 PM - 03:30 PM",
    location: "WYTU Rectorate Conference Room",
    category: "Administrative",
    images: [
      "images/events/sample-1.svg"
    ],
    status: "draft"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = INITIAL_EVENTS;
}
