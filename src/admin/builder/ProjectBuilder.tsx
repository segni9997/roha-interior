import React, { useState, useEffect, useRef } from 'react';
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
  Compass,
  Armchair,
  Star,
  Shield,
  Play,
  ArrowRight,
  UploadCloud,
  Loader2,
  Check,
  Tag,
  X
} from 'lucide-react';
import {
  api,
  resolveImageUrl,
  type CategoryItem,
  type InteriorProjectDetailItem,
  type ModelProjectDetailItem
} from '../../services/api';
import { ToastContainer, type ToastMessage } from '../components/Toast';
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
  category_ids?: number[];
  category_names?: string[];
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
      subtitle: '',
      caption: 'Monolithic Hearth & Lounge',
      order: 1
    },
    {
      id: 'g-2',
      url: '/confrence2.png',
      title: 'Bespoke Smoked Oak Joinery',
      subtitle: '',
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
      subtitle: '',
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

  // Preview & Viewport State
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  // Autosave & Feedback
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Direct computer file upload refs (supporting multi-image selection)
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; filename: string; percent: number } | null>(null);

  // Active slide index for hero slider
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Available categories for current mode & inline creation state
  const [availableCats, setAvailableCats] = useState<CategoryItem[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

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
        const [interiors, models, intCats, modCats] = await Promise.all([
          api.getInteriorProjects().catch(() => []),
          api.getModelProjects().catch(() => []),
          api.getInteriorCategories().catch(() => []),
          api.getModelCategories().catch(() => [])
        ]);

        if (isMounted) {
          const list: Array<{ id: number; title: string; mode: ProjectMode }> = [
            ...interiors.map(p => ({ id: p.id, title: p.title, mode: 'architectural' as ProjectMode })),
            ...models.map(p => ({ id: p.id, title: p.title, mode: 'model' as ProjectMode }))
          ];
          setAvailableProjects(list);
          setAvailableCats(isModelMode ? modCats : intCats);
        }

        if (id) {
          const numId = Number(id);
          if (isModelMode) {
            const data: ModelProjectDetailItem = await api.getModelProject(numId);
            if (isMounted && data) {
              const matsUsed = data.materials_used || data.specifications?.base_material || '';
              const catNames = data.category_names && data.category_names.length > 0
                ? data.category_names
                : [(data.category && typeof data.category === 'object' ? (data.category as any).name : undefined) || data.category_name || 'Scale Model'];
              const catIds = data.category_ids && data.category_ids.length > 0
                ? data.category_ids
                : (data.categories && data.categories.length > 0
                    ? data.categories.map((c: any) => c.id)
                    : (data.category_id ? [data.category_id] : (typeof data.category === 'number' ? [data.category] : [])));

              setProject({
                id: data.id,
                mode: 'model',
                projectNumber: `MOD-0${data.id}`,
                title: data.title || '',
                subtitle: data.subtitle || '',
                slug: data.slug || '',
                category_id: catIds[0],
                category_ids: catIds,
                category_names: catNames,
                category_name: catNames.join(', '),
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
                style: catNames[0] || 'Scale Model',
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
                  subtitle: g.subtitle || '',
                  order: g.order || idx + 1
                })),
                metaTitle: `${data.title} | ROHA Scale Models`,
                metaDescription: data.description?.slice(0, 150) || ''
              });
            }
          } else {
            const data: InteriorProjectDetailItem = await api.getInteriorProject(numId);
            if (isMounted && data) {
              const matPal = data.specifications?.material_palette || '';
              const catObj = data.category as any;
              const catId =
                (catObj && typeof catObj === 'object' ? catObj.id : undefined) ||
                (typeof data.category === 'number' ? data.category : undefined) ||
                data.category_id;
              const catNames = data.category_names && data.category_names.length > 0
                ? data.category_names
                : [(catObj && typeof catObj === 'object' ? catObj.name : undefined) || data.category_name || 'Luxury Interior'];
              const catIds = data.category_ids && data.category_ids.length > 0
                ? data.category_ids
                : (data.categories && data.categories.length > 0
                    ? data.categories.map((c: any) => c.id)
                    : (catId ? [catId] : []));

              setProject({
                id: data.id,
                mode: 'architectural',
                projectNumber: `PRJ-0${data.id}`,
                title: data.title || '',
                subtitle: data.subtitle || '',
                slug: data.slug || '',
                category_id: catIds[0],
                category_ids: catIds,
                category_names: catNames,
                category_name: catNames.join(', '),
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
                  subtitle: g.subtitle || '',
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
  // MULTI-IMAGE UPLOADING WITH LIVE PROGRESS TRACKING
  // -------------------------------------------------------------
  const handleMultiImageUpload = async (filesList: FileList | File[]) => {
    const files = Array.from(filesList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) {
      addToast('error', 'Invalid File Type', 'Please select JPG, PNG, or WEBP image files.');
      return;
    }

    try {
      setIsUploadingGallery(true);
      const newItems: ProjectImageItem[] = [];

      const results = await api.uploadMultipleFiles(files, (completed, total, currentFile) => {
        setUploadProgress({
          current: completed,
          total,
          filename: currentFile,
          percent: Math.round((completed / total) * 100),
        });
      });

      results.forEach((r, idx) => {
        newItems.push({
          id: `g-${Date.now()}-${idx}`,
          url: r.url,
          title: r.originalName.replace(/\.[^/.]+$/, ''),
          caption: r.originalName.replace(/\.[^/.]+$/, ''),
          subtitle: '',
          order: project.gallery_images.length + idx + 1,
        });
      });

      setProject(prev => {
        const updatedGallery = [...prev.gallery_images, ...newItems];
        return {
          ...prev,
          gallery_images: updatedGallery,
          cover_image: prev.cover_image && prev.cover_image !== '/confrence1.png' && prev.cover_image !== '/confrence2.png'
            ? prev.cover_image
            : (newItems[0]?.url || prev.cover_image),
        };
      });

      addToast('success', 'Upload Complete', `${files.length} photos uploaded to project gallery.`);
    } catch (err: any) {
      addToast('error', 'Upload Failed', err.message || 'Check network connection.');
    } finally {
      setIsUploadingGallery(false);
      setUploadProgress(null);
      if (multiFileInputRef.current) multiFileInputRef.current.value = '';
    }
  };

  // -------------------------------------------------------------
  // SAVE / PUBLISH HANDLER (BACKEND INTEGRATION)
  // -------------------------------------------------------------
  const handleSaveToBackend = async () => {
    try {
      setSaveStatus('saving');

      const paletteString = project.materials.map(m => m.name).join(', ') || project.material_palette;

      // Gallery payload with no hardcoded fallback for subtitle
      const galleryPayload = project.gallery_images.map((g, idx) => ({
        id: typeof g.id === 'number' ? g.id : undefined,
        image: g.url,
        caption: g.caption || g.title || '',
        subtitle: g.subtitle || '',
        order: idx + 1
      }));

      const selectedCatIds = (project.category_ids && project.category_ids.length > 0)
        ? project.category_ids
        : (project.category_id ? [project.category_id] : []);

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
          category_id: selectedCatIds[0] || null,
          category_ids: selectedCatIds,
          specifications: {
            scale: project.floorsOrScale,
            base_material: paletteString,
            dimensions: project.area,
            lighting: project.lighting_design,
            tolerance: '±0.1mm',
            lead_time: project.duration,
            architect: project.architect,
            client: project.client,
            status: project.status
          },
          gallery_images: galleryPayload
        };

        if (project.id) {
          const updated = await api.updateModelProject(Number(project.id), payload);
          setProject(prev => ({ ...prev, id: updated.id }));
          addToast('success', 'Published to Backend', `Model Project #${updated.id} updated.`);
        } else {
          const created = await api.createModelProject(payload);
          setProject(prev => ({ ...prev, id: created.id }));
          navigate(`/admin/builder/models/${created.id}`, { replace: true });
          addToast('success', 'Created & Published', `New Scale Model Project #${created.id} created.`);
        }
      } else {
        const floorsNum = parseInt(project.floorsOrScale) || 1;
        const payload: any = {
          title: project.title,
          subtitle: project.subtitle,
          location: project.location,
          year: project.year,
          description: project.description,
          cover_image: project.cover_image,
          company_logo: project.company_logo || null,
          video_url: project.video_url,
          category_id: selectedCatIds[0] || null,
          category_ids: selectedCatIds,
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
          addToast('success', 'Published to Backend', `Interior Project #${updated.id} updated.`);
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

  const handleToggleCategory = (cat: CategoryItem) => {
    setProject(prev => {
      const currentIds = prev.category_ids && prev.category_ids.length > 0
        ? prev.category_ids
        : (prev.category_id ? [prev.category_id] : []);
      const exists = currentIds.includes(cat.id);
      let updatedIds: number[];
      if (exists) {
        if (currentIds.length <= 1) {
          addToast('info', 'Category Selection', 'Keep at least one category selected.');
          return prev;
        }
        updatedIds = currentIds.filter(id => id !== cat.id);
      } else {
        updatedIds = [...currentIds, cat.id];
      }

      const updatedNames = availableCats
        .filter(c => updatedIds.includes(c.id))
        .map(c => c.name);

      return {
        ...prev,
        category_ids: updatedIds,
        category_id: updatedIds[0],
        category_names: updatedNames,
        category_name: updatedNames.join(' · ')
      };
    });
  };

  const handleAddNewCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setIsAddingCategory(false);
      return;
    }
    const existing = availableCats.find(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      if (!(project.category_ids || []).includes(existing.id)) {
        handleToggleCategory(existing);
      }
      setNewCategoryName('');
      setIsAddingCategory(false);
      addToast('info', 'Category Selected', `"${existing.name}" is already available.`);
      return;
    }

    try {
      let createdCat: CategoryItem;
      if (activeMode === 'model') {
        createdCat = await api.createModelCategory(trimmed);
      } else {
        createdCat = await api.createInteriorCategory(trimmed);
      }
      setAvailableCats(prev => [...prev, createdCat]);
      setProject(prev => {
        const currentIds = prev.category_ids && prev.category_ids.length > 0
          ? prev.category_ids
          : (prev.category_id ? [prev.category_id] : []);
        const updatedIds = [...currentIds, createdCat.id];
        const updatedNames = [...(prev.category_names || []), createdCat.name];
        return {
          ...prev,
          category_ids: updatedIds,
          category_id: updatedIds[0],
          category_names: updatedNames,
          category_name: updatedNames.join(' · ')
        };
      });
      setNewCategoryName('');
      setIsAddingCategory(false);
      addToast('success', 'Category Created', `"${createdCat.name}" created and added to project.`);
    } catch (err: any) {
      addToast('error', 'Failed to Create Category', err.message || 'Check database connection.');
    }
  };

  const handleCreateNewProject = (targetMode?: ProjectMode) => {
    const selectedMode = targetMode || activeMode;
    const initialCats = availableCats.length > 0 ? [availableCats[0]] : [];
    const defaultCatIds = initialCats.map(c => c.id);
    const defaultCatNames = initialCats.map(c => c.name);

    if (selectedMode === 'model') {
      setProject({
        ...INITIAL_MODEL_PROJECT,
        id: undefined,
        title: 'NEW PHYSICAL SCALE MODEL',
        subtitle: 'Precision Fabrication & Scale Monograph',
        projectNumber: `MOD-${String(Date.now()).slice(-3)}`,
        slug: `new-scale-model-${Date.now()}`,
        category_id: defaultCatIds[0],
        category_ids: defaultCatIds,
        category_names: defaultCatNames,
        category_name: defaultCatNames.join(', ') || 'Scale Model'
      });
    } else {
      setProject({
        ...INITIAL_ARCHITECTURAL_PROJECT,
        id: undefined,
        title: 'NEW ARCHITECTURAL PROJECT',
        subtitle: 'Spatial Experience & Contemporary Design',
        projectNumber: `PRJ-${String(Date.now()).slice(-3)}`,
        slug: `new-interior-project-${Date.now()}`,
        category_id: defaultCatIds[0],
        category_ids: defaultCatIds,
        category_names: defaultCatNames,
        category_name: defaultCatNames.join(', ') || 'Luxury Residential'
      });
    }
    navigate(`/admin/builder/${selectedMode}`, { replace: true });
    addToast('info', 'New Project Draft', 'Edit titles, specs, photos and click "Create & Publish".');
  };

  const handleSwitchMode = async (newMode: ProjectMode) => {
    setActiveMode(newMode);
    try {
      const cats = newMode === 'model'
        ? await api.getModelCategories()
        : await api.getInteriorCategories();
      setAvailableCats(cats);
    } catch {
      // ignore
    }
    handleCreateNewProject(newMode);
  };

  const handleHeroFileUpload = async (filesList: FileList | File[]) => {
    const files = Array.from(filesList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) {
      addToast('error', 'Invalid File Type', 'Please select JPG, PNG, or WEBP image files.');
      return;
    }

    try {
      setIsUploadingGallery(true);
      if (files.length === 1) {
        setUploadProgress({ current: 1, total: 1, filename: files[0].name, percent: 50 });
        const res = await api.uploadFile(files[0]);
        setProject(p => ({ ...p, cover_image: res.url }));
        addToast('success', 'Cover Photo Updated', 'Photo uploaded directly from your computer.');
      } else {
        // Multi-image selection at once: first becomes cover photo, rest are added to gallery!
        const results = await api.uploadMultipleFiles(files, (completed, total, currentFile) => {
          setUploadProgress({
            current: completed,
            total,
            filename: currentFile,
            percent: Math.round((completed / total) * 100),
          });
        });
        const [first, ...rest] = results;
        const newGalleryItems: ProjectImageItem[] = rest.map((r, idx) => ({
          id: `g-${Date.now()}-${idx}`,
          url: r.url,
          title: r.originalName.replace(/\.[^/.]+$/, ''),
          caption: r.originalName.replace(/\.[^/.]+$/, ''),
          subtitle: '',
          order: project.gallery_images.length + idx + 1,
        }));
        setProject(p => ({
          ...p,
          cover_image: first.url,
          gallery_images: [...p.gallery_images, ...newGalleryItems],
        }));
        addToast('success', 'Multi-Images Uploaded', `${files.length} photos uploaded. 1 set as cover, ${rest.length} added to perspectives gallery.`);
      }
    } catch (err: any) {
      addToast('error', 'Upload Failed', err.message || 'Check network connection.');
    } finally {
      setIsUploadingGallery(false);
      setUploadProgress(null);
      if (heroFileInputRef.current) heroFileInputRef.current.value = '';
    }
  };

  const handleLogoFileUpload = async (filesList: FileList | File[]) => {
    const files = Array.from(filesList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;
    try {
      const res = await api.uploadFile(files[0]);
      setProject(p => ({ ...p, company_logo: res.url }));
      addToast('success', 'Logo Updated', 'Client logo uploaded from computer.');
    } catch (err: any) {
      addToast('error', 'Upload Failed', err.message);
    } finally {
      if (logoFileInputRef.current) logoFileInputRef.current.value = '';
    }
  };

  const heroImageSrc = resolveImageUrl(project.cover_image, activeMode === 'model' ? '/confrence2.png' : '/confrence1.png');
  const resolvedLogo = resolveImageUrl(project.company_logo, '/roha.png');
  const clientName = project.client || 'ROHA Studio';

  const sliderImages = project.gallery_images.length > 0
    ? project.gallery_images.map(g => g.url)
    : [project.cover_image || '/confrence1.png', '/tr/279A1756.JPG', '/tr/279A1760.JPG'];
  const currentSlideImage = sliderImages[activeSlideIndex] || heroImageSrc;

  const dynamicTags = [
    {
      icon: Building2,
      name: project.category_names && project.category_names.length > 0
        ? project.category_names.join(' · ')
        : (project.category_name || 'Luxury')
    },
    { icon: HomeIcon, name: project.style || project.floorsOrScale || 'Architectural' },
    { icon: Landmark, name: project.status || 'Completed' }
  ];

  return (
    <div className="h-screen overflow-hidden bg-black text-white flex flex-col font-sans antialiased" data-lenis-prevent="true">
      <ToastContainer toasts={toasts} onClose={(toastId: string) => setToasts(t => t.filter(x => x.id !== toastId))} />

      {/* Hidden computer file upload inputs */}
      <input
        ref={heroFileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={e => e.target.files && handleHeroFileUpload(e.target.files)}
        className="hidden"
      />
      <input
        ref={logoFileInputRef}
        type="file"
        accept="image/*"
        onChange={e => e.target.files && handleLogoFileUpload(e.target.files)}
        className="hidden"
      />

      {/* -------------------- 01. STUDIO TOP COMMAND BAR -------------------- */}
      <header className="h-16 shrink-0 bg-[#172a2b] border-b border-white/20 px-4 sm:px-8 flex items-center justify-between z-50 shadow-2xl backdrop-blur-xl">
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

          {/* Live Preview Button */}
          <button
            onClick={() => setIsPreviewActive(prev => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-sm ${
              isPreviewActive
                ? 'bg-white text-[#172a2b] border-white'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-cyan-300'
            }`}
            title="Toggle Live Website Preview Simulator"
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
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar" data-lenis-prevent="true">
        {!isPreviewActive && (
          <div className="bg-[#172a2b]/95 border-b border-cyan-500/20 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-cyan-200 sticky top-0 z-40">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`w-2 h-2 rounded-full ${project.id ? 'bg-cyan-400' : 'bg-emerald-400'} animate-pulse`} />
              <span className="font-bold text-white">
                {project.id ? `EDITING PROJECT #${project.id}` : 'CREATING NEW PROJECT DRAFT'}
              </span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <span className="text-slate-300 hidden md:inline">
                {activeMode === 'architectural'
                  ? 'Builder layout matching public interior detail page'
                  : 'Scale model plinth & fabrication monograph builder'}
              </span>
            </div>

            {/* Multi-Category Selector Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1">
                <Tag size={12} className="text-cyan-400" />
                Categories:
              </span>
              {availableCats.map(cat => {
                const isSelected = (project.category_ids || []).includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && <Check size={11} className="stroke-[3]" />}
                  </button>
                );
              })}

              {/* Add New Category if not available */}
              {isAddingCategory ? (
                <div className="inline-flex items-center gap-1.5 bg-black/60 border border-cyan-400 rounded-lg px-2 py-0.5 shadow-sm">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNewCategory();
                      } else if (e.key === 'Escape') {
                        setIsAddingCategory(false);
                        setNewCategoryName('');
                      }
                    }}
                    placeholder="New category..."
                    autoFocus
                    className="bg-transparent py-0.5 text-[11px] font-mono text-white placeholder-slate-400 focus:outline-none w-28"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="p-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer"
                    title="Save & Add Category"
                  >
                    <Check size={11} className="stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName('');
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                    title="Cancel"
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="px-2 py-1 rounded-lg text-[11px] font-mono font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer flex items-center gap-1"
                  title="Add new category if not available"
                >
                  <Plus size={11} />
                  <span>New</span>
                </button>
              )}
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
            </div>
          </div>
        )}

        {/* -------------------- ARCHITECTURAL HERO SECTION (MATCHING PUBLIC SITE) -------------------- */}
        {activeMode === 'architectural' ? (
          <section className="relative min-h-screen w-full bg-[#0b1718] overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-12 px-6 sm:px-12 lg:px-20">
            {/* Full-bleed hero background image */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
              <img
                src={resolveImageUrl(currentSlideImage, '/confrence1.png')}
                alt={project.title}
                className="w-full h-full object-cover object-center scale-100 transition-all duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b1718]/95 via-[#172a2b]/80 md:via-[#172a2b]/60 to-[#0b1718]/30 z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1718] via-transparent to-[#0b1718]/85 z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-radial from-white/[0.08] via-transparent to-transparent z-10 pointer-events-none" />
            </div>

            {/* Ceiling Recessed Spotlights */}
            <div className="absolute top-0 inset-x-0 flex justify-around pointer-events-none z-20">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-5 h-1.5 bg-white/95 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.95)]" />
                  <div className="w-36 sm:w-56 h-64 sm:h-84 bg-gradient-to-b from-white/35 via-white/10 to-transparent blur-2xl transform -translate-y-2" />
                </div>
              ))}
            </div>

            {/* Left Slat Wall Texture */}
            <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 pointer-events-none opacity-25 z-20 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.12)_0px,rgba(255,255,255,0.12)_10px,transparent_10px,transparent_22px)] border-r border-white/15" />

            {/* Ambient Pendant Luminaire */}
            <div className="absolute top-0 left-6 sm:left-12 flex flex-col items-center pointer-events-none z-20">
              <div className="w-0.5 h-20 sm:h-28 bg-gradient-to-b from-white/40 to-white/80" />
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/35 blur-md absolute animate-pulse" />
                <div className="w-6 h-8 rounded-full border border-white/80 bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.9)]">
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
                </div>
              </div>
            </div>

            {/* Right Floating Shelves */}
            <div className="hidden lg:flex flex-col gap-14 absolute right-8 sm:right-14 top-24 pointer-events-none z-20 w-44">
              <div className="relative w-full h-2.5 bg-black/70 backdrop-blur-md rounded-sm border-t border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-x-0 -bottom-3 h-4 bg-white/25 blur-md" />
                <div className="absolute -top-7 right-4 flex items-end gap-2 opacity-90">
                  <div className="w-4 h-6 rounded-t-lg bg-emerald-900/80 border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.2)]" />
                </div>
              </div>
              <div className="relative w-full h-2.5 bg-black/70 backdrop-blur-md rounded-sm border-t border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-x-0 -bottom-3 h-4 bg-white/25 blur-md" />
                <div className="absolute -top-6 right-8 flex items-end gap-1.5 opacity-85">
                  <div className="w-3.5 h-5 rounded-sm bg-slate-800/80 border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.15)]" />
                </div>
              </div>
            </div>

            {/* Foreground Main Content */}
            <div className="relative z-30 max-w-7xl mx-auto w-full my-auto flex flex-col items-start justify-center">
              <div className="max-w-2xl space-y-5 sm:space-y-6 w-full">
                {/* Pill & Partner Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 shadow-md text-xs font-mono uppercase tracking-widest text-white">
                    <span>
                      {project.category_names && project.category_names.length > 0
                        ? project.category_names.join(' · ')
                        : (project.category_name || 'Interior')}
                    </span>
                    <span className="text-white/40">Collection</span>
                  </div>

                  <div className="group relative inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 shadow-md">
                    <img src={resolvedLogo} alt="" className="w-4 h-4 object-contain rounded-sm" />
                    {isPreviewActive ? (
                      <span className="text-[10px] font-mono tracking-widest text-white uppercase font-bold">
                        {clientName}
                      </span>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={project.client}
                          onChange={e => setProject(p => ({ ...p, client: e.target.value }))}
                          placeholder="Client / Studio Partner"
                          className="text-[10px] font-mono tracking-widest text-white uppercase font-bold bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-36"
                        />
                        <button
                          type="button"
                          onClick={() => logoFileInputRef.current?.click()}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-cyan-300 underline ml-1 cursor-pointer"
                        >
                          Upload Logo
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Editorial Title */}
                <div className="relative w-full">
                  {isPreviewActive ? (
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
                      {project.title}
                    </h1>
                  ) : (
                    <input
                      type="text"
                      value={project.title}
                      onChange={e => setProject(p => ({ ...p, title: e.target.value }))}
                      placeholder="PROJECT TITLE"
                      className="w-full text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] bg-transparent border-b border-transparent hover:border-white/20 focus:border-cyan-300 focus:outline-none"
                    />
                  )}
                </div>

                {/* Narrative Description */}
                <div className="relative w-full">
                  {isPreviewActive ? (
                    <p className="text-base sm:text-lg text-slate-100/95 leading-relaxed font-sans drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                      {project.description}
                    </p>
                  ) : (
                    <textarea
                      rows={4}
                      value={project.description}
                      onChange={e => setProject(p => ({ ...p, description: e.target.value }))}
                      placeholder="Detail the spatial hierarchy, bespoke materiality, and design vision..."
                      className="w-full text-base sm:text-lg text-slate-100/95 leading-relaxed font-sans drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] bg-black/30 p-3 rounded-xl border border-white/10 hover:border-white/30 focus:border-cyan-300 focus:outline-none resize-none"
                    />
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-slate-950 text-xs sm:text-sm font-bold uppercase tracking-wider border border-white shadow-[0_0_25px_rgba(255,255,255,0.35)] cursor-pointer"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/15 text-white text-xs sm:text-sm font-semibold tracking-wide border border-white/30 backdrop-blur-xl shadow-md cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-950">
                      <Play size={11} className="fill-current ml-0.5 text-slate-950" />
                    </div>
                    <span>Watch Video</span>
                  </button>
                </div>

                {/* Floating Stats Card matching public site */}
                <div className="mt-8 sm:mt-10 bg-transparent border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-6 w-full max-w-lg backdrop-blur-xs">
                  {/* Stat 1: Area */}
                  <div className="flex flex-col items-start gap-1 pr-3 sm:pr-5 border-r border-white/15 flex-1">
                    <div className="flex items-center gap-1.5 text-white">
                      <Armchair size={18} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                    </div>
                    {isPreviewActive ? (
                      <div className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight">
                        {project.area || '450 m²'}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={project.area}
                        onChange={e => setProject(p => ({ ...p, area: e.target.value }))}
                        placeholder="450 m²"
                        className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
                      />
                    )}
                    <span className="text-[10px] sm:text-xs text-slate-200 font-sans tracking-wide">
                      Spatial Area
                    </span>
                  </div>

                  {/* Stat 2: Year */}
                  <div className="flex flex-col items-start gap-1 px-3 sm:px-5 border-r border-white/15 flex-1">
                    <div className="flex items-center gap-1.5 text-white">
                      <Star size={18} className="fill-white/30 drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                    </div>
                    {isPreviewActive ? (
                      <div className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight">
                        {project.year || '2025'}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={project.year}
                        onChange={e => setProject(p => ({ ...p, year: e.target.value }))}
                        placeholder="2025"
                        className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
                      />
                    )}
                    <span className="text-[10px] sm:text-xs text-slate-200 font-sans tracking-wide">
                      Project Year
                    </span>
                  </div>

                  {/* Stat 3: Status */}
                  <div className="flex flex-col items-start gap-1 pl-3 sm:pl-5 flex-1">
                    <div className="flex items-center gap-1.5 text-white">
                      <Shield size={18} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
                    </div>
                    {isPreviewActive ? (
                      <div className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight truncate">
                        {project.status || 'Completed'}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={project.status}
                        onChange={e => setProject(p => ({ ...p, status: e.target.value }))}
                        placeholder="Completed"
                        className="text-lg sm:text-2xl font-bold font-mono text-white tracking-tight bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full truncate"
                      />
                    )}
                    <span className="text-[10px] sm:text-xs text-slate-200 font-sans tracking-wide">
                      Execution Status
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Dots & Change Cover Trigger */}
            <div className="relative z-30 flex flex-col items-center gap-3 pt-6">
              {!isPreviewActive && (
                <button
                  type="button"
                  onClick={() => heroFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-cyan-300 text-xs font-mono font-bold uppercase backdrop-blur-md border border-cyan-500/30 shadow-lg cursor-pointer transition-all"
                  title="Upload cover photo from your computer (multi-select supported to add to gallery at once)"
                >
                  <Camera size={14} />
                  <span>Upload Cover from Computer</span>
                </button>
              )}

              {sliderImages.length > 1 && (
                <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/25 shadow-md">
                  {sliderImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        activeSlideIndex === idx
                          ? 'w-8 h-2.5 bg-white shadow-[0_0_14px_rgba(255,255,255,1)]'
                          : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : (
          /* MODEL MAKING HERO SECTION */
          <section className="relative min-h-[92vh] sm:min-h-screen w-full bg-gradient-to-t from-[#f5f7f7] to-[#172a2b] overflow-hidden flex items-center justify-center">
            <div className="absolute w-full md:bottom-0 top-60 scale-105 opacity-10 pointer-events-none flex justify-center">
              <img src={heroImageSrc} alt="" className="w-full max-h-[85vh] object-contain filter blur-[1px]" />
            </div>

            <div className="absolute inset-0 bg-radial from-white/5 to-transparent z-0" />

            <div className="flex w-full h-full px-6 sm:px-10 flex-col relative z-10">
              <div className="flex flex-col items-center text-white pt-8 sm:pt-10 h-1/2 select-none text-center">
                {/* Multi-Category Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                  {(project.category_names && project.category_names.length > 0
                    ? project.category_names
                    : [project.category_name || 'Scale Model']
                  ).map((cName, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 text-[10px] font-mono uppercase tracking-widest text-cyan-300 shadow-md"
                    >
                      {cName}
                    </span>
                  ))}
                </div>

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
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-amber-300 underline ml-2 cursor-pointer"
                    >
                      Upload Logo
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={project.subtitle}
                  onChange={e => setProject(p => ({ ...p, subtitle: e.target.value }))}
                  placeholder="SUBTITLE / SCALE FABRICATION SPECIFICATION"
                  className="text-xs sm:text-sm md:text-xl font-light tracking-[0.3em] sm:tracking-[0.4em] uppercase opacity-80 mb-2 text-cyan-200 bg-transparent border-b border-transparent hover:border-white/30 focus:border-cyan-300 focus:outline-none text-center w-full max-w-2xl px-2"
                />

                <input
                  type="text"
                  value={project.title}
                  onChange={e => setProject(p => ({ ...p, title: e.target.value.toUpperCase() }))}
                  placeholder="PROJECT TITLE"
                  className="text-[10vw] sm:text-[11.5vw] font-black tracking-tighter md:relative absolute top-64 md:top-24 leading-none opacity-40 uppercase truncate max-w-full px-4 text-center bg-transparent border-b border-transparent hover:border-white/30 focus:border-cyan-300 focus:outline-none"
                />
              </div>

              <div className="flex flex-row h-2/3 relative -mt-20">
                <div className="hidden md:flex flex-col items-start w-[25%] justify-center text-white z-30">
                  <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold tracking-wider mb-1">
                    Hero Description
                  </span>
                  <textarea
                    rows={3}
                    value={project.hero_description !== undefined ? project.hero_description : (project.subtitle || 'Precision scale architectural model.')}
                    onChange={e => setProject(p => ({ ...p, hero_description: e.target.value }))}
                    placeholder="Hero description..."
                    className="w-full text-sm font-medium leading-relaxed text-slate-100 mb-3 max-w-[280px] bg-black/40 p-2.5 rounded-xl border border-white/20 focus:outline-none focus:border-cyan-300 resize-none"
                  />
                  <GeoButton label="Get Started" from="f0f0f0" to="1d424b" />
                </div>

                <div className="md:w-[50%] w-full relative z-20 flex justify-center">
                  <div className="absolute md:-top-40 -top-32 h-[130%] w-full flex justify-center items-center group">
                    <img
                      src={heroImageSrc}
                      alt={project.title}
                      className="h-full object-contain md:scale-100 scale-125 drop-shadow-[0_35px_35px_rgba(0,0,0,0.55)] transition-all duration-700 group-hover:scale-103"
                    />

                    {!isPreviewActive && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center gap-3 backdrop-blur-xs">
                        <button
                          type="button"
                          onClick={() => heroFileInputRef.current?.click()}
                          className="px-5 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-mono font-bold uppercase transition-transform hover:scale-105 cursor-pointer shadow-xl flex items-center gap-2"
                          title="Upload model photo from your computer (multi-select supported to add to gallery at once)"
                        >
                          <Camera size={14} />
                          <span>Upload Model Photo from Computer</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-end w-[25%] justify-center text-white z-30">
                  <div className="flex flex-col items-end gap-3">
                    {dynamicTags.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2.5 py-2 px-4 rounded-full bg-black/35 backdrop-blur-xl border border-white/20 shadow-md"
                        >
                          <Icon size={16} className="text-amber-400" />
                          <span className="text-white text-xs font-bold uppercase tracking-widest font-mono">
                            {renderSuperscriptText(item.name)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* -------------------- OVERVIEW & ARCHITECTURAL SPECS SECTION -------------------- */}
        <section className="w-full bg-gradient-to-b from-[#172a2b] via-[#1d424b] to-[#f5f7f7] py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-20 text-white contour-one">
          <div className="max-w-6xl mx-auto">
            <div className="border-b border-white/20 pb-8 sm:pb-10 md:pb-12 mb-8 sm:mb-10 md:mb-12">
              <input
                type="text"
                value={project.subtitle}
                onChange={e => {
                  const val = normalizeSuperscriptInput(e.target.value);
                  setProject(p => ({ ...p, subtitle: val }));
                }}
                placeholder="SUBTITLE / PHILOSOPHY STATEMENT"
                className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold text-cyan-300 mb-3 sm:mb-4 bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
              />
              <input
                type="text"
                value={project.title}
                onChange={e => setProject(p => ({ ...p, title: e.target.value.toUpperCase() }))}
                placeholder="PROJECT TITLE"
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
                          onChange={e => setProject(p => ({ ...p, location: e.target.value }))}
                          className="text-sm sm:text-base font-bold tracking-tight text-white bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
                        />
                      </div>
                    </li>

                    {/* Floor Area */}
                    <li className="flex items-start gap-3 sm:gap-4">
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/30 shrink-0">
                        <Maximize2 size={16} className="text-cyan-200" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-300">
                          Floor Area / Footprint
                        </p>
                        <input
                          type="text"
                          value={project.area}
                          onChange={e => {
                            const val = normalizeSuperscriptInput(e.target.value);
                            setProject(p => ({ ...p, area: val }));
                          }}
                          className="text-sm sm:text-base font-bold tracking-tight text-white bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
                        />
                      </div>
                    </li>

                    {/* Scale / Levels */}
                    <li className="flex items-start gap-3 sm:gap-4">
                      <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/30 shrink-0">
                        <Layers size={16} className="text-cyan-200" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-300">
                          Scale / Levels
                        </p>
                        <input
                          type="text"
                          value={project.floorsOrScale}
                          onChange={e => {
                            const val = normalizeSuperscriptInput(e.target.value);
                            setProject(p => ({ ...p, floorsOrScale: val }));
                          }}
                          className="text-sm sm:text-base font-bold tracking-tight text-white bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
                        />
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
                          onChange={e => setProject(p => ({ ...p, year: e.target.value }))}
                          className="text-sm sm:text-base font-bold tracking-tight text-white bg-transparent border-b border-transparent focus:border-cyan-300 focus:outline-none w-full"
                        />
                      </div>
                    </li>

                    {/* Materiality */}
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
                          onChange={e => setProject(p => ({ ...p, material_palette: e.target.value }))}
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

        {/* -------------------- CURATED ARCHITECTURAL PERSPECTIVES SECTION -------------------- */}
        <section className="w-full bg-[#f0f0f0] py-0 relative overflow-hidden text-slate-900">
          <div className="absolute bg-gradient-to-b from-[#f0f0f0] from-35% h-48 sm:h-72 md:h-96 top-0 inset-0 z-10 pointer-events-none" />

          {/* Section Headline & Actions */}
          <div className="w-full px-6 sm:px-10 md:px-16 pt-16 pb-8 relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#205b63] font-bold">
                  {project.subtitle?.trim() ? `VISUAL ARCHIVE // ${project.subtitle.trim().toUpperCase()}` : 'VISUAL ARCHIVE'}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#172a2b] uppercase tracking-tight">
                Curated Architectural Perspectives
              </h3>
            </div>

            {!isPreviewActive && (
              <div className="flex items-center gap-2.5 flex-wrap">
                <input
                  ref={multiFileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => e.target.files && handleMultiImageUpload(e.target.files)}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => multiFileInputRef.current?.click()}
                  disabled={isUploadingGallery}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#205b63] hover:bg-[#172a2b] text-white text-xs font-mono font-bold uppercase transition-all shadow-md cursor-pointer shrink-0"
                  title="Select multiple images from your computer to upload at once"
                >
                  {isUploadingGallery ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                  <span>Upload Photos from Computer (Multi-Select)</span>
                </button>
              </div>
            )}
          </div>

          {/* Live Multi-Image Upload Progress Indicator */}
          {isUploadingGallery && uploadProgress && (
            <div className="w-full px-6 sm:px-10 md:px-16 pb-6 relative z-20">
              <div className="p-4 rounded-2xl bg-[#172a2b] text-white border border-cyan-500/30 shadow-xl max-w-xl flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-2 text-cyan-300 font-bold">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Uploading {uploadProgress.current} of {uploadProgress.total} Images</span>
                  </span>
                  <span className="font-bold text-white">{uploadProgress.percent}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${uploadProgress.percent}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-300 truncate font-mono">
                  Processing: {uploadProgress.filename}
                </p>
              </div>
            </div>
          )}

          {/* Full-Screen Edge-to-Edge Parallax Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 w-full relative z-20 border-t border-slate-300">
            {project.gallery_images.map((item, index) => (
              <div
                key={item.id || index}
                className="relative h-[70vh] sm:h-[80vh] md:h-screen w-full overflow-hidden group border-b border-r border-slate-300/40 bg-slate-950 flex flex-col justify-end"
              >
                <img
                  src={resolveImageUrl(item.url)}
                  alt={item.caption || 'Architectural Perspective'}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-16 z-20">
                  {isPreviewActive ? (
                    <>
                      {item.subtitle?.trim() ? (
                        <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-cyan-300 mb-2 drop-shadow">
                          {item.subtitle.trim()}
                        </span>
                      ) : null}
                      {(item.caption?.trim() || item.title?.trim()) ? (
                        <h4 className="text-xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">
                          {(item.caption || item.title || '').trim()}
                        </h4>
                      ) : null}
                    </>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.subtitle || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setProject(p => ({
                            ...p,
                            gallery_images: p.gallery_images.map((g, i) =>
                              i === index ? { ...g, subtitle: val } : g
                            )
                          }));
                        }}
                        placeholder="Subtitle (Optional - Leave blank to hide)"
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
                          type="button"
                          onClick={() => {
                            setProject(p => ({
                              ...p,
                              gallery_images: p.gallery_images.filter((_, i) => i !== index)
                            }));
                            addToast('info', 'Photo Removed');
                          }}
                          className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
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
        <section className="w-full bg-[#f0f0f0] px-4 sm:px-8 md:px-16 py-16 sm:py-20 md:py-28 relative z-20 text-slate-900">
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
                  Enter a YouTube or video embed URL above to display cinematic footage.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* -------------------- STUDIO FOOTER -------------------- */}
        <Footer />
      </main>
    </div>
  );
};

export default ProjectBuilder;
