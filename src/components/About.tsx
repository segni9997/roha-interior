  "use client"
  import { motion } from "framer-motion"
  import { Building2, Users, Award, Target, Eye, Heart } from "lucide-react"

  const About = () => {
    const stats = [
      { number: "150+", label: "Projects Completed", icon: Building2 },
      { number: "25+", label: "Years Experience", icon: Award },
      { number: "50+", label: "Happy Clients", icon: Users },
      { number: "15+", label: "Awards Won", icon: Target }
    ]

    const values = [
      {
        icon: Eye,
        title: "Vision",
        description: "We see beyond the ordinary, creating spaces that inspire and transform lives through innovative architectural solutions."
      },
      {
        icon: Heart,
        title: "Passion",
        description: "Every project is crafted with dedication and love, ensuring each space reflects the unique story of its inhabitants."
      },
      {
        icon: Target,
        title: "Excellence",
        description: "We pursue perfection in every detail, from initial concept to final execution, delivering uncompromising quality."
      }
    ]

    return (
      <section className="relative min-h-screen bg-gradient-to-b from-[#1f3436] via-[#022024] to-[#1f3436] overflow-hidden">
        {/* Geometric Background Shapes with Clip-Path */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large diagonal shape */}
          <div 
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-[#395e63]/20 to-[#022024]/30"
            style={{
              clipPath: "polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)"
            }}
          ></div>
          
          {/* Angular accent shape */}
          <div 
            className="absolute top-1/4 left-0 w-1/3 h-1/2 bg-gradient-to-r from-[#395e63]/15 to-transparent"
            style={{
              clipPath: "polygon(0% 0%, 80% 0%, 60% 100%, 0% 100%)"
            }}
          ></div>

          {/* Bottom geometric accent */}
          <div 
            className="absolute bottom-0 left-1/4 w-1/2 h-1/3 bg-gradient-to-t from-[#395e63]/25 to-transparent"
            style={{
              clipPath: "polygon(0% 100%, 100% 100%, 80% 0%, 20% 0%)"
            }}
          ></div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%),
                              linear-gradient(-45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)`,
              backgroundSize: "100px 100px",
            }}
          ></div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#395e63]/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Section Header with Clip-Path */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20 relative"
            >
              {/* Header background with clip-path */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-[#395e63]/20 via-[#022024]/30 to-[#395e63]/20 -mx-20"
                style={{
                  clipPath: "polygon(10% 0%, 90% 0%, 95% 100%, 5% 100%)"
                }}
              ></div>
              
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative text-5xl md:text-7xl font-bold text-white mb-3 py-8 font-primary"
              >
                About <span className="text-[#395e63] ">Roha</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="relative text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto p-1"
              >
                Shaping spaces with vision and precision
              </motion.p>
            </motion.div>

            {/* Main Content Grid with Clip-Path Cards */}
            <div className="grid lg:grid-cols-2 gap-16 mb-20">
              {/* Left Column - Story */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div 
                  className="relative bg-gradient-to-br from-[#395e63]/20 to-[#022024]/30 backdrop-blur-lg p-8 border border-[#395e63]/20 overflow-hidden"
                  style={{
                    clipPath: "polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%)"
                  }}
                >
                  <h3 className="text-3xl font-bold text-white mb-6">Our Story</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Founded with a vision to revolutionize architectural design, Roha has been at the forefront of creating extraordinary spaces that blend functionality with artistic expression. Our journey began with a simple belief: architecture should not just shelter, but inspire.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Over the years, we've evolved into a team of passionate architects, designers, and visionaries who understand that every space tells a story. We don't just design buildings; we craft experiences that resonate with the human spirit.
                  </p>
                </div>
              </motion.div>

              {/* Right Column - Mission & Vision */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div 
                  className="relative bg-gradient-to-br from-[#395e63]/20 to-[#022024]/30 backdrop-blur-lg p-8 border border-[#395e63]/20 overflow-hidden"
                  style={{
                    clipPath: "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)"
                  }}
                >
                  <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    To create architectural masterpieces that stand the test of time while pushing the boundaries of innovation, sustainability, and human-centered design.
                  </p>
                  
                  <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    To be the world's most respected architectural firm, known for transforming communities through spaces that inspire, connect, and elevate the human experience.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Stats Section with Hexagonal Clip-Path */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="relative bg-gradient-to-br from-[#395e63]/30 to-[#022024]/40 backdrop-blur-lg p-6 border border-[#395e63]/30 text-center group hover:border-[#395e63]/50 transition-all duration-300 overflow-hidden"
                    style={{
                      clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)"
                    }}
                  >
                    <stat.icon className="w-8 h-8 text-[#395e63] mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Values Section with Angular Clip-Path */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h3 className="text-4xl font-bold text-white text-center mb-16">Our Core Values</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative bg-gradient-to-br from-[#395e63]/20 to-[#022024]/30 backdrop-blur-lg p-8 border border-[#395e63]/20 hover:border-[#395e63]/40 transition-all duration-300 overflow-hidden"
                    style={{
                      clipPath: index === 0 
                        ? "polygon(0% 0%, 90% 0%, 100% 100%, 10% 100%)"
                        : index === 1 
                        ? "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)"
                        : "polygon(0% 0%, 100% 0%, 100% 90%, 0% 100%)"
                    }}
                  >
                    <value.icon className="w-12 h-12 text-[#395e63] mb-6" />
                    <h4 className="text-2xl font-bold text-white mb-4">{value.title}</h4>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Call to Action with Diamond Clip-Path */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div 
                className="relative bg-gradient-to-r from-[#395e63]/30 to-[#022024]/40 backdrop-blur-lg p-12 border border-[#395e63]/30 overflow-hidden"
                style={{
                  clipPath: "polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)"
                }}
              >
                <h3 className="text-4xl font-bold text-white mb-6">Ready to Create Something Extraordinary?</h3>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Let's collaborate to bring your architectural vision to life. Every great space begins with a conversation.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-gradient-to-r from-[#395e63] to-[#4a7c82] text-white px-12 py-4 text-lg font-semibold hover:from-[#4a7c82] hover:to-[#395e63] transition-all duration-300 shadow-2xl overflow-hidden"
                  style={{
                    clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)"
                  }}
                >
                  Start Your Journey
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient with clip-path */}
        <div 
          className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1f3436] to-transparent"
          style={{
            clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 50%)"
          }}
        ></div>
      </section>
    )
  }

  export default About