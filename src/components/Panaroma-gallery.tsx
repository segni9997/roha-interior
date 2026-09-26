import { useState, useRef, useEffect, useMemo } from "react";
import { Move3D, MapPin, Loader2, Sparkles, Filter, Grid, Compass, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { sampleProjects } from "./datas/sampleProjects";
import { NavigationOverlay } from "./NavBar";
import Footer from "./Footer";
import { api, resolveImageUrl, type PanoramicTourItem } from "../services/api";

const CATEGORIES = [
  "All",
  "Residential",
  "Commercial",
  "Cultural",
  "Hospitality",
  "Educational",
];

const fallbackToursList: PanoramicTourItem[] = sampleProjects.map((p) => ({
  id: p.id,
  title: p.title,
  slug: String(p.id),
  description: p.description,
  cover_image: p.images?.[0] || "/tr/279A1756.JPG",
  is_featured: true,
  panoramicScenes: (p.panoramicScenes || []).map((s) => ({
    id: s.id,
    name: s.name,
    panorama: s.panorama,
    initial_yaw: 0,
    initial_pitch: 0,
    hotSpots: (s.hotSpots || []) as any,
  })),
}));

const PanoramaGallery = () => {
  const [scrollY, setScrollY] = useState(0);
  const [tours, setTours] = useState<PanoramicTourItem[]>(fallbackToursList);
  const [galleryViewMode, setGalleryViewMode] = useState<"tours" | "stills">("tours");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);
  const loaderRef = useRef<HTMLDivElement>(null);

  /* ------------------------------
     1. WINDOW SCROLL (PARALLAX)
  -------------------------------*/
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ------------------------------
     2. FETCH LIVE 360 TOURS FROM BACKEND
  -------------------------------*/
  useEffect(() => {
    let isMounted = true;
    async function loadTours() {
      try {
        setLoading(true);
        const liveTours = await api.getPanoramicTours();
        if (isMounted && liveTours && liveTours.length > 0) {
          setTours(liveTours);
        }
      } catch (err) {
        console.warn("Backend unavailable, using fallback 360 tours:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadTours();
    return () => {
      isMounted = false;
    };
  }, []);

  /* ------------------------------
     3. FILTERED TOURS
  -------------------------------*/
  const filteredTours = useMemo(() => {
    if (selectedCategory === "All") return tours;
    return tours.filter((tour) => {
      const desc = (tour.description || "").toLowerCase();
      const title = (tour.title || "").toLowerCase();
      const cat = selectedCategory.toLowerCase();
      return desc.includes(cat) || title.includes(cat);
    });
  }, [tours, selectedCategory]);

  /* ------------------------------
     4. INFINITE SCROLL / LOAD MORE
  -------------------------------*/
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 3, filteredTours.length));
        }
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [filteredTours.length]);

  const displayedTours = filteredTours.slice(0, visibleCount);

  // Stills Portfolio Collection
  const stillsGallery = useMemo(() => {
    return sampleProjects.flatMap((proj) =>
      (proj.images || []).map((img, idx) => ({
        id: `${proj.id}-${idx}`,
        projectId: proj.id,
        title: proj.title,
        category: proj.category,
        image: img,
        year: proj.year,
      }))
    );
  }, []);

  return (
    <div className="relative bg-black text-white min-h-screen font-sans selection:bg-[#395e63] selection:text-white">
      <NavigationOverlay />

      {/* -------------------------------- HERO -------------------------------- */}
      <section className="relative h-[65vh] sm:h-[75vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform scale-105"
          style={{
            backgroundImage: "url(/tr/279A1002.JPG)",
            transform: `translate3d(0, ${scrollY * 0.3}px, 0)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,94,99,0.35)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl pt-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 sm:gap-3 bg-[#395e63]/30 backdrop-blur-md px-4 sm:px-6 py-2 rounded-full mb-6 border border-[#395e63]/50 shadow-[0_0_20px_rgba(57,94,99,0.3)]"
          >
            <Sparkles size={16} className="text-cyan-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest font-mono font-semibold text-cyan-200">
              Immersive Spatial Gallery & VR Tours
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter"
          >
            ROHA <span className="bg-gradient-to-r from-cyan-400 via-[#5b949b] to-[#395e63] bg-clip-text text-transparent">GALLERY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light mb-8"
          >
            Step inside our architectural creations with interactive 360° virtual reality tours and high-resolution design stills.
          </motion.p>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex items-center p-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <button
              type="button"
              onClick={() => setGalleryViewMode("tours")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                galleryViewMode === "tours"
                  ? "bg-[#395e63] text-white shadow-lg border border-cyan-400/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Compass size={14} />
              <span>360° VR Tours ({tours.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setGalleryViewMode("stills")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                galleryViewMode === "stills"
                  ? "bg-[#395e63] text-white shadow-lg border border-cyan-400/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid size={14} />
              <span>Architectural Stills ({stillsGallery.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------ MAIN GALLERY CONTENT ------------------------------ */}
      <section className="py-10 sm:py-16 bg-black relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 sm:mb-16">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 mr-2 hidden sm:flex">
            <Filter size={14} className="text-[#395e63]" />
            <span>Filter:</span>
          </div>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(9);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#395e63] text-white shadow-[0_0_15px_rgba(57,94,99,0.5)] border border-cyan-400/40"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* VIEW MODE: 360 VR TOURS */}
        {galleryViewMode === "tours" && (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence>
              {displayedTours.map((tour) => {
                const bgImg = resolveImageUrl(
                  tour.cover_image || tour.panoramicScenes?.[0]?.panorama,
                  "/tr/279A1756.JPG"
                );
                const scenesCount = tour.panoramicScenes?.length || 1;

                return (
                  <motion.div
                    key={tour.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Link
                      to={`/view360/${tour.id}`}
                      className="group block relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/5] border border-white/10 hover:border-cyan-500/50 transition-all duration-500 shadow-xl"
                    >
                      {/* Background image with hover zoom */}
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{ backgroundImage: `url(${bgImg})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                        <div className="bg-[#395e63]/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-white flex items-center gap-1.5 border border-cyan-400/30">
                          <Move3D size={13} className="text-cyan-300" />
                          <span>360° TOUR</span>
                        </div>
                        <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-gray-300 border border-white/10">
                          {scenesCount} {scenesCount === 1 ? "SCENE" : "SCENES"}
                        </div>
                      </div>

                      {/* Bottom Metadata */}
                      <div className="absolute bottom-0 inset-x-0 p-6 z-10 transform transition-transform duration-500 group-hover:-translate-y-1">
                        <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
                          Spatial Architecture
                        </p>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-cyan-200 transition-colors">
                          {tour.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <MapPin size={13} className="text-[#395e63]" />
                          <span>Addis Ababa, Ethiopia</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* VIEW MODE: ARCHITECTURAL STILLS */}
        {galleryViewMode === "stills" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {stillsGallery
              .filter(
                (item) =>
                  selectedCategory === "All" ||
                  (item.category || "").toLowerCase() === selectedCategory.toLowerCase()
              )
              .map((item) => (
                <Link
                  key={item.id}
                  to={`/project-detail?id=${item.projectId}&type=interior`}
                  className="group block relative overflow-hidden rounded-2xl bg-zinc-900 aspect-[4/3] border border-white/10 hover:border-cyan-500/50 transition-all duration-500 shadow-xl"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                        {item.category} • {item.year}
                      </span>
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-45 transition-all">
                      <ArrowUpRight size={14} className="text-white" />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}

        {displayedTours.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No items found in category "{selectedCategory}".</p>
          </div>
        )}

        {/* ------------------------------ LOADER ------------------------------ */}
        <div ref={loaderRef} className="h-24 flex items-center justify-center mt-10">
          {loading && (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin text-[#395e63]" />
              <span className="text-xs uppercase tracking-widest font-mono">Loading Gallery...</span>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PanoramaGallery;
