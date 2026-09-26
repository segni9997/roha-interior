import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Clock,
  User,
  X,
  Loader2,
  AlignLeft,
  Heading,
  ArrowUpRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  api,
  resolveImageUrl,
  type BlogPostItem,
  type CategoryItem,
  type GalleryImageItem,
} from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { Toast, type ToastType } from '../components/Toast';
import { ImagePickerModal } from '../components/ImagePickerModal';
import { MediaGalleryManager } from '../components/MediaGalleryManager';

interface ContentBlock {
  type: 'heading' | 'paragraph' | 'list';
  text?: string;
  items?: string[];
}

export const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formType, setFormType] = useState('Article');
  const [formAuthor, setFormAuthor] = useState('ROHA Editorial Team');
  const [formReadTime, setFormReadTime] = useState('5 min read');
  const [formYear, setFormYear] = useState('2026');
  const [formImage, setFormImage] = useState('/tr/279A1756.JPG');
  const [formGalleryImages, setFormGalleryImages] = useState<GalleryImageItem[]>([]);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formBlocks, setFormBlocks] = useState<ContentBlock[]>([
    { type: 'heading', text: 'Architectural Philosophy & Spatial Flow' },
    { type: 'paragraph', text: 'The interplay between solid mass and void defines contemporary spatial language.' }
  ]);
  const [saving, setSaving] = useState(false);


  // Live Preview Mode State
  const [previewLayout, setPreviewLayout] = useState<'split' | 'form' | 'preview'>('split');
  const [previewTab, setPreviewTab] = useState<'card' | 'reader'>('card');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Asset Picker
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

  // Confirm Delete
  const [deleteTarget, setDeleteTarget] = useState<BlogPostItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, catsData] = await Promise.allSettled([
        api.getBlogPosts(),
        api.getBlogCategories(),
      ]);

      if (postsData.status === 'fulfilled') setPosts(postsData.value);
      if (catsData.status === 'fulfilled') setCategories(catsData.value);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to load journal posts', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormSlug('');
    setFormDescription('');
    setFormCategory(categories[0]?.name || 'Architecture');
    setFormType('Article');
    setFormAuthor('ROHA Editorial Team');
    setFormReadTime('5 min read');
    setFormYear('2026');
    setFormImage('/tr/279A1756.JPG');
    setFormGalleryImages([]);
    setFormIsPublished(true);
    setFormBlocks([
      { type: 'heading', text: 'Executive Spatial Narrative' },
      { type: 'paragraph', text: 'An exploratory study in materials, natural illumination, and volumetric proportion.' }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: BlogPostItem) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormDescription(post.description || '');
    setFormCategory(post.category || categories[0]?.name || 'Architecture');
    setFormType(post.type || 'Article');
    setFormAuthor(post.author || 'ROHA Studio');
    setFormReadTime(post.readTime || '5 min read');
    setFormYear(post.year || '2026');
    setFormImage(post.cover_image || post.image || '');
    setFormGalleryImages(post.gallery_images || []);
    setFormIsPublished(post.is_published !== false);

    // Parse content blocks
    if (Array.isArray(post.content) && post.content.length > 0) {
      setFormBlocks(post.content);
    } else {
      setFormBlocks([
        { type: 'heading', text: 'Architectural Philosophy & Overview' },
        { type: 'paragraph', text: post.description || 'Spatial narrative and design methodology.' }
      ]);
    }

    setIsModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setToast({ message: 'Title is required', type: 'error' });
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<BlogPostItem> = {
        title: formTitle.trim(),
        slug: formSlug.trim() || formTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: formDescription.trim(),
        category: formCategory,
        type: formType,
        author: formAuthor.trim(),
        readTime: formReadTime.trim(),
        year: formYear.trim(),
        image: formImage.trim() || null,
        cover_image: formImage.trim() || null,
        is_published: formIsPublished,
        content: formBlocks,
      };

      if (editingPost) {
        const updated = await api.updateBlogPost(editingPost.id, payload);
        // Retain gallery images
        updated.gallery_images = formGalleryImages;
        setPosts(prev => prev.map(p => (p.id === updated.id ? { ...p, ...updated } : p)));
        setToast({ message: `Monograph "${updated.title}" updated`, type: 'success' });
      } else {
        const created = await api.createBlogPost(payload);
        // Persist newly added gallery images for this post
        if (formGalleryImages.length > 0) {
          const savedGallery: GalleryImageItem[] = [];
          for (const g of formGalleryImages) {
            try {
              const res = await api.addBlogGalleryImage(created.id, {
                image: g.image,
                caption: g.caption,
                subtitle: g.subtitle,
                order: g.order || 0,
              });
              savedGallery.push(res);
            } catch {
              savedGallery.push(g);
            }
          }
          created.gallery_images = savedGallery;
        }
        setPosts(prev => [created, ...prev]);
        setToast({ message: `Monograph "${created.title}" published`, type: 'success' });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save article', type: 'error' });
    } finally {
      setSaving(false);
    }
  };


  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.deleteBlogPost(deleteTarget.id);
      setPosts(prev => prev.filter(p => p.id !== deleteTarget.id));
      setToast({ message: `Monograph "${deleteTarget.title}" deleted`, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete monograph', type: 'error' });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Block builder handlers
  const addBlock = (type: 'heading' | 'paragraph' | 'list') => {
    if (type === 'list') {
      setFormBlocks(prev => [...prev, { type: 'list', items: ['Material continuity', 'Passive solar orientation'] }]);
    } else if (type === 'heading') {
      setFormBlocks(prev => [...prev, { type: 'heading', text: 'New Architectural Section' }]);
    } else {
      setFormBlocks(prev => [...prev, { type: 'paragraph', text: 'Spatial observations and material fabrication...' }]);
    }
  };

  const updateBlockText = (index: number, text: string) => {
    setFormBlocks(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], text };
      return copy;
    });
  };

  const removeBlock = (index: number) => {
    setFormBlocks(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddServerGalleryImage = async (data: Partial<GalleryImageItem>): Promise<GalleryImageItem> => {
    if (!editingPost) throw new Error('Post not saved yet');
    const res = await api.addBlogGalleryImage(editingPost.id, {
      image: data.image || '',
      caption: data.caption,
      subtitle: data.subtitle,
      order: data.order || 0,
    });
    return res;
  };

  const handleDeleteServerGalleryImage = async (id: number | string) => {
    await api.deleteBlogGalleryImage(Number(id));
  };

  const filteredPosts = posts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory || p.type === activeCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">Journal & Monographs</h1>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#172e31] text-cyan-300 border border-[#205b63]">
              {posts.length} PUBLICATIONS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            ARCHITECTURAL DISCOURSE // CRITICAL ESSAYS // BUILT CASE STUDIES
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider border border-slate-700/80 transition-all"
          >
            <span>Public Journal</span>
            <ExternalLink size={13} className="text-slate-400" />
          </a>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#172e31] to-[#205b63] hover:from-[#1b373b] hover:to-[#266e77] text-white text-xs font-bold uppercase tracking-wider border border-[#2d7882] shadow-lg shadow-teal-950/40 cursor-pointer transition-all"
          >
            <Plus size={15} />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Article', 'Journal', 'Blog', 'Case Study', 'Press Release', 'Technical Paper', 'Interior', 'Architecture', 'Model'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#172e31] text-cyan-300 border border-[#205b63] shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search publications..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0e1719] border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:border-[#205b63] focus:outline-none"
          />
        </div>
      </div>

      {/* Posts Table / Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-500 gap-3">
          <Loader2 size={32} className="animate-spin text-cyan-400" />
          <p className="text-xs font-mono uppercase tracking-widest">Compiling Journal Archive...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-20 rounded-3xl border border-dashed border-slate-800 text-center bg-[#0e1719]/40">
          <BookOpen size={40} className="mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-bold text-slate-300">No Journal Monographs Found</p>
          <p className="text-xs text-slate-500 font-mono mt-1">Publish your first architectural case study</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0c1315] border border-slate-800/80 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#080d0e] border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Publication</th>
                  <th className="px-6 py-4">Classification</th>
                  <th className="px-6 py-4">Author & Year</th>
                  <th className="px-6 py-4">Read Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Publication Cover & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-11 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                          <img
                            src={resolveImageUrl(post.image, '/tr/279A1756.JPG')}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-sm">
                          <p className="font-bold text-white text-xs tracking-tight line-clamp-1">{post.title}</p>
                          <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{post.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Classification */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#172e31] text-cyan-300 w-fit">
                          {post.category || 'Architecture'}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase">{post.type || 'Article'}</span>
                      </div>
                    </td>

                    {/* Author & Year */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <User size={12} className="text-slate-500" />
                        <span className="font-mono text-xs">{post.author || 'ROHA Studio'}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{post.year || '2026'}</span>
                    </td>

                    {/* Read Time */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs">
                        <Clock size={12} className="text-slate-500" />
                        <span>{post.readTime || '5 min read'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>PUBLISHED</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/blog/${post.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Public Article"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          onClick={() => handleOpenEditModal(post)}
                          title="Edit Article"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(post)}
                          title="Delete Article"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- ARTICLE EDITOR MODAL WITH LIVE MONOGRAPH PREVIEW -------------------- */}
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
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>{editingPost ? 'Edit Monograph' : 'Publish Architectural Monograph'}</span>
                      <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                        Live Preview Active
                      </span>
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">Structured content composition and real-time publication reader preview</p>
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
                    <form id="blog-form" onSubmit={handleSavePost} className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                          Article Title <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="e.g. Sculpting Light: The Brutalist Revival in Contemporary Residential Design"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Slug</label>
                          <input
                            type="text"
                            value={formSlug}
                            onChange={(e) => setFormSlug(e.target.value)}
                            placeholder="e.g. sculpting-light-brutalist-revival"
                            className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Classification Type</label>
                          <select
                            value={formType}
                            onChange={(e) => setFormType(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
                          >
                            <option value="Article">Article</option>
                            <option value="Journal">Journal</option>
                            <option value="Blog">Blog</option>
                            <option value="Case Study">Case Study</option>
                            <option value="Press Release">Press Release</option>
                            <option value="Technical Paper">Technical Paper</option>
                            <option value="Guide">Guide</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Author</label>
                          <input
                            type="text"
                            value={formAuthor}
                            onChange={(e) => setFormAuthor(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Read Time</label>
                          <input
                            type="text"
                            value={formReadTime}
                            onChange={(e) => setFormReadTime(e.target.value)}
                            placeholder="e.g. 6 min read"
                            className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Year</label>
                          <input
                            type="text"
                            value={formYear}
                            onChange={(e) => setFormYear(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Main & Gallery Images */}
                      <MediaGalleryManager
                        mainImage={formImage}
                        onMainImageChange={(url) => setFormImage(url || '')}
                        galleryImages={formGalleryImages}
                        onGalleryImagesChange={setFormGalleryImages}
                        contentTypeLabel="Journal / Article / Blog"
                        onAddServerImage={editingPost ? handleAddServerGalleryImage : undefined}
                        onDeleteServerImage={editingPost ? handleDeleteServerGalleryImage : undefined}
                      />

                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Excerpt / Summary</label>
                        <textarea
                          rows={2}
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="Short architectural abstract for previews and social embeds..."
                          className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
                        />
                      </div>

                      {/* Structured Block Builder */}
                      <div className="pt-3 border-t border-slate-800">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono text-slate-300 uppercase">Monograph Content Blocks</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => addBlock('heading')}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 text-[11px] font-mono border border-slate-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Heading size={12} />
                              <span>+ Heading</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => addBlock('paragraph')}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 text-[11px] font-mono border border-slate-800 flex items-center gap-1 cursor-pointer"
                            >
                              <AlignLeft size={12} />
                              <span>+ Paragraph</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {formBlocks.map((block, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-2xl bg-[#080d0e] border border-slate-800 relative group"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-slate-400 uppercase">
                                  Block {idx + 1} // {block.type}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeBlock(idx)}
                                  className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>

                              {block.type === 'heading' ? (
                                <input
                                  type="text"
                                  value={block.text || ''}
                                  onChange={(e) => updateBlockText(idx, e.target.value)}
                                  placeholder="Section Heading..."
                                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-slate-800 text-xs font-bold text-white focus:border-[#205b63] focus:outline-none"
                                />
                              ) : (
                                <textarea
                                  rows={3}
                                  value={block.text || ''}
                                  onChange={(e) => updateBlockText(idx, e.target.value)}
                                  placeholder="Architectural analysis, fabrication methods, lighting design narrative..."
                                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-slate-800 text-xs text-slate-200 focus:border-[#205b63] focus:outline-none"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* RIGHT PANE: Authentic Live Monograph Public Preview */}
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
                            roha.studio/blog/preview
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center p-0.5 bg-[#142023] rounded-lg border border-slate-800 text-[10px] font-mono">
                            <button
                              type="button"
                              onClick={() => setPreviewTab('card')}
                              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                previewTab === 'card' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Card View
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewTab('reader')}
                              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                previewTab === 'reader' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Article Reader
                            </button>
                          </div>

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

                      {/* PREVIEW CONTAINER */}
                      <div className={`mx-auto transition-all duration-300 ${
                        previewDevice === 'mobile' ? 'max-w-[340px]' : 'w-full'
                      }`}>
                        {previewTab === 'card' ? (
                          /* Authentic BlogCard as on /blog */
                          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 shadow-2xl">
                            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                              <span>● Live /blog Journal Card</span>
                              <span>Interactive Hover</span>
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 h-[380px] shadow-2xl cursor-pointer">
                              <img
                                src={resolveImageUrl(formImage, '/tr/279A1756.JPG')}
                                alt={formTitle}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                              {/* Floating Category/Year */}
                              <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-[10px] font-mono uppercase text-white rounded-full">
                                  {formCategory || 'Architecture'}
                                </span>
                              </div>

                              {/* Glass Content Card */}
                              <div className="absolute inset-x-3 bottom-3">
                                <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl transition-all duration-500 group-hover:bg-white/20">
                                  <div className="mb-2 flex items-start justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[#7db3b8]">
                                      {formAuthor} • {formReadTime}
                                    </span>
                                    <ArrowUpRight className="h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                                  </div>
                                  <h3 className="text-lg font-bold leading-tight text-white mb-2 line-clamp-2">
                                    {formTitle || 'Untitled Architectural Monograph'}
                                  </h3>
                                  <p className="line-clamp-2 text-xs leading-relaxed text-white/70">
                                    {formDescription || 'Detailed spatial discourse exploring modern architectural typology and tectonic expression.'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Full Monograph Article Reader Preview */
                          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1618] p-6 shadow-2xl space-y-5 text-white">
                            <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest flex items-center justify-between border-b border-white/10 pb-2">
                              <span>● Live Monograph Article Reader</span>
                              <span>{formType} • {formReadTime}</span>
                            </div>

                            <div className="space-y-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#172e31] text-cyan-300 font-mono text-[10px] uppercase border border-[#205b63]">
                                {formCategory || 'Architecture'}
                              </span>
                              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                                {formTitle || 'Untitled Architectural Monograph'}
                              </h1>
                              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                                <span>By {formAuthor}</span>
                                <span>•</span>
                                <span>{formYear}</span>
                                <span>•</span>
                                <span>{formReadTime}</span>
                              </div>
                            </div>

                            {/* Cover Hero Image */}
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10">
                              <img
                                src={resolveImageUrl(formImage, '/tr/279A1756.JPG')}
                                alt="Feature"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Excerpt Lead */}
                            {formDescription && (
                              <p className="text-xs text-cyan-100/90 font-mono italic leading-relaxed border-l-2 border-[#205b63] pl-3 py-1">
                                {formDescription}
                              </p>
                            )}

                            {/* Render Structured Content Blocks */}
                            <div className="space-y-4 pt-2 border-t border-white/10">
                              {formBlocks.map((block, idx) => (
                                <div key={idx} className="space-y-1.5">
                                  {block.type === 'heading' ? (
                                    <h3 className="text-sm font-bold text-cyan-300 tracking-wide uppercase border-b border-slate-800 pb-1">
                                      {block.text || 'Section Heading'}
                                    </h3>
                                  ) : (
                                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                      {block.text || 'Paragraph text...'}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Live editorial typography reflection</span>
                      <span className="text-cyan-400">ROHA Architectural Journal</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#0f181b] rounded-b-3xl shrink-0">
                <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">
                  Press Publish to update journal articles across the live website
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
                    form="blog-form"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                    <span>{editingPost ? 'Save Monograph' : 'Publish to Journal'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------- IMAGE ASSET PICKER -------------------- */}
      <ImagePickerModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        currentValue={formImage}
        onSelect={(path) => setFormImage(path)}
        title="Select Monograph Cover Photography"
      />

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Monograph?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This publication will be permanently unlinked.`}
        confirmLabel="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
