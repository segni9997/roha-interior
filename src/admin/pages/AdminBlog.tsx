import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  BookOpen,
  Clock,
  Check,
  Sparkles
} from 'lucide-react';
import {
  api,
  resolveImageUrl,
  type BlogPostItem,
  type CategoryItem
} from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { ToastContainer, type ToastMessage } from '../components/Toast';
import { MediaGalleryManager } from '../components/MediaGalleryManager';

export const AdminBlog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'meta'>('content');
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPostItem> | null>(null);
  const [saving, setSaving] = useState(false);

  // Confirm Delete
  const [deleteTarget, setDeleteTarget] = useState<BlogPostItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast Feedback
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
      setLoading(true);
      const [blogList, cats] = await Promise.all([
        api.getBlogPosts(),
        api.getBlogCategories().catch(() => []),
      ]);
      setBlogs(blogList);
      setCategories(cats);
    } catch (err: any) {
      addToast('error', 'Failed to load journal articles', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setActiveTab('content');
    setEditingBlog({
      title: '',
      slug: '',
      description: '',
      category: categories[0]?.name || 'Architecture',
      type: 'Essay',
      year: new Date().getFullYear().toString(),
      author: 'ROHA Editorial Desk',
      readTime: '5 min read',
      image: '/tr/279A1756.JPG',
      is_published: true,
      gallery_images: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (post: BlogPostItem) => {
    setActiveTab('content');
    try {
      const full = await api.getBlogPost(post.id);
      setEditingBlog(full);
      setIsModalOpen(true);
    } catch (err: any) {
      setEditingBlog({ ...post });
      setIsModalOpen(true);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title?.trim()) {
      addToast('error', 'Validation Error', 'Article title is required.');
      return;
    }

    try {
      setSaving(true);
      if (editingBlog.id) {
        await api.updateBlogPost(editingBlog.id, editingBlog);
        addToast('success', 'Article Updated', `"${editingBlog.title}" saved successfully.`);
      } else {
        await api.createBlogPost(editingBlog);
        addToast('success', 'Article Published', `"${editingBlog.title}" published to journal.`);
      }
      setIsModalOpen(false);
      setEditingBlog(null);
      await loadData();
    } catch (err: any) {
      addToast('error', 'Failed to Save Article', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.deleteBlogPost(deleteTarget.id);
      addToast('success', 'Article Removed', `"${deleteTarget.title}" was deleted.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.description?.toLowerCase().includes(search.toLowerCase()) ||
        (typeof b.author === 'string' && b.author.toLowerCase().includes(search.toLowerCase()));

      const catStr = typeof b.category === 'object' ? (b.category as any)?.name : (b.category || '');
      const matchesCat =
        selectedCat === 'All' ||
        catStr.toLowerCase() === selectedCat.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [blogs, search, selectedCat]);

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      <ToastContainer toasts={toasts} onClose={(id) => setToasts(t => t.filter(x => x.id !== id))} />

      {/* -------------------- EDITORIAL HEADER -------------------- */}
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end border-b border-white/10 pb-7">
        <div>
          <p className="eyebrow mb-2 text-cyan-400">
            Editorial desk / {blogs.length < 10 ? `0${blogs.length}` : blogs.length} articles
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.035em] text-white">
            Journal & Articles
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl">
            Shape the architectural philosophy, materiality essays, and studio thought leadership behind the built work.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/allblogs"
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-button"
          >
            <span>Live Journal</span>
            <ExternalLink size={14} />
          </a>

          <Link
            to="/admin/blog-builder"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Visual Blog Studio</span>
          </Link>

          <button
            onClick={handleOpenCreate}
            className="primary-button shadow-sm"
          >
            <Plus size={15} />
            <span>Quick add</span>
          </button>
        </div>
      </section>

      {/* -------------------- SEARCH & FILTER TOOLBAR -------------------- */}
      <section className="panel p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search journal essays, authors, materials..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Architecture', 'Materials', 'Process', 'Editorial'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`filter-chip text-xs ${
                  selectedCat === cat ? 'filter-chip-active' : ''
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- ARTICLES GRID -------------------- */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
          <Loader2 size={24} className="animate-spin text-cyan-400" />
          <span className="font-mono uppercase tracking-wider">Loading journal archive...</span>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="panel p-16 text-center text-sm text-slate-400">
          No journal articles found. Click &quot;New article&quot; to author your first publication.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((post) => {
            const catName = typeof post.category === 'object' ? (post.category as any)?.name : (post.category || 'Architecture');
            const authorText = typeof post.author === 'object' ? (post.author as any)?.name : (post.author || 'ROHA Studio');

            return (
              <article
                key={post.id}
                className="panel overflow-hidden group hover:shadow-xl hover:border-cyan-400/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className="aspect-[16/10] w-full bg-black/50 bg-cover bg-center relative overflow-hidden"
                    style={{
                      backgroundImage: `url(${resolveImageUrl(post.image || post.cover_image)})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-950/90 text-cyan-300 font-semibold border border-cyan-500/30 shadow-xs">
                        {catName}
                      </span>
                    </div>

                    <a
                      href={`/blog/${post.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-button absolute top-3 right-3 bg-black/60 text-white hover:bg-cyan-600 shadow-xs border-white/20"
                      title="Read published post"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <div className="p-5">
                    <p className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Clock size={11} />
                        <span>{post.readTime || '4 min read'}</span>
                      </span>
                      <span>•</span>
                      <span>{authorText}</span>
                    </p>

                    <h3 className="font-display text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors mt-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                      {post.description || 'Architectural essay on space, materiality, and light.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-black/30 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="status-pill published">
                    Published
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/blog-builder?id=${post.id}`}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      title="Open in Visual Blog Studio"
                    >
                      <Sparkles size={13} className="text-cyan-400" />
                      <span>Builder</span>
                    </Link>

                    <button
                      onClick={() => handleOpenEdit(post)}
                      className="secondary-button text-xs py-1.5 px-3"
                    >
                      <Edit3 size={13} />
                      <span>Quick edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(post)}
                      className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                      title="Delete article"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* -------------------- CREATE / EDIT ARTICLE MODAL -------------------- */}
      {isModalOpen && editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => !saving && setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#132527] border border-white/15 rounded-2xl shadow-2xl flex flex-col z-10 text-white overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0f1c1d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-xs">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">
                    {editingBlog.id ? `Edit: ${editingBlog.title}` : 'Draft Journal Article'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Craft thought leadership, material notes, and design philosophy
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

            <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-black/30">
              {[
                { id: 'content', label: '1. Article Narrative' },
                { id: 'media', label: '2. Cover & Photography' },
                { id: 'meta', label: '3. Meta & Author' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-cyan-400 text-cyan-300'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveBlog} className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'content' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBlog.title || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                      placeholder="e.g. Material Notes: The Quiet Luxury of Natural Limewash"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Excerpt / Summary
                    </label>
                    <input
                      type="text"
                      value={editingBlog.description || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, description: e.target.value })}
                      placeholder="A short introductory hook for article cards and RSS feeds"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Main Article Body
                    </label>
                    <textarea
                      rows={10}
                      value={typeof editingBlog.description === 'string' ? editingBlog.description : ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, description: e.target.value })}
                      placeholder="Write your editorial essay or manifesto..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed text-sm"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="animate-in fade-in">
                  <MediaGalleryManager
                    mainImage={editingBlog.image || editingBlog.cover_image || null}
                    onMainImageChange={(url) => setEditingBlog({ ...editingBlog, image: url || '', cover_image: url || '' })}
                    galleryImages={editingBlog.gallery_images || []}
                    onGalleryImagesChange={(images) => setEditingBlog({ ...editingBlog, gallery_images: images })}
                    contentTypeLabel="Journal Article"
                  />
                </div>
              )}

              {activeTab === 'meta' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={typeof editingBlog.author === 'object' ? (editingBlog.author as any)?.name : (editingBlog.author || 'ROHA Editorial Desk')}
                        onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                        placeholder="e.g. Aisha Bekele"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Category
                      </label>
                      <select
                        value={typeof editingBlog.category === 'object' ? (editingBlog.category as any)?.name : (editingBlog.category || 'Architecture')}
                        onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Architecture" className="bg-[#132527] text-white">Architecture</option>
                        <option value="Materials" className="bg-[#132527] text-white">Materials & Finishes</option>
                        <option value="Process" className="bg-[#132527] text-white">Design Process</option>
                        <option value="Editorial" className="bg-[#132527] text-white">Editorial & Thought</option>
                        <option value="Interiors" className="bg-[#132527] text-white">Interiors</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Estimated Read Time
                      </label>
                      <input
                        type="text"
                        value={editingBlog.readTime || '5 min read'}
                        onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                        placeholder="e.g. 5 min read"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Publication Year
                      </label>
                      <input
                        type="text"
                        value={editingBlog.year || '2026'}
                        onChange={(e) => setEditingBlog({ ...editingBlog, year: e.target.value })}
                        placeholder="e.g. 2026"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              )}

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
                      <span>Saving article...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{editingBlog.id ? 'Update Article' : 'Publish Article'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Journal Article"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This essay will be removed from the public journal.`}
        confirmLabel="Delete Article"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
