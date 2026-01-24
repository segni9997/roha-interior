"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Move3D, MapPin, Calendar, Eye } from "lucide-react";

import { Link } from "react-router-dom";


const PanoramaGallery = () => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollY(containerRef.current.scrollTop);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Filter projects that have panoramic images
  const panoramicProjects = sampleProjects.filter(
    (project) => project.panoramicScenes && project.panoramicScenes.length > 0
  );

  return (
    <div ref={containerRef} className="h-screen overflow-y-auto bg-black">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Move3D className="text-[#395e63]" size={28} />
              <h1 className="text-2xl font-bold text-white">360° GALLERY</h1>
            </div>
            <div className="text-white text-sm">
              {panoramicProjects.length} Virtual Tours
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden mt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/placeholder.svg?height=1080&width=1920&query=360 degree panoramic architectural interior)`,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-[#395e63]/20 backdrop-blur-sm px-6 py-3 rounded-full text-lg mb-6">
            <Move3D size={24} />
            <span className="font-semibold">Immersive 360° Experience</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight font-primary ">
            Roha
            <span className="block text-[#395e63]"> Gallery</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Step inside our architectural masterpieces with immersive 360°
            virtual tours that bring spaces to life
          </p>
          <div className="flex items-center justify-center gap-8 text-lg">
            <div className="flex items-center gap-2">
              <Eye size={20} />
              <span>{panoramicProjects.length} Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <Move3D size={20} />
              <span>Full 360° Views</span>
            </div>
          </div>
        </div>
      </section>

      {/* 360° Projects Grid */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Explore Our Spaces
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience architecture like never before with our collection of
              360° virtual tours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {panoramicProjects.map((project) => (
              <Link to="/view360">
                <div key={project.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl mb-6 bg-gray-800">
                    {/* Preview Image */}
                    <div
                      className="h-80 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${
                          project.panoramicScenes?.[0]?.panorama ||
                          project.images[0]
                        })`,
                      }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300"></div>

                      {/* 360° Indicator */}
                      <div className="absolute top-4 left-4 bg-[#395e63] text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                        <Move3D size={16} />
                        360°
                      </div>

                      {/* Image Count */}
                      <div className="absolute top-4 right-4 bg-white/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                        {project.panoramicScenes?.length || 0} Views
                      </div>

                      {/* Hover Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-20 h-20 bg-[#395e63]/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Move3D size={32} className="text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="inline-flex items-center gap-2 bg-[#395e63] px-3 py-1 rounded-full text-sm mb-3">
                        {project.category}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-[#395e63] transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-4 text-white/90 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          {project.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          {project.year}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="px-2">
                    <p className="text-gray-400 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {panoramicProjects.length === 0 && (
            <div className="text-center py-20">
              <Move3D size={64} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                No 360° Tours Available
              </h3>
              <p className="text-gray-400">
                We're working on adding more immersive experiences
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="group">
              <div className="w-20 h-20 bg-[#395e63]/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#395e63]/30 transition-colors">
                <Move3D size={40} className="text-[#395e63]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Full 360° Views
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Experience complete panoramic views of our architectural spaces
                with smooth navigation and zoom controls
              </p>
            </div>

            <div className="group">
              <div className="w-20 h-20 bg-[#395e63]/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#395e63]/30 transition-colors">
                <Eye size={40} className="text-[#395e63]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Immersive Experience
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Feel like you're actually walking through our buildings with
                high-resolution panoramic photography
              </p>
            </div>

            <div className="group">
              <div className="w-20 h-20 bg-[#395e63]/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#395e63]/30 transition-colors">
                <ArrowLeft size={40} className="text-[#395e63] rotate-45" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Interactive Navigation
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Intuitive controls let you explore every angle and detail of our
                architectural masterpieces
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-t from-[#395e63] to-gray-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience Architecture in 360°?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover how our immersive virtual tours can showcase your next
            architectural project
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#395e63] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#5fd670] transition-colors duration-300 flex items-center justify-center gap-2">
              <Move3D size={20} />
              Create Virtual Tour
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PanoramaGallery;
