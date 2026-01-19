import logo from "../assets/rohalandscape.png";
// import bg from "/3.jpg";
import { ArrowRight, Play, Box } from "lucide-react";

export default function ModelHero() {
  return (
    <section className="relative min-h-screen bg-[#f8f9fa] overflow-hidden">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
        
      </div>
      {/* <div className="absolute -z-0 w-1/2 " >
        <div className="absolute bg-[#395e63]/10 inset-0"></div>
            <img src={bg} alt="" className="w-full" />
      </div> */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Text Content (Cols 1-5) */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#395e63] font-medium tracking-widest uppercase text-xs">
                <span className="w-8 h-[1px] bg-[#395e63]"></span>
                Master Craftsmanship
              </div>
              <h1 className="text-6xl lg:text-8xl font-light text-slate-900 leading-[0.9] tracking-tighter">
                Precision <br />
                <span className="font-bold bg-gradient-to-r from-[#395e63] to-[#5b949b] bg-clip-text text-transparent">
                  Modeling.
                </span>
              </h1>
              <p className="text-lg text-slate-500 max-w-md font-light leading-relaxed">
                Transforming complex architectural blueprints into tangible, 
                high-fidelity physical realities with 0.1mm accuracy.
              </p>
            </div>

            {/* CTA Group */}
            <div className="flex flex-wrap gap-5">
              <button className="px-8 py-4 bg-slate-900 text-white flex items-center gap-3 hover:bg-[#395e63] transition-all duration-300 group">
                Start a Project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border border-slate-200 text-slate-900 flex items-center gap-3 hover:bg-slate-50 transition-all">
                <Play className="w-4 h-4 fill-current" />
                Our Process
              </button>
            </div>

            {/* Minimal Stats */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-200">
              <div>
                <div className="text-2xl font-bold text-slate-900">500+</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Scale Models</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">15+</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Years Exp.</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">1:50</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Standard Detail</div>
              </div>
            </div>
          </div>

          {/* Right: Visual Showcase (Cols 6-12) */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-slate-200 group">
              <img 
                src={logo} 
                alt="Model Detail" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
              {/* Technical Overlay Decor */}
              <div className="absolute top-0 right-0 p-8">
                <div className="text-right text-[10px] font-mono text-white/60 leading-tight">
                  REF_NO: RO-2024 <br />
                  LAT: 24.4539 <br />
                  LNG: 54.3773
                </div>
              </div>
              
              {/* Floating Tooltips */}
              <div className="absolute bottom-10 left-10 p-6 bg-white/90 backdrop-blur-md border border-white shadow-2xl space-y-2 max-w-[200px]">
                <Box className="w-5 h-5 text-[#395e63]" />
                <h4 className="text-sm font-bold text-slate-900 uppercase italic">Complex Geometry</h4>
                <p className="text-[10px] text-slate-500">Advanced 3D printing & laser-cut hybrid fabrication.</p>
              </div>
            </div>

            {/* Decorative Geometry */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-[#395e63]/20"></div>
          </div>

        </div>
      </div>
    </section>
  );
}