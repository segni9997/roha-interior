import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Armchair,
  Star,
  Shield,
  Loader2,
  Play,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ParallaxGrid, { type ParallaxGridItem } from "./ParallaxGrid";
import Footer from "./Footer";
import { NavigationOverlay } from "./NavBar";
import { renderSuperscriptText } from "../utils/formatters";
import {
  api,
  resolveImageUrl,
  type InteriorProjectDetailItem,
} from "../services/api";

gsap.registerPlugin(ScrollTrigger);

export function InteriorProjectDetails() {
  const [searchParams] = useSearchParams();
  const projectIdParam = searchParams.get("id");

  const [project, setProject] = useState<InteriorProjectDetailItem | null>(null);
  const [parallaxImages, setParallaxImages] = useState<ParallaxGridItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const heroSectionRef = useRef<HTMLDivElement | null>(null);

  /* ===========================
     FETCH INTERIOR PROJECT DATA
  ============================ */
  useEffect(() => {
    let isMounted = true;

    async function fetchProjectData() {
      try {
        setLoading(true);
        let current: InteriorProjectDetailItem | null = null;
        const allInteriors = await api.getInteriorProjects().catch(() => []);

        if (projectIdParam) {
          current = await api.getInteriorProject(Number(projectIdParam)).catch(() => null);
        }
        if (!current && allInteriors.length > 0) {
          current = await api.getInteriorProject(allInteriors[0].id).catch(() => null);
        }

        if (isMounted && current) {
          setProject(current);

          const items: ParallaxGridItem[] = [];
          if (current.gallery_images && current.gallery_images.length > 0) {
            current.gallery_images.forEach((g) => {
              items.push({
                id: g.id,
                title: g.caption ? g.caption.trim() : "",
                subtitle: g.subtitle ? g.subtitle.trim() : "",
                image: resolveImageUrl(g.image),
              });
            });
          } else if (current.cover_image) {
            items.push({
              id: `interior-${current.id}`,
              title: "",
              subtitle: "",
              image: resolveImageUrl(current.cover_image),
            });
          }

          setParallaxImages(items);
        }
      } catch (err) {
        console.error("Failed to load interior project details from backend", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProjectData();

    return () => {
      isMounted = false;
    };
  }, [projectIdParam]);

  const heroImageSrc = resolveImageUrl(project?.cover_image, "/home1.png");
  const resolvedLogo = resolveImageUrl(project?.company_logo, "/roha.png");
  const clientName =
    (project as any)?.specifications?.client ||
    (project as any)?.client ||
    (project?.company_logo ? "Enterprise Partner" : "ROHA Studio");

  // Construct slider images array from gallery or fallback cover images
  const sliderImages = parallaxImages.length > 0
    ? parallaxImages.map((p) => p.image)
    : [heroImageSrc, "/tr/279A1756.JPG", "/tr/279A1760.JPG", "/tr/279A1768.JPG"];

  const currentSlideImage = sliderImages[activeSlideIndex] || heroImageSrc;

  const handleExploreClick = () => {
    const nextSection = document.querySelector("#project-overview-specs") || document.querySelector("section:nth-of-type(2)");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" });
    }
  };

  const handleWatchVideoClick = () => {
    setIsVideoModalOpen(true);
  };

  const nextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  return (
    <>
      <NavigationOverlay />

      {/* -------------------- FULL SCREEN ARCHITECTURAL HERO SECTION -------------------- */}
      <section
        ref={heroSectionRef}
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
              key={currentSlideImage}
              src={currentSlideImage}
              alt={project?.title || "Architectural Interior"}
              className="w-full h-full object-cover object-center scale-100 transition-all duration-1000 ease-out"
            />
          )}

          {/* Color Scrim Layers (Crisp Whitish Lighting & Deep Architectural Shadows) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1718]/95 via-[#172a2b]/80 md:via-[#172a2b]/60 to-[#0b1718]/30 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1718] via-transparent to-[#0b1718]/85 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-white/[0.08] via-transparent to-transparent z-10 pointer-events-none" />
        </div>

        {/* ========================================================================= */}
        {/* 2. ARCHITECTURAL WHITISH LIGHTING & ROOM ACCENTS (Z-INDEX 20)             */}
        {/* ========================================================================= */}
        {/* Top Ceiling Recessed Spotlights (Crisp Whitish Downward Beams) */}
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
          {/* Top shelf */}
          <div className="relative w-full h-2.5 bg-black/70 backdrop-blur-md rounded-sm border-t border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-x-0 -bottom-3 h-4 bg-white/25 blur-md" />
            <div className="absolute -top-7 right-4 flex items-end gap-2 opacity-90">
              <div className="w-4 h-6 rounded-t-lg bg-emerald-900/80 border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
            </div>
          </div>
          {/* Middle shelf */}
          <div className="relative w-full h-2.5 bg-black/70 backdrop-blur-md rounded-sm border-t border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-x-0 -bottom-3 h-4 bg-white/25 blur-md" />
            <div className="absolute -top-6 right-8 flex items-end gap-1.5 opacity-85">
              <div className="w-3.5 h-5 rounded-sm bg-slate-800/80 border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.15)]" />
            </div>
          </div>
          {/* Bottom shelf */}
          <div className="relative w-full h-2.5 bg-black/70 backdrop-blur-md rounded-sm border-t border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-x-0 -bottom-3 h-4 bg-white/25 blur-md" />
          </div>
        </div>

        {/* Screen Edge Navigation Arrows */}
        {sliderImages.length > 1 && (
          <div className="hidden md:flex justify-between items-center absolute inset-x-6 sm:inset-x-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/25 pointer-events-auto transition-all hover:scale-110 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              aria-label="Previous Perspective"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/25 pointer-events-auto transition-all hover:scale-110 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              aria-label="Next Perspective"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. MAIN FOREGROUND CONTENT (Z-INDEX 30 - EDITORIAL LUXURY DESIGN)         */}
        {/* ========================================================================= */}
        <div className="relative z-30 max-w-7xl mx-auto w-full my-auto flex flex-col items-start justify-center">
          
          <div className="max-w-2xl space-y-5 sm:space-y-6">
            
            {/* Pill & Studio/Company Logo Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Pill Badge (• Elevate Your Space / Category) */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 shadow-[0_0_20px_rgba(255,255,255,0.15)] text-xs font-mono uppercase tracking-widest text-white">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_8px_#ffffff]" />
                </span>
                <span>
                  {project?.category_name
                    ? `${project.category_name} Collection`
                    : "Elevate Your Space"}
                </span>
              </div>

              {/* Commissioned Client Logo or ROHA Studio Logo Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                <img
                  src={resolvedLogo}
                  alt={clientName}
                  className="w-4 h-4 object-contain rounded-sm"
                />
                <span className="text-[10px] font-mono tracking-widest text-white uppercase font-bold">
                  {clientName}
                </span>
              </div>
            </div>

            {/* Grand Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
              {project?.title ? (
                <span className="font-serif block">
                  {project.title}
                </span>
              ) : (
                <>
                  <span className="block font-serif text-white">Art That</span>
                  <span className="block font-serif text-white/90 italic font-light drop-shadow-[0_0_30px_rgba(255,255,255,0.35)]">Transforms</span>
                  <span className="block font-serif text-white">Spaces</span>
                </>
              )}
            </h1>

            {/* Narrative Subtitle / Description */}
            <p className="text-base sm:text-lg text-slate-100/95 max-w-xl leading-relaxed font-sans drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              {(project as any)?.hero_description
                ? renderSuperscriptText((project as any).hero_description)
                : project?.description
                ? renderSuperscriptText(
                    project.description.length > 170
                      ? project.description.slice(0, 170) + "..."
                      : project.description
                  )
                : project?.subtitle
                ? renderSuperscriptText(project.subtitle)
                : "Premium 3D wall art and bespoke architectural interior designs that bring life, elegance, and creativity to your spaces."}
            </p>

            {/* Call To Action Buttons (Explore Collection + Watch Video) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary CTA: Crisp White Luxury Pill Button */}
              <button
                onClick={handleExploreClick}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs sm:text-sm font-bold uppercase tracking-wider border border-white shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:shadow-[0_0_35px_rgba(255,255,255,0.55)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <span>Explore Collection</span>
                <ArrowRight
                  size={16}
                  className="text-slate-950 group-hover:translate-x-1.5 transition-transform"
                />
              </button>

              {/* Secondary CTA: Translucent Glass Button with Play Icon */}
              <button
                onClick={handleWatchVideoClick}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold tracking-wide border border-white/30 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-950 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  <Play size={11} className="fill-current ml-0.5 text-slate-950" />
                </div>
                <span>Watch Video</span>
              </button>
            </div>

            {/* FLOATING GLASSMORPHIC STATS CARD (With Whitish Glow Accents) */}
            <div className="mt-8 sm:mt-10 backdrop-blur-2xl bg-black/60 border border-white/20 rounded-2xl p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_30px_rgba(255,255,255,0.08)] flex items-center justify-between gap-3 sm:gap-6 w-full max-w-lg">
              {/* Stat 1: Area / Unique Designs */}
              <div className="flex flex-col items-start gap-1 pr-3 sm:pr-5 border-r border-white/15 flex-1">
                <div className="flex items-center gap-1.5 text-white">
                  <Armchair size={18} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {project?.specifications?.area || "500+"}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-200 font-sans tracking-wide">
                  {project?.specifications?.area ? "Spatial Area" : "Unique Designs"}
                </div>
              </div>

              {/* Stat 2: Customer Satisfaction / Year */}
              <div className="flex flex-col items-start gap-1 px-3 sm:px-5 border-r border-white/15 flex-1">
                <div className="flex items-center gap-1.5 text-white">
                  <Star size={18} className="fill-white/30 drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {project?.year ? project.year : "98%"}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-200 font-sans tracking-wide">
                  {project?.year ? "Project Year" : "Customer Satisfaction"}
                </div>
              </div>

              {/* Stat 3: Quality / Warranty */}
              <div className="flex flex-col items-start gap-1 pl-3 sm:pl-5 flex-1">
                <div className="flex items-center gap-1.5 text-white">
                  <Shield size={18} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight truncate max-w-[110px]">
                  {project?.specifications?.status || "5 Years"}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-200 font-sans tracking-wide">
                  {project?.specifications?.status ? "Execution Status" : "Premium Quality"}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. BOTTOM PAGINATION DOTS (CRISP WHITE GLOW)                             */}
        {/* ========================================================================= */}
        {sliderImages.length > 1 && (
          <div className="relative z-30 flex items-center justify-center gap-2.5 pt-4">
            <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/25 shadow-[0_0_25px_rgba(255,255,255,0.15)]">
              {sliderImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlideIndex(idx)}
                  aria-label={`Switch to perspective ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeSlideIndex === idx
                      ? "w-8 h-2.5 bg-white shadow-[0_0_14px_rgba(255,255,255,1)]"
                      : "w-2.5 h-2.5 bg-white/40 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. CINEMATIC VIDEO LIGHTBOX MODAL (Z-INDEX 50)                            */}
      {/* ========================================================================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-8 animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-[#112224] rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
              <div className="flex items-center gap-2">
                <Play size={16} className="text-white fill-white" />
                <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-white font-bold">
                  {project?.title || "Cinematic Interior Walkthrough"}
                </span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              {project?.video_url && project.video_url.trim() ? (
                project.video_url.match(/\.(mp4|webm|mov|mkv)($|\?)/i) || project.video_url.startsWith("/uploads/") ? (
                  <video
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    src={resolveImageUrl(project.video_url)}
                  />
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={
                      project.video_url.includes("watch?v=")
                        ? project.video_url.replace("watch?v=", "embed/") + "?autoplay=1"
                        : project.video_url
                    }
                    title="Project Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <video
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  src="/web roha.mp4"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- PARALLAX GRID & SPECS (BACKEND POWERED) -------------------- */}
      <div id="project-overview-specs">
        <ParallaxGrid
          title={project?.title || ""}
          subtitle={project?.subtitle || ""}
          description={project?.description || ""}
          location={project?.location || ""}
          year={project?.year || ""}
          area={project?.specifications?.area || ""}
          floorsOrScale={
            project?.specifications?.floors
              ? `${project.specifications.floors} Levels`
              : ""
          }
          materialPalette={project?.specifications?.material_palette || ""}
          styleName={project?.specifications?.style || ""}
          statusName={project?.specifications?.status || ""}
          companyLogo={project?.company_logo}
          clientName={clientName}
          parallaxImages={parallaxImages}
          videoUrl={project?.video_url || ""}
        />
      </div>

      <Footer />
    </>
  );
}

export default InteriorProjectDetails;
