import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';
import { API_BASE_URL } from '../../services/api';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  // If already authenticated, redirect straight to the intended admin route
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await login(username.trim(), password, rememberMe);
      navigate(from, { replace: true });
    } catch (err: any) {
      let message = err?.message || 'Invalid administrator credentials. Please check your password.';
      if (typeof message === 'string' && (message.includes('Failed to fetch') || message.includes('NetworkError'))) {
        message = `Unable to reach backend server at ${API_BASE_URL}. Ensure Django backend is running.`;
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-[#070e10] via-[#0d181a] to-[#070e10] text-white flex flex-col items-center justify-between p-4 sm:p-6 relative overflow-hidden font-sans-ui selection:bg-cyan-500 selection:text-black">
      {/* Background Architectural Blueprint / Subtle Texture & Ambient Glow */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(34, 211, 238, 0.18) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 80px 80px'
        }}
      />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-5xl flex items-center justify-between relative z-10 py-3">
        <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
          <div className="logo-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <p className="font-display text-[18px] font-semibold leading-none tracking-[-0.03em] text-white">
              ROHA
            </p>
            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.24em] text-cyan-400">
              Architectural Studio
            </p>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 font-medium px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Live Studio</span>
          <ArrowUpRight size={12} className="opacity-60" />
        </Link>
      </header>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-[#101e20]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-7 sm:p-9 shadow-2xl z-10 my-auto"
      >
        {/* Studio Branding */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center mb-3.5">
            <div className="logo-mark scale-125" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Studio Workspace
          </h1>
          <p className="text-[10px] text-cyan-300 uppercase tracking-[0.2em] mt-1.5 font-medium font-mono">
            Executive Portal Authentication
          </p>
        </div>

        {/* Error Feedback */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="mb-5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 flex items-start gap-2.5 text-rose-200 text-xs leading-relaxed shadow-lg"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

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
                autoComplete="username"
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
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Remember session checkbox */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[11px]">Remember studio session</span>
            </label>
          </div>

          {/* Quick Helper Badge / 1-Click Auto Fill */}
          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/20 hover:border-cyan-400/40 text-[11px] text-slate-300 transition-colors group cursor-pointer"
            title="Click to automatically fill default demo administrator credentials"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-amber-400 shrink-0" />
              <span>Demo: <strong className="text-white">admin</strong> / <strong className="text-white">admin123</strong></span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 group-hover:underline flex items-center gap-1">
              <Sparkles size={11} />
              <span>Auto-Fill</span>
            </span>
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Studio Session...</span>
              </div>
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
      <footer className="w-full max-w-5xl text-center py-3 text-[10px] uppercase tracking-[0.2em] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>ROHA Architectural Studio • Executive Administration</span>
        <span className="text-cyan-400/70 font-mono">Backend: {API_BASE_URL}</span>
      </footer>
    </div>
  );
};
