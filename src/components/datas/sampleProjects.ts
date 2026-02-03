import type { Project } from "../Projectdetail";

export const sampleProjects: Project[] = [
  {
    id: 1,
    title: "Modern Residential Complex",
    category: "Residential",
    location: "Addis Ababa, Ethiopia",
    year: "2024",
    description: "A cutting-edge residential complex redefining urban living through innovative design.",
    images: ["/tr/279A1756.JPG", "/tr/279A1757.JPG", "/tr/279A1758.JPG", "/tr/279A1759.JPG"],
    featured: true,
    panoramicScenes: [
      {
        id: "livingRoom",
        name: "Living Room",
        panorama: "/tr/279A1002.JPG",
        hotSpots: [
          { pitch: 10, yaw: 150, type: "scene", text: "Go to Kitchen", sceneId: "kitchen", targetYaw: 0, targetPitch: 0, cssClass: "custom-hotspot" }
        ]
      },
      {
        id: "kitchen",
        name: "Kitchen",
        panorama: "/tr/279A1003.JPG",
        hotSpots: [
          { pitch: 5, yaw: -170, type: "scene", text: "Back to Living Room", sceneId: "livingRoom", targetYaw: 150, targetPitch: 10, cssClass: "custom-hotspot" }
        ]
      }
    ],
    specifications: {
      area: "15,500 m²",
      floors: 12,
      density: "85 units/hectare",
      projectType: "Mixed-Use Residential",
      duration: "36 months",
      budget: "$45M",
      architect: "ROHA Design Team",
      client: "Urban Development Corp",
      status: "Completed",
      sustainability: "LEED Platinum"
    }
  },
  {
    id: 2,
    title: "Corporate Headquarters",
    category: "Commercial",
    location: "London, UK",
    year: "2023",
    description: "An iconic corporate headquarters featuring a striking glass facade and integrated green spaces.",
    images: ["/tr/279A1760.JPG", "/tr/279A1761.JPG", "/tr/279A1762.JPG"],
    featured: true,
    panoramicScenes: [
      {
        id: "lobby",
        name: "Main Lobby",
        panorama: "/tr/279A1763.JPG",
        hotSpots: [
          { pitch: 5, yaw: 100, type: "scene", text: "Executive Office", sceneId: "office", cssClass: "custom-hotspot" }
        ]
      },
      {
        id: "office",
        name: "Executive Office",
        panorama: "/tr/279A1764.JPG",
        hotSpots: [
          { pitch: 0, yaw: -10, type: "scene", text: "Back to Lobby", sceneId: "lobby", cssClass: "custom-hotspot" }
        ]
      }
    ],
    specifications: {
      area: "28,000 m²",
      floors: 18,
      density: "120 employees/floor",
      projectType: "Corporate Office",
      duration: "42 months",
      budget: "$85M",
      architect: "Global Arch Partners",
      client: "Tech Solutions Ltd",
      status: "Completed",
      sustainability: "BREEAM Excellent"
    }
  },
  {
    id: 3,
    title: "Cultural Arts Center",
    category: "Cultural",
    location: "Tokyo, Japan",
    year: "2023",
    description: "A beacon for creativity featuring fluid architectural forms and innovative materials.",
    images: ["/tr/279A1765.JPG", "/tr/279A1766.JPG", "/tr/279A1767.JPG"],
    panoramicScenes: [
      {
        id: "mainHall",
        name: "Main Hall",
        panorama: "/tr/279A1768.JPG",
        hotSpots: [
          { pitch: 0, yaw: 120, type: "scene", text: "Exhibition Area", sceneId: "exhibition", cssClass: "custom-hotspot" }
        ]
      },
      {
        id: "exhibition",
        name: "Exhibition Area",
        panorama: "/tr/279A1769.JPG",
        hotSpots: [
          { pitch: 0, yaw: -10, type: "scene", text: "Back to Main Hall", sceneId: "mainHall", cssClass: "custom-hotspot" }
        ]
      }
    ],
    specifications: {
      area: "12,000 m²",
      floors: 4,
      density: "N/A",
      projectType: "Cultural Center",
      duration: "30 months",
      budget: "$60M",
      architect: "Kengo Kuma Associates",
      client: "Metropolitan Govt",
      status: "Completed",
      sustainability: "CASBEE A Rank"
    }
  },
  {
    id: 4,
    title: "Sustainable Office Tower",
    category: "Commercial",
    location: "Singapore",
    year: "2024",
    description: "A pioneering sustainable tower with advanced energy systems and vertical gardens.",
    images: ["/tr/279A1770.JPG", "/tr/279A1771.JPG", "/tr/279A1772.JPG"],
    panoramicScenes: [
      {
        id: "rooftop",
        name: "Rooftop Garden",
        panorama: "/tr/279A1773.JPG",
        hotSpots: [
          { pitch: 0, yaw: 0, type: "info", text: "Rainwater Collection System", cssClass: "custom-info-hotspot" }
        ]
      }
    ],
    specifications: {
      area: "35,000 m²",
      floors: 25,
      density: "150 employees/floor",
      projectType: "Office Tower",
      duration: "48 months",
      budget: "$120M",
      architect: "Foster + Partners",
      client: "Green Future Inv",
      status: "Under Construction",
      sustainability: "Green Mark Platinum"
    }
  },
  {
    id: 5,
    title: "Luxury Resort Complex",
    category: "Hospitality",
    location: "Maldives",
    year: "2023",
    description: "Exclusive resort integrating tropical beauty with world-class amenities.",
    images: ["/tr/279A1812.JPG", "/tr/279A1813.JPG", "/tr/279A1815.JPG"],
    panoramicScenes: [
      {
        id: "beachVilla",
        name: "Beach Villa",
        panorama: "/tr/279A1816.JPG",
        hotSpots: [
          { pitch: 5, yaw: 10, type: "scene", text: "Bungalow View", sceneId: "bungalow", cssClass: "custom-hotspot" }
        ]
      },
      {
        id: "bungalow",
        name: "Overwater Bungalow",
        panorama: "/tr/279A1817.JPG",
        hotSpots: [
          { pitch: 0, yaw: -10, type: "scene", text: "Back to Villa", sceneId: "beachVilla", cssClass: "custom-hotspot" }
        ]
      }
    ],
    specifications: {
      area: "50,000 m²",
      floors: 2,
      density: "0.5 FAR",
      projectType: "Luxury Resort",
      duration: "36 months",
      budget: "$150M",
      architect: "Gathy Studios",
      client: "Paradise Resorts",
      status: "Completed",
      sustainability: "Green Globe"
    }
  },
  {
    id: 6,
    title: "Educational Campus",
    category: "Educational",
    location: "California, USA",
    year: "2024",
    description: "Forward-thinking campus designed to foster collaborative learning and community.",
    images: ["/tr/279A1818.JPG", "/tr/4V0A0305.JPG", "/tr/4V0A0306.JPG"],
    panoramicScenes: [
      {
        id: "library",
        name: "Campus Library",
        panorama: "/tr/4V0A0307.JPG",
        hotSpots: [
          { pitch: 0, yaw: 10, type: "scene", text: "Lecture Hall", sceneId: "lecture", cssClass: "custom-hotspot" }
        ]
      },
      {
        id: "lecture",
        name: "Lecture Hall",
        panorama: "/tr/4V0A0308.JPG",
        hotSpots: [
          { pitch: 0, yaw: -10, type: "scene", text: "Library", sceneId: "library", cssClass: "custom-hotspot" }
        ]
      }
    ],
    specifications: {
      area: "40,000 m²",
      floors: 5,
      density: "N/A",
      projectType: "University Campus",
      duration: "60 months",
      budget: "$200M",
      architect: "SOM Architects",
      client: "State University",
      status: "Under Construction",
      sustainability: "LEED Gold"
    }
  }
];