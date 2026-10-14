import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Home, 
  Sparkles, 
  Coffee, 
  Store, 
  Crown, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Layers,
  TreePine,
  GraduationCap,
  HeartPulse,
  ArrowUpRight,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, resolveImageUrl, type InteriorProjectItem, type CategoryItem } from '../services/api';
import { FloatingShape, SHAPES } from './FloatingShapes';

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

const getCategoryIcon = (name: string): ReactNode => {
  const lower = name.toLowerCase();
  if (lower === 'all') return <Sparkles className="w-3.5 h-3.5" />;
  if (lower.includes('resident') || lower.includes('home') || lower.includes('villa')) return <Home className="w-3.5 h-3.5" />;
  if (lower.includes('commerc') || lower.includes('office') || lower.includes('headquarter') || lower.includes('architect')) return <Building2 className="w-3.5 h-3.5" />;
  if (lower.includes('hospit') || lower.includes('hotel') || lower.includes('resort') || lower.includes('cafe')) return <Coffee className="w-3.5 h-3.5" />;
  if (lower.includes('retail') || lower.includes('store') || lower.includes('shop') || lower.includes('mall') || lower.includes('showroom')) return <Store className="w-3.5 h-3.5" />;
  if (lower.includes('penthouse') || lower.includes('luxury') || lower.includes('estate')) return <Crown className="w-3.5 h-3.5" />;
  if (lower.includes('cultur') || lower.includes('art') || lower.includes('museum')) return <TreePine className="w-3.5 h-3.5" />;
  if (lower.includes('educat') || lower.includes('school') || lower.includes('campus')) return <GraduationCap className="w-3.5 h-3.5" />;
  if (lower.includes('health') || lower.includes('medic') || lower.includes('clinic')) return <HeartPulse className="w-3.5 h-3.5" />;
  return <Layers className="w-3.5 h-3.5" />;
};

const COLLAPSED_LIMIT = 5;

export default function SubCategoryInteriorGrid() {
  const [activeType, setActiveType] = useState<string>('All');
  const [projects, setProjects] = useState<InteriorProjectItem[]>(fallbackProjects);
  const [categoriesList, setCategoriesList] = useState<string[]>(['All']);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Load categories and projects directly from backend API
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
          if (liveCats && liveCats.length > 0) {
            setCategoriesList(['All', ...liveCats.map((c: CategoryItem) => c.name)]);
          } else if (liveData && liveData.length > 0) {
            const catNames = new Set<string>(['All']);
            liveData.forEach((p: InteriorProjectItem) => {
              if (p.category_names && p.category_names.length > 0) {
                p.category_names.forEach(n => catNames.add(n));
              } else if (p.category_name) {
                catNames.add(p.category_name);
              }
            });
            setCategoriesList(Array.from(catNames));
          }
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
    : projects.filter(p => {
        const names = p.category_names && p.category_names.length > 0
          ? p.category_names
          : (p.category_name ? [p.category_name] : []);
        return names.some(n => n.toLowerCase() === activeType.toLowerCase());
      });

  const handleProjectClick = (projectId: number) => {
    navigate(`/project-detail?id=${projectId}&type=interior`);
  };

  const hasManyCategories = categoriesList.length > COLLAPSED_LIMIT;
  const visibleCategories = isExpanded || !hasManyCategories
    ? categoriesList
    : categoriesList.slice(0, COLLAPSED_LIMIT);

  return (
    <section className="bg-[#f8fafc] py-24 px-6 sm:px-10 lg:px-16 min-h-screen font-sans text-slate-900 relative overflow-hidden">
      {/* Background Subtle Ambient Highlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(32,91,99,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(32,91,99,0.04)_0%,transparent_60%)] pointer-events-none" />

      {/* Floating 3D Geometric Architectural Shapes (Clean on light background) */}
      <FloatingShape
        src={SHAPES.diamond}
        size={80}
        top="4%"
        left="2%"
        blur="1px"
        opacity={0.35}
        rotate={18}
        duration={7.5}
      />
      <FloatingShape
        src={SHAPES.cone}
        size={90}
        top="18%"
        right="3%"
        blur="2px"
        opacity={0.3}
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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col mb-14 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#205b63] font-bold mb-2 block">
                • Spatial Curation Catalog
              </span>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-slate-900"
              >
                INTERIOR & <span className="italic font-light text-[#205b63]">ARCHITECTURAL DESIGN</span>
              </motion.h2>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Loader2 className="w-4 h-4 animate-spin text-[#205b63]" />
                <span>Syncing live backend...</span>
              </div>
            )}
          </div>

          {/* Dynamic Backend Categories Bar with Expand / Collapse Option */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            {visibleCategories.map((type) => {
              const isActive = activeType.toLowerCase() === type.toLowerCase();
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer whitespace-nowrap shadow-sm ${
                    isActive 
                      ? "bg-[#172a2b] text-white border-[#172a2b] shadow-lg shadow-black/15 scale-105" 
                      : "bg-white text-slate-700 border-slate-200/90 hover:border-[#172a2b] hover:text-[#172a2b] hover:shadow"
                  }`}
                >
                  {getCategoryIcon(type)}
                  <span>{type}</span>
                </button>
              );
            })}

            {/* Expand / Collapse Button if Many Categories */}
            {hasManyCategories && (
              <button
                type="button"
                onClick={() => setIsExpanded(prev => !prev)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border bg-slate-200/80 hover:bg-slate-300 text-slate-800 border-slate-300 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                title={isExpanded ? "Show fewer categories" : "Show all backend categories"}
              >
                <span>{isExpanded ? "Collapse" : `+${categoriesList.length - COLLAPSED_LIMIT} More`}</span>
                {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => handleProjectClick(project.id)}
                className="group relative h-[420px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                {/* Image Layer */}
                <img
                  src={resolveImageUrl(project.cover_image, '/tr/279A1756.JPG')}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity"></div>

                {/* Floating Architectural Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-[10px] text-white font-mono uppercase rounded-md tracking-wider flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-cyan-300" />
                    <span>{project.location || "Addis Ababa"}</span>
                  </span>
                  {project.is_featured && (
                    <span className="px-2.5 py-1 bg-[#205b63]/90 backdrop-blur-md border border-white/20 text-[10px] text-white font-mono uppercase rounded-md">
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-[10px] text-white font-mono rounded">
                    {project.year || "2026"}
                  </span>
                </div>

                {/* Glass Content Card */}
                <div className="absolute inset-x-3 bottom-3">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl transition-all duration-500 group-hover:bg-white/20">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-[#7db3b8] uppercase tracking-wider">
                        {project.category_names && project.category_names.length > 0
                          ? project.category_names.join(' · ')
                          : (project.category_name || "Interior")}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-2 truncate">
                      {project.title}
                    </h3>
                    <p className="text-white/70 text-[11px] leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
