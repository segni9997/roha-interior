// import bg1 from "/public/3.jpg"
// import pattern from "/public/PATTERN.jpg"

import { Link } from "react-router-dom";

// import  Rohatext from "/public/rohapotrait text.png"
export default function Categories() {
  return (
    <section className="w-full relative  ">

      <div className="bg-image w-full relative ">
     {/* <div className="absolute right-0 rotate-90 -translate-x-1/2 ">
      <img src={pattern} alt="pattern"  className="  left-0 "/>
      <div className="absolute bg-[#143236]/30 w-full h-full inset-0"></div>
     </div> */}
        {/* <img src={bg1} alt="bg"   className="w-full h-[100vh]  object-center" /> */}

     <div className="relative flex flex-col md:flex-row h-screen w-full overflow-hidden font-sans">

      <div className="group relative flex-1 overflow-hidden transition-all duration-700 ease-in-out hover:flex-[1.5]">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale group-hover:grayscale-0 transition duration-700"></div>
    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-700"></div>
    
    <div className="relative h-full flex flex-col justify-end p-12 text-white">
      <h2 className="text-4xl md:text-5xl font-serif mb-2 leading-tight">BUILD THE VISION</h2>
      <p className="text-sm tracking-[0.2em] mb-8 font-light uppercase">Architectural Modeling</p>
      <Link to = "/model-making">
       <button className="w-fit bg-white text-black px-8 py-3 text-sm font-bold hover:bg-[#172a2b] hover:text-white transition">
        EXPLORE MODEL
      </button>
      </Link>
    </div>
  </div>

  <div className="group relative flex-1 overflow-hidden transition-all duration-700 ease-in-out hover:flex-[1.5] border-l border-white/10">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80')] bg-cover bg-center transition duration-700 scale-105 group-hover:scale-100"></div>
    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition duration-700"></div>
    
    <div className="relative h-full flex flex-col justify-end p-12 text-white">
      <h2 className="text-4xl md:text-5xl font-serif mb-2 leading-tight">INHABIT THE SPACE</h2>
      <p className="text-sm tracking-[0.2em] mb-8 font-light uppercase">Interior Curation</p>
     <Link to = "/interior">
       <button className="w-fit bg-black text-white px-8 py-3 text-sm font-bold hover:bg-[#172a2b] hover:text-white transition">
        EXPLORE INTERIOR
      </button>
      </Link>
    </div>
  </div>
        </div>
       {/* <div className="absolute bg-gradient-to-l   from-[#223e42] to-transparent w-full h-full inset-1 opacity-95 top-0 right-0">
              <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%),
                             linear-gradient(-45deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)`,
                backgroundSize: "100px 100px",
              }}
            ></div>

        </div> */}
    
      </div>

    </section>
  )
}
