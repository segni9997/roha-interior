import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Building2, Home, Landmark, Loader2, type LucideIcon } from "lucide-react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { fragmentShader, vertexShader } from "../utils/shaders";
import ParallaxGrid, { type ParallaxGridItem } from "./ParallaxGrid";
import Footer from "./Footer";
import GeoButton from "./Buttons";
import { NavigationOverlay } from "./NavBar";
import {
  api,
  resolveImageUrl,
  type InteriorProjectDetailItem,
  type ModelProjectDetailItem,
} from "../services/api";

gsap.registerPlugin(ScrollTrigger);

interface Config {
  color: string;
  spread: number;
}

function ProjectDetails() {
  const [searchParams] = useSearchParams();
  const projectIdParam = searchParams.get("id");
  const projectTypeParam = searchParams.get("type") || "interior";

  const [project, setProject] = useState<InteriorProjectDetailItem | ModelProjectDetailItem | null>(null);
  const [parallaxImages, setParallaxImages] = useState<ParallaxGridItem[]>([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  /* ===========================
     FETCH BACKEND PROJECT DATA
  ============================ */
  useEffect(() => {
    let isMounted = true;

    async function fetchProjectData() {
      try {
        setLoading(true);

        if (projectTypeParam === "model") {
          let current: ModelProjectDetailItem | null = null;
          const allModels = await api.getModelProjects().catch(() => []);

          if (projectIdParam) {
            current = await api.getModelProject(Number(projectIdParam)).catch(() => null);
          }
          if (!current && allModels.length > 0) {
            current = await api.getModelProject(allModels[0].id).catch(() => null);
          }

          if (isMounted && current) {
            setProject(current);

            // Construct parallax items strictly from this project's backend gallery
            const items: ParallaxGridItem[] = [];
            if (current.gallery_images && current.gallery_images.length > 0) {
              current.gallery_images.forEach((g) => {
                items.push({
                  id: g.id,
                  title: g.caption ? g.caption.trim() : '',
                  subtitle: g.subtitle ? g.subtitle.trim() : '',
                  image: resolveImageUrl(g.image),
                });
              });
            } else if (current.cover_image) {
              // If no separate gallery images uploaded, show this project's main image only
              items.push({
                id: `model-${current.id}`,
                title: '',
                subtitle: '',
                image: resolveImageUrl(current.cover_image),
              });
            }

            setParallaxImages(items);
          }
        } else {
          // Interior Architecture Project
          let current: InteriorProjectDetailItem | null = null;
          const allInteriors = await api.getInteriorProjects().catch(() => []);

          if (projectIdParam) {
            current = await api.getInteriorProject(Number(projectIdParam)).catch(() => null);
          }
          if (!current && allInteriors.length > 0) {
            current = await api.getInteriorProject(allInteriors[0].id).catch(() => null);
          }

          if (isMounted && current) {
            setProject(current);

            // Construct parallax items strictly from this project's backend gallery
            const items: ParallaxGridItem[] = [];
            if (current.gallery_images && current.gallery_images.length > 0) {
              current.gallery_images.forEach((g) => {
                items.push({
                  id: g.id,
                  title: g.caption ? g.caption.trim() : '',
                  subtitle: g.subtitle ? g.subtitle.trim() : '',
                  image: resolveImageUrl(g.image),
                });
              });
            } else if (current.cover_image) {
              // If no separate gallery images uploaded, show this project's main image only
              items.push({
                id: `interior-${current.id}`,
                title: '',
                subtitle: '',
                image: resolveImageUrl(current.cover_image),
              });
            }

            setParallaxImages(items);
          }
        }
      } catch (err) {
        console.error("Failed to load project details from backend", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProjectData();

    return () => {
      isMounted = false;
    };
  }, [projectIdParam, projectTypeParam]);

  /* ===========================
     SHADER SETUP (THREE.JS)
  ============================ */
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const CONFIG: Config = {
      color: "#172a2b",
      spread: 0.55,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return new THREE.Vector3(r, g, b);
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uColor: { value: hexToRgb(CONFIG.color) },
        uSpread: { value: CONFIG.spread },
      },
    });

    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    };

    resize();
    window.addEventListener("resize", resize);

    let rafId: number;
    const render = () => {
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(render);
    };
    render();

    const tween = gsap.to(material.uniforms.uProgress, {
      value: 1.2,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
      tween.kill();
      tween.scrollTrigger?.kill();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Compute dynamic tags from backend specifications
  const dynamicTags: { icon: LucideIcon; name: string }[] = project
    ? [
        {
          icon: Building2,
          name: (project as InteriorProjectDetailItem).category_name || "Luxury",
        },
        {
          icon: Home,
          name:
            (project as InteriorProjectDetailItem).specifications?.style ||
            (project as ModelProjectDetailItem).scale_ratio ||
            "Architectural",
        },
        {
          icon: Landmark,
          name:
            (project as InteriorProjectDetailItem).specifications?.status ||
            (project as ModelProjectDetailItem).specifications?.status ||
            "Completed",
        },
      ]
    : [
        { icon: Building2, name: "Luxury" },
        { icon: Home, name: "Premium" },
        { icon: Landmark, name: "Architectural" },
      ];

  const heroImageSrc = resolveImageUrl(project?.cover_image, "/confrence1.png");
  const heroSubtitle = project?.subtitle || "Transforming the Future of Contemporary Living";
  const heroTitle = project?.title ? project.title.toUpperCase() : "PRESENTATIONAL";

  return (
    <>
      <NavigationOverlay />

      {/* -------------------- HERO SECTION -------------------- */}
      <section
        ref={containerRef}
        className="relative h-screen w-full bg-gradient-to-t from-[#f5f7f7] to-[#172a2b] overflow-hidden flex items-center justify-center"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-40"
        />

        {/* Background Watermark Silhouette from Backend */}
        <div className="absolute w-full md:bottom-0 top-60 scale-105 opacity-10 pointer-events-none flex justify-center">
          <img
            src={heroImageSrc}
            alt=""
            className="w-full max-h-[85vh] object-contain filter blur-[1px]"
          />
        </div>

        {/* The Glassy Background Layer */}
        <div className="absolute inset-0 bg-radial from-white/5 to-transparent z-0" />

        <div className="flex w-full h-full px-6 sm:px-10 flex-col relative z-10">
          {/* Background Text (The Large Heading) from Backend */}
          <div className="flex flex-col items-center text-white pt-10 h-1/2 select-none text-center">
            <span className="text-xs sm:text-sm md:text-xl font-light tracking-[0.3em] sm:tracking-[0.4em] uppercase opacity-80 mb-4 text-cyan-200">
              {heroSubtitle}
            </span>
            <h1 className="text-[10vw] sm:text-[11.5vw] font-black tracking-tighter md:relative absolute top-64 md:top-24 leading-none opacity-40 uppercase truncate max-w-full px-4">
              {heroTitle}
            </h1>
          </div>

          {/* Interactive Layer (Middle and Sides) */}
          <div className="flex flex-row h-2/3 relative -mt-20">
            {/* LEFT SIDE: Call to Action - hidden on mobile */}
            <div className="hidden md:flex flex-col items-start w-[25%] justify-center text-[#172a2b] z-30">
              <p className="text-lg font-medium mb-6 leading-tight opacity-90 w-56 font-sans">
                {project?.description
                  ? project.description.slice(0, 65) + "..."
                  : "Start building your dream home today"}
              </p>
              <Link to="/contactus">
                <GeoButton label="Get Started" from="f0f0f0" to="1d424b" />
              </Link>
            </div>

            {/* MIDDLE: THE HERO IMAGE FROM BACKEND */}
            <div className="md:w-[50%] w-full relative z-20 flex justify-center">
              <div className="absolute md:-top-40 -top-32 h-[130%] w-full flex justify-center items-center">
                {loading ? (
                  <div className="flex flex-col items-center justify-center text-white/50 gap-2">
                    <Loader2 size={36} className="animate-spin text-cyan-300" />
                    <span className="text-xs font-mono uppercase tracking-widest">
                      Loading Spatial Model...
                    </span>
                  </div>
                ) : (
                  <img
                    src={heroImageSrc}
                    alt={project?.title || "Architectural Model"}
                    className="h-full object-contain md:scale-100 scale-125 drop-shadow-[0_35px_35px_rgba(0,0,0,0.55)] transition-all duration-700"
                  />
                )}
              </div>
            </div>

            {/* RIGHT SIDE: GLASSY TAGS FROM BACKEND - hidden on mobile */}
            <div className="hidden md:flex flex-col items-end w-[25%] justify-center gap-4 z-30">
              {dynamicTags.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-3 px-6 rounded-full 
                               bg-black/20 backdrop-blur-xl border border-white/15 
                               hover:bg-white/10 transition-all cursor-pointer group shadow-lg"
                  >
                    <Icon
                      size={20}
                      className="text-amber-400 group-hover:scale-110 transition-transform"
                    />
                    <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE VERSION: left & right sections stacked under the hero */}
          <div className="flex flex-col md:hidden mt-6 px-4 gap-6 z-30 pb-6">
            <div className="flex flex-col items-center text-center">
              <p className="text-sm font-medium mb-4 leading-tight opacity-90 w-full max-w-xs text-[#172a2b]">
                {project?.description
                  ? project.description.slice(0, 70) + "..."
                  : "Start building your dream home today"}
              </p>
              <Link to="/contactus">
                <GeoButton label="Get Started" from="f0f0f0" to="1d424b" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5">
              {dynamicTags.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 py-2 px-4 rounded-full 
                               bg-black/20 backdrop-blur-xl border border-white/15 
                               hover:bg-white/10 transition-colors cursor-pointer group"
                  >
                    <Icon size={15} className="text-amber-400" />
                    <span className="text-white text-xs font-bold uppercase tracking-widest">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- PARALLAX GRID & VIDEO (ALL BACKEND POWERED) -------------------- */}
      <ParallaxGrid
        title={project?.title || ""}
        subtitle={project?.subtitle || ""}
        description={project?.description || ""}
        location={(project as InteriorProjectDetailItem)?.location || ""}
        year={project?.year || ""}
        area={
          (project as InteriorProjectDetailItem)?.specifications?.area ||
          (project as ModelProjectDetailItem)?.dimensions_cm ||
          ""
        }
        floorsOrScale={
          (project as InteriorProjectDetailItem)?.specifications?.floors
            ? `${(project as InteriorProjectDetailItem).specifications?.floors} Levels`
            : (project as ModelProjectDetailItem)?.scale_ratio || ""
        }
        materialPalette={
          (project as InteriorProjectDetailItem)?.specifications?.material_palette ||
          (project as ModelProjectDetailItem)?.materials_used ||
          ""
        }
        styleName={
          (project as InteriorProjectDetailItem)?.specifications?.style ||
          (project as ModelProjectDetailItem)?.category_name ||
          ""
        }
        statusName={
          (project as InteriorProjectDetailItem)?.specifications?.status ||
          (project as ModelProjectDetailItem)?.specifications?.status ||
          ""
        }
        parallaxImages={parallaxImages}
        videoUrl={project?.video_url || ""}
      />

      <Footer />
    </>
  );
}

export default ProjectDetails;