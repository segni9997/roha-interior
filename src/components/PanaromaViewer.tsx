
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut, Move3D } from "lucide-react";
import {  type Project } from "./Projectdetail";
import type { PannellumViewer } from "../types/pannellum";
import { sampleProjects } from "./datas/sampleProjects";

// Interfaces for strict typing
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
  const { projectId } = useParams<{ projectId: string }>();

  // FIX: Type-safe comparison by converting numeric ID to string
  const project: Project = useMemo(() => {
    return sampleProjects.find((p) => p.id.toString() === projectId) || sampleProjects[0];
  }, [projectId]);

  // FIX: Memoize scenes to prevent infinite useEffect loops
  const panoramicScenes: PanoramicScene[] = useMemo(() => {
    return project.panoramicScenes || [];
  }, [project]);

  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const viewerRef = useRef<PannellumViewer>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);

  // Initialize currentSceneId when panoramicScenes are available
  useEffect(() => {
    if (panoramicScenes.length > 0 && !currentSceneId) {
      setCurrentSceneId(panoramicScenes[0].id);
    }
  }, [panoramicScenes, currentSceneId]);

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
      viewerRef.current.destroy();
    }

    try {
      viewerRef.current = window.pannellum.viewer(panoramaRef.current, {
        default: {
          firstScene: currentSceneId || panoramicScenes[0].id,
          sceneFadeDuration: 800,
        },
        scenes: scenesConfig,
      });

      viewerRef.current.on("scenechange", (id: string) => setCurrentSceneId(id));
      viewerRef.current.on("load", () => setIsLoading(false));
      viewerRef.current.on("error", (err: string) => console.error("Pannellum Error:", err));
    } catch (error) {
      console.error("Initialization Error:", error);
    }
  }, [panoramicScenes, currentSceneId]);

  useEffect(() => {
    const scriptId = "pannellum-script";
    
    const setup = () => {
      if (window.pannellum) {
        initializePanorama();
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
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [initializePanorama]);

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

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      <style>{`
        .custom-hotspot { background: #395e63; border: 2px solid white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        .custom-hotspot:hover { transform: scale(1.2) rotate(10deg); background: #72f88e; }
        .pnlm-load-box { display: none !important; } /* Hide default loader */
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-md h-14 sm:h-16 flex items-center px-4 sm:px-6 md:px-8 justify-between border-b border-white/10">
        <Link to="/gallery" className="text-white flex items-center gap-1.5 sm:gap-2 hover:text-[#395e63] transition-colors group text-sm sm:text-base">
          <ArrowLeft size={18} className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform"/> 
          <span className="hidden sm:inline">Back to Gallery</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <div className="text-white font-bold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
          <Move3D size={18} className="sm:w-5 sm:h-5 text-[#395e63] animate-pulse"/> 
          <span className="truncate max-w-[120px] sm:max-w-none">{project.title}</span>
        </div>
        <div className="hidden md:block text-gray-400 text-xs sm:text-sm tracking-wide uppercase">
          {panoramicScenes.find(s => s.id === currentSceneId)?.name || "Interactive Tour"}
        </div>
      </nav>

      {/* Viewer Wrapper */}
      <div ref={panoramaRef} className="w-full h-full bg-neutral-900" />

      {/* UI Controls */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-4 bg-black/60 backdrop-blur-xl p-2 sm:p-3 rounded-full border border-white/10 z-50">
        <button onClick={() => handleZoom(10)} title="Zoom Out" className="text-white p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors"><ZoomOut size={20} className="sm:w-6 sm:h-6"/></button>
        <button onClick={handleReset} title="Reset View" className="text-white p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors"><RotateCcw size={20} className="sm:w-6 sm:h-6"/></button>
        <button onClick={() => handleZoom(-10)} title="Zoom In" className="text-white p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors"><ZoomIn size={20} className="sm:w-6 sm:h-6"/></button>
      </div>

      {/* Scene Selector Thumbnails */}
      <div className="absolute bottom-6 sm:bottom-10 right-4 sm:right-6 md:right-10 flex flex-col gap-2 sm:gap-3 z-50">
        {panoramicScenes.map((s) => (
          <button 
            key={s.id} 
            onClick={() => viewerRef.current?.loadScene(s.id)}
            className={`w-12 h-10 sm:w-16 sm:h-12 md:w-20 md:h-14 rounded-md sm:rounded-lg border-2 overflow-hidden transition-all duration-300 group relative ${
              currentSceneId === s.id ? 'border-[#395e63] scale-110 shadow-lg shadow-[#395e63]/40' : 'border-white/20 hover:border-white/60'
            }`}
          >
            <img src={s.panorama} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={s.name} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </button>
        ))}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center text-white px-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-[#395e63]"></div>
            <Move3D className="absolute inset-0 m-auto text-white/50" size={20} />
          </div>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase text-gray-400 animate-pulse text-center">Initializing Virtual Space</p>
        </div>
      )}
    </div>
  );
};

export default PanoramaViewer;