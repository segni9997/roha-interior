import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Building2, Home, TreePine, GraduationCap, HeartPulse, Sparkles, Layers, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, resolveImageUrl, type ModelProjectItem } from '../services/api';

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

export type ProjectType = "All" | "Architecture" | "Commercial" | "Cultural" | "Hospitality" | "Educational" | "Healthcare" | "Mixed-Use";

const typeIcons: Record<string, ReactNode> = {
  All: <Sparkles className="w-4 h-4" />,
  Architecture: <Building2 className="w-4 h-4" />,
  Commercial: <Building2 className="w-4 h-4" />,
  Cultural: <TreePine className="w-4 h-4" />,
  Hospitality: <Home className="w-4 h-4" />,
  Educational: <GraduationCap className="w-4 h-4" />,
  Healthcare: <HeartPulse className="w-4 h-4" />,
  "Mixed-Use": <Layers className="w-4 h-4" />
};

export default function SubCategoryModelGrid() {
  const [activeType, setActiveType] = useState<string>('All');
  const [projects, setProjects] = useState<ModelProjectItem[]>(fallbackModelProjects);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const types = ['All', 'Architecture', 'Commercial', 'Cultural', 'Hospitality', 'Educational', 'Healthcare', 'Mixed-Use'];

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveModels() {
      try {
        setLoading(true);
        const liveModels = await api.getModelProjects();
        if (isMounted && liveModels && liveModels.length > 0) {
          setProjects(liveModels);
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

  return (
    <section className="bg-[#fcfcfc] py-20 px-6 min-h-screen font-sans text-slate-900 relative">
      <div className="max-w-8xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col mb-12 space-y-6 w-full">
          <div className="flex items-center justify-between">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-light tracking-tighter text-slate-900"
            >
              MODELING <span className="font-bold text-[#395e63]">ARCHIVE</span>
            </motion.h2>
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-[#395e63]" />
                <span>Syncing live backend...</span>
              </div>
            )}
          </div>

          {/* Horizontal Scrollable Filter Bar */}
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
                  activeType === type 
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl" 
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-900 hover:text-slate-900"
                }`}
              >
                {typeIcons[type] || <Building2 className="w-3 h-3" />}
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
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
                  src={resolveImageUrl(project.cover_image, '/tr/279A1812.JPG')} 
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity"></div>

                {/* Floating Scale & Tolerance Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-[10px] text-white font-mono uppercase rounded-md tracking-wider">
                    SCALE {project.scale_ratio}
                  </span>
                  <span className="px-2.5 py-1 bg-[#395e63]/90 backdrop-blur-md border border-white/20 text-[10px] text-white font-mono uppercase rounded-md">
                    ±{project.precision_tolerance || "0.1mm"}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-[10px] text-white font-mono rounded">
                    {project.year}
                  </span>
                </div>

                {/* Glass Content Card */}
                <div className="absolute inset-x-3 bottom-3">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl transition-all duration-500 group-hover:bg-white/20">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-[#7db3b8] uppercase tracking-wider">
                        {project.category_name}
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