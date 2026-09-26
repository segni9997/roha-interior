import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import {
  api,
  type StudioProfileItem,
  type StudioMetricItem,
  API_BASE_URL
} from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { Toast, type ToastType } from '../components/Toast';
import { useAdminAuth } from '../AdminAuthContext';

export const AdminSettings: React.FC = () => {
  const { user } = useAdminAuth();

  // Profile State
  const [profile, setProfile] = useState<StudioProfileItem>({
    id: 1,
    studio_name: 'ROHA Architectural & Interior Studio',
    tagline: 'Sculpting Monumental Spaces & Physical Scale Models with Uncompromising Precision',
    about_narrative: '',
    address: 'Bole Sub-City, Addis Ababa, Ethiopia',
    email: 'contact@roha-interior.com',
    phone: '+251 911 234 567',
    whatsapp: '+251 911 234 567',
    office_hours: 'Monday – Saturday: 08:30 – 18:30 EAT',
    twitter_url: 'https://twitter.com/roha_studio',
    instagram_url: 'https://instagram.com/roha_studio',
    linkedin_url: 'https://linkedin.com/company/roha-studio',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Metrics State
  const [metrics, setMetrics] = useState<StudioMetricItem[]>([]);

  // Metric Modal State
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<StudioMetricItem | null>(null);
  const [formMetricNumber, setFormMetricNumber] = useState('');
  const [formMetricUnit, setFormMetricUnit] = useState('+');
  const [formMetricLabel, setFormMetricLabel] = useState('');
  const [formMetricOrder, setFormMetricOrder] = useState(1);
  const [savingMetric, setSavingMetric] = useState(false);

  // Delete Metric Confirm
  const [deleteMetricTarget, setDeleteMetricTarget] = useState<StudioMetricItem | null>(null);
  const [isDeletingMetric, setIsDeletingMetric] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    try {
      const [profileData, metricsData] = await Promise.allSettled([
        api.getStudioProfile(),
        api.getMetrics(),
      ]);

      if (profileData.status === 'fulfilled' && profileData.value) {
        setProfile(profileData.value);
      }
      if (metricsData.status === 'fulfilled') {
        setMetrics(metricsData.value);
      }
    } catch (err: any) {
      console.error('Failed to load settings', err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const updated = await api.updateStudioProfile(profile);
      setProfile(updated);
      setToast({ message: 'Studio Architectural Profile successfully updated', type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to update studio profile', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleOpenCreateMetric = () => {
    setEditingMetric(null);
    setFormMetricNumber('120');
    setFormMetricUnit('+');
    setFormMetricLabel('Completed Architectural Projects');
    setFormMetricOrder(metrics.length + 1);
    setIsMetricModalOpen(true);
  };

  const handleOpenEditMetric = (m: StudioMetricItem) => {
    setEditingMetric(m);
    setFormMetricNumber(m.metric_number);
    setFormMetricUnit(m.unit);
    setFormMetricLabel(m.label);
    setFormMetricOrder(m.order);
    setIsMetricModalOpen(true);
  };

  const handleSaveMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMetricNumber.trim() || !formMetricLabel.trim()) {
      setToast({ message: 'Metric number and label are required', type: 'error' });
      return;
    }

    try {
      setSavingMetric(true);
      const payload: Partial<StudioMetricItem> = {
        metric_number: formMetricNumber.trim(),
        unit: formMetricUnit.trim(),
        label: formMetricLabel.trim(),
        order: Number(formMetricOrder) || 1,
      };

      if (editingMetric) {
        const updated = await api.updateMetric(editingMetric.id, payload);
        setMetrics(prev => prev.map(m => (m.id === updated.id ? updated : m)));
        setToast({ message: `Metric "${updated.label}" updated`, type: 'success' });
      } else {
        const created = await api.createMetric(payload);
        setMetrics(prev => [...prev, created]);
        setToast({ message: `Metric "${created.label}" created`, type: 'success' });
      }

      setIsMetricModalOpen(false);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save metric', type: 'error' });
    } finally {
      setSavingMetric(false);
    }
  };

  const handleDeleteMetricConfirmed = async () => {
    if (!deleteMetricTarget) return;
    try {
      setIsDeletingMetric(true);
      await api.deleteMetric(deleteMetricTarget.id);
      setMetrics(prev => prev.filter(m => m.id !== deleteMetricTarget.id));
      setToast({ message: `Metric "${deleteMetricTarget.label}" removed`, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete metric', type: 'error' });
    } finally {
      setIsDeletingMetric(false);
      setDeleteMetricTarget(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">Studio Identity & Telemetry</h1>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#172e31] text-cyan-300 border border-[#205b63]">
              SYSTEM PREFERENCES
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            EXECUTIVE PROFILE // CONTACT NODES // STUDIO BENCHMARKS & METRICS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`${API_BASE_URL}/admin/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider border border-slate-700/80 transition-all"
          >
            <span>Django Database Portal</span>
            <ExternalLink size={13} className="text-slate-400" />
          </a>
        </div>
      </div>

      {/* Section 1: Studio Profile Form */}
      <div className="rounded-3xl bg-[#0c1315] border border-slate-800/90 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#172e31] flex items-center justify-center text-cyan-300">
              <Building size={17} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-tight">Studio Identity & Location</h2>
              <p className="text-[11px] font-mono text-slate-400">GLOBAL FOOTER & CONTACT DISPATCH TELEMETRY</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Studio Corporate Name</label>
              <input
                type="text"
                required
                value={profile.studio_name}
                onChange={(e) => setProfile({ ...profile, studio_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Architectural Tagline</label>
              <input
                type="text"
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Design Philosophy / Executive Narrative</label>
            <textarea
              rows={3}
              value={profile.about_narrative}
              onChange={(e) => setProfile({ ...profile, about_narrative: e.target.value })}
              placeholder="ROHA is a multidisciplinary architectural and scale modeling atelier dedicated to..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Studio Email</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Telephone Hotline</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">WhatsApp Dispatch</label>
              <input
                type="text"
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Physical Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Office Hours</label>
              <input
                type="text"
                value={profile.office_hours}
                onChange={(e) => setProfile({ ...profile, office_hours: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
              />
            </div>
          </div>

          {/* Social Channels */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase block mb-3">Architectural Social Channels</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Instagram</label>
                <input
                  type="text"
                  value={profile.instagram_url}
                  onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3 py-1.5 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={profile.linkedin_url}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full px-3 py-1.5 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Twitter / X</label>
                <input
                  type="text"
                  value={profile.twitter_url}
                  onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
                  placeholder="https://twitter.com/..."
                  className="w-full px-3 py-1.5 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#172e31] to-[#205b63] hover:from-[#1b373b] hover:to-[#266e77] text-white text-xs font-bold uppercase tracking-wider border border-[#2d7882] shadow-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
            >
              {savingProfile && <Loader2 size={14} className="animate-spin" />}
              <span>Save Studio Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Studio Performance Metrics Manager */}
      <div className="rounded-3xl bg-[#0c1315] border border-slate-800/90 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#172e31] flex items-center justify-center text-cyan-300">
              <BarChart3 size={17} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-tight">Studio Performance Metrics</h2>
              <p className="text-[11px] font-mono text-slate-400">PROMINENT STATISTICAL BENCHMARKS RENDERED ON HOMEPAGE</p>
            </div>
          </div>

          <button
            onClick={handleOpenCreateMetric}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#172e31] hover:bg-[#205b63] text-cyan-300 text-xs font-bold uppercase tracking-wider border border-[#205b63] cursor-pointer transition-all self-start sm:self-auto"
          >
            <Plus size={14} />
            <span>Add Benchmark</span>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-[#080d0e] border border-slate-800/80 hover:border-[#172e31] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-white font-mono">
                    {m.metric_number}
                    <span className="text-[#d4af37] text-lg ml-0.5">{m.unit}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">#{m.order}</span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">{m.label}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEditMetric(m)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => setDeleteMetricTarget(m)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: System Status & Security */}
      <div className="rounded-3xl bg-[#0c1315] border border-slate-800/90 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-tight">Active Administration Session</h2>
            <p className="text-[11px] font-mono text-slate-400">DJANGO REST BACKEND CONNECTIVITY & ACTIVE ROLES</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#080d0e] border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">AUTHENTICATED OPERATOR</span>
            <p className="text-sm font-bold text-white mt-1">{user?.username || 'admin'}</p>
            <p className="text-[11px] font-mono text-cyan-300 mt-0.5">{user?.email || 'admin@roha.com'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#080d0e] border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">API ENDPOINT GATEWAY</span>
            <p className="text-xs font-mono text-emerald-400 mt-1 truncate">{API_BASE_URL}</p>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5">STATUS: HTTP 200 OPERATIONAL</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#080d0e] border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">CREDENTIAL VERIFICATION</span>
            <p className="text-xs font-mono text-slate-300 mt-1">Username: <span className="text-white font-bold">admin</span></p>
            <p className="text-xs font-mono text-slate-300 mt-0.5">Password: <span className="text-[#d4af37] font-bold">admin123</span></p>
          </div>
        </div>
      </div>

      {/* -------------------- METRIC EDIT / CREATE MODAL -------------------- */}
      <AnimatePresence>
        {isMetricModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMetricModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0c1315] border border-[#172e31] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#172e31] flex items-center justify-center text-cyan-300">
                    <BarChart3 size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {editingMetric ? 'Edit Studio Benchmark' : 'Add Studio Benchmark'}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">METRIC TELEMETRY CONFIGURATION</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMetricModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveMetric} className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Value / Number</label>
                    <input
                      type="text"
                      required
                      value={formMetricNumber}
                      onChange={(e) => setFormMetricNumber(e.target.value)}
                      placeholder="e.g. 120 or 0.1"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Unit Symbol</label>
                    <input
                      type="text"
                      value={formMetricUnit}
                      onChange={(e) => setFormMetricUnit(e.target.value)}
                      placeholder="e.g. + or mm or %"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Benchmark Label</label>
                  <input
                    type="text"
                    required
                    value={formMetricLabel}
                    onChange={(e) => setFormMetricLabel(e.target.value)}
                    placeholder="e.g. Completed Architectural Projects"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Sequence Order</label>
                  <input
                    type="number"
                    value={formMetricOrder}
                    onChange={(e) => setFormMetricOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsMetricModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingMetric}
                    className="px-5 py-2 rounded-xl bg-[#172e31] hover:bg-[#205b63] text-white text-xs font-bold uppercase tracking-wider border border-[#2d7882] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {savingMetric && <Loader2 size={14} className="animate-spin" />}
                    <span>{editingMetric ? 'Save Changes' : 'Create Benchmark'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={deleteMetricTarget !== null}
        title="Delete Studio Benchmark?"
        message={`Are you sure you want to remove the benchmark "${deleteMetricTarget?.metric_number}${deleteMetricTarget?.unit} ${deleteMetricTarget?.label}"?`}
        confirmLabel="Confirm Delete"
        isLoading={isDeletingMetric}
        onConfirm={handleDeleteMetricConfirmed}
        onCancel={() => setDeleteMetricTarget(null)}
      />
    </div>
  );
};
