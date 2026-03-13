import { Link } from "react-router-dom";

export function NavigationOverlay() {
  // const navLinks = ['HOME', 'ABOUT US', 'SERVICES', 'PROJECTS', 'CONTACT'];
    const navLinks = [
    { name: "Home", path: "/" },
    // { name: "ABOUT ME", path: "/about" },
    { name: "Blogs", path: "/allblogs" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contactus" },
    { name: "Model", path: "/model-making" },
    { name: "Interior", path: "/interior" },
  ];

  return (
    <nav className="fixed top-2 right-0  w-fit z-50 bg-gradient-to-r rounded-l-3xl from-[#162e31] via-[#395e63] to-[#305B63]">
      <div className="flex justify-end  items-center px-4 py-2">
        <div className="flex gap-10">
          {navLinks.map((link) => (
            <Link to={link.path}
            key={link.path}
              className="text-white font-bold text-lg tracking-wide hover:opacity-80 transition-opacity duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}