import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  FolderKanban,
  Compass,
  Users,
  ArrowUpRight,
  Check,
  Plus,
  Loader2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  api,
  resolveImageUrl,
  type InteriorProjectItem,
  type ContactInquiryItem
} from '../../services/api';
import { useAdminAuth } from '../AdminAuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAdminAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    interiors: 0,
    models: 0,
    tours: 0,
    blogs: 0,
    inquiries: 0,
  });
  const [latestProjects, setLatestProjects] = useState<InteriorProjectItem[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<ContactInquiryItem[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [interiors, models, tours, blogs, inquiries] = await Promise.allSettled([
          api.getInteriorProjects(),
          api.getModelProjects(),
          api.getPanoramicTours(),
          api.getBlogPosts(),
          api.getInquiries(),
        ]);

        const intList = interiors.status === 'fulfilled' ? interiors.value : [];
        const inqList = inquiries.status === 'fulfilled' ? inquiries.value : [];

        setLatestProjects(intList.slice(0, 3));
        setRecentInquiries(inqList.slice(0, 4));

        setCounts({
          interiors: intList.length,
          models: models.status === 'fulfilled' ? models.value.length : 0,
          tours: tours.status === 'fulfilled' ? tours.value.length : 0,
          blogs: blogs.status === 'fulfilled' ? blogs.value.length : 0,
          inquiries: inqList.length,
        });
      } catch (err) {
        console.error('Failed to load studio dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const toggleTask = (key: string) => {
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Format today's date in architectural editorial style
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const metricCards = [
    {
      label: 'Published projects',
      value: counts.interiors < 10 ? `0${counts.interiors}` : `${counts.interiors}`,
      target: '/admin/interior',
      icon: Building2,
      tint: 'stone',
      subtext: 'Interior & built work'
    },
    {
      label: 'Precision models',
      value: counts.models < 10 ? `0${counts.models}` : `${counts.models}`,
      target: '/admin/models',
      icon: FolderKanban,
      tint: 'peach',
      subtext: 'Fabrication archive'
    },
    {
      label: 'Virtual experiences',
      value: counts.tours < 10 ? `0${counts.tours}` : `${counts.tours}`,
      target: '/admin/tours',
      icon: Compass,
      tint: 'blue',
      subtext: '360° Panorama spaces'
    },
    {
      label: 'Client inquiries',
      value: counts.inquiries < 10 ? `0${counts.inquiries}` : `${counts.inquiries}`,
      target: '/admin/inquiries',
      icon: Users,
      tint: 'sage',
      subtext: 'Active consultations'
    },
  ];

  const focusTasks = [
    { id: 'inquiries', title: `Review ${counts.inquiries > 0 ? counts.inquiries : 'new'} client inquiries`, target: '/admin/inquiries' },
    { id: 'projects', title: 'Curate latest interior photography & gallery', target: '/admin/interior' },
    { id: 'models', title: 'Inspect precision scale model specifications', target: '/admin/models' },
    { id: 'metrics', title: 'Update studio showcase numbers & narrative', target: '/admin/settings' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* -------------------- GREETING & HERO HEADER -------------------- */}
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end border-b border-white/10 pb-8">
        <div>
          <p className="eyebrow mb-2.5 text-cyan-400">{todayFormatted}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.035em] text-white">
            Good day, {user?.username ? user.username : 'Director'}.
          </h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-300">
            Your architectural studio is moving beautifully. Here is the operational pulse and what requires your curation today.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-button shadow-sm"
          >
            <ArrowUpRight size={15} />
            <span>Live studio</span>
          </a>
          <Link
            to="/admin/builder/interior"
            className="secondary-button bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/60 border-cyan-500/30 shadow-xs"
            title="Launch Visual Editorial Project Builder"
          >
            <Sparkles size={15} className="text-cyan-400" />
            <span>Studio Project Builder</span>
          </Link>
          <button
            onClick={() => navigate('/admin/interior')}
            className="primary-button shadow-sm"
          >
            <Plus size={15} />
            <span>Quick add</span>
          </button>
        </div>
      </section>

      {/* -------------------- VISUAL PROJECT BUILDER BANNER -------------------- */}
      <section className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#132527] to-[#101e20] border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-xs shrink-0">
            <Sparkles size={22} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-0.5">
              Visual Editorial Workspace
            </span>
            <h3 className="font-display text-lg font-semibold text-white">
              Architectural & Scale Model Project Builder
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Compose complete project monographs, reorder DAM images with drag & drop, set 21:9 hero focal points, and write rich spatial narratives.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/admin/builder/interior"
            className="secondary-button text-xs py-2 px-3.5 bg-white/10 hover:bg-cyan-600/30 border-white/20 text-white shadow-xs"
          >
            <span>Interior Builder →</span>
          </Link>
          <Link
            to="/admin/builder/model"
            className="secondary-button text-xs py-2 px-3.5 bg-white/10 hover:bg-cyan-600/30 border-white/20 text-white shadow-xs"
          >
            <span>Model Builder →</span>
          </Link>
          <Link
            to="/admin/blog-builder"
            className="secondary-button text-xs py-2 px-3.5 bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border-cyan-500/40 shadow-xs"
          >
            <Sparkles size={13} className="text-cyan-400" />
            <span>Blog Builder →</span>
          </Link>
        </div>
      </section>

      {/* -------------------- 4 ARCHITECTURAL METRIC CARDS -------------------- */}
      <section className="metrics-grid">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => navigate(card.target)}
              className="metric-card text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className={`metric-icon ${card.tint}`}>
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <ArrowUpRight
                  size={15}
                  className="text-slate-400 group-hover:text-cyan-400 transition-colors"
                />
              </div>

              <div className="mt-5">
                <p className="text-[12px] font-medium text-slate-300">{card.label}</p>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="font-display text-3xl font-bold text-white tracking-tight">
                    {loading ? '—' : card.value}
                  </p>
                  <span className="text-[10.5px] text-slate-400 font-mono group-hover:text-cyan-300 transition-colors">
                    Open workspace →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {/* -------------------- 2-COLUMN BENTO GRID: WORK + FOCUS -------------------- */}
      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        {/* Left: Studio Pulse / Latest Projects */}
        <article className="panel p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <p className="eyebrow text-cyan-400">Studio pulse</p>
                <h2 className="font-display text-2xl font-semibold text-white mt-1">
                  Featured work & portfolio
                </h2>
              </div>
              <button
                onClick={() => navigate('/admin/interior')}
                className="text-button"
              >
                <span>View library</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                <Loader2 size={20} className="animate-spin text-cyan-400" />
                <span>Loading studio archive...</span>
              </div>
            ) : latestProjects.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                No architectural projects added yet. Click &quot;Add project&quot; to begin.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {latestProjects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => navigate('/admin/interior')}
                    className="text-left group cursor-pointer block rounded-xl overflow-hidden border border-white/10 bg-black/30 p-2.5 hover:border-cyan-400/40 hover:shadow-lg transition-all"
                  >
                    <div
                      className="aspect-[4/3] w-full rounded-lg bg-black/50 bg-cover bg-center relative overflow-hidden"
                      style={{
                        backgroundImage: `url(${resolveImageUrl(proj.cover_image)})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      {proj.is_featured && (
                        <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/30 backdrop-blur-xs">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="mt-3 px-1 pb-1">
                      <h3 className="font-display text-base font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {proj.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {proj.category_name || 'Architecture'} · {proj.location || 'Addis Ababa'} · {proj.year}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>{counts.interiors} total interior & architectural case studies</span>
            <Link to="/interior" target="_blank" className="text-cyan-300 font-medium hover:underline flex items-center gap-1">
              <span>View live gallery</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </article>

        {/* Right: Needs Your Eye / Today's Focus */}
        <aside className="panel p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-white/10 mb-4">
              <p className="eyebrow text-cyan-400">Needs your eye</p>
              <h2 className="font-display text-2xl font-semibold text-white mt-1">
                Today&apos;s curation focus
              </h2>
            </div>

            <div className="space-y-1">
              {focusTasks.map((task) => {
                const isDone = !!completedTasks[task.id];
                return (
                  <div
                    key={task.id}
                    className="task-row group flex items-center justify-between"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`task-check cursor-pointer ${isDone ? 'bg-emerald-600 text-white border-emerald-500' : 'border-white/20'}`}
                      title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                    >
                      {isDone && <Check size={13} strokeWidth={3} />}
                    </button>
                    <button
                      onClick={() => navigate(task.target)}
                      className={`flex-1 text-left text-[13px] px-2 font-medium cursor-pointer transition-colors ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-200 group-hover:text-cyan-300'
                      }`}
                    >
                      {task.title}
                    </button>
                    <button
                      onClick={() => navigate(task.target)}
                      className="text-slate-400 group-hover:text-cyan-400 transition-colors p-1"
                      title="Go to section"
                    >
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 bg-black/30 -mx-6 -mb-6 p-4 rounded-b-xl flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>Studio Engine: Django v5 REST</span>
            </span>
            <span className="font-mono text-[10px] text-cyan-300/80">PORT 8000</span>
          </div>
        </aside>
      </section>

      {/* -------------------- RECENT CLIENT INQUIRIES OVERVIEW -------------------- */}
      <section className="panel p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
          <div>
            <p className="eyebrow text-cyan-400">Studio operations</p>
            <h2 className="font-display text-xl font-semibold text-white mt-0.5">
              Recent client consultations
            </h2>
          </div>
          <button
            onClick={() => navigate('/admin/inquiries')}
            className="text-button"
          >
            <span>Open inquiry inbox ({counts.inquiries})</span>
            <ChevronRight size={15} />
          </button>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">
            No client consultation requests recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {recentInquiries.map((inq) => {
              const initials = `${inq.first_name?.[0] || ''}${inq.last_name?.[0] || ''}`.toUpperCase() || 'CL';
              const dateStr = inq.created_at ? new Date(inq.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently';

              return (
                <div
                  key={inq.id}
                  onClick={() => navigate('/admin/inquiries')}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-cyan-950/80 text-cyan-300 font-semibold text-xs flex items-center justify-center shrink-0 border border-cyan-500/30">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white truncate">
                          {inq.first_name} {inq.last_name}
                        </p>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                          {inq.service_interest || 'General'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 truncate mt-0.5 max-w-xl">
                        {inq.message || inq.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center text-xs text-slate-400">
                    <span className="status-pill review">
                      {inq.status || 'New'}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {dateStr}
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
