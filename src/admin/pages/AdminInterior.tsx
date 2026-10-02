import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  Image as ImageIcon,
  Film,
  Maximize2,
  Minimize2,
  Sliders,
  FileText,
  Eye,
  Check
} from 'lucide-react';
import { api, resolveImageUrl, type InteriorProjectItem, type CategoryItem, type InteriorProjectDetailItem } from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { ToastContainer, type ToastMessage } from '../components/Toast';
import { ImagePickerModal } from '../components/ImagePickerModal';
import { MediaGalleryManager } from '../components/MediaGalleryManager';


export const AdminInterior: React.FC = () => {
  const [projects, setProjects] = useState<InteriorProjectItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Modals & Editing State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<InteriorProjectDetailItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

  // Category Manager State
  const [isCatManagerOpen, setIsCatManagerOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState<number | null>(null);
  const [isQuickAddCat, setIsQuickAddCat] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');

  // Video & Logo File Upload Refs & State
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<InteriorProjectItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback
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
      addToast('error', 'Failed to load projects', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCategory = async (name: string, description?: string) => {
    if (!name.trim()) {
      addToast('error', 'Category Name Required', 'Please enter a name for the category.');
      return;
    }
    try {
      setCreatingCat(true);
      const created = await api.createInteriorCategory({
        name: name.trim(),
        description: description?.trim() || '',
      });
      addToast('success', 'Category Created', `"${created.name}" added under Architectural Design.`);
      const updatedCats = await api.getInteriorCategories();
      setCategories(updatedCats);
      setNewCatName('');
      setNewCatDesc('');
      setQuickCatName('');
      setIsQuickAddCat(false);
      if (editingProject) {
        setEditingProject({
          ...editingProject,
          category: created.id,
          category_id: created.id,
          category_name: created.name,
        });
      }
      return created;
    } catch (err: any) {
      addToast('error', 'Category Creation Failed', err.message);
    } finally {
      setCreatingCat(false);
    }
  };

  const handleDeleteCategory = async (catId: number, catName: string) => {
    try {
      setDeletingCatId(catId);
      await api.deleteInteriorCategory(catId);
      addToast('success', 'Category Removed', `"${catName}" category has been deleted.`);
      const updatedCats = await api.getInteriorCategories();
      setCategories(updatedCats);
      if (selectedCat === catName) setSelectedCat('All');
    } catch (err: any) {
      addToast('error', 'Failed to Delete Category', err.message);
    } finally {
      setDeletingCatId(null);
    }
  };

  const handleOpenCreate = () => {
    setEditingProject({
      title: '',
      category: categories[0]?.id || 1,
      location: 'Addis Ababa, Ethiopia',
      year: new Date().getFullYear().toString(),
      description: '',
      cover_image: '/tr/279A1756.JPG',
      company_logo: null,
      is_featured: true,
      order: projects.length + 1,
      specifications: {
        area: '450 m²',
        floors: 1,
        style: 'Contemporary Minimalist',
        material_palette: 'Smoked oak, raw travertine, brass joinery',
        lighting_design: 'Indirect 2700K warm LED coves',
        duration: '12 months',
        budget: 'Confidential',
        architect: 'ROHA Architectural Studio',
        client: 'Private Residence',
        status: 'Completed',
      }
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (project: InteriorProjectItem) => {
    try {
      const detail = await api.getInteriorProject(project.id);
      setEditingProject(detail);
      setIsModalOpen(true);
    } catch {
      setEditingProject(project);
      setIsModalOpen(true);
    }
  };

  // Video Upload Handler
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !editingProject) return;
    try {
      setUploadingVideo(true);
      const res = await api.uploadFile(e.target.files[0]);
      setEditingProject({ ...editingProject, video_url: res.url });
      addToast('success', 'Video File Uploaded', res.filename);
    } catch (err: any) {
      addToast('error', 'Video Upload Failed', err.message);
    } finally {
      setUploadingVideo(false);
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    }
  };

  // Company Logo Upload Handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !editingProject) return;
    try {
      setUploadingLogo(true);
      const res = await api.uploadFile(e.target.files[0]);
      setEditingProject({ ...editingProject, company_logo: res.url });
      addToast('success', 'Client Logo Uploaded', res.filename);
    } catch (err: any) {
      addToast('error', 'Logo Upload Failed', err.message);
    } finally {
      setUploadingLogo(false);
      if (logoFileInputRef.current) logoFileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;

    try {
      setSaving(true);

      const payload: any = { ...editingProject };
      if (payload.category && typeof payload.category === 'object' && payload.category.id) {
        payload.category_id = payload.category.id;
      } else if (payload.category && typeof payload.category === 'number') {
        payload.category_id = payload.category;
      }

      if (payload.specifications && payload.specifications.floors !== undefined) {
        const parsedFloors = parseInt(String(payload.specifications.floors).replace(/\D/g, ''), 10);
        payload.specifications.floors = isNaN(parsedFloors) ? 1 : parsedFloors;
      }

      if (editingProject.id) {
        await api.updateInteriorProject(editingProject.id, payload);
        addToast('success', 'Project Updated', `"${editingProject.title}" has been saved.`);
      } else {
        const created = await api.createInteriorProject(payload);
        // Persist any gallery images configured during creation
        if (editingProject.gallery_images && editingProject.gallery_images.length > 0) {
          for (const g of editingProject.gallery_images) {
            await api.addInteriorGalleryImage(created.id, {
              image: g.image,
              caption: g.caption,
              subtitle: g.subtitle,
              order: g.order || 0,
            }).catch(() => {});
          }
        }
        addToast('success', 'Project Created', `"${editingProject.title}" added to portfolio.`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      addToast('error', 'Save Failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.deleteInteriorProject(deleteTarget.id);
      addToast('success', 'Project Deleted', `"${deleteTarget.title}" was removed.`);
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      addToast('error', 'Deletion Failed', err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesCat = selectedCat === 'All' || p.category_name?.toLowerCase() === selectedCat.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Live Preview & Modal State
  const [previewLayout, setPreviewLayout] = useState<'tabbed' | 'split'>('tabbed');
  const [modalTab, setModalTab] = useState<'concept' | 'media' | 'gallery' | 'specs' | 'simulation'>('concept');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewTab, setPreviewTab] = useState<'card' | 'detail'>('card');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="space-y-8">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">Architectural Design</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#205b63]/40 border border-[#205b63] text-cyan-300 font-mono text-xs">
              {projects.length} Case Studies
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">Manage architectural design projects, subcategories, client logos, and spatial specifications</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCatManagerOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#142023] hover:bg-[#1a2b2f] border border-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Sliders size={14} className="text-cyan-400" />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Plus size={16} />
            <span>New Case Study</span>
          </button>
        </div>
      </div>

      {/* --- FILTER & SEARCH BAR --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Typology Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {['All', ...categories.map(c => c.name)].map((catName) => (
            <button
              key={catName}
              onClick={() => setSelectedCat(catName)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                selectedCat.toLowerCase() === catName.toLowerCase()
                  ? 'bg-[#205b63] text-white font-bold shadow-md shadow-[#205b63]/20'
                  : 'bg-[#0f1719] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {catName}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0f1719] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#205b63]"
          />
        </div>
      </div>

      {/* --- TABLE / GRID --- */}
      <div className="bg-[#0f1719] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 size={32} className="animate-spin text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider">Loading Portfolio Database...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <p className="text-sm font-mono mb-2">No interior projects found.</p>
            <button onClick={handleOpenCreate} className="text-xs text-cyan-400 underline cursor-pointer">
              Create your first case study
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#142023]/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Project</th>
                  <th className="py-3.5 px-4 font-semibold">Typology</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold">Year</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Featured</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(proj.cover_image, '/tr/279A1756.JPG')}
                          alt={proj.title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {proj.title}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
                            {proj.description ? proj.description.slice(0, 60) + '...' : 'No narrative yet'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#172e31] text-cyan-300 text-[10px] font-mono uppercase">
                        {proj.category_name || 'Interior'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {proj.location || 'Addis Ababa'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {proj.year || '2024'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${proj.is_featured ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600'}`} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(proj)}
                          className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-[#205b63]/20 rounded-lg transition-colors cursor-pointer"
                          title="Edit with Live Building Preview"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(proj)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 size={15} />
                        </button>
                        <a
                          href={`/project-detail?id=${proj.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="View on Live Website"
                        >
                          <ExternalLink size={15} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- CREATE / EDIT MODAL DRAWER WITH LIVE BUILDING PREVIEW --- */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />

          <div className={`relative w-full ${
            isFullscreen
              ? 'fixed inset-0 w-screen h-screen rounded-none z-50 max-h-screen'
              : 'w-[98vw] max-w-[1720px] h-[94vh] max-h-[96vh] rounded-3xl z-10'
          } bg-[#0b1214] border border-slate-800 shadow-2xl my-auto flex flex-col text-white transition-all duration-300 overflow-hidden`}>
            
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-800 bg-[#0f181b] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase">
                      {editingProject.id ? 'Edit Interior Architecture' : 'Create Interior Project'}
                    </h3>
                    {editingProject.id && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#142023] text-cyan-300 border border-slate-800">
                        #{editingProject.id}
                      </span>
                    )}
                    <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                      Live Preview Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Full-screen wide workspace with tabbed curation and real-time website rendering</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {/* Layout View Mode Switcher */}
                <div className="flex items-center p-1 bg-[#142023] rounded-xl border border-slate-800 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setPreviewLayout('tabbed')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      previewLayout === 'tabbed' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tabs Mode
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
                </div>

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-[#142023] transition-colors cursor-pointer"
                  title={isFullscreen ? "Exit Fullscreen" : "Full Screen Mode"}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-rose-950/40 hover:border-rose-900 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Tabs Navigation Bar */}
            <div className="flex items-center gap-1 sm:gap-2 px-6 py-2.5 border-b border-slate-800/80 bg-[#0c1417] overflow-x-auto scrollbar-none shrink-0 text-xs font-mono">
              {[
                { key: 'concept', label: '1. Narrative & Concept', icon: FileText },
                { key: 'media', label: '2. Hero Visual & Video', icon: Film },
                {
                  key: 'gallery',
                  label: '3. Parallax Gallery',
                  icon: ImageIcon,
                  badge: editingProject.gallery_images?.length || 0
                },
                { key: 'specs', label: '4. Architectural Specs', icon: Sliders },
                ...(previewLayout === 'tabbed' ? [{ key: 'simulation', label: '5. Live Simulation', icon: Eye }] : []),
              ].map((t: any) => {
                const IconComponent = t.icon;
                const isActive = modalTab === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setModalTab(t.key)}
                    className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#205b63] text-white shadow-md shadow-teal-950/50 border border-teal-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <IconComponent size={13} />
                    <span>{t.label}</span>
                    {t.badge !== undefined && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? 'bg-black/40 text-cyan-200' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {t.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hidden device video & logo file inputs */}
            <input
              ref={videoFileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoFileUpload}
              className="hidden"
            />
            <input
              ref={logoFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />

            {/* Modal Body */}
            <div className={`flex-1 overflow-y-auto ${
              previewLayout === 'split' ? 'grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800' : ''
            }`}>
              {/* Form Pane (Full width in tabbed mode, left 7 cols in split mode) */}
              <div className={`${
                previewLayout === 'split' ? 'lg:col-span-7 p-6 space-y-6 max-h-[calc(94vh-130px)]' : 'p-6 sm:p-8 space-y-6 max-h-[calc(94vh-130px)]'
              } overflow-y-auto`}>
                <form id="interior-form" onSubmit={handleSave} className="space-y-6">
                  
                  {/* TAB 1: NARRATIVE & CONCEPT */}
                  {modalTab === 'concept' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-bold">
                            Project Title <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={editingProject.title || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            placeholder="e.g. Minimalist Modern Residence"
                            className="w-full px-4 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-mono uppercase text-slate-400 font-bold">
                              Typology / Category
                            </label>
                            <button
                              type="button"
                              onClick={() => setIsQuickAddCat(!isQuickAddCat)}
                              className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer uppercase"
                            >
                              {isQuickAddCat ? 'Cancel' : '+ New'}
                            </button>
                          </div>

                          {isQuickAddCat ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={quickCatName}
                                onChange={(e) => setQuickCatName(e.target.value)}
                                placeholder="Category name..."
                                className="w-full px-3 py-2 bg-[#142023] border border-cyan-500/50 rounded-lg text-xs text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleCreateCategory(quickCatName)}
                                disabled={creatingCat || !quickCatName.trim()}
                                className="px-3 py-2 bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-bold rounded-lg uppercase cursor-pointer disabled:opacity-50 shrink-0"
                              >
                                {creatingCat ? <Loader2 size={12} className="animate-spin" /> : 'Add'}
                              </button>
                            </div>
                          ) : (
                            <select
                              value={editingProject.category || 1}
                              onChange={(e) => {
                                const catId = Number(e.target.value);
                                const catObj = categories.find(c => c.id === catId);
                                setEditingProject({
                                  ...editingProject,
                                  category: catId,
                                  category_id: catId,
                                  category_name: catObj?.name || 'Residential'
                                });
                              }}
                              className="w-full px-4 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-bold">
                            Editorial Subtitle / Monograph Byline
                          </label>
                          <input
                            type="text"
                            value={editingProject.subtitle || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                            placeholder="e.g. Transforming the Future of Contemporary Living"
                            className="w-full px-4 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-bold">Location</label>
                          <input
                            type="text"
                            value={editingProject.location || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                            placeholder="Addis Ababa, Ethiopia"
                            className="w-full px-4 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-bold">Completion Year</label>
                          <input
                            type="text"
                            value={editingProject.year || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                            placeholder="2024"
                            className="w-full px-4 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-bold">Display Order</label>
                          <input
                            type="number"
                            value={editingProject.order ?? 0}
                            onChange={(e) => setEditingProject({ ...editingProject, order: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-bold">
                          Architectural Philosophy & Spatial Narrative
                        </label>
                        <textarea
                          rows={5}
                          value={editingProject.description || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                          placeholder="Articulate the project's spatial concept, materiality, ergonomic circulation, and natural light study..."
                          className="w-full px-4 py-3 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white leading-relaxed focus:outline-none focus:border-[#205b63]"
                        />
                      </div>

                      <div className="p-4 rounded-2xl bg-[#142023]/60 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">Feature on Homepage & Global Showcases</p>
                          <p className="text-xs text-slate-400 font-mono">Highlighted in the curated architectural gallery and hero carousels.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={editingProject.is_featured ?? true}
                          onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                          className="w-5 h-5 rounded accent-[#205b63] cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2 & 3: MEDIA, MAIN COVER & GALLERY */}
                  {(modalTab === 'media' || modalTab === 'gallery') && (
                    <div className="space-y-6">
                      <MediaGalleryManager
                        mainImage={editingProject.cover_image || null}
                        onMainImageChange={(url) => setEditingProject({ ...editingProject, cover_image: url })}
                        galleryImages={editingProject.gallery_images || []}
                        onGalleryImagesChange={(imgs) => setEditingProject({ ...editingProject, gallery_images: imgs })}
                        contentTypeLabel="Interior Project"
                        onAddServerImage={
                          editingProject.id
                            ? async (data) => {
                                return api.addInteriorGalleryImage(editingProject.id!, data);
                              }
                            : undefined
                        }
                        onDeleteServerImage={
                          editingProject.id
                            ? async (imgId) => {
                                await api.deleteInteriorGalleryImage(imgId);
                              }
                            : undefined
                        }
                      />

                      {/* Company / Client Logo Section */}
                      <div className="p-5 rounded-2xl bg-[#0b1214] border border-slate-800/90 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                          <h4 className="text-sm font-black uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-2">
                            <ImageIcon size={16} />
                            <span>Client / Enterprise Partner Logo</span>
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">Fallback: ROHA Studio Logo (/roha.png)</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                          <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 rounded-xl bg-black/40 border border-slate-800">
                            <img
                              src={resolveImageUrl(editingProject.company_logo, '/roha.png')}
                              alt="Logo Preview"
                              className="w-20 h-20 object-contain drop-shadow-md mb-2"
                            />
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                              {editingProject.company_logo ? 'Custom Partner Logo' : 'Default ROHA Logo'}
                            </span>
                          </div>

                          <div className="lg:col-span-9 space-y-3">
                            <label className="block text-xs font-mono text-slate-400 uppercase font-bold">
                              Partner Logo URL or Upload PNG/SVG
                            </label>
                            <input
                              type="text"
                              value={editingProject.company_logo || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, company_logo: e.target.value })}
                              placeholder="e.g. /uploads/partner-logo.png or https://..."
                              className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63] font-mono"
                            />
                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => logoFileInputRef.current?.click()}
                                disabled={uploadingLogo}
                                className="px-4 py-2 rounded-xl bg-[#205b63] hover:bg-[#184e55] text-white text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-md"
                              >
                                {uploadingLogo ? <Loader2 size={13} className="animate-spin" /> : <ImageIcon size={13} />}
                                <span>Upload Logo Image</span>
                              </button>
                              {editingProject.company_logo && (
                                <button
                                  type="button"
                                  onClick={() => setEditingProject({ ...editingProject, company_logo: null })}
                                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-900 text-xs font-mono uppercase transition-colors cursor-pointer"
                                >
                                  Clear (Use ROHA Logo)
                                </button>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight">
                              If provided, this brand mark appears on the project detail hero and technical plaque. If empty, the official ROHA monogram is shown.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Cinematic Video Section */}
                      <div className="p-5 rounded-2xl bg-[#0b1214] border border-slate-800/90 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                          <h4 className="text-sm font-black uppercase tracking-wider text-[#d4af37] font-bold flex items-center gap-2">
                            <Film size={16} />
                            <span>Cinematic Process Video</span>
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">Embed in /project-detail</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                          <div className="lg:col-span-6 relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
                            {editingProject.video_url ? (
                              editingProject.video_url.match(/\.(mp4|webm|mov|mkv)($|\?)/i) || editingProject.video_url.startsWith('/uploads/') ? (
                                <video controls playsInline className="w-full h-full object-cover" src={resolveImageUrl(editingProject.video_url)} />
                              ) : (
                                <iframe
                                  className="w-full h-full"
                                  src={editingProject.video_url.includes('watch?v=') ? editingProject.video_url.replace('watch?v=', 'embed/') : editingProject.video_url}
                                  title="Project Video"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              )
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs font-mono gap-2 p-4 text-center">
                                <Film size={28} className="text-slate-700" />
                                <span>No video attached. Add a YouTube embed or upload an MP4/WebM file.</span>
                              </div>
                            )}
                          </div>

                          <div className="lg:col-span-6 space-y-3 flex flex-col justify-center">
                            <label className="block text-xs font-mono text-slate-400 uppercase font-bold">Video URL or Uploaded Video File</label>
                            <input
                              type="text"
                              value={editingProject.video_url || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, video_url: e.target.value })}
                              placeholder="https://www.youtube.com/embed/... or /uploads/...mp4"
                              className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63] font-mono"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => videoFileInputRef.current?.click()}
                                disabled={uploadingVideo}
                                className="px-4 py-2 rounded-xl bg-[#205b63] hover:bg-[#184e55] text-white text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-md"
                              >
                                {uploadingVideo ? <Loader2 size={13} className="animate-spin" /> : <Film size={13} />}
                                <span>Upload Video File</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                  {/* TAB 4: TECHNICAL SPECIFICATIONS */}
                  {modalTab === 'specs' && (
                    <div className="p-6 rounded-2xl bg-[#10191b] border border-slate-800 space-y-6">
                      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#d4af37]">
                            Technical Specifications & Materiality
                          </h4>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            These architectural parameters are dynamically rendered on the public /project-detail plaque and specifications drawer.
                          </p>
                        </div>
                        <span className="text-xs font-mono text-cyan-400">10 Parameters</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Floor Area</label>
                          <input
                            type="text"
                            value={editingProject.specifications?.area || '450 m²'}
                            onChange={(e) => setEditingProject({
                              ...editingProject,
                              specifications: { ...editingProject.specifications!, area: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Levels / Floors</label>
                          <input
                            type="number"
                            value={editingProject.specifications?.floors || 1}
                            onChange={(e) => setEditingProject({
                              ...editingProject,
                              specifications: { ...editingProject.specifications!, floors: Number(e.target.value) }
                            })}
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Architectural Style</label>
                          <input
                            type="text"
                            value={editingProject.specifications?.style || 'Contemporary Minimalist'}
                            onChange={(e) => setEditingProject({
                              ...editingProject,
                              specifications: { ...editingProject.specifications!, style: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Material Palette</label>
                          <input
                            type="text"
                            value={editingProject.specifications?.material_palette || 'Smoked oak, raw travertine, brass joinery'}
                            onChange={(e) => setEditingProject({
                              ...editingProject,
                              specifications: { ...editingProject.specifications!, material_palette: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Lighting Design</label>
                          <input
                            type="text"
                            value={editingProject.specifications?.lighting_design || 'Indirect 2700K warm LED coves'}
                            onChange={(e) => setEditingProject({
                              ...editingProject,
                              specifications: { ...editingProject.specifications!, lighting_design: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Project Duration</label>
                          <input
                            type="text"
                            value={editingProject.specifications?.duration || '12 months'}
                            onChange={(e) => setEditingProject({
                              ...editingProject,
                              specifications: { ...editingProject.specifications!, duration: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Project Budget</label>
                          <input
                            type="text"
                            value={editingProject.specifications?.budget || 'Confidential'}
                            onChange={(e) => setEditingProject({
                              ...editingProject,
                              specifications: { ...editingProject.specifications!, budget: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Client / Typology</label>
                          <input
                            type="text"
                            value={editingProject.specifications?.client || 'Private Residence'}
                            onChange={(e) => setEditingProject({
                              ...editingProject,
                              specifications: { ...editingProject.specifications!, client: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1 uppercase font-bold">Execution Status</label>
                          <select
                            value={editingProject.specifications?.status || 'Completed'}
                            onChange={(e) => setEditingProject({
                              ...editingProject,
                              specifications: { ...editingProject.specifications!, status: e.target.value }
                            })}
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#205b63]"
                          >
                            <option value="Concept">Concept</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: SIMULATION (Inside tabbed mode) */}
                  {previewLayout === 'tabbed' && modalTab === 'simulation' && (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#10191b] border border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-mono text-slate-300">Live Website Architectural Simulation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center p-0.5 bg-[#142023] rounded-lg border border-slate-800 text-xs font-mono">
                            <button
                              type="button"
                              onClick={() => setPreviewTab('card')}
                              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                                previewTab === 'card' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Card View
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewTab('detail')}
                              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                                previewTab === 'detail' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Project Detail Plaque
                            </button>
                          </div>
                          <div className="flex items-center p-0.5 bg-[#142023] rounded-lg border border-slate-800 text-xs font-mono">
                            <button
                              type="button"
                              onClick={() => setPreviewDevice('desktop')}
                              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                previewDevice === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400'
                              }`}
                            >
                              Desktop
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewDevice('mobile')}
                              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                previewDevice === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400'
                              }`}
                            >
                              Mobile
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className={`mx-auto transition-all duration-300 ${
                        previewDevice === 'mobile' ? 'max-w-[380px]' : 'max-w-4xl'
                      }`}>
                        {previewTab === 'card' ? (
                          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl">
                            <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 flex flex-col justify-between">
                              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                <img
                                  src={resolveImageUrl(editingProject.cover_image, '/tr/279A1756.JPG')}
                                  alt={editingProject.title || 'Preview Project'}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-slate-800 group-hover:bg-[#205b63] group-hover:text-white transition-colors duration-300">
                                  <ExternalLink className="w-4 h-4" />
                                </div>
                                <div className="absolute bottom-4 left-4 px-3.5 py-1.5 bg-black/70 backdrop-blur-md text-white text-xs font-mono rounded-full uppercase tracking-wider">
                                  {categories.find(c => c.id === editingProject.category)?.name || 'Residential'}
                                </div>
                              </div>
                              <div className="p-6 space-y-3 bg-white">
                                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                                  <span>{editingProject.location || 'Addis Ababa, Ethiopia'}</span>
                                  <span>{editingProject.year || '2024'}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#205b63] transition-colors leading-snug">
                                  {editingProject.title || 'Untitled Architectural Case Study'}
                                </h3>
                                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                  {editingProject.description || 'Describe spatial curation, materiality, lighting, and ergonomic design...'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-[#172a2b] to-[#0a1214] p-8 shadow-2xl text-white space-y-6">
                            <div className="text-center space-y-1">
                              <span className="text-xs font-mono tracking-[0.25em] uppercase text-cyan-300 font-bold">
                                {editingProject.subtitle || 'TRANSFORMING THE FUTURE OF CONTEMPORARY LIVING'}
                              </span>
                              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
                                {editingProject.title || 'UNTITLED RESIDENCE'}
                              </h2>
                            </div>
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                              <img
                                src={resolveImageUrl(editingProject.cover_image, '/tr/279A1756.JPG')}
                                alt="Project"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                <div className="flex gap-2">
                                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-xs font-mono text-white">
                                    {categories.find(c => c.id === editingProject.category)?.name || 'Residential'}
                                  </span>
                                  <span className="px-3 py-1 bg-[#205b63]/80 backdrop-blur-md rounded-full border border-cyan-400/30 text-xs font-mono text-cyan-200">
                                    {editingProject.specifications?.style || 'Contemporary Minimalist'}
                                  </span>
                                </div>
                                <span className="px-3 py-1 bg-emerald-950/80 backdrop-blur-md rounded-full border border-emerald-500/30 text-xs font-mono text-emerald-300">
                                  {editingProject.specifications?.status || 'Completed'}
                                </span>
                              </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                              <div className="text-xs font-mono uppercase tracking-widest text-[#d4af37] font-bold">
                                Architectural Specifications
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                  <span className="text-slate-400 block text-[10px] uppercase">Floor Area</span>
                                  <span className="text-white font-bold">{editingProject.specifications?.area || '450 m²'}</span>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                  <span className="text-slate-400 block text-[10px] uppercase">Style Typology</span>
                                  <span className="text-white font-bold">{editingProject.specifications?.style || 'Contemporary Minimalist'}</span>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                  <span className="text-slate-400 block text-[10px] uppercase">Materiality</span>
                                  <span className="text-white font-bold truncate block">{editingProject.specifications?.material_palette || 'Smoked oak, raw travertine'}</span>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                  <span className="text-slate-400 block text-[10px] uppercase">Lighting</span>
                                  <span className="text-white font-bold truncate block">{editingProject.specifications?.lighting_design || 'Indirect 2700K warm LED'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* SPLIT MODE RIGHT PANE: Live Building Preview */}
              {previewLayout === 'split' && (
                <div className="lg:col-span-5 bg-[#070b0c] p-6 flex flex-col justify-between overflow-y-auto max-h-[calc(94vh-130px)]">
                  <div className="space-y-4">
                    {/* Simulated Browser Chrome & Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                        <span className="ml-2 text-[10px] font-mono text-slate-500 bg-[#142023] px-2.5 py-0.5 rounded-md border border-slate-800">
                          roha.studio/interior/preview
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
                            onClick={() => setPreviewTab('detail')}
                            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                              previewTab === 'detail' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Plaque
                          </button>
                        </div>

                        <div className="flex items-center p-0.5 bg-[#142023] rounded-lg border border-slate-800 text-[10px] font-mono">
                          <button
                            type="button"
                            onClick={() => setPreviewDevice('desktop')}
                            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                              previewDevice === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400'
                            }`}
                            title="Desktop View"
                          >
                            Desktop
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewDevice('mobile')}
                            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                              previewDevice === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400'
                            }`}
                            title="Mobile View"
                          >
                            Mobile
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Content */}
                    <div className={`mx-auto transition-all duration-300 ${
                      previewDevice === 'mobile' ? 'max-w-[340px]' : 'w-full'
                    }`}>
                      {previewTab === 'card' ? (
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 shadow-2xl">
                          <div className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 flex flex-col justify-between">
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                              <img
                                src={resolveImageUrl(editingProject.cover_image, '/tr/279A1756.JPG')}
                                alt={editingProject.title || 'Preview Project'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-slate-800 group-hover:bg-[#205b63] group-hover:text-white transition-colors duration-300">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </div>
                              <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-mono rounded-full uppercase tracking-wider">
                                {categories.find(c => c.id === editingProject.category)?.name || 'Residential'}
                              </div>
                            </div>
                            <div className="p-4 space-y-2 bg-white">
                              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                                <span>{editingProject.location || 'Addis Ababa, Ethiopia'}</span>
                                <span>{editingProject.year || '2024'}</span>
                              </div>
                              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#205b63] transition-colors leading-snug">
                                {editingProject.title || 'Untitled Architectural Case Study'}
                              </h3>
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {editingProject.description || 'Describe spatial curation, materiality, lighting, and ergonomic design...'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-[#172a2b] to-[#0a1214] p-5 shadow-2xl text-white space-y-4">
                          <div className="text-center space-y-1">
                            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-cyan-300">
                              {editingProject.subtitle || 'TRANSFORMING THE FUTURE OF CONTEMPORARY LIVING'}
                            </span>
                            <h2 className="text-lg font-black uppercase tracking-tight text-white/90">
                              {editingProject.title || 'UNTITLED RESIDENCE'}
                            </h2>
                          </div>
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10">
                            <img
                              src={resolveImageUrl(editingProject.cover_image, '/tr/279A1756.JPG')}
                              alt={editingProject.title || 'Project'}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                              <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-mono text-white">
                                {categories.find(c => c.id === editingProject.category)?.name || 'Residential'}
                              </span>
                              <span className="px-2 py-0.5 bg-emerald-950/80 backdrop-blur-md rounded-full border border-emerald-500/30 text-[9px] font-mono text-emerald-300">
                                {editingProject.specifications?.status || 'Completed'}
                              </span>
                            </div>
                          </div>
                          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-[10px] font-mono space-y-2">
                            <span className="text-[#d4af37] uppercase block font-bold">Architectural Specifications</span>
                            <div className="grid grid-cols-2 gap-2 text-slate-300">
                              <div>Area: <span className="text-white font-bold">{editingProject.specifications?.area || '450 m²'}</span></div>
                              <div>Style: <span className="text-white font-bold">{editingProject.specifications?.style || 'Minimalist'}</span></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Updates in real-time as you type</span>
                    <span className="text-cyan-400">ROHA Interior Design System</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-[#0f181b] shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-400 font-mono">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#205b63]" />
                  <span>{editingProject.gallery_images?.length || 0} Parallax Photos</span>
                </span>
                <span>•</span>
                <span>{editingProject.video_url ? 'Video Attached' : 'No Video'}</span>
                <span>•</span>
                <span className="text-[#d4af37] font-semibold">{editingProject.specifications?.status || 'Completed'}</span>
              </div>

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
                  form="interior-form"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>{editingProject.id ? 'Save Changes' : 'Create Project'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {isCatManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCatManagerOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#0b1214] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#205b63]/30 border border-[#205b63]/50 text-cyan-300">
                  <Sliders size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-tight">
                    Architectural Design Categories
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Create, view, and organize filtering tags for projects</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCatManagerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Create Category Form */}
            <div className="p-4 rounded-2xl bg-[#142023]/70 border border-slate-800 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                Add New Architectural Category
              </h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category Name (e.g. Master Planning, Urban Sanctuary)"
                  className="w-full px-3.5 py-2.5 bg-[#0b1214] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#205b63]"
                />
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Optional brief description..."
                  className="w-full px-3.5 py-2 bg-[#0b1214] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#205b63]"
                />
              </div>
              <button
                type="button"
                onClick={() => handleCreateCategory(newCatName, newCatDesc)}
                disabled={creatingCat || !newCatName.trim()}
                className="w-full py-2.5 rounded-xl bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors shadow-md"
              >
                {creatingCat ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                <span>Create Category</span>
              </button>
            </div>

            {/* Existing Categories List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Active Categories ({categories.length})
              </h4>
              {categories.map((cat) => {
                const projectCount = projects.filter(p => p.category_name?.toLowerCase() === cat.name.toLowerCase()).length;
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#142023]/40 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{cat.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/40 text-cyan-300">
                          {projectCount} projects
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{cat.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      disabled={deletingCatId === cat.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete Category"
                    >
                      {deletingCatId === cat.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCatManagerOpen(false)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Architectural Design Project"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This will remove its specifications and gallery from the live portfolio.`}
        confirmLabel="Delete Project"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Cover Asset Picker Modal */}
      <ImagePickerModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        currentValue={editingProject?.cover_image || ''}
        onSelect={(path) => {
          if (editingProject) {
            setEditingProject({ ...editingProject, cover_image: path });
          }
        }}
        title="Select Architectural Design Photography"
      />
    </div>
  );
};
