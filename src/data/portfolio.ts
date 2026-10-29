export interface Project {
  id: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  technologies: string[];
  role: string;
  status: string;
  imageUrl?: string;
  links: {
    github?: string;
    demo?: string;
    caseStudy?: string;
  };
  caseStudyDetails?: {
    overview: string;
    problemMotivation: string;
    requirements: string;
    architecture: string;
    components: string;
    implementation: string;
    decisions: string;
    challenges: string;
    results: string;
    limitations: string;
  };
}

export interface Skill {
  name: string;
  description: string;
  projects?: string[]; // project ids
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Experience {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  type: 'education' | 'leadership' | 'competition';
}

export const portfolio = {
  personalInfo: {
    name: "Zin Myoe Naing",
    aka: "COZE",
    role: "IT ENGINEERING / AI / ROBOTICS",
    tagline: "I Build Intelligent Systems.",
    supportingText: "I combine software engineering, artificial intelligence, robotics, electronics, and 3D design to turn ideas into practical technology. Beyond building systems, I enjoy helping students discover the power of engineering through hands-on learning.",
    location: "Myanmar",
    education: "IT Engineering student at West Yangon Technological University (WYTU)",
    contact: {
      email: "zinmyoenaing@example.com", // placeholder
      linkedin: "https://linkedin.com/in/placeholder",
      github: "https://github.com/placeholder",
      cv: "/resume.pdf"
    }
  },
  projects: [
    {
      id: "mm-he01",
      title: "MM-HE01 — Smart Solar Tracking System",
      category: "Robotics and Electronics",
      problem: "Static solar panels do not maximize energy capture throughout the day.",
      solution: "A prototype solar tracking system that dynamically positions panels based on sunlight direction.",
      technologies: ["ESP32-S3", "Light sensors", "Servo motors", "C++", "Hardware Design"],
      role: "Hardware & Software Engineer",
      status: "Prototype Completed",
      links: {
        caseStudy: "/projects/mm-he01"
      },
      caseStudyDetails: {
        overview: "An ESP32-S3-based solar tracking prototype designed to optimize solar energy capture.",
        problemMotivation: "Solar energy efficiency drops significantly when panels are not directly facing the sun. A low-cost tracking mechanism could improve energy yield for small-scale installations.",
        requirements: "The system needed to accurately detect the strongest light source, smoothly actuate the solar panel mount, and operate reliably on a microcontroller.",
        architecture: "Sensors detect light intensity variations and feed data to an ESP32-S3, which calculates the optimal angle and drives servo motors.",
        components: "ESP32-S3 microcontroller, photoresistors (LDRs), servo motors, 3D-printed mounts, power measurement concepts.",
        implementation: "Developed the sensor reading logic and servo control algorithm in C++. Designed and assembled the mechanical tracking mount.",
        decisions: "Chose the ESP32-S3 for its processing power and potential for future IoT integrations over a basic Arduino.",
        challenges: "Calibrating the light sensors for varying outdoor conditions and ensuring smooth, non-jittery servo movement.",
        results: "Successfully built a functional prototype that actively tracks a light source in real-time.",
        limitations: "Testing and validation of actual energy efficiency improvements in a real-world deployed environment are still in progress."
      }
    },
    {
      id: "ai-trash-cam",
      title: "AI Trash Monitoring and Tracking Camera",
      category: "Artificial Intelligence",
      problem: "Inefficient waste management and lack of tracking for waste-related behavior.",
      solution: "An AI-based camera concept for identifying and monitoring waste disposal activities.",
      technologies: ["Computer Vision", "Python", "Machine Learning"],
      role: "AI Developer",
      status: "Concept / Prototype",
      links: {
        caseStudy: "/projects/ai-trash-cam"
      },
      caseStudyDetails: {
        overview: "An AI camera system designed to monitor waste disposal and track related behaviors.",
        problemMotivation: "Public waste management relies on manual monitoring. Automating this could lead to better compliance and cleaner environments.",
        requirements: "Real-time object detection capable of identifying waste and potentially tracking disposal actions.",
        architecture: "A camera feed processed by a computer vision model running on an edge device or local server.",
        components: "Camera module, computing unit, computer vision framework.",
        implementation: "Prototyped the computer vision workflow for object identification.",
        decisions: "Focused on identifying specific types of interactions rather than just object classification.",
        challenges: "Handling different lighting conditions and accurately distinguishing between various types of interactions.",
        results: "Demonstrated the feasibility of the concept through a working computer vision prototype.",
        limitations: "Currently a proposed feature/demonstration; not yet deployed in a real-world, large-scale environment."
      }
    },
    {
      id: "3d-environment",
      title: "3D Environmental Project",
      category: "3D Design and Environmental Technology",
      problem: "Abstract environmental issues like air pollution are difficult to visualize and communicate effectively.",
      solution: "A 3D modeling project designed to raise awareness about air pollution through visual storytelling.",
      technologies: ["3D Modeling", "Visualization Software", "Educational Design"],
      role: "3D Designer & Educator",
      status: "Completed",
      links: {
        caseStudy: "/projects/3d-environment"
      }
    },
    {
      id: "aidan-ai",
      title: "Aidan — AI Assistant for CEIT WYTU",
      category: "Artificial Intelligence",
      problem: "Students need quick, accurate answers to university-specific questions based on documentation.",
      solution: "An AI assistant utilizing retrieval-augmented generation (RAG) to provide sourced answers from university documents.",
      technologies: ["RAG", "Python", "LLMs", "Semantic Retrieval", "PDF Processing"],
      role: "AI Developer",
      status: "Development",
      links: {
        caseStudy: "/projects/aidan-ai"
      },
      caseStudyDetails: {
        overview: "A RAG-based AI assistant tailored for the CEIT department at WYTU.",
        problemMotivation: "Information is scattered across various PDFs and documents, making it hard for students to find specific answers.",
        requirements: "The system must accurately ingest PDFs, retrieve relevant sections, and generate answers with source citations.",
        architecture: "A pipeline involving document parsing, embedding generation, a vector database, and an LLM for response generation.",
        components: "PDF processing libraries, embedding models, vector search, LLM API.",
        implementation: "Implemented the core RAG pipeline, focusing on accurate semantic retrieval and multilingual support capabilities.",
        decisions: "Chose a RAG architecture to ensure responses are grounded in official documentation and to reduce hallucinations.",
        challenges: "Optimizing the chunking strategy for complex university documents and ensuring high-quality retrieval.",
        results: "Successfully built the foundational RAG pipeline capable of ingesting and querying document data.",
        limitations: "Full integration with a production database (like Supabase/pgvector) and widespread deployment are planned future features."
      }
    },
    {
      id: "face-swap",
      title: "Real-Time Face Swap & Computer Vision",
      category: "Computer Vision",
      problem: "Exploring real-time facial manipulation and landmark tracking.",
      solution: "A computer vision application that tracks facial landmarks and performs real-time geometric image processing.",
      technologies: ["Python", "OpenCV", "MediaPipe FaceMesh", "Geometric Processing"],
      role: "Computer Vision Developer",
      status: "Experimental",
      links: {
        caseStudy: "/projects/face-swap"
      }
    },
    {
      id: "web-apps",
      title: "Web Application Engineering",
      category: "Software Engineering",
      problem: "Building scalable and interactive user interfaces.",
      solution: "Selected work involving modern frontend architectures, data flow, and database integration.",
      technologies: ["React", "TypeScript", "Node.js", "Vite", "Tailwind CSS"],
      role: "Frontend Engineer",
      status: "Ongoing",
      links: {
        caseStudy: "/projects/web-apps"
      }
    }
  ],
  skills: [
    {
      title: "SOFTWARE ENGINEERING",
      skills: [
        { name: "Python", description: "Used for AI scripting, computer vision pipelines, and backend logic.", projects: ["ai-trash-cam", "aidan-ai", "face-swap"] },
        { name: "JavaScript & TypeScript", description: "Building robust, type-safe web applications.", projects: ["web-apps"] },
        { name: "React", description: "Developing interactive user interfaces.", projects: ["web-apps"] },
        { name: "Node.js", description: "Server-side scripting and API development.", projects: ["web-apps"] },
        { name: "HTML & CSS", description: "Semantic markup and responsive styling." },
        { name: "Git & GitHub", description: "Version control and collaborative development." },
        { name: "SQL, PostgreSQL & Supabase", description: "Database management and data modeling.", projects: ["aidan-ai"] }
      ]
    },
    {
      title: "AI AND COMPUTER VISION",
      skills: [
        { name: "Machine Learning Fundamentals", description: "Understanding of core ML concepts and model evaluation." },
        { name: "OpenCV", description: "Image processing and real-time computer vision.", projects: ["face-swap"] },
        { name: "MediaPipe", description: "Implementing complex vision pipelines like FaceMesh.", projects: ["face-swap"] },
        { name: "FaceMesh & Geometric Processing", description: "Tracking facial landmarks and performing spatial transformations.", projects: ["face-swap"] },
        { name: "RAG Concepts", description: "Retrieval-Augmented Generation for grounding LLM responses.", projects: ["aidan-ai"] },
        { name: "AI Application Integration", description: "Connecting ML models to practical software systems." }
      ]
    },
    {
      title: "ROBOTICS AND ELECTRONICS",
      skills: [
        { name: "ESP32", description: "Programming microcontrollers for IoT and hardware control.", projects: ["mm-he01"] },
        { name: "Sensors & Actuators", description: "Interfacing with physical environments (e.g., light sensors, motors).", projects: ["mm-he01"] },
        { name: "Servo Control", description: "Precise mechanical actuation.", projects: ["mm-he01"] },
        { name: "Arduino-Compatible Development", description: "Prototyping embedded systems." },
        { name: "Embedded-System Prototyping", description: "Designing and building functional hardware prototypes." },
        { name: "Robotics System Integration", description: "Combining software and hardware for robotic applications." }
      ]
    },
    {
      title: "CREATIVE ENGINEERING",
      skills: [
        { name: "3D Modeling", description: "Creating visual assets and environmental models.", projects: ["3d-environment"] },
        { name: "3D Visualization", description: "Communicating technical and environmental concepts visually." },
        { name: "Technical Prototyping", description: "Rapidly iterating on hardware and software ideas." },
        { name: "Educational Technology", description: "Building tools and materials to teach engineering concepts." }
      ]
    }
  ],
  experience: [
    {
      id: "wro-2025",
      title: "National Head Judge, WRO RoboMission",
      organization: "World Robot Olympiad",
      date: "2025",
      description: "Leading the judging panel for the national WRO RoboMission competition, ensuring fair evaluation of complex robotics tasks.",
      type: "leadership"
    },
    {
      id: "ciy-coach",
      title: "Coding & 3D Modeling Coach",
      organization: "CIY Club Myanmar",
      date: "Present",
      description: "Teaching hands-on technology skills to students, helping them move from following instructions to understanding systems.",
      type: "leadership"
    },
    {
      id: "wro-judge",
      title: "Robotics Competition Judge",
      organization: "WRO RoboMission & Future Innovator",
      date: "Previous",
      description: "Evaluated student robotics projects, focusing on engineering design, innovation, and problem-solving.",
      type: "leadership"
    },
    {
      id: "mindhack-2026",
      title: "Coach - Mindhack 2026",
      organization: "Mindhack",
      date: "2026",
      description: "Coached the team associated with the AI tracking camera project. (Note: Award details pending official verification).",
      type: "leadership"
    },
    {
      id: "wytu",
      title: "IT Engineering Student",
      organization: "West Yangon Technological University (WYTU)",
      date: "Ongoing",
      description: "Pursuing a degree in IT Engineering, building a foundation in software, hardware, and systems engineering.",
      type: "education"
    }
  ],
  teachingPhilosophy: "I believe engineering is learned by building, experimenting, debugging, and explaining. My goal is to help learners move from following instructions to understanding systems and creating their own solutions."
};
