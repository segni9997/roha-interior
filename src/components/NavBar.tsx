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
      className={`fixed top-0 left-0 w-full overflow-hidden bg-[#1d424b]/10 backdrop-blur-md transition-all duration-700 ease-in-out border-b border-[#1d424b]/10 z-50 ${
        isOpen ? "h-[50vh]" : "h-20"
      }`}
      onClick={()=>setIsOpen(!isOpen)}
    >
      {/* 1. Top Bar Control */}
      <div className="absolute top-0 w-full flex justify-between items-center p-6 text-[10px] tracking-[0.3em] font-medium text-white uppercase z-20">
        <span className="cursor-default">ROHA</span>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col items-center gap-1 cursor-pointer group focus:outline-none"
        >
          <div
            className={`h-[1px] bg-white transition-all duration-500 ${
              isOpen ? "w-14" : "w-8"
            }`}
          ></div>
          <span className="mt-1 text-[8px] transition-opacity duration-300">
            {isOpen ? "CLOSE" : "MENU"}
          </span>
        </button>

        <Link to="/contact" className="hover:opacity-70 transition-opacity">
          CONTACT
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
        className={`relative z-10 h-full flex flex-col items-center justify-center transition-all duration-500 md:mt-4 ${
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
              text-4xl md:text-5xl font-extrabold tracking-tighter transition-all duration-300 py-2
              ${
                activeTab === link.name
                  ? "text-white scale-110 italic"
                  : "text-white/30 hover:text-white/80"
              }
            `}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* 4. Bottom Decor */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-10 bg-gradient-to-t from-white/10 to-transparent transition-opacity duration-700 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default NavigationOverlay;