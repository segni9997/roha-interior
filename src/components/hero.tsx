"use client"

import { useState, useEffect } from "react"
import { motion, useScroll } from "framer-motion"
import logo from "../assets/roha.png"

const Hero = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50) // Text appears after scrolling 50px
    })
    return () => unsubscribe()
  }, [scrollY])

  return (
    <>
      <section>
        <div className="relative min-h-screen overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-bg">
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-[#022024]/40"></div>
            {/* Additional gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#172a2b] via-[#172a2b] to-[#395e63]/30"></div>
          </div>

          {/* Skyscraper Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#172a2b]/90 via-transparent to-transparent"></div>
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
            {/* Logo and Slogan Container */}
            <div className="flex flex-col  items-center justify-center gap-8 lg:gap-12 w-full max-w-6xl ">
              {/* Logo - Appears on page load with fade-in */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1.2,
                  delay: 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                className="flex-shrink-0"
              >
                <motion.img
                  src={logo}
                  className="w-64 h-64 lg:w-[400px] lg:h-[400px] object-contain"
                                  alt="Roha"
                                  
                  animate={
                    {
                    y: [-10, 10, -10],
                    scale: [1, 1.02, 1],
                    rotate: 0,
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1.5, // Start floating animation after logo appears
                  }}
                  whileHover={{
                    scale: 1.15,
                    rotate: 0,
                    transition: { duration: 0.8 },
                  }}
                />
              </motion.div>

              {/* Slogan - Only appears when scrolling, slides in from right */}
              <motion.div
                initial={{ opacity: 0, y: 200 }}
                animate={
                  isScrolled
                    ? {
                        opacity: 1,
                        y: 0,
                      }
                    : {
                        opacity: 0,
                        y: 100,
                      }
                }
                transition={{
                  duration: 1,
                //   delay: 0.2,
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                }}
                className="slogan font-primary text-white text-xl lg:text-2xl xl:text-3xl font-extrabold max-w-lg lg:max-w-lg text-center "
                          >
                              <h1 className="text-7xl lg:text-9xl text-center text-[#395e63] font-primary">ROHA</h1>
                              <span className="text-gray-300">
                In this ocean of creativity, we bring your visions to life
                                  
                              </span>
              </motion.div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1f3436] via-[#022024]/20 to-transparent"></div>

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
  )
}

export default Hero
