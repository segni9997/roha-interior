import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, Edit3, Trash2, ExternalLink, X, Loader2,
  Film, Maximize2, Minimize2,
  Layers, Check, FileText, Sliders, Eye, Sparkles
} from 'lucide-react';
import { api, resolveImageUrl, type ModelProjectItem, type CategoryItem, type ModelProjectDetailItem } from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { ToastContainer, type ToastMessage } from '../components/Toast';
import { ImagePickerModal } from '../components/ImagePickerModal';
import { MediaGalleryManager } from '../components/MediaGalleryManager';


export const AdminModels: React.FC = () => {
  const [projects, setProjects] = useState<ModelProjectItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Modal Workspace States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Partial<ModelProjectDetailItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'concept' | 'media' | 'gallery' | 'specs' | 'simulation'>('concept');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewLayout, setPreviewLayout] = useState<'tabbed' | 'split'>('tabbed');
  const [previewTab, setPreviewTab] = useState<'card' | 'specs'>('card');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

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

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<ModelProjectItem | null>(null);
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
      const [models, cats] = await Promise.all([
        api.getModelProjects(),
        api.getModelCategories().catch(() => []),
      ]);
      setProjects(models);
      setCategories(cats);
    } catch (err: any) {
      addToast('error', 'Failed to load model projects', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCategory = async (name: string, description?: string) => {
    if (!name.trim()) {
      addToast('error', 'Category Name Required', 'Please enter a category name.');
      return;
    }
    try {
      setCreatingCat(true);
      const created = await api.createModelCategory({
        name: name.trim(),
        description: description?.trim() || '',
      });
      addToast('success', 'Category Created', `"${created.name}" added under Modeling Making.`);
      const updatedCats = await api.getModelCategories();
      setCategories(updatedCats);
      setNewCatName('');
      setNewCatDesc('');
      setQuickCatName('');
      setIsQuickAddCat(false);
      if (editingModel) {
        setEditingModel({
          ...editingModel,
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
      await api.deleteModelCategory(catId);
      addToast('success', 'Category Removed', `"${catName}" category has been deleted.`);
      const updatedCats = await api.getModelCategories();
      setCategories(updatedCats);
      if (selectedCat === catName) setSelectedCat('All');
    } catch (err: any) {
      addToast('error', 'Failed to Delete Category', err.message);
    } finally {
      setDeletingCatId(null);
    }
  };

  const handleOpenCreate = () => {
    setEditingModel({
      title: '',
      category: categories[0]?.id || 1,
      scale_ratio: '1:100',
      precision_tolerance: '0.1mm',
      year: new Date().getFullYear().toString(),
      day: 'Monday',
      materials_used: 'Laser-cut acrylic, basswood, SLA resin 3D print, brass rod joinery',
      fabrication_methods: 'Hybrid 3D Printing, Laser Cutting, CNC Milling, Hand Finishing',
      dimensions_cm: '120 x 80 x 45 cm',
      illumination: 'Integrated 3000K warm LED lighting',
      description: '',
      cover_image: '/tr/279A1812.JPG',
      company_logo: null,
      is_featured: true,
      order: projects.length + 1,
      specifications: {
        scale: '1:100',
        tolerance: '0.1mm precision',
        base_material: 'Precision laser-cut acrylic & American basswood',
        finish: 'Satin architectural white, clear lacquered timber',
        lead_time: '3 - 4 weeks',
        client: 'Architectural Studio / Developer',
        status: 'Completed',
      }
    });
    setModalTab('concept');
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (project: ModelProjectItem) => {
    try {
      const detail = await api.getModelProject(project.id);
      setEditingModel(detail);
      setModalTab('concept');
      setIsModalOpen(true);
    } catch {
      setEditingModel(project);
      setModalTab('concept');
      setIsModalOpen(true);
    }
  };

  // Video Upload Handler
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !editingModel) return;
    try {
      setUploadingVideo(true);
      const res = await api.uploadFile(e.target.files[0]);
      setEditingModel({ ...editingModel, video_url: res.url });
      addToast('success', 'Video File Uploaded', res.filename);
    } catch (err: any) {
      addToast('error', 'Video Upload Failed', err.message);
    } finally {
      setUploadingVideo(false);
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    }
  };

  // Logo Upload Handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !editingModel) return;
    try {
      setUploadingLogo(true);
      const res = await api.uploadFile(e.target.files[0]);
      setEditingModel({ ...editingModel, company_logo: res.url });
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
    if (!editingModel?.title) return;

    try {
      setSaving(true);

      const payload: any = { ...editingModel };
      if (payload.category && typeof payload.category === 'object' && payload.category.id) {
        payload.category_id = payload.category.id;
      } else if (payload.category && typeof payload.category === 'number') {
        payload.category_id = payload.category;
      }

      if (editingModel.id) {
        await api.updateModelProject(editingModel.id, payload);
        addToast('success', 'Model Updated', `"${editingModel.title}" has been saved.`);
      } else {
        const created = await api.createModelProject(payload);
        if (editingModel.gallery_images && editingModel.gallery_images.length > 0) {
          for (const g of editingModel.gallery_images) {
            await api.addModelGalleryImage(created.id, {
              image: g.image,
              caption: g.caption,
              subtitle: g.subtitle,
              order: g.order || 0,
            }).catch(() => {});
          }
        }
        addToast('success', 'Model Created', `"${editingModel.title}" added to model catalog.`);
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
      await api.deleteModelProject(deleteTarget.id);
      addToast('success', 'Model Deleted', `"${deleteTarget.title}" was removed.`);
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
                          p.scale_ratio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.materials_used?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">Modeling Making</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#205b63]/40 border border-[#205b63] text-cyan-300 font-mono text-xs">
              {projects.length} Model Projects
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">Manage precision architectural scale models, material fabrication, and client monograph tags</p>
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
            <span>New Model Project</span>
          </button>
        </div>
      </div>

      {/* --- FILTER & SEARCH BAR --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
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
            placeholder="Search model, scale, or materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0f1719] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#205b63]"
          />
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-[#0f1719] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 size={32} className="animate-spin text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider">Loading Scale Models Database...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <p className="text-sm font-mono mb-2">No physical models found.</p>
            <button onClick={handleOpenCreate} className="text-xs text-cyan-400 underline cursor-pointer">
              Add your first scale model
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#142023]/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Model</th>
                  <th className="py-3.5 px-4 font-semibold">Scale</th>
                  <th className="py-3.5 px-4 font-semibold">Tolerance</th>
                  <th className="py-3.5 px-4 font-semibold">Materials</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Featured</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredProjects.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(m.cover_image, '/tr/279A1812.JPG')}
                          alt={m.title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {m.title}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
                            {m.category_name} • {m.year}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-amber-300 font-mono text-[10px] uppercase">
                        {m.scale_ratio}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      ±{m.precision_tolerance || '0.1mm'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                      {m.materials_used || 'Laser-cut acrylic & basswood'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${m.is_featured ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-600'}`} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-[#205b63]/20 rounded-lg transition-colors cursor-pointer"
                          title="Edit with Live Building Preview"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(m)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Model"
                        >
                          <Trash2 size={15} />
                        </button>
                        <a
                          href={`/project-detail?id=${m.id}&type=model`}
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

      {/* --- CREATE / EDIT MODAL DRAWER WITH WIDE SCREEN TABBED WORKSPACE & LIVE BUILDING PREVIEW --- */}
      {isModalOpen && editingModel && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4'} overflow-y-auto`}>
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />

          <div className={`relative ${
            isFullscreen 
              ? 'w-screen h-screen rounded-none border-0' 
              : 'w-[98vw] max-w-[1720px] h-[94vh] rounded-3xl border border-slate-800'
          } bg-[#0b1214] shadow-2xl z-10 my-auto flex flex-col text-white transition-all duration-300 overflow-hidden`}>
            
            {/* Header & Tabs Navigation */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-6 py-3.5 border-b border-slate-800 bg-[#0f181b] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase flex items-center gap-2">
                    <span>{editingModel.id ? `Edit: ${editingModel.title || 'Scale Model'}` : 'New Physical Scale Model'}</span>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                      Live Simulation Active
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">Workspace for physical architectural models, fabrication parameters & high-resolution close-ups</p>
                </div>
              </div>

              {/* Workspace Navigation Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center p-1 bg-[#142023] rounded-xl border border-slate-800 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => { setModalTab('concept'); if (previewLayout === 'split') setPreviewLayout('tabbed'); }}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      modalTab === 'concept' && previewLayout === 'tabbed' ? 'bg-[#205b63] text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText size={13} />
                    <span>Concept</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setModalTab('media'); if (previewLayout === 'split') setPreviewLayout('tabbed'); }}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      modalTab === 'media' && previewLayout === 'tabbed' ? 'bg-[#205b63] text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Film size={13} />
                    <span>Media & Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setModalTab('gallery'); if (previewLayout === 'split') setPreviewLayout('tabbed'); }}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      modalTab === 'gallery' && previewLayout === 'tabbed' ? 'bg-[#205b63] text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers size={13} />
                    <span>Detail Perspectives</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-black/40 text-cyan-300 border border-cyan-800/40">
                      {editingModel.gallery_images?.length || 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setModalTab('specs'); if (previewLayout === 'split') setPreviewLayout('tabbed'); }}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      modalTab === 'specs' && previewLayout === 'tabbed' ? 'bg-[#205b63] text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sliders size={13} />
                    <span>Fabrication Specs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setModalTab('simulation'); if (previewLayout === 'split') setPreviewLayout('tabbed'); }}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      modalTab === 'simulation' && previewLayout === 'tabbed' ? 'bg-[#205b63] text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye size={13} />
                    <span>Live Simulation</span>
                  </button>
                </div>

                {/* Split Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setPreviewLayout(prev => prev === 'split' ? 'tabbed' : 'split')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    previewLayout === 'split'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-[#142023] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Toggle Split Screen View"
                >
                  <Sparkles size={13} />
                  <span className="hidden sm:inline">{previewLayout === 'split' ? 'Split View Active' : 'Split 50/50'}</span>
                </button>

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-xl bg-[#142023] border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode'}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-[#142023] border border-slate-800 text-slate-400 hover:text-white hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
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

            {/* Main Content Workspace */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              
              {/* Form / Active Tab Editing Area */}
              <div className={`${
                previewLayout === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'
              } overflow-y-auto p-6 space-y-6 h-full bg-[#0a1012]`}>
                
                <form id="model-form" onSubmit={handleSave} className="space-y-6">
                  
                  {/* TAB 1: CORE CONCEPT & NARRATIVE */}
                  {(modalTab === 'concept' || previewLayout === 'split') && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs uppercase tracking-wider font-bold">
                          <FileText size={15} />
                          <span>1. Model Typology & Narrative Concept</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Catalog metadata</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 lg:col-span-2">
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                            Model Title <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={editingModel.title || ''}
                            onChange={(e) => setEditingModel({ ...editingModel, title: e.target.value })}
                            placeholder="e.g. Modern Residential Complex Scale Model"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold">
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
                              value={editingModel.category || 1}
                              onChange={(e) => {
                                const catId = Number(e.target.value);
                                const catObj = categories.find(c => c.id === catId);
                                setEditingModel({
                                  ...editingModel,
                                  category: catId,
                                  category_id: catId,
                                  category_name: catObj?.name || 'Architecture'
                                });
                              }}
                              className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                            Monograph Subtitle
                          </label>
                          <input
                            type="text"
                            value={editingModel.subtitle || ''}
                            onChange={(e) => setEditingModel({ ...editingModel, subtitle: e.target.value })}
                            placeholder="e.g. Laser-Fabricated Architectural Study & Topography Assembly"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Scale Ratio</label>
                          <input
                            type="text"
                            value={editingModel.scale_ratio || '1:100'}
                            onChange={(e) => setEditingModel({ ...editingModel, scale_ratio: e.target.value })}
                            placeholder="1:50, 1:100, 1:200"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Precision Tolerance</label>
                          <input
                            type="text"
                            value={editingModel.precision_tolerance || '0.1mm'}
                            onChange={(e) => setEditingModel({ ...editingModel, precision_tolerance: e.target.value })}
                            placeholder="0.1mm"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Fabrication Year</label>
                          <input
                            type="text"
                            value={editingModel.year || ''}
                            onChange={(e) => setEditingModel({ ...editingModel, year: e.target.value })}
                            placeholder="2024"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Display Order</label>
                          <input
                            type="number"
                            value={editingModel.order || 1}
                            onChange={(e) => setEditingModel({ ...editingModel, order: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div className="flex items-center gap-3 pt-6">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                            <input
                              type="checkbox"
                              checked={editingModel.is_featured ?? true}
                              onChange={(e) => setEditingModel({ ...editingModel, is_featured: e.target.checked })}
                              className="w-4 h-4 rounded bg-[#142023] border-slate-700 text-[#205b63] focus:ring-0"
                            />
                            <span className="text-white">Featured Model</span>
                          </label>
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                            Model Narrative & Craftsmanship Description
                          </label>
                          <textarea
                            rows={4}
                            value={editingModel.description || ''}
                            onChange={(e) => setEditingModel({ ...editingModel, description: e.target.value })}
                            placeholder="Technical narrative, massing study, craftsmanship details, joinery techniques..."
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2 & 3: MEDIA, MAIN COVER & GALLERY */}
                  {(modalTab === 'media' || modalTab === 'gallery') && (
                    <div className="space-y-6">
                      <MediaGalleryManager
                        mainImage={editingModel.cover_image || null}
                        onMainImageChange={(url) => setEditingModel({ ...editingModel, cover_image: url })}
                        galleryImages={editingModel.gallery_images || []}
                        onGalleryImagesChange={(imgs) => setEditingModel({ ...editingModel, gallery_images: imgs })}
                        contentTypeLabel="Scale Model Project"
                        onAddServerImage={
                          editingModel.id
                            ? async (data) => {
                                return api.addModelGalleryImage(editingModel.id!, data);
                              }
                            : undefined
                        }
                        onDeleteServerImage={
                          editingModel.id
                            ? async (imgId) => {
                                await api.deleteModelGalleryImage(imgId);
                              }
                            : undefined
                        }
                      />

                      {/* Company / Client Logo Section */}
                      <div className="p-5 rounded-2xl bg-[#0b1214] border border-slate-800/90 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                          <h4 className="text-sm font-black uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-2">
                            <Sparkles size={16} />
                            <span>Client / Enterprise Partner Logo</span>
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">Fallback: ROHA Studio Logo (/roha.png)</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                          <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 rounded-xl bg-black/40 border border-slate-800">
                            <img
                              src={resolveImageUrl(editingModel.company_logo, '/roha.png')}
                              alt="Logo Preview"
                              className="w-20 h-20 object-contain drop-shadow-md mb-2"
                            />
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                              {editingModel.company_logo ? 'Custom Partner Logo' : 'Default ROHA Logo'}
                            </span>
                          </div>

                          <div className="lg:col-span-9 space-y-3">
                            <label className="block text-xs font-mono text-slate-400 uppercase font-bold">
                              Partner Logo URL or Upload PNG/SVG
                            </label>
                            <input
                              type="text"
                              value={editingModel.company_logo || ''}
                              onChange={(e) => setEditingModel({ ...editingModel, company_logo: e.target.value })}
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
                                {uploadingLogo ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                                <span>Upload Logo Image</span>
                              </button>
                              {editingModel.company_logo && (
                                <button
                                  type="button"
                                  onClick={() => setEditingModel({ ...editingModel, company_logo: null })}
                                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-900 text-xs font-mono uppercase transition-colors cursor-pointer"
                                >
                                  Clear (Use ROHA Logo)
                                </button>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight">
                              If provided, this brand mark appears on the scale model presentation plaque and detail page. If empty, the official ROHA monogram is shown.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Cinematic Video Section */}
                      <div className="p-5 rounded-2xl bg-[#0b1214] border border-slate-800/90 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                          <h4 className="text-sm font-black uppercase tracking-wider text-[#d4af37] font-bold flex items-center gap-2">
                            <Film size={16} />
                            <span>Fabrication Process Video (Cinematic Documentation)</span>
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">Embed in /project-detail?type=model</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                          <div className="lg:col-span-6 relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
                            {editingModel.video_url ? (
                              editingModel.video_url.match(/\.(mp4|webm|mov|mkv)($|\?)/i) || editingModel.video_url.startsWith('/uploads/') ? (
                                <video controls playsInline className="w-full h-full object-cover" src={resolveImageUrl(editingModel.video_url)} />
                              ) : (
                                <iframe
                                  className="w-full h-full"
                                  src={editingModel.video_url.includes('watch?v=') ? editingModel.video_url.replace('watch?v=', 'embed/') : editingModel.video_url}
                                  title="Fabrication Video"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              )
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs font-mono gap-2 p-4 text-center">
                                <Film size={28} className="text-slate-700" />
                                <span>No fabrication video attached. Add a YouTube embed or upload an MP4/WebM file.</span>
                              </div>
                            )}
                          </div>

                          <div className="lg:col-span-6 space-y-3 flex flex-col justify-center">
                            <label className="block text-xs font-mono text-slate-400 uppercase font-bold">Video URL or Uploaded Video File</label>
                            <input
                              type="text"
                              value={editingModel.video_url || ''}
                              onChange={(e) => setEditingModel({ ...editingModel, video_url: e.target.value })}
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

                  {/* TAB 4: FABRICATION SPECIFICATIONS */}
                  {modalTab === 'specs' && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs uppercase tracking-wider font-bold">
                          <Sliders size={15} />
                          <span>4. Fabrication Specifications & Materials</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Plaque & technical data</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 lg:col-span-3">
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Materials Used</label>
                          <input
                            type="text"
                            value={editingModel.materials_used || ''}
                            onChange={(e) => setEditingModel({ ...editingModel, materials_used: e.target.value })}
                            placeholder="Laser-cut acrylic, American basswood, SLA resin, brass rod joinery"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Fabrication Methods</label>
                          <input
                            type="text"
                            value={editingModel.fabrication_methods || ''}
                            onChange={(e) => setEditingModel({ ...editingModel, fabrication_methods: e.target.value })}
                            placeholder="Hybrid 3D Printing, Laser Cutting, CNC Milling, Hand Finishing"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Dimensions (cm)</label>
                          <input
                            type="text"
                            value={editingModel.dimensions_cm || '120 x 80 x 45 cm'}
                            onChange={(e) => setEditingModel({ ...editingModel, dimensions_cm: e.target.value })}
                            placeholder="120 x 80 x 45 cm"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Illumination</label>
                          <input
                            type="text"
                            value={editingModel.illumination || 'Integrated 3000K warm LED lighting'}
                            onChange={(e) => setEditingModel({ ...editingModel, illumination: e.target.value })}
                            placeholder="Integrated 3000K warm LED lighting"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Lead Time</label>
                          <input
                            type="text"
                            value={editingModel.specifications?.lead_time || '3 - 4 weeks'}
                            onChange={(e) => {
                              const base = editingModel.specifications || {
                                scale: '1:100',
                                tolerance: '0.1mm precision',
                                base_material: 'Precision laser-cut acrylic & American basswood',
                                finish: 'Satin architectural white, clear lacquered timber',
                                lead_time: '3 - 4 weeks',
                                client: 'Architectural Studio / Developer',
                                status: 'Completed',
                              };
                              setEditingModel({
                                ...editingModel,
                                specifications: { ...base, lead_time: e.target.value }
                              });
                            }}
                            placeholder="3 - 4 weeks"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Surface Finish</label>
                          <input
                            type="text"
                            value={editingModel.specifications?.finish || 'Satin architectural white, clear lacquered timber'}
                            onChange={(e) => {
                              const base = editingModel.specifications || {
                                scale: '1:100',
                                tolerance: '0.1mm precision',
                                base_material: 'Precision laser-cut acrylic & American basswood',
                                finish: 'Satin architectural white, clear lacquered timber',
                                lead_time: '3 - 4 weeks',
                                client: 'Architectural Studio / Developer',
                                status: 'Completed',
                              };
                              setEditingModel({
                                ...editingModel,
                                specifications: { ...base, finish: e.target.value }
                              });
                            }}
                            placeholder="Satin architectural white, clear lacquered timber"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Commission / Client</label>
                          <input
                            type="text"
                            value={editingModel.specifications?.client || 'Architectural Studio / Developer'}
                            onChange={(e) => {
                              const base = editingModel.specifications || {
                                scale: '1:100',
                                tolerance: '0.1mm precision',
                                base_material: 'Precision laser-cut acrylic & American basswood',
                                finish: 'Satin architectural white, clear lacquered timber',
                                lead_time: '3 - 4 weeks',
                                client: 'Architectural Studio / Developer',
                                status: 'Completed',
                              };
                              setEditingModel({
                                ...editingModel,
                                specifications: { ...base, client: e.target.value }
                              });
                            }}
                            placeholder="Architectural Studio / Developer"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">Commission Status</label>
                          <input
                            type="text"
                            value={editingModel.specifications?.status || 'Completed'}
                            onChange={(e) => {
                              const base = editingModel.specifications || {
                                scale: '1:100',
                                tolerance: '0.1mm precision',
                                base_material: 'Precision laser-cut acrylic & American basswood',
                                finish: 'Satin architectural white, clear lacquered timber',
                                lead_time: '3 - 4 weeks',
                                client: 'Architectural Studio / Developer',
                                status: 'Completed',
                              };
                              setEditingModel({
                                ...editingModel,
                                specifications: { ...base, status: e.target.value }
                              });
                            }}
                            placeholder="Completed"
                            className="w-full px-3.5 py-2.5 bg-[#142023] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#205b63]"
                          />
                        </div>
                      </div>
                    </div>
                  )}


                </form>
              </div>

              {/* Live Architectural Simulation Pane (Right Pane in Split or Full in Simulation Tab) */}
              {(previewLayout === 'split' || modalTab === 'simulation') && (
                <div className={`${
                  previewLayout === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'
                } bg-[#070b0c] p-6 flex flex-col justify-between overflow-y-auto h-full`}>
                  <div>
                    {/* Simulated Browser Chrome & Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                        <span className="ml-2 text-[10px] font-mono text-slate-500 bg-[#142023] px-2.5 py-0.5 rounded-md border border-slate-800">
                          roha.studio/model-making/preview
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Target Switcher: Public Card View vs Technical Plaque */}
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
                            onClick={() => setPreviewTab('specs')}
                            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                              previewTab === 'specs' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Fabrication Plaque
                          </button>
                        </div>

                        {/* Device Toggle */}
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

                    {/* LIVE PREVIEW CONTAINER */}
                    <div className={`mx-auto transition-all duration-300 ${
                      previewDevice === 'mobile' ? 'max-w-[340px]' : 'w-full'
                    }`}>
                      {previewTab === 'card' ? (
                        /* Authentic Scale Model Card as on /model-making */
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 shadow-2xl">
                          <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                            <span>● Live /model-making Card</span>
                            <span>Interactive Glow</span>
                          </div>

                          <div className="group relative h-[420px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/60 shadow-2xl cursor-pointer">
                            <img
                              src={resolveImageUrl(editingModel.cover_image, '/tr/279A1812.JPG')}
                              alt={editingModel.title || 'Model'}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                            {/* Floating Scale & Tolerance Badges */}
                            <div className="absolute top-4 left-4 flex gap-2">
                              <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/20 text-[10px] text-amber-300 font-mono uppercase rounded-md tracking-wider">
                                SCALE {editingModel.scale_ratio || '1:100'}
                              </span>
                              <span className="px-2.5 py-1 bg-[#205b63]/90 backdrop-blur-md border border-white/20 text-[10px] text-white font-mono uppercase rounded-md">
                                ±{editingModel.precision_tolerance || '0.1mm'}
                              </span>
                            </div>

                            <div className="absolute top-4 right-4">
                              <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-[10px] text-white font-mono rounded">
                                {editingModel.year || '2024'}
                              </span>
                            </div>

                            {/* Glass Content Card */}
                            <div className="absolute inset-x-3 bottom-3">
                              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl transition-all duration-500 group-hover:bg-white/20">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-black text-[#7db3b8] uppercase tracking-wider">
                                    {categories.find(c => c.id === editingModel.category)?.name || 'Architecture'}
                                  </span>
                                  <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-white font-bold text-lg leading-tight mb-2 truncate">
                                  {editingModel.title || 'Untitled Scale Model'}
                                </h3>
                                <p className="text-white/70 text-[11px] leading-relaxed line-clamp-2">
                                  {editingModel.description || 'Precision laser-cut massing study and topography assembly.'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Authentic Fabrication Plaque */
                        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-[#172a2b] to-[#0a1214] p-5 shadow-2xl text-white space-y-4">
                          <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest flex items-center justify-between border-b border-white/10 pb-2">
                            <span>● Architectural Model Fabrication Plaque</span>
                            <span>Studio Workshop Standard</span>
                          </div>

                          <div className="text-center space-y-1">
                            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-amber-300">
                              SCALE RATIO {editingModel.scale_ratio || '1:100'} // TOLERANCE ±{editingModel.precision_tolerance || '0.1mm'}
                            </span>
                            <h2 className="text-xl font-black uppercase tracking-tight text-white/95">
                              {editingModel.title || 'ARCHITECTURAL SCALE MODEL'}
                            </h2>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                            <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                              <span className="text-slate-400 block text-[9px] uppercase">Base Materials</span>
                              <span className="text-white font-semibold truncate block">
                                {editingModel.materials_used || 'Laser acrylic, basswood, SLA resin'}
                              </span>
                            </div>
                            <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                              <span className="text-slate-400 block text-[9px] uppercase">Fabrication Methods</span>
                              <span className="text-white font-semibold truncate block">
                                {editingModel.fabrication_methods || 'Laser Cutting, CNC Milling'}
                              </span>
                            </div>
                            <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                              <span className="text-slate-400 block text-[9px] uppercase">Dimensions</span>
                              <span className="text-white font-semibold">
                                {editingModel.dimensions_cm || '120 x 80 x 45 cm'}
                              </span>
                            </div>
                            <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                              <span className="text-slate-400 block text-[9px] uppercase">Illumination</span>
                              <span className="text-emerald-300 font-semibold truncate block">
                                {editingModel.illumination || '3000K warm LED'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Updates in real-time as you edit</span>
                    <span className="text-cyan-400">ROHA Physical Fabrication Lab</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#0f181b] shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Active Tab: <strong className="text-white uppercase">{modalTab}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="model-form"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>{editingModel.id ? 'Save Changes' : 'Create Model'}</span>
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
                    Modeling Making Categories
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Create, view, and organize model typology tags</p>
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
                Add New Model Category
              </h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category Name (e.g. Masterplan Scale, Topographic, High-Rise)"
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
                          {projectCount} models
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

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Model Project"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete Model"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Asset Picker Modal */}
      <ImagePickerModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        currentValue={editingModel?.cover_image || ''}
        onSelect={(path) => {
          if (editingModel) {
            setEditingModel({ ...editingModel, cover_image: path });
          }
        }}
        title="Select Model Photography"
      />
    </div>
  );
};
