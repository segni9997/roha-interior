import bg from "/1.jpg";
import model from "/as.png";
import pattern from "/pattern-01.png";
import rohaLogo from "../assets/roha.png";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Layers, ArrowDown } from "lucide-react";

import { fragmentShader, vertexShader } from "../utils/shaders";
import SubCategoryModelGrid from "./modelMakingProjects";
import { NavigationOverlay } from "./NavBar";
import { FloatingShape, SHAPES } from "./FloatingShapes";

gsap.registerPlugin(ScrollTrigger);

interface Config {
  color: string;
  spread: number;
}

export function ModelHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  /* ===========================
     SHADER SETUP
  ============================ */
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const CONFIG: Config = {
      color: "#ffffff",
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

  const scrollToArchive = () => {
    const el = document.getElementById("models-archive");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <NavigationOverlay />

      <section
        id="main"
        ref={containerRef}
        className="relative min-h-screen w-full bg-[#0d1415] text-white overflow-hidden flex items-center justify-center font-sans"
      >
        {/* 1. Background Visuals & Atmospheric Scrims */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <img
            src={bg}
            alt="Architectural Blueprint Background"
            className="w-full h-full object-cover opacity-20"
          />
          <img
            src={pattern}
            alt="Geometric Pattern"
            className="h-full object-contain absolute opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1415] via-[#0d1415]/80 to-[#0d1415]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1415] via-transparent to-[#0d1415]/75" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,94,99,0.35)_0%,transparent_70%)]" />
        </div>

        {/* Floating 3D Geometric Architectural Shapes */}
        <FloatingShape
          src={SHAPES.cone}
          size={85}
          top="14%"
          left="4%"
          blur="1px"
          opacity={0.4}
          rotate={-15}
          duration={7.5}
        />
        <FloatingShape
          src={SHAPES.cubeAlt2}
          size={95}
          top="22%"
          right="5%"
          blur="2px"
          opacity={0.3}
          rotate={20}
          duration={8.5}
          delay={0.8}
        />
        <FloatingShape
          src={SHAPES.diamond}
          size={60}
          bottom="20%"
          left="6%"
          blur="none"
          opacity={0.35}
          rotate={30}
          duration={6.5}
          delay={1.5}
        />

        {/* 2. CENTERED SHOWCASE IMAGE STARTING FROM THE BOTTOM */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-5xl h-[65vh] sm:h-[75vh] md:h-[84vh] flex items-end justify-center pointer-events-none px-4">
          <motion.img
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            src={model}
            alt="Physical Scale Model Prototype"
            className="w-auto h-full max-h-[84vh] object-contain object-bottom filter drop-shadow-[0_0_60px_rgba(57,94,99,0.45)] select-none"
          />
        </div>

        {/* 3. Hero Content Grid with Big Roha Logo */}
        <div className="relative z-30 max-w-8xl mx-auto px-6 sm:px-12 w-full pt-16 pb-36 min-h-screen flex items-center justify-between pointer-events-none">
          {/* Left Column: Narrative & Headline */}
          <div className="max-w-xl space-y-6 pointer-events-auto">
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#395e63]/40 backdrop-blur-md border border-cyan-400/30 text-cyan-300 text-xs font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.25)]"
            >
              <span>Modeling Making & Precision Fabrication</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.95] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
            >
              PRECISION <br />
              <span className="bg-gradient-to-r from-cyan-400 via-[#5b949b] to-[#395e63] bg-clip-text text-transparent">
                MODELING.
              </span>
            </motion.h1>

            {/* Narrative */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg text-gray-100 font-light leading-relaxed max-w-lg drop-shadow-md border-r-4 border-[#205b63] pr-4 sm:pr-5"
            >
              Translating visionary blueprints into tangible, high-fidelity physical realities. Combining laser micro-cutting, high-resolution stereolithography, and artisanal hand-finishing with 0.1mm tolerance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                type="button"
                onClick={scrollToArchive}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#205b63] to-[#395e63] hover:from-[#2a757f] hover:to-[#49777e] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(32,91,99,0.5)] flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Physical Archive</span>
                <ArrowDown size={16} />
              </button>
            </motion.div>
          </div>

          {/* Right Column: BIG ROHA LOGO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="hidden lg:flex items-center justify-center p-6 relative pointer-events-none"
          >
            <div className="absolute inset-0 bg-cyan-500/10 rounded-full filter blur-3xl transform scale-90" />
            <img
              src={rohaLogo}
              alt="ROHA Architectural Emblem"
              className="w-72 h-72 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] object-contain filter drop-shadow-[0_0_50px_rgba(57,94,99,0.5)] opacity-90 hover:opacity-100 transition-all duration-700 select-none"
            />
          </motion.div>
        </div>

        {/* 4. Bottom Glassmorphic Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-0 inset-x-0 z-40 bg-black/60 backdrop-blur-xl border-t border-white/10 px-6 sm:px-12 py-5"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Layers className="text-cyan-400" size={24} />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Physical Scale Models
                </h4>
                <p className="text-xs text-gray-400">
                  Urban Masterplans, Towers & Industrial Facilities
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8 sm:gap-16">
              <div className="text-center md:text-left">
                <span className="text-2xl sm:text-3xl font-black text-white">08</span>
                <span className="text-xs font-mono text-cyan-400 ml-1">YRS</span>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Experience
                </p>
              </div>
              <div className="text-center md:text-left">
                <span className="text-2xl sm:text-3xl font-black text-white">500+</span>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Physical Models
                </p>
              </div>
              <div className="text-center md:text-left">
                <span className="text-2xl sm:text-3xl font-black text-white">1:50</span>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Max Fidelity
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [-20, -120], opacity: [0, 1, 0] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-50"
        />
      </section>

      {/* Filterable Model Projects Grid */}
      <div id="models-archive">
        <SubCategoryModelGrid />
      </div>
    </>
  );
}

export default ModelHero;
