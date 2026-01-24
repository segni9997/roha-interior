import  { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Building2, Home, TreePine, GraduationCap, HeartPulse,  } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Use your provided Project interface and data
const projects = [
  { id: 1, title: "Modern Residential Complex", type: "Residential", category: "Architecture", year: "2024", day: "Monday", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab", description: "A contemporary residential development with sustainable design principles" },
  { id: 2, title: "Corporate Headquarters", type: "Commercial", category: "Office", year: "2023", day: "Tuesday", image: "https://images.unsplash.com/photo-1497366216548-37526070297c", description: "State-of-the-art corporate building with innovative workspace design" },
  { id: 3, title: "Cultural Center", type: "Public", category: "Cultural", year: "2024", day: "Wednesday", image: "https://images.unsplash.com/photo-1503387762-592dea58ef21", description: "Multi-purpose cultural facility serving the local community" },
  { id: 4, title: "Luxury Hotel Resort", type: "Hospitality", category: "Tourism", year: "2023", day: "Thursday", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd", description: "Five-star resort with panoramic views and premium amenities" },
  { id: 5, title: "Educational Campus", type: "Educational", category: "Institution", year: "2024", day: "Friday", image: "https://images.unsplash.com/photo-1541339907198-e08759dfeb3f", description: "Modern university campus with integrated learning spaces" },
  { id: 6, title: "Shopping Mall Complex", type: "Commercial", category: "Retail", year: "2023", day: "Saturday", image: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6", description: "Large-scale retail complex with entertainment facilities" },
  { id: 7, title: "Healthcare Facility", type: "Healthcare", category: "Medical", year: "2024", day: "Sunday", image: "https://images.unsplash.com/photo-1586773860418-d3b9ad976c6c", description: "Advanced medical center with patient-centered design" },
  { id: 8, title: "Mixed-Use Development", type: "Mixed-Use", category: "Urban", year: "2023", day: "Monday", image: "https://images.unsplash.com/photo-1449156059431-787c5d7139b8", description: "Integrated development combining residential, commercial, and office spaces" },
];

type ProjectType =
  | "All"
  | "Residential"
  | "Commercial"
  | "Public"
  | "Educational"
  | "Healthcare";
// Map icons to types for a better UI
const typeIcons: Record<ProjectType, ReactNode> = {
  All: <Building2 className="w-4 h-4" />,
  Residential: <Home className="w-4 h-4" />,
  Commercial: <Building2 className="w-4 h-4" />,
  Public: <TreePine className="w-4 h-4" />,
  Educational: <GraduationCap className="w-4 h-4" />,
  Healthcare: <HeartPulse className="w-4 h-4" />,
};

export default function SubCategoryModelGrid() {
  const [activeType, setActiveType] = useState('All');
  const types = ['All', ...new Set(projects.map(p => p.type))];
  const navigate = useNavigate();

  const filteredProjects = activeType === 'All'
    ? projects
    : projects.filter(p => p.type === activeType);

  const handleProjectClick = (projectId: number) => {
    navigate(`/project-detail?id=${projectId}`);
  };

  return (
    <section className="bg-[#fcfcfc] py-20 px-6 min-h-screen font-sans text-slate-900 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col mb-12 space-y-6 w-full">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-light tracking-tighter absolute -top-2 z-30 text-center"
          >
            MODELING <span className="font-bold text-[#395e63]">ARCHIVE</span>
          </motion.h2>

          {/* Horizontal Scrollable Filter Bar */}
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                  activeType === type 
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl" 
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-900 hover:text-slate-900"
                }`}
              >
                {typeIcons[type as ProjectType] || <Building2 className="w-3 h-3" />}
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
            <Link to="/project-detail">
  <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative h-[400px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer"
                onClick={() => handleProjectClick(project.id)}
              >
                {/* Image Layer */}
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                {/* Floating Meta Data (Year/Day) */}
                <div className="absolute top-4 left-4 flex gap-2">
                   <span className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] text-white font-mono uppercase">
                     {project.year}
                   </span>
                </div>

                {/* Glass Content Card */}
                <div className="absolute inset-x-3 bottom-3">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl transition-all duration-500 group-hover:bg-white/20">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-[#7db3b8] uppercase tracking-tighter">
                        {project.type} / {project.category}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight mb-2 truncate">
                      {project.title}
                    </h3>
                    <p className="text-white/60 text-[11px] leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                      {project.description}
                    </p>
                  </div>
                </div>
              </motion.div>

            </Link>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}