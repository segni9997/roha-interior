import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Star, 
  Quote, 
  CheckCircle2, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { api, resolveImageUrl, type TrustedClientItem } from '../services/api';

export interface TestimonialSlide {
  id: number;
  clientName: string;
  industry: string;
  location: string;
  projectScope: string;
  quote: string;
  spokesperson: string;
  rating: number;
  logo: string;
  backgroundImage: string;
  tint: string;
}

const DEFAULT_TESTIMONIALS: TestimonialSlide[] = [
  {
    id: 1,
    clientName: "Ethiopian Airlines Group",
    industry: "Aviation & Infrastructure",
    location: "Bole International, Addis Ababa",
    projectScope: "Corporate HQ & VIP Skylight Lounges",
    quote: "ROHA transformed our executive VIP skylight lounges into spaces of monumental architectural serenity and elegance.",
    spokesperson: "Director of Infrastructure & VIP Services",
    rating: 5,
    logo: "/roha.png",
    backgroundImage: "/tr/279A1756.JPG",
    tint: "from-[#0c1f21]/85 via-[#172a2b]/60 to-transparent",
  },
  {
    id: 2,
    clientName: "Commercial Bank of Ethiopia",
    industry: "Banking & Financial Real Estate",
    location: "Finbarr Plaza, Addis Ababa",
    projectScope: "Headquarters Model & Executive Suites",
    quote: "The physical scale model and executive boardroom interiors delivered far beyond all architectural expectations with millimeter precision.",
    spokesperson: "Head of Real Estate & Facilities Strategy",
    rating: 5,
    logo: "/roha.png",
    backgroundImage: "/tr/279A1760.JPG",
    tint: "from-[#0d1c22]/85 via-[#18323a]/60 to-transparent",
  },
  {
    id: 3,
    clientName: "Marriott Executive Apartments",
    industry: "Luxury Hospitality & Living",
    location: "Kazanchis, Addis Ababa",
    projectScope: "Bespoke Suites & Atrium Spatial Curation",
    quote: "Bespoke craftsmanship, acoustic harmony, and biophilic lighting tailored seamlessly to world-class hospitality standards.",
    spokesperson: "Regional General Manager",
    rating: 5,
    logo: "/roha.png",
    backgroundImage: "/tr/279A1768.JPG",
    tint: "from-[#112325]/85 via-[#1d3d41]/60 to-transparent",
  },
  {
    id: 4,
    clientName: "MIDROC Investment Group",
    industry: "Real Estate & Monolithic Dev.",
    location: "Addis Ababa, Ethiopia",
    projectScope: "Multi-acre Masterplan & Luxury Residences",
    quote: "A masterful synthesis of modern materiality, fluted precision, and monumental spatial flow across our developments.",
    spokesperson: "Chief Development Officer",
    rating: 5,
    logo: "/roha.png",
    backgroundImage: "/tr/279A1771.JPG",
    tint: "from-[#0e2124]/85 via-[#1b3a3e]/60 to-transparent",
  },
  {
    id: 5,
    clientName: "Noah Real Estate",
    industry: "Residential High-Rise Developments",
    location: "Bole Atlas, Addis Ababa",
    projectScope: "Flagship Residential Towers & Scale Exhibits",
    quote: "Exemplary attention to micro-tolerances, material palettes, and spatial detailing that captivates our clients instantly.",
    spokesperson: "Lead Project Architect",
    rating: 5,
    logo: "/roha.png",
    backgroundImage: "/home1.png",
    tint: "from-[#0a181a]/85 via-[#162e31]/60 to-transparent",
  },
];

export const ClientsSection: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [active, setActive] = useState<number>(0);
  const [testimonials, setTestimonials] = useState<TestimonialSlide[]>(DEFAULT_TESTIMONIALS);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Load backend trusted clients and map to testimonial slides if available
  useEffect(() => {
    let isMounted = true;
    async function fetchClients() {
      try {
        const liveClients: TrustedClientItem[] = await api.getTrustedClients();
        if (isMounted && liveClients && liveClients.length > 0) {
          const projectImages = ["/tr/279A1756.JPG", "/tr/279A1760.JPG", "/tr/279A1768.JPG", "/tr/279A1771.JPG", "/home1.png"];
          const mapped = liveClients.map((client, idx) => ({
            id: client.id,
            clientName: client.name,
            industry: client.industry || "Architectural Enterprise",
            location: "Addis Ababa, Ethiopia",
            projectScope: client.project_count || "Executive Architectural Commission",
            quote: DEFAULT_TESTIMONIALS[idx % DEFAULT_TESTIMONIALS.length].quote,
            spokesperson: DEFAULT_TESTIMONIALS[idx % DEFAULT_TESTIMONIALS.length].spokesperson,
            rating: 5,
            logo: resolveImageUrl(client.logo, '/roha.png'),
            backgroundImage: projectImages[idx % projectImages.length],
            tint: DEFAULT_TESTIMONIALS[idx % DEFAULT_TESTIMONIALS.length].tint,
          }));
          setTestimonials(mapped);
        }
      } catch (err) {
        console.warn("Using default testimonial monograph:", err);
      }
    }
    fetchClients();
    return () => {
      isMounted = false;
    };
  }, []);

  const next = () => setActive((current) => (current + 1) % testimonials.length);
  const previous = () => setActive((current) => (current - 1 + testimonials.length) % testimonials.length);

  // Auto-advance every 6 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(next, 6500);
    return () => window.clearInterval(timer);
  }, [testimonials.length, isPaused]);

  const slide = testimonials[active] || DEFAULT_TESTIMONIALS[0];

  return (
    <section 
      id="clients-section" 
      className={`relative min-h-screen w-full overflow-hidden bg-[#0b1718] text-white font-sans flex flex-col justify-between ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ========================================================================= */}
      {/* 1. FULL-BLEED ANIMATED BACKGROUND IMAGE (FROM PROJECT GALLERY)            */}
      {/* ========================================================================= */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.backgroundImage}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.backgroundImage})` }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>

      {/* Deep Architectural Scrim Layers (Brand Color Grading & Contrast) */}
      <div className="absolute inset-0 bg-[#0b1718]/75 z-0 pointer-events-none" />
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.tint} z-0 pointer-events-none`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1718] via-transparent to-[#0b1718]/85 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-white/[0.06] via-transparent to-transparent z-0 pointer-events-none" />

      {/* Ceiling Recessed Spotlights (Whitish Architectural Beams) */}
      <div className="absolute top-0 inset-x-0 flex justify-around pointer-events-none z-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-4 h-1 bg-white/90 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)]" />
            <div className="w-32 sm:w-48 h-56 sm:h-72 bg-gradient-to-b from-white/30 via-white/5 to-transparent blur-2xl transform -translate-y-2" />
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2. SECTION HEADER & MONOGRAPH EYEBROW (Z-INDEX 20)                        */}
      {/* ========================================================================= */}
      <header className="relative z-20 flex items-center justify-between px-6 pt-12 pb-4 sm:px-12 sm:pt-16 lg:px-20 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 bg-white shadow-[0_0_10px_#ffffff]" />
          <div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-white/75 font-bold block">
              TRUSTED PARTNERSHIPS & TESTIMONIALS
            </span>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              Client Monograph · {String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Verified Alliance Monograph Tag */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <ShieldCheck size={14} className="text-white" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-white font-semibold">
            ROHA Studio Verified Alliance
          </span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO TESTIMONIAL STATEMENT & FRONT DETAILS (Z-INDEX 20)                */}
      {/* ========================================================================= */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-20 my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Quote Statement in Grand Editorial Serif */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Front Details Pill: Rating & Industry */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>{slide.industry}</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                {[...Array(slide.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-white text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                ))}
              </div>
            </div>

            {/* Testimonial Quote with Framer Motion AnimatePresence */}
            <div className="relative min-h-[140px] sm:min-h-[180px] flex items-center">
              <Quote className="absolute -top-4 -left-4 sm:-left-8 w-12 h-12 text-white/10 pointer-events-none" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light leading-[1.18] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                    "{slide.quote}"
                  </h2>
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-white/80 font-mono text-xs sm:text-sm">
                    <span className="text-white font-bold tracking-wider uppercase">{slide.spokesperson}</span>
                    <span className="hidden sm:inline text-white/40">·</span>
                    <span className="text-white/60 uppercase">{slide.location}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Front Client Logo & Commission Badge */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.clientName}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="bg-black/60 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(255,255,255,0.08)] w-full max-w-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  {/* Front Logo Showcase */}
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md p-2.5 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                    <img
                      src={slide.logo}
                      alt={slide.clientName}
                      className="w-full h-full object-contain filter drop-shadow"
                    />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight leading-tight">
                      {slide.clientName}
                    </h3>
                    <p className="text-[11px] font-mono text-white/60 uppercase mt-0.5">
                      Verified Client Partner
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60 font-sans">Commission Scope:</span>
                    <span className="text-white font-semibold font-mono text-right truncate max-w-[170px]">{slide.projectScope}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60 font-sans">Quality Standard:</span>
                    <span className="text-white font-mono flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-white" /> 100% Custom
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Carousel Controls Bar */}
        <div className="mt-8 sm:mt-10 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={previous}
              className="p-3 rounded-full border border-white/30 bg-black/50 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)] group"
              aria-label="Previous Testimonial"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              type="button"
              onClick={next}
              className="p-3 rounded-full border border-white/30 bg-black/50 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)] group"
              aria-label="Next Testimonial"
            >
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <span className="hidden text-[10px] uppercase tracking-[0.28em] text-white/60 sm:block font-mono">
              Curated Architectural Portfolio
            </span>
          </div>

          <p className="hidden max-w-[260px] text-right text-[10px] uppercase leading-relaxed tracking-[0.2em] text-white/50 md:block font-mono">
            Bespoke Physical Models & Monolithic Spatial Craftsmanship.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. ANIMATED HORIZONTAL CARDS TRACK (ANIMATED-IMAGE-CAROUSEL DESIGN)       */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full overflow-hidden pt-2 pb-6 sm:pb-8">
        <div className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto overflow-hidden">
          <motion.div
            className="flex items-center gap-6"
            animate={{ x: `calc(-${active} * (min(28vw, 320px) + 24px))` }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {testimonials.map((item, index) => {
              const isActive = index === active;
              return (
                <motion.article
                  key={`${item.clientName}-${index}`}
                  onClick={() => setActive(index)}
                  className={`relative h-48 sm:h-56 w-[min(28vw,320px)] shrink-0 overflow-hidden rounded-2xl cursor-pointer border transition-all duration-500 ${
                    isActive
                      ? 'border-white/60 shadow-[0_12px_32px_rgba(0,0,0,0.8),0_0_25px_rgba(255,255,255,0.25)] scale-100 opacity-100'
                      : 'border-white/15 opacity-50 hover:opacity-85 scale-95'
                  }`}
                  animate={{
                    opacity: isActive ? 1 : 0.5,
                    scale: isActive ? 1 : 0.94,
                    y: isActive ? 0 : 8,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={item.backgroundImage}
                    alt={`${item.clientName} commission`}
                    className="h-full w-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.tint} opacity-90`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Card Content & Front Logo Badge */}
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-md bg-black/60 backdrop-blur-md p-0.5 border border-white/20 flex items-center justify-center shrink-0">
                          <img src={item.logo} alt="" className="w-full h-full object-contain" />
                        </div>
                        <p className="text-[9px] uppercase font-mono tracking-widest text-white/75 truncate">
                          {item.industry.split('&')[0]}
                        </p>
                      </div>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-white uppercase tracking-tight truncate">
                        {item.clientName}
                      </h4>
                    </div>

                    {/* Active Accent Dot */}
                    {isActive && (
                      <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff] shrink-0 mb-1" />
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM PAGINATION BAR & DISCOVERY HINT                                 */}
      {/* ========================================================================= */}
      <footer className="relative z-20 flex items-center justify-between px-6 pb-8 sm:px-12 sm:pb-12 lg:px-20 max-w-7xl mx-auto w-full">
        {/* Pagination Lines */}
        <div className="flex items-center gap-2" aria-label="Testimonials carousel pagination">
          {testimonials.map((item, index) => (
            <button
              key={item.clientName + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                index === active ? 'w-12 sm:w-16 bg-white shadow-[0_0_10px_#ffffff]' : 'w-5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-white/50">
          <ChevronDown size={14} className="animate-bounce" /> Scroll for Monograph
        </div>
      </footer>
    </section>
  );
};

export default ClientsSection;
