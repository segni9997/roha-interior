import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  UploadCloud,
  Loader2,
  Check,
  X,
  Star,
  Eye,
  Sliders,
  ShieldCheck,
  Building2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon
} from 'lucide-react';
import { api, resolveImageUrl, type TrustedClientItem } from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { ToastContainer, type ToastMessage } from '../components/Toast';
import { ImagePickerModal } from '../components/ImagePickerModal';

export const TrustedPartyBuilder: React.FC = () => {

  // State
  const [clients, setClients] = useState<TrustedClientItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'canvas' | 'registry'>('canvas');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Partial<TrustedClientItem> | null>(null);

  // Logo Image Picker
  const [isLogoPickerOpen, setIsLogoPickerOpen] = useState<boolean>(false);

  // Direct logo file upload state
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [logoUploadProgress, setLogoUploadProgress] = useState<number>(0);

  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState<TrustedClientItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Section Typography Customization
  const [sectionTag, setSectionTag] = useState<string>('INSTITUTIONAL ACCREDITATION & CLIENT PARTNERSHIPS');
  const [sectionHeading, setSectionHeading] = useState<string>('TRUSTED PARTNERSHIPS & TESTIMONIALS');
  const [sectionManifesto, setSectionManifesto] = useState<string>(
    'Synthesizing architectural excellence with premier developers, governmental agencies, and luxury hospitality brands worldwide.'
  );

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: 'success' | 'error', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Load clients
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getTrustedClients().catch(() => []);
      if (data && data.length > 0) {
        setClients(data);
      } else {
        // Fallback default sample if DB is completely fresh
        setClients([
          {
            id: 1,
            name: "Ethiopian Airlines Group",
            industry: "Aviation & Infrastructure",
            project_count: "Corporate HQ & VIP Skylight Lounges",
            logo: "/roha.png",
            featured: true,
            order: 1,
            website_url: "https://www.ethiopianairlines.com"
          },
          {
            id: 2,
            name: "Commercial Bank of Ethiopia",
            industry: "Banking & Financial Real Estate",
            project_count: "Headquarters Model & Executive Suites",
            logo: "/roha.png",
            featured: true,
            order: 2,
            website_url: "https://www.combanketh.et"
          },
          {
            id: 3,
            name: "Marriott Executive Apartments",
            industry: "Luxury Hospitality & Living",
            project_count: "Bespoke Suites & Atrium Spatial Curation",
            logo: "/roha.png",
            featured: true,
            order: 3,
            website_url: "https://www.marriott.com"
          }
        ]);
      }
    } catch (err: any) {
      addToast('error', 'Failed to load trusted clients', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Logo Upload via direct file selection with progress
  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('error', 'Invalid File', 'Please select a valid image file (PNG, JPG, SVG, WEBP).');
      return;
    }

    try {
      setIsUploadingLogo(true);
      setLogoUploadProgress(25);
      const timer = setInterval(() => {
        setLogoUploadProgress(prev => (prev < 85 ? prev + 15 : prev));
      }, 150);

      const res = await api.uploadFile(file);
      clearInterval(timer);
      setLogoUploadProgress(100);

      setEditingClient(prev => ({
        ...prev,
        logo: res.url
      }));

      addToast('success', 'Logo Uploaded', 'Client logo uploaded successfully.');
    } catch (err: any) {
      addToast('error', 'Upload Failed', err.message || 'Could not upload client logo.');
    } finally {
      setIsUploadingLogo(false);
      setLogoUploadProgress(0);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (client: TrustedClientItem) => {
    setEditingClient({ ...client });
    setIsModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingClient({
      name: '',
      industry: 'Real Estate & Commercial Architecture',
      project_count: 'Executive Architectural Commission',
      logo: '/roha.png',
      featured: true,
      order: clients.length + 1,
      website_url: ''
    });
    setIsModalOpen(true);
  };

  // Save Client
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !editingClient.name?.trim()) {
      addToast('error', 'Validation Error', 'Client / Partner name is required.');
      return;
    }

    try {
      setSaving(true);
      if (editingClient.id) {
        // Update
        const updated = await api.updateTrustedClient(editingClient.id, editingClient);
        setClients(prev => prev.map(c => (c.id === updated.id ? updated : c)));
        addToast('success', 'Partner Updated', `"${updated.name}" has been updated.`);
      } else {
        // Create
        const created = await api.createTrustedClient(editingClient);
        setClients(prev => [...prev, created]);
        addToast('success', 'Partner Added', `"${created.name}" has been added to trusted partners.`);
      }
      setIsModalOpen(false);
      setEditingClient(null);
    } catch (err: any) {
      addToast('error', 'Save Failed', err.message || 'Could not save trusted partner.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Client
  const handleDeleteClient = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.deleteTrustedClient(deleteTarget.id);
      setClients(prev => prev.filter(c => c.id !== deleteTarget.id));
      addToast('success', 'Partner Deleted', `"${deleteTarget.name}" was removed.`);
      setDeleteTarget(null);
      if (activeSlideIndex >= clients.length - 1) {
        setActiveSlideIndex(Math.max(0, clients.length - 2));
      }
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message || 'Could not delete partner.');
    } finally {
      setDeleting(false);
    }
  };

  // Move Order
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= clients.length) return;

    const newClients = [...clients];
    const temp = newClients[index];
    newClients[index] = newClients[targetIndex];
    newClients[targetIndex] = temp;

    // Update order numbers
    newClients.forEach((c, i) => {
      c.order = i + 1;
    });

    setClients(newClients);

    try {
      await Promise.all([
        api.updateTrustedClient(newClients[index].id, { order: newClients[index].order }),
        api.updateTrustedClient(newClients[targetIndex].id, { order: newClients[targetIndex].order })
      ]);
      addToast('success', 'Order Realigned', 'Partner order updated.');
    } catch (err) {
      console.warn('Silent sync order error:', err);
    }
  };

  const activeClient = clients[activeSlideIndex] || clients[0] || null;

  return (
    <div className="h-screen overflow-hidden bg-[#0e1819] text-white flex flex-col font-sans selection:bg-[#205b63] selection:text-white" data-lenis-prevent="true">
      <ToastContainer toasts={toasts} onClose={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* -------------------- BUILDER HEADER BAR -------------------- */}
      <header className="h-16 shrink-0 px-4 sm:px-6 bg-[#132527] border-b border-white/10 flex items-center justify-between z-40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition-all border border-white/10"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Exit to Admin</span>
          </Link>

          <div className="h-4 w-px bg-white/15 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#205b63]/40 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-sm">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold font-mono text-white flex items-center gap-2">
                <span>Trusted Parties & Partners Visual Builder</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  STUDIO ENGINE
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'canvas'
                  ? 'bg-[#205b63] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye size={13} />
              <span>Live Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('registry')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'registry'
                  ? 'bg-[#205b63] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders size={13} />
              <span>Partners List ({clients.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#205b63] to-[#395e63] hover:from-[#286f78] hover:to-[#457277] text-white text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Partner</span>
          </button>
        </div>
      </header>

      {/* -------------------- BUILDER WORKSPACE -------------------- */}
      <main className="flex-1 min-h-0 flex flex-col overflow-y-auto custom-scrollbar" data-lenis-prevent="true">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 py-32">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs font-mono uppercase tracking-widest text-slate-300">
              Loading Trusted Client Registry...
            </p>
          </div>
        ) : viewMode === 'canvas' ? (
          /* ============================================================
             VIEW MODE 1: LIVE INTERACTIVE CANVAS PREVIEW (MATCHES CLIENTSSECTION.TSX)
             ============================================================ */
          <div className="flex-1 flex flex-col">
            {/* Control Bar for Section Texts */}
            <div className="bg-[#112022] border-b border-white/10 px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
                    Section Tag / Pill
                  </label>
                  <input
                    type="text"
                    value={sectionTag}
                    onChange={(e) => setSectionTag(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
                    Main Section Heading
                  </label>
                  <input
                    type="text"
                    value={sectionHeading}
                    onChange={(e) => setSectionHeading(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
                    Section Manifesto / Subtitle
                  </label>
                  <input
                    type="text"
                    value={sectionManifesto}
                    onChange={(e) => setSectionManifesto(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono text-slate-400">
                  Slide {activeSlideIndex + 1} of {clients.length}
                </span>
              </div>
            </div>

            {/* Public Section Reproduction */}
            <div className="relative py-16 sm:py-24 bg-gradient-to-b from-[#112022] via-[#142628] to-[#0c1617] px-4 sm:px-8 md:px-16 flex-1 flex flex-col justify-center">
              <div className="max-w-6xl mx-auto w-full">
                
                {/* Public Header */}
                <div className="text-center mb-12 sm:mb-16 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    • {sectionTag}
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
                    {sectionHeading}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                    {sectionManifesto}
                  </p>
                </div>

                {/* Interactive Card Canvas */}
                {activeClient ? (
                  <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-br from-[#172a2b] to-[#0e1819] shadow-2xl p-8 sm:p-14">
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(activeClient)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer"
                        title="Edit this partner's data"
                      >
                        <Edit3 size={13} />
                        <span>Edit Partner</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center relative z-10">
                      {/* Left Details */}
                      <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-xs font-mono text-slate-400 ml-2">5.0 Certified Commission</span>
                        </div>

                        <blockquote className="text-xl sm:text-3xl font-serif italic text-slate-100 leading-snug">
                          &ldquo;ROHA transformed our corporate executive facilities with immaculate spatial balance, monolithic material tactility, and uncompromising craftsmanship.&rdquo;
                        </blockquote>

                        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6">
                          <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">
                              {activeClient.name}
                            </h3>
                            <p className="text-xs font-mono text-cyan-300 mt-0.5">
                              {activeClient.industry}
                            </p>
                          </div>

                          <div className="h-8 w-px bg-white/10 hidden sm:block" />

                          <div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                              Project Scope
                            </span>
                            <span className="text-xs font-mono text-slate-200 font-bold">
                              {activeClient.project_count || "Executive Architectural Commission"}
                            </span>
                          </div>

                          {activeClient.website_url && (
                            <a
                              href={activeClient.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                            >
                              <span>Official Portal</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Right Logo Panel */}
                      <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 rounded-2xl bg-black/40 border border-white/10 text-center">
                        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white/5 border border-white/15 p-4 flex items-center justify-center mb-4 shadow-inner">
                          {activeClient.logo ? (
                            <img
                              src={resolveImageUrl(activeClient.logo, '/roha.png')}
                              alt={activeClient.name}
                              className="max-w-full max-h-full object-contain filter drop-shadow-md"
                            />
                          ) : (
                            <Building2 size={48} className="text-cyan-400 opacity-60" />
                          )}
                        </div>
                        <span className="text-xs font-mono uppercase font-bold text-slate-300">
                          {activeClient.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Verified Studio Partner
                        </span>
                      </div>
                    </div>

                    {/* Slider Navigation Dots */}
                    <div className="flex items-center justify-between pt-10 mt-8 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        {clients.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveSlideIndex(idx)}
                            className={`transition-all duration-300 rounded-full cursor-pointer ${
                              activeSlideIndex === idx
                                ? 'w-8 h-2.5 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                                : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/50'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveSlideIndex(prev => (prev - 1 + clients.length) % clients.length)}
                          className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-all cursor-pointer"
                        >
                          ← Previous
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveSlideIndex(prev => (prev + 1) % clients.length)}
                          className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-all cursor-pointer"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-16 text-center text-slate-400 border border-white/10 rounded-2xl bg-white/5">
                    No clients currently configured. Click &quot;Add Partner&quot; above to create one.
                  </div>
                )}

                {/* Partner Logos Strip Preview */}
                <div className="mt-16 pt-10 border-t border-white/10">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 text-center mb-6">
                    Institutional Collaborator Roster ({clients.length})
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        onClick={() => {
                          const idx = clients.findIndex(c => c.id === client.id);
                          if (idx !== -1) setActiveSlideIndex(idx);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all cursor-pointer"
                      >
                        <img
                          src={resolveImageUrl(client.logo, '/roha.png')}
                          alt={client.name}
                          className="w-5 h-5 object-contain"
                        />
                        <span className="text-xs font-mono text-slate-300 font-bold">
                          {client.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* ============================================================
             VIEW MODE 2: PARTNER REGISTRY MANAGEMENT LIST
             ============================================================ */
          <div className="p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold font-mono text-white">
                  Trusted Client & Collaborator Registry
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Reorder, modify logos, or manage institutional partnerships displayed across public carousels.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Partner</span>
              </button>
            </div>

            <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#132527] overflow-hidden">
              {clients.map((client, index) => (
                <div
                  key={client.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Logo / Avatar */}
                    <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/10 p-2 flex items-center justify-center shrink-0">
                      {client.logo ? (
                        <img
                          src={resolveImageUrl(client.logo, '/roha.png')}
                          alt={client.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <Building2 size={24} className="text-cyan-400 opacity-60" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-white truncate">
                          {client.name}
                        </h3>
                        {client.featured && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-slate-400 mt-0.5 truncate">
                        {client.industry || 'Commercial Architecture'} • {client.project_count || 'Commission'}
                      </p>
                      {client.website_url && (
                        <p className="text-[11px] font-mono text-cyan-400 truncate mt-0.5">
                          {client.website_url}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Reordering */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Order Controls */}
                    <div className="flex items-center bg-black/30 rounded-lg border border-white/10 p-1 mr-2">
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, 'down')}
                        disabled={index === clients.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(client)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(client)}
                      className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-all cursor-pointer"
                      title="Delete partner"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* -------------------- CREATE / EDIT PARTNER MODAL -------------------- */}
      {isModalOpen && editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => !saving && setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-xl max-h-[92vh] bg-[#132527] border border-white/20 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col" data-lenis-prevent="true">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0f1c1d] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {editingClient.id ? `Edit: ${editingClient.name}` : 'Add New Trusted Partner'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure institutional relationship, scope, and branding logo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveClient} className="p-6 space-y-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar" data-lenis-prevent="true">
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-slate-300 mb-1.5">
                  Partner / Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingClient.name || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  placeholder="e.g. Ethiopian Airlines Group / Commercial Bank"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-slate-300 mb-1.5">
                    Industry / Sector
                  </label>
                  <input
                    type="text"
                    value={editingClient.industry || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                    placeholder="e.g. Aviation & Infrastructure"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-slate-300 mb-1.5">
                    Project Scope / Commission
                  </label>
                  <input
                    type="text"
                    value={editingClient.project_count || ''}
                    onChange={(e) => setEditingClient({ ...editingClient, project_count: e.target.value })}
                    placeholder="e.g. VIP Lounges & Headquarters"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-bold text-slate-300 mb-1.5">
                  Website URL
                </label>
                <input
                  type="url"
                  value={editingClient.website_url || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, website_url: e.target.value })}
                  placeholder="https://client-domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Logo Selection & Upload */}
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-slate-300 mb-1.5">
                  Partner Logo Image
                </label>
                
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-black/50 border border-white/15 p-2 flex items-center justify-center shrink-0">
                    {editingClient.logo ? (
                      <img
                        src={resolveImageUrl(editingClient.logo, '/roha.png')}
                        alt="Logo Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Building2 size={24} className="text-cyan-400 opacity-50" />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={isUploadingLogo}
                      onClick={() => logoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      {isUploadingLogo ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
                      <span>Upload from Device</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsLogoPickerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      <ImageIcon size={13} />
                      <span>Studio Library</span>
                    </button>

                    {editingClient.logo && (
                      <button
                        type="button"
                        onClick={() => setEditingClient({ ...editingClient, logo: null })}
                        className="p-2 rounded-xl hover:bg-white/10 text-rose-400 transition-all cursor-pointer"
                        title="Remove logo"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {isUploadingLogo && (
                  <div className="mt-2 space-y-1">
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 transition-all duration-300"
                        style={{ width: `${logoUploadProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300">
                      Uploading logo... {logoUploadProgress}%
                    </span>
                  </div>
                )}
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-black/30 border border-white/10">
                <input
                  type="checkbox"
                  id="featured_partner"
                  checked={editingClient.featured ?? true}
                  onChange={(e) => setEditingClient({ ...editingClient, featured: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
                <label htmlFor="featured_partner" className="text-xs font-mono text-slate-200 cursor-pointer">
                  Featured on Studio Homepage Carousel & Accreditation Grid
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>{editingClient.id ? 'Save Changes' : 'Create Partner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- LOGO IMAGE PICKER MODAL -------------------- */}
      <ImagePickerModal
        isOpen={isLogoPickerOpen}
        onClose={() => setIsLogoPickerOpen(false)}
        onSelect={(url) => {
          setEditingClient(prev => ({ ...prev, logo: url }));
          setIsLogoPickerOpen(false);
          addToast('success', 'Logo Selected', 'Logo image updated from studio library.');
        }}
        currentValue={editingClient?.logo || undefined}
        title="Select Institutional Partner Logo"
      />

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Trusted Partner?"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from your trusted client roster? This action cannot be undone.`}
        confirmLabel="Delete Partner"
        onConfirm={handleDeleteClient}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleting}
      />
    </div>
  );
};

export default TrustedPartyBuilder;
