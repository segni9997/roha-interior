import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Maximize2, Layers, MapPin, Ruler, Compass, Sparkles } from "lucide-react";
import { resolveImageUrl } from '../services/api';
import { renderSuperscriptText } from '../utils/formatters';

gsap.registerPlugin(ScrollTrigger);

export interface ParallaxGridItem {
  id: number | string;
  title: string;
  subtitle: string;
  image: string;
}

export interface ParallaxGridProps {
  title?: string;
  subtitle?: string;
  description?: string;
  location?: string;
  year?: string;
  area?: string;
  floorsOrScale?: string;
  materialPalette?: string;
  materialsUsed?: string;
  styleName?: string;
  statusName?: string;
  companyLogo?: string | null;
  clientName?: string;
  parallaxImages?: ParallaxGridItem[];
  videoUrl?: string;
}

export const ParallaxGrid: React.FC<ParallaxGridProps> = ({
  title = "",
  subtitle = "",
  description = "",
  location = "",
  year = "",
  area = "",
  floorsOrScale = "",
  materialPalette = "",
  materialsUsed = "",
  styleName = "",
  statusName = "",
  companyLogo = null,
  clientName = "",
  parallaxImages = [],
  videoUrl = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const displayImages = parallaxImages;
  const resolvedLogo = resolveImageUrl(companyLogo, '/roha.png');
  const effectivePalette = materialPalette?.trim() || materialsUsed?.trim() || "";

  const rawSpecs = [
    { label: "Location", value: location, icon: MapPin },
    { label: "Spatial Area", value: area, icon: Maximize2 },
    { label: "Scale / Levels", value: floorsOrScale, icon: Layers },
    { label: "Project Year", value: year, icon: Ruler },
    { label: "Materiality", value: effectivePalette, icon: Compass },
    { label: "Execution Status", value: statusName, icon: Sparkles },
  ];

  const activeSpecs = rawSpecs.filter((s) => Boolean(s.value && s.value.trim()));
  const hasSpecsOrMeta = activeSpecs.length > 0 || Boolean(styleName?.trim() || statusName?.trim());
  const hasOverviewHeader = Boolean(title?.trim() || subtitle?.trim());
  const hasDescription = Boolean(description?.trim());
  const showOverviewSection = hasOverviewHeader || hasDescription || hasSpecsOrMeta;

  useEffect(() => {
    const ctx = gsap.context(() => {
      imageRefs.current.forEach((img, index) => {
        if (!img) return;

        const parent = img.parentElement;
        const yValue = index % 2 === 0 ? "14%" : "-14%";

        gsap.to(img, {
          y: yValue,
          ease: "none",
          scrollTrigger: {
            trigger: parent,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, containerRef);

    // Refresh scrolltrigger when images render
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [displayImages]);

  return (
    <>
      {/* -------------------- OVERVIEW & SPECS SECTION (HIDDEN IF NO TITLE/SUBTITLE/DETAILS) -------------------- */}
      {showOverviewSection && (
        <section className="w-full bg-gradient-to-b from-[#172a2b] via-[#1d424b] to-[#f5f7f7] py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-20 text-white contour-one">
          <div className="max-w-6xl mx-auto">
            {/* Header Section — only if title or subtitle has content */}
            {hasOverviewHeader && (
              <div className="border-b border-white/20 pb-8 sm:pb-10 md:pb-12 mb-8 sm:mb-10 md:mb-12">
                {subtitle?.trim() && (
                  <h2 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold text-cyan-300 mb-3 sm:mb-4">
                    {subtitle.trim()}
                  </h2>
                )}
                {title?.trim() && (
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase italic">
                    {title.trim()}
                  </h3>
                )}
              </div>
            )}

            <div className={`grid grid-cols-1 ${hasSpecsOrMeta && hasDescription ? "lg:grid-cols-3" : ""} gap-10 sm:gap-12 md:gap-16`}>
              {/* Narrative Content */}
              {hasDescription && (
                <div className={`${hasSpecsOrMeta ? "lg:col-span-2" : "w-full"} space-y-6 sm:space-y-8`}>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-tight text-slate-50 italic">
                    {description.trim()}
                  </p>
                </div>
              )}

              {/* Technical Specs */}
              {hasSpecsOrMeta && (
                <div className={`relative bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex flex-col justify-between ${!hasDescription ? "lg:col-span-3 max-w-xl mx-auto w-full" : ""}`}>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent" />

                  <div>
                    <div className="flex items-center justify-between border-b border-white/20 pb-3 sm:pb-4 mb-6 sm:mb-8">
                      <h4 className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-black text-cyan-300">
                        Architectural Specifications
                      </h4>
                      {/* Client / Company Logo (if provided, otherwise ROHA Studio Logo) */}
                      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-sm" title={companyLogo ? `Commissioned Project: ${clientName || 'Enterprise Partner'}` : "ROHA Studio Monograph"}>
                        <img
                          src={resolvedLogo}
                          alt={clientName || "ROHA Studio"}
                          className="w-5 h-5 object-contain"
                        />
                        <span className="text-[9px] font-mono uppercase text-slate-300 font-bold">
                          {companyLogo ? (clientName || "Client Logo") : "ROHA"}
                        </span>
                      </div>
                    </div>

                    {activeSpecs.length > 0 && (
                      <ul className="relative space-y-5 sm:space-y-6">
                        {activeSpecs.map((spec, i) => (
                          <li key={i} className="flex items-start gap-3 sm:gap-4">
                            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/30 shrink-0">
                              <spec.icon size={16} className="text-cyan-200" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-300">
                                {spec.label}
                              </p>
                              <p className="text-sm sm:text-base font-bold tracking-tight text-white line-clamp-2">
                                {renderSuperscriptText(spec.value)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {(styleName?.trim() || statusName?.trim()) && (
                    <div className="relative mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-cyan-200">
                      {styleName?.trim() ? <span>STYLE: {styleName.trim()}</span> : <span />}
                      {statusName?.trim() ? <span className="text-[#d4af37] font-bold">{statusName.trim()}</span> : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* -------------------- PARALLAX IMAGE GRID SECTION (FULL SCREEN) -------------------- */}
      {displayImages.length > 0 && (
        <section ref={containerRef} className="w-full bg-[#f0f0f0] py-0 relative overflow-hidden">
          <div className="absolute bg-gradient-to-b from-[#f0f0f0] from-35% h-48 sm:h-72 md:h-96 top-0 inset-0 z-10 pointer-events-none" />

          {/* Section Headline */}
          <div className="w-full px-6 sm:px-10 md:px-16 pt-16 pb-10 relative z-20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#205b63] font-bold">
                VISUAL ARCHIVE // SPATIAL PERSPECTIVES
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#172a2b] uppercase tracking-tight">
              Curated Architectural Perspectives
            </h3>
          </div>

          {/* Full-Screen Edge-to-Edge Parallax Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 w-full relative z-20 border-t border-slate-300">
            {displayImages.map((item, index) => {
              const hasCaption = Boolean(item.title?.trim() || item.subtitle?.trim());
              return (
                <div 
                  key={item.id || index}
                  className="relative h-[70vh] sm:h-[80vh] md:h-screen w-full overflow-hidden group border-b border-r border-slate-300/40 bg-slate-950"
                >
                  {/* Image Layer with GSAP Parallax */}
                  <img
                    ref={(el) => {
                      imageRefs.current[index] = el;
                    }}
                    src={item.image}
                    alt={item.title?.trim() || "Architectural Perspective"}
                    loading="lazy"
                    className="absolute -top-[15%] left-0 w-full h-[130%] object-cover scale-105 will-change-transform transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Glassy Overlay & Content — Rendered ONLY if title or subtitle has actual text. If no title and subtitle, shows NOTHING */}
                  {hasCaption ? (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-16 z-20 pointer-events-none transition-opacity duration-300">
                      {item.subtitle?.trim() ? (
                        <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-cyan-300 mb-2 drop-shadow">
                          {item.subtitle.trim()}
                        </span>
                      ) : null}
                      {item.title?.trim() ? (
                        <h4 className="text-xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">
                          {item.title.trim()}
                        </h4>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* -------------------- ARCHITECTURAL CINEMATIC VIDEO DOCUMENTATION -------------------- */}
      {videoUrl && videoUrl.trim() && (
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
              {title?.trim() && <p className="text-xs font-mono text-slate-500 uppercase">PROJECT: {title.trim()}</p>}
            </div>

            <div className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-300/80 bg-black">
              {videoUrl.match(/\.(mp4|webm|mov|mkv)($|\?)/i) || videoUrl.startsWith('/uploads/') ? (
                <video 
                  controls 
                  playsInline 
                  className="w-full h-full object-cover" 
                  src={resolveImageUrl(videoUrl)}
                />
              ) : (
                <iframe 
                  className="w-full h-full rounded-2xl sm:rounded-3xl"
                  src={videoUrl.includes('watch?v=') ? videoUrl.replace('watch?v=', 'embed/') : videoUrl} 
                  title={`${title || 'Architectural'} Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ParallaxGrid;