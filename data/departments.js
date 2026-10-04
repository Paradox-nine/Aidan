/* ============================================================
   WEST YANGON TECHNOLOGICAL UNIVERSITY (WYTU)
   DEPARTMENTS DATA (data/departments.js)
   ============================================================ */

const DEPARTMENTS_DATA = [
  {
    slug: "civil",
    name: "Civil Engineering",
    myanmarName: "မြို့ပြအင်ဂျင်နီယာ",
    category: "Core Engineering Major",
    image: "../images/departments/civil.svg",
    description: "Focuses on structural engineering, infrastructure development, geotechnical engineering, water resource management, and sustainable construction practices.",
    overview: "The Department of Civil Engineering at West Yangon Technological University aims to train competent civil engineers who can contribute to infrastructure design, structural safety, environmental protection, and urban development across Myanmar.",
    programs: [
      { name: "Bachelor of Engineering (B.E. Civil)", duration: "6 Years", degree: "B.E. (Civil)" }
    ],
    courses: [
      "Structural Analysis & Design",
      "Reinforced Concrete Structures",
      "Geotechnical Engineering & Soil Mechanics",
      "Surveying & Transportation Engineering",
      "Water Resources & Fluid Mechanics",
      "Environmental & Construction Management"
    ],
    labs: [
      { name: "Structural Testing Laboratory", desc: "Equipped for concrete compression and steel tensile testing." },
      { name: "Geotechnical & Soil Mechanics Lab", desc: "Facilities for soil analysis, triaxial, and shear strength tests." },
      { name: "Surveying Instrument Center", desc: "Total stations, GPS receivers, and modern leveling equipment." }
    ],
    faculty: "Information will be updated soon.",
    research: "Research areas focus on sustainable concrete materials, earthquake-resistant design, and river hydraulics in local Myanmar conditions.",
    activities: "Annual Civil Engineering Student Surveying Camp, Structural Model Competition, and Industry Site Visits.",
    contact: "Building B, WYTU Campus | Email: civil@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "architecture",
    name: "Architecture",
    myanmarName: "ဗိသုကာပညာ",
    category: "Core Engineering Major",
    image: "../images/departments/architecture.svg",
    description: "Combines creative design, architectural technology, building heritage, urban planning, and environmental design.",
    overview: "The Department of Architecture nurtures creative visionaries and technical experts capable of designing functional, sustainable, and aesthetically inspiring built environments.",
    programs: [
      { name: "Bachelor of Architecture (B.Arch.)", duration: "6 Years", degree: "B.Arch." }
    ],
    courses: [
      "Architectural Design Studio",
      "Building Construction & Technology",
      "History & Theory of Architecture",
      "Urban Planning & Landscape Design",
      "Building Environmental Systems",
      "Computer-Aided Architectural Design (CAAD)"
    ],
    labs: [
      { name: "Architectural Model Workshop", desc: "Tools and 3D printing equipment for architectural scale models." },
      { name: "Design & CAD Studio", desc: "High-performance graphics workstations for architectural modeling." }
    ],
    faculty: "Information will be updated soon.",
    research: "Research focuses on vernacular Myanmar architecture preservation, climate-responsive design, and sustainable urban housing.",
    activities: "Annual Student Architectural Design Exhibition, Sketch Workshops, and Cultural Heritage Documentation Trips.",
    contact: "Architecture Wing, WYTU Campus | Email: architecture@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "ceit",
    name: "Computer Engineering & Information Technology",
    myanmarName: "ကွန်ပျူတာနှင့် သတင်းအချက်အလက်နည်းပညာ",
    category: "Core Engineering Major",
    image: "../images/departments/ceit.svg",
    description: "Covers software engineering, computer networks, artificial intelligence, cybersecurity, database systems, and embedded systems.",
    overview: "The Department of Computer Engineering & Information Technology (CEIT) prepares skilled software engineers, network specialists, and system designers for the modern digital economy.",
    programs: [
      { name: "Bachelor of Engineering (B.E. CEIT)", duration: "6 Years", degree: "B.E. (CEIT)" }
    ],
    courses: [
      "Object-Oriented Software Development",
      "Computer Networks & Cyber Security",
      "Data Structures & Algorithms",
      "Database Management & Cloud Computing",
      "Embedded Systems & Microcontrollers",
      "Artificial Intelligence & Machine Learning"
    ],
    labs: [
      { name: "Software Development Laboratory", desc: "Modern workstations configured for high-level software engineering." },
      { name: "Networking & Security Lab", desc: "Cisco routers, switches, and network security hardware." },
      { name: "Hardware & Embedded Systems Lab", desc: "Arduino, Raspberry Pi, and microcontroller development boards." }
    ],
    faculty: "Information will be updated soon.",
    research: "Focus areas include Myanmar natural language processing, intelligent IoT agricultural sensors, and cloud infrastructure security.",
    activities: "Annual WYTU Hackathon, Programming Competitions, and Open Source Software Workshops.",
    contact: "IT Building, Floor 2, WYTU Campus | Email: ceit@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "electrical-power",
    name: "Electrical Power Engineering",
    myanmarName: "လျှပ်စစ်စွမ်းအား",
    category: "Core Engineering Major",
    image: "../images/departments/electrical-power.svg",
    description: "Specializes in electrical power generation, transmission, distribution, high voltage technology, and renewable energy integration.",
    overview: "The Electrical Power Engineering department equips students with expertise in power systems analysis, industrial electrical machines, smart grids, and clean power generation.",
    programs: [
      { name: "Bachelor of Engineering (B.E. EP)", duration: "6 Years", degree: "B.E. (EP)" }
    ],
    courses: [
      "Power System Analysis & Operation",
      "Electrical Machines & Transformers",
      "High Voltage Engineering",
      "Renewable Energy Systems (Solar & Hydro)",
      "Power Electronics & Electric Drives",
      "Power Distribution & Smart Grids"
    ],
    labs: [
      { name: "Electrical Power Machine Laboratory", desc: "AC/DC motors, generators, transformers, and load panels." },
      { name: "Power System Simulation Lab", desc: "Software toolsets for electrical load flow and fault analysis." }
    ],
    faculty: "Information will be updated soon.",
    research: "Research covers microgrid integration for rural electrification, solar power efficiency, and power grid stability.",
    activities: "High Voltage Demonstration Seminars, Substation Industrial Tours, and Energy Efficiency Projects.",
    contact: "Electrical Engineering Building, WYTU Campus | Email: ep@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "electrical-communication",
    name: "Electrical & Communication Engineering",
    myanmarName: "အီလက်ထရွန်းနစ်နှင့် ဆက်သွယ်ရေး",
    category: "Core Engineering Major",
    image: "../images/departments/electrical-communication.svg",
    description: "Focuses on electronic circuit design, telecommunications, wireless networks, signal processing, and fiber optics.",
    overview: "The Department of Electrical & Communication Engineering provides students with cutting-edge education in electronic technology, mobile communication systems, and optical networks.",
    programs: [
      { name: "Bachelor of Engineering (B.E. EC)", duration: "6 Years", degree: "B.E. (EC)" }
    ],
    courses: [
      "Analog & Digital Electronic Circuits",
      "Wireless & Mobile Communications",
      "Digital Signal Processing (DSP)",
      "Microwave & Antenna Engineering",
      "Optical Fiber Communications",
      "VLSI & Microelectronic Systems"
    ],
    labs: [
      { name: "Electronics Circuit Design Lab", desc: "Oscilloscopes, function generators, and PCB prototyping station." },
      { name: "Telecommunication Laboratory", desc: "RF signal generators, spectrum analyzers, and antenna test setups." }
    ],
    faculty: "Information will be updated soon.",
    research: "Research topics include 5G signal processing, optical network reliability, and RF sensor nodes.",
    activities: "Electronic Design Competition, Antenna Design Workshops, and Telecom Industry Field Trips.",
    contact: "Communication Building, WYTU Campus | Email: ec@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "mechatronics",
    name: "Mechatronics Engineering",
    myanmarName: "မက္ကထရောနစ်",
    category: "Core Engineering Major",
    image: "../images/departments/mechatronics.svg",
    description: "Integrates mechanical engineering, electronics, computer control, robotics, and industrial automation.",
    overview: "The Mechatronics Department develops multidisciplinary engineers who design intelligent automated machines, robotic systems, and smart industrial controls.",
    programs: [
      { name: "Bachelor of Engineering (B.E. Mechatronics)", duration: "6 Years", degree: "B.E. (McE)" }
    ],
    courses: [
      "Robotics & Control Systems",
      "Industrial Automation & PLCs",
      "Sensors, Actuators & Instrumentation",
      "Kinematics & Dynamics of Machinery",
      "Microcontroller Systems",
      "Hydraulics & Pneumatics"
    ],
    labs: [
      { name: "Robotics & Automation Laboratory", desc: "Industrial robotic arms, PLC test rigs, and automated conveyor systems." },
      { name: "Pneumatics & Electro-Pneumatics Lab", desc: "Festor training panels for industrial fluid power controls." }
    ],
    faculty: "Information will be updated soon.",
    research: "Research focuses on agricultural automation robots, industrial PLC optimization, and unmanned aerial vehicles.",
    activities: "WYTU Annual Robotics Contest, Automated System Design Projects, and Maker Fairs.",
    contact: "Mechatronics Building, WYTU Campus | Email: mechatronics@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "chemical",
    name: "Chemical Engineering",
    myanmarName: "ဓာတုအင်ဂျင်နီယာ",
    category: "Core Engineering Major",
    image: "../images/departments/chemical.svg",
    description: "Covers process design, reaction kinetics, chemical thermodynamics, separation processes, and bio-process engineering.",
    overview: "Chemical Engineering at WYTU applies principles of chemistry, physics, and mathematics to transform raw materials into valuable products safely and sustainably.",
    programs: [
      { name: "Bachelor of Engineering (B.E. Chemical)", duration: "6 Years", degree: "B.E. (Chemical)" }
    ],
    courses: [
      "Chemical Engineering Thermodynamics",
      "Fluid Flow & Heat Transfer",
      "Mass Transfer & Separation Operations",
      "Chemical Reaction Engineering",
      "Process Control & Safety",
      "Bioprocess Engineering & Biofuels"
    ],
    labs: [
      { name: "Unit Operations Laboratory", desc: "Distillation columns, heat exchangers, and fluid flow test benches." },
      { name: "Process Analysis & Chemical Instrumentation Lab", desc: "Spectrophotometers, gas chromatography, and pH analyzers." }
    ],
    faculty: "Information will be updated soon.",
    research: "Focus areas include bio-ethanol production from local agricultural waste and industrial wastewater treatment.",
    activities: "Chemical Safety Seminars, Plant Design Competitions, and Chemical Factory Visits.",
    contact: "Chemical Engineering Hall, WYTU Campus | Email: chemical@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "metallurgical",
    name: "Metallurgical Engineering & Material Science",
    myanmarName: "သတ္တုဗေဒနှင့် ဒြပ်ပစ္စည်းသိပ္ပံ",
    category: "Core Engineering Major",
    image: "../images/departments/metallurgical.svg",
    description: "Focuses on extraction, processing, heat treatment, alloy development, material characterization, and failure analysis.",
    overview: "The Department of Metallurgical Engineering & Material Science trains experts in processing metals, alloys, ceramics, and advanced materials for industrial applications.",
    programs: [
      { name: "Bachelor of Engineering (B.E. Metallurgical)", duration: "6 Years", degree: "B.E. (Met)" }
    ],
    courses: [
      "Extractive Metallurgy",
      "Physical Metallurgy & Phase Diagrams",
      "Mechanical Behavior of Materials",
      "Corrosion & Surface Engineering",
      "Foundry & Casting Technology",
      "Advanced Composite Materials"
    ],
    labs: [
      { name: "Metallography Laboratory", desc: "Optical microscopes, polishing machines, and specimen preparation stations." },
      { name: "Heat Treatment & Foundry Lab", desc: "Muffle furnaces, hardness testers, and sand casting equipment." }
    ],
    faculty: "Information will be updated soon.",
    research: "Research topics include local mineral processing optimization, anti-corrosion coatings, and alloy heat treatment.",
    activities: "Casting Workshops, Metallography Microscopy Contests, and Smelting Plant Visits.",
    contact: "Materials Science Wing, WYTU Campus | Email: metallurgical@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "textile",
    name: "Textile Engineering",
    myanmarName: "အထည်အလိပ်အင်ဂျင်နီယာ",
    category: "Core Engineering Major",
    image: "../images/departments/textile.svg",
    description: "Covers fiber science, yarn manufacturing, fabric formation (weaving/knitting), textile dyeing/finishing, and garment manufacturing.",
    overview: "Textile Engineering provides technical training for Myanmar's expanding garment and textile industry, focusing on sustainable fiber technology and modern manufacturing.",
    programs: [
      { name: "Bachelor of Engineering (B.E. Textile)", duration: "6 Years", degree: "B.E. (Textile)" }
    ],
    courses: [
      "Natural & Synthetic Fiber Science",
      "Yarn Spinning & Technology",
      "Weaving & Knitting Mechanisms",
      "Textile Chemistry, Dyeing & Printing",
      "Garment Manufacturing Technology",
      "Quality Control in Textile Testing"
    ],
    labs: [
      { name: "Yarn & Fabric Testing Laboratory", desc: "Tensile strength testers, yarn twist meters, and fabric inspection frames." },
      { name: "Textile Wet Processing Lab", desc: "Dyeing baths, padding mangles, and color measurement spectrophotometers." }
    ],
    faculty: "Information will be updated soon.",
    research: "Research emphasizes natural eco-friendly dyes, organic cotton processing, and technical textile composites.",
    activities: "Fashion & Textile Technology Showcase, Garment Factory Visits, and Eco-Dyeing Workshops.",
    contact: "Textile Building, WYTU Campus | Email: textile@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "agricultural",
    name: "Agricultural Engineering",
    myanmarName: "စိုက်ပျိုးရေးအင်ဂျင်နီယာ",
    category: "Core Engineering Major",
    image: "../images/departments/agricultural.svg",
    description: "Integrates machinery design, irrigation engineering, post-harvest processing, and smart agricultural technologies.",
    overview: "Agricultural Engineering applies engineering principles to enhance agricultural production, modernize farming equipment, and safeguard soil and water resources.",
    programs: [
      { name: "Bachelor of Engineering (B.E. Agricultural)", duration: "6 Years", degree: "B.E. (Agri)" }
    ],
    courses: [
      "Agricultural Machinery & Power Systems",
      "Irrigation & Drainage Engineering",
      "Post-Harvest Processing & Grain Storage",
      "Soil & Water Conservation Engineering",
      "Precision Agriculture & Smart Sensors",
      "Renewable Energy for Agriculture"
    ],
    labs: [
      { name: "Farm Machinery & Tractor Lab", desc: "Tractor testing beds, tillage tools, and engine diagnostic tools." },
      { name: "Irrigation & Hydraulics Field Lab", desc: "Drip/sprinkler irrigation systems and pump testing units." }
    ],
    faculty: "Information will be updated soon.",
    research: "Research focuses on low-cost solar grain dryers, precision drip irrigation, and mechanization for smallholder paddy farmers.",
    activities: "Smart Agriculture Exhibition, Farm Machinery Demonstrations, and Rural Irrigation Field Studies.",
    contact: "Agricultural Engineering Building, WYTU Campus | Email: agricultural@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "mathematics",
    name: "Engineering Mathematics",
    myanmarName: "အင်ဂျင်နီယာသင်္ချာ",
    category: "Supportive Academic Department",
    image: "../images/departments/mathematics.svg",
    description: "Provides foundational and advanced mathematical techniques, calculus, linear algebra, differential equations, and numerical analysis for all engineering disciplines.",
    overview: "The Department of Engineering Mathematics provides foundational analytical tools, mathematical modeling methods, and numerical computation skills essential for all engineering students at WYTU.",
    programs: [
      { name: "Supportive Academic Curriculum", duration: "Years 1–4", degree: "Foundational Engineering" }
    ],
    courses: [
      "Calculus & Analytical Geometry",
      "Linear Algebra & Vector Analysis",
      "Ordinary & Partial Differential Equations",
      "Complex Variables & Transforms",
      "Numerical Methods & Optimization",
      "Probability & Statistics for Engineers"
    ],
    labs: [
      { name: "Mathematical Computation Lab", desc: "MATLAB, Python, and Mathematica workstations for numerical modeling." }
    ],
    faculty: "Information will be updated soon.",
    research: "Focuses on mathematical modeling of engineering systems, fluid dynamic equations, and statistical optimization.",
    activities: "Annual WYTU Mathematics Olympiad and Applied Math Seminars.",
    contact: "Academic Building 1, WYTU Campus | Email: math@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "english",
    name: "English",
    myanmarName: "အင်္ဂလိပ်စာ",
    category: "Supportive Academic Department",
    image: "../images/departments/english.svg",
    description: "Fosters academic English proficiency, technical writing, professional communication skills, engineering ethics, and social leadership.",
    overview: "The Department of English nurtures effective technical communicators, global thinkers, and ethically grounded engineering leaders capable of collaborating globally.",
    programs: [
      { name: "Supportive Academic Curriculum", duration: "Years 1–6", degree: "Humanities & Language" }
    ],
    courses: [
      "Technical English & Academic Writing",
      "Professional Public Speaking & Presentation",
      "Engineering Ethics & Society",
      "Project Management & Communication",
      "Critical Thinking & Problem Solving"
    ],
    labs: [
      { name: "Language Center & Audio Lab", desc: "Multimedia workstations for interactive listening, pronunciation, and speech practice." }
    ],
    faculty: "Information will be updated soon.",
    research: "Research explores English for Specific Purposes (ESP) in technical education and ethics in emerging technology.",
    activities: "Debate Contests, English Speech Competitions, and Technical Writing Workshops.",
    contact: "Humanities Center, WYTU Campus | Email: english@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "physics",
    name: "Engineering Physics",
    myanmarName: "အင်ဂျင်နီယာရူပဗေဒ",
    category: "Supportive Academic Department",
    image: "../images/departments/physics.svg",
    description: "Delivers essential knowledge in mechanics, electromagnetism, wave optics, thermodynamics, and quantum physics applied to engineering.",
    overview: "Engineering Physics builds the fundamental scientific foundation required for understanding electrical, mechanical, civil, and electronic principles across all engineering majors.",
    programs: [
      { name: "Supportive Academic Curriculum", duration: "Years 1–2", degree: "Foundational Physics" }
    ],
    courses: [
      "Engineering Mechanics & Statics",
      "Electricity & Magnetism",
      "Waves, Optics & Acoustics",
      "Thermodynamics & Kinetic Theory",
      "Modern Physics & Quantum Concepts",
      "Solid State Physics"
    ],
    labs: [
      { name: "General Physics Laboratory", desc: "Mechanics, optics, and electromagnetism experimental setups." }
    ],
    faculty: "Information will be updated soon.",
    research: "Focuses on semiconductor physics, solar energy materials, and acoustic wave propagation.",
    activities: "Physics Demonstrations, Science Fair Exhibitions, and Physics Quiz Contests.",
    contact: "Science Building A, WYTU Campus | Email: physics@wytu.edu.mm (Official contact details will be updated soon)."
  },
  {
    slug: "chemistry",
    name: "Engineering Chemistry",
    myanmarName: "အင်ဂျင်နီယာဓာတုဗေဒ",
    category: "Supportive Academic Department",
    image: "../images/departments/chemistry.svg",
    description: "Covers organic and inorganic chemistry, electrochemistry, corrosion, polymer science, and environmental water testing.",
    overview: "Engineering Chemistry provides crucial understanding of chemical structures, industrial materials, environmental chemistry, and corrosion mechanisms for future engineers.",
    programs: [
      { name: "Bachelor of Engineering Degree Support", duration: "Years 1–2", degree: "Foundational Chemistry" }
    ],
    courses: [
      "General & Inorganic Chemistry",
      "Physical & Organic Chemistry",
      "Electrochemistry & Corrosion",
      "Water Technology & Quality Testing",
      "Polymer & Material Chemistry"
    ],
    labs: [
      { name: "Engineering Chemistry Laboratory", desc: "Titration stations, spectrophotometers, water analysis, and chemical safety equipment." }
    ],
    faculty: "Information will be updated soon.",
    research: "Research focuses on water purification methods and bio-compatible materials.",
    activities: "Chemical Experiment Showcase and Environmental Water Quality Monitoring Workshops.",
    contact: "Science Building B, WYTU Campus | Email: chemistry@wytu.edu.mm (Official contact details will be updated soon)."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DEPARTMENTS_DATA;
}
