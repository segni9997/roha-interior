import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please provide both username and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials. Please check your password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-[#0b1415] via-[#101e20] to-[#0b1415] text-white flex flex-col items-center justify-between p-6 relative overflow-hidden font-sans-ui selection:bg-cyan-500 selection:text-black">
      {/* Background Architectural Blueprint / Subtle Texture */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(32, 91, 99, 0.25) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`,
          backgroundSize: '48px 48px, 96px 96px'
        }}
      />

      {/* Top Header Link */}
      <header className="w-full max-w-5xl flex items-center justify-between relative z-10 py-2">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="logo-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <p className="font-display text-[17px] font-semibold leading-none tracking-[-0.03em] text-white">
              ROHA
            </p>
            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.24em] text-cyan-400">
              Architectural studio
            </p>
          </div>
        </Link>

        <a
          href="/"
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
        >
          <span>Live Studio</span>
          <ArrowUpRight size={13} />
        </a>
      </header>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md bg-[#132527]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-8 sm:p-10 shadow-2xl z-10 my-auto"
      >
        {/* Studio Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="logo-mark scale-125" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
            Studio Workspace
          </h1>
          <p className="text-xs text-cyan-300 uppercase tracking-[0.16em] mt-1.5 font-medium">
            Architectural Executive Administration
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-xs leading-relaxed"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Administrator Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
          </div>

          {/* Quick Helper Badge */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-400">
            <ShieldCheck size={14} className="text-amber-400 shrink-0" />
            <span>Default demo: <strong className="text-white">admin</strong> / <strong className="text-white">admin123</strong></span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Authenticating studio session...</span>
            ) : (
              <>
                <span>Enter Studio Workspace</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Footer Meta */}
      <footer className="w-full max-w-5xl text-center py-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
        ROHA Architectural Studio • v2.4 All systems operational
      </footer>
    </div>
  );
};
