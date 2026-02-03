import React, { useState } from "react";
import shape1 from "/cube_3d_shape (1).png";
import shape2 from "/cube_3d_shape (2).png";
import shape3 from "/cylinder_3d_shape.png";

type GeoButtonProps = {
  label?: string;
  fontweight?: string;
  isuppercase?: string;
  from?: string; // Expecting hex without # (e.g., "fffeee")
  to?: string;   // Expecting hex without # (e.g., "ffffff")
  textColor?: string; // Expecting full hex (e.g., "#ffffff")
};

const GeoButton: React.FC<GeoButtonProps> = ({
  label = "Start a Project",
  fontweight = "font-bold",
  isuppercase = "uppercase",
  from = "ffffff", // Default white
  to = "06b6d4",   // Default Cyan
  textColor = "#172a2b",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Constructing styles for the background
  const buttonStyle = {
    backgroundColor: `linear-gradient(to top, #${from}, #${to})` ,
    backgroundImage: isHovered 
      ? `linear-gradient(to top, #${from}, #${to})` 
      : "none",
    color: isHovered ? to : textColor,

  };

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={buttonStyle}
      className={`relative group cursor-pointer h-16 min-w-48 max-w-64 w-fil flex justify-center items-center border-dashed rounded-2xl transition-all duration-300  overflow-hidden p-1 shadow-lg`}
    >
      {/* Shapes coming from corners */}
     <div className="absolute w-40 h-40 top-0 left-0 z-10 transform -translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
        <img src={shape1} alt="shape1" />
      </div>

      <div className="absolute w-32 h-32 bottom-0 right-0 z-10 transform translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
        <img src={shape3} alt="shape3" />
      </div>

      <div className="absolute w-24 h-24 top-0 right-0 z-10 transform translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
        <img src={shape3} alt="shape3-2" />
      </div>

      <div className="absolute w-16 h-16 bottom-0 left-0 z-10 transform -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
        <img src={shape2} alt="shape2" />
      </div>

      {/* Button label with scaling */}
      <p className={`z-10 transition-transform duration-500 group-hover:scale-110 ${fontweight} ${isuppercase}`}>
        {label}
      </p>
    </button>
  );
};

export default GeoButton;