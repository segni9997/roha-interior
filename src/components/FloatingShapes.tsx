import React from 'react';
import { motion } from 'framer-motion';

export interface FloatingShapeConfig {
  src: string;
  className?: string;
  size?: number; // size in px
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  blur?: 'none' | 'sm' | 'md' | 'lg' | '1px' | '2px' | '3px';
  opacity?: number;
  rotate?: number;
  delay?: number;
  duration?: number;
  floatDistance?: number;
  zIndex?: number;
}

export const SHAPES = {
  cone: '/cone_3d_shape.png',
  cube: '/cube_3d_shape.png',
  cubeAlt1: '/cube_3d_shape (1).png',
  cubeAlt2: '/cube_3d_shape (2).png',
  cylinder: '/cylinder_3d_shape.png',
  diamond: '/diamond_3d_shape.png',
};

const getBlurStyle = (blur?: string) => {
  switch (blur) {
    case '1px':
      return { filter: 'blur(1px)' };
    case '2px':
      return { filter: 'blur(2px)' };
    case '3px':
      return { filter: 'blur(3px)' };
    case 'sm':
      return { filter: 'blur(4px)' };
    case 'md':
      return { filter: 'blur(8px)' };
    case 'lg':
      return { filter: 'blur(12px)' };
    case 'none':
    default:
      return {};
  }
};

export const FloatingShape: React.FC<FloatingShapeConfig> = ({
  src,
  className = '',
  size = 64,
  top,
  bottom,
  left,
  right,
  blur = 'none',
  opacity = 0.6,
  rotate = 0,
  delay = 0,
  duration = 6,
  floatDistance = 14,
  zIndex = 10,
}) => {
  const blurStyle = getBlurStyle(blur);

  return (
    <motion.div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none ${className}`}
      style={{
        top,
        bottom,
        left,
        right,
        width: size,
        height: size,
        zIndex,
        opacity,
        ...blurStyle,
      }}
      initial={{ y: 0, rotate }}
      animate={{
        y: [-floatDistance, floatDistance, -floatDistance],
        rotate: [rotate - 4, rotate + 4, rotate - 4],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay,
      }}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)]"
        loading="lazy"
      />
    </motion.div>
  );
};

export const FloatingShapesGroup: React.FC<{
  variant?: 'footer' | 'hero' | 'categories' | 'blog' | 'projectDetail' | 'clients';
  className?: string;
}> = ({ variant = 'hero', className = '' }) => {
  if (variant === 'footer') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden z-10 ${className}`}>
        <FloatingShape
          src={SHAPES.diamond}
          size={84}
          top="8%"
          left="4%"
          blur="1px"
          opacity={0.45}
          rotate={-15}
          duration={7}
          delay={0}
        />
        <FloatingShape
          src={SHAPES.cubeAlt1}
          size={60}
          top="45%"
          left="2%"
          blur="none"
          opacity={0.35}
          rotate={20}
          duration={8.5}
          delay={1.2}
        />
        <FloatingShape
          src={SHAPES.cone}
          size={96}
          top="15%"
          right="4%"
          blur="2px"
          opacity={0.4}
          rotate={12}
          duration={9}
          delay={0.5}
        />
        <FloatingShape
          src={SHAPES.cylinder}
          size={55}
          bottom="22%"
          right="8%"
          blur="none"
          opacity={0.35}
          rotate={-25}
          duration={6.5}
          delay={1.8}
        />
        <FloatingShape
          src={SHAPES.cubeAlt2}
          size={110}
          bottom="10%"
          left="15%"
          blur="3px"
          opacity={0.25}
          rotate={40}
          duration={11}
          delay={2}
        />
      </div>
    );
  }

  if (variant === 'categories') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden z-10 ${className}`}>
        <FloatingShape
          src={SHAPES.cube}
          size={75}
          top="6%"
          left="3%"
          blur="none"
          opacity={0.35}
          rotate={15}
          duration={8}
        />
        <FloatingShape
          src={SHAPES.cone}
          size={110}
          top="18%"
          right="3%"
          blur="2px"
          opacity={0.3}
          rotate={-20}
          duration={9.5}
          delay={1}
        />
        <FloatingShape
          src={SHAPES.diamond}
          size={65}
          bottom="8%"
          left="6%"
          blur="1px"
          opacity={0.4}
          rotate={35}
          duration={7.5}
          delay={0.8}
        />
        <FloatingShape
          src={SHAPES.cylinder}
          size={80}
          bottom="12%"
          right="5%"
          blur="none"
          opacity={0.35}
          rotate={-10}
          duration={8.5}
          delay={1.5}
        />
      </div>
    );
  }

  if (variant === 'blog') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden z-10 ${className}`}>
        <FloatingShape
          src={SHAPES.diamond}
          size={70}
          top="4%"
          right="6%"
          blur="1px"
          opacity={0.35}
          rotate={22}
          duration={7}
        />
        <FloatingShape
          src={SHAPES.cubeAlt1}
          size={85}
          top="30%"
          left="1%"
          blur="2px"
          opacity={0.25}
          rotate={-30}
          duration={9}
          delay={1.2}
        />
        <FloatingShape
          src={SHAPES.cone}
          size={55}
          bottom="15%"
          right="3%"
          blur="none"
          opacity={0.3}
          rotate={15}
          duration={6.5}
          delay={0.6}
        />
      </div>
    );
  }

  if (variant === 'projectDetail') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden z-10 ${className}`}>
        <FloatingShape
          src={SHAPES.cubeAlt2}
          size={90}
          top="12%"
          left="4%"
          blur="1px"
          opacity={0.35}
          rotate={-18}
          duration={8.5}
        />
        <FloatingShape
          src={SHAPES.diamond}
          size={60}
          top="20%"
          right="5%"
          blur="none"
          opacity={0.4}
          rotate={28}
          duration={6.5}
          delay={0.9}
        />
        <FloatingShape
          src={SHAPES.cylinder}
          size={100}
          bottom="10%"
          right="4%"
          blur="3px"
          opacity={0.25}
          rotate={-12}
          duration={10}
          delay={1.4}
        />
      </div>
    );
  }

  if (variant === 'clients') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden z-10 ${className}`}>
        <FloatingShape
          src={SHAPES.cylinder}
          size={70}
          top="8%"
          left="2%"
          blur="1px"
          opacity={0.3}
          rotate={15}
          duration={7.5}
        />
        <FloatingShape
          src={SHAPES.cone}
          size={60}
          top="15%"
          right="2%"
          blur="none"
          opacity={0.35}
          rotate={-20}
          duration={8}
          delay={1}
        />
        <FloatingShape
          src={SHAPES.cube}
          size={95}
          bottom="6%"
          right="6%"
          blur="2px"
          opacity={0.25}
          rotate={30}
          duration={9.5}
          delay={1.5}
        />
      </div>
    );
  }

  // Default: Hero
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-10 ${className}`}>
      <FloatingShape
        src={SHAPES.diamond}
        size={85}
        top="14%"
        left="5%"
        blur="1px"
        opacity={0.4}
        rotate={18}
        duration={7}
      />
      <FloatingShape
        src={SHAPES.cone}
        size={95}
        top="22%"
        right="6%"
        blur="none"
        opacity={0.4}
        rotate={-15}
        duration={8.5}
        delay={0.8}
      />
      <FloatingShape
        src={SHAPES.cube}
        size={65}
        bottom="16%"
        left="8%"
        blur="2px"
        opacity={0.35}
        rotate={25}
        duration={6.5}
        delay={1.6}
      />
      <FloatingShape
        src={SHAPES.cylinder}
        size={75}
        bottom="12%"
        right="8%"
        blur="none"
        opacity={0.35}
        rotate={-30}
        duration={9}
        delay={2.1}
      />
    </div>
  );
};
