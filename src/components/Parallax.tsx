"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ParallaxImage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%]">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg')",
          }}
        />

        {/* Dark Overlay with Clip Path */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#000000]/70 via-[#000000]/40 to-[#000000]/70"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
          }}
        />
      </motion.div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          style={{ opacity }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center px-6 max-w-4xl mx-auto"
        >
          {/* Background Shape for Text */}
          <div
            className="relative bg-gradient-to-r from-[#395e63]/30 via-[#000000]/50 to-[#395e63]/30 backdrop-blur-xl p-12 border border-[#395e63]/20 overflow-hidden"
            style={{
              clipPath:
                "polygon(10% 0%, 90% 0%, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0% 80%, 0% 20%)",
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-primary"
            >
              Designing the <span className="text-[#5b949b]">Future</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8"
            >
              Every space we create tells a story of innovation, sustainability,
              and human connection. We believe architecture should inspire and
              transform lives.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#395e63] to-[#5b949b] text-white px-8 py-4 font-semibold hover:from-[#5b949b] hover:to-[#395e63] transition-all duration-300 shadow-2xl"
                style={{
                  clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
                }}
              >
                Explore Our Work
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white hover:text-[#395e63] transition-all duration-300"
                style={{
                  clipPath: "polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%)",
                }}
              >
                Get In Touch
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#5b949b]/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, -150],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Bottom Clip Path Divider */}
      <div
        className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#172a2b] to-transparent"
        style={{
          clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 60%)",
        }}
      />
    </section>
  );
};

export default ParallaxImage;
