import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  FileText,
  X,
  Loader2,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import {
  api,
  resolveImageUrl,
  type PageSectionItem,
} from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { ToastContainer, type ToastMessage } from '../components/Toast';
import { ImagePickerModal } from '../components/ImagePickerModal';

const PAGES_META = [
  { slug: 'home', label: 'Homepage', route: '/' },
  { slug: 'interior', label: 'Interior Architecture', route: '/interior' },
  { slug: 'model-making', label: 'Scale Models', route: '/model-making' },
  { slug: 'gallery', label: '360° VR Gallery', route: '/gallery' },
  { slug: 'contact', label: 'Contact Us', route: '/contactus' },
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

  // Asset Picker State
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

  // Confirm Delete
  const [deleteTarget, setDeleteTarget] = useState<PageSectionItem | null>(null);
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
      addToast('error', 'Failed to load page content', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingSection(null);
    setFormSectionKey('hero');
    setFormHeading('');
    setFormSubheading('');
    setFormBodyText('');
    setFormBackgroundImage('/tr/279A1756.JPG');
    setFormCtaText('');
    setFormCtaLink('');
    setFormOrder(sections.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sec: PageSectionItem) => {
    setEditingSection(sec);
    setFormSectionKey(sec.section_key || 'content');
    setFormHeading(sec.heading || '');
    setFormSubheading(sec.subheading || '');
    setFormBodyText(sec.body_text || '');
    setFormBackgroundImage(sec.background_image || '/tr/279A1756.JPG');
    setFormCtaText(sec.cta_text || '');
    setFormCtaLink(sec.cta_link || '');
    setFormOrder(sec.order || 1);
    setIsModalOpen(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSectionKey.trim()) {
      addToast('error', 'Validation Error', 'Section key is required.');
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<PageSectionItem> = {
        section_key: formSectionKey.trim(),
        heading: formHeading.trim(),
        subheading: formSubheading.trim(),
        body_text: formBodyText.trim(),
        background_image: formBackgroundImage,
        cta_text: formCtaText.trim(),
        cta_link: formCtaLink.trim(),
        order: formOrder,
      };

      if (editingSection?.id) {
        await api.updatePageSection(editingSection.id, payload);
        addToast('success', 'Section Updated', `"${formHeading || formSectionKey}" saved.`);
      } else {
        await api.createPageSection(selectedSlug, payload);
        addToast('success', 'Section Created', `"${formHeading || formSectionKey}" added to page.`);
      }

      setIsModalOpen(false);
      setEditingSection(null);
      await loadSections(selectedSlug);
    } catch (err: any) {
      addToast('error', 'Failed to Save Section', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.deletePageSection(deleteTarget.id);
      addToast('success', 'Section Deleted', `Section was removed.`);
      setDeleteTarget(null);
      await loadSections(selectedSlug);
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const activePageMeta = PAGES_META.find(p => p.slug === selectedSlug) || PAGES_META[0];

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      <ToastContainer toasts={toasts} onClose={(id) => setToasts(t => t.filter(x => x.id !== id))} />

      {/* -------------------- EDITORIAL HEADER -------------------- */}
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end border-b border-white/10 pb-7">
        <div>
          <p className="eyebrow mb-2 text-cyan-400">
            Page composition / {activePageMeta.label}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.035em] text-white">
            Page Layout & Copy
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl">
            Edit dynamic heroes, manifesto blocks, narrative sections, and CTA pathways for public pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={activePageMeta.route}
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-button"
          >
            <span>View {activePageMeta.label}</span>
            <ExternalLink size={14} />
          </a>

          <button
            onClick={handleOpenCreateModal}
            className="primary-button shadow-sm"
          >
            <Plus size={15} />
            <span>Add section block</span>
          </button>
        </div>
      </section>

      {/* -------------------- PAGE SELECTOR TABS -------------------- */}
      <section className="panel p-3 sm:p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {PAGES_META.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className={`filter-chip text-xs ${
                selectedSlug === p.slug ? 'filter-chip-active' : ''
              }`}
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* -------------------- SECTIONS LIST -------------------- */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
          <Loader2 size={24} className="animate-spin text-cyan-400" />
          <span className="font-mono uppercase tracking-wider">Loading page sections...</span>
        </div>
      ) : sections.length === 0 ? (
        <div className="panel p-16 text-center text-sm text-slate-400">
          No dynamic sections configured for this page yet. Click &quot;Add section block&quot; to build.
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <article
              key={section.id || idx}
              className="panel p-5 sm:p-6 flex flex-col sm:flex-row items-start justify-between gap-5 group hover:shadow-xl hover:border-cyan-400/40 transition-all"
            >
              <div className="flex items-start gap-4 min-w-0">
                {section.background_image && (
                  <div
                    className="w-24 h-18 rounded-lg bg-black/50 bg-cover bg-center shrink-0 border border-white/10"
                    style={{
                      backgroundImage: `url(${resolveImageUrl(section.background_image)})`,
                    }}
                  />
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/30">
                      {section.section_key || 'Section'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Order #{section.order || idx + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-white mt-1.5">
                    {section.heading || 'Untitled Section'}
                  </h3>

                  {section.subheading && (
                    <p className="text-xs font-medium text-cyan-400 mt-0.5">
                      {section.subheading}
                    </p>
                  )}

                  {section.body_text && (
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {section.body_text}
                    </p>
                  )}

                  {section.cta_text && (
                    <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono text-white">
                      <span>CTA: {section.cta_text}</span>
                      <span className="text-cyan-400">→ {section.cta_link || '#'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                <button
                  onClick={() => handleOpenEditModal(section)}
                  className="secondary-button text-xs py-1.5 px-3"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteTarget(section)}
                  className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                  title="Delete section"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* -------------------- EDIT SECTION MODAL -------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => !saving && setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-[#132527] border border-white/15 rounded-2xl shadow-2xl flex flex-col z-10 text-white overflow-hidden max-h-[90vh] backdrop-blur-xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0f1c1d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-xs">
                  <FileText size={18} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">
                    {editingSection ? `Edit Section: ${formSectionKey}` : `Add Section to ${activePageMeta.label}`}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configure section copy, typography hierarchy, and background visual
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
                className="icon-button"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Section Identifier Key *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSectionKey}
                    onChange={(e) => setFormSectionKey(e.target.value)}
                    placeholder="e.g. hero, manifesto, services, team"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Heading Title
                </label>
                <input
                  type="text"
                  value={formHeading}
                  onChange={(e) => setFormHeading(e.target.value)}
                  placeholder="e.g. Sculpting Monumental Spaces"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Subheading / Eyebrow Text
                </label>
                <input
                  type="text"
                  value={formSubheading}
                  onChange={(e) => setFormSubheading(e.target.value)}
                  placeholder="e.g. Architectural Design & Fabrication Studio"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Body Narrative / Text Content
                </label>
                <textarea
                  rows={5}
                  value={formBodyText}
                  onChange={(e) => setFormBodyText(e.target.value)}
                  placeholder="The spatial narrative, architectural manifesto, or section copy..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Background Visual / Hero Photograph
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-12 rounded-lg bg-black/50 bg-cover bg-center shrink-0 border border-white/10"
                    style={{ backgroundImage: `url(${resolveImageUrl(formBackgroundImage)})` }}
                  />
                  <input
                    type="text"
                    value={formBackgroundImage}
                    onChange={(e) => setFormBackgroundImage(e.target.value)}
                    placeholder="/tr/279A1756.JPG"
                    className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setIsAssetPickerOpen(true)}
                    className="secondary-button text-xs"
                  >
                    <ImageIcon size={13} />
                    <span>Select Photo</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={formCtaText}
                    onChange={(e) => setFormCtaText(e.target.value)}
                    placeholder="e.g. Explore Portfolio"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    CTA Target Link
                  </label>
                  <input
                    type="text"
                    value={formCtaLink}
                    onChange={(e) => setFormCtaLink(e.target.value)}
                    placeholder="e.g. /interior or /contactus"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="secondary-button text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="primary-button text-xs shadow-md"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving section...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{editingSection ? 'Update Section' : 'Add Section'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset Picker for Background */}
      {isAssetPickerOpen && (
        <ImagePickerModal
          isOpen={true}
          onClose={() => setIsAssetPickerOpen(false)}
          onSelect={(url) => {
            setFormBackgroundImage(url);
            setIsAssetPickerOpen(false);
          }}
          currentValue={formBackgroundImage}
          title="Select Section Background Image"
        />
      )}

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Page Section"
        message={`Are you sure you want to delete the section "${deleteTarget?.heading || deleteTarget?.section_key}"? This block will no longer render on the public page.`}
        confirmLabel="Delete Section"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
