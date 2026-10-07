import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Loader2,
  Check,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import {
  api,
  type StudioProfileItem,
  type StudioMetricItem,
  type TrustedClientItem,
  API_BASE_URL
} from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { ToastContainer, type ToastMessage } from '../components/Toast';
import { useAdminAuth } from '../AdminAuthContext';

export const AdminSettings: React.FC = () => {
  const { user } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'metrics' | 'clients' | 'system'>('profile');

  // Studio Profile
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

  // Metrics
  const [metrics, setMetrics] = useState<StudioMetricItem[]>([]);
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<StudioMetricItem | null>(null);
  const [metricNumber, setMetricNumber] = useState('');
  const [metricUnit, setMetricUnit] = useState('+');
  const [metricLabel, setMetricLabel] = useState('');
  const [metricOrder, setMetricOrder] = useState(1);
  const [savingMetric, setSavingMetric] = useState(false);

  // Trusted Clients
  const [clients, setClients] = useState<TrustedClientItem[]>([]);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<TrustedClientItem | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientIndustry, setClientIndustry] = useState('');
  const [clientUrl, setClientUrl] = useState('');
  const [clientFeatured, setClientFeatured] = useState(true);
  const [savingClient, setSavingClient] = useState(false);

  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'metric' | 'client'; id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: 'success' | 'error', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const loadData = async () => {
    try {
      const [pRes, mRes, cRes] = await Promise.allSettled([
        api.getStudioProfile(),
        api.getMetrics(),
        api.getTrustedClients().catch(() => []),
      ]);
      if (pRes.status === 'fulfilled' && pRes.value) setProfile(pRes.value);
      if (mRes.status === 'fulfilled' && mRes.value) setMetrics(mRes.value);
      if (cRes.status === 'fulfilled' && cRes.value) setClients(cRes.value);
    } catch (err) {
      console.error('Failed to load settings', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const updated = await api.updateStudioProfile(profile);
      setProfile(updated);
      addToast('success', 'Profile Updated', 'Studio profile and narrative saved.');
    } catch (err: any) {
      addToast('error', 'Update Failed', err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingMetric(true);
      const payload: Partial<StudioMetricItem> = {
        metric_number: metricNumber,
        unit: metricUnit,
        label: metricLabel,
        order: metricOrder,
      };
      if (editingMetric) {
        await api.updateMetric(editingMetric.id, payload);
        addToast('success', 'Metric Updated', `"${metricLabel}" saved.`);
      } else {
        await api.createMetric(payload);
        addToast('success', 'Metric Added', `"${metricLabel}" created.`);
      }
      setIsMetricModalOpen(false);
      const updated = await api.getMetrics();
      setMetrics(updated);
    } catch (err: any) {
      addToast('error', 'Metric Save Failed', err.message);
    } finally {
      setSavingMetric(false);
    }
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingClient(true);
      const payload: Partial<TrustedClientItem> = {
        name: clientName,
        industry: clientIndustry,
        website_url: clientUrl,
        featured: clientFeatured,
        order: clients.length + 1,
      };
      if (editingClient) {
        await api.updateTrustedClient(editingClient.id, payload);
        addToast('success', 'Client Updated', `"${clientName}" updated.`);
      } else {
        await api.createTrustedClient(payload);
        addToast('success', 'Client Added', `"${clientName}" added to partner list.`);
      }
      setIsClientModalOpen(false);
      const updated = await api.getTrustedClients();
      setClients(updated);
    } catch (err: any) {
      addToast('error', 'Client Save Failed', err.message);
    } finally {
      setSavingClient(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      if (deleteTarget.type === 'metric') {
        await api.deleteMetric(deleteTarget.id);
        addToast('success', 'Metric Deleted', `"${deleteTarget.name}" was removed.`);
        setMetrics(prev => prev.filter(m => m.id !== deleteTarget.id));
      } else if (deleteTarget.type === 'client') {
        await api.deleteTrustedClient(deleteTarget.id);
        addToast('success', 'Client Deleted', `"${deleteTarget.name}" was removed.`);
        setClients(prev => prev.filter(c => c.id !== deleteTarget.id));
      }
      setDeleteTarget(null);
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      <ToastContainer toasts={toasts} onClose={(id) => setToasts(t => t.filter(x => x.id !== id))} />

      {/* -------------------- EDITORIAL HEADER -------------------- */}
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end border-b border-white/10 pb-7">
        <div>
          <p className="eyebrow mb-2 text-cyan-400">Studio identity & parameters</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.035em] text-white">
            Studio Settings
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl">
            Make every client touchpoint, counter metric, and studio narrative feel unmistakably ROHA.
          </p>
        </div>
      </section>

      {/* -------------------- NAVIGATION TABS -------------------- */}
      <section className="panel p-3 sm:p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'profile', label: 'Studio Profile & Narrative' },
            { id: 'metrics', label: `Showcase Metrics (${metrics.length})` },
            { id: 'clients', label: `Clients & Partners (${clients.length})` },
            { id: 'system', label: 'System & Engine' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`filter-chip text-xs ${
                activeTab === tab.id ? 'filter-chip-active' : ''
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* -------------------- TAB 1: STUDIO PROFILE -------------------- */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="panel p-6 sm:p-8 space-y-6 animate-in fade-in">
          <div className="pb-4 border-b border-white/10">
            <h2 className="font-display text-2xl font-semibold text-white">
              Architectural Studio Profile
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Public narrative rendered on the Home, About, and Contact pages
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Official Studio Name
              </label>
              <input
                type="text"
                required
                value={profile.studio_name || ''}
                onChange={(e) => setProfile({ ...profile, studio_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Primary Studio Tagline
              </label>
              <input
                type="text"
                value={profile.tagline || ''}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Studio Manifesto & Architectural Narrative
            </label>
            <textarea
              rows={5}
              value={profile.about_narrative || ''}
              onChange={(e) => setProfile({ ...profile, about_narrative: e.target.value })}
              placeholder="Describe the studio's design ethos, materiality principles, and contextual approach..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-serif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Studio Address
              </label>
              <input
                type="text"
                value={profile.address || ''}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Inquiry Email
              </label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Direct Telephone / WhatsApp
              </label>
              <input
                type="text"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="primary-button shadow-md text-xs"
            >
              {savingProfile ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              <span>Save Studio Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* -------------------- TAB 2: SHOWCASE METRICS -------------------- */}
      {activeTab === 'metrics' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">
                Showcase Metrics
              </h2>
              <p className="text-xs text-slate-400">
                High-impact counters displayed across the studio home and about experiences
              </p>
            </div>
            <button
              onClick={() => {
                setEditingMetric(null);
                setMetricNumber('24');
                setMetricUnit('+');
                setMetricLabel('Built Architectural Works');
                setMetricOrder(metrics.length + 1);
                setIsMetricModalOpen(true);
              }}
              className="primary-button text-xs"
            >
              <Plus size={14} />
              <span>Add Metric Counter</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {metrics.map((m) => (
              <div
                key={m.id}
                className="panel p-6 flex flex-col justify-between group hover:shadow-xl hover:border-cyan-400/40 transition-all"
              >
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-white">
                      {m.metric_number}
                    </span>
                    <span className="font-display text-2xl font-bold text-cyan-400">
                      {m.unit}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mt-2">
                    {m.label}
                  </h3>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[10px]">Order #{m.order}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingMetric(m);
                        setMetricNumber(m.metric_number);
                        setMetricUnit(m.unit);
                        setMetricLabel(m.label);
                        setMetricOrder(m.order);
                        setIsMetricModalOpen(true);
                      }}
                      className="icon-button"
                      title="Edit metric"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'metric', id: m.id, name: m.label })}
                      className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                      title="Delete metric"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- TAB 3: CLIENTS & PARTNERS -------------------- */}
      {activeTab === 'clients' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">
                Trusted Clients & Collaborators
              </h2>
              <p className="text-xs text-slate-400">
                Relationships and institutions featured in the studio partner grid
              </p>
            </div>
            <button
              onClick={() => {
                setEditingClient(null);
                setClientName('');
                setClientIndustry('Real Estate & Development');
                setClientUrl('');
                setClientFeatured(true);
                setIsClientModalOpen(true);
              }}
              className="primary-button text-xs"
            >
              <Plus size={14} />
              <span>Add Client / Partner</span>
            </button>
          </div>

          <div className="panel divide-y divide-white/10">
            {clients.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No client relationships recorded yet.
              </div>
            ) : (
              clients.map((c) => (
                <div
                  key={c.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <div>
                    <h3 className="font-display text-base font-semibold text-white">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {c.industry || 'Architecture & Design'} {c.website_url && `• ${c.website_url}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingClient(c);
                        setClientName(c.name);
                        setClientIndustry(c.industry || '');
                        setClientUrl(c.website_url || '');
                        setClientFeatured(c.featured);
                        setIsClientModalOpen(true);
                      }}
                      className="icon-button"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'client', id: c.id, name: c.name })}
                      className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* -------------------- TAB 4: SYSTEM & ENGINE -------------------- */}
      {activeTab === 'system' && (
        <div className="panel p-6 sm:p-8 space-y-6 animate-in fade-in">
          <div className="pb-4 border-b border-white/10">
            <h2 className="font-display text-2xl font-semibold text-white">
              Studio Engine Information
            </h2>
            <p className="text-xs text-slate-400">
              Django REST backend status and operational credentials
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <p className="text-[10px] font-mono uppercase text-cyan-400">API Host Base</p>
              <p className="text-xs font-mono font-semibold text-white mt-1">{API_BASE_URL}</p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <p className="text-[10px] font-mono uppercase text-cyan-400">Active Administrator</p>
              <p className="text-xs font-semibold text-white mt-1">{user?.username || 'admin'}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck size={16} />
              <span>Django REST Framework Core Operational</span>
            </div>
            <a
              href="http://127.0.0.1:8000/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-300 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Django Admin Portal</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

      {/* -------------------- METRIC MODAL -------------------- */}
      {isMetricModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setIsMetricModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#132527] border border-white/15 rounded-2xl p-6 shadow-2xl z-10 text-white backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-display text-xl font-semibold text-white">
                {editingMetric ? 'Edit Showcase Metric' : 'Add Showcase Metric'}
              </h3>
              <button onClick={() => setIsMetricModalOpen(false)} className="icon-button">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveMetric} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Number / Value
                  </label>
                  <input
                    type="text"
                    required
                    value={metricNumber}
                    onChange={(e) => setMetricNumber(e.target.value)}
                    placeholder="24"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Unit Symbol
                  </label>
                  <input
                    type="text"
                    value={metricUnit}
                    onChange={(e) => setMetricUnit(e.target.value)}
                    placeholder="+"
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Metric Description Label
                </label>
                <input
                  type="text"
                  required
                  value={metricLabel}
                  onChange={(e) => setMetricLabel(e.target.value)}
                  placeholder="Built Architectural Works"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMetricModalOpen(false)}
                  className="secondary-button text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMetric}
                  className="primary-button text-xs"
                >
                  {savingMetric ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>Save Metric</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- CLIENT MODAL -------------------- */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setIsClientModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#132527] border border-white/15 rounded-2xl p-6 shadow-2xl z-10 text-white backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-display text-xl font-semibold text-white">
                {editingClient ? 'Edit Client / Partner' : 'Add Client / Partner'}
              </h3>
              <button onClick={() => setIsClientModalOpen(false)} className="icon-button">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Client / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Zoma Museum / Habesha Breweries"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Industry / Typology
                </label>
                <input
                  type="text"
                  value={clientIndustry}
                  onChange={(e) => setClientIndustry(e.target.value)}
                  placeholder="e.g. Hospitality & Cultural Foundation"
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={clientUrl}
                  onChange={(e) => setClientUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="secondary-button text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingClient}
                  className="primary-button text-xs"
                >
                  {savingClient ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>Save Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={`Delete ${deleteTarget?.type === 'metric' ? 'Metric' : 'Client'}`}
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete Item"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
