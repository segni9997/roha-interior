import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Building2, Home, Sparkles, Coffee, Store, Crown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, resolveImageUrl, type InteriorProjectItem } from '../services/api';

// Fallback curated local projects if network is slow
const fallbackProjects: InteriorProjectItem[] = [
  {
    id: 1,
    title: "Minimalist Modern Residence",
    slug: "minimalist-modern-residence",
    category: 1,
    category_name: "Residential",
    year: "2024",
    location: "Addis Ababa, Ethiopia",
    cover_image: "/tr/279A1756.JPG",
    description: "Serene open-plan residential interior with monolithic concrete, warm timber joinery, and biophilic light wells.",
    is_featured: true,
    order: 1
  },
  {
    id: 2,
    title: "Executive Tech Headquarters",
    slug: "executive-tech-headquarters",
    category: 2,
    category_name: "Commercial",
    year: "2023",
    location: "Bole, Addis Ababa",
    cover_image: "/tr/279A1760.JPG",
    description: "Acoustically tuned corporate interiors featuring modular breakout spaces, oak slat paneling, and indirect lighting.",
    is_featured: true,
    order: 2
  },
  {
    id: 3,
    title: "Azure Boutique Hotel Suite",
    slug: "azure-boutique-hotel-suite",
    category: 3,
    category_name: "Hospitality",
    year: "2024",
    location: "Bishoftu, Ethiopia",
    cover_image: "/tr/279A1768.JPG",
    description: "Luxury hospitality interior with custom brass accents, terrazzo flooring, and floor-to-ceiling panoramic drapery.",
    is_featured: true,
    order: 3
  },
  {
    id: 4,
    title: "Atelier Flagship Store",
    slug: "atelier-flagship-store",
    category: 4,
    category_name: "Retail",
    year: "2024",
    location: "Addis Ababa, Ethiopia",
    cover_image: "/tr/279A1771.JPG",
    description: "Sculptural retail interior featuring fluted plaster walls, floating cantilevered plinths, and museum-grade spotlighting.",
    is_featured: true,
    order: 4
  },
  {
    id: 5,
    title: "Skyline Sky Villa Penthouse",
    slug: "skyline-sky-villa-penthouse",
    category: 5,
    category_name: "Penthouse",
    year: "2024",
    location: "Addis Ababa, Ethiopia",
    cover_image: "/confrence1.png",
    description: "Double-height penthouse interior showcasing bookmatched Calacatta marble, integrated wine cellar, and private terrace lounge.",
    is_featured: true,
    order: 5
  },
  {
    id: 6,
    title: "Artisan Culinary Club",
    slug: "artisan-culinary-club",
    category: 3,
    category_name: "Hospitality",
    year: "2023",
    location: "Addis Ababa, Ethiopia",
    cover_image: "/home1.png",
    description: "Intimate dining club with charred cedar wood finishes, bespoke velvet banquettes, and deep atmospheric illumination.",
    is_featured: true,
    order: 6
  },
  {
    id: 7,
    title: "Contemporary Villa Salon",
    slug: "contemporary-villa-salon",
    category: 1,
    category_name: "Residential",
    year: "2024",
    location: "Addis Ababa, Ethiopia",
    cover_image: "/ethio1.jpg",
    description: "Spacious salon with custom curved sofa arrangement, travertine fireplace mantel, and garden courtyard integration.",
    is_featured: true,
    order: 7
  },
  {
    id: 8,
    title: "Haute Horlogerie Showroom",
    slug: "haute-horlogerie-showroom",
    category: 4,
    category_name: "Retail",
    year: "2023",
    location: "Bole, Addis Ababa",
    cover_image: "/ethio 2.jpg",
    description: "High-security luxury retail space combining smoked glass vitrines, brushed bronze fittings, and acoustic suede wall panels.",
    is_featured: true,
    order: 8
  }
];

type InteriorType = "All" | "Residential" | "Commercial" | "Hospitality" | "Retail" | "Penthouse";

const typeIcons: Record<InteriorType, ReactNode> = {
  All: <Sparkles className="w-4 h-4" />,
  Residential: <Home className="w-4 h-4" />,
  Commercial: <Building2 className="w-4 h-4" />,
  Hospitality: <Coffee className="w-4 h-4" />,
  Retail: <Store className="w-4 h-4" />,
  Penthouse: <Crown className="w-4 h-4" />
};

import { FloatingShape, SHAPES } from './FloatingShapes';

export default function SubCategoryInteriorGrid() {
  const [activeType, setActiveType] = useState<string>('All');
  const [projects, setProjects] = useState<InteriorProjectItem[]>(fallbackProjects);
  const [categoriesList, setCategoriesList] = useState<string[]>(['All', 'Residential', 'Commercial', 'Hospitality', 'Retail', 'Penthouse']);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveInteriors() {
      try {
        setLoading(true);
        const [liveData, liveCats] = await Promise.all([
          api.getInteriorProjects().catch(() => []),
          api.getInteriorCategories().catch(() => []),
        ]);
        if (isMounted) {
          if (liveData && liveData.length > 0) {
            setProjects(liveData);
          }
          const catNames = new Set<string>(['All']);
          if (liveCats && liveCats.length > 0) {
            liveCats.forEach(c => catNames.add(c.name));
          }
          if (liveData && liveData.length > 0) {
            liveData.forEach(p => {
              if (p.category_name) catNames.add(p.category_name);
            });
          }
          setCategoriesList(Array.from(catNames));
        }
      } catch (err) {
        console.warn('Backend unavailable, using local project catalog:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchLiveInteriors();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = activeType === 'All'
    ? projects
    : projects.filter(p => p.category_name?.toLowerCase() === activeType.toLowerCase());

  const handleProjectClick = (projectId: number) => {
    navigate(`/project-detail?id=${projectId}&type=interior`);
  };

  return (
    <section className="bg-[#fcfcfc] py-20 px-6 min-h-screen font-sans text-slate-900 relative overflow-hidden">
      {/* Floating 3D Geometric Architectural Shapes */}
      <FloatingShape
        src={SHAPES.diamond}
        size={80}
        top="4%"
        left="2%"
        blur="1px"
        opacity={0.3}
        rotate={18}
        duration={7.5}
      />
      <FloatingShape
        src={SHAPES.cone}
        size={90}
        top="18%"
        right="3%"
        blur="2px"
        opacity={0.25}
        rotate={-20}
        duration={8.5}
        delay={1}
      />
      <FloatingShape
        src={SHAPES.cylinder}
        size={65}
        bottom="12%"
        left="3%"
        blur="none"
        opacity={0.35}
        rotate={25}
        duration={7}
        delay={0.6}
      />
      <FloatingShape
        src={SHAPES.cubeAlt1}
        size={70}
        bottom="8%"
        right="4%"
        blur="none"
        opacity={0.3}
        rotate={-15}
        duration={9}
        delay={1.5}
      />

      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col mb-12 space-y-6 w-full">
          <div className="flex items-center justify-between">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-light tracking-tighter text-slate-900"
            >
              INTERIOR & <span className="font-bold text-[#205b63]">ARCHITECTURAL DESIGN</span>
            </motion.h2>
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-[#205b63]" />
                <span>Syncing live backend...</span>
              </div>
            )}
          </div>

          {/* Horizontal Scrollable Filter Bar */}
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categoriesList.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer whitespace-nowrap ${
                  activeType.toLowerCase() === type.toLowerCase() 
                  ? "bg-[#162e31] text-white border-[#162e31] shadow-xl" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#162e31] hover:text-[#162e31]"
                }`}
              >
                {(typeIcons as any)[type] || <Sparkles className="w-4 h-4" />}
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={resolveImageUrl(project.cover_image, '/tr/279A1756.JPG')}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm group-hover:bg-[#205b63] group-hover:text-white transition-colors duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono rounded-full uppercase tracking-wider">
                    {project.category_name}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                    <span>{project.location || "Addis Ababa, Ethiopia"}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#205b63] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
