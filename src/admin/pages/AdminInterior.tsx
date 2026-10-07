import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  LayoutGrid,
  List as ListIcon,
  Tag,
  Building2,
  MapPin,
  Calendar,
  Check
} from 'lucide-react';
import {
  api,
  resolveImageUrl,
  type InteriorProjectItem,
  type CategoryItem,
  type InteriorProjectDetailItem
} from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { ToastContainer, type ToastMessage } from '../components/Toast';
import { MediaGalleryManager } from '../components/MediaGalleryManager';

export const AdminInterior: React.FC = () => {
  const [projects, setProjects] = useState<InteriorProjectItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal & Editing State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'specs'>('details');
  const [editingProject, setEditingProject] = useState<Partial<InteriorProjectDetailItem> | null>(null);
  const [saving, setSaving] = useState(false);

  // Category Manager Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState<number | null>(null);

  // Delete Project Modal
  const [deleteTarget, setDeleteTarget] = useState<InteriorProjectItem | null>(null);
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
      const [projs, cats] = await Promise.all([
        api.getInteriorProjects(),
        api.getInteriorCategories().catch(() => []),
      ]);
      setProjects(projs);
      setCategories(cats);
    } catch (err: any) {
      addToast('error', 'Failed to load architectural projects', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      addToast('error', 'Category Name Required', 'Please enter a name for the category.');
      return;
    }
    try {
      setCreatingCat(true);
      const created = await api.createInteriorCategory(newCatName.trim(), newCatDesc.trim());
      addToast('success', 'Category Created', `"${created.name}" added successfully.`);
      const updatedCats = await api.getInteriorCategories();
      setCategories(updatedCats);
      setNewCatName('');
      setNewCatDesc('');
    } catch (err: any) {
      addToast('error', 'Category Creation Failed', err.message);
    } finally {
      setCreatingCat(false);
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    try {
      setDeletingCatId(id);
      await api.deleteInteriorCategory(id);
      addToast('success', 'Category Removed', `"${name}" removed from directory.`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      addToast('error', 'Failed to delete category', err.message);
    } finally {
      setDeletingCatId(null);
    }
  };

  const handleOpenCreate = () => {
    setEditingProject({
      title: '',
      subtitle: '',
      description: '',
      category: categories[0]?.id || 1,
      cover_image: '',
      gallery_images: [],
      location: 'Addis Ababa',
      year: '2026',
      order: (projects.length || 0) + 1,
      is_featured: false,
      specifications: {
        area: '450 m²',
        style: 'Modern Architectural',
        material_palette: 'Basalt, Limewash, Smoked Oak',
        lighting_design: 'Diffused Zenith Natural Flow',
        architect: 'ROHA Architectural Studio',
        client: 'Private Residence',
      }
    });
    setActiveTab('details');
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (proj: InteriorProjectItem) => {
    try {
      setSaving(true);
      const full = await api.getInteriorProject(proj.id);
      setEditingProject({
        ...full,
        gallery_images: full.gallery_images || [],
        specifications: full.specifications || {
          area: '450 m²',
          style: 'Modern Architectural',
          material_palette: 'Basalt, Limewash, Smoked Oak',
          lighting_design: 'Diffused Zenith Natural Flow',
          architect: 'ROHA Architectural Studio',
          client: 'Private Residence',
        }
      });
      setActiveTab('details');
      setIsModalOpen(true);
    } catch (err: any) {
      addToast('error', 'Failed to fetch project details', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.title?.trim()) {
      addToast('error', 'Validation Error', 'Project title is mandatory.');
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<InteriorProjectDetailItem> = {
        ...editingProject,
        category: editingProject.category ? Number(editingProject.category) : undefined,
      };

      if (editingProject.id) {
        await api.updateInteriorProject(editingProject.id, payload);
        addToast('success', 'Project Updated', `"${editingProject.title}" synchronized with database.`);
      } else {
        await api.createInteriorProject(payload);
        addToast('success', 'Project Created', `"${editingProject.title}" published to architectural catalogue.`);
      }

      setIsModalOpen(false);
      setEditingProject(null);
      await loadData();
    } catch (err: any) {
      addToast('error', 'Save Failed', err.message || 'An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.deleteInteriorProject(deleteTarget.id);
      addToast('success', 'Project Removed', `"${deleteTarget.title}" deleted.`);
      setProjects(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Filter & Search Logic
  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const matchesSearch =
        search === '' ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(search.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()));

      const matchesCat =
        selectedCat === 'All' || item.category_name === selectedCat;

      return matchesSearch && matchesCat;
    });
  }, [projects, search, selectedCat]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <ToastContainer toasts={toasts} onClose={(id) => setToasts(t => t.filter(x => x.id !== id))} />

      {/* -------------------- HERO SECTION -------------------- */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-white/10 pb-6">
        <div>
          <p className="eyebrow text-cyan-400">Portfolio & Case Studies</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white mt-1">
            Interior Architecture & Built Work
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Manage your spatial catalogue, high-resolution photography archives, floor plans, and technical architectural specifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsCatModalOpen(true)}
            className="secondary-button text-xs"
          >
            <Tag size={14} />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="primary-button text-xs shadow-sm"
          >
            <Plus size={15} />
            <span>New project</span>
          </button>
        </div>
      </section>

      {/* -------------------- SEARCH & FILTER TOOLBAR -------------------- */}
      <section className="panel p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Trigger Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, location, or description..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Chips & View Toggles */}
          <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
              {['All', ...categories.map(c => c.name)].map((cat) => (
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

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-black/40 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-cyan-900/70 text-cyan-200 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-cyan-900/70 text-cyan-200 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="List table view"
              >
                <ListIcon size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- PROJECTS DISPLAY (GRID / LIST) -------------------- */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
          <Loader2 size={24} className="animate-spin text-cyan-400" />
          <span className="font-mono uppercase tracking-wider">Loading project library...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="panel p-16 text-center text-sm text-slate-400">
          No matching architectural projects found. Try adjusting your search query or category filter.
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="panel overflow-hidden group hover:shadow-xl hover:border-cyan-400/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Cover Image with Aspect Ratio */}
                <div
                  className="aspect-[16/10] w-full bg-black/50 bg-cover bg-center relative overflow-hidden"
                  style={{
                    backgroundImage: `url(${resolveImageUrl(project.cover_image)})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-950/90 text-cyan-300 font-semibold backdrop-blur-xs border border-cyan-500/30 shadow-xs">
                      {project.category_name || 'Interior'}
                    </span>
                    {project.is_featured && (
                      <span className="status-pill featured shadow-xs">
                        Featured
                      </span>
                    )}
                  </div>

                  <a
                    href={`/project-detail?id=${project.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-button absolute top-3 right-3 bg-black/60 text-white hover:bg-cyan-600 shadow-xs border-white/20"
                    title="View public project page"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-cyan-400" />
                      <span>{project.location || 'Addis Ababa'}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-cyan-400" />
                      <span>{project.year || '2026'}</span>
                    </span>
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-2.5 leading-relaxed">
                    {project.description || 'No detailed narrative provided yet.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-black/30 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  ID: #{project.id}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="secondary-button text-xs py-1.5 px-3"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(project)}
                    className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                    title="Delete project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* LIST TABLE VIEW */
        <div className="panel overflow-hidden divide-y divide-white/10">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-20 h-14 rounded-lg bg-black/50 bg-cover bg-center shrink-0 border border-white/10"
                  style={{
                    backgroundImage: `url(${resolveImageUrl(project.cover_image)})`,
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-white truncate">
                      {project.title}
                    </h3>
                    <span className="status-pill published">
                      Published
                    </span>
                    {project.is_featured && (
                      <span className="status-pill featured">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {project.category_name} · {project.location} · {project.year}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <a
                  href={`/project-detail?id=${project.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-button"
                  title="View live"
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  onClick={() => handleOpenEdit(project)}
                  className="secondary-button text-xs"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteTarget(project)}
                  className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                  title="Delete project"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -------------------- CREATE / EDIT PROJECT MODAL -------------------- */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => !saving && setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#132527] border border-white/15 rounded-2xl shadow-2xl flex flex-col z-10 text-white overflow-hidden backdrop-blur-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0f1c1d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-xs">
                  <Building2 size={18} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">
                    {editingProject.id ? `Edit: ${editingProject.title}` : 'Add Architectural Project'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configure project meta, architectural specifications, and high-res photography
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
                className="icon-button"
                aria-label="Close dialog"
              >
                <X size={17} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-black/30">
              {[
                { id: 'details', label: '1. Basic Details' },
                { id: 'media', label: '2. Media & Gallery Archive' },
                { id: 'specs', label: '3. Architectural Specs' },
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

            {/* Modal Form Content */}
            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: BASIC DETAILS */}
              {activeTab === 'details' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        placeholder="e.g. Casa Nera / The Monolith Pavilion"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Category
                      </label>
                      <select
                        value={editingProject.category || categories[0]?.id || 1}
                        onChange={(e) => setEditingProject({ ...editingProject, category: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id} className="bg-[#132527] text-white">
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editingProject.location || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                        placeholder="e.g. Addis Ababa, Ethiopia"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Completion Year
                      </label>
                      <input
                        type="text"
                        value={editingProject.year || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                        placeholder="e.g. 2026"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={editingProject.order || 1}
                        onChange={(e) => setEditingProject({ ...editingProject, order: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Subtitle / Brief Manifesto
                    </label>
                    <input
                      type="text"
                      value={editingProject.subtitle || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                      placeholder="e.g. A monolithic study in raw basalt, limewash, and natural zenith lighting"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Full Architectural Narrative / Description
                    </label>
                    <textarea
                      rows={5}
                      value={editingProject.description || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      placeholder="Detail the spatial hierarchy, environmental consideration, material choices, and structural logic..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={editingProject.is_featured || false}
                      onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                      className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                    />
                    <label htmlFor="is_featured" className="text-xs font-semibold text-slate-200 cursor-pointer">
                      Feature on Studio Homepage & Priority Showcase Grids
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA & GALLERY */}
              {activeTab === 'media' && (
                <div className="animate-in fade-in">
                  <MediaGalleryManager
                    mainImage={editingProject.cover_image || null}
                    onMainImageChange={(url) => setEditingProject({ ...editingProject, cover_image: url || '' })}
                    galleryImages={editingProject.gallery_images || []}
                    onGalleryImagesChange={(images) => setEditingProject({ ...editingProject, gallery_images: images })}
                    contentTypeLabel="Architectural Project"
                  />
                </div>
              )}

              {/* TAB 3: ARCHITECTURAL SPECIFICATIONS */}
              {activeTab === 'specs' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/30 text-xs text-cyan-200">
                    These technical parameters render in the architectural specification sheet on the public case study detail view.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Total Floor Area
                      </label>
                      <input
                        type="text"
                        value={editingProject.specifications?.area || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            specifications: { ...editingProject.specifications!, area: e.target.value },
                          })
                        }
                        placeholder="e.g. 450 m²"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Architectural Style
                      </label>
                      <input
                        type="text"
                        value={editingProject.specifications?.style || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            specifications: { ...editingProject.specifications!, style: e.target.value },
                          })
                        }
                        placeholder="e.g. Brutalist Vernacular / Warm Minimalist"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Material Palette
                      </label>
                      <input
                        type="text"
                        value={editingProject.specifications?.material_palette || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            specifications: { ...editingProject.specifications!, material_palette: e.target.value },
                          })
                        }
                        placeholder="e.g. Basalt, Travertine, Smoked Oak, Lime Plaster"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Lighting Scheme
                      </label>
                      <input
                        type="text"
                        value={editingProject.specifications?.lighting_design || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            specifications: { ...editingProject.specifications!, lighting_design: e.target.value },
                          })
                        }
                        placeholder="e.g. Diffused Zenith Skylights, 2700K Linear"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Lead Architect / Partner
                      </label>
                      <input
                        type="text"
                        value={editingProject.specifications?.architect || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            specifications: { ...editingProject.specifications!, architect: e.target.value },
                          })
                        }
                        placeholder="e.g. ROHA Architectural Studio"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Client / Commission Type
                      </label>
                      <input
                        type="text"
                        value={editingProject.specifications?.client || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            specifications: { ...editingProject.specifications!, client: e.target.value },
                          })
                        }
                        placeholder="e.g. Private Residence"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
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
                      <span>Saving project...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{editingProject.id ? 'Update Project' : 'Publish Project'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- CATEGORY MANAGEMENT MODAL -------------------- */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setIsCatModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#132527] border border-white/15 rounded-2xl p-6 shadow-2xl z-10 text-white backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display text-xl font-semibold text-white">
                  Architectural Categories
                </h3>
                <p className="text-xs text-slate-400">
                  Organize projects by typology (Residential, Commercial, Hospitality, etc.)
                </p>
              </div>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="icon-button"
              >
                <X size={16} />
              </button>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleCreateCategory} className="mt-5 p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Add New Category
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category name (e.g. Boutique Hospitality)"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Brief description (optional)"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                disabled={creatingCat}
                className="primary-button text-xs w-full justify-center"
              >
                {creatingCat ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                <span>Create Category</span>
              </button>
            </form>

            {/* Categories List */}
            <div className="mt-5 space-y-2 max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10"
                >
                  <div>
                    <p className="text-xs font-semibold text-white">{cat.name}</p>
                    {cat.description && (
                      <p className="text-[11px] text-slate-400">{cat.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    disabled={deletingCatId === cat.id}
                    className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                    title="Delete category"
                  >
                    {deletingCatId === cat.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-right">
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="secondary-button text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Architectural Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All associated specs, gallery images, and catalog references will be permanently removed.`}
        confirmLabel="Delete Project"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
