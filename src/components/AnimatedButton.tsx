import React from 'react';
import { Link } from 'react-router-dom';
import "../assets/css/style.css"

interface AnimatedButtonProps {
  to: string;
  children: React.ReactNode;
  primaryColor?: string; // Default: #149CEA
  containerBg?: string; // Default: #212121 (Matches the "cut" effect)
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  to,
  children,
  primaryColor = '#149CEA',
  containerBg = '#212121',
  className = '',
}) => {
  return (
    <Link
      to={to}
      className={className}
    >
      <button
        style={{
          backgroundColor: containerBg,
          color: primaryColor,
        }}
      >
        {children}
      </button>
    </Link>
  );
};

export default AnimatedButton;