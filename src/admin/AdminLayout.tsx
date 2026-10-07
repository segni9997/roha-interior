import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Compass,
  BookOpen,
  FileText,
  Users,
  Settings2,
  Menu,
  X,
  Plus,
  Search,
  Bell,
  ArrowUpRight,
  LogOut,
  ChevronRight,
  Database,
  CheckCircle2,
  Sparkles,
  Ruler
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { api } from '../services/api';

interface NavGroup {
  group: string;
  items: {
    to: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
    exact?: boolean;
    countKey?: 'interiors' | 'models' | 'tours' | 'blogs' | 'inquiries';
    hasDot?: boolean;
  }[];
}

const navGroups: NavGroup[] = [
  {
    group: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    group: 'Visual Studio Builder',
    items: [
      { to: '/admin/builder/interior', label: 'Project Builder (Editorial)', icon: Sparkles, hasDot: true },
      { to: '/admin/builder/model', label: 'Scale Model Builder', icon: Ruler },
      { to: '/admin/blog-builder', label: 'Blog & Story Builder', icon: FileText, hasDot: true },
    ],
  },
  {
    group: 'Studio library',
    items: [
      { to: '/admin/interior', label: 'Interior & architecture', icon: Building2, countKey: 'interiors' },
      { to: '/admin/models', label: 'Scale models', icon: FolderKanban, countKey: 'models' },
      { to: '/admin/tours', label: 'Virtual tours', icon: Compass, countKey: 'tours' },
      { to: '/admin/blog', label: 'Journal & blog', icon: BookOpen, countKey: 'blogs' },
    ],
  },
  {
    group: 'Studio operations',
    items: [
      { to: '/admin/pages', label: 'Page content', icon: FileText },
      { to: '/admin/inquiries', label: 'Client inquiries', icon: Users, countKey: 'inquiries', hasDot: true },
      { to: '/admin/settings', label: 'Settings & branding', icon: Settings2 },
    ],
  },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCommand, setShowCommand] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [counts, setCounts] = useState<{
    interiors: number;
    models: number;
    tours: number;
    blogs: number;
    inquiries: number;
  }>({
    interiors: 0,
    models: 0,
    tours: 0,
    blogs: 0,
    inquiries: 0,
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Load live counts for sidebar badges
  useEffect(() => {
    let isMounted = true;
    async function loadCounts() {
      try {
        const [interiors, models, tours, blogs, inquiries] = await Promise.allSettled([
          api.getInteriorProjects(),
          api.getModelProjects(),
          api.getPanoramicTours(),
          api.getBlogPosts(),
          api.getInquiries(),
        ]);
        if (!isMounted) return;
        setCounts({
          interiors: interiors.status === 'fulfilled' ? interiors.value.length : 0,
          models: models.status === 'fulfilled' ? models.value.length : 0,
          tours: tours.status === 'fulfilled' ? tours.value.length : 0,
          blogs: blogs.status === 'fulfilled' ? blogs.value.length : 0,
          inquiries: inquiries.status === 'fulfilled' ? inquiries.value.length : 0,
        });
      } catch (err) {
        console.error('Failed to load navigation counters', err);
      }
    }
    loadCounts();
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  // Global Keyboard shortcut for Command Palette (⌘ K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommand(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommand(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getActiveTitle = () => {
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)) {
          return item.label;
        }
      }
    }
    return 'Dashboard';
  };

  const commandItems = [
    { label: 'Visual Project Builder (Editorial Monograph)', category: 'Visual Studio Builder', to: '/admin/builder/interior', icon: Sparkles },
    { label: 'Scale Model Project Builder (Fabrication)', category: 'Visual Studio Builder', to: '/admin/builder/model', icon: Ruler },
    { label: 'Dashboard overview', category: 'Overview', to: '/admin', icon: LayoutDashboard },
    { label: 'Interior & architecture projects', category: 'Library', to: '/admin/interior', icon: Building2 },
    { label: 'Precision scale models archive', category: 'Library', to: '/admin/models', icon: FolderKanban },
    { label: 'Virtual 360° tours and panoramas', category: 'Library', to: '/admin/tours', icon: Compass },
    { label: 'Journal and editorial articles', category: 'Library', to: '/admin/blog', icon: BookOpen },
    { label: 'Page content sections and copy', category: 'Operations', to: '/admin/pages', icon: FileText },
    { label: 'Client consultation inquiries', category: 'Operations', to: '/admin/inquiries', icon: Users },
    { label: 'Studio settings and branding configuration', category: 'Operations', to: '/admin/settings', icon: Settings2 },
  ];

  const filteredCommands = commandItems.filter(c =>
    c.label.toLowerCase().includes(commandQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(commandQuery.toLowerCase())
  );

  return (
    <div className="admin-portal min-h-screen bg-[#0b1415] text-slate-100">
      {/* -------------------- DESKTOP SIDEBAR -------------------- */}
      <aside className={`admin-sidebar bg-[#0f1c1d] border-r border-white/10 shadow-2xl ${collapsed ? 'admin-sidebar-collapsed' : ''}`}>
        {/* Studio Branding */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-white/10">
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="logo-mark mx-auto"
              title="Expand sidebar"
            >
              <span />
              <span />
              <span />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="logo-mark" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div>
                <p className="font-display text-[17px] font-bold leading-none tracking-tight text-white">
                  ROHA
                </p>
                <p className="mt-1 text-[9px] font-mono font-bold uppercase tracking-[0.24em] text-cyan-400">
                  Visual Studio CMS
                </p>
              </div>
            </div>
          )}

          <button
            className="icon-button hidden lg:flex text-slate-400 hover:text-white"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar width"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <Menu size={16} />
          </button>
        </div>

        {/* Quick Action: New Project */}
        <div className="px-3 pt-5 pb-2">
          <button
            onClick={() => navigate('/admin/builder/interior')}
            className="primary-button w-full justify-center mb-5 shadow-lg flex items-center gap-2"
            title="Create new project in Visual Studio"
          >
            <Plus size={15} className="stroke-[3]" />
            {!collapsed && <span>New project</span>}
          </button>

          {/* Navigation Groups */}
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {navGroups.map((group) => (
              <div key={group.group}>
                {!collapsed && (
                  <p className="eyebrow px-3 pb-2 select-none text-cyan-400/90 font-mono text-[10px] font-bold tracking-widest uppercase">
                    {group.group}
                  </p>
                )}
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const countVal = item.countKey ? counts[item.countKey] : undefined;
                    const formattedCount = countVal !== undefined ? (countVal < 10 ? `0${countVal}` : `${countVal}`) : null;

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        className={({ isActive }) =>
                          `admin-nav-item ${isActive ? 'admin-nav-item-active' : 'text-slate-300 hover:text-white hover:bg-white/10'}`
                        }
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon size={17} strokeWidth={1.75} className="shrink-0 text-cyan-300" />
                        {!collapsed && (
                          <>
                            <span className="truncate flex-1">{item.label}</span>
                            {formattedCount && (
                              <span className="ml-auto flex items-center gap-1.5 text-[11px] font-mono text-cyan-200/70">
                                {item.hasDot && countVal !== undefined && countVal > 0 && <i className="status-dot" />}
                                <span>{formattedCount}</span>
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="mt-auto border-t border-white/10 p-3 space-y-1 bg-[#0b1516]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-item text-slate-300 hover:text-cyan-300 hover:bg-white/5"
            title="Open live public studio site"
          >
            <ArrowUpRight size={16} className="shrink-0 text-amber-400" />
            {!collapsed && <span className="text-xs">Live public studio</span>}
          </a>

          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-item text-slate-300 hover:text-cyan-300 hover:bg-white/5"
            title="Open Django administrative database"
          >
            <Database size={16} className="shrink-0 text-cyan-400" />
            {!collapsed && <span className="text-xs">Django Admin DB</span>}
          </a>

          <button
            onClick={handleLogout}
            className="admin-nav-item text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
            title="Sign out of studio session"
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span className="text-xs font-semibold">Sign out</span>}
          </button>
        </div>
      </aside>

      {/* -------------------- MOBILE DRAWER -------------------- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 bg-[#0f1c1d] text-white h-full p-5 flex flex-col justify-between z-10 border-r border-white/10 shadow-2xl">
            <div>
              <div className="flex justify-between items-center pb-5 mb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="logo-mark" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div>
                    <p className="font-display text-base font-bold leading-none text-white">ROHA</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-cyan-400 mt-0.5 font-mono">Admin Workspace</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="icon-button text-slate-300 hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                {navGroups.map((group) => (
                  <div key={group.group}>
                    <p className="eyebrow px-2 pb-1.5 text-cyan-400 font-mono text-[10px]">{group.group}</p>
                    <nav className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const countVal = item.countKey ? counts[item.countKey] : undefined;
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.exact}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                              `admin-nav-item ${isActive ? 'admin-nav-item-active' : 'text-slate-300 hover:text-white'}`
                            }
                          >
                            <Icon size={17} className="text-cyan-300" />
                            <span className="flex-1">{item.label}</span>
                            {countVal !== undefined && (
                              <span className="text-[11px] font-mono text-cyan-200/70">
                                {countVal}
                              </span>
                            )}
                          </NavLink>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="admin-nav-item text-xs text-slate-300"
              >
                <ArrowUpRight size={15} className="text-amber-400" />
                <span>View live studio</span>
              </a>
              <button
                onClick={handleLogout}
                className="admin-nav-item text-rose-400 hover:bg-rose-950/40 text-xs font-semibold"
              >
                <LogOut size={15} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MAIN APP SHELL -------------------- */}
      <div className={`admin-main-shell ${collapsed ? 'admin-main-shell-collapsed' : ''}`}>
        {/* TOPBAR */}
        <header className="admin-topbar bg-[#0f1c1d]/90 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="icon-button text-slate-300 hover:text-white"
              aria-label="Open mobile menu"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="logo-mark" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span className="font-display text-sm font-bold tracking-tight text-white">ROHA</span>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <span>Workspace</span>
            <ChevronRight size={13} className="text-cyan-400/60" />
            <strong className="text-cyan-300 font-mono font-bold tracking-wider uppercase">{getActiveTitle()}</strong>
          </div>

          {/* Right Topbar Actions */}
          <div className="ml-auto flex items-center gap-2.5 sm:gap-3.5">
            {/* Visual Builder Launch Button */}
            <NavLink
              to="/admin/builder/interior"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer border border-emerald-400/40 shrink-0"
              title="Open full-screen Visual Project Builder"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span className="hidden sm:inline">Project Builder</span>
            </NavLink>

            {/* Global Quick Search Button */}
            <button
              onClick={() => setShowCommand(true)}
              className="search-trigger bg-black/40 border-white/15 text-slate-300 hover:text-white hover:border-cyan-400"
              title="Search studio (⌘K)"
            >
              <Search size={15} className="text-cyan-300" />
              <span className="hidden sm:inline">Search studio...</span>
              <kbd className="hidden sm:inline">⌘ K</kbd>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="icon-button relative text-slate-300 hover:text-white"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell size={17} />
                {counts.inquiries > 0 && <i className="notification-dot" />}
              </button>

              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 panel bg-[#122224] border border-white/20 shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">Studio Activity</p>
                    <span className="text-[10px] font-mono text-slate-400">Real-time</span>
                  </div>
                  <div className="py-2 space-y-2.5">
                    {counts.inquiries > 0 ? (
                      <div
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/admin/inquiries');
                        }}
                        className="p-2.5 rounded-lg bg-black/30 hover:bg-black/50 border border-white/10 cursor-pointer transition-colors"
                      >
                        <p className="text-xs font-semibold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          <span>{counts.inquiries} Client Inquiries Waiting</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Potential architectural clients submitted consultation inquiries.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center">No pending notifications</p>
                    )}
                    <div className="p-2.5 rounded-lg bg-black/30 border border-white/10">
                      <p className="text-xs font-medium text-white flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span>Django Core Database Synced</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Connected to http://127.0.0.1:8000</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-right">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-cyan-300 font-semibold hover:underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div
              className="flex items-center gap-2 pl-2 border-l border-white/10"
              title={`Logged in as ${user?.username || 'Admin'}`}
            >
              <div className="w-8 h-8 rounded-full bg-[#172a2b] text-cyan-300 font-mono font-bold text-xs flex items-center justify-center border border-cyan-400/40">
                {user?.username ? user.username.slice(0, 2).toUpperCase() : 'RO'}
              </div>
              <span className="hidden md:inline text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                {user?.username || 'Studio Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* OUTLET PAGE CONTAINER */}
        <main className="flex-1">
          <div className="admin-content-wrap">
            <Outlet />
          </div>
        </main>

        {/* Global Footer */}
        <footer className="border-t border-white/10 bg-[#0a1415]/70 py-6 px-8 text-[11px] uppercase tracking-[0.16em] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">ROHA Architectural Studio CMS</span>
            <span>•</span>
            <span className="text-cyan-400">v2.4 Dark Spruce Editorial Framework</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px]">All Studio Systems Operational</span>
          </div>
        </footer>
      </div>

      {/* -------------------- COMMAND PALETTE MODAL -------------------- */}
      {showCommand && (
        <div className="command-overlay" onClick={() => setShowCommand(false)}>
          <div className="command-dialog bg-[#0f1c1d] border border-white/20 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 bg-black/30">
              <Search size={18} className="text-cyan-300" />
              <input
                autoFocus
                placeholder="Search studio workspaces, projects, inquiries..."
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="w-full text-sm outline-none bg-transparent text-white placeholder-slate-500"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setShowCommand(false);
                }}
              />
              <button
                className="icon-button text-slate-400 hover:text-white"
                onClick={() => setShowCommand(false)}
                aria-label="Close command search"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto space-y-1">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.to}
                      onClick={() => {
                        navigate(item.to);
                        setShowCommand(false);
                      }}
                      className="command-item text-slate-300 hover:text-white hover:bg-white/10"
                    >
                      <Icon size={16} className="text-cyan-300" />
                      <span className="font-medium text-white">{item.label}</span>
                      <span className="ml-auto text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-black/40 text-cyan-200 border border-white/10">
                        {item.category}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No matching workspace actions found for &quot;{commandQuery}&quot;
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-4 py-2.5 bg-black/30 flex items-center justify-between text-[11px] text-slate-400">
              <span>Navigate with cursor or keyboard</span>
              <span>Press <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 font-mono text-[10px] text-cyan-300">ESC</kbd> to exit</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
