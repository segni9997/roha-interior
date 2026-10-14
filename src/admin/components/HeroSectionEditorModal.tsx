import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Loader2,
  FolderPlus,
  UploadCloud,
  Sparkles,
  Link as LinkIcon,
  Check
} from 'lucide-react';
import { api, resolveImageUrl, type PageSectionItem } from '../../services/api';
import { ImagePickerModal } from './ImagePickerModal';

interface HeroSectionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageSlug: 'interior' | 'model-making';
  title: string;
  onSaved?: () => void;
}

export const HeroSectionEditorModal: React.FC<HeroSectionEditorModalProps> = ({
  isOpen,
  onClose,
  pageSlug,
  title,
  onSaved,
}) => {
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [order, setOrder] = useState(1);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Asset picker & upload states
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing hero section data on open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadHero() {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const pageData = await api.getPageContent(pageSlug).catch(() => null);
        if (isMounted && pageData && pageData.sections && pageData.sections.length > 0) {
          const heroSec = pageData.sections.find((s) => s.section_key === 'hero') || pageData.sections[0];
          if (heroSec) {
            setSectionId(heroSec.id);
            setHeading(heroSec.heading || '');
            setSubheading(heroSec.subheading || '');
            setBodyText(heroSec.body_text || '');
            setBackgroundImage(heroSec.background_image || '');
            setCtaText(heroSec.cta_text || '');
            setCtaLink(heroSec.cta_link || '');
            setOrder(heroSec.order || 1);
            return;
          }
        }

        // Set sensible defaults if no record exists yet
        if (pageSlug === 'interior') {
          setHeading('Art That Transforms Spaces');
          setSubheading('');
          setBodyText('Premium 3D wall art and bespoke architectural interior designs that bring life, elegance, and creativity to your spaces.');
          setBackgroundImage('/tr/279A1756.JPG');
          setCtaText('Explore Collection');
          setCtaLink('#interior-archive');
        } else {
          setHeading('PRECISION MODELING.');
          setSubheading('Modeling Making & Precision Fabrication');
          setBodyText('Translating visionary blueprints into tangible, high-fidelity physical realities. Combining laser micro-cutting, high-resolution stereolithography, and artisanal hand-finishing with 0.1mm tolerance.');
          setBackgroundImage('/as.png');
          setCtaText('Explore Physical Archive');
          setCtaLink('#models-archive');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load hero section');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHero();

    return () => {
      isMounted = false;
    };
  }, [isOpen, pageSlug]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(40);
      const res = await api.uploadFile(file);
      setUploadProgress(100);
      setBackgroundImage(res.url);
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const payload: Partial<PageSectionItem> = {
        section_key: 'hero',
        heading: heading.trim(),
        subheading: subheading.trim(),
        body_text: bodyText.trim(),
        background_image: backgroundImage,
        cta_text: ctaText.trim(),
        cta_link: ctaLink.trim(),
        order: order || 1,
      };

      if (sectionId) {
        await api.updatePageSection(sectionId, payload);
      } else {
        const created = await api.createPageSection(pageSlug, payload);
        setSectionId(created.id);
      }

      setSuccess(true);
      if (onSaved) onSaved();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to save hero section');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0f1f21] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]" data-lenis-prevent="true">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#162e31] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/30 text-cyan-300">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">{title}</h2>
              <p className="text-xs text-cyan-300 font-mono uppercase tracking-wider">
                Page: /{pageSlug} • Section: Hero
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 custom-scrollbar" data-lenis-prevent="true">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
              <Check size={16} />
              <span>Hero section saved & live on public site!</span>
            </div>
          )}

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs font-mono">
              <Loader2 size={24} className="animate-spin text-cyan-400" />
              <span>Loading current hero configuration...</span>
            </div>
          ) : (
            <>
              {/* Background Image Preview & Controls */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  {pageSlug === 'model-making'
                    ? 'Centerpiece Scale Model / Hero Image *'
                    : 'Hero Section Background Image *'}
                </label>
                {pageSlug === 'model-making' && (
                  <p className="text-[11px] text-slate-400 font-sans mb-2">
                    This image is rendered as the centerpiece 3D physical model prototype in the hero section.
                  </p>
                )}
                <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/60 aspect-[21/9] sm:aspect-[16/7] w-full flex items-center justify-center group shadow-md">
                  {backgroundImage ? (
                    <img
                      src={resolveImageUrl(backgroundImage)}
                      alt="Hero Background Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="text-slate-500 text-xs font-mono">No background image selected</div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Actions overlay */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-mono font-bold backdrop-blur-md border border-white/30 transition-all cursor-pointer"
                    >
                      {isUploading ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
                      <span>{isUploading ? 'Uploading...' : 'Upload from Device'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAssetPickerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#205b63] hover:bg-[#2b757f] text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-md"
                    >
                      <FolderPlus size={13} />
                      <span>Studio Library</span>
                    </button>
                  </div>

                  {backgroundImage && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-200 border border-white/15">
                      {backgroundImage.split('/').pop()}
                    </div>
                  )}
                </div>
                {uploadProgress !== null && (
                  <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Main Headline */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Main Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder={pageSlug === 'interior' ? 'e.g. Art That Transforms Spaces' : 'e.g. PRECISION MODELING.'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-semibold"
                />
              </div>

              {/* Subheading / Pill Tag */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Subheading / Pill Badge (Optional)
                </label>
                <input
                  type="text"
                  value={subheading}
                  onChange={(e) => setSubheading(e.target.value)}
                  placeholder={pageSlug === 'interior' ? 'e.g. Bespoke Architectural Interiors' : 'e.g. Modeling Making & Precision Fabrication'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Body Narrative */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Editorial Body Narrative / Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Detail the vision, core material philosophy, and studio capability..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              {/* CTAs Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Call To Action Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Explore Collection"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    CTA Destination Link or Anchor
                  </label>
                  <div className="relative">
                    <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={ctaLink}
                      onChange={(e) => setCtaLink(e.target.value)}
                      placeholder="e.g. #interior-archive or /gallery"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-[#205b63] hover:from-cyan-500 hover:to-[#286f78] text-white text-xs font-mono font-bold uppercase transition-all shadow-lg cursor-pointer border border-cyan-400/30"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{saving ? 'Publishing...' : 'Save & Publish Hero'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Asset Picker Modal */}
      <ImagePickerModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        onSelect={(url) => {
          setBackgroundImage(url);
          setIsAssetPickerOpen(false);
        }}
        currentValue={backgroundImage}
        title="Select Hero Background Image"
      />
    </div>
  );
};
