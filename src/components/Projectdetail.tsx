
import { useRef } from "react"
import { MapPin, Calendar, Tag, Building2, Users, Clock, DollarSign } from "lucide-react"



export interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  images: string[];
  featured?: boolean;
  // Updated to support multiple panoramic scenes with hotspots
  panoramicScenes?: {
    id: string; // Unique ID for the scene (e.g., "livingRoom", "kitchen")
    panorama: string; // URL of the panoramic image
    name: string; // Display name for the scene (e.g., "Living Room")
    hotSpots?: {
      pitch: number;
      yaw: number;
      type: "scene" | "info";
      text: string;
      sceneId?: string; // Required if type is "scene"
      targetYaw?: number;
      targetPitch?: number;
      cssClass?: string;
    }[];
  }[];
  // Add new detailed specifications
  specifications: {
    area: string; // square meters
    floors: number;
    density: string;
    projectType: string;
    duration: string;
    budget: string;
    architect: string;
    client: string;
    status: string;
    sustainability: string;
  };
}


export interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  images: string[];
  featured?: boolean;
  panoramicScenes?: {
    id: string;
    panorama: string;
    name: string;
    hotSpots?: {
      pitch: number;
      yaw: number;
      type: "scene" | "info";
      text: string;
      sceneId?: string;
      targetYaw?: number;
      targetPitch?: number;
      cssClass?: string;
    }[];
  }[];
  specifications: {
    area: string;
    floors: number;
    density: string;
    projectType: string;
    duration: string;
    budget: string;
    architect: string;
    client: string;
    status: string;
    sustainability: string;
  };
}

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
const ProjectDetail = () => {
  const containerRef = useRef<HTMLDivElement>(null)

    const project = sampleProjects[0]
      const specificationItems = [
        {
          label: "Total Area",
          value: project.specifications.area,
          icon: Building2,
        },
        {
          label: "Floors",
          value: project.specifications.floors.toString(),
          icon: Building2,
        },
        {
          label: "Density",
          value: project.specifications.density,
          icon: Users,
        },
        {
          label: "Project Type",
          value: project.specifications.projectType,
          icon: Tag,
        },
        {
          label: "Duration",
          value: project.specifications.duration,
          icon: Clock,
        },
        {
          label: "Budget",
          value: project.specifications.budget,
          icon: DollarSign,
        },
        {
          label: "Architect",
          value: project.specifications.architect,
          icon: Users,
        },
        {
          label: "Client",
          value: project.specifications.client,
          icon: Building2,
        },
        { label: "Status", value: project.specifications.status, icon: Tag },
        {
          label: "Sustainability",
          value: project.specifications.sustainability,
          icon: Building2,
        }, {
          label: "Sustainability",
          value: project.specifications.sustainability,
          icon: Building2,
        },
      ];
  return (
    <div ref={containerRef} className="h-screen overflow-y-auto bg-white">
      <style>{`
        .honeycomb {
          display: flex;
          flex-wrap: wrap;
          list-style: none;
          justify-content: center;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0;
          transform: translateY(34px);
        }

        .honeycomb-cell {
          flex: 0 1 250px;
          max-width: 250px;
          height: 137px;
          margin: 65px 12px 25px;
          position: relative;
          padding: 0.5em;
          text-align: center;
          z-index: 1;
        }

        .honeycomb-cell__title {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-transform: uppercase;
          color: #fff;
          font-weight: 700;
          font-size: 0.9em;
          transition: opacity 350ms;
          gap: 8px;
        }

        .honeycomb-cell__title small {
          font-weight: 300;
          font-size: 0.8em;
        }

        .honeycomb-cell::before,
        .honeycomb-cell::after {
          content: "";
          top: -50%;
          left: 0;
          width: 100%;
          height: 200%;
          display: block;
          position: absolute;
          clip-path: polygon(
            50% 0%,
            100% 25%,
            100% 75%,
            50% 100%,
            0% 75%,
            0% 25%
          );
          z-index: -1;
        }

        .honeycomb-cell::before {
          background: #fff;
          transform: scale(1.055);
        }

        .honeycomb-cell::after {
          background: #395e63;
          opacity: 0.9;
          transition: opacity 350ms, background 350ms;
        }

        .honeycomb-cell:hover .honeycomb-cell__title {
          opacity: 0.95;
          color:#000;
          scale:1.05

        }

        .honeycomb-cell:hover::before {
          background: #4a7278;
        }

        .honeycomb-cell:hover::after {
          background: #fff;
          opacity: 0.95;
        }

        .honeycomb__placeholder {
          display: none;
          opacity: 0;
          width: 250px;
          margin: 0 12px;
        }

        /* Responsive breakpoints */
        @media (max-width: 550px) {
          .honeycomb-cell {
            margin: 81px 25px;
          }
        }

        @media (min-width: 550px) and (max-width: 825px) {
          .honeycomb-cell:nth-child(3n) {
            margin-right: calc(50% - 125px);
            margin-left: calc(50% - 125px);
          }
          .honeycomb__placeholder:nth-child(3n + 5) {
            display: block;
          }
        }

        @media (min-width: 825px) and (max-width: 1100px) {
          .honeycomb-cell:nth-child(5n + 4) {
            margin-left: calc(50% - 275px);
          }
          .honeycomb-cell:nth-child(5n + 5) {
            margin-right: calc(50% - 275px);
          }
          .honeycomb__placeholder:nth-child(5n),
          .honeycomb__placeholder:nth-child(5n + 3) {
            display: block;
          }
        }

        @media (min-width: 1100px) {
          .honeycomb-cell:nth-child(7n + 5) {
            margin-left: calc(50% - 400px);
          }
          .honeycomb-cell:nth-child(7n + 7),
          .honeycomb-cell:nth-child(7n + 5):nth-last-child(2) {
            margin-right: calc(50% - 400px);
          }
          .honeycomb__placeholder:nth-child(7n + 7),
          .honeycomb__placeholder:nth-child(7n + 9),
          .honeycomb__placeholder:nth-child(7n + 11) {
            display: block;
          }
        }
      `}</style>

      {/* Fixed Navigation */}
      {/* <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
         
            <h1 className="text-2xl font-bold" style={{ color: "#395e63" }}>
              ROHA 
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden ">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${project.images[0]})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#395e63] px-4 py-2 rounded-full text-sm mb-4">
            <Tag size={16} />
            {project.category}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {project.title}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              {project.location}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              {project.year}
            </div>
          </div>
        </div>
      </section>

      {/* Project Description */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Project Overview
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            {project.description}
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            This project represents our commitment to creating spaces that not
            only meet functional requirements but also inspire and elevate the
            human experience. Through careful consideration of environmental
            factors, community needs, and aesthetic principles, we've developed
            a design that stands as a testament to innovative architectural
            thinking.
          </p>
        </div>
      </section>

      {/* Parallax Image Gallery - 2 Column Grid */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-9xl mx-auto px-6 lg:px-2">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Project Gallery
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {project.images.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg"
                style={{
                  height:
                    index % 2 === 0
                      ? "450px"
                      : index % 3 === 1
                      ? "500px"
                      : "400px",
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                  style={{
                    backgroundImage: `url(${image})`,
                  }}
                >
                  {/* Overlay with clip-path */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[#395e63]/0 to-[#395e63]/20 hover:from-[#395e63]/20 hover:to-[#395e63]/40 transition-all duration-500"
                    style={{
                      clipPath:
                        index % 3 === 0
                          ? "polygon(0 0, 100% 0, 95% 100%, 0% 100%)"
                          : index % 2 === 1
                          ? "polygon(5% 0%, 100% 0%, 100% 100%, 0% 100%)"
                          : index % 3 === 2
                          ? "polygon(0 0, 100% 0, 100% 95%, 0% 100%)"
                          : "polygon(0 5%, 100% 0%, 100% 100%, 0% 100%)",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20" style={{ backgroundColor: "#f8fafa" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Project Specifications
          </h2>

          {/* Honeycomb Grid */}
          <ul className="honeycomb">
            {specificationItems.map((spec, index) => (
              <li key={index} className="honeycomb-cell">
                <div className="honeycomb-cell__title">
                  <spec.icon size={24} />
                  <span>{spec.label}</span>
                  <small>{spec.value}</small>
                </div>
              </li>
            ))}
            {/* Placeholder cells for proper honeycomb alignment */}
            <li className="honeycomb-cell honeycomb__placeholder"></li>
            <li className="honeycomb-cell honeycomb__placeholder"></li>
          </ul>
        </div>
      </section>
      {/* Project Details */}
      <section className="py-20" style={{ backgroundColor: "#395e63" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-white">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">Design Philosophy</h3>
              <p className="text-white/90 leading-relaxed">
                Our design approach emphasizes the harmony between form and
                function, creating spaces that are both aesthetically pleasing
                and highly functional.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">Sustainability</h3>
              <p className="text-white/90 leading-relaxed">
                Environmental responsibility is at the core of our design
                process, incorporating energy-efficient systems and sustainable
                materials throughout.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">Innovation</h3>
              <p className="text-white/90 leading-relaxed">
                Cutting-edge technology and innovative construction techniques
                ensure that our projects push the boundaries of architectural
                possibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Inspired by This Project?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can create something equally remarkable for
            your next architectural project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#395e63] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#4a7278] transition-colors duration-300">
              Start Your Project
            </button>
            <button
              //   onClick={onBack}
              className="border-2 border-[#395e63] text-[#395e63] px-8 py-4 rounded-full font-semibold hover:bg-[#395e63] hover:text-white transition-all duration-300"
            >
              View More Projects
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProjectDetail
