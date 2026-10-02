import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { Sparkles, ArrowUpRight, Compass } from "lucide-react";

import pattern from "/pattern-01.png";
import hero from "/roha.png";
import { fragmentShader, vertexShader } from "../utils/shaders";

gsap.registerPlugin(ScrollTrigger);

interface Config {
  color: string;
  spread: number;
}

const Hero = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  /* ===========================
     SHADER SETUP
  ============================ */
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const CONFIG: Config = {
      color: "#f5f7f7",
      spread: 0.55,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return new THREE.Vector3(r, g, b);
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uColor: { value: hexToRgb(CONFIG.color) },
        uSpread: { value: CONFIG.spread },
      },
    });

    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    };

    resize();
    window.addEventListener("resize", resize);

    let rafId: number;
    const render = () => {
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(render);
    };
    render();

    const tween = gsap.to(material.uniforms.uProgress, {
      value: 1.2,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
      tween.kill();
      tween.scrollTrigger?.kill();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  /* ===========================
     JSX
  ============================ */
  return (
    <section ref={containerRef} className="relative min-h-[140vh] bg-black font-sans selection:bg-[#395e63] selection:text-white">
      <div className="sticky top-0 min-h-screen overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/rohabg.mp4" type="video/mp4" />
        </video>

        {/* Eye-Catching Multi-Layer Cinematic Scrim & Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/75 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(32,91,99,0.35)_0%,transparent_75%)] z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.6)_0%,transparent_50%,rgba(0,0,0,0.6)_100%)] z-10 pointer-events-none" />

        {/* Architectural HUD Viewfinder Brackets */}
        <div className="absolute top-8 left-8 z-20 hidden md:block text-cyan-500/50 font-mono text-[10px] tracking-widest pointer-events-none">
          <div className="border-t-2 border-l-2 border-cyan-400/40 w-8 h-8 mb-1" />
          <span>ROHA // SYS.01</span>
        </div>
        <div className="absolute top-8 right-8 z-20 hidden md:block text-cyan-500/50 font-mono text-[10px] tracking-widest text-right pointer-events-none">
          <div className="border-t-2 border-r-2 border-cyan-400/40 w-8 h-8 ml-auto mb-1" />
          <span>EST. ADDIS ABABA</span>
        </div>
        <div className="absolute bottom-8 left-8 z-20 hidden md:block text-cyan-500/50 font-mono text-[10px] tracking-widest pointer-events-none">
          <span>LAT: 9.0320° N // LON: 38.7483° E</span>
          <div className="border-b-2 border-l-2 border-cyan-400/40 w-8 h-8 mt-1" />
        </div>
        <div className="absolute bottom-8 right-8 z-20 hidden md:block text-cyan-500/50 font-mono text-[10px] tracking-widest text-right pointer-events-none">
          <span>HIGH-FIDELITY SPATIAL DESIGN</span>
          <div className="border-b-2 border-r-2 border-cyan-400/40 w-8 h-8 ml-auto mt-1" />
        </div>

        {/* Pattern & Emblem Decor */}
        <div className="absolute md:bottom-8 top-16 right-0 z-20 p-2 pointer-events-none opacity-80">
          <img src={hero} alt="pattern" className="w-56 h-56 md:w-80 md:h-80 md:ml-8 mx-auto object-contain filter drop-shadow-[0_0_30px_rgba(57,94,99,0.4)]" />
          <img src={pattern} alt="pattern" className="w-full md:scale-105 h-12 md:h-fit ml-6 md:ml-0 opacity-60" />
        </div>

        {/* SHADER CANVAS (Destroyer Layer) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* HERO CONTENT */}
        <div className="relative z-20 flex flex-col justify-center items-start min-h-screen px-6 sm:px-12 md:px-20 max-w-7xl mx-auto">
          {/* Glowing Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
          >
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-semibold tracking-widest text-cyan-200 uppercase">
              Architectural Design & Modeling Making
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6 max-w-7xl uppercase"
          >
            ROHA <br />
            <span className="bg-gradient-to-r from-cyan-300 via-[#5b949b] to-[#395e63] bg-clip-text text-transparent">
              ARCHITECTURAL DESIGN & MODELING MAKING
            </span>
          </motion.h1>

          {/* Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-base sm:text-xl text-gray-200 font-light max-w-2xl mb-8 leading-relaxed drop-shadow-md border-r-4 border-[#205b63] pr-4 sm:pr-6"
          >
            Sculpting physical scale models, bespoke architectural design environments, and immersive 360° virtual reality tours with master precision.
          </motion.p>

          {/* Interactive CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              to="/gallery"
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#205b63] to-[#395e63] hover:from-[#2a757f] hover:to-[#49777e] text-white font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(32,91,99,0.5)] flex items-center gap-2 group"
            >
              <Compass size={16} className="group-hover:rotate-45 transition-transform" />
              <span>Explore 360° Tours</span>
            </Link>

            <Link
              to="/interior"
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm tracking-wider uppercase backdrop-blur-md border border-white/20 transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Our Portfolio</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* FLOATING PARTICLES & RISING 3D SHAPES */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {/* Cyan Rising Drops */}
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={`drop-${i}`}
              className="absolute w-2 h-2 bg-cyan-400/70 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              style={{
                left: `${(i * 4.1 + 3) % 96}%`,
                top: `${(i * 7.3 + 10) % 90}%`,
              }}
              animate={{ y: [-10, -180], opacity: [0, 0.9, 0] }}
              transition={{
                duration: 3 + (i % 4) * 0.8,
                repeat: Infinity,
                delay: (i % 5) * 0.6,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* 3D Geometric Architectural Shapes Going Up Like The Drops */}
          {[
            { src: '/diamond_3d_shape.png', size: 65, left: '8%', top: '80%', blur: '1px', opacity: 0.45, rotate: 15, duration: 6.5, delay: 0 },
            { src: '/cube_3d_shape.png', size: 80, left: '22%', top: '88%', blur: 'none', opacity: 0.35, rotate: -25, duration: 7.5, delay: 1.2 },
            { src: '/cone_3d_shape.png', size: 90, left: '38%', top: '85%', blur: '2px', opacity: 0.4, rotate: 30, duration: 8.5, delay: 0.5 },
            { src: '/cylinder_3d_shape.png', size: 55, left: '56%', top: '82%', blur: 'none', opacity: 0.35, rotate: -15, duration: 7, delay: 1.8 },
            { src: '/cube_3d_shape (1).png', size: 70, left: '72%', top: '86%', blur: '1px', opacity: 0.35, rotate: 20, duration: 8, delay: 0.9 },
            { src: '/cube_3d_shape (2).png', size: 100, left: '88%', top: '80%', blur: '3px', opacity: 0.3, rotate: -35, duration: 9, delay: 2.2 },
            { src: '/diamond_3d_shape.png', size: 45, left: '48%', top: '75%', blur: 'none', opacity: 0.4, rotate: 45, duration: 6, delay: 1.5 },
            { src: '/cone_3d_shape.png', size: 60, left: '80%', top: '70%', blur: '2px', opacity: 0.35, rotate: -10, duration: 7.8, delay: 2.8 },
          ].map((shape, idx) => (
            <motion.div
              key={`shape-rise-${idx}`}
              className="absolute pointer-events-none select-none"
              style={{
                left: shape.left,
                top: shape.top,
                width: shape.size,
                height: shape.size,
                filter: shape.blur === 'none' ? undefined : `blur(${shape.blur})`,
                opacity: shape.opacity,
              }}
              animate={{
                y: [40, -220, -320],
                rotate: [shape.rotate - 10, shape.rotate + 15, shape.rotate - 5],
                opacity: [0, shape.opacity, 0],
              }}
              transition={{
                duration: shape.duration,
                repeat: Infinity,
                delay: shape.delay,
                ease: "easeInOut",
              }}
            >
              <img
                src={shape.src}
                alt=""
                className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
