import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen w-screen bg-[#070b0c] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Architectural Grid Lines */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#205b63 1px, transparent 1px), linear-gradient(to right, #162e31 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 80px 80px'
        }}
      />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#205b63]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-[#0e1618]/90 border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl z-10"
      >
        {/* Studio Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8c701b] text-[#090e10] font-black text-xl mb-4 shadow-xl shadow-amber-950/40">
            R
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">
            Studio CMS Portal
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wider mt-1 uppercase">
            ROHA Interior & Architectural Administration
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs leading-relaxed"
          >
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Administrator Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full pl-11 pr-4 py-3 bg-[#131f22] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#205b63] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3 bg-[#131f22] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#205b63] transition-colors"
              />
            </div>
          </div>

          {/* Quick Helper Badge */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#132023]/70 border border-slate-800 text-[11px] text-slate-400 font-mono">
            <ShieldCheck size={14} className="text-[#d4af37]" />
            <span>Standard credentials: <strong className="text-white">admin</strong> / <strong className="text-white">admin123</strong></span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 py-3.5 px-6 rounded-xl bg-[#205b63] hover:bg-[#286f78] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-teal-950/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access CMS Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
