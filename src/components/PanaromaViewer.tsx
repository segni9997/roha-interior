"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Eye,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move3D,
} from "lucide-react";
import { sampleProjects} from "./Projectdetail";
import { Link } from "react-router-dom";


declare global {
  interface Window {
    pannellum: any;
  }
}

const PanoramaViewer= () => {
const [currentSceneId, setCurrentSceneId] = useState<string | null>(
  sampleProjects[0]?.panoramicScenes?.[0]?.id ?? null
);
  const [isLoading, setIsLoading] = useState(false);
  const [viewer, setViewer] = useState<any>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);

  const panoramicScenes = sampleProjects[0].panoramicScenes || [];
  const currentScene = panoramicScenes.find(
    (scene) => scene.id === currentSceneId
  );

  useEffect(() => {
    // Load Pannellum CSS and JS
    const loadPannellum = async () => {
      // Load CSS
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href =
        "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
      document.head.appendChild(cssLink);

      // Load JS
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
      script.onload = () => {
        initializePanorama();
      };
      document.head.appendChild(script);
    };

    const initializePanorama = () => {
      if (
        panoramaRef.current &&
        window.pannellum &&
        panoramicScenes.length > 0
      ) {
        const scenesConfig: { [key: string]: any } = {};
        panoramicScenes.forEach((scene) => {
          scenesConfig[scene.id] = {
            type: "equirectangular",
            panorama: scene.panorama,
            hotSpots: scene.hotSpots,
            autoLoad: true,
            autoRotate: -2,
            compass: true,
            showControls: false, // Panellum's default controls are hidden for custom controls
            showFullscreenCtrl: false,
            showZoomCtrl: false,
            mouseZoom: true,
            doubleClickZoom: true,
            draggable: true,
            keyboardZoom: true,
            preview: scene.panorama,
          };
        });

        const newViewer = window.pannellum.viewer(panoramaRef.current, {
          default: {
            firstScene: currentSceneId,
            sceneFadeDuration: 1000, // Smooth transition between scenes
          },
          scenes: scenesConfig,
          onLoad: () => {
            setIsLoading(false);
          },
          onError: (error: any) => {
            console.error("Panorama loading error:", error);
            setIsLoading(false);
          },
        });
        setViewer(newViewer);

        // Listen for scene change events
        newViewer.on("scenechange", (newSceneId: string) => {
          setCurrentSceneId(newSceneId);
        });
      }
    };

    if (panoramicScenes.length > 0) {
      loadPannellum();
    }

    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [sampleProjects[0].id]); // Re-initialize viewer if project changes

  useEffect(() => {
    if (viewer && currentSceneId && viewer.getScene() !== currentSceneId) {
      setIsLoading(false);
      viewer.loadScene(currentSceneId);
      viewer.on("load", () => {
        setIsLoading(false);
      });
    }
  }, [currentSceneId, viewer]);

  const handlePreviousScene = () => {
    const currentIndex = panoramicScenes.findIndex(
      (s) => s.id === currentSceneId
    );
    if (currentIndex > 0) {
      setCurrentSceneId(panoramicScenes[currentIndex - 1].id);
    }
  };

  const handleNextScene = () => {
    const currentIndex = panoramicScenes.findIndex(
      (s) => s.id === currentSceneId
    );
    if (currentIndex < panoramicScenes.length - 1) {
      setCurrentSceneId(panoramicScenes[currentIndex + 1].id);
    }
  };

  const handleReset = () => {
    if (viewer) {
      viewer.setPitch(0);
      viewer.setYaw(0);
      viewer.setHfov(100);
    }
  };

  const handleZoomIn = () => {
    if (viewer) {
      const currentHfov = viewer.getHfov();
      viewer.setHfov(Math.max(currentHfov - 10, 30));
    }
  };

  const handleZoomOut = () => {
    if (viewer) {
      const currentHfov = viewer.getHfov();
      viewer.setHfov(Math.min(currentHfov + 10, 120));
    }
  };

  if (panoramicScenes.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Panoramic Tours Available
          </h2>
          <p className="text-gray-600 mb-6">
            This project doesn't have any 360° virtual tours to display.
          </p>
         
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Custom CSS for Hotspots */}
      <style>{`
        .custom-hotspot {
          background-color: #72f88e; /* Green accent */
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease-in-out,
            background-color 0.2s ease-in-out;
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
          border: 2px solid #fff;
        }
        .custom-hotspot:hover {
          transform: scale(1.1);
          background-color: #5fd670;
        }
        .custom-hotspot::before {
          content: "→"; /* Arrow icon */
          font-size: 24px;
          color: #000;
          font-weight: bold;
          line-height: 1;
        }

        .custom-info-hotspot {
          background-color: #395e63; /* Teal accent */
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease-in-out,
            background-color 0.2s ease-in-out;
          box-shadow: 0 0 8px rgba(57, 94, 99, 0.5);
          border: 2px solid #fff;
        }
        .custom-info-hotspot:hover {
          transform: scale(1.1);
          background-color: #4a7278;
        }
        .custom-info-hotspot::before {
          content: "i"; /* Info icon */
          font-size: 18px;
          color: #fff;
          font-weight: bold;
          line-height: 1;
        }
      `}</style>

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link  to="/gallery"
              className="flex items-center text-white hover:text-[#72f88e] transition-colors duration-300"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Projects
            </Link >
            <div className="flex items-center gap-2">
              <Move3D className="text-[#72f88e]" size={24} />
              <h1 className="text-xl font-bold text-white">
                360° Virtual Tour
              </h1>
            </div>
            <div className="text-white text-sm">
              {currentScene ? currentScene.name : "Loading..."} (
              {panoramicScenes.findIndex((s) => s.id === currentSceneId) + 1} /{" "}
              {panoramicScenes.length})
            </div>
          </div>
        </div>
      </nav>

      {/* Project Info Overlay */}
      <div className="fixed top-20 left-6 z-40 bg-black/70 backdrop-blur-md rounded-lg p-4 text-white max-w-sm">
        <h2 className="text-xl font-bold mb-2">{sampleProjects[0].title}</h2>
        <p className="text-sm text-gray-300 mb-2">
          {sampleProjects[0].location} • {sampleProjects[0].year}
        </p>
        <div className="inline-flex items-center gap-2 bg-[#395e63] px-3 py-1 rounded-full text-xs">
          <Eye size={14} />
          {sampleProjects[0].category}
        </div>
      </div>

      {/* Control Panel */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-black/80 backdrop-blur-md rounded-full px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePreviousScene}
            disabled={
              panoramicScenes.findIndex((s) => s.id === currentSceneId) === 0
            }
            className="p-2 text-white hover:text-[#72f88e] disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            title="Previous Scene"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            onClick={handleZoomOut}
            className="p-2 text-white hover:text-[#72f88e] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>

          <button
            onClick={handleReset}
            className="p-2 text-white hover:text-[#72f88e] transition-colors"
            title="Reset View"
          >
            <RotateCcw size={20} />
          </button>

          <button
            onClick={handleZoomIn}
            className="p-2 text-white hover:text-[#72f88e] transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>

          <button
            onClick={handleNextScene}
            disabled={
              panoramicScenes.findIndex((s) => s.id === currentSceneId) ===
              panoramicScenes.length - 1
            }
            className="p-2 text-white hover:text-[#72f88e] disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            title="Next Scene"
          >
            <ArrowLeft size={20} className="rotate-180" />
          </button>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="fixed bottom-6 right-6 z-40 bg-black/80 backdrop-blur-md rounded-lg p-3">
        <div className="flex flex-col gap-2">
          {panoramicScenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setCurrentSceneId(scene.id)}
              className={`w-16 h-12 rounded overflow-hidden border-2 transition-all relative group ${
                scene.id === currentSceneId
                  ? "border-[#72f88e] scale-110"
                  : "border-gray-600 hover:border-gray-400"
              }`}
            >
              <img
                src={scene.panorama || "/placeholder.svg"}
                alt={`View ${scene.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {scene.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-30">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#72f88e] mx-auto mb-4"></div>
            <p className="text-lg">Loading 360° Experience...</p>
          </div>
        </div>
      )}

      {/* Panorama Container */}
      <div
        ref={panoramaRef}
        className="w-full h-full"
        style={{ minHeight: "100vh" }}
      />

      {/* Instructions */}
      <div className="fixed top-20 right-6 z-40 bg-black/70 backdrop-blur-md rounded-lg p-4 text-white max-w-xs">
        <h3 className="font-bold mb-2 text-[#72f88e]">Navigation Tips</h3>
        <ul className="text-sm space-y-1 text-gray-300">
          <li>• Drag to look around</li>
          <li>• Scroll to zoom in/out</li>
          <li>• Double-click to zoom</li>
          <li>• Click hotspots to navigate</li>
        </ul>
      </div>
    </div>
  );
};

export default PanoramaViewer;
