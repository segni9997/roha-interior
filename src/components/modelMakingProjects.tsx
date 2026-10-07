import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Home, 
  TreePine, 
  GraduationCap, 
  HeartPulse, 
  Sparkles, 
  Layers, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Store,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, resolveImageUrl, type ModelProjectItem, type CategoryItem } from '../services/api';
import { FloatingShape, SHAPES } from './FloatingShapes';

const fallbackModelProjects: ModelProjectItem[] = [
  {
    id: 1,
    title: "Modern Residential Complex Scale Model",
    slug: "modern-residential-complex-scale-model",
    category: 1,
    category_name: "Architecture",
    scale_ratio: "1:50",
    year: "2024",
    day: "Monday",
    precision_tolerance: "0.1mm",
    materials_used: "Laser-cut acrylic, basswood, SLA resin",
    fabrication_methods: "Hybrid 3D Printing, Laser Cutting",
    description: "High-detail architectural scale model showcasing residential massing, fenestration louvers, and interior floor sections.",
    cover_image: "/tr/279A1812.JPG",
    is_featured: true,
    order: 1
  },
  {
    id: 2,
    title: "Corporate Headquarters Scale Model",
    slug: "corporate-headquarters-scale-model",
    category: 2,
    category_name: "Commercial",
    scale_ratio: "1:100",
    year: "2023",
    day: "Tuesday",
    precision_tolerance: "0.1mm",
    materials_used: "Laser-cut acrylic, brass rod joinery",
    fabrication_methods: "CNC Milling, Laser Cutting",
    description: "Laser-cut acrylic tower model with integrated 3000K warm floor illumination and CNC-milled topography base.",
    cover_image: "/tr/279A1816.JPG",
    is_featured: true,
    order: 2
  },
  {
    id: 3,
    title: "Cultural Arts Center Massing Model",
    slug: "cultural-arts-center-massing-model",
    category: 3,
    category_name: "Cultural",
    scale_ratio: "1:200",
    year: "2024",
    day: "Wednesday",
    precision_tolerance: "0.1mm",
    materials_used: "Hybrid resin 3D print, basswood",
    fabrication_methods: "High-Resolution SLA Resin, Hand Finishing",
    description: "Fluid organic geometric physical model using hybrid high-resolution SLA resin 3D printing and hand finishing.",
    cover_image: "/tr/4V0A0305.JPG",
    is_featured: true,
    order: 3
  },
  {
    id: 4,
    title: "Luxury Hotel Resort Physical Model",
    slug: "luxury-hotel-resort-physical-model",
    category: 4,
    category_name: "Hospitality",
    scale_ratio: "1:250",
    year: "2023",
    day: "Thursday",
    precision_tolerance: "0.1mm",
    materials_used: "Contour-layered basswood, cast acrylic",
    fabrication_methods: "Laser Topography, Precision Assembly",
    description: "Five-star resort model featuring contour-layered topography, miniature landscape features, and illuminated pools.",
    cover_image: "/tr/4V0A0308.JPG",
    is_featured: true,
    order: 4
  },
  {
    id: 5,
    title: "Educational Campus Scale Model",
    slug: "educational-campus-scale-model",
    category: 5,
    category_name: "Educational",
    scale_ratio: "1:500",
    year: "2024",
    day: "Friday",
    precision_tolerance: "0.1mm",
    materials_used: "Laser acrylic, frosted resin",
    fabrication_methods: "SLA Printing, Modular Assemblies",
    description: "Comprehensive masterplan model with interchangeable pavilion massing and perimeter pedestrian canopies.",
    cover_image: "/1.jpg",
    is_featured: true,
    order: 5
  },
  {
    id: 6,
    title: "Shopping Mall Complex Scale Study",
    slug: "shopping-mall-complex-scale-study",
    category: 2,
    category_name: "Commercial",
    scale_ratio: "1:150",
    year: "2023",
    day: "Saturday",
    precision_tolerance: "0.1mm",
    materials_used: "Translucent frosted acrylic, brass trusses",
    fabrication_methods: "CNC Wire EDM, Laser Cutting",
    description: "Translucent frosted acrylic atrium with visible internal escalators and structural space-frame trusses.",
    cover_image: "/3.jpg",
    is_featured: true,
    order: 6
  },
  {
    id: 7,
    title: "Healthcare Facility Physical Model",
    slug: "healthcare-facility-physical-model",
    category: 6,
    category_name: "Healthcare",
    scale_ratio: "1:100",
    year: "2024",
    day: "Sunday",
    precision_tolerance: "0.1mm",
    materials_used: "Color-coded acrylic, LED illumination",
    fabrication_methods: "Modular 3D Printing, Electronics Integration",
    description: "Advanced medical center physical model with color-coded modular zoning and helipad lighting.",
    cover_image: "/20240807_180203.jpg",
    is_featured: true,
    order: 7
  },
  {
    id: 8,
    title: "Mixed-Use Urban Development Model",
    slug: "mixed-use-urban-development-model",
    category: 7,
    category_name: "Mixed-Use",
    scale_ratio: "1:200",
    year: "2023",
    day: "Monday",
    precision_tolerance: "0.1mm",
    materials_used: "Precision acrylic blocks, timber base",
    fabrication_methods: "Laser Cutting, CNC Milling",
    description: "Dense urban block model highlighting transit hub integration, multi-level skybridges, and pocket parks.",
    cover_image: "/tr/279A1816.JPG",
    is_featured: true,
    order: 8
  }
];

const getCategoryIcon = (name: string): ReactNode => {
  const lower = name.toLowerCase();
  if (lower === 'all') return <Sparkles className="w-3.5 h-3.5" />;
  if (lower.includes('architect') || lower.includes('urban') || lower.includes('resident')) return <Building2 className="w-3.5 h-3.5" />;
  if (lower.includes('commerc') || lower.includes('tower') || lower.includes('office')) return <Building2 className="w-3.5 h-3.5" />;
  if (lower.includes('cultur') || lower.includes('art') || lower.includes('museum') || lower.includes('landscape')) return <TreePine className="w-3.5 h-3.5" />;
  if (lower.includes('hospit') || lower.includes('hotel') || lower.includes('resort')) return <Home className="w-3.5 h-3.5" />;
  if (lower.includes('educat') || lower.includes('school') || lower.includes('campus') || lower.includes('univers')) return <GraduationCap className="w-3.5 h-3.5" />;
  if (lower.includes('health') || lower.includes('medic') || lower.includes('hospital')) return <HeartPulse className="w-3.5 h-3.5" />;
  if (lower.includes('retail') || lower.includes('mall') || lower.includes('store')) return <Store className="w-3.5 h-3.5" />;
  if (lower.includes('luxury') || lower.includes('master')) return <Crown className="w-3.5 h-3.5" />;
  return <Layers className="w-3.5 h-3.5" />;
};

const CARD_THEMES = [
  {
    bg: "from-[#1c2c30] via-[#142225] to-[#0d1618]",
    fade: "from-[#1c2c30]",
    border: "border-cyan-500/20",
    accent: "group-hover:text-cyan-300",
  },
  {
    bg: "from-[#242e22] via-[#1b2319] to-[#121811]",
    fade: "from-[#242e22]",
    border: "border-emerald-500/20",
    accent: "group-hover:text-emerald-300",
  },
  {
    bg: "from-[#2b2129] via-[#20181e] to-[#150f14]",
    fade: "from-[#2b2129]",
    border: "border-purple-500/20",
    accent: "group-hover:text-purple-300",
  },
  {
    bg: "from-[#2e261d] via-[#231c15] to-[#17120d]",
    fade: "from-[#2e261d]",
    border: "border-amber-500/20",
    accent: "group-hover:text-amber-300",
  },
];

const COLLAPSED_LIMIT = 5;

export default function SubCategoryModelGrid() {
  const [activeType, setActiveType] = useState<string>('All');
  const [projects, setProjects] = useState<ModelProjectItem[]>(fallbackModelProjects);
  const [categoriesList, setCategoriesList] = useState<string[]>(['All', 'Architecture', 'Commercial', 'Cultural', 'Hospitality', 'Educational', 'Healthcare', 'Mixed-Use']);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Load categories and projects directly from backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveModels() {
      try {
        setLoading(true);
        const [liveModels, liveCats] = await Promise.all([
          api.getModelProjects().catch(() => []),
          api.getModelCategories().catch(() => []),
        ]);
        if (isMounted) {
          if (liveModels && liveModels.length > 0) {
            setProjects(liveModels);
          }
          const catNames = new Set<string>(['All']);
          if (liveCats && liveCats.length > 0) {
            liveCats.forEach((c: CategoryItem) => {
              if (c.name) catNames.add(c.name);
            });
          }
          if (liveModels && liveModels.length > 0) {
            liveModels.forEach((p: ModelProjectItem) => {
              if (p.category_name) catNames.add(p.category_name);
            });
          }
          setCategoriesList(Array.from(catNames));
        }
      } catch (err) {
        console.warn('Backend unavailable, using local model archive:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchLiveModels();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = activeType === 'All'
    ? projects
    : projects.filter(p => p.category_name?.toLowerCase() === activeType.toLowerCase());

  const handleProjectClick = (projectId: number) => {
    navigate(`/project-detail?id=${projectId}&type=model`);
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
        src={SHAPES.cone}
        size={85}
        top="4%"
        left="2%"
        blur="1px"
        opacity={0.3}
        rotate={-18}
        duration={7.5}
      />
      <FloatingShape
        src={SHAPES.cubeAlt2}
        size={95}
        top="18%"
        right="3%"
        blur="2px"
        opacity={0.25}
        rotate={25}
        duration={8.5}
        delay={1}
      />
      <FloatingShape
        src={SHAPES.diamond}
        size={60}
        bottom="12%"
        left="3%"
        blur="none"
        opacity={0.35}
        rotate={30}
        duration={7}
        delay={0.6}
      />
      <FloatingShape
        src={SHAPES.cylinder}
        size={70}
        bottom="8%"
        right="4%"
        blur="none"
        opacity={0.3}
        rotate={-20}
        duration={9}
        delay={1.5}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col mb-14 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#395e63] font-bold mb-2 block">
                • Physical Fabrication Archive
              </span>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-slate-900 uppercase"
              >
                PHYSICAL SCALE <span className="italic font-light text-[#395e63]">MODELING MAKING</span>
              </motion.h2>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Loader2 className="w-4 h-4 animate-spin text-[#395e63]" />
                <span>Syncing live models...</span>
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

        {/* Project Grid (Exact Match to Reference Luxury Pill Design on Light Backdrop) */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];
              const methodTag = project.fabrication_methods
                ? project.fabrication_methods.split(',')[0].trim()
                : `±${project.precision_tolerance || "0.1mm"}`;

              return (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  onClick={() => handleProjectClick(project.id)}
                  className={`group relative rounded-[34px] overflow-hidden bg-gradient-to-b ${theme.bg} border ${theme.border} shadow-[0_20px_50px_rgba(0,0,0,0.22)] hover:shadow-[0_28px_65px_rgba(0,0,0,0.35)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col justify-between`}
                >
                  {/* Top Image Section with Smooth Bottom Gradient Fade */}
                  <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img 
                      src={resolveImageUrl(project.cover_image, '/tr/279A1812.JPG')} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Seamless atmospheric gradient fade into card surface */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent opacity-80" />
                    <div className={`absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t ${theme.fade} via-${theme.fade}/85 to-transparent`} />
                  </div>

                  {/* Transition Indicator Dots (· · ·) */}
                  <div className="relative z-10 flex items-center justify-center gap-1.5 -mt-3 mb-1 pointer-events-none">
                    <span className="w-3.5 h-1 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                  </div>

                  {/* Card Body Content */}
                  <div className="p-6 sm:p-7 pt-2 flex flex-col justify-between flex-1">
                    <div>
                      {/* Title & Scale Badge Row */}
                      <div className="flex items-center justify-between gap-3">
                        <h3 className={`text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug transition-colors ${theme.accent}`}>
                          {project.title}
                        </h3>
                        <span className="shrink-0 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white font-mono text-xs font-semibold shadow-sm">
                          {project.scale_ratio ? `1:${project.scale_ratio.replace('1:', '')}` : "1:50"}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed line-clamp-2 mt-2.5 font-light">
                        {project.description}
                      </p>

                      {/* Tags Row */}
                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/10 backdrop-blur-md">
                          {project.category_name || "Architecture"}
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/10 backdrop-blur-md">
                          {methodTag}
                        </span>
                      </div>
                    </div>

                    {/* Full-width Rounded Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick(project.id);
                      }}
                      className="w-full mt-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm tracking-wide text-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.35)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      Reserve & Explore
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}