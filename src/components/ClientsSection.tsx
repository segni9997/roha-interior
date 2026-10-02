import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Briefcase, 
  Layers,
  ArrowUpRight,
  Landmark,
  Plane,
  Hotel
} from 'lucide-react';
import { api, resolveImageUrl, type TrustedClientItem } from '../services/api';
import { FloatingShape, SHAPES } from './FloatingShapes';

const FALLBACK_CLIENTS: TrustedClientItem[] = [
  {
    id: 1,
    name: "Ethiopian Airlines Group",
    industry: "Aviation & Infrastructure",
    project_count: "Corporate HQ & VIP Skylight Lounges",
    logo: "/roha.png",
    featured: true,
    order: 1,
    website_url: "#"
  },
  {
    id: 2,
    name: "Commercial Bank of Ethiopia",
    industry: "Banking & Finance",
    project_count: "Headquarters Model & Executive Suites",
    logo: "/roha.png",
    featured: true,
    order: 2,
    website_url: "#"
  },
  {
    id: 3,
    name: "MIDROC Investment Group",
    industry: "Real Estate & Hospitality",
    project_count: "Monolithic Residential & Resort Layouts",
    logo: "/roha.png",
    featured: true,
    order: 3,
    website_url: "#"
  },
  {
    id: 4,
    name: "Marriott Executive Apartments",
    industry: "Hospitality & Leisure",
    project_count: "Bespoke Suites & Spatial Curation",
    logo: "/roha.png",
    featured: true,
    order: 4,
    website_url: "#"
  },
  {
    id: 5,
    name: "Sunshine Construction & Dev.",
    industry: "Commercial & Mixed-Use",
    project_count: "Multi-acre Masterplan Scale Models",
    logo: "/roha.png",
    featured: true,
    order: 5,
    website_url: "#"
  },
  {
    id: 6,
    name: "Noah Real Estate",
    industry: "Residential Developments",
    project_count: "High-Rise Typology Scale Exhibits",
    logo: "/roha.png",
    featured: true,
    order: 6,
    website_url: "#"
  },
  {
    id: 7,
    name: "Hilton Addis Ababa",
    industry: "Hospitality & Leisure",
    project_count: "Grand Ballroom & Heritage Lounge",
    logo: "/roha.png",
    featured: true,
    order: 7,
    website_url: "#"
  },
  {
    id: 8,
    name: "Gift Real Estate Group",
    industry: "Residential & Commercial",
    project_count: "Township & Gated Community Models",
    logo: "/roha.png",
    featured: true,
    order: 8,
    website_url: "#"
  },
];

const INDUSTRIES = [
  "All",
  "Real Estate & Development",
  "Hospitality & Leisure",
  "Banking & Finance",
  "Aviation & Infrastructure",
  "Commercial & Mixed-Use",
  "Residential Developments"
];

const getIndustryIcon = (industry: string) => {
  const ind = industry.toLowerCase();
  if (ind.includes('aviation') || ind.includes('infrastructure')) return <Plane className="w-4 h-4 text-cyan-400" />;
  if (ind.includes('banking') || ind.includes('finance')) return <Landmark className="w-4 h-4 text-amber-400" />;
  if (ind.includes('hospitality') || ind.includes('hotel')) return <Hotel className="w-4 h-4 text-emerald-400" />;
  if (ind.includes('residential')) return <Building2 className="w-4 h-4 text-teal-400" />;
  return <Briefcase className="w-4 h-4 text-cyan-300" />;
};

export const ClientsSection: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [clients, setClients] = useState<TrustedClientItem[]>(FALLBACK_CLIENTS);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadClients() {
      try {
        setLoading(true);
        const liveClients = await api.getTrustedClients();
        if (isMounted && liveClients && liveClients.length > 0) {
          setClients(liveClients);
        }
      } catch (err) {
        console.warn("Using default client partners catalog:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadClients();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredClients = clients.filter((c) => {
    if (activeFilter === "All") return true;
    return c.industry.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <section 
      id="clients-section" 
      className={`w-full relative py-20 sm:py-28 bg-[#0b1416] text-white font-sans overflow-hidden border-t border-slate-800 ${className}`}
    >
      {/* Background Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(32, 91, 99, 0.45) 0%, transparent 60%),
                           radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)`,
          backgroundSize: '100% 100%'
        }}
      />

      {/* Floating 3D Geometric Architectural Shapes from public/ */}
      <FloatingShape
        src={SHAPES.cone}
        size={90}
        top="6%"
        left="3%"
        blur="1px"
        opacity={0.35}
        rotate={-15}
        duration={8}
      />
      <FloatingShape
        src={SHAPES.cubeAlt1}
        size={75}
        top="18%"
        right="4%"
        blur="none"
        opacity={0.4}
        rotate={25}
        duration={7}
        delay={1}
      />
      <FloatingShape
        src={SHAPES.diamond}
        size={60}
        bottom="10%"
        left="5%"
        blur="2px"
        opacity={0.3}
        rotate={35}
        duration={9}
        delay={0.5}
      />
      <FloatingShape
        src={SHAPES.cylinder}
        size={80}
        bottom="14%"
        right="6%"
        blur="none"
        opacity={0.35}
        rotate={-20}
        duration={8.5}
        delay={1.8}
      />

      <div className="w-full px-4 sm:px-8 md:px-12 relative z-20">
        
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 sm:w-14 h-[3px] bg-[#205b63]" />
              <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] font-bold text-cyan-400 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#205b63]" />
                Trusted Partnerships & Client Portfolio
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase">
              OUR CLIENTS & <span className="text-[#205b63]">PARTNERS</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 font-light max-w-lg leading-relaxed border-r-4 border-[#205b63] pr-4 sm:pr-5">
            Collaborating with leading developers, architectural studios, corporate enterprises, and private visionaries to deliver high-precision spatial curation and physical scale craftsmanship.
          </p>
        </div>

        {/* --- TRUST METRICS BAR --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 sm:mb-16">
          {[
            { metric: "50+", label: "Enterprise Clients", sub: "National & Regional Leaders", icon: Building2 },
            { metric: "120+", label: "Completed Commissions", sub: "Physical Models & Spatial Projects", icon: Layers },
            { metric: "0.1mm", label: "Precision Standard", sub: "Micro-tolerance Fabrication", icon: Award },
            { metric: "100%", label: "Client Satisfaction", sub: "Repeat Partnerships & Trust", icon: CheckCircle2 },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#101e21]/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-[#205b63]/60 transition-all duration-300 group shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl sm:text-4xl font-black text-white font-mono tracking-tight group-hover:text-cyan-300 transition-colors">
                    {stat.metric}
                  </span>
                  <div className="p-2 rounded-xl bg-white/5 group-hover:bg-[#205b63]/30 transition-colors">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                  {stat.label}
                </p>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">
                  {stat.sub}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* --- INFINITE MOVING CLIENT RIBBON (MARQUEE) --- */}
        <div className="relative mb-14 py-6 px-4 rounded-2xl bg-gradient-to-r from-[#0d1a1d] via-[#122427] to-[#0d1a1d] border border-slate-800/80 overflow-hidden shadow-2xl">
          <div className="absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-[#0b1416] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-[#0b1416] to-transparent z-10 pointer-events-none" />
          
          <div className="flex gap-8 sm:gap-12 animate-marquee whitespace-nowrap items-center">
            {[...clients, ...clients].map((client, idx) => (
              <div 
                key={`${client.id}-${idx}`}
                className="inline-flex items-center gap-3.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-white/10 transition-all duration-300 group cursor-default"
              >
                <div className="w-7 h-7 rounded-full bg-[#205b63]/40 border border-[#205b63] flex items-center justify-center p-1 shrink-0">
                  <img
                    src={resolveImageUrl(client.logo, '/roha.png')}
                    alt={client.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-200 group-hover:text-white uppercase font-sans">
                  {client.name}
                </span>
                <span className="text-[10px] font-mono text-cyan-400/80 px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/40">
                  {client.industry.split('&')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- INDUSTRY CATEGORY FILTER PILLS --- */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveFilter(ind)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeFilter.toLowerCase() === ind.toLowerCase()
                  ? 'bg-[#205b63] text-white font-bold border border-cyan-400/40 shadow-lg shadow-teal-950/80 scale-105'
                  : 'bg-[#101e21] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{ind}</span>
            </button>
          ))}
        </div>

        {/* --- CLIENTS GRID SHOWCASE --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredClients.map((client, idx) => (
              <motion.div
                key={client.id || idx}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="relative bg-gradient-to-b from-[#112124] to-[#0d191b] p-6 rounded-2xl border border-slate-800 hover:border-[#205b63] transition-all duration-300 shadow-xl group flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top card glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#205b63]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#205b63]/25 transition-all" />

                <div>
                  {/* Header with Logo and Industry Tag */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md p-2 border border-white/15 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                      <img
                        src={resolveImageUrl(client.logo, '/roha.png')}
                        alt={client.name}
                        className="w-full h-full object-contain filter drop-shadow"
                      />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-[#205b63]/30 text-cyan-300 border border-[#205b63]/60">
                      {getIndustryIcon(client.industry)}
                      {client.industry}
                    </span>
                  </div>

                  {/* Client Name */}
                  <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-cyan-200 transition-colors uppercase tracking-tight mb-2">
                    {client.name}
                  </h3>

                  {/* Scope / Commission details */}
                  <p className="text-xs text-slate-300 font-light leading-relaxed mb-4">
                    {client.project_count || "Executive Architectural & Scale Fabrication Works"}
                  </p>
                </div>

                {/* Footer status & verified alliance tag */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 size={13} /> Verified Alliance
                  </span>
                  <span className="text-slate-500 group-hover:text-cyan-300 transition-colors">
                    ROHA Studio
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default ClientsSection;
