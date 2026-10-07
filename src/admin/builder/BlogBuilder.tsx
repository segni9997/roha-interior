import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  Edit3,
  Plus,
  Save,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Type,
  Quote,
  Grid,
  Columns,
  Sparkles,
  List,
  ExternalLink,
  Layers,
  FileText,
  Clock,
  Calendar,
  BookOpen,
  ArrowUpRight,
  Split,
  Loader2
} from 'lucide-react';
import {
  api,
  resolveImageUrl,
  type BlogPostItem,
  type CategoryItem,
  type GalleryImageItem
} from '../../services/api';
import { ToastContainer, type ToastMessage } from '../components/Toast';
import { ImagePickerModal } from '../components/ImagePickerModal';
import { FloatingShape, SHAPES } from '../../components/FloatingShapes';
import { NavigationOverlay } from '../../components/NavBar';
import Footer from '../../components/Footer';

// -------------------------------------------------------------
// BLOCK DATA DEFINITIONS
// -------------------------------------------------------------

export type BlogBlockType =
  | 'heading'
  | 'lead'
  | 'paragraph'
  | 'quote'
  | 'callout'
  | 'list'
  | 'image_single'
  | 'two_images'
  | 'three_images'
  | 'image_text'
  | 'gallery'
  | 'divider';

export interface BlogBlock {
  id: string;
  type: BlogBlockType;
  // Heading
  level?: 'h1' | 'h2' | 'h3';
  text?: string;
  badge?: string;
  subtitle?: string;
  // Quote
  author?: string;
  role?: string;
  citation?: string;
  // Callout
  title?: string;
  items?: string[];
  // List
  listType?: 'bullet' | 'number';
  // Images
  image?: string;
  caption?: string;
  alt?: string;
  aspectRatio?: '16:9' | '21:9' | '4:3' | 'original';
  // Two Images
  image1?: string;
  caption1?: string;
  image2?: string;
  caption2?: string;
  // Three Images
  image3?: string;
  caption3?: string;
  // Image + Text
  imagePosition?: 'left' | 'right';
  // Gallery
  images?: { url: string; caption?: string }[];
  columns?: number;
}

export interface MonographData {
  id?: number;
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  category: string;
  category_id?: number;
  type: string;
  year: string;
  author: string;
  author_avatar?: string;
  readTime: string;
  cover_image: string;
  is_published: boolean;
  blocks: BlogBlock[];
  gallery_images?: GalleryImageItem[];
}

const DEFAULT_BLOCKS: BlogBlock[] = [
  {
    id: 'b-lead-1',
    type: 'lead',
    text: 'In the continuous evolution of architectural expression, the dialogue between raw materiality, spatial fluidity, and natural luminosity defines the soul of contemporary living.'
  },
  {
    id: 'b-heading-1',
    type: 'heading',
    level: 'h2',
    badge: 'Spatial Curation',
    text: 'Monolithic Tectonics & Volumetric Harmony',
    subtitle: 'Exploring the boundary between tectonic enclosure and natural light.'
  },
  {
    id: 'b-img2-1',
    type: 'two_images',
    image1: '/tr/279A1756.JPG',
    caption1: 'Volumetric basalt living atrium under zenith lighting',
    image2: '/pexels-chudin-alexey-26964541.jpg',
    caption2: 'Smoked oak joinery detailing and tactile stone surfaces',
    subtitle: 'Figure 1.0 — Contrasting material textures in natural daylight'
  },
  {
    id: 'b-para-1',
    type: 'paragraph',
    text: 'Every spatial boundary is intentionally calibrated to foster seamless transitions. By using monolithic stone floors with brushed bronze inserts and floor-to-ceiling glass pavilions, the boundary between the interior refuge and the surrounding landscape ceases to exist.'
  },
  {
    id: 'b-quote-1',
    type: 'quote',
    text: 'Architecture is not simply the organization of space; it is the choreography of light, emotion, and human presence across time.',
    author: 'ROHA Design Principal',
    role: 'Lead Spatial Architect'
  },
  {
    id: 'b-callout-1',
    type: 'callout',
    title: 'Core Architectural Takeaways',
    text: 'Three essential tenets guided this spatial realization:',
    items: [
      'Honesty in raw materiality: basalt, limewash, and smoked oak without artificial veneers.',
      'Zenith diffused natural illumination that shifts subtly from morning to twilight.',
      'Precise 2mm shadow gap reveals between architectural planes for tectonic lightness.'
    ]
  }
];

const INITIAL_MONOGRAPH: MonographData = {
  title: 'THE DIALOGUE BETWEEN VOID AND FORM IN CONTEMPORARY RESIDENCES',
  subtitle: 'A monograph on tectonic honesty, ambient luminosity, and bespoke living spaces.',
  slug: 'dialogue-between-void-and-form',
  description: 'An architectural examination of contemporary monolithic residences, tectonic materials, and spatial harmony curated by ROHA Studio.',
  category: 'Architecture',
  type: 'Monograph',
  year: '2026',
  author: 'ROHA Studio Editorial',
  author_avatar: '',
  readTime: '6 min read',
  cover_image: '/tr/279A1756.JPG',
  is_published: true,
  blocks: DEFAULT_BLOCKS,
  gallery_images: []
};

export const BlogBuilder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const postIdParam = searchParams.get('id');

  const [monograph, setMonograph] = useState<MonographData>(INITIAL_MONOGRAPH);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Image Picker Modal State
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<{
    blockId?: string;
    field: 'cover' | 'image' | 'image1' | 'image2' | 'image3';
  } | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Load existing blog post if ID provided
  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      try {
        setLoading(true);
        const [cats] = await Promise.all([
          api.getBlogCategories().catch(() => []),
        ]);
        if (isMounted) setCategories(cats);

        if (postIdParam) {
          const parsedId = parseInt(postIdParam, 10);
          if (!isNaN(parsedId)) {
            const livePost = await api.getBlogPost(parsedId);
            if (isMounted && livePost) {
              let loadedBlocks: BlogBlock[] = DEFAULT_BLOCKS;
              if (livePost.content) {
                if (Array.isArray(livePost.content)) {
                  loadedBlocks = (livePost.content as any[]).map((b, i) => ({
                    id: `b-loaded-${i}-${Date.now()}`,
                    ...b
                  }));
                } else if (typeof livePost.content === 'string') {
                  try {
                    const parsed = JSON.parse(livePost.content);
                    if (Array.isArray(parsed)) {
                      loadedBlocks = parsed.map((b, i) => ({
                        id: `b-loaded-${i}-${Date.now()}`,
                        ...b
                      }));
                    }
                  } catch {
                    loadedBlocks = [{ id: 'b-0', type: 'paragraph', text: livePost.content }];
                  }
                }
              }

              setMonograph({
                id: livePost.id,
                title: livePost.title,
                subtitle: livePost.description || '',
                slug: livePost.slug || '',
                description: livePost.description || '',
                category: typeof livePost.category === 'object' ? (livePost.category as any)?.name : (livePost.category || 'Architecture'),
                category_id: livePost.category_id,
                type: livePost.type || 'Monograph',
                year: livePost.year || new Date().getFullYear().toString(),
                author: typeof livePost.author === 'object' ? (livePost.author as any)?.name : (livePost.author || 'ROHA Editorial'),
                author_avatar: (livePost as any)?.author_details?.avatar || '',
                readTime: livePost.readTime || '5 min read',
                cover_image: resolveImageUrl(livePost.cover_image || livePost.image, '/tr/279A1756.JPG'),
                is_published: livePost.is_published ?? true,
                blocks: loadedBlocks.length > 0 ? loadedBlocks : DEFAULT_BLOCKS,
                gallery_images: livePost.gallery_images || []
              });
            }
          }
        }
      } catch (err: any) {
        addToast('error', 'Failed to load article', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, [postIdParam]);

  // -------------------------------------------------------------
  // BLOCK MANAGEMENT ACTIONS
  // -------------------------------------------------------------

  const handleAddBlock = (type: BlogBlockType) => {
    const newId = `b-${Date.now()}`;
    let newBlock: BlogBlock = { id: newId, type };

    switch (type) {
      case 'heading':
        newBlock = { ...newBlock, level: 'h2', text: 'New Section Heading', badge: 'Architecture' };
        break;
      case 'lead':
        newBlock = { ...newBlock, text: 'A compelling opening narrative highlighting spatial significance...' };
        break;
      case 'paragraph':
        newBlock = { ...newBlock, text: 'Write rich architectural narratives, material discussions, or project context here...' };
        break;
      case 'quote':
        newBlock = { ...newBlock, text: 'Architecture is poetry written in stone, timber, and light.', author: 'Lead Architect', role: 'ROHA Design Principal' };
        break;
      case 'callout':
        newBlock = { ...newBlock, title: 'Key Design Pillars', text: 'Core principles of this spatial curation:', items: ['Volumetric balance', 'Natural light orientation', 'Bespoke joinery'] };
        break;
      case 'list':
        newBlock = { ...newBlock, listType: 'bullet', items: ['First spatial observation', 'Second material specification', 'Third tectonic detail'] };
        break;
      case 'image_single':
        newBlock = { ...newBlock, image: '/tr/279A1756.JPG', caption: 'Bespoke interior materiality and lighting', aspectRatio: '16:9' };
        break;
      case 'two_images':
        newBlock = { ...newBlock, image1: '/tr/279A1756.JPG', caption1: 'Daylight orientation', image2: '/pexels-chudin-alexey-26964541.jpg', caption2: 'Material texture study', subtitle: 'Comparative spatial study' };
        break;
      case 'three_images':
        newBlock = { ...newBlock, image1: '/tr/279A1756.JPG', caption1: 'Perspective A', image2: '/pexels-chudin-alexey-26964541.jpg', caption2: 'Perspective B', image3: '/1.jpg', caption3: 'Perspective C', subtitle: 'Tri-view spatial perspective' };
        break;
      case 'image_text':
        newBlock = { ...newBlock, image: '/tr/279A1756.JPG', imagePosition: 'left', title: 'Tectonic Materiality', text: 'Detailed commentary discussing how the volcanic basalt was quarried locally and crafted to millimeter tolerances.' };
        break;
      case 'gallery':
        newBlock = { ...newBlock, title: 'Monograph Visual Gallery', images: [{ url: '/tr/279A1756.JPG', caption: 'Living Pavilion' }, { url: '/pexels-chudin-alexey-26964541.jpg', caption: 'Courtyard Reflection' }] };
        break;
      case 'divider':
        break;
    }

    setMonograph(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
    addToast('info', 'Block Added', `Inserted new ${type.replace('_', ' ')} block.`);
  };

  const handleUpdateBlock = (id: string, updates: Partial<BlogBlock>) => {
    setMonograph(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => (b.id === id ? { ...b, ...updates } : b))
    }));
  };

  const handleDeleteBlock = (id: string) => {
    setMonograph(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
    addToast('info', 'Block Removed', 'The content block has been removed.');
  };

  const handleDuplicateBlock = (id: string) => {
    const target = monograph.blocks.find(b => b.id === id);
    if (!target) return;
    const duplicated: BlogBlock = {
      ...target,
      id: `b-copy-${Date.now()}`
    };
    const index = monograph.blocks.findIndex(b => b.id === id);
    const updated = [...monograph.blocks];
    updated.splice(index + 1, 0, duplicated);
    setMonograph(prev => ({ ...prev, blocks: updated }));
    addToast('success', 'Block Duplicated', 'Duplicated block directly below.');
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === monograph.blocks.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...monograph.blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setMonograph(prev => ({ ...prev, blocks: updated }));
  };

  // Image picking handler
  const openImagePicker = (field: 'cover' | 'image' | 'image1' | 'image2' | 'image3', blockId?: string) => {
    setImagePickerTarget({ field, blockId });
    setImagePickerOpen(true);
  };

  const handleImageSelected = (url: string) => {
    if (!imagePickerTarget) return;
    if (imagePickerTarget.field === 'cover') {
      setMonograph(prev => ({ ...prev, cover_image: url }));
    } else if (imagePickerTarget.blockId) {
      handleUpdateBlock(imagePickerTarget.blockId, {
        [imagePickerTarget.field]: url
      });
    }
    setImagePickerOpen(false);
    setImagePickerTarget(null);
    addToast('success', 'Image Applied', 'Selected image has been updated.');
  };

  // Save / Publish to Backend API
  const handleSaveMonograph = async (publish: boolean = true) => {
    if (!monograph.title.trim()) {
      addToast('error', 'Title Required', 'Please provide a title for the monograph.');
      return;
    }

    try {
      setSaving(true);
      const generatedSlug = monograph.slug || monograph.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Clean blocks to serializable JSON payload
      const cleanedBlocks = monograph.blocks.map(b => {
        const { id, ...rest } = b;
        return rest;
      });

      const payload: Partial<BlogPostItem> = {
        title: monograph.title,
        slug: generatedSlug,
        description: monograph.description || monograph.subtitle,
        category: monograph.category,
        category_id: monograph.category_id,
        type: monograph.type,
        year: monograph.year,
        author: monograph.author,
        readTime: monograph.readTime,
        cover_image: monograph.cover_image,
        image: monograph.cover_image,
        is_published: publish,
        content: cleanedBlocks as any,
      };

      if (monograph.id) {
        await api.updateBlogPost(monograph.id, payload);
        addToast('success', 'Monograph Updated', `"${monograph.title}" successfully saved.`);
      } else {
        const created = await api.createBlogPost(payload);
        setMonograph(prev => ({ ...prev, id: created.id }));
        setSearchParams({ id: created.id.toString() });
        addToast('success', 'Monograph Published', `"${monograph.title}" published to live journal.`);
      }
    } catch (err: any) {
      addToast('error', 'Save Failed', err.message || 'Could not save monograph to server.');
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER EDITORS FOR EACH BLOCK
  // -------------------------------------------------------------

  const renderBlockEditor = (block: BlogBlock, index: number) => {
    return (
      <div
        key={block.id}
        className="group/block relative bg-[#132527]/90 hover:bg-[#132527] border border-white/15 hover:border-cyan-500/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl"
      >
        {/* Block Header & Action Toolbar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-[11px] font-mono font-bold">
              {index + 1}
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              {block.type === 'heading' && <Type size={13} className="text-cyan-400" />}
              {block.type === 'lead' && <Sparkles size={13} className="text-cyan-400" />}
              {block.type === 'paragraph' && <FileText size={13} className="text-slate-400" />}
              {block.type === 'quote' && <Quote size={13} className="text-amber-400" />}
              {block.type === 'callout' && <Sparkles size={13} className="text-cyan-400" />}
              {block.type === 'list' && <List size={13} className="text-teal-400" />}
              {block.type === 'image_single' && <ImageIcon size={13} className="text-indigo-400" />}
              {block.type === 'two_images' && <Columns size={13} className="text-indigo-400" />}
              {block.type === 'three_images' && <Grid size={13} className="text-indigo-400" />}
              {block.type === 'image_text' && <Split size={13} className="text-emerald-400" />}
              {block.type === 'gallery' && <Layers size={13} className="text-cyan-400" />}
              {block.type === 'divider' && <MinusIcon className="text-slate-400" />}
              <span>{block.type.replace('_', ' ')}</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleMoveBlock(index, 'up')}
              disabled={index === 0}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Move Up"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() => handleMoveBlock(index, 'down')}
              disabled={index === monograph.blocks.length - 1}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Move Down"
            >
              <ChevronDown size={14} />
            </button>
            <button
              onClick={() => handleDuplicateBlock(block.id)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              title="Duplicate Block"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => handleDeleteBlock(block.id)}
              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-500/20 cursor-pointer ml-1"
              title="Delete Block"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* ----------------- HEADING BLOCK ----------------- */}
        {block.type === 'heading' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-lg bg-black/40 p-1 border border-white/10 text-xs font-mono font-bold">
                {(['h1', 'h2', 'h3'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => handleUpdateBlock(block.id, { level: lvl })}
                    className={`px-3 py-1 rounded-md transition-all uppercase ${
                      (block.level || 'h2') === lvl
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={block.badge || ''}
                onChange={e => handleUpdateBlock(block.id, { badge: e.target.value })}
                placeholder="Optional Eyebrow Badge (e.g., Tectonic Study)"
                className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-cyan-300 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <input
              type="text"
              value={block.text || ''}
              onChange={e => handleUpdateBlock(block.id, { text: e.target.value })}
              placeholder="Section Heading Title..."
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-lg font-bold text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
            />

            <input
              type="text"
              value={block.subtitle || ''}
              onChange={e => handleUpdateBlock(block.id, { subtitle: e.target.value })}
              placeholder="Optional Subtitle or Monograph Clarification..."
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-xs italic text-slate-300 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        )}

        {/* ----------------- LEAD STANDFIRST BLOCK ----------------- */}
        {block.type === 'lead' && (
          <div>
            <textarea
              rows={3}
              value={block.text || ''}
              onChange={e => handleUpdateBlock(block.id, { text: e.target.value })}
              placeholder="Write a high-impact standfirst opening narrative..."
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cyan-500/30 text-base font-serif italic text-cyan-100 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none leading-relaxed"
            />
          </div>
        )}

        {/* ----------------- BODY PARAGRAPH BLOCK ----------------- */}
        {block.type === 'paragraph' && (
          <div>
            <textarea
              rows={4}
              value={block.text || ''}
              onChange={e => handleUpdateBlock(block.id, { text: e.target.value })}
              placeholder="Write rich architectural narratives, construction details, and spatial observations..."
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none leading-relaxed"
            />
          </div>
        )}

        {/* ----------------- PULL QUOTE BLOCK ----------------- */}
        {block.type === 'quote' && (
          <div className="space-y-3">
            <textarea
              rows={3}
              value={block.text || ''}
              onChange={e => handleUpdateBlock(block.id, { text: e.target.value })}
              placeholder="Quote statement or philosophical architectural thought..."
              className="w-full px-4 py-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-base font-serif italic text-amber-100 placeholder:text-slate-600 focus:border-amber-400 focus:outline-none leading-relaxed"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={block.author || ''}
                onChange={e => handleUpdateBlock(block.id, { author: e.target.value })}
                placeholder="Author (e.g., Principal Architect)"
                className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-amber-300 placeholder:text-slate-600 focus:border-amber-400 focus:outline-none"
              />
              <input
                type="text"
                value={block.role || ''}
                onChange={e => handleUpdateBlock(block.id, { role: e.target.value })}
                placeholder="Role or Publication Citation"
                className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-300 placeholder:text-slate-600 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ----------------- CALLOUT / KEY TAKEAWAYS BLOCK ----------------- */}
        {block.type === 'callout' && (
          <div className="space-y-3">
            <input
              type="text"
              value={block.title || ''}
              onChange={e => handleUpdateBlock(block.id, { title: e.target.value })}
              placeholder="Callout Card Title (e.g., Key Architectural Insights)"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
            />
            <input
              type="text"
              value={block.text || ''}
              onChange={e => handleUpdateBlock(block.id, { text: e.target.value })}
              placeholder="Optional summary statement..."
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
            />

            <div className="space-y-2 pt-2">
              <label className="block text-[10px] font-mono uppercase text-slate-400 font-semibold">Bullet Points:</label>
              {(block.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <input
                    type="text"
                    value={item}
                    onChange={e => {
                      const updated = [...(block.items || [])];
                      updated[idx] = e.target.value;
                      handleUpdateBlock(block.id, { items: updated });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const updated = (block.items || []).filter((_, i) => i !== idx);
                      handleUpdateBlock(block.id, { items: updated });
                    }}
                    className="p-1 rounded text-rose-400 hover:bg-rose-950/50"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleUpdateBlock(block.id, { items: [...(block.items || []), ''] })}
                className="mt-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Bullet Item</span>
              </button>
            </div>
          </div>
        )}

        {/* ----------------- LIST BLOCK ----------------- */}
        {block.type === 'list' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 font-semibold">Type:</span>
              <button
                onClick={() => handleUpdateBlock(block.id, { listType: 'bullet' })}
                className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                  (block.listType || 'bullet') === 'bullet'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-black/40 text-slate-400'
                }`}
              >
                Bullet
              </button>
              <button
                onClick={() => handleUpdateBlock(block.id, { listType: 'number' })}
                className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                  block.listType === 'number'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-black/40 text-slate-400'
                }`}
              >
                Numbered
              </button>
            </div>

            <div className="space-y-2">
              {(block.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-300 w-5 text-right shrink-0">
                    {block.listType === 'number' ? `${idx + 1}.` : '•'}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={e => {
                      const updated = [...(block.items || [])];
                      updated[idx] = e.target.value;
                      handleUpdateBlock(block.id, { items: updated });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const updated = (block.items || []).filter((_, i) => i !== idx);
                      handleUpdateBlock(block.id, { items: updated });
                    }}
                    className="p-1 rounded text-rose-400 hover:bg-rose-950/50"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleUpdateBlock(block.id, { items: [...(block.items || []), ''] })}
                className="mt-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add List Item</span>
              </button>
            </div>
          </div>
        )}

        {/* ----------------- SINGLE IMAGE BLOCK ----------------- */}
        {block.type === 'image_single' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-32 h-20 rounded-xl overflow-hidden border border-white/15 bg-black/40 shrink-0 relative group">
                {block.image ? (
                  <img src={resolveImageUrl(block.image)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <ImageIcon size={20} />
                  </div>
                )}
                <button
                  onClick={() => openImagePicker('image', block.id)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-mono uppercase font-bold transition-opacity"
                >
                  Change
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={block.image || ''}
                    onChange={e => handleUpdateBlock(block.id, { image: e.target.value })}
                    placeholder="/tr/279A1756.JPG or image URL"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    onClick={() => openImagePicker('image', block.id)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold cursor-pointer"
                  >
                    Select DAM
                  </button>
                </div>

                <input
                  type="text"
                  value={block.caption || ''}
                  onChange={e => handleUpdateBlock(block.id, { caption: e.target.value })}
                  placeholder="Architectural caption & figure citation..."
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-300 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TWO IMAGES (SIDE-BY-SIDE) BLOCK ----------------- */}
        {block.type === 'two_images' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Image 1 */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">Image 1 (Left)</span>
                  <button
                    onClick={() => openImagePicker('image1', block.id)}
                    className="text-[10px] font-mono text-cyan-400 underline cursor-pointer"
                  >
                    Choose Media
                  </button>
                </div>
                <div className="h-28 rounded-lg overflow-hidden border border-white/10 bg-black/40 relative">
                  <img src={resolveImageUrl(block.image1 || '/tr/279A1756.JPG')} alt="Left" className="w-full h-full object-cover" />
                </div>
                <input
                  type="text"
                  value={block.image1 || ''}
                  onChange={e => handleUpdateBlock(block.id, { image1: e.target.value })}
                  placeholder="Image path or URL"
                  className="w-full px-2.5 py-1 rounded bg-black/40 border border-white/10 text-[11px] text-white focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={block.caption1 || ''}
                  onChange={e => handleUpdateBlock(block.id, { caption1: e.target.value })}
                  placeholder="Caption for Image 1..."
                  className="w-full px-2.5 py-1 rounded bg-black/40 border border-white/10 text-[11px] text-slate-300 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Image 2 */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">Image 2 (Right)</span>
                  <button
                    onClick={() => openImagePicker('image2', block.id)}
                    className="text-[10px] font-mono text-cyan-400 underline cursor-pointer"
                  >
                    Choose Media
                  </button>
                </div>
                <div className="h-28 rounded-lg overflow-hidden border border-white/10 bg-black/40 relative">
                  <img src={resolveImageUrl(block.image2 || '/pexels-chudin-alexey-26964541.jpg')} alt="Right" className="w-full h-full object-cover" />
                </div>
                <input
                  type="text"
                  value={block.image2 || ''}
                  onChange={e => handleUpdateBlock(block.id, { image2: e.target.value })}
                  placeholder="Image path or URL"
                  className="w-full px-2.5 py-1 rounded bg-black/40 border border-white/10 text-[11px] text-white focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={block.caption2 || ''}
                  onChange={e => handleUpdateBlock(block.id, { caption2: e.target.value })}
                  placeholder="Caption for Image 2..."
                  className="w-full px-2.5 py-1 rounded bg-black/40 border border-white/10 text-[11px] text-slate-300 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <input
              type="text"
              value={block.subtitle || ''}
              onChange={e => handleUpdateBlock(block.id, { subtitle: e.target.value })}
              placeholder="Overall Figure / Comparative Subtitle Caption..."
              className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-300 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        )}

        {/* ----------------- THREE IMAGES (TRI-VIEW) BLOCK ----------------- */}
        {block.type === 'three_images' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'image1' as const, capKey: 'caption1' as const, label: 'Image 1' },
                { key: 'image2' as const, capKey: 'caption2' as const, label: 'Image 2' },
                { key: 'image3' as const, capKey: 'caption3' as const, label: 'Image 3' }
              ].map(slot => (
                <div key={slot.key} className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">{slot.label}</span>
                    <button
                      onClick={() => openImagePicker(slot.key, block.id)}
                      className="text-[10px] font-mono text-cyan-400 underline cursor-pointer"
                    >
                      Media
                    </button>
                  </div>
                  <div className="h-24 rounded-lg overflow-hidden border border-white/10 bg-black/40 relative">
                    <img src={resolveImageUrl((block as any)[slot.key] || '/tr/279A1756.JPG')} alt={slot.label} className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={(block as any)[slot.key] || ''}
                    onChange={e => handleUpdateBlock(block.id, { [slot.key]: e.target.value })}
                    placeholder="Path / URL"
                    className="w-full px-2 py-1 rounded bg-black/40 border border-white/10 text-[10px] text-white focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={(block as any)[slot.capKey] || ''}
                    onChange={e => handleUpdateBlock(block.id, { [slot.capKey]: e.target.value })}
                    placeholder="Caption..."
                    className="w-full px-2 py-1 rounded bg-black/40 border border-white/10 text-[10px] text-slate-300 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <input
              type="text"
              value={block.subtitle || ''}
              onChange={e => handleUpdateBlock(block.id, { subtitle: e.target.value })}
              placeholder="Overall Tri-View Figure Caption..."
              className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-300 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        )}

        {/* ----------------- IMAGE + TEXT SPLIT BLOCK ----------------- */}
        {block.type === 'image_text' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 font-semibold">Image Side:</span>
              <button
                onClick={() => handleUpdateBlock(block.id, { imagePosition: 'left' })}
                className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                  (block.imagePosition || 'left') === 'left'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-black/40 text-slate-400'
                }`}
              >
                Left
              </button>
              <button
                onClick={() => handleUpdateBlock(block.id, { imagePosition: 'right' })}
                className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                  block.imagePosition === 'right'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-black/40 text-slate-400'
                }`}
              >
                Right
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 space-y-2">
                <div className="h-32 rounded-xl overflow-hidden border border-white/15 bg-black/40 relative group">
                  <img src={resolveImageUrl(block.image || '/tr/279A1756.JPG')} alt="Split" className="w-full h-full object-cover" />
                  <button
                    onClick={() => openImagePicker('image', block.id)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-mono uppercase font-bold transition-opacity"
                  >
                    Change Image
                  </button>
                </div>
                <input
                  type="text"
                  value={block.image || ''}
                  onChange={e => handleUpdateBlock(block.id, { image: e.target.value })}
                  placeholder="Image path"
                  className="w-full px-2.5 py-1 rounded bg-black/40 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={block.caption || ''}
                  onChange={e => handleUpdateBlock(block.id, { caption: e.target.value })}
                  placeholder="Image caption..."
                  className="w-full px-2.5 py-1 rounded bg-black/40 border border-white/10 text-[11px] text-slate-300 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="md:col-span-8 space-y-2">
                <input
                  type="text"
                  value={block.title || ''}
                  onChange={e => handleUpdateBlock(block.id, { title: e.target.value })}
                  placeholder="Split Column Title..."
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-sm font-bold text-white focus:border-cyan-400 focus:outline-none"
                />
                <textarea
                  rows={4}
                  value={block.text || ''}
                  onChange={e => handleUpdateBlock(block.id, { text: e.target.value })}
                  placeholder="Accompanying narrative or tectonic description..."
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ----------------- MULTI-IMAGE GALLERY BLOCK ----------------- */}
        {block.type === 'gallery' && (
          <div className="space-y-3">
            <input
              type="text"
              value={block.title || ''}
              onChange={e => handleUpdateBlock(block.id, { title: e.target.value })}
              placeholder="Gallery Section Title (e.g., Construction Details)"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 focus:border-cyan-400 focus:outline-none"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(block.images || []).map((img, i) => (
                <div key={i} className="p-2 rounded-xl bg-black/40 border border-white/10 relative space-y-1.5">
                  <div className="h-20 rounded-lg overflow-hidden bg-black/60">
                    <img src={resolveImageUrl(img.url)} alt={`Gal ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={img.caption || ''}
                    onChange={e => {
                      const updated = [...(block.images || [])];
                      updated[i] = { ...updated[i], caption: e.target.value };
                      handleUpdateBlock(block.id, { images: updated });
                    }}
                    placeholder="Caption..."
                    className="w-full px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-slate-300 border border-white/5 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const updated = (block.images || []).filter((_, idx) => idx !== i);
                      handleUpdateBlock(block.id, { images: updated });
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-950/80 text-rose-300 hover:text-white cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const updated = [...(block.images || []), { url: '/tr/279A1756.JPG', caption: 'Detail sample' }];
                handleUpdateBlock(block.id, { images: updated });
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Image to Gallery</span>
            </button>
          </div>
        )}

        {/* ----------------- DIVIDER BLOCK ----------------- */}
        {block.type === 'divider' && (
          <div className="py-2 flex items-center justify-center gap-3">
            <span className="h-px bg-white/20 flex-1" />
            <span className="w-2 h-2 rotate-45 border border-cyan-400 bg-cyan-950" />
            <span className="h-px bg-white/20 flex-1" />
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------
  // RENDER LIVE PUBLIC MONOGRAPH PREVIEW
  // -------------------------------------------------------------

  const renderLivePreview = () => {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#0b1415] via-[#101e20] to-[#0b1415] text-white overflow-hidden pb-20">
        <NavigationOverlay />

        {/* 3D Floating Shapes */}
        <FloatingShape src={SHAPES.diamond} size={90} top="10%" left="5%" blur="1px" opacity={0.3} rotate={-15} duration={8} />
        <FloatingShape src={SHAPES.cone} size={95} top="22%" right="6%" blur="2px" opacity={0.25} rotate={25} duration={9.5} delay={0.8} />
        <FloatingShape src={SHAPES.cubeAlt1} size={70} top="55%" left="6%" blur="none" opacity={0.3} rotate={-25} duration={7} delay={1.5} />
        <FloatingShape src={SHAPES.cylinder} size={75} top="75%" right="8%" blur="1px" opacity={0.3} rotate={15} duration={8.5} delay={2} />

        {/* Header Preview */}
        <div className="max-w-5xl mx-auto px-6 pt-32 pb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="px-3.5 py-1.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold uppercase tracking-wider rounded-full">
              {monograph.category}
            </span>
            <span className="px-3.5 py-1.5 bg-white/10 text-slate-300 border border-white/15 text-[11px] font-mono font-bold uppercase tracking-wider rounded-full">
              {monograph.type}
            </span>
            <span className="px-3 py-1.5 text-slate-400 text-[11px] font-mono font-semibold uppercase tracking-wider">
              {monograph.year}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.12] mb-8 tracking-tight uppercase font-display">
            {monograph.title}
          </h1>

          <div className="relative h-[360px] sm:h-[480px] md:h-[540px] w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/15 bg-black/40">
            <img src={resolveImageUrl(monograph.cover_image)} alt={monograph.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-28 p-6 rounded-3xl border border-white/15 bg-[#132527]/90 backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-black/40 overflow-hidden border border-white/20 shrink-0">
                  <img
                    src={monograph.author_avatar ? resolveImageUrl(monograph.author_avatar) : `https://ui-avatars.com/api/?name=${encodeURIComponent(monograph.author)}&background=205b63&color=fff`}
                    alt={monograph.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-cyan-400 uppercase font-mono font-bold tracking-wider">Curated by</p>
                  <p className="text-base font-bold text-white">{monograph.author}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 p-3 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-cyan-300 font-mono uppercase font-bold mb-1">Published</p>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Calendar size={13} className="text-cyan-400" /> {monograph.year}
                  </p>
                </div>
                <div className="bg-black/30 p-3 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-cyan-300 font-mono uppercase font-bold mb-1">Read Time</p>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Clock size={13} className="text-cyan-400" /> {monograph.readTime}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8 order-1 lg:order-2 bg-[#132527]/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/15 shadow-2xl">
            {monograph.description && (
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed mb-8 italic border-l-4 border-cyan-400 pl-5 py-2 font-medium bg-cyan-950/30 rounded-r-xl">
                {monograph.description}
              </p>
            )}

            {monograph.blocks.map((block, idx) => {
              if (block.type === 'heading') {
                const lvl = block.level || 'h2';
                return (
                  <div key={idx} className="my-8 first:mt-2">
                    {block.badge && (
                      <span className="inline-block px-3 py-1 mb-2.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {block.badge}
                      </span>
                    )}
                    {lvl === 'h1' ? (
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display uppercase mb-3">
                        {block.text}
                      </h2>
                    ) : lvl === 'h3' ? (
                      <h4 className="text-xl sm:text-2xl font-bold text-cyan-200 tracking-tight font-display mb-2">
                        {block.text}
                      </h4>
                    ) : (
                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display mb-3">
                        {block.text}
                      </h3>
                    )}
                    {block.subtitle && (
                      <p className="text-sm sm:text-base text-slate-300 font-light italic">
                        {block.subtitle}
                      </p>
                    )}
                  </div>
                );
              }

              if (block.type === 'lead') {
                return (
                  <div key={idx} className="my-6 p-6 rounded-2xl bg-cyan-950/40 border-l-4 border-cyan-400 border border-cyan-800/30">
                    <p className="text-lg sm:text-xl text-cyan-100 leading-relaxed font-serif italic">
                      {block.text}
                    </p>
                  </div>
                );
              }

              if (block.type === 'paragraph') {
                return (
                  <p key={idx} className="text-slate-200 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                    {block.text}
                  </p>
                );
              }

              if (block.type === 'quote') {
                return (
                  <figure key={idx} className="my-8 p-6 sm:p-8 rounded-2xl bg-amber-500/10 border-l-4 border-amber-400 border border-amber-500/20">
                    <blockquote className="text-lg sm:text-xl font-serif italic text-amber-100 leading-relaxed">
                      &ldquo;{block.text}&rdquo;
                    </blockquote>
                    {(block.author || block.role) && (
                      <figcaption className="mt-4 flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber-300">
                        <span>— {block.author || 'Architectural Commentary'}</span>
                        {block.role && <span className="text-amber-300/70">({block.role})</span>}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              if (block.type === 'callout') {
                return (
                  <div key={idx} className="my-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-[#0f1c1d] border border-cyan-500/30 shadow-lg">
                    <div className="flex items-center gap-2.5 mb-3 text-cyan-300 font-mono text-xs uppercase font-bold tracking-wider">
                      <Sparkles size={15} className="text-cyan-400" />
                      <span>{block.title || 'Key Architectural Insights'}</span>
                    </div>
                    {block.text && <p className="text-sm sm:text-base text-slate-200 mb-4 leading-relaxed">{block.text}</p>}
                    {block.items && block.items.length > 0 && (
                      <ul className="space-y-2 text-sm sm:text-base text-slate-200">
                        {block.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }

              if (block.type === 'two_images') {
                return (
                  <figure key={idx} className="my-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-lg">
                        <img src={resolveImageUrl(block.image1)} alt="Left" className="w-full h-64 sm:h-72 object-cover" />
                        {block.caption1 && <p className="p-2.5 text-[11px] font-mono text-slate-400 bg-black/50 border-t border-white/10">{block.caption1}</p>}
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-lg">
                        <img src={resolveImageUrl(block.image2)} alt="Right" className="w-full h-64 sm:h-72 object-cover" />
                        {block.caption2 && <p className="p-2.5 text-[11px] font-mono text-slate-400 bg-black/50 border-t border-white/10">{block.caption2}</p>}
                      </div>
                    </div>
                    {block.subtitle && <figcaption className="mt-2 text-center text-xs font-mono text-slate-400">{block.subtitle}</figcaption>}
                  </figure>
                );
              }

              if (block.type === 'three_images') {
                return (
                  <figure key={idx} className="my-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { img: block.image1, cap: block.caption1 },
                        { img: block.image2, cap: block.caption2 },
                        { img: block.image3, cap: block.caption3 }
                      ].map((item, i) => (
                        <div key={i} className="rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-lg">
                          <img src={resolveImageUrl(item.img)} alt="Tri" className="w-full h-52 sm:h-60 object-cover" />
                          {item.cap && <p className="p-2 text-[10px] font-mono text-slate-400 bg-black/50 border-t border-white/10 truncate">{item.cap}</p>}
                        </div>
                      ))}
                    </div>
                    {block.subtitle && <figcaption className="mt-2 text-center text-xs font-mono text-slate-400">{block.subtitle}</figcaption>}
                  </figure>
                );
              }

              if (block.type === 'image_text') {
                const isLeft = block.imagePosition !== 'right';
                return (
                  <div key={idx} className="my-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className={`md:col-span-6 ${isLeft ? 'order-1' : 'order-2'}`}>
                      <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-xl">
                        <img src={resolveImageUrl(block.image)} alt="Split" className="w-full h-64 sm:h-80 object-cover" />
                      </div>
                      {block.caption && <p className="mt-2 text-xs font-mono text-slate-400 text-center">{block.caption}</p>}
                    </div>
                    <div className={`md:col-span-6 ${isLeft ? 'order-2' : 'order-1'}`}>
                      {block.title && <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-display">{block.title}</h3>}
                      <p className="text-slate-200 text-base leading-relaxed">{block.text}</p>
                    </div>
                  </div>
                );
              }

              if (block.type === 'gallery' && block.images && block.images.length > 0) {
                return (
                  <div key={idx} className="my-10 pt-4 border-t border-white/10">
                    {block.title && <h4 className="text-lg font-bold font-display uppercase tracking-wider text-cyan-300 mb-4">{block.title}</h4>}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {block.images.map((img, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-white/15 bg-black/40">
                          <img src={resolveImageUrl(img.url)} alt="Gallery" className="w-full h-40 object-cover" />
                          {img.caption && <p className="p-2 text-[10px] font-mono text-slate-400 bg-black/60 truncate">{img.caption}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (block.type === 'divider') {
                return (
                  <div key={idx} className="my-10 flex items-center justify-center gap-4">
                    <span className="h-px bg-white/20 flex-1" />
                    <span className="w-2.5 h-2.5 rotate-45 border border-cyan-400 bg-cyan-950/80" />
                    <span className="h-px bg-white/20 flex-1" />
                  </div>
                );
              }

              return null;
            })}
          </main>
        </div>

        <Footer />
      </div>
    );
  };

  // -------------------------------------------------------------
  // MAIN BUILDER SHELL RENDER
  // -------------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0b1415] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
        <span className="text-xs font-mono font-bold tracking-widest text-cyan-200/80 uppercase">
          Loading Story Monograph Studio...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1415] text-white flex flex-col font-sans-ui selection:bg-cyan-500 selection:text-black">
      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={imagePickerOpen}
        onClose={() => {
          setImagePickerOpen(false);
          setImagePickerTarget(null);
        }}
        onSelect={handleImageSelected}
        currentValue={
          imagePickerTarget?.field === 'cover'
            ? monograph.cover_image
            : imagePickerTarget?.blockId
            ? (monograph.blocks.find(b => b.id === imagePickerTarget.blockId) as any)?.[imagePickerTarget.field]
            : ''
        }
      />

      {/* ----------------- TOP CONTROLS BAR ----------------- */}
      <header className="sticky top-0 z-40 bg-[#0f1c1d]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            to="/admin/blog"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-2 text-xs font-mono font-semibold shrink-0"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Articles Desk</span>
          </Link>

          <div className="h-5 w-px bg-white/15 hidden sm:block" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase text-cyan-300">
                Visual Blog Studio
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                monograph.is_published ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
              }`}>
                {monograph.is_published ? 'Live Monograph' : 'Draft'}
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md mt-0.5">
              {monograph.title || 'Untitled Architectural Story'}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/10 text-xs font-mono font-bold">
            <button
              onClick={() => setPreviewMode(false)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                !previewMode
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 size={13} />
              <span className="hidden md:inline">Studio Editor</span>
            </button>
            <button
              onClick={() => setPreviewMode(true)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                previewMode
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye size={13} />
              <span className="hidden md:inline">Live Preview</span>
            </button>
          </div>

          {monograph.id && (
            <Link
              to={`/blog/${monograph.id}`}
              target="_blank"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono font-semibold flex items-center gap-1.5"
              title="Open Live Public Article"
            >
              <ExternalLink size={13} />
              <span className="hidden lg:inline">Public Page</span>
            </Link>
          )}

          <button
            onClick={() => handleSaveMonograph(false)}
            disabled={saving}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs font-mono font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer hidden sm:flex items-center gap-1.5"
          >
            <span>Draft</span>
          </button>

          <button
            onClick={() => handleSaveMonograph(true)}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save size={14} />
            <span>{saving ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </header>

      {/* ----------------- PREVIEW OR BUILDER VIEWPORT ----------------- */}
      {previewMode ? (
        renderLivePreview()
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ----------------- MAIN CANVAS (LEFT / CENTER) ----------------- */}
          <main className="lg:col-span-8 space-y-6">
            {/* 1. Hero Cover & Primary Monograph Header */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#132527]/90 border border-white/15 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300 flex items-center gap-2">
                  <BookOpen size={14} />
                  <span>Monograph Hero Cover & Title</span>
                </span>

                <button
                  onClick={() => openImagePicker('cover')}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ImageIcon size={13} />
                  <span>Choose Cover</span>
                </button>
              </div>

              {/* Cover Image Preview */}
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-white/15 bg-black/50 group">
                <img src={resolveImageUrl(monograph.cover_image)} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button
                    onClick={() => openImagePicker('cover')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase font-mono shadow-lg cursor-pointer"
                  >
                    Change Cover Image
                  </button>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                    Monograph Display Title
                  </label>
                  <input
                    type="text"
                    value={monograph.title}
                    onChange={e => setMonograph(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. THE DIALOGUE BETWEEN VOID AND FORM..."
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-lg sm:text-xl font-display font-bold uppercase text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                    Lead Subtitle & Hero Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={monograph.subtitle}
                    onChange={e => setMonograph(prev => ({ ...prev, subtitle: e.target.value, description: e.target.value }))}
                    placeholder="Brief architectural abstract describing the essence of the story..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Structured Block List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Layers size={14} className="text-cyan-400" />
                  <span>Story Content Blocks ({monograph.blocks.length})</span>
                </h3>
              </div>

              <div className="space-y-4">
                {monograph.blocks.map((block, index) => renderBlockEditor(block, index))}
              </div>
            </div>

            {/* 3. Add Block Toolbar Palette */}
            <div className="p-6 rounded-3xl bg-[#132527]/80 border border-white/15 shadow-xl space-y-4">
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300 flex items-center gap-2">
                <Plus size={14} />
                <span>Add Story Block to Monograph</span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {[
                  { type: 'heading' as const, label: 'Section Heading', icon: Type, color: 'text-cyan-300' },
                  { type: 'paragraph' as const, label: 'Body Paragraph', icon: FileText, color: 'text-slate-300' },
                  { type: 'lead' as const, label: 'Lead Standfirst', icon: Sparkles, color: 'text-cyan-300' },
                  { type: 'quote' as const, label: 'Pull Quote', icon: Quote, color: 'text-amber-300' },
                  { type: 'two_images' as const, label: '2-Col Images', icon: Columns, color: 'text-indigo-300' },
                  { type: 'three_images' as const, label: '3-Col Photo Triad', icon: Grid, color: 'text-indigo-300' },
                  { type: 'image_single' as const, label: 'Single Feature Photo', icon: ImageIcon, color: 'text-indigo-300' },
                  { type: 'image_text' as const, label: 'Image + Text Split', icon: Split, color: 'text-emerald-300' },
                  { type: 'callout' as const, label: 'Key Takeaways Card', icon: Sparkles, color: 'text-cyan-300' },
                  { type: 'list' as const, label: 'Bullet / Number List', icon: List, color: 'text-teal-300' },
                  { type: 'gallery' as const, label: 'Multi-Image Gallery', icon: Layers, color: 'text-cyan-300' },
                  { type: 'divider' as const, label: 'Monogram Divider', icon: MinusIcon, color: 'text-slate-400' }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      onClick={() => handleAddBlock(item.type)}
                      className="p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-cyan-500/40 flex flex-col items-center text-center gap-1.5 transition-all group cursor-pointer"
                    >
                      <Icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-[11px] font-mono font-bold text-slate-200 group-hover:text-white">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </main>

          {/* ----------------- SIDEBAR SETTINGS (RIGHT) ----------------- */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Meta & Taxonomy Settings */}
            <div className="sticky top-20 p-6 rounded-3xl bg-[#132527]/90 border border-white/15 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
                  Monograph Settings
                </span>
                <span className="text-[10px] font-mono text-slate-400">ROHA v2.4</span>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                  Category
                </label>
                <select
                  value={monograph.category}
                  onChange={e => {
                    const selectedCatName = e.target.value;
                    const match = categories.find(c => c.name === selectedCatName);
                    setMonograph(prev => ({
                      ...prev,
                      category: selectedCatName,
                      category_id: match ? match.id : undefined
                    }));
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Architecture">Architecture</option>
                  <option value="Interior">Interior</option>
                  <option value="Model Making">Model Making</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Materiality">Materiality</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                    Story Type
                  </label>
                  <select
                    value={monograph.type}
                    onChange={e => setMonograph(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Monograph">Monograph</option>
                    <option value="Case Study">Case Study</option>
                    <option value="Editorial">Editorial</option>
                    <option value="Essay">Essay</option>
                    <option value="Research">Research</option>
                    <option value="Dialogue">Dialogue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                    Year
                  </label>
                  <input
                    type="text"
                    value={monograph.year}
                    onChange={e => setMonograph(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2026"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Author & Reading Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                    Author
                  </label>
                  <input
                    type="text"
                    value={monograph.author}
                    onChange={e => setMonograph(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="ROHA Studio"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={monograph.readTime}
                    onChange={e => setMonograph(prev => ({ ...prev, readTime: e.target.value }))}
                    placeholder="5 min read"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={monograph.slug}
                  onChange={e => setMonograph(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="dialogue-between-void-and-form"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-cyan-300 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Quick Preset Blueprints */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Story Blueprints:</span>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => {
                      setMonograph(prev => ({
                        ...prev,
                        blocks: [
                          { id: 'b-1', type: 'lead', text: 'An architectural investigation of materiality and light.' },
                          { id: 'b-2', type: 'heading', level: 'h2', text: 'Spatial Geometry & Flow', badge: 'Study' },
                          { id: 'b-3', type: 'two_images', image1: '/tr/279A1756.JPG', caption1: 'Main volume', image2: '/pexels-chudin-alexey-26964541.jpg', caption2: 'Detail volume' },
                          { id: 'b-4', type: 'quote', text: 'The poetry of space is found in the stillness of raw materials.', author: 'ROHA Design Principal' },
                          { id: 'b-5', type: 'callout', title: 'Spatial Conclusions', items: ['Basalt foundation', 'Zenith light flow'] }
                        ]
                      }));
                      addToast('success', 'Blueprint Applied', 'Loaded Architectural Case Study template.');
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-left text-xs font-mono text-cyan-300 border border-white/10 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Architectural Case Study</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

function MinusIcon({ className }: { className?: string }) {
  return <span className={`inline-block w-3.5 h-0.5 bg-current ${className}`} />;
}

export default BlogBuilder;
