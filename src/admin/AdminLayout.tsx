import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Layers,
  Move3D,
  BookOpen,
  FileCode2,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/admin/interior', label: 'Interior Archive', icon: Home },
  { to: '/admin/models', label: 'Scale Modeling', icon: Layers },
  { to: '/admin/tours', label: '360° Virtual Tours', icon: Move3D },
  { to: '/admin/blog', label: 'Journal & Articles', icon: BookOpen },
  { to: '/admin/pages', label: 'Page Content Builder', icon: FileCode2 },
  { to: '/admin/inquiries', label: 'Client Inquiries', icon: Mail },
  { to: '/admin/settings', label: 'Studio Settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    const current = navItems.find(item => 
      item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
    );
    return current ? current.label : 'Studio Administration';
  };

  return (
    <div className="min-h-screen bg-[#090e10] text-slate-100 flex font-sans antialiased selection:bg-[#205b63] selection:text-white">
      {/* -------------------- SIDEBAR (DESKTOP) -------------------- */}
      <aside className="hidden lg:flex w-72 flex-col justify-between bg-[#0e1719] border-r border-slate-800/80 p-6 z-30 select-none">
        <div>
          {/* Studio Brand Mark */}
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8d711b] flex items-center justify-center text-[#0e1719] font-black text-sm tracking-wider shadow-lg shadow-amber-950/40">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-widest uppercase text-white">ROHA STUDIO</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#205b63]/40 text-cyan-300 uppercase">CMS</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">ARCHITECTURAL PORTAL</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? 'bg-[#172e31] text-white border border-[#265359] shadow-lg shadow-teal-950/50'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`
                  }
                >
                  <Icon size={16} className="text-[#395e63]" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Meta & Quick Actions */}
        <div className="pt-6 border-t border-slate-800/60 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold tracking-wide border border-slate-800 transition-all"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#d4af37]" />
              <span>Live Website</span>
            </span>
            <ExternalLink size={14} className="text-slate-500" />
          </a>

          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold tracking-wide border border-slate-800 transition-all"
          >
            <span>Django Admin Portal</span>
            <ExternalLink size={14} className="text-slate-500" />
          </a>

          {/* User Status */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#205b63] flex items-center justify-center font-bold text-xs text-white uppercase">
                {user?.username?.[0] || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.username || 'Admin'}</p>
                <p className="text-[10px] text-slate-400 truncate font-mono">{user?.email || 'admin@roha.com'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* -------------------- MOBILE DRAWER -------------------- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/80" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-[#0e1719] h-full p-6 flex flex-col justify-between z-10">
            <div>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#8d711b] flex items-center justify-center text-[#0e1719] font-black text-xs">
                    R
                  </div>
                  <span className="text-xs font-black uppercase text-white">ROHA CMS</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.exact}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider ${
                          isActive
                            ? 'bg-[#172e31] text-white border border-[#265359]'
                            : 'text-slate-400 hover:text-white'
                        }`
                      }
                    >
                      <Icon size={16} className="text-[#395e63]" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider p-2"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* -------------------- MAIN CONTENT AREA -------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 bg-[#0e1719]/80 backdrop-blur-md border-b border-slate-800/80 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-slate-500 uppercase">Studio Admin</span>
              <ChevronRight size={14} className="text-slate-600" />
              <span className="text-white font-bold">{getPageTitle()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-slate-700/60 transition-all"
            >
              <span>View Public Site</span>
              <ExternalLink size={12} className="text-slate-400" />
            </Link>
          </div>
        </header>

        {/* OUTLET PAGE CONTAINER */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#090e10]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
