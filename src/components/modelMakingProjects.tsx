
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, ExternalLink, Search, Filter } from "lucide-react";
import logo from "../assets/roha.png";
import ethio from "../assets/ethio3.jpg"

interface Project {
  id: number;
  title: string;
  type: string;
  category: string;
  year: string;
  day: string;
  image: string;
  description: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Modern Residential Complex",
    type: "Residential",
    category: "Architecture",
    year: "2024",
    day: "Monday",
    image: ethio,
    description:
      "A contemporary residential development with sustainable design principles",
  },
  {
    id: 2,
    title: "Corporate Headquarters",
    type: "Commercial",
    category: "Office",
    year: "2023",
    day: "Tuesday",
    image: ethio,
    description:
      "State-of-the-art corporate building with innovative workspace design",
  },
  {
    id: 3,
    title: "Cultural Center",
    type: "Public",
    category: "Cultural",
    year: "2024",
    day: "Wednesday",
    image: ethio,
    description: "Multi-purpose cultural facility serving the local community",
  },
  {
    id: 4,
    title: "Luxury Hotel Resort",
    type: "Hospitality",
    category: "Tourism",
    year: "2023",
    day: "Thursday",
    image: ethio,
    description: "Five-star resort with panoramic views and premium amenities",
  },
  {
    id: 5,
    title: "Educational Campus",
    type: "Educational",
    category: "Institution",
    year: "2024",
    day: "Friday",
    image: ethio,
    description: "Modern university campus with integrated learning spaces",
  },
  {
    id: 6,
    title: "Shopping Mall Complex",
    type: "Commercial",
    category: "Retail",
    year: "2023",
    day: "Saturday",
    image: ethio,
    description: "Large-scale retail complex with entertainment facilities",
  },
  {
    id: 7,
    title: "Healthcare Facility",
    type: "Healthcare",
    category: "Medical",
    year: "2024",
    day: "Sunday",
    image: ethio,
    description: "Advanced medical center with patient-centered design",
  },
  {
    id: 8,
    title: "Mixed-Use Development",
    type: "Mixed-Use",
    category: "Urban",
    year: "2023",
    day: "Monday",
    image: ethio,
    description:
      "Integrated development combining residential, commercial, and office spaces",
  },
];

export default function ModelProjects() {

const [hoveredProject, setHoveredProject] = useState<number | null>(null);
const [searchTerm, setSearchTerm] = useState("");
const [selectedType, setSelectedType] = useState("All");

const types = ["All", ...Array.from(new Set(projects.map((p) => p.type)))];

const filteredProjects = projects
  .filter((project) => {
    const search = searchTerm.trim().toLowerCase();
    return (
      !search ||
      project.title.toLowerCase().includes(search) ||
      project.description.toLowerCase().includes(search)
    );
  })
  .filter((project) => {
    return selectedType === "All" || project.type === selectedType;
  });
console.log(filteredProjects)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Our{" "}
              <span className="bg-gradient-to-r from-[#395e63] to-[#5b949b] bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our portfolio of precision-crafted architectural models
              that bring visions to life
            </p>
          </motion.div>
        </div>

        {/* Stylish Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 space-y-8"
        >
          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative max-w-2xl w-full">
              <div
                className="relative bg-white shadow-lg overflow-hidden"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)",
                }}
              >
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[#395e63] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 text-lg bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
                />
                <div
                  className="absolute inset-0 border-2 border-transparent hover:border-[#395e63]/20 transition-colors pointer-events-none"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)",
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Type Filters */}
          <div className="text-center space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Filter by Type
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {types.map((type, index) => (
                <motion.button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-6 py-3 font-semibold transition-all duration-300 overflow-hidden ${
                    selectedType === type
                      ? "text-white"
                      : "text-[#395e63] hover:text-white"
                  }`}
                  style={{
                    clipPath:
                      index % 2 === 0
                        ? "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)"
                        : "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)",
                  }}
                >
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      selectedType === type
                        ? "bg-gradient-to-r from-[#395e63] to-[#5b949b]"
                        : "bg-gray-100 hover:bg-gradient-to-r hover:from-[#395e63] hover:to-[#5b949b]"
                    }`}
                    style={{
                      clipPath:
                        index % 2 === 0
                          ? "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)"
                          : "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)",
                    }}
                  ></div>
                  <span className="relative z-10">{type}</span>
                  {selectedType === type && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
                    ></motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Day Filters */}
          {/* <div className="text-center space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Filter by Day
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {days.map((day) => (
                <motion.button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-5 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedDay === day
                      ? "text-white bg-gradient-to-r from-[#395e63] to-[#5b949b] shadow-lg"
                      : "text-[#395e63] bg-white border-2 border-[#395e63]/20 hover:border-[#395e63]/40 hover:shadow-md"
                  }`}
                  style={{
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                  }}
                >
                  <span className="relative z-10">{day}</span>
                  {selectedDay === day && (
                    <motion.div
                      layoutId="dayIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-[#395e63] to-[#5b949b]"
                      style={{
                        clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                      }}
                    ></motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div> */}

          {/* Active Filters & Results */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Active Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {(searchTerm || selectedType !== "All") && (
                <span className="text-sm text-gray-600 mr-2">
                  Active filters:
                </span>
              )}
              {searchTerm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1 bg-[#395e63]/10 text-[#395e63] rounded-full text-sm"
                >
                  <Search className="w-3 h-3" />
                  <span>"{searchTerm}"</span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:bg-[#395e63]/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </motion.div>
              )}
              {selectedType !== "All" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1 bg-[#5b949b]/10 text-[#5b949b] rounded-full text-sm"
                >
                  <Filter className="w-3 h-3" />
                  <span>{selectedType}</span>
                  <button
                    onClick={() => setSelectedType("All")}
                    className="hover:bg-[#5b949b]/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </div>

            {/* Results Count */}
            <motion.div
              key={filteredProjects.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100"
            >
              <div className="w-2 h-2 bg-gradient-to-r from-[#395e63] to-[#5b949b] rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {filteredProjects.length} project
                {filteredProjects.length !== 1 ? "s" : ""} found
              </span>
            </motion.div>
          </div>

          {/* Clear All Filters */}
          {(searchTerm || selectedType !== "All") && (
            <div className="text-center">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("All");
                }}
                className="px-6 py-2 text-sm text-gray-600 hover:text-[#395e63] border border-gray-300 hover:border-[#395e63] rounded-full transition-colors duration-300"
              >
                Clear All Filters
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              // variants={itemVariants}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredProject(project.id)}
              onHoverEnd={() => setHoveredProject(null)}
                  className="group cursor-pointer"
                  
            >
                  <div className="relative h-80 overflow-hidden  hover:border-[#395e63]/40 transition-all duration-500"
                  
                  >
                {/* Clip-path container */}
                <div className="absolute inset-0 overflow-hidden bg-gradient-to-t " >
                  {/* Main Image */}
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      clipPath:
                        index % 2 === 0
                          ? "polygon(0% 0%, 90% 0%, 100% 100%, 15% 100%)"
                          : index % 2 === 1
                          ? "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)"
                          : "polygon(0% 0%, 100% 0%, 100% 85%, 0% 100%)",
                    }}
                  />

                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-t from-[#022024]/90 via-[#395e63]/60 to-transparent"
                  />

                  {/* Content Overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-[#022024]/90 via-[#395e63]/60 to-transparent"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {project.type} • {project.year}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 45 }}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </motion.div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 bg-[#395e63]/60 backdrop-blur-sm px-3 py-1 rounded-full"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Full View</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>

                {/* Project Info Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="absolute top-4 left-4 bg-white/10 backdrop-blur-md p-3 text-white"
                  style={{
                    clipPath: "polygon(0% 0%, 85% 0%, 100% 100%, 0% 100%)",
                  }}
                >
                  <p className="text-xs font-semibold tracking-wider">
                    {project.category.toUpperCase()}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Filter className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No projects found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
