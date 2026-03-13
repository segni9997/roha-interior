import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function NavigationOverlay() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/allblogs" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contactus" },
    { name: "Model", path: "/model-making" },
    { name: "Interior", path: "/interior" },
  ];

  return (
    <nav className="fixed md:top-2 top-0 right-0 z-50 bg-gradient-to-r md:rounded-l-3xl w-fit rounded-bl-3xl from-[#162e31] via-[#395e63] to-[#305B63] shadow-lg">
      
      <div className="flex items-center justify-end   px-4 py-2">

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-white font-bold text-lg tracking-wide 
              hover:opacity-80 transition-all duration-300 ease-in-out 
              hover:scale-105"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white transition-transform duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
         <div className="flex flex-row space-x-2.5">
            <img src="/roha.png" className="w-8 h-8" alt="" />  {isOpen ? <X size={28} /> : <Menu size={28} />}
         </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden flex flex-col items-end gap-4 px-6 overflow-hidden
        transition-all duration-500 ease-in-out
        ${
          isOpen
            ? "max-h-96 opacity-100 translate-y-0 pb-4"
            : "max-h-0 opacity-0 -translate-y-4"
        }`}
      >
        {navLinks.map((link, index) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className="text-white font-semibold text-base
            transition-all duration-300 hover:translate-x-1 hover:opacity-80"
            style={{
              transitionDelay: `${index * 70}ms`,
            }}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}