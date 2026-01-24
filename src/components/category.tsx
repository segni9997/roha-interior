import { Link } from "react-router-dom";

export default function Categories() {
  return (
    <section className="w-full relative py-24 bg-[#f5f7f7]">
      <div className="max-w-7xl mx-auto relative bg-white p-6 md:p-10 shadow-lg">
        
        {/* --- EXPERTISE LABEL --- */}
        <div className="absolute -top-12 left-1/2 md:left-10 flex items-center gap-4 z-30">
          <div className="h-[1px] w-12 bg-[#205b63]"></div>
          <span className="text-4xl md:text-xs font-black uppercase tracking-[0.5em] text-[#205b63]">
            Our Expertise 
          </span>
        </div>

        {/* SPLIT HERO */}
        <div className="relative flex flex-col md:flex-row h-[80vh] w-full overflow-hidden font-sans">

          {/* LEFT: Modeling */}
          <div className="group relative flex-1 overflow-hidden transition-all duration-700 ease-in-out hover:flex-[1.5]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale group-hover:grayscale-0 transition duration-700"></div>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-700"></div>

            <div className="relative h-full flex flex-col justify-end p-10 text-white">
              <h2 className="text-4xl md:text-5xl font-serif mb-2 leading-tight">
                BUILD THE VISION
              </h2>
              <p className="text-sm tracking-[0.2em] mb-8 font-light uppercase">
                Architectural Modeling
              </p>
              <Link to="/model-making">
                <button className="w-fit bg-white text-black px-8 py-3 text-sm font-bold hover:bg-[#172a2b] hover:text-white transition-all duration-300 transform group-hover:translate-x-2">
                  EXPLORE MODEL
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT: Interior */}
          <div className="group relative flex-1 overflow-hidden transition-all duration-700 ease-in-out hover:flex-[1.5] border-t md:border-t-0 md:border-l border-black/10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80')] bg-cover bg-center transition duration-700 scale-105 group-hover:scale-100"></div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition duration-700"></div>

            <div className="relative h-full flex flex-col justify-end p-10 text-white">
              <h2 className="text-4xl md:text-5xl font-serif mb-2 leading-tight">
                INHABIT THE SPACE
              </h2>
              <p className="text-sm tracking-[0.2em] mb-8 font-light uppercase">
                Interior Curation
              </p>
              <Link to="/interior">
                <button className="w-fit bg-black text-white px-8 py-3 text-sm font-bold hover:bg-[#172a2b] transition-all duration-300 transform group-hover:translate-x-2">
                  EXPLORE INTERIOR
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}