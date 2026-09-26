import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Layers,
  Move3D,
  BookOpen,
  Plus,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { api, type ContactInquiryItem } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [counts, setCounts] = useState({
    interiors: 0,
    models: 0,
    tours: 0,
    blogs: 0,
    inquiries: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<ContactInquiryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [interiors, models, tours, blogs, inquiries] = await Promise.allSettled([
          api.getInteriorProjects(),
          api.getModelProjects(),
          api.getPanoramicTours(),
          api.getBlogPosts(),
          api.getInquiries(),
        ]);

        const inqList = inquiries.status === 'fulfilled' ? inquiries.value : [];
        setRecentInquiries(inqList.slice(0, 5));

        setCounts({
          interiors: interiors.status === 'fulfilled' ? interiors.value.length : 0,
          models: models.status === 'fulfilled' ? models.value.length : 0,
          tours: tours.status === 'fulfilled' ? tours.value.length : 0,
          blogs: blogs.status === 'fulfilled' ? blogs.value.length : 0,
          inquiries: inqList.length,
        });
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Interior Archive',
      count: counts.interiors,
      unit: 'Projects',
      icon: Home,
      to: '/admin/interior',
      accent: 'border-teal-800/60 text-teal-400',
    },
    {
      title: 'Scale Modeling',
      count: counts.models,
      unit: 'Physical Models',
      icon: Layers,
      to: '/admin/models',
      accent: 'border-amber-800/60 text-amber-400',
    },
    {
      title: 'Virtual Tours',
      count: counts.tours,
      unit: '360° Tours',
      icon: Move3D,
      to: '/admin/tours',
      accent: 'border-sky-800/60 text-sky-400',
    },
    {
      title: 'Built Stories',
      count: counts.blogs,
      unit: 'Journal Posts',
      icon: BookOpen,
      to: '/admin/blog',
      accent: 'border-indigo-800/60 text-indigo-400',
    },
  ];

  return (
    <div className="space-y-10">
      {/* --- EXECUTIVE BANNER --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#112224] via-[#162e31] to-[#0e1719] border border-slate-800 p-8 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Django API Connected • Port 8000</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              Studio Operations Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl mt-1.5">
              Curate architectural case studies, scale prototyping specifications, 360 interactive panoramas, and incoming client consultation leads.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/interior"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#205b63] hover:bg-[#2a737d] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
            >
              <Plus size={14} />
              <span>Add Interior</span>
            </Link>
            <Link
              to="/admin/models"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-all"
            >
              <Plus size={14} />
              <span>Add Model</span>
            </Link>
          </div>
        </div>
      </div>

      {/* --- STAT METRIC CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.to}
              className="group relative bg-[#0e1719] border border-slate-800/80 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/5 border ${card.accent}`}>
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={18} className="text-slate-500 group-hover:text-white transition-colors" />
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {loading ? '—' : card.count}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{card.unit}</span>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                  {card.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>

      {/* --- RECENT LEADS & QUICK CMS BUILDER --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Client Consultation Leads */}
        <div className="lg:col-span-2 bg-[#0e1719] border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight uppercase">Recent Inquiries</h2>
                <p className="text-xs text-slate-400 font-mono">Incoming project consultation requests</p>
              </div>
              <Link
                to="/admin/inquiries"
                className="text-xs font-bold text-[#395e63] hover:text-cyan-300 uppercase tracking-wider flex items-center gap-1"
              >
                <span>View Inbox ({counts.inquiries})</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center items-center gap-2 text-slate-500 text-xs font-mono">
                <Loader2 className="w-4 h-4 animate-spin text-[#205b63]" />
                <span>Loading inquiries...</span>
              </div>
            ) : recentInquiries.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs font-mono">
                No client inquiries recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {recentInquiries.map((inq) => (
                  <div key={inq.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate">
                          {inq.first_name} {inq.last_name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-[#205b63]/20 text-cyan-300 border border-[#205b63]/40">
                          {inq.service_interest}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{inq.message}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-400">
            <span>Submissions save directly to Django database</span>
            <Link to="/contactus" target="_blank" className="text-slate-300 hover:text-white flex items-center gap-1">
              <span>Test Contact Form</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Right: Quick Page Content Builder Shortcuts */}
        <div className="bg-[#0e1719] border border-slate-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight uppercase mb-1">
              Content Builder
            </h2>
            <p className="text-xs text-slate-400 font-mono mb-6">Manage dynamic sections per page</p>

            <div className="space-y-2.5">
              {[
                { slug: 'home', title: 'Home Page', path: '/' },
                { slug: 'interior', title: 'Interior Architecture', path: '/interior' },
                { slug: 'model-making', title: 'Scale Model Archive', path: '/model-making' },
                { slug: 'about', title: 'About ROHA Studio', path: '/about' },
                { slug: 'gallery', title: '360 VR Gallery', path: '/gallery' },
              ].map((p) => (
                <div
                  key={p.slug}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{p.title}</p>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{p.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/admin/pages"
                      className="px-2.5 py-1 rounded-lg bg-[#205b63]/40 hover:bg-[#205b63] text-cyan-300 hover:text-white text-[10px] font-bold uppercase transition-colors"
                    >
                      Edit
                    </Link>
                    <a
                      href={p.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-slate-500 hover:text-white"
                      title="View Page"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/60 mt-6">
            <Link
              to="/admin/pages"
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-all"
            >
              <span>Manage All Pages</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
