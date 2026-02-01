import  { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Maximize2, Layers, MapPin, Ruler } from "lucide-react";
gsap.registerPlugin(ScrollTrigger);
interface GridItem {
    id:number;
    title:string;
    subtitle:string;
    image:string;
}
// ... (GridItem interface and gridData remain the same)
const gridData: GridItem[] = [
  {
    id: 1,
    title: "VORTEX",
    subtitle: "Parametric Design",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"

  },
  {
    id: 2,
    title: "ZENITH",
    subtitle: "Skyscraper Concept",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "SILVA",
    subtitle: "Sustainable Timber",
       image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80"

  },
  {
    id: 4,
    title: "BRUTAL",
    subtitle: "Raw Concrete Form",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    title: "EQUINOX",
    subtitle: "Light & Shadow",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    title: "AQUA",
    subtitle: "Waterside Pavilion",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    title: "OSCURA",
    subtitle: "Dark Minimalism",
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80"
  },
  {
    id: 8,
    title: "MARMOR",
    subtitle: "Stone Textures",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80"
  },
  {
    id: 9,
    title: "KINETIC",
    subtitle: "Dynamic Facades",
    image: "https://images.unsplash.com/photo-1470723710355-95304d8aece4?auto=format&fit=crop&q=80"
  },
  {
    id: 10,
    title: "ORIGAMI",
    subtitle: "Folded Geometry",
     image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80"

  }
];

const specs = [
    { label: "Location", value: "Reykjavík, Iceland", icon: MapPin },
    { label: "Total Area", value: "4,200 sq.ft", icon: Maximize2 },
    { label: "Floor Count", value: "03 Levels", icon: Layers },
    { label: "Project Year", value: "2024", icon: Ruler },
  ];
const ParallaxGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      imageRefs.current.forEach((img, index) => {
        if (!img) return;

        // Parallax Logic: 
        // We trigger based on the individual parent <div> rather than the whole container
        // to ensure the movement happens only when that specific row is in view.
        const parent = img.parentElement;
        const yValue = index % 2 === 0 ? "15%" : "-15%";

        gsap.to(img, {
          y: yValue,
          ease: "none",
          scrollTrigger: {
            trigger: parent,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
  <> 
  <section className="w-full bg-gradient-to-b from-[#172a2b] via-[#1d424b] to-[#f5f7f7] py-24 px-6 md:px-20 text-white contour-one">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-12 mb-12">
          <h2 className="text-sm uppercase tracking-[0.4em] font-bold text- mb-4">
            Project Overview
          </h2>
          <h3 className="text-5xl md:text-7xl font-black tracking-tighter italic">
            THE MONOLITH
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Narrative Content (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <p className="text-2xl md:text-3xl font-medium leading-tight text-slate-50 italic">
              A study in raw concrete and natural light, designed to blur the line between content and interaction.
            </p>
            <div className="space-y-6 text-slate-100 leading-relaxed text-lg max-w-2xl">
              <p>
                Inspired by Swiss modernism, this project focuses on exceptional design and clean typography within the physical space. The structure utilizes a minimal color palette—mostly whites, grays, and blacks—to let the natural surroundings shine.
              </p>
              <p>
                The interior flow was designed with a focus on purposeful motion. Every angle was sketched as a wireframe before jumping into construction to ensure the final result was pixel-perfect.
              </p>
            </div>
          </div>

          {/* Technical Specs (Right 1/3) */}
         <div
  className="
    relative
    bg-white/10
    backdrop-blur-xl
    p-8
    rounded-2xl
    border border-white/20
    shadow-[0_8px_32px_rgba(0,0,0,0.12)]
  "
>
  {/* glass highlight */}
  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent" />

  <h4 className="relative text-xs uppercase tracking-widest font-black mb-8 border-b border-white/20 pb-4 text-white/80">
    Technical Data
  </h4>

  <ul className="relative space-y-8">
    {specs.map((spec, i) => (
      <li key={i} className="flex items-start gap-4">
        <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg shadow-sm border border-white/30">
          <spec.icon size={18} className="text-white/70" />
        </div>

        <div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-white/60">
            {spec.label}
          </p>
          <p className="text-lg font-black tracking-tight text-white">
            {spec.value}
          </p>
        </div>
      </li>
    ))}
  </ul>
</div>

          
        </div>
      </div>
    </section>
    <section ref={containerRef} className="w-full bg-[#f5f7f7] py-20 relative">
      {/* Grid Configuration:
          - grid-cols-1: Single column on mobile
          - md:grid-cols-2: Two columns on desktop
          - gap-4: Tight architectural spacing
      */}
      <div className="absolute bg-gradient-to-b from-[#f0f0f0] from-35%  h-96 top-0 inset-0 z-10"></div>
      <div className="grid grid-cols-1 md:grid-cols-2  max-w-[1600px] mx-auto">
        {gridData.map((item, index) => (
          <div 
            key={item.id}
            className="relative h-[60vh] md:h-[80vh] overflow-hidden group border border-white/5"
          >
            {/* Image Layer - Made taller (120%) to provide space for parallax shift */}
            <img
              ref={(el) => (imageRefs.current[index] = el)}
              src={item.image}
              alt={item.title}
              className="absolute -top-[10%] left-0 w-full h-[120%] object-cover scale-110 will-change-transform"
            />

            {/* Glassy Overlay & Content */}
          
          </div>
        ))}
      </div>

<div className="w-full h-[25%]  overflow-hidden rounded-xl px-10 py-20">
  <iframe 
    className="w-full aspect-video"
    src="https://www.youtube.com/embed/_BZZkFzuLQs" 
    title="Architectural Portfolio Process" 
    // frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    // allowfullscreen
    >
  </iframe>
</div>
    </section>
   
  </>
  );
};

export default ParallaxGrid;