/**
 * SkillBridge - Default Seed Data
 * Stores mock students, projects, applications, and workspace tasks.
 */

const SEED_DATA = {
  currentUser: {
    id: "usr_1",
    name: "Aarav Sharma",
    role: "Fullstack & AI Enthusiast",
    university: "Apex Institute of Technology",
    degree: "B.Tech Computer Science (3rd Year)",
    bio: "Passionate about building scalable web apps and AI-driven campus utilities. Looking for UI/UX designers and ML researchers to collaborate on impactful tech.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
    skills: [
      { name: "React / Node.js", category: "Development", level: 90 },
      { name: "Python / PyTorch", category: "AI/ML", level: 82 },
      { name: "Tailwind / CSS", category: "Frontend", level: 85 },
      { name: "PostgreSQL", category: "Database", level: 78 }
    ],
    lookingFor: ["UI/UX Designer", "Product Manager", "Embedded Systems Dev"],
    github: "github.com/aarav-dev",
    linkedin: "linkedin.com/in/aarav-sharma",
    stats: {
      projectsLed: 2,
      projectsJoined: 3,
      tasksCompleted: 24,
      reputationScore: 98
    }
  },

  students: [
    {
      id: "usr_1",
      name: "Aarav Sharma",
      role: "Fullstack Developer",
      university: "Apex Institute of Technology",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      skills: ["React", "Node.js", "Python", "PostgreSQL"],
      badge: "Team Lead",
      rating: 4.9
    },
    {
      id: "usr_2",
      name: "Ananya Iyer",
      role: "UI/UX & Product Designer",
      university: "National School of Design & Tech",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
      skills: ["Figma", "Design Systems", "User Research", "Wireframing"],
      badge: "Top Designer",
      rating: 5.0
    },
    {
      id: "usr_3",
      name: "Rohan Varma",
      role: "ML & Computer Vision Engineer",
      university: "Birla Institute of Science",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
      skills: ["PyTorch", "OpenCV", "FastAPI", "Docker"],
      badge: "AI Specialist",
      rating: 4.8
    },
    {
      id: "usr_4",
      name: "Meera Patel",
      role: "Mobile App Developer",
      university: "Metropolitan Engineering College",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
      skills: ["Flutter", "Kotlin", "Firebase", "REST APIs"],
      badge: "App Wizard",
      rating: 4.7
    },
    {
      id: "usr_5",
      name: "Vikram Sen",
      role: "Hardware & IoT Developer",
      university: "Technical University",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
      skills: ["Arduino", "ESP32", "MQTT", "C++", "Sensors"],
      badge: "Hardware Pro",
      rating: 4.9
    }
  ],

  projects: [
    {
      id: "proj_1",
      title: "EcoTrack AI - Campus Energy & Waste Analytics",
      tagline: "Smart IoT and AI platform optimizing hostel electricity and campus waste sorting.",
      category: "AI & Sustainability",
      leaderId: "usr_1",
      leaderName: "Aarav Sharma",
      leaderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      status: "In Progress",
      stage: "Prototype Development",
      deadline: "2026-12-15",
      progress: 65,
      openRoles: [
        { role: "UI/UX Designer", skillNeeded: "Figma & Design Systems", filled: false, applicantsCount: 2 },
        { role: "IoT Firmware Dev", skillNeeded: "ESP32 / MQTT", filled: true, applicantsCount: 4 }
      ],
      tags: ["AI/ML", "IoT", "GreenTech", "Dashboard"],
      description: "EcoTrack is addressing rampant energy wastage across university hostels and labs using smart current sensors and computer vision cameras over waste drop zones to provide real-time carbon footprint metrics.",
      teamMembers: [
        { id: "usr_1", name: "Aarav Sharma", role: "Team Lead & Backend", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80" },
        { id: "usr_5", name: "Vikram Sen", role: "IoT Hardware", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80" }
      ]
    },
    {
      id: "proj_2",
      title: "MediQuick - Peer First-Aid Emergency Responder",
      tagline: "Hyper-local campus emergency alert & nearest certified student responder dispatch app.",
      category: "Healthcare & Mobile",
      leaderId: "usr_4",
      leaderName: "Meera Patel",
      leaderAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
      status: "Recruiting",
      stage: "Ideation & Design",
      deadline: "2026-11-30",
      progress: 25,
      openRoles: [
        { role: "Fullstack Web Dev", skillNeeded: "React / Node.js", filled: false, applicantsCount: 3 },
        { role: "UI/UX Specialist", skillNeeded: "Figma / Mobile UX", filled: false, applicantsCount: 1 }
      ],
      tags: ["Mobile", "Flutter", "Emergency", "Geolocation"],
      description: "When emergencies happen inside huge university campuses, ambulances often take 20+ minutes. MediQuick broadcasts instant alerts to first-aid certified student volunteers within 200 meters.",
      teamMembers: [
        { id: "usr_4", name: "Meera Patel", role: "Team Lead & Mobile Dev", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80" }
      ]
    },
    {
      id: "proj_3",
      title: "NeuralNotes - Collaborative Multi-Modal Study Room",
      tagline: "AI study companion summarizing lecture voice notes into flashcards, quizzes & mindmaps.",
      category: "EdTech & AI",
      leaderId: "usr_3",
      leaderName: "Rohan Varma",
      leaderAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
      status: "Recruiting",
      stage: "Architecture Design",
      deadline: "2027-01-20",
      progress: 40,
      openRoles: [
        { role: "Frontend Developer", skillNeeded: "React / Tailwind / Canvas", filled: false, applicantsCount: 2 },
        { role: "Product Designer", skillNeeded: "Figma / User Journey", filled: false, applicantsCount: 2 }
      ],
      tags: ["AI/ML", "NLP", "Audio", "EdTech"],
      description: "Converts disorganized university lectures, messy whiteboard pictures, and professor audio into structured markdown summaries and interactive spaced-repetition flashcards.",
      teamMembers: [
        { id: "usr_3", name: "Rohan Varma", role: "Team Lead & ML Architect", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80" },
        { id: "usr_2", name: "Ananya Iyer", role: "Design Consultant", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80" }
      ]
    },
    {
      id: "proj_4",
      title: "BlockCred - Tamper-Proof College Credential Vault",
      tagline: "Decentralized verification platform for student project certificates & club credentials.",
      category: "Web3 & Security",
      leaderId: "usr_2",
      leaderName: "Ananya Iyer",
      leaderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
      status: "Recruiting",
      stage: "Wireframing",
      deadline: "2026-12-01",
      progress: 15,
      openRoles: [
        { role: "Smart Contract Developer", skillNeeded: "Solidity / Ethereum", filled: false, applicantsCount: 1 },
        { role: "Backend Architect", skillNeeded: "Node.js / IPFS", filled: false, applicantsCount: 2 }
      ],
      tags: ["Web3", "Blockchain", "Verification", "Solidity"],
      description: "Eliminating fake resumes and forged competition certificates by granting cryptographic verifiable credentials minted directly by university authorities and hackathon organizers.",
      teamMembers: [
        { id: "usr_2", name: "Ananya Iyer", role: "Product Lead", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80" }
      ]
    }
  ],

  applications: [
    {
      id: "app_1",
      projectId: "proj_1",
      projectTitle: "EcoTrack AI - Campus Energy & Waste Analytics",
      applicantId: "usr_2",
      applicantName: "Ananya Iyer",
      applicantAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
      appliedRole: "UI/UX Designer",
      message: "Hey Aarav! I've designed interactive IoT dashboards before in Figma and would love to build a clean dark-mode interface for EcoTrack.",
      portfolioUrl: "https://behance.net/ananya-designs",
      status: "pending", // pending, accepted, rejected
      appliedDate: "2026-10-24"
    },
    {
      id: "app_2",
      projectId: "proj_1",
      projectTitle: "EcoTrack AI - Campus Energy & Waste Analytics",
      applicantId: "usr_3",
      applicantName: "Rohan Varma",
      applicantAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
      appliedRole: "ML Waste Classifier",
      message: "I have experience training lightweight YOLO models for waste segregation. Happy to help build the computer vision module.",
      portfolioUrl: "https://github.com/rohan-cv",
      status: "pending",
      appliedDate: "2026-10-25"
    }
  ],

  tasks: [
    {
      id: "tsk_1",
      projectId: "proj_1",
      title: "Design System & Figma Tokens",
      description: "Establish color palette, typography hierarchy, and chart components for sensor data visualization.",
      status: "done", // todo, inprogress, review, done
      priority: "high",
      assigneeName: "Ananya Iyer",
      assigneeAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
      dueDate: "2026-10-22"
    },
    {
      id: "tsk_2",
      projectId: "proj_1",
      title: "MQTT Broker Integration",
      description: "Set up Mosquitto broker on AWS EC2 to ingest telemetry packets from ESP32 hostel submeters.",
      status: "done",
      priority: "urgent",
      assigneeName: "Vikram Sen",
      assigneeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
      dueDate: "2026-10-24"
    },
    {
      id: "tsk_3",
      projectId: "proj_1",
      title: "FastAPI Telemetry Endpoints & WebSocket",
      description: "Create live streaming endpoints for energy consumption spikes and alert triggers.",
      status: "inprogress",
      priority: "high",
      assigneeName: "Aarav Sharma",
      assigneeAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      dueDate: "2026-10-30"
    },
    {
      id: "tsk_4",
      projectId: "proj_1",
      title: "Hostel A/B Energy Comparison Chart",
      description: "Implement interactive SVG / Canvas energy trend charts showing peak surge hours.",
      status: "inprogress",
      priority: "medium",
      assigneeName: "Aarav Sharma",
      assigneeAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      dueDate: "2026-11-04"
    },
    {
      id: "tsk_5",
      projectId: "proj_1",
      title: "YOLO Waste Item Classifier Training",
      description: "Train lightweight model on campus cafeteria recyclable trash categories.",
      status: "review",
      priority: "medium",
      assigneeName: "Rohan Varma",
      assigneeAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
      dueDate: "2026-11-08"
    },
    {
      id: "tsk_6",
      projectId: "proj_1",
      title: "Automated Weekly Carbon Savings Report",
      description: "Draft PDF generation microservice summarizing hostel waste diversion stats.",
      status: "todo",
      priority: "low",
      assigneeName: "Unassigned",
      assigneeAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      dueDate: "2026-11-18"
    }
  ]
};
