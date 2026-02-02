"use client";

import { useState, useRef, useEffect } from "react";
import { Move3D, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { sampleProjects } from "./Projectdetail";

const PanoramaGallery = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const loaderRef = useRef<HTMLDivElement>(null);

  /* ------------------------------
     1. WINDOW SCROLL (PARALLAX)
  -------------------------------*/
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ------------------------------
     2. INTERSECTION OBSERVER
  -------------------------------*/
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(prev + 3, sampleProjects.length)
            );
          }, 600);
        }
      },
      {
        root: null, // viewport
        threshold: 0.1,
      }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  const panoramicProjects = sampleProjects
    .filter((p) => p.panoramicScenes?.length)
    .slice(0, visibleCount);

  return (
    <div className="relative bg-black text-white min-h-screen">
      {/* -------------------------------- NAVBAR -------------------------------- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Move3D className="text-[#395e63]" size={28} />
              <h1 className="text-2xl font-bold tracking-tighter">
                ROHA 360°
              </h1>
            </div>
            <span className="text-gray-400 text-sm font-medium">
              {sampleProjects.length} Virtual Tours Available
            </span>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* -------------------------------- HERO -------------------------------- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000)",
            transform: `translate3d(0, ${scrollY * 0.35}px, 0)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="inline-flex items-center gap-3 bg-[#395e63]/30 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-[#395e63]/50">
            <Move3D size={22} className="animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-semibold">
              Immersive Experience
            </span>
          </div>

          <h1 className="text-7xl md:text-9xl font-bold mb-6 tracking-tighter">
            Roha <span className="text-[#395e63]">Gallery</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Step inside our architectural masterpieces with immersive 360°
            virtual tours.
          </p>
        </div>
      </section>

      {/* ------------------------------ PROJECT GRID ------------------------------ */}
      <section className="py-24 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              Explore Our Spaces
            </h2>
            <div className="w-24 h-1 bg-[#395e63] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {panoramicProjects.map((project) => (
              <Link
                key={project.id}
                to={`/view360/${project.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-[4/5]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${
                        project.panoramicScenes?.[0]?.panorama ||
                        project.images[0]
                      })`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="absolute top-5 left-5 bg-[#395e63] px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                    <Move3D size={14} /> 360° TOUR
                  </div>

                  <div className="absolute bottom-8 left-8 right-8">
                    <span className="text-[#395e63] text-xs uppercase font-bold tracking-widest">
                      {project.category}
                    </span>
                    <h3 className="text-3xl font-bold mt-2 mb-2">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <MapPin size={14} className="text-[#395e63]" />
                      {project.location}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ------------------------------ LOADER ------------------------------ */}
          <div
            ref={loaderRef}
            className="h-40 flex items-center justify-center mt-16"
          >
            {visibleCount < sampleProjects.length ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#395e63] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-sm animate-pulse">
                  Loading more projects...
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-sm uppercase tracking-widest">
                End of Gallery
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PanoramaGallery;
