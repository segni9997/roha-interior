
import { motion } from "framer-motion";
// import logo from "../assets/roha.png";
// import contour1 from "/one1.png"
// import conference from "/confrence1.png"
import pattern from "/public/PATTERN.jpg"

const Hero = () => {
  return (
    <>
      <section>
       
        


  {/* <div className="absolute bg-[#143236] w-full h-full inset-0 top-0  "></div> */}
       
        <div className="relative min-h-screen overflow-hidden">
     <div className="absolute rotate-90   right-0 -z-20">
      <img src={pattern} alt="pattern"  className="  right-0   "/>
      <div className="absolute bg-[#205b63]/30 inset-0  w-10 h-full"></div>
     </div>
          {/* Background Image */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat  hero-bg ">
            
            {/* Dark overlay for better text contrast */}
            {/* <div className="absolute inset-0 bg-[#fff]/40"></div> */}

            {/* Additional gradient overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-[#143236] via-[#143236] to-[#fff]/20"></div> */}
          </div>

          {/* Skyscraper Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-[#fff] via-transparent to-transparent"></div>
            {/* <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%),
                             linear-gradient(-45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)`,
                backgroundSize: "100px 100px",
              }}
            ></div> */}
{/* 
            <div className="absolute inset-0">
            <img src={contour1} alt="contour" className="absolute  right-0  "/>
                   <div className="absolute bg-gradient-to-l  from-[#223e42] to-transparent w-full h-full inset-1 opacity-95 top-0 right-0"></div>

            </div> */}
            {/* <img src={conference} alt="contour" className="absolute  left-0  bottom-1/3 w-52 h-52 "/> */}

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
              {/* <motion.img
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
              /> */}
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 "></div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#5b949b]/90 rounded-full"
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
