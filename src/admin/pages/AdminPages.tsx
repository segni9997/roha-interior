import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCode2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Layers,
  Layout,
  X,
  Loader2,
  Image as ImageIcon,
  ArrowRight,
  Upload,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  api,
  resolveImageUrl,
  type PageSectionItem,
} from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { Toast, type ToastType } from '../components/Toast';
import { ImagePickerModal } from '../components/ImagePickerModal';

const PAGES_META = [
  { slug: 'home', label: 'Homepage', route: '/' },
  { slug: 'interior', label: 'Interior Architecture', route: '/interior' },
  { slug: 'model-making', label: 'Physical Scale Models', route: '/model-making' },
  { slug: 'gallery', label: '360° VR Gallery', route: '/gallery' },
  { slug: 'contact', label: 'Studio Contact', route: '/contactus' },
];

export const AdminPages: React.FC = () => {
  const [selectedSlug, setSelectedSlug] = useState<string>('home');
  const [sections, setSections] = useState<PageSectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Section Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSectionItem | null>(null);
  const [formSectionKey, setFormSectionKey] = useState('hero');
  const [formHeading, setFormHeading] = useState('');
  const [formSubheading, setFormSubheading] = useState('');
  const [formBodyText, setFormBodyText] = useState('');
  const [formBackgroundImage, setFormBackgroundImage] = useState('/tr/279A1756.JPG');
  const [formCtaText, setFormCtaText] = useState('');
  const [formCtaLink, setFormCtaLink] = useState('');
  const [formOrder, setFormOrder] = useState(1);
  const [saving, setSaving] = useState(false);

  // Live Preview Mode State
  const [previewLayout, setPreviewLayout] = useState<'split' | 'form' | 'preview'>('split');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Asset Picker State
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingBg, setUploadingBg] = useState(false);

  // Confirm Delete State
  const [deleteTarget, setDeleteTarget] = useState<PageSectionItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingBg(true);
      const res = await api.uploadFile(file);
      setFormBackgroundImage(res.url);
      setToast({ message: `Uploaded ${file.name} successfully`, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'File upload failed', type: 'error' });
    } finally {
      setUploadingBg(false);
      if (e.target) e.target.value = '';
    }
  };

  useEffect(() => {
    if (selectedSlug) {
      loadSections(selectedSlug);
    }
  }, [selectedSlug]);

  const loadSections = async (slug: string) => {
    try {
      setLoading(true);
      const pageData = await api.getPageContent(slug);
      setSections(pageData.sections || []);
    } catch (err: any) {
      console.warn(`No page found for ${slug}, initializing empty state`, err);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingSection(null);
    setFormSectionKey('hero');
    setFormHeading('');
    setFormSubheading('ROHA ARCHITECTURAL STUDIO');
    setFormBodyText('');
    setFormBackgroundImage('/tr/279A1756.JPG');
    setFormCtaText('Explore Portfolio');
    setFormCtaLink('/interior');
    setFormOrder(sections.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (section: PageSectionItem) => {
    setEditingSection(section);
    setFormSectionKey(section.section_key);
    setFormHeading(section.heading);
    setFormSubheading(section.subheading || '');
    setFormBodyText(section.body_text || '');
    setFormBackgroundImage(section.background_image || '');
    setFormCtaText(section.cta_text || '');
    setFormCtaLink(section.cta_link || '');
    setFormOrder(section.order || 1);
    setIsModalOpen(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formHeading.trim()) {
      setToast({ message: 'Heading is required', type: 'error' });
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<PageSectionItem> = {
        section_key: formSectionKey.trim(),
        heading: formHeading.trim(),
        subheading: formSubheading.trim(),
        body_text: formBodyText.trim(),
        background_image: formBackgroundImage.trim() || null,
        cta_text: formCtaText.trim(),
        cta_link: formCtaLink.trim(),
        order: Number(formOrder) || 1,
      };

      if (editingSection) {
        const updated = await api.updatePageSection(editingSection.id, payload);
        setSections(prev => prev.map(s => (s.id === updated.id ? { ...s, ...updated } : s)));
        setToast({ message: `Section "${updated.section_key}" updated`, type: 'success' });
      } else {
        const created = await api.createPageSection(selectedSlug, payload);
        setSections(prev => [...prev, created]);
        setToast({ message: `Section "${created.section_key}" created`, type: 'success' });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save section', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const newSections = [...sections];
    const current = newSections[index];
    const target = newSections[targetIdx];

    // Swap orders
    const tempOrder = current.order;
    current.order = target.order;
    target.order = tempOrder;

    newSections[index] = target;
    newSections[targetIdx] = current;
    setSections(newSections);

    try {
      await Promise.all([
        api.updatePageSection(current.id, { order: current.order }),
        api.updatePageSection(target.id, { order: target.order }),
      ]);
      setToast({ message: 'Section sequence updated', type: 'success' });
    } catch (err: any) {
      setToast({ message: 'Failed to update order on server', type: 'error' });
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.deletePageSection(deleteTarget.id);
      setSections(prev => prev.filter(s => s.id !== deleteTarget.id));
      setToast({ message: `Section "${deleteTarget.section_key}" removed`, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete section', type: 'error' });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const currentMeta = PAGES_META.find(p => p.slug === selectedSlug) || PAGES_META[0];

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">Architectural Page Builder</h1>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#172e31] text-cyan-300 border border-[#205b63]">
              LIVE CMS ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            MODULAR SECTION COMPOSER // SPATIAL HEROES // ARCHITECTURAL MANIFESTOS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={currentMeta.route}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider border border-slate-700/80 transition-all"
          >
            <span>Preview {currentMeta.label}</span>
            <ExternalLink size={13} className="text-slate-400" />
          </a>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#172e31] to-[#205b63] hover:from-[#1b373b] hover:to-[#266e77] text-white text-xs font-bold uppercase tracking-wider border border-[#2d7882] shadow-lg shadow-teal-950/40 cursor-pointer transition-all"
          >
            <Plus size={15} />
            <span>Add Layout Block</span>
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {PAGES_META.map((p) => (
          <button
            key={p.slug}
            onClick={() => setSelectedSlug(p.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              selectedSlug === p.slug
                ? 'bg-[#172e31] text-white border border-[#205b63] shadow-md shadow-teal-950/50'
                : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Page Meta & Sections Builder */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-500 gap-3">
          <Loader2 size={32} className="animate-spin text-cyan-400" />
          <p className="text-xs font-mono uppercase tracking-widest">Compiling Section Blueprints...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Page Card Banner */}
          <div className="p-6 rounded-3xl bg-[#0c1315] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#172e31] text-cyan-300 uppercase">
                  PAGE TARGET
                </span>
                <span className="text-xs font-mono text-slate-400">/{selectedSlug}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{currentMeta.label} Content Wireframe</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {sections.length} modular blocks arranged sequentially. Drag or re-order blocks to restructure hierarchy.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">
                TOTAL SECTIONS: <strong className="text-white">{sections.length}</strong>
              </span>
            </div>
          </div>

          {/* Sections Timeline / Stack */}
          {sections.length === 0 ? (
            <div className="py-20 rounded-3xl border border-dashed border-slate-800 text-center bg-[#0e1719]/40">
              <Layers size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-bold text-slate-300">No Content Blocks Defined</p>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Click "+ Add Layout Block" to construct the hero, philosophy, or project showcase sections.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sections
                .sort((a, b) => a.order - b.order)
                .map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="group rounded-3xl bg-[#0c1315] border border-slate-800/90 hover:border-[#172e31] p-6 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl"
                  >
                    {/* Left: Reorder controls + Thumbnail */}
                    <div className="flex items-center gap-4">
                      {/* Up/Down buttons */}
                      <div className="flex flex-col gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveOrder(idx, 'up')}
                          className="p-1.5 rounded-lg bg-black/40 hover:bg-[#172e31] text-slate-400 hover:text-white disabled:opacity-25 transition-colors cursor-pointer"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          disabled={idx === sections.length - 1}
                          onClick={() => handleMoveOrder(idx, 'down')}
                          className="p-1.5 rounded-lg bg-black/40 hover:bg-[#172e31] text-slate-400 hover:text-white disabled:opacity-25 transition-colors cursor-pointer"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>

                      {/* Image Thumbnail */}
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800 relative">
                        {sec.background_image ? (
                          <img
                            src={resolveImageUrl(sec.background_image, '/tr/279A1756.JPG')}
                            alt={sec.heading}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Layout size={18} />
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 rounded bg-black/80 text-cyan-300">
                          #{idx + 1}
                        </span>
                      </div>

                      {/* Section Content Summary */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#172e31] text-cyan-300 uppercase">
                            SEC: {sec.section_key}
                          </span>
                          {sec.subheading && (
                            <span className="text-[11px] font-mono text-slate-500 truncate">{sec.subheading}</span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1 truncate">{sec.heading}</h3>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-xl">
                          {sec.body_text || 'No structural body text provided.'}
                        </p>
                      </div>
                    </div>

                    {/* Right: CTA details & Actions */}
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                      {sec.cta_text && (
                        <div className="text-right hidden lg:block">
                          <p className="text-[10px] font-mono text-slate-500 uppercase">ACTION LINK</p>
                          <p className="text-xs font-mono text-cyan-300 truncate max-w-[140px]">
                            {sec.cta_text} → {sec.cta_link}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(sec)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#172e31] text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(sec)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* -------------------- SECTION EDIT / CREATE MODAL WITH LIVE PREVIEW -------------------- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4'} overflow-y-auto`}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className={`relative ${
                isFullscreen
                  ? 'w-screen h-screen rounded-none border-0'
                  : 'w-[98vw] max-w-[1720px] h-[94vh] rounded-3xl border border-[#172e31]'
              } bg-[#0b1214] shadow-2xl z-10 my-auto flex flex-col text-white transition-all duration-300 overflow-hidden`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-800 bg-[#0f181b] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#172e31] flex items-center justify-center text-cyan-300 shrink-0">
                    <FileCode2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>{editingSection ? `Edit Section [${editingSection.section_key}]` : 'Add Layout Section'}</span>
                      <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                        Live Preview Active
                      </span>
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">PAGE: /{selectedSlug.toUpperCase()} // REAL-TIME PUBLIC SECTION RENDERING</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div className="flex items-center p-1 bg-[#142023] rounded-xl border border-slate-800 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setPreviewLayout('form')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        previewLayout === 'form' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewLayout('split')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        previewLayout === 'split' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Split 50/50
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewLayout('preview')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        previewLayout === 'preview' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Preview
                    </button>
                  </div>

                  {/* Fullscreen Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 rounded-xl bg-[#142023] border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode'}
                  >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Split Canvas */}
              <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
                
                {/* LEFT PANE: Form Controls */}
                {(previewLayout === 'split' || previewLayout === 'form') && (
                  <div className={`${previewLayout === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} p-6 space-y-4 overflow-y-auto max-h-[80vh]`}>
                    <form id="section-form" onSubmit={handleSaveSection} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Section Identifier Key</label>
                          <input
                            type="text"
                            required
                            value={formSectionKey}
                            onChange={(e) => setFormSectionKey(e.target.value)}
                            placeholder="e.g. hero, philosophy, metrics, showcase, cta"
                            className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Display Order</label>
                          <input
                            type="number"
                            value={formOrder}
                            onChange={(e) => setFormOrder(Number(e.target.value))}
                            className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Subheading / Badge Label</label>
                        <input
                          type="text"
                          value={formSubheading}
                          onChange={(e) => setFormSubheading(e.target.value)}
                          placeholder="e.g. ARCHITECTURAL MANIFESTO // 2026"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                          Main Heading <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formHeading}
                          onChange={(e) => setFormHeading(e.target.value)}
                          placeholder="e.g. Precision Crafted Spaces Where Light Meets Monumental Form"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Body Text / Narrative</label>
                        <textarea
                          rows={4}
                          value={formBodyText}
                          onChange={(e) => setFormBodyText(e.target.value)}
                          placeholder="Describe the architectural concept, methodology, or design vision..."
                          className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
                        />
                      </div>

                      {/* Background Image URI */}
                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Background / Focal Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formBackgroundImage}
                            onChange={(e) => setFormBackgroundImage(e.target.value)}
                            placeholder="/tr/279A1756.JPG"
                            className="flex-1 px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                          />
                          <input
                            ref={bgFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleBgUpload}
                          />
                          <button
                            type="button"
                            disabled={uploadingBg}
                            onClick={() => bgFileInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50 transition-colors"
                            title="Upload directly from your device"
                          >
                            {uploadingBg ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                            <span>{uploadingBg ? 'Uploading...' : 'Upload'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAssetPickerOpen(true)}
                            className="px-3.5 py-2 rounded-xl bg-[#172e31] hover:bg-[#205b63] text-cyan-300 text-xs font-bold uppercase tracking-wider border border-[#205b63] flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                          >
                            <ImageIcon size={14} />
                            <span>Select Asset</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase mb-1">CTA Button Text</label>
                          <input
                            type="text"
                            value={formCtaText}
                            onChange={(e) => setFormCtaText(e.target.value)}
                            placeholder="e.g. Schedule Consultation"
                            className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase mb-1">CTA Target Link</label>
                          <input
                            type="text"
                            value={formCtaLink}
                            onChange={(e) => setFormCtaLink(e.target.value)}
                            placeholder="e.g. /contactus or /interior"
                            className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* RIGHT PANE: Authentic Live Website Section Preview */}
                {(previewLayout === 'split' || previewLayout === 'preview') && (
                  <div className={`${previewLayout === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} bg-[#070b0c] p-5 flex flex-col justify-between overflow-y-auto max-h-[80vh]`}>
                    <div>
                      {/* Browser Chrome & Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                          <span className="ml-2 text-[10px] font-mono text-slate-500 bg-[#142023] px-2.5 py-0.5 rounded-md border border-slate-800">
                            roha.studio/{selectedSlug === 'home' ? '' : selectedSlug}#{formSectionKey}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#172e31] text-cyan-300 text-[10px] font-mono uppercase">
                            Section: {formSectionKey}
                          </span>

                          <div className="flex items-center p-0.5 bg-[#142023] rounded-lg border border-slate-800 text-[10px] font-mono">
                            <button
                              type="button"
                              onClick={() => setPreviewDevice('desktop')}
                              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                                previewDevice === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400'
                              }`}
                            >
                              Desktop
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewDevice('mobile')}
                              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                                previewDevice === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400'
                              }`}
                            >
                              Mobile
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* SECTION PREVIEW CANVAS */}
                      <div className={`mx-auto transition-all duration-300 ${
                        previewDevice === 'mobile' ? 'max-w-[340px]' : 'w-full'
                      }`}>
                        {formSectionKey === 'hero' ? (
                          /* Authentic Hero Section Preview */
                          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black min-h-[380px] shadow-2xl flex flex-col justify-end p-6 sm:p-8">
                            <img
                              src={resolveImageUrl(formBackgroundImage, '/tr/279A1756.JPG')}
                              alt="Hero Focal"
                              className="absolute inset-0 w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#070b0c] via-black/50 to-transparent" />

                            <div className="relative z-10 space-y-3">
                              {formSubheading && (
                                <span className="inline-block px-3 py-1 rounded-full bg-[#172e31]/80 backdrop-blur-md text-[10px] font-mono tracking-widest uppercase text-[#d4af37] border border-[#d4af37]/30">
                                  {formSubheading}
                                </span>
                              )}
                              <h1 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                                {formHeading || 'Where Light Meets Monumental Form'}
                              </h1>
                              {formBodyText && (
                                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed max-w-lg">
                                  {formBodyText}
                                </p>
                              )}
                              {formCtaText && (
                                <div className="pt-2">
                                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#205b63] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-teal-950/60">
                                    <span>{formCtaText}</span>
                                    <ArrowRight size={14} />
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Narrative / Philosophy Section Preview */
                          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1618] p-6 shadow-2xl space-y-4 text-white">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest">
                                ● Section Layout: {formSectionKey}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">Order: #{formOrder}</span>
                            </div>

                            <div className="space-y-2">
                              {formSubheading && (
                                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
                                  {formSubheading}
                                </span>
                              )}
                              <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                                {formHeading || 'Architectural Narrative & Spatial Expression'}
                              </h2>
                            </div>

                            <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10">
                              <img
                                src={resolveImageUrl(formBackgroundImage, '/tr/279A1756.JPG')}
                                alt="Section Focal"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {formBodyText && (
                              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                {formBodyText}
                              </p>
                            )}

                            {formCtaText && (
                              <div className="pt-1">
                                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider hover:text-cyan-300">
                                  <span>{formCtaText}</span>
                                  <ArrowRight size={13} />
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Public layout block preview</span>
                      <span className="text-cyan-400">ROHA CMS Engine</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#0f181b] rounded-b-3xl shrink-0">
                <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">
                  Changes will update live page blocks on the public website
                </span>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="section-form"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                    <span>{editingSection ? 'Save Section Changes' : 'Append Section'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------- ASSET PICKER -------------------- */}
      <ImagePickerModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        currentValue={formBackgroundImage}
        onSelect={(path) => setFormBackgroundImage(path)}
        title="Select Section Photography Asset"
      />

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Layout Section?"
        message={`Are you sure you want to delete section "${deleteTarget?.section_key}" (${deleteTarget?.heading})?`}
        confirmLabel="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
