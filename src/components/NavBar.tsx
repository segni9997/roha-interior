import { Phone } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const NavigationOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("HOME");
  const navRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "HOME", path: "/" },
    // { name: "ABOUT ME", path: "/about" },
    { name: "Blogs", path: "/allblogs" },
    { name: "Gallery", path: "/gallery" },
    { name: "CONTACT", path: "/contactus" },
    { name: "Model", path: "/model-making" },
    { name: "Interior", path: "/interior" },
  ];

  // Logic to handle scroll and click outside
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("scroll", handleScroll);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={navRef}
      className={`fixed top-0 left-0 w-full overflow-hidden bg-[#fff]/0 backdrop-blur-md transition-all duration-700 ease-in-out border-b border-[#1d424b]/0 z-50 ${
        isOpen ? "h-[60vh] sm:h-[55vh] bg-transparent border-0 " : "h-16 sm:h-20"
      }`}
      onClick={()=>setIsOpen(!isOpen)}
    >
      {/* 1. Top Bar Control */}
      <div className="absolute top-0 w-full flex justify-between items-center p-4 sm:p-6 text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] font-medium text-white uppercase z-20">
        <span className="cursor-default">
          <img src="/roha.png" alt="" className="w-12 h-12 top-1/2" />
        </span>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col items-center gap-1 cursor-pointer group focus:outline-none"
        >
          <div
            className={`h-[1px] bg-[#5b949b] transition-all duration-500 ${
              isOpen ? "w-24 sm:w-14 h-10" : "w-12 sm:w-8 h-10"
            }`}
          ></div>
          <span className="mt-1 text-[7px]  text-[#5b949b] sm:text-[8px] transition-opacity duration-300">
            {isOpen ? "CLOSE" : "MENU"}
          </span>
        </button>

        <Link to="/contact" className="hover:opacity-70 transition-opacity text-[#5b949b] text-lg md:;text-xl">
          <Phone/>
        </Link>
      </div>

      {/* 2. Background Glow */}
      <div
        className={`absolute w-[300px] h-[300px] rounded-full bg-white opacity-10 blur-[100px] pointer-events-none transition-all duration-1000 ${
          isOpen
            ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100"
            : "top-0 scale-0"
        }`}
      />

      {/* 3. Navigation Links */}
      <nav
        className={`relative z-10 h-full py-2 flex flex-col items-center justify-center transition-all duration-500 sm:mt-2 md:mt-8 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => {
              setActiveTab(link.name);
              setIsOpen(false); // Collapse on link click
            }}
            className={`
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter transition-all duration-300 py-1.5 sm:py-2
              ${
                activeTab === link.name
                  ? "text-[#5b949b] scale-110 italic"
                  : "text-[#5b949b]/30 hover:text-[#5b949b]/80"
              }
            `}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* 4. Bottom Decor */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-32 sm:w-48 h-8 sm:h-10 bg-gradient-to-t from-white/10 to-transparent transition-opacity duration-700 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default NavigationOverlay;