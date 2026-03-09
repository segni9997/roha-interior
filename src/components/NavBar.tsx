import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";

export function NavigationOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);

  const navLinks = [
    { name: "Home", path: "/" },
    // { name: "ABOUT ME", path: "/about" },
    { name: "Blogs", path: "/allblogs" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contactus" },
    { name: "Model", path: "/model-making" },
    { name: "Interior", path: "/interior" },
  ];

  /* ===========================
     HIDE NAVBAR ON SCROLL
  =========================== */
  useEffect(() => {
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }

      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ===========================
     ANIMATION VARIANTS
  =========================== */

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: {
      x: 80,
      opacity: 0,
    },
    show: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      x: 80,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <>
      {/* ===========================
          NAVBAR
      =========================== */}

      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: showNav ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 h-full z-40 ${
          isOpen ? "backdrop-blur-xl" : ""
        }`}
      >
        <div
          className={`px-6 flex justify-between items-center ${
            isOpen ? "py-11" : "py-4"
          }`}
        >
          {/* Logo */}

          {isOpen ? (
            <img src="/roha.png" alt="Roha Logo" className="h-12 w-auto" />
          ) : (
            <h2 className="text-sm font-semibold text-white"></h2>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            {!isOpen && (
              <Menu
                size={34}
                className="text-white bg-[#0b272b] rounded-full p-2"
              />
            )}
          </button>
        </div>
      </motion.nav>

      {/* ===========================
          OVERLAY
      =========================== */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ===========================
          SLIDE MENU
      =========================== */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-screen w-full z-50"
          >
            {/* Close Button */}

            <div className="p-6 flex justify-between items-center">
              <h2></h2>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg"
              >
                <X
                  size={34}
                  className="text-white bg-[#0b272b] rounded-full p-2"
                />
              </button>
            </div>

            {/* ===========================
                MENU CONTENT
            =========================== */}

            <div className="flex flex-col md:flex-row h-[calc(100vh-190px)]">

              {/* LEFT LINKS */}

              <div className="flex-1 p-8 flex flex-col justify-center">
                <motion.nav
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="space-y-8"
                >
                  {navLinks.map((link) => (
                    <motion.div key={link.path} variants={item}>
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className="text-7xl font-bold text-white hover:text-gray-300 transition-colors block"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>
              </div>

              {/* RIGHT LOGO */}

              <div className="flex-1 p-8 items-center justify-center hidden md:flex">
                <div className="text-center h-[100vh]">
                  <img
                    src="/roha.png"
                    alt="Roha Logo"
                    className="h-[70%] w-auto mx-auto mt-20"
                  />
                </div>
              </div>
            </div>

            {/* MOBILE LOGO */}

            <div className="md:hidden p-8 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <img src="/roha.png" alt="Roha Logo" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}