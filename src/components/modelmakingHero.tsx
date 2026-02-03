// import logo from "../assets/rohalandscape.png";
// // import bg from "/3.jpg";
// import { ArrowRight, Play, Box } from "lucide-react";

// export default function ModelHero() {
//   return (
//     <section className="relative min-h-screen bg-[#f8f9fa] overflow-hidden">
//       {/* Background Architectural Grid */}
//       <div className="absolute inset-0 z-0 opacity-[0.03]"
//            style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>

//       </div>
//       {/* <div className="absolute -z-0 w-1/2 " >
//         <div className="absolute bg-[#395e63]/10 inset-0"></div>
//             <img src={bg} alt="" className="w-full" />
//       </div> */}

//       <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center min-h-screen">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

//           {/* Left: Text Content (Cols 1-5) */}
//           <div className="lg:col-span-5 space-y-10">
//             <div className="space-y-4">
//               <div className="flex items-center gap-2 text-[#395e63] font-medium tracking-widest uppercase text-xs">
//                 <span className="w-8 h-[1px] bg-[#395e63]"></span>
//                 Master Craftsmanship
//               </div>
//               <h1 className="text-6xl lg:text-8xl font-light text-slate-900 leading-[0.9] tracking-tighter">
//                 Precision <br />
//                 <span className="font-bold bg-gradient-to-r from-[#395e63] to-[#5b949b] bg-clip-text text-transparent">
//                   Modeling.
//                 </span>
//               </h1>
//               <p className="text-lg text-slate-500 max-w-md font-light leading-relaxed">
//                 Transforming complex architectural blueprints into tangible,
//                 high-fidelity physical realities with 0.1mm accuracy.
//               </p>
//             </div>

//             {/* CTA Group */}
//             <div className="flex flex-wrap gap-5">
//               <button className="px-8 py-4 bg-slate-900 text-white flex items-center gap-3 hover:bg-[#395e63] transition-all duration-300 group">
//                 Start a Project
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button className="px-8 py-4 border border-slate-200 text-slate-900 flex items-center gap-3 hover:bg-slate-50 transition-all">
//                 <Play className="w-4 h-4 fill-current" />
//                 Our Process
//               </button>
//             </div>

//             {/* Minimal Stats */}
//             <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-200">
//               <div>
//                 <div className="text-2xl font-bold text-slate-900">500+</div>
//                 <div className="text-[10px] uppercase tracking-widest text-slate-400">Scale Models</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-slate-900">15+</div>
//                 <div className="text-[10px] uppercase tracking-widest text-slate-400">Years Exp.</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-slate-900">1:50</div>
//                 <div className="text-[10px] uppercase tracking-widest text-slate-400">Standard Detail</div>
//               </div>
//             </div>
//           </div>

//           {/* Right: Visual Showcase (Cols 6-12) */}
//           <div className="lg:col-span-7 relative">
//             <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-slate-200 group">
//               <img
//                 src={logo}
//                 alt="Model Detail"
//                 className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
//               />
//               {/* Technical Overlay Decor */}
//               <div className="absolute top-0 right-0 p-8">
//                 <div className="text-right text-[10px] font-mono text-white/60 leading-tight">
//                   REF_NO: RO-2024 <br />
//                   LAT: 24.4539 <br />
//                   LNG: 54.3773
//                 </div>
//               </div>

//               {/* Floating Tooltips */}
//               <div className="absolute bottom-10 left-10 p-6 bg-white/90 backdrop-blur-md border border-white shadow-2xl space-y-2 max-w-[200px]">
//                 <Box className="w-5 h-5 text-[#395e63]" />
//                 <h4 className="text-sm font-bold text-slate-900 uppercase italic">Complex Geometry</h4>
//                 <p className="text-[10px] text-slate-500">Advanced 3D printing & laser-cut hybrid fabrication.</p>
//               </div>
//             </div>

//             {/* Decorative Geometry */}
//             <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-[#395e63]/20"></div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }

import bg from "/1.jpg";
import model from "/as.png";
import pattern from "/pattern-01.png";
import roha from "../assets/roha.png";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

import { fragmentShader, vertexShader } from "../utils/shaders";

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

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#f5f7f7] overflow-hidden flex items-center justify-center">
      {/* 1. Background Image Wrapper */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img
          src={bg}
          alt="Architectural Background"
          className="w-full h-full object-fit object-center"
        />
        <img
          src={pattern}
          alt="Pattern Background"
          className=" h-full object-contain absolute   -translate-y-0  scale-z-125 object-center"
        />
        <div className="absolute w-full h-full bg-white/75"></div>
        <div className="absolute h-full bg-gradient-to-tl   from-[#305B63]/80 to-white/20 border-0 w-1/2 right-0"></div>
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <img
            src={model}
            alt="Architectural Background"
            className="w-full h-full object-contain skew-x-2 -translate-y-0 scale-z-50 object-center"
          />
        </div>
        <div className="absolute bottom-0 z-50 bg-linear-to-t from-[#162e31] via-[#205B63]/20 to-white/20  inset-0 h-"></div>
      </div>
      <div className="content flex flex-col md:flex-row gap-32  justify-between z-50 w-full p-10">
        <div className=" space-y-10 w-1/2 ">
          <div className="space-y-32">
            <div className="flex items-center gap-2 text-[#395e63] font-medium tracking-widest uppercase text-xs">
              <span className="w-8 h-[1px] bg-[#395e63]"></span>
              Master Craftsmanship
            </div>
            <h1 className="text-6xl lg:text-9xl font-light text-slate-900 leading-[0.9] tracking-tighter">
              Precision <br />
              <span className="font-bold bg-gradient-to-r from-[#253d41] to-[#36575c] bg-clip-text text-transparent">
                Modeling.
              </span>
            </h1>
          </div>
        </div>
        <div className="right w-1/2 p-6 mx-8  h-full  flex justify-center">
          <img
            src={roha}
            alt="Model Detail"
            className="w-[80%] h-[80%] object-cover  hover:grayscale-0 transition-all duration-700 scale-75 group-hover:scale-100"
          />
        </div>
      </div>

      <div className="foot  z-50 h-1/3 w-full absolute bottom-0 flex md:flex-row flex-col text-white justify-evenly">
        <div className="w-[60%] p-3">
          <h1 className="text-4xl font-extrabold font-primary ">WE Are.</h1>
          <p className="text-left">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Praesentium sapiente temporibus distinctio, ipsa quas repellendus in
            quidem nulla velit vel aut exercitationem autem quibusdam omnis
            eligendi quod quo, vitae  className=" Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Praesentium sapiente temporibus distinctio, ipsa quas repellendus in
            quidem nulla velit vel aut exercitationem autem quibusdam omnis
            eligendi quod quo, vitae amet!"
          </p>
        </div>
       <div className="w-full md:w-[40%] flex flex-col md:flex-row items-center gap-8 md:gap-0 relative">
  
  {/* Vertical Divider for Desktop */}
  <div className="hidden md:block absolute left-0 h-1/2 w-[1px] bg-white/20"></div>

  {/* Experience Block */}
  <div className="flex flex-col items-center md:items-start px-10 group">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-[#7db3b8] font-bold text-xl">#</span>
      <span className="text-[20px] uppercase tracking-[0.3em] text-white/60 font-medium">
        Experience
      </span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-5xl font-black tracking-tighter transition-transform group-hover:scale-110 duration-500">
        08
      </span>
      <span className="text-sm font-light text-[#7db3b8]">YRS</span>
    </div>
  </div>

  {/* Central Divider (Desktop only) */}
  <div className="hidden md:block h-12 w-[1px] bg-white/10"></div>

  {/* Projects Block */}
  <div className="flex flex-col items-center md:items-start px-10 group">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-[20px] uppercase tracking-[0.3em] text-white/60 font-medium">
      <span className="text-[#7db3b8] font-bold text-xl">#</span>

        Projects
      </span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-5xl font-black tracking-tighter transition-transform group-hover:scale-110 duration-500">
        500
      </span>
      <span className="text-xl font-light text-[#7db3b8]">+</span>
    </div>
  </div>


</div>
      </div>
            <div className="absolute inset-0 pointer-events-none z-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#5b949b]/90 rounded-full"
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
  );
}

export default ModelHero;
