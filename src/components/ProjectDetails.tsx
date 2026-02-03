import {  Building2, Home, Landmark, type LucideIcon } from "lucide-react"
import home from "/confrence1.png";
// import forest from "/🔥 Free download Nature Winter 4k Ultra HD Wallpaper on WallpaperSafari.jpg"

interface TypesOfProject {
  icon: LucideIcon;
  name: string;
}

const typesOfProjects: TypesOfProject[] = [
  { icon: Building2, name: "Luxury" },
  { icon: Home, name: "Premium" },
  { icon: Landmark, name: "Architectural" },
];
    import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { fragmentShader, vertexShader } from "../utils/shaders";
import ParallaxGrid from "./ParallaxGrid";
import Footer from "./Footer";
import GeoButton from "./Buttons";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

interface Config {
  color: string;
  spread: number;
}

function ProjectDetails() {

    const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  /* ===========================
     SHADER SETUP
  ============================ */
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const CONFIG: Config = {
      color: "#172a2b",
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

    <>
        <section ref={containerRef} className="relative h-screen w-full bg-gradient-to-t from-[#f5f7f7] to-[#172a2b] overflow-hidden flex items-center justify-center">
               <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-50"
        />
      <div className="absolute  w-full bottom-0 opacity-15">
      <img src={home} alt="" className="w-full "/>
      <div className="absolute">
        <img src="" alt="" />
      </div>

      </div>
      {/* 1. THE GLASSY BACKGROUND LAYER */}
      {/* We use a radial gradient overlay with a backdrop blur to soften the background */}
      <div className="absolute inset-0 bg-radial from-white/5 to-transparent z-0" />
      
      <div className="flex w-full h-full px-10 flex-col relative z-10">
        
        {/* 2. BACKGROUND TEXT (The Large Heading) */}
        {/* Placed at a lower z-index so the house image can overlap it */}
        <div className="flex flex-col items-center text-white pt-10 h-1/2 select-none">
          <span className="text-xl font-light tracking-[0.4em] uppercase opacity-70 mb-4">
            Transforming the Future of Home Living
          </span>
          <h1 className="text-[11vw] font-black tracking-tighter  leading-none opacity-45">
            PRESENTATIONAL
          </h1>
        </div>

        {/* 3. INTERACTIVE LAYER (Middle and Sides) */}
        <div className="flex flex-row h-2/3 relative -mt-20">

          {/* LEFT SIDE: Call to Action */}
          <div className="flex flex-col items-start w-[25%] justify-center text-white z-30">
            <p className="text-lg font-medium mb-6 leading-tight opacity-80">
              Start building your <br /> dream home today
            </p>
            <Link to="/contactus">
              <GeoButton label="Get Started" from="f0f0f0" to="1d424b"/>
            </Link>
          </div>

          {/* MIDDLE: THE HERO IMAGE */}
          <div className="w-[50%] relative z-20">
            <div className="absolute -top-40 h-[130%] w-full flex justify-center">
              <img 
                src={home} 
                alt="Architectural Model" 
                className="h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]" 
              />
            </div>
          </div>

          {/* RIGHT SIDE: GLASSY TAGS */}
          <div className="flex flex-col items-end w-[25%] justify-center gap-4 z-30">
            {typesOfProjects.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 py-3 px-6 rounded-full 
                             bg-black/15 backdrop-blur-xl border border-white/10 
                             hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <Icon size={20} className="text-amber-500 group-hover:scale-110 transition-transform" />
                  <span className="text-white text-sm font-bold uppercase tracking-widest">
                    {item.name}
                  </span>
                </div>
              );
            })}
            
            {/* <div className="mt-8 flex items-center gap-2 border-b border-white/30 pb-1 cursor-pointer hover:border-amber-500 transition-colors">
               <span className="text-white font-black text-xs uppercase tracking-widest">Explore</span>
               <ArrowRight size={14} className="text-white" />
            </div> */}
          </div>

        </div>
      </div>
    </section>

    <ParallaxGrid/>
    <Footer/>
    </>

  )
}

export default ProjectDetails;