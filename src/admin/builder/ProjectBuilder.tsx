import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  Plus,
  Building2,
  Home as HomeIcon,
  Landmark,
  Ruler,
  Camera,
  Save,
  ExternalLink,
  MapPin,
  Maximize2,
  Layers,
  Compass
} from 'lucide-react';
import {
  api,
  resolveImageUrl,
  type InteriorProjectDetailItem,
  type ModelProjectDetailItem
} from '../../services/api';
import { ToastContainer, type ToastMessage } from '../components/Toast';
import { ImagePickerModal } from '../components/ImagePickerModal';
import GeoButton from '../../components/Buttons';
import type { MaterialSpecimen } from '../../components/MaterialSection';
import { parseMaterialsFromString } from '../../components/MaterialSection';
import { renderSuperscriptText, normalizeSuperscriptInput } from '../../utils/formatters';
import Footer from '../../components/Footer';

// -------------------------------------------------------------
// TYPE DEFINITIONS FOR THE VISUAL EDITORIAL BUILDER
// -------------------------------------------------------------

export type ProjectMode = 'architectural' | 'model';

export interface ProjectImageItem {
  id: string | number;
  url: string;
  caption: string;
  subtitle: string;
  title?: string;
  order: number;
}

export interface StudioProjectData {
  id?: number | string;
  mode: ProjectMode;
  projectNumber: string;
  title: string;
  subtitle: string;
  slug: string;
  category_id?: number;
  category_name: string;
  location: string;
  year: string;
  client: string;
  architect: string;
  status: string;
  hero_description?: string;
  description: string;
  cover_image: string;
  company_logo: string;
  video_url: string;
  heroFocalPoint: { x: number; y: number };
  heroAspectRatio: '21:9' | '16:9';
  area: string;
  floorsOrScale: string;
  style: string;
  material_palette: string;
  lighting_design: string;
  duration: string;
  budget: string;
  materials: MaterialSpecimen[];
  gallery_images: ProjectImageItem[];
  metaTitle: string;
  metaDescription: string;
}

const INITIAL_ARCHITECTURAL_PROJECT: StudioProjectData = {
  mode: 'architectural',
  projectNumber: 'PRJ-084',
  title: 'EMBASSY DIPLOMATIC RESIDENCE',
  subtitle: 'Transforming the Future of Contemporary Living',
  slug: 'embassy-diplomatic-residence',
  category_name: 'Luxury Residential',
  location: 'Addis Ababa, Ethiopia',
  year: '2025',
  client: 'Diplomatic Mission Commission',
  architect: 'ROHA Interior Studio',
  status: 'Completed',
  hero_description: 'A sanctuary of brutalist warmth, monolithic stone, and spatial purity.',
  description:
    'A sanctuary of brutalist warmth and spatial purity. The residence explores the interplay between monolithic volcanic basalt, warm smoked European oak, and continuous soft indirect lighting that choreographs natural movement throughout the day. Every spatial boundary is intentionally blurred to foster seamless transitions between private contemplation and diplomatic entertaining.',
  cover_image: '/confrence1.png',
  company_logo: '',
  video_url: 'https://www.youtube.com/embed/_BZZkFzuLQs',
  heroFocalPoint: { x: 50, y: 50 },
  heroAspectRatio: '21:9',
  area: '450 m²',
  floorsOrScale: '2 Levels',
  style: 'Contemporary Minimalist',
  material_palette: 'Smoked oak, raw travertine, brass joinery, fluted glass',
  lighting_design: 'Indirect warm 2700K LED coves, fluted pendants',
  duration: '14 Months',
  budget: 'Confidential',
  materials: parseMaterialsFromString('Smoked oak, raw travertine, brass joinery, fluted glass'),
  gallery_images: [
    {
      id: 'g-1',
      url: '/confrence1.png',
      title: 'Monolithic Hearth & Lounge',
      subtitle: 'Primary Spatial Perspective',
      caption: 'Monolithic Hearth & Lounge',
      order: 1
    },
    {
      id: 'g-2',
      url: '/confrence2.png',
      title: 'Bespoke Smoked Oak Joinery',
      subtitle: 'Custom Cabinetry Detail',
      caption: 'Bespoke Smoked Oak Joinery',
      order: 2
    }
  ],
  metaTitle: 'Embassy Diplomatic Residence | ROHA Architecture',
  metaDescription: 'Contemporary luxury architectural monograph by ROHA Interior Studio.'
};

const INITIAL_MODEL_PROJECT: StudioProjectData = {
  mode: 'model',
  projectNumber: 'MOD-019',
  title: 'FINANCIAL TOWER URBAN MASSING',
  subtitle: 'Precision Scale Fabrication & Architectural Articulation',
  slug: 'financial-tower-urban-massing',
  category_name: 'Scale Architecture',
  location: 'Financial District, Addis Ababa',
  year: '2025',
  client: 'Commercial Development Bank',
  architect: 'ROHA Model Fabrication Lab',
  status: 'Completed',
  hero_description: 'Precision 1:100 scale architectural monograph and urban massing study.',
  description:
    'A 1:100 scale architectural masterpiece combining laser-cut optical acrylic, high-precision SLA 3D resin printed cores, and hand-finished American basswood massing with internal 3000K micro-illumination.',
  cover_image: '/confrence2.png',
  company_logo: '',
  video_url: 'https://www.youtube.com/embed/_BZZkFzuLQs',
  heroFocalPoint: { x: 50, y: 50 },
  heroAspectRatio: '21:9',
  area: '140 x 95 x 60 cm',
  floorsOrScale: '1:100 Scale',
  style: 'Precision Scale Model',
  material_palette: 'Laser-cut acrylic, basswood, SLA resin 3D print, brass rod joinery',
  lighting_design: 'Integrated 3000K warm LED illumination',
  duration: '4 Weeks',
  budget: 'Standard Fabrication Tier',
  materials: parseMaterialsFromString('Laser-cut acrylic, basswood, SLA resin 3D print, brass rod joinery'),
  gallery_images: [
    {
      id: 'm-1',
      url: '/confrence2.png',
      title: '0.1mm Micro-Louvers & Facade Articulation',
      subtitle: 'Precision Fabrication Detail',
      caption: '0.1mm Micro-Louvers & Facade Articulation',
      order: 1
    }
  ],
  metaTitle: 'Financial Tower Scale Model | ROHA Studio',
  metaDescription: '1:100 architectural scale model monograph and fabrication specifications.'
};

// -------------------------------------------------------------
// MAIN PROJECT BUILDER COMPONENT
// -------------------------------------------------------------

export const ProjectBuilder: React.FC = () => {
  const { type, id } = useParams<{ type?: string; id?: string }>();
  const navigate = useNavigate();

  const isModelMode = type === 'models' || type === 'model';
  const [activeMode, setActiveMode] = useState<ProjectMode>(isModelMode ? 'model' : 'architectural');
  const [project, setProject] = useState<StudioProjectData>(
    isModelMode ? INITIAL_MODEL_PROJECT : INITIAL_ARCHITECTURAL_PROJECT
  );

  // Available projects list for switcher
  const [availableProjects, setAvailableProjects] = useState<Array<{ id: number; title: string; mode: ProjectMode }>>([]);

  // Inspector & Selection State
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [assetPickerTarget, setAssetPickerTarget] = useState<'hero' | 'logo' | 'gallery'>('hero');

  // Preview & Viewport State
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  // Autosave & Feedback
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toastType: 'success' | 'error' | 'info', title: string, message?: string) => {
    const toastId = Date.now().toString();
    setToasts(prev => [...prev, { id: toastId, type: toastType, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 4000);
  };



  // -------------------------------------------------------------
  // FETCH REAL PROJECT FROM BACKEND
  // -------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // Fetch project list for quick switcher
        const [interiors, models] = await Promise.all([
          api.getInteriorProjects().catch(() => []),
          api.getModelProjects().catch(() => [])
        ]);

        if (isMounted) {
          const list: Array<{ id: number; title: string; mode: ProjectMode }> = [
            ...interiors.map(p => ({ id: p.id, title: p.title, mode: 'architectural' as ProjectMode })),
            ...models.map(p => ({ id: p.id, title: p.title, mode: 'model' as ProjectMode }))
          ];
          setAvailableProjects(list);
        }

        // If an ID is given in URL, fetch and populate
        if (id) {
          const numId = Number(id);
          if (isModelMode) {
            const data: ModelProjectDetailItem = await api.getModelProject(numId);
            if (isMounted && data) {
              const matsUsed = data.materials_used || data.specifications?.base_material || '';
              const catName =
                (data.category && typeof data.category === 'object' ? (data.category as any).name : undefined) ||
                data.category_name ||
                'Scale Model';

              setProject({
                id: data.id,
                mode: 'model',
                projectNumber: `MOD-0${data.id}`,
                title: data.title || '',
                subtitle: data.subtitle || 'Precision Fabrication & Scale Model',
                slug: data.slug || '',
                category_name: catName,
                location: data.day || 'Architectural Scale Lab',
                year: data.year || '2025',
                client: data.specifications?.client || 'Enterprise Partner',
                architect: 'ROHA Model Studio',
                status: data.specifications?.status || 'Completed',
                hero_description: data.subtitle || (data.description ? data.description.slice(0, 110) + '...' : ''),
                description: data.description || '',
                cover_image: data.cover_image || '/confrence2.png',
                company_logo: data.company_logo || '',
                video_url: data.video_url || '',
                heroFocalPoint: { x: 50, y: 50 },
                heroAspectRatio: '21:9',
                area: data.dimensions_cm || '120 x 80 x 45 cm',
                floorsOrScale: data.scale_ratio || '1:50',
                style: catName,
                material_palette: matsUsed,
                lighting_design: data.illumination || 'Integrated 3000K warm LED',
                duration: data.specifications?.lead_time || '3 - 4 weeks',
                budget: 'Standard',
                materials: parseMaterialsFromString(matsUsed),
                gallery_images: (data.gallery_images || []).map((g, idx) => ({
                  id: g.id || idx,
                  url: g.image,
                  title: g.caption || '',
                  caption: g.caption || '',
                  subtitle: g.subtitle || 'Fabrication Detail',
                  order: g.order || idx + 1
                })),
                metaTitle: `${data.title} | ROHA Scale Models`,
                metaDescription: data.description?.slice(0, 150) || ''
              });
            }
          } else {
            // Interior project
            const data: InteriorProjectDetailItem = await api.getInteriorProject(numId);
            if (isMounted && data) {
              const matPal = data.specifications?.material_palette || '';
              const catObj = data.category as any;
              const catId =
                (catObj && typeof catObj === 'object' ? catObj.id : undefined) ||
                (typeof data.category === 'number' ? data.category : undefined) ||
                data.category_id;
              const catName =
                (catObj && typeof catObj === 'object' ? catObj.name : undefined) ||
                data.category_name ||
                'Luxury Interior';

              setProject({
                id: data.id,
                mode: 'architectural',
                projectNumber: `PRJ-0${data.id}`,
                title: data.title || '',
                subtitle: data.subtitle || 'Transforming the Future of Contemporary Living',
                slug: data.slug || '',
                category_id: catId,
                category_name: catName,
                location: data.location || 'Addis Ababa, Ethiopia',
                year: data.year || '2025',
                client: data.specifications?.client || 'Private Residence',
                architect: data.specifications?.architect || 'ROHA Interior Studio',
                status: data.specifications?.status || 'Completed',
                hero_description: data.subtitle || (data.description ? data.description.slice(0, 110) + '...' : ''),
                description: data.description || '',
                cover_image: data.cover_image || '/confrence1.png',
                company_logo: data.company_logo || '',
                video_url: data.video_url || '',
                heroFocalPoint: { x: 50, y: 50 },
                heroAspectRatio: '21:9',
                area: data.specifications?.area || '450 m²',
                floorsOrScale: data.specifications?.floors ? `${data.specifications.floors} Levels` : '1 Level',
                style: data.specifications?.style || 'Contemporary Minimalist',
                material_palette: matPal,
                lighting_design: data.specifications?.lighting_design || 'Indirect warm 2700K LED coves',
                duration: data.specifications?.duration || '12 Months',
                budget: data.specifications?.budget || 'Confidential',
                materials: parseMaterialsFromString(matPal),
                gallery_images: (data.gallery_images || []).map((g, idx) => ({
                  id: g.id || idx,
                  url: g.image,
                  title: g.caption || '',
                  caption: g.caption || '',
                  subtitle: g.subtitle || 'Spatial Perspective',
                  order: g.order || idx + 1
                })),
                metaTitle: `${data.title} | ROHA Interior Studio`,
                metaDescription: data.description?.slice(0, 150) || ''
              });
            }
          }
        }
      } catch (err: any) {
        console.error('Failed to load project into builder', err);
        addToast('error', 'Failed to load project', err.message);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id, type, isModelMode]);

  // -------------------------------------------------------------
  // SAVE / PUBLISH HANDLER (BACKEND INTEGRATION)
  // -------------------------------------------------------------
  const handleSaveToBackend = async () => {
    try {
      setSaveStatus('saving');

      // Generate palette string from specimens
      const paletteString = project.materials.map(m => m.name).join(', ') || project.material_palette;

      // Map gallery images to format backend expects
      const galleryPayload = project.gallery_images.map((g, idx) => ({
        id: typeof g.id === 'number' ? g.id : undefined,
        image: g.url,
        caption: g.caption || g.title || '',
        subtitle: g.subtitle || 'Spatial Perspective',
        order: idx + 1
      }));

      if (project.mode === 'model') {
        const payload: any = {
          title: project.title,
          subtitle: project.subtitle,
          materials_used: paletteString,
          description: project.description,
          cover_image: project.cover_image,
          company_logo: project.company_logo || null,
          video_url: project.video_url,
          scale_ratio: project.floorsOrScale,
          year: project.year,
          day: project.location,
          dimensions_cm: project.area,
          illumination: project.lighting_design,
          specifications: {
            scale: project.floorsOrScale,
            tolerance: '0.1mm',
            base_material: paletteString,
            finish: project.style,
            lead_time: project.duration,
            client: project.client,
            status: project.status
          },
          gallery_images: galleryPayload
        };

        if (project.id) {
          const updated = await api.updateModelProject(Number(project.id), payload);
          setProject(prev => ({ ...prev, id: updated.id }));
          addToast('success', 'Published to Backend', `Scale Model #${updated.id} published successfully.`);
        } else {
          const created = await api.createModelProject(payload);
          setProject(prev => ({ ...prev, id: created.id }));
          navigate(`/admin/builder/model/${created.id}`, { replace: true });
          addToast('success', 'Created & Published', `New Scale Model #${created.id} created.`);
        }
      } else {
        // Interior Project
        const floorsNum = parseInt(project.floorsOrScale.replace(/\D/g, '')) || 1;
        const payload: any = {
          title: project.title,
          subtitle: project.subtitle,
          location: project.location,
          year: project.year,
          description: project.description,
          cover_image: project.cover_image,
          company_logo: project.company_logo || null,
          video_url: project.video_url,
          category_id: project.category_id,
          specifications: {
            area: project.area,
            floors: floorsNum,
            style: project.style,
            material_palette: paletteString,
            lighting_design: project.lighting_design,
            duration: project.duration,
            budget: project.budget,
            architect: project.architect,
            client: project.client,
            status: project.status
          },
          gallery_images: galleryPayload
        };

        if (project.id) {
          const updated = await api.updateInteriorProject(Number(project.id), payload);
          setProject(prev => ({ ...prev, id: updated.id }));
          addToast('success', 'Published to Backend', `Interior Project #${updated.id} published successfully.`);
        } else {
          const created = await api.createInteriorProject(payload);
          setProject(prev => ({ ...prev, id: created.id }));
          navigate(`/admin/builder/interior/${created.id}`, { replace: true });
          addToast('success', 'Created & Published', `New Interior Project #${created.id} created.`);
        }
      }

      setSaveStatus('saved');
    } catch (err: any) {
      setSaveStatus('unsaved');
      console.error('Failed to save project to backend', err);
      addToast('error', 'Publish Failed', err.message || 'Check database connection.');
    }
  };

  // Helper to start fresh new project
  const handleCreateNewProject = (targetMode?: ProjectMode) => {
    const selectedMode = targetMode || activeMode;
    if (selectedMode === 'model') {
      setProject({
        ...INITIAL_MODEL_PROJECT,
        id: undefined,
        title: 'NEW PHYSICAL SCALE MODEL',
        subtitle: 'Precision Fabrication & Scale Monograph',
        projectNumber: `MOD-${String(Date.now()).slice(-3)}`,
        slug: `new-scale-model-${Date.now()}`
      });
    } else {
      setProject({
        ...INITIAL_ARCHITECTURAL_PROJECT,
        id: undefined,
        title: 'NEW ARCHITECTURAL PROJECT',
        subtitle: 'Spatial Experience & Contemporary Design',
        projectNumber: `PRJ-${String(Date.now()).slice(-3)}`,
        slug: `new-interior-project-${Date.now()}`
      });
    }
    navigate(`/admin/builder/${selectedMode}`, { replace: true });
    addToast('info', 'New Project Draft', 'Ready to build a new project. Edit titles, specs, photos and click "Create & Publish".');
  };

  // Helper to switch mode
  const handleSwitchMode = (newMode: ProjectMode) => {
    setActiveMode(newMode);
    handleCreateNewProject(newMode);
  };

  // Image Vault selection
  const handleSelectAsset = (url: string) => {
    if (assetPickerTarget === 'hero') {
      setProject(p => ({ ...p, cover_image: url }));
      addToast('success', 'Cover Photo Updated');
    } else if (assetPickerTarget === 'logo') {
      setProject(p => ({ ...p, company_logo: url }));
      addToast('success', 'Client Logo Updated');
    } else if (assetPickerTarget === 'gallery') {
      const newImg: ProjectImageItem = {
        id: `g-${Date.now()}`,
        url,
        title: 'Architectural Perspective',
        caption: 'Architectural Perspective',
        subtitle: 'Spatial Detail',
        order: project.gallery_images.length + 1
      };
      setProject(p => ({ ...p, gallery_images: [...p.gallery_images, newImg] }));
      addToast('success', 'Added to Perspectives Gallery');
    }
    setIsAssetPickerOpen(false);
  };

  // -------------------------------------------------------------
  // COMPUTED DYNAMIC DATA
  // -------------------------------------------------------------
  const heroImageSrc = resolveImageUrl(project.cover_image, '/confrence1.png');
  const resolvedLogo = resolveImageUrl(project.company_logo, '/roha.png');
  const clientName = project.client || 'ROHA Studio';

  const dynamicTags = [
    { icon: Building2, name: project.category_name || 'Luxury' },
    { icon: HomeIcon, name: project.style || project.floorsOrScale || 'Architectural' },
    { icon: Landmark, name: project.status || 'Completed' }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none antialiased">
      <ToastContainer toasts={toasts} onDismiss={(toastId: string) => setToasts(t => t.filter(x => x.id !== toastId))} />

      {/* -------------------- 01. STUDIO TOP COMMAND BAR -------------------- */}
      <header className="h-16 bg-[#172a2b] border-b border-white/20 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50 shadow-2xl backdrop-blur-xl">
        {/* Left: Return, Identity, Mode Switcher & New Project Action */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <Link
            to={activeMode === 'model' ? '/admin/models' : '/admin/interior'}
            className="p-2 rounded-xl bg-black/40 border border-white/20 text-slate-300 hover:text-white hover:bg-black/60 transition-colors"
            title="Return to Catalog"
          >
            <ArrowLeft size={16} />
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-display font-black text-sm tracking-widest text-cyan-300">
              ROHA STUDIO
            </span>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-xs font-mono uppercase text-slate-300 font-bold hidden sm:inline">
              Visual Workspace
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/20">
            <button
              onClick={() => handleSwitchMode('architectural')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeMode === 'architectural'
                  ? 'bg-[#205b63] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 size={13} />
              <span>Architectural</span>
            </button>
            <button
              onClick={() => handleSwitchMode('model')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeMode === 'model'
                  ? 'bg-[#205b63] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Ruler size={13} />
              <span>Scale Model</span>
            </button>
          </div>

          {/* "+ New Project" Button */}
          <button
            onClick={() => handleCreateNewProject()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer border border-emerald-400/40 shrink-0"
            title="Start creating a brand new project in the Studio"
          >
            <Plus size={14} className="stroke-[3]" />
            <span>New Project</span>
          </button>

          {/* Project Switcher Dropdown */}
          {availableProjects.length > 0 && (
            <div className="relative hidden md:block">
              <select
                value={project.id || ''}
                onChange={e => {
                  const targetId = e.target.value;
                  if (targetId === '__NEW__') {
                    handleCreateNewProject();
                  } else if (targetId) {
                    navigate(`/admin/builder/${activeMode}/${targetId}`);
                  }
                }}
                className="text-xs font-mono bg-black/50 border border-white/20 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="">Switch Project ({availableProjects.filter(p => p.mode === activeMode).length})</option>
                <option value="__NEW__" className="text-emerald-400 font-bold bg-[#172a2b]">
                  ＋ Create New Project...
                </option>
                {availableProjects
                  .filter(p => p.mode === activeMode)
                  .map(p => (
                    <option key={p.id} value={p.id} className="bg-[#172a2b]">
                      #{p.id} - {p.title}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: Public URL Link, Preview & Publish */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Public Page Direct Link (if project has ID) */}
          {project.id && (
            <a
              href={`/project-detail?id=${project.id}&type=${activeMode === 'model' ? 'model' : 'interior'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-mono font-bold uppercase transition-colors border border-white/15"
              title="View on Public Frontend"
            >
              <ExternalLink size={13} />
              <span>Public URL</span>
            </a>
          )}

          {/* Live Preview Button (⌘P) */}
          <button
            onClick={() => setIsPreviewActive(prev => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-sm ${
              isPreviewActive
                ? 'bg-white text-[#172a2b] border-white'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-cyan-300'
            }`}
            title="Toggle Live Website Preview Simulator (⌘P)"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">{isPreviewActive ? 'Exit Preview' : 'Live Preview'}</span>
          </button>

          {/* Save / Publish to Live Backend */}
          <button
            onClick={handleSaveToBackend}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-[#205b63] hover:from-cyan-500 hover:to-[#172a2b] text-white text-xs font-mono font-bold uppercase transition-all shadow-lg cursor-pointer border border-cyan-400/40"
          >
            <Save size={14} />
            <span>
              {saveStatus === 'saving'
                ? 'Publishing...'
                : project.id
                ? 'Update & Publish'
                : 'Create & Publish'}
            </span>
          </button>
        </div>
      </header>

      {/* -------------------- 02. MAIN VISUAL COMPOSITION WORKSPACE -------------------- */}
      <main className="flex-1 overflow-y-auto">
        {/* Banner Alert: Studio Building Mode */}
        {!isPreviewActive && (
          <div className="bg-[#172a2b]/95 border-b border-cyan-500/20 px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-mono text-cyan-200 sticky top-0 z-40">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`w-2 h-2 rounded-full ${project.id ? 'bg-cyan-400' : 'bg-emerald-400'} animate-pulse`} />
              <span className="font-bold text-white">
                {project.id ? `EDITING PROJECT #${project.id}` : 'CREATING NEW PROJECT DRAFT'}
              </span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <span className="text-slate-300 hidden md:inline">Live interactive layout matching public detail page</span>
            </div>

            <div className="flex items-center gap-3">
              {!project.id ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  Draft Mode (Unsaved)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  Published Project #{project.id}
                </span>
              )}
              {project.id && (
                <button
                  onClick={() => handleCreateNewProject()}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white underline cursor-pointer"
                >
                  <Plus size={11} />
                  <span>New Project</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* -------------------- HERO SECTION (EXACT REPLICA OF PROJECT-DETAIL) -------------------- */}
        <section className="relative min-h-[92vh] sm:h-screen w-full bg-gradient-to-t from-[#f5f7f7] to-[#172a2b] overflow-hidden flex items-center justify-center">
          {/* Background Watermark Silhouette */}
          <div className="absolute w-full md:bottom-0 top-60 scale-105 opacity-10 pointer-events-none flex justify-center">
            <img src={heroImageSrc} alt="" className="w-full max-h-[85vh] object-contain filter blur-[1px]" />
          </div>

          {/* Glassy Background Layer */}
          <div className="absolute inset-0 bg-radial from-white/5 to-transparent z-0" />

          <div className="flex w-full h-full px-6 sm:px-10 flex-col relative z-10">
            {/* Header: Client Badge + Subtitle + Big Monograph Title */}
            <div className="flex flex-col items-center text-white pt-8 sm:pt-10 h-1/2 select-none text-center">
              {/* Commissioned Client / Partner Badge */}
              <div className="group relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 shadow-md mb-3">
                <img src={resolvedLogo} alt="" className="w-5 h-5 object-contain rounded-sm" />
                <input
                  type="text"
                  value={project.client}
                  onChange={e => setProject(p => ({ ...p, client: e.target.value }))}
                  placeholder="Commissioned Partner"
                  className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-cyan-200 uppercase bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none text-center"
                />
                {!isPreviewActive && (
                  <button
                    onClick={() => {
                      setAssetPickerTarget('logo');
                      setIsAssetPickerOpen(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-amber-300 underline ml-2"
                  >
                    Change Logo
                  </button>
                )}
              </div>

              {/* Subtitle Input */}
              <input
                type="text"
                value={project.subtitle}
                onChange={e => setProject(p => ({ ...p, subtitle: e.target.value }))}
                placeholder="SUBTITLE / PHILOSOPHY STATEMENT"
                className="text-xs sm:text-sm md:text-xl font-light tracking-[0.3em] sm:tracking-[0.4em] uppercase opacity-80 mb-2 text-cyan-200 bg-transparent border-b border-transparent hover:border-white/30 focus:border-cyan-300 focus:outline-none text-center w-full max-w-2xl px-2"
              />

              {/* Huge Monograph Title */}
              <input
                type="text"
                value={project.title}
                onChange={e => setProject(p => ({ ...p, title: e.target.value.toUpperCase() }))}
                placeholder="PROJECT TITLE"
                className="text-[10vw] sm:text-[11.5vw] font-black tracking-tighter md:relative absolute top-64 md:top-24 leading-none opacity-40 uppercase truncate max-w-full px-4 text-center bg-transparent border-b border-transparent hover:border-white/30 focus:border-cyan-300 focus:outline-none"
              />
            </div>

            {/* Interactive Layer (Middle and Sides) */}
            <div className="flex flex-row h-2/3 relative -mt-20">
              {/* LEFT SIDE: Call to Action + Hero Statement */}
              <div className="hidden md:flex flex-col items-start w-[25%] justify-center text-white z-30">
                <div className="flex items-center justify-between mb-1 w-full max-w-[280px]">
                  <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold tracking-wider">
                    Hero Description (Above "Get Started")
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mb-1.5 leading-snug">
                  Concise elevator CTA statement above button.
                </p>
                <textarea
                  rows={3}
                  value={project.hero_description !== undefined ? project.hero_description : (project.subtitle || 'Start building your bespoke architectural vision with us today.')}
                  onChange={e => {
                    const val = normalizeSuperscriptInput(e.target.value);
                    setProject(p => ({ ...p, hero_description: val }));
                  }}
                  placeholder="Concise elevator statement above Get Started button..."
                  className="w-full text-sm sm:text-base font-medium leading-relaxed text-slate-100 font-sans mb-3 max-w-[280px] drop-shadow-md bg-black/40 p-2.5 rounded-xl border border-white/20 focus:outline-none focus:border-cyan-300 resize-none shadow-inner"
                />
                <GeoButton label="Get Started" from="f0f0f0" to="1d424b" />
              </div>

              {/* MIDDLE: THE FLOATING HERO IMAGE */}
              <div className="md:w-[50%] w-full relative z-20 flex justify-center">
                <div className="absolute md:-top-40 -top-32 h-[130%] w-full flex justify-center items-center group">
                  <img
                    src={heroImageSrc}
                    alt={project.title}
                    className="h-full object-contain md:scale-100 scale-125 drop-shadow-[0_35px_35px_rgba(0,0,0,0.55)] transition-all duration-700 group-hover:scale-103"
                  />

                  {/* Change Cover Photo Trigger */}
                  {!isPreviewActive && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center gap-3 backdrop-blur-xs">
                      <button
                        onClick={() => {
                          setAssetPickerTarget('hero');
                          setIsAssetPickerOpen(true);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-white text-[#172a2b] text-xs font-mono font-bold uppercase shadow-2xl hover:bg-slate-200 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Camera size={14} />
                        <span>Change Cover Photo</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE: GLASSY TAGS */}
              <div className="hidden md:flex flex-col items-end w-[25%] justify-center gap-4 z-30">
                {/* Typology Tag */}
                <div className="flex items-center gap-4 py-3 px-6 rounded-full bg-black/35 backdrop-blur-xl border border-white/20 hover:bg-white/10 transition-all cursor-pointer group shadow-lg">
                  <Building2 size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <input
                    type="text"
                    value={project.category_name}
                    onChange={e => {
                      const val = normalizeSuperscriptInput(e.target.value);
                      setProject(p => ({ ...p, category_name: val }));
                    }}
                    placeholder="Typology"
                    className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none text-right max-w-[140px]"
                  />
                </div>

                {/* Style / Scale Tag */}
                <div className="flex items-center gap-4 py-3 px-6 rounded-full bg-black/35 backdrop-blur-xl border border-white/20 hover:bg-white/10 transition-all cursor-pointer group shadow-lg">
                  <HomeIcon size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <input
                    type="text"
                    value={project.style}
                    onChange={e => {
                      const val = normalizeSuperscriptInput(e.target.value);
                      setProject(p => ({ ...p, style: val }));
                    }}
                    placeholder="Style"
                    className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none text-right max-w-[140px]"
                  />
                </div>

                {/* Status Tag */}
                <div className="flex items-center gap-4 py-3 px-6 rounded-full bg-black/35 backdrop-blur-xl border border-white/20 hover:bg-white/10 transition-all cursor-pointer group shadow-lg">
                  <Landmark size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <select
                    value={project.status}
                    onChange={e => setProject(p => ({ ...p, status: e.target.value }))}
                    className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="Completed" className="bg-[#172a2b]">Completed</option>
                    <option value="In Progress" className="bg-[#172a2b]">In Progress</option>
                    <option value="Concept" className="bg-[#172a2b]">Concept</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MOBILE VERSION: Stacking */}
            <div className="flex flex-col md:hidden mt-6 px-4 gap-6 z-30 pb-6">
              <div className="flex flex-col items-center text-center">
                <p className="text-sm font-medium mb-4 leading-tight text-slate-100 drop-shadow-md w-full max-w-xs">
                  {project.hero_description
                    ? renderSuperscriptText(project.hero_description)
                    : (project.description ? renderSuperscriptText(project.description.slice(0, 85) + '...') : 'Start building your bespoke architectural vision with us today.')}
                </p>
                <GeoButton label="Get Started" from="f0f0f0" to="1d424b" />
              </div>

              <div className="flex flex-wrap justify-center gap-2.5">
                {dynamicTags.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 py-2 px-4 rounded-full bg-black/35 backdrop-blur-xl border border-white/20"
                    >
                      <Icon size={15} className="text-amber-400" />
                      <span className="text-white text-xs font-bold uppercase tracking-widest">
                        {renderSuperscriptText(item.name)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* -------------------- OVERVIEW & ARCHITECTURAL SPECS SECTION (EXACT MATCH) -------------------- */}
        <section className="w-full bg-gradient-to-b from-[#172a2b] via-[#1d424b] to-[#f5f7f7] py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-20 text-white contour-one">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="border-b border-white/20 pb-8 sm:pb-10 md:pb-12 mb-8 sm:mb-10 md:mb-12">
              <input
                type="text"
                value={project.subtitle}
                onChange={e => {
                  const val = normalizeSuperscriptInput(e.target.value);
                  setProject(p => ({ ...p, subtitle: val }));
                }}
                className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold text-cyan-300 mb-3 sm:mb-4 bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
              />
              <input
                type="text"
                value={project.title}
                onChange={e => setProject(p => ({ ...p, title: e.target.value.toUpperCase() }))}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase italic bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full text-white"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-12 md:gap-16">
              {/* Narrative Content */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-cyan-300 font-bold tracking-widest">
                    Overview Narrative (Beside Technical Specifications)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Architectural Narrative & Spatial Philosophy</span>
                </div>
                <textarea
                  rows={6}
                  value={project.description}
                  onChange={e => setProject(p => ({ ...p, description: e.target.value }))}
                  placeholder="Comprehensive architectural overview and spatial curation philosophy..."
                  className="w-full text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-tight text-slate-50 italic bg-black/20 p-4 sm:p-6 rounded-2xl border border-white/20 focus:outline-none focus:border-cyan-300 resize-none shadow-inner"
                />
              </div>

              {/* Technical Specifications Glass Card */}
              <div className="relative bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex flex-col justify-between">
                <div className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent" />

                <div>
                  <div className="flex items-center justify-between border-b border-white/20 pb-3 sm:pb-4 mb-6 sm:mb-8">
                    <h4 className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-black text-cyan-300">
                      Architectural Specifications
                    </h4>
                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-sm">
                      <img src={resolvedLogo} alt="" className="w-5 h-5 object-contain" />
                      <span className="text-[9px] font-mono uppercase text-slate-300 font-bold">
                        {clientName}
                      </span>
                    </div>
                  </div>

                  <ul className="relative space-y-5 sm:space-y-6">
                    {/* Location */}
                    <li className="flex items-start gap-3 sm:gap-4">
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/30 shrink-0">
                        <MapPin size={16} className="text-cyan-200" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-300">
                          Location
                        </p>
                        <input
                          type="text"
                          value={project.location}
                          onChange={e => {
                            const val = normalizeSuperscriptInput(e.target.value);
                            setProject(p => ({ ...p, location: val }));
                          }}
                          className="text-sm sm:text-base font-bold tracking-tight text-white bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
                        />
                      </div>
                    </li>

                    {/* Spatial Area (with Superscript Support) */}
                    <li className="flex items-start gap-3 sm:gap-4">
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/30 shrink-0">
                        <Maximize2 size={16} className="text-cyan-200" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-300">
                            Spatial Area / Dimensions
                          </p>
                          {/* Quick Superscript Badges */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setProject(p => ({ ...p, area: (p.area || '').trim() + ' m²' }))}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/20 cursor-pointer"
                              title="Insert m²"
                            >
                              +m²
                            </button>
                            <button
                              type="button"
                              onClick={() => setProject(p => ({ ...p, area: (p.area || '').trim() + ' ft²' }))}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/20 cursor-pointer"
                              title="Insert ft²"
                            >
                              +ft²
                            </button>
                            <button
                              type="button"
                              onClick={() => setProject(p => ({ ...p, area: (p.area || '').trim() + '²' }))}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/20 cursor-pointer"
                              title="Insert ² (superscript 2)"
                            >
                              +²
                            </button>
                            <button
                              type="button"
                              onClick={() => setProject(p => ({ ...p, area: (p.area || '').trim() + '³' }))}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/20 cursor-pointer"
                              title="Insert ³ (superscript 3)"
                            >
                              +³
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={project.area}
                          onChange={e => {
                            const val = normalizeSuperscriptInput(e.target.value);
                            setProject(p => ({ ...p, area: val }));
                          }}
                          onBlur={e => {
                            const val = normalizeSuperscriptInput(e.target.value);
                            setProject(p => ({ ...p, area: val }));
                          }}
                          placeholder="e.g. 450 m² or 120 x 80 x 45 cm"
                          className="text-sm sm:text-base font-bold tracking-tight text-white bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
                        />
                        {project.area && (
                          <span className="text-[10px] font-mono text-cyan-300 block mt-0.5 opacity-80">
                            Preview: {renderSuperscriptText(project.area)}
                          </span>
                        )}
                      </div>
                    </li>

                    {/* Scale / Levels */}
                    <li className="flex items-start gap-3 sm:gap-4">
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/30 shrink-0">
                        <Layers size={16} className="text-cyan-200" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-300">
                            Scale / Levels
                          </p>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setProject(p => ({ ...p, floorsOrScale: '1:50' }))}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/20 cursor-pointer"
                              title="Set 1:50"
                            >
                              1:50
                            </button>
                            <button
                              type="button"
                              onClick={() => setProject(p => ({ ...p, floorsOrScale: '1:100' }))}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/20 cursor-pointer"
                              title="Set 1:100"
                            >
                              1:100
                            </button>
                            <button
                              type="button"
                              onClick={() => setProject(p => ({ ...p, floorsOrScale: (p.floorsOrScale || '').trim() + '²' }))}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/20 cursor-pointer"
                              title="Insert ²"
                            >
                              +²
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={project.floorsOrScale}
                          onChange={e => {
                            const val = normalizeSuperscriptInput(e.target.value);
                            setProject(p => ({ ...p, floorsOrScale: val }));
                          }}
                          className="text-sm sm:text-base font-bold tracking-tight text-white bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
                        />
                        {project.floorsOrScale && (
                          <span className="text-[10px] font-mono text-cyan-300 block mt-0.5 opacity-80">
                            Preview: {renderSuperscriptText(project.floorsOrScale)}
                          </span>
                        )}
                      </div>
                    </li>

                    {/* Project Year */}
                    <li className="flex items-start gap-3 sm:gap-4">
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/30 shrink-0">
                        <Ruler size={16} className="text-cyan-200" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-300">
                          Project Year
                        </p>
                        <input
                          type="text"
                          value={project.year}
                          onChange={e => {
                            const val = normalizeSuperscriptInput(e.target.value);
                            setProject(p => ({ ...p, year: val }));
                          }}
                          className="text-sm sm:text-base font-bold tracking-tight text-white bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
                        />
                      </div>
                    </li>

                    {/* Materiality Summary */}
                    <li className="flex items-start gap-3 sm:gap-4">
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/30 shrink-0">
                        <Compass size={16} className="text-cyan-200" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-300">
                          Materiality
                        </p>
                        <input
                          type="text"
                          value={project.material_palette}
                          onChange={e => {
                            const val = normalizeSuperscriptInput(e.target.value);
                            setProject(p => ({ ...p, material_palette: val }));
                          }}
                          className="text-sm sm:text-base font-bold tracking-tight text-white bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
                        />
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="relative mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-cyan-200">
                  <span>STYLE: {project.style}</span>
                  <span className="text-[#d4af37] font-bold">{project.status}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------- CURATED ARCHITECTURAL PERSPECTIVES (PARALLAX GRID) -------------------- */}
        <section className="w-full bg-[#f0f0f0] py-0 relative overflow-hidden">
          <div className="absolute bg-gradient-to-b from-[#f0f0f0] from-35% h-48 sm:h-72 md:h-96 top-0 inset-0 z-10 pointer-events-none" />

          {/* Section Headline */}
          <div className="w-full px-6 sm:px-10 md:px-16 pt-16 pb-10 relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#205b63] font-bold">
                  VISUAL ARCHIVE // SPATIAL PERSPECTIVES
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#172a2b] uppercase tracking-tight">
                Curated Architectural Perspectives
              </h3>
            </div>

            {!isPreviewActive && (
              <button
                onClick={() => {
                  setAssetPickerTarget('gallery');
                  setIsAssetPickerOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#172a2b] hover:bg-[#205b63] text-white text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus size={14} />
                <span>Add Perspective Photo</span>
              </button>
            )}
          </div>

          {/* Full-Screen Edge-to-Edge Parallax Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 w-full relative z-20 border-t border-slate-300">
            {project.gallery_images.map((item, index) => (
              <div
                key={item.id || index}
                className="relative h-[70vh] sm:h-[80vh] md:h-screen w-full overflow-hidden group border-b border-r border-slate-300/40 bg-slate-950 flex flex-col justify-end"
              >
                {/* Photo Layer */}
                <img
                  src={resolveImageUrl(item.url)}
                  alt={item.caption || 'Architectural Perspective'}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Glassy Floating Caption Layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-16 z-20">
                  {isPreviewActive ? (
                    <>
                      {item.subtitle?.trim() && (
                        <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-cyan-300 mb-2 drop-shadow">
                          {item.subtitle.trim()}
                        </span>
                      )}
                      {(item.caption?.trim() || item.title?.trim()) && (
                        <h4 className="text-xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">
                          {(item.caption || item.title || '').trim()}
                        </h4>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.subtitle}
                        onChange={e => {
                          const val = e.target.value;
                          setProject(p => ({
                            ...p,
                            gallery_images: p.gallery_images.map((g, i) =>
                              i === index ? { ...g, subtitle: val } : g
                            )
                          }));
                        }}
                        placeholder="Perspective Subtitle"
                        className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-cyan-300 bg-black/40 px-3 py-1 rounded-lg border border-white/20 focus:outline-none focus:border-cyan-300 w-full"
                      />

                      <input
                        type="text"
                        value={item.caption || item.title || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setProject(p => ({
                            ...p,
                            gallery_images: p.gallery_images.map((g, i) =>
                              i === index ? { ...g, caption: val, title: val } : g
                            )
                          }));
                        }}
                        placeholder="Perspective View Title"
                        className="text-xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight bg-black/40 px-3 py-1.5 rounded-lg border border-white/20 focus:outline-none focus:border-cyan-300 w-full"
                      />

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => {
                            setProject(p => ({
                              ...p,
                              gallery_images: p.gallery_images.filter((_, i) => i !== index)
                            }));
                            addToast('info', 'Photo Removed');
                          }}
                          className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-mono font-bold uppercase transition-colors"
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------- CINEMATIC VIDEO DOCUMENTATION -------------------- */}
        <section className="w-full bg-[#f0f0f0] px-4 sm:px-8 md:px-16 py-16 sm:py-20 md:py-28 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#d4af37] font-bold">
                  CINEMATIC DOCUMENTATION
                </span>
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#172a2b] uppercase tracking-tight mt-1">
                  Design, Fabrication & Spatial Flow
                </h4>
              </div>

              {!isPreviewActive && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={project.video_url}
                    onChange={e => setProject(p => ({ ...p, video_url: e.target.value }))}
                    placeholder="YouTube or MP4 embed URL"
                    className="text-xs font-mono p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 w-80 focus:outline-none focus:border-[#205b63]"
                  />
                </div>
              )}
            </div>

            <div className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-300/80 bg-black">
              {project.video_url ? (
                <iframe
                  className="w-full h-full rounded-2xl sm:rounded-3xl"
                  src={project.video_url.replace('watch?v=', 'embed/')}
                  title="Architectural Video"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-xs">
                  Enter a YouTube or video embed URL above to display cinematic architectural footage.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* -------------------- STUDIO FOOTER -------------------- */}
        <Footer />
      </main>

      {/* -------------------- ASSET PICKER MODAL (DAM) -------------------- */}
      <ImagePickerModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        onSelect={handleSelectAsset}
      />
    </div>
  );
};

export default ProjectBuilder;
