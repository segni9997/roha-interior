import { Link } from "react-router-dom";


export default function Categories() {
  return (
    <section className="w-full relative py-12 sm:py-16 md:py-24 bg-[#f5f7f7]">
      <div className="max-w-8xl mx-auto relative p-4 sm:p-6 md:p-10 ">
        
        {/* --- EXPERTISE LABEL --- */}
        <div className="absolute -top-8 sm:-top-12 left-4 sm:left-1/2 md:left-10 flex items-center gap-2 sm:gap-4 z-30">
          <div className="h-[4px] sm:h-[6px] w-8 sm:w-12 bg-[#205b63]"></div>
          <span className="text-xs sm:text-2xl md:text-4xl font-black uppercase tracking-[0.2em] sm:tracking-[0.5em] text-[#205b63]">
            Our Expertise 
          </span>
        </div>

        {/* SPLIT HERO */}
        <div className="relative flex flex-col md:flex-row h-[70vh] sm:h-[80vh] w-full overflow-hidden font-sans">

          {/* LEFT: Modeling */}
              <Link to="/model-making" className="group relative flex-1 overflow-hidden transition-all duration-700 ease-in-out hover:flex-[1.5]">
             
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale group-hover:grayscale-0 transition duration-700"></div>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-700"></div>

            <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 md:p-10 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-1.5 sm:mb-2 leading-tight">
                BUILD THE VISION
              </h2>
              <p className="text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] mb-6 sm:mb-8 font-light uppercase">
                Architectural Modeling
              </p>
          
                {/* <GeoButton label="Explore Model" from="ffffff"  to="fefefe" textColor="#fff"/> */}
            
              
            </div>
              </Link>

     

          {/* RIGHT: Interior */}
          <Link to="/interior" className="group relative flex-1 overflow-hidden transition-all duration-700 ease-in-out hover:flex-[1.5] border-t md:border-t-0 md:border-l border-black/10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80')] bg-cover bg-center transition duration-700 scale-105 group-hover:scale-100"></div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition duration-700"></div>

            <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 md:p-10 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-1.5 sm:mb-2 leading-tight">
                INHABIT THE SPACE
              </h2>
              <p className="text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] mb-6 sm:mb-8 font-light uppercase">
                Interior Curation
              </p>
             
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}