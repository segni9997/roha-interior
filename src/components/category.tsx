import { Link } from "react-router-dom";
import { ArrowUpRight, Box, Sparkles } from "lucide-react";
import { resetSmoothScroll } from "../hook/useSmoothScroll";
import { FloatingShape, SHAPES } from "./FloatingShapes";

export default function Categories() {
  const handleNavigate = () => {
    resetSmoothScroll();
  };

  return (
    <section className="w-full relative py-16 sm:py-24 bg-[#f5f7f7] text-slate-900 font-sans overflow-hidden">
      {/* Floating 3D Geometric Architectural Shapes */}
      <FloatingShape
        src={SHAPES.cube}
        size={80}
        top="4%"
        left="2%"
        blur="1px"
        opacity={0.35}
        rotate={18}
        duration={8}
      />
      <FloatingShape
        src={SHAPES.cone}
        size={95}
        top="12%"
        right="3%"
        blur="2px"
        opacity={0.3}
        rotate={-22}
        duration={9.5}
        delay={1}
      />
      <FloatingShape
        src={SHAPES.diamond}
        size={65}
        bottom="6%"
        left="4%"
        blur="none"
        opacity={0.4}
        rotate={30}
        duration={7.5}
        delay={0.8}
      />
      <FloatingShape
        src={SHAPES.cylinder}
        size={75}
        bottom="8%"
        right="4%"
        blur="none"
        opacity={0.35}
        rotate={-15}
        duration={8.5}
        delay={1.5}
      />

      <div className="w-full px-4 sm:px-8 md:px-12 relative z-20">
        
        {/* --- EXPERTISE HEADER (LIGHT THEME) --- */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 sm:w-12 h-[3px] bg-[#205b63]"></span>
              <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] font-bold text-[#205b63]">
                Core Disciplines
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 uppercase">
              ARCHITECTURAL DESIGN & MODELING MAKING
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 font-normal max-w-md border-r-4 border-[#205b63] pr-4 sm:pr-5">
            Bridging precision physical scale modeling making with transcendent architectural design and spatial curation.
          </p>
        </div>

        {/* --- FULL WIDTH SPLIT HERO CARDS --- */}
        <div className="relative flex flex-col md:flex-row h-[70vh] sm:h-[78vh] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-xl font-sans bg-white">

          {/* LEFT: Modeling Making */}
          <Link
            to="/model-making"
            onClick={handleNavigate}
            className="group relative flex-1 overflow-hidden transition-all duration-700 ease-in-out hover:flex-[1.6] border-b md:border-b-0 md:border-r border-slate-200"
          >
            {/* Background image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-900/10 group-hover:via-slate-950/20 transition-all duration-700" />

            {/* Tag */}
            <div className="absolute top-6 left-6 z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#205b63] font-bold shadow-md border border-slate-200">
                <Box size={13} className="text-[#205b63]" /> Physical Scale Precision
              </span>
            </div>

            {/* Card Content */}
            <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 z-10 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-300 mb-1 font-semibold">
                    01 // Modeling Making
                  </p>
                  <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2 leading-tight uppercase">
                    MODELING MAKING.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 font-light max-w-sm line-clamp-2">
                    High-precision laser cutting, 3D printing, and handcrafted physical architectural scale models.
                  </p>
                </div>

                <div className="w-12 h-12 rounded-full bg-white/20 group-hover:bg-[#205b63] backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-45 shadow-lg">
                  <ArrowUpRight size={20} className="text-white" />
                </div>
              </div>
            </div>
          </Link>

          {/* RIGHT: Architectural Design */}
          <Link
            to="/interior"
            onClick={handleNavigate}
            className="group relative flex-1 overflow-hidden transition-all duration-700 ease-in-out hover:flex-[1.6]"
          >
            {/* Background image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80')] bg-cover bg-center group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-900/10 group-hover:via-slate-950/20 transition-all duration-700" />

            {/* Tag */}
            <div className="absolute top-6 left-6 z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#205b63] font-bold shadow-md border border-slate-200">
                <Sparkles size={13} className="text-[#205b63]" /> Spatial Architecture
              </span>
            </div>

            {/* Card Content */}
            <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 z-10 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-300 mb-1 font-semibold">
                    02 // Architectural Design
                  </p>
                  <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-2 leading-tight uppercase">
                    ARCHITECTURAL DESIGN.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 font-light max-w-sm line-clamp-2">
                    Bespoke residential sanctuaries and corporate commercial environments tailored to human experience.
                  </p>
                </div>

                <div className="w-12 h-12 rounded-full bg-white/20 group-hover:bg-[#205b63] backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-45 shadow-lg">
                  <ArrowUpRight size={20} className="text-white" />
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}