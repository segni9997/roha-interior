"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut, Move3D, } from "lucide-react";
import { sampleProjects } from "./Projectdetail";

declare global { interface Window { pannellum: any; } }

const PanoramaViewer = () => {
  const { projectId } = useParams();
  const project = sampleProjects.find((p) => p.id === projectId) || sampleProjects[0];
  const panoramicScenes = project.panoramicScenes || [];

  const [currentSceneId, setCurrentSceneId] = useState<string | null>(panoramicScenes[0]?.id ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewer, setViewer] = useState<any>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPannellum = () => {
      if (window.pannellum) {
        initializePanorama();
        return;
      }
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
      document.head.appendChild(css);

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
      script.onload = initializePanorama;
      document.head.appendChild(script);
    };

    const initializePanorama = () => {
      if (!panoramaRef.current || !window.pannellum) return;

      const scenesConfig: any = {};
      panoramicScenes.forEach((s) => {
        scenesConfig[s.id] = {
          type: "equirectangular",
          panorama: s.panorama,
          hotSpots: s.hotSpots,
          autoLoad: true,
          showControls: false,
        };
      });

      const pv = window.pannellum.viewer(panoramaRef.current, {
        default: { firstScene: currentSceneId, sceneFadeDuration: 800 },
        scenes: scenesConfig,
      });

      pv.on("scenechange", (id: string) => setCurrentSceneId(id));
      pv.on("load", () => setIsLoading(false));
      setViewer(pv);
    };

    loadPannellum();
    return () => viewer?.destroy();
  }, [project.id]);

  const handleZoom = (delta: number) => {
    if (viewer) viewer.setHfov(Math.min(Math.max(viewer.getHfov() + delta, 30), 120));
  };

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      <style>{`
        .custom-hotspot { background: #395e63; border: 2px solid white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; transition: 0.3s; }
        .custom-hotspot:hover { transform: scale(1.2); background: #72f88e; }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-md h-16 flex items-center px-8 justify-between border-b border-white/10">
        <Link to="/gallery" className="text-white flex items-center gap-2 hover:text-[#395e63] transition-colors">
          <ArrowLeft size={20}/> Back
        </Link>
        <div className="text-white font-bold flex items-center gap-2">
          <Move3D size={20} className="text-[#395e63]"/> {project.title}
        </div>
        <div className="text-gray-400 text-sm">{panoramicScenes.find(s => s.id === currentSceneId)?.name}</div>
      </nav>

      {/* Viewer Container */}
      <div ref={panoramaRef} className="w-full h-full" />

      {/* Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 bg-black/60 backdrop-blur-xl p-3 rounded-full border border-white/10 z-50">
        <button onClick={() => handleZoom(10)} className="text-white p-2 hover:bg-white/10 rounded-full"><ZoomOut/></button>
        <button onClick={() => { viewer.setPitch(0); viewer.setYaw(0); }} className="text-white p-2 hover:bg-white/10 rounded-full"><RotateCcw/></button>
        <button onClick={() => handleZoom(-10)} className="text-white p-2 hover:bg-white/10 rounded-full"><ZoomIn/></button>
      </div>

      {/* Scene Thumbnails */}
      <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-50">
        {panoramicScenes.map((s) => (
          <button 
            key={s.id} 
            onClick={() => viewer.loadScene(s.id)}
            className={`w-16 h-12 rounded-lg border-2 overflow-hidden transition-all ${currentSceneId === s.id ? 'border-[#395e63] scale-110' : 'border-white/20'}`}
          >
            <img src={s.panorama} className="w-full h-full object-cover" alt={s.name} />
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-black z-[100] flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#395e63]"/>
        </div>
      )}
    </div>
  );
};

export default PanoramaViewer;