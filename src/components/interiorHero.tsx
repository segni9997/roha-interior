import { useState, useEffect, useRef } from "react";
import {
  Armchair,
  Star,
  Shield,
  Play,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

import { fragmentShader, vertexShader } from "../utils/shaders";
import SubCategoryInteriorGrid from "./interiorProjects";
import { NavigationOverlay } from "./NavBar";
import { FloatingShape, SHAPES } from "./FloatingShapes";
import { api, resolveImageUrl, type PageSectionItem } from "../services/api";

gsap.registerPlugin(ScrollTrigger);

interface Config {
  color: string;
  spread: number;
}

const DEFAULT_HERO = {
  heading: "Art That Transforms Spaces",
  subheading: "",
  body_text:
    "Premium 3D wall art and bespoke architectural interior designs that bring life, elegance, and creativity to your spaces.",
  background_image: "/tr/279A1756.JPG",
  cta_text: "Explore Collection",
  cta_link: "#interior-archive",
};

export function InteriorHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [heroData, setHeroData] = useState<PageSectionItem | typeof DEFAULT_HERO>(DEFAULT_HERO);
  const [loading, setLoading] = useState(false);

  // Load customizable hero section from backend
  useEffect(() => {
    let isMounted = true;
    async function loadHeroContent() {
      try {
        setLoading(true);
        const pageData = await api.getPageContent("interior").catch(() => null);
        if (isMounted && pageData && pageData.sections && pageData.sections.length > 0) {
          const heroSec = pageData.sections.find((s) => s.section_key === "hero") || pageData.sections[0];
          if (heroSec) {
            setHeroData({
              heading: heroSec.heading || DEFAULT_HERO.heading,
              subheading: heroSec.subheading && heroSec.subheading !== "Elevate Your Space" ? heroSec.subheading : "",
              body_text: heroSec.body_text || DEFAULT_HERO.body_text,
              background_image: heroSec.background_image || DEFAULT_HERO.background_image,
              cta_text: heroSec.cta_text || DEFAULT_HERO.cta_text,
              cta_link: heroSec.cta_link || DEFAULT_HERO.cta_link,
              id: heroSec.id,
              section_key: heroSec.section_key,
              order: heroSec.order,
            });
          }
        }
      } catch (e) {
        console.error("Could not load backend interior hero section", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadHeroContent();
    return () => {
      isMounted = false;
    };
  }, []);

  /* ===========================
     SHADER SETUP (MATCHING MODEL MAKING)
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

  const handleCtaClick = () => {
    if (heroData.cta_link && heroData.cta_link.startsWith("#")) {
      const targetId = heroData.cta_link.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    const el = document.getElementById("interior-archive");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderHeading = (text: string) => {
    if (!text || text === DEFAULT_HERO.heading) {
      return (
        <>
          <span className="block font-serif text-white">Art That</span>
          <span className="block font-serif text-white/90 italic font-light drop-shadow-[0_0_30px_rgba(255,255,255,0.35)]">
            Transforms
          </span>
          <span className="block font-serif text-white">Spaces</span>
        </>
      );
    }
    const words = text.trim().split(" ");
    if (words.length >= 3) {
      const midIndex = Math.floor(words.length / 2);
      const firstPart = words.slice(0, midIndex).join(" ");
      const midWord = words[midIndex];
      const lastPart = words.slice(midIndex + 1).join(" ");
      return (
        <>
          <span className="block font-serif text-white">{firstPart}</span>
          <span className="block font-serif text-white/90 italic font-light drop-shadow-[0_0_30px_rgba(255,255,255,0.35)]">
            {midWord}
          </span>
          <span className="block font-serif text-white">{lastPart}</span>
        </>
      );
    }
    return <span className="block font-serif text-white">{text}</span>;
  };

  const bgImageSrc = resolveImageUrl(heroData.background_image, DEFAULT_HERO.background_image);
  const showCustomSubheading = Boolean(heroData.subheading && heroData.subheading.trim() && heroData.subheading.trim() !== "Elevate Your Space");

  return (
    <>
      <NavigationOverlay />

      {/* -------------------- FULL SCREEN HERO SECTION (SINGLE CUSTOMIZABLE IMAGE) -------------------- */}
      <section
        ref={containerRef}
        className="relative min-h-screen w-full bg-[#0b1718] overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-12 px-6 sm:px-12 lg:px-20"
      >
        {/* ========================================================================= */}
        {/* 1. FULL-BLEED SCREEN-FILLING HERO IMAGE BACKGROUND                        */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {loading ? (
            <div className="w-full h-full bg-[#0d1e20] flex items-center justify-center">
              <Loader2 size={40} className="animate-spin text-white" />
            </div>
          ) : (
            <img
              src={bgImageSrc}
              alt={heroData.heading || "Architectural Interior Scene"}
              className="w-full h-full object-cover object-center scale-100 transition-all duration-1000 ease-out"
            />
          )}

          {/* Color Scrim Layers (Whitish Lighting & Deep Architectural Shadows) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1718]/95 via-[#172a2b]/80 md:via-[#172a2b]/60 to-[#0b1718]/30 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1718] via-transparent to-[#0b1718]/85 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-white/[0.08] via-transparent to-transparent z-10 pointer-events-none" />
        </div>

        {/* Floating 3D Geometric Architectural Shapes (Matching Model Making Page) */}
        <FloatingShape
          src={SHAPES.cone}
          size={85}
          top="14%"
          left="4%"
          blur="1px"
          opacity={0.35}
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
          bottom="24%"
          left="6%"
          blur="none"
          opacity={0.35}
          rotate={30}
          duration={6.5}
          delay={1.5}
        />

        {/* ========================================================================= */}
        {/* 2. ARCHITECTURAL WHITISH LIGHTING & ROOM ACCENTS (Z-INDEX 20)             */}
        {/* ========================================================================= */}
        {/* Ceiling Recessed Spotlights (Crisp Whitish Downward Beams) */}
        <div className="absolute top-0 inset-x-0 flex justify-around pointer-events-none z-20">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-5 h-1.5 bg-white/95 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.95),0_0_8px_rgba(255,255,255,1)]" />
              <div className="w-36 sm:w-56 h-64 sm:h-84 bg-gradient-to-b from-white/35 via-white/10 to-transparent blur-2xl transform -translate-y-2" />
            </div>
          ))}
        </div>

        {/* Left Architectural Slat Wall Paneling Texture */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 pointer-events-none opacity-25 z-20 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.12)_0px,rgba(255,255,255,0.12)_10px,transparent_10px,transparent_22px)] border-r border-white/15" />

        {/* Ambient Pendant Luminaire with Soft Pure White Glow (Far Left) */}
        <div className="absolute top-0 left-6 sm:left-12 flex flex-col items-center pointer-events-none z-20">
          <div className="w-0.5 h-20 sm:h-28 bg-gradient-to-b from-white/40 to-white/80" />
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/35 blur-md absolute animate-pulse" />
            <div className="w-6 h-8 rounded-full border border-white/80 bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.9),0_0_10px_rgba(255,255,255,1)]">
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
            </div>
          </div>
        </div>

        {/* Right Floating Shelves with Whitish LED Underglow */}
        <div className="hidden lg:flex flex-col gap-14 absolute right-8 sm:right-14 top-24 pointer-events-none z-20 w-44">
          <div className="relative w-full h-2.5 bg-black/70 backdrop-blur-md rounded-sm border-t border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-x-0 -bottom-3 h-4 bg-white/25 blur-md" />
            <div className="absolute -top-7 right-4 flex items-end gap-2 opacity-90">
              <div className="w-4 h-6 rounded-t-lg bg-emerald-900/80 border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
            </div>
          </div>
          <div className="relative w-full h-2.5 bg-black/70 backdrop-blur-md rounded-sm border-t border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-x-0 -bottom-3 h-4 bg-white/25 blur-md" />
            <div className="absolute -top-6 right-8 flex items-end gap-1.5 opacity-85">
              <div className="w-3.5 h-5 rounded-sm bg-slate-800/80 border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.15)]" />
            </div>
          </div>
          <div className="relative w-full h-2.5 bg-black/70 backdrop-blur-md rounded-sm border-t border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-x-0 -bottom-3 h-4 bg-white/25 blur-md" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MAIN FOREGROUND CONTENT (WITH MODEL-MAKING MOTION ANIMATIONS)          */}
        {/* ========================================================================= */}
        <div className="relative z-30 max-w-7xl mx-auto w-full my-auto flex flex-col items-start justify-center">
          <div className="max-w-2xl space-y-5 sm:space-y-6">
            
            {/* Pill Badge (Optional custom subheading only, without pulse, Elevate Your Space & Roha studio removed) */}
            {showCustomSubheading && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 shadow-[0_0_20px_rgba(255,255,255,0.15)] text-xs font-mono uppercase tracking-widest text-white"
              >
                {/* Pulse dot commented out as requested */}
                {/* <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_8px_#ffffff]" />
                </span> */}
                <span>{heroData.subheading}</span>
              </motion.div>
            )}

            {/* Grand Editorial Headline with Motion (Matching Model Making Stagger) */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]"
            >
              {renderHeading(heroData.heading)}
            </motion.h1>

            {/* Narrative Subtitle / Description with Motion */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg text-slate-100/95 max-w-xl leading-relaxed font-sans drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
            >
              {heroData.body_text || DEFAULT_HERO.body_text}
            </motion.p>

            {/* Call To Action Buttons (Explore Collection + Watch Video) with Motion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {/* Primary CTA: Crisp White Luxury Pill Button */}
              <button
                type="button"
                onClick={handleCtaClick}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs sm:text-sm font-bold uppercase tracking-wider border border-white shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:shadow-[0_0_35px_rgba(255,255,255,0.55)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <span>{heroData.cta_text || "Explore Collection"}</span>
                <ArrowRight
                  size={16}
                  className="text-slate-950 group-hover:translate-x-1.5 transition-transform"
                />
              </button>

              {/* Secondary CTA: Translucent Glass Button with Play Icon */}
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold tracking-wide border border-white/30 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  <Play size={11} className="fill-current ml-0.5 text-slate-950" />
                </div>
                <span>Watch Video</span>
              </button>
            </motion.div>

            {/* FLOATING STATS CARD (Blackish background removed, with Motion) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-8 sm:mt-10 bg-transparent border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-6 w-full max-w-lg backdrop-blur-xs"
            >
              {/* Stat 1: 500+ Unique Designs */}
              <div className="flex flex-col items-start gap-1 pr-3 sm:pr-5 border-r border-white/15 flex-1">
                <div className="flex items-center gap-1.5 text-white">
                  <Armchair size={18} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight">
                  500+
                </div>
                <div className="text-[10px] sm:text-xs text-slate-200 font-sans tracking-wide">
                  Unique Designs
                </div>
              </div>

              {/* Stat 2: 98% Customer Satisfaction */}
              <div className="flex flex-col items-start gap-1 px-3 sm:px-5 border-r border-white/15 flex-1">
                <div className="flex items-center gap-1.5 text-white">
                  <Star size={18} className="fill-white/30 drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight">
                  98%
                </div>
                <div className="text-[10px] sm:text-xs text-slate-200 font-sans tracking-wide">
                  Customer Satisfaction
                </div>
              </div>

              {/* Stat 3: 5 Years Premium Quality */}
              <div className="flex flex-col items-start gap-1 pl-3 sm:pl-5 flex-1">
                <div className="flex items-center gap-1.5 text-white">
                  <Shield size={18} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight">
                  5 Years
                </div>
                <div className="text-[10px] sm:text-xs text-slate-200 font-sans tracking-wide">
                  Premium Quality
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Floating Particles (Matching Model Making Page) */}
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

        {/* Three.js Shader Canvas Layer (Matching Model Making Page) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-50"
        />
      </section>

      {/* ========================================================================= */}
      {/* 4. CINEMATIC VIDEO LIGHTBOX MODAL (Z-INDEX 50)                            */}
      {/* ========================================================================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-8 animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-[#112224] rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
              <div className="flex items-center gap-2">
                <Play size={16} className="text-white fill-white" />
                <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white font-bold">
                  ROHA Architectural Interior Documentation
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <video
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
                src="/web roha.mp4"
              />
            </div>
          </div>
        </div>
      )}

      {/* Filterable Interior Grid */}
      <div id="interior-archive">
        <SubCategoryInteriorGrid />
      </div>
    </>
  );
}

export default InteriorHero;
