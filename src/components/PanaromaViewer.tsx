import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Maximize,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import type { PannellumViewer } from "../types/pannellum";
import { sampleProjects } from "./datas/sampleProjects";
import { api, resolveImageUrl, type PanoramicTourItem } from "../services/api";
import { ResponsiveContentGallery } from "./ResponsiveContentGallery";

interface Hotspot {
  pitch: number;
  yaw: number;
  type: "scene" | "info";
  text: string;
  sceneId?: string;
  targetYaw?: number;
  targetPitch?: number;
  cssClass?: string;
}

interface PanoramicScene {
  id: string;
  panorama: string;
  name: string;
  hotSpots?: Hotspot[];
}

interface PannellumSceneConfig {
  type: "equirectangular";
  panorama: string;
  hotSpots?: Hotspot[];
  autoLoad?: boolean;
  showControls?: boolean;
}

const PanoramaViewer = () => {
  const { id, projectId } = useParams<{ id?: string; projectId?: string }>();
  const activeId = id || projectId || "1";

  // Initial fallback tour
  const defaultTour = useMemo<PanoramicTourItem>(() => {
    const fb =
      sampleProjects.find((p) => p.id.toString() === activeId) ||
      sampleProjects[0];
    return {
      id: fb.id,
      title: fb.title,
      slug: String(fb.id),
      description: fb.description,
      cover_image: fb.images[0],
      is_featured: true,
      panoramicScenes: (fb.panoramicScenes || []).map((s) => ({
        id: s.id,
        name: s.name,
        panorama: s.panorama,
        initial_yaw: 0,
        initial_pitch: 0,
        hotSpots: (s.hotSpots || []) as any,
      })),
    };
  }, [activeId]);

  const [tour, setTour] = useState<PanoramicTourItem>(defaultTour);
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isGalleryDrawerOpen, setIsGalleryDrawerOpen] = useState(false);

  const viewerRef = useRef<PannellumViewer | null>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);

  // Sync fallback tour when activeId changes
  useEffect(() => {
    setTour(defaultTour);
  }, [defaultTour]);

  // Fetch live tour from backend
  useEffect(() => {
    let isMounted = true;
    async function loadTourData() {
      try {
        const liveTour = await api.getPanoramicTour(parseInt(activeId));
        if (isMounted && liveTour && liveTour.panoramicScenes && liveTour.panoramicScenes.length > 0) {
          setTour(liveTour);
        }
      } catch (err) {
        console.warn("Using local fallback tour data for ID:", activeId, err);
      }
    }
    loadTourData();
    return () => {
      isMounted = false;
    };
  }, [activeId]);

  // Resolve scene assets
  const panoramicScenes: PanoramicScene[] = useMemo(() => {
    if (!tour || !tour.panoramicScenes || tour.panoramicScenes.length === 0) {
      return (defaultTour.panoramicScenes || []).map((s) => ({
        id: s.id,
        name: s.name,
        panorama: resolveImageUrl(s.panorama, "/tr/279A1002.JPG"),
        hotSpots: s.hotSpots?.map((h) => ({
          ...h,
          type: h.type as "scene" | "info",
        })),
      }));
    }
    return tour.panoramicScenes.map((s) => ({
      id: s.id,
      name: s.name,
      panorama: resolveImageUrl(s.panorama, "/tr/279A1002.JPG"),
      hotSpots: s.hotSpots?.map((h) => ({
        ...h,
        type: h.type as "scene" | "info",
      })),
    }));
  }, [tour, defaultTour]);

  useEffect(() => {
    if (panoramicScenes.length > 0) {
      if (!currentSceneId || !panoramicScenes.some((s) => s.id === currentSceneId)) {
        setCurrentSceneId(panoramicScenes[0].id);
      }
    }
  }, [panoramicScenes, currentSceneId]);

  // Initialize Pannellum
  const initializePanorama = useCallback(() => {
    if (!panoramaRef.current || !window.pannellum || panoramicScenes.length === 0) return;

    const scenesConfig: Record<string, PannellumSceneConfig> = {};
    panoramicScenes.forEach((s) => {
      scenesConfig[s.id] = {
        type: "equirectangular",
        panorama: s.panorama,
        hotSpots: s.hotSpots,
        autoLoad: true,
        showControls: false,
      };
    });

    if (viewerRef.current) {
      try {
        viewerRef.current.destroy();
      } catch {
        // ignore
      }
      viewerRef.current = null;
    }

    try {
      viewerRef.current = window.pannellum.viewer(panoramaRef.current, {
        default: {
          firstScene: currentSceneId || panoramicScenes[0].id,
          sceneFadeDuration: 800,
          autoRotate: isAutoRotating ? -2 : 0,
          compass: true,
        },
        scenes: scenesConfig,
      });

      viewerRef.current.on("scenechange", (sid: string) => {
        setCurrentSceneId(sid);
      });
      viewerRef.current.on("load", () => {
        setIsLoading(false);
      });
      viewerRef.current.on("error", (err: string) => {
        console.error("Pannellum Error:", err);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Initialization Error:", error);
      setIsLoading(false);
    }
  }, [panoramicScenes]);

  useEffect(() => {
    const scriptId = "pannellum-script";

    const setup = () => {
      if (window.pannellum) {
        initializePanorama();
      } else {
        const interval = setInterval(() => {
          if (window.pannellum) {
            clearInterval(interval);
            initializePanorama();
          }
        }, 100);
        setTimeout(() => clearInterval(interval), 5000);
      }
    };

    if (!document.getElementById(scriptId)) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
      document.head.appendChild(css);

      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
      script.onload = setup;
      document.head.appendChild(script);
    } else {
      setup();
    }

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch {
          // ignore
        }
        viewerRef.current = null;
      }
    };
  }, [initializePanorama]);

  // Controls
  const handleZoom = (delta: number) => {
    if (viewerRef.current) {
      const hfov = viewerRef.current.getHfov();
      viewerRef.current.setHfov(Math.min(Math.max(hfov + delta, 30), 120));
    }
  };

  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.setPitch(0);
      viewerRef.current.setYaw(0);
      viewerRef.current.setHfov(100);
    }
  };

  const toggleAutoRotate = () => {
    if (!viewerRef.current) return;
    if (isAutoRotating) {
      viewerRef.current.stopAutoRotate();
      setIsAutoRotating(false);
    } else {
      viewerRef.current.startAutoRotate(-2);
      setIsAutoRotating(true);
    }
  };

  const toggleFullscreen = () => {
    if (viewerRef.current) {
      viewerRef.current.toggleFullscreen();
    }
  };

  const handleSceneChange = (sid: string) => {
    if (viewerRef.current && sid !== currentSceneId) {
      setIsLoading(true);
      viewerRef.current.loadScene(sid);
      setCurrentSceneId(sid);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none font-sans">
      {/* ----------------- TOP CONTROLS ----------------- */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 sm:p-6 flex justify-between items-center bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none">
        <Link
          to="/gallery"
          className="pointer-events-auto flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all text-xs sm:text-sm font-medium shadow-lg"
        >
          <ArrowLeft size={16} />
          <span>Exit Tour</span>
        </Link>

        <div className="text-center">
          <h1 className="text-white text-sm sm:text-lg font-bold tracking-tight">
            {tour?.title || defaultTour.title}
          </h1>
          <p className="text-cyan-400 text-[11px] sm:text-xs font-mono">
            Active Scene: {panoramicScenes.find((s) => s.id === currentSceneId)?.name || "Living Room"}
          </p>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {tour?.gallery_images && tour.gallery_images.length > 0 && (
            <button
              type="button"
              onClick={() => setIsGalleryDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#205b63]/90 hover:bg-[#205b63] text-white backdrop-blur-md border border-cyan-500/30 transition-all text-xs sm:text-sm font-bold shadow-lg cursor-pointer"
              title="View Companion Photo Gallery"
            >
              <ImageIcon size={15} />
              <span>Gallery ({tour.gallery_images.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* ----------------- PANNELLUM CANVAS ----------------- */}
      <div ref={panoramaRef} className="w-full h-full" />

      {/* ----------------- LOADING INDICATOR ----------------- */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mb-4" />
          <p className="text-white text-xs sm:text-sm uppercase tracking-widest font-mono">
            Rendering 360° Spherical Projection...
          </p>
        </div>
      )}

      {/* ----------------- SCENE SELECTOR TABS ----------------- */}
      {panoramicScenes.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 max-w-[90vw] overflow-x-auto shadow-2xl">
          {panoramicScenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => handleSceneChange(scene.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                currentSceneId === scene.id
                  ? "bg-[#395e63] text-white shadow-lg border border-cyan-400/40"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {scene.name}
            </button>
          ))}
        </div>
      )}

      {/* ----------------- FLOATING UTILITY CONTROLS ----------------- */}
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 bg-black/60 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl">
        <button
          onClick={() => handleZoom(-10)}
          className="p-2.5 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => handleZoom(10)}
          className="p-2.5 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={handleReset}
          className="p-2.5 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all cursor-pointer"
          title="Reset Perspective"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={toggleAutoRotate}
          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
            isAutoRotating
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
              : "text-white/80 hover:text-white hover:bg-white/15"
          }`}
          title={isAutoRotating ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
        >
          {isAutoRotating ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2.5 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize size={18} />
        </button>
      </div>

      {/* ----------------- COMPANION GALLERY DRAWER MODAL ----------------- */}
      {isGalleryDrawerOpen && tour?.gallery_images && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col p-4 sm:p-8 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 max-w-7xl mx-auto w-full">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {tour.title} // Companion Architectural Stills
              </h2>
              <p className="text-xs font-mono text-cyan-400">
                High-Resolution Architectural Perspectives & Details
              </p>
            </div>
            <button
              onClick={() => setIsGalleryDrawerOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="max-w-7xl mx-auto w-full py-6">
            <ResponsiveContentGallery
              images={tour.gallery_images}
              title=""
              subtitle=""
              theme="dark"
              columns={3}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PanoramaViewer;