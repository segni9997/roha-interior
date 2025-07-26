
import { motion } from "framer-motion"
import { ArrowRight, Building2, Home } from "lucide-react"
import interior from "../assets/rohalandscape.png"
import { Link } from "react-router-dom"


const Category = () => {
  const categories = [
    {
      id: 1,
      title: "Model",
      description: "Explore our architectural models and 3D visualizations",
      icon: Building2,
      image: interior,

      link: "/model-making",
      gradient: "from-[#1c2d2e] via-[#1c2d2e] to-[#1c2d2e]",
      clipPath: "polygon(0 0, 85% 0, 100% 100%, 0 100%)",
      hoverClipPath: "polygon(0 0, 90% 0, 100% 100%, 5% 100%)",
    },
    {
      id: 2,
      title: "Interior",
      description: "Discover our interior design solutions and concepts",
      icon: Home,
      image: interior,
      link: "/interior",
      gradient: "from-[#1c2d2e] via-[#1c2d2e] to-[#1c2d2e]",

      clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
      hoverClipPath: "polygon(10% 0, 100% 0, 95% 100%, 0 100%)",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

 

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#172a2b] via-[#0a1a1b] to-[#1a2f32] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(91, 148, 155, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(57, 94, 99, 0.2) 0%, transparent 50%)`,
            backgroundSize: "400px 400px",
          }}
        />
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
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-primary">
            Our <span className="text-[#5b949b]">Expertise</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our specialized services in architectural modeling and
            interior design
          </p>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto "
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl">
                {/* Background with Clip Path */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`}
                  style={{
                    clipPath: category.clipPath,
                  }}
                  whileHover={{
                    clipPath: category.hoverClipPath,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {/* Overlay Pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
                    backgroundSize: "20px 20px",
                    clipPath: category.clipPath,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.2 + 0.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                    viewport={{ once: true }}
                    className="self-start"
                  >
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  <motion.img
                    src={category.image}
                    alt={category.title}
                    className="w-72 h-72 items-center mx-auto"
                    initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.2,
                      rotate: 4,
                    }}
                  />
                  {/* Text Content */}
                  <div className="space-y-4">
                    <motion.h3
                      initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.7 }}
                      viewport={{ once: true }}
                      className="text-4xl md:text-5xl font-bold text-white"
                    >
                      {category.title}
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.9 }}
                      viewport={{ once: true }}
                      className="text-lg text-white/80 leading-relaxed"
                    >
                      {category.description}
                    </motion.p>

                    {/* Arrow Button */}
                    <Link to={category.link}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.2 + 1.1 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-2 text-white group-hover:translate-x-2 transition-transform duration-300"
                      >
                        <span className="text-sm font-semibold tracking-wider">
                          EXPLORE
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </motion.div>
                    </Link>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ clipPath: category.clipPath }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-[#5b949b]/30 rounded-full animate-pulse" />
        <div className="absolute bottom-32 right-16 w-6 h-6 bg-[#395e63]/40 rounded-full animate-bounce" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping" />
        <div className="absolute top-20 right-10 w-4 h-4 bg-[#5b949b]/30 rounded-full animate-pulse" />
        <div className="absolute bottom-32 left-16 w-6 h-6 bg-[#395e63]/40 rounded-full animate-bounce" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping" />
      </div>
    </section>
  );
}

export default Category
