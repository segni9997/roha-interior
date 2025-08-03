"use client";
import { motion } from "framer-motion";
import logo from "../assets/roha.png";

const Hero = () => {
  return (
    <>
      <section>
        <div className="relative min-h-screen overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-bg ">
            
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-[#172a2b]/40"></div>

            {/* Additional gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#143236] via-[#143236] to-[#395e63]/30"></div>
          </div>

          {/* Skyscraper Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#143236] via-transparent to-transparent"></div>
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%),
                             linear-gradient(-45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)`,
                backgroundSize: "100px 100px",
              }}
            ></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-6 text-center mx-auto">
            {/* Achievement Badge */}

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-6 flex items-center "
            >
              <motion.img
                src={logo}
                className="w-96 h-96 mx-auto object-contain"
                alt="Roha"
                animate={{
                  y: [-10, 10, -10],
                  scale: [1, 1.02, 1],
                  rotate: 0,
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.15,
                  rotate: 0,
                  transition: { duration: 0.8 },
                }}
              />
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#172a2b] to-transparent"></div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#5b949b]/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
