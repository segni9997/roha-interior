import { motion } from "framer-motion"
import { ExternalLink, Eye, ArrowUpRight } from "lucide-react"
import { useState } from "react"

const ProjectGallery = () => {
  const [activeFilter, setActiveFilter] = useState("all")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
console.log(hoveredProject);
  const projects = [
    {
      id: 1,
      title: "Modern Residence",
      category: "interior",
      type: "Residential Interior",
      year: "2024",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      hoverImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      id: 2,
      title: "Urban Tower Model",
      category: "model",
      type: "Architectural Model",
      year: "2024",
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
      hoverImage: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      id: 3,
      title: "Luxury Penthouse",
      category: "interior",
      type: "High-end Interior",
      year: "2023",
      image: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=800",
      hoverImage: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      id: 4,
      title: "Commercial Complex",
      category: "model",
      type: "Scale Model",
      year: "2023",
      image: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=800",
      hoverImage: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      id: 5,
      title: "Minimalist Office",
      category: "interior",
      type: "Corporate Interior",
      year: "2023",
      image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800",
      hoverImage: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      id: 6,
      title: "Cultural Center Model",
      category: "model",
      type: "Institutional Model",
      year: "2022",
      image: "https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=800",
      hoverImage: "https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=1200"
    }
  ]

  const filters = [
    { id: "all", label: "All Projects" },
    { id: "interior", label: "Interior Design" },
    { id: "model", label: "Model Making" }
  ]

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#1f3436] via-[#0a1a1b] to-[#172a2b] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-[#395e63]/10 to-transparent"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 0% 80%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-2/3 h-1/2 bg-gradient-to-tl from-[#395e63]/15 to-transparent"
          style={{
            clipPath: "polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#395e63]/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -80],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 font-primary">
            Featured <span className="text-[#5b949b]">Projects</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our portfolio of exceptional architectural and interior
            design projects
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter.id)}
              className={`relative px-8 py-3 font-semibold transition-all duration-300 overflow-hidden ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-[#395e63] to-[#5b949b] text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
              }`}
              style={{
                clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
              }}
            >
              {filter.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
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
              <div className="relative h-80 overflow-hidden bg-[#022024] border border-[#395e63]/20 hover:border-[#395e63]/40 transition-all duration-500">
                {/* Clip-path container */}
                <div className="absolute inset-0 overflow-hidden bg-gradient-to-t bg-[#395e63]/20 to-white/50">
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
                          ? "polygon(0% 0%, 85% 0%, 100% 100%, 15% 100%)"
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

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-gradient-to-r from-[#395e63] to-[#5b949b] text-white px-12 py-4 font-semibold hover:shadow-2xl transition-all duration-300 overflow-hidden"
            style={{
              clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
            }}
          >
            <span className="relative z-10">Load More Projects</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#5b949b] to-[#395e63]"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectGallery