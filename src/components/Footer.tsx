import { Twitter, Instagram, Youtube, Twitch } from 'lucide-react';
import { Link } from 'react-router-dom';
import GeoButton from './Buttons';
import { FloatingShape, SHAPES } from './FloatingShapes';

const Footer = () => {
  return (
    <div className="font-sans relative overflow-hidden">
      {/* CTA Section */}
      <section className="bg-gradient-to-b from-[#f5f7f7] via-[#205b63]/20 to-[#0e1719] text-white py-14 sm:py-18 md:py-24 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Floating 3D Geometric Shapes with varied blur levels, sizes and positions */}
        <FloatingShape
          src={SHAPES.diamond}
          size={85}
          top="10%"
          left="5%"
          blur="1px"
          opacity={0.4}
          rotate={-15}
          duration={7.5}
        />
        <FloatingShape
          src={SHAPES.cone}
          size={100}
          top="20%"
          right="6%"
          blur="2px"
          opacity={0.35}
          rotate={20}
          duration={9}
          delay={0.8}
        />
        <FloatingShape
          src={SHAPES.cubeAlt1}
          size={60}
          bottom="25%"
          left="8%"
          blur="none"
          opacity={0.35}
          rotate={-30}
          duration={6.5}
          delay={1.5}
        />
        <FloatingShape
          src={SHAPES.cylinder}
          size={70}
          bottom="20%"
          right="10%"
          blur="none"
          opacity={0.35}
          rotate={15}
          duration={8}
          delay={2}
        />
        <FloatingShape
          src={SHAPES.cubeAlt2}
          size={95}
          top="50%"
          right="2%"
          blur="3px"
          opacity={0.25}
          rotate={40}
          duration={10}
          delay={1}
        />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12 relative z-20">
          {/* Image Circles (Left) */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 shrink-0">
            <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden absolute top-0 left-0 bg-[#0e1719]">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400" alt="arch" className="w-full h-full object-cover" />
            </div>
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-[#205b63]/60 backdrop-blur-md absolute top-3 right-3 sm:top-4 sm:right-4 border border-white/30 shadow-lg" />
          </div>

          <div className="text-center max-w-xl text-slate-900">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] font-bold text-[#205b63] mb-2 block">
              Start A Commission
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight uppercase">
              HAVE A VISIONARY PROJECT?
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium opacity-90 mb-6 sm:mb-8 px-4 leading-relaxed border-r-4 border-[#205b63] pr-4 sm:pr-5 inline-block text-left">
              Connect with our master architects and scale modelers to transform your spatial concepts into built reality.
            </p>
            <Link to="/contactus" className="inline-block">
              <div className="flex flex-row justify-center">
                <GeoButton label="Get Started" from="172a2b" to="205b63" textColor="#ffffff" />
              </div>
            </Link>
          </div>

          {/* Image Circles (Right) */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 shrink-0 hidden md:block">
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden absolute bottom-0 right-0 bg-[#0e1719]">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400" alt="interior" className="w-full h-full object-cover" />
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-cyan-400/40 backdrop-blur-md absolute bottom-6 left-3 sm:bottom-8 sm:left-4 border border-white/40 shadow-lg" />
          </div>
        </div>

        {/* Global Footer Links */}
        <footer className="text-white pt-16 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 relative z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 sm:gap-12 md:gap-16">
            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <img src="/roha.png" alt="ROHA Logo" className="w-10 h-10 object-contain" />
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">ROHA STUDIO</h2>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 sm:mb-8 font-light">
                Architectural design, master spatial planning, and high-precision physical scale model fabrication. Shaping spaces that evoke human emotion and elevate built environments.
              </p>
              <div className="flex gap-3 sm:gap-4">
                {[Twitter, Instagram, Twitch, Youtube].map((Icon, i) => (
                  <div key={i} className="p-2.5 sm:p-3 bg-white/10 hover:bg-[#205b63] border border-white/15 rounded-full transition-all duration-300 cursor-pointer shadow-md">
                    <Icon size={18} className="text-white sm:w-5 sm:h-5" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-10 sm:gap-12 md:gap-20">
              <div>
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-cyan-300 mb-4 sm:mb-6 font-mono">
                  Disciplines
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-300">
                  <li className="hover:text-cyan-300 transition-colors cursor-pointer">
                    <Link to="/interior">Architectural Design</Link>
                  </li>
                  <li className="hover:text-cyan-300 transition-colors cursor-pointer">
                    <Link to="/model-making">Modeling Making</Link>
                  </li>
                  <li className="hover:text-cyan-300 transition-colors cursor-pointer">
                    <Link to="/gallery">360° Panorama Tours</Link>
                  </li>
                  <li className="hover:text-cyan-300 transition-colors cursor-pointer">
                    <Link to="/allblogs">Spatial Case Studies</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-cyan-300 mb-4 sm:mb-6 font-mono">
                  Studio
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-300">
                  <li className="hover:text-cyan-300 transition-colors cursor-pointer">
                    <Link to="/">Home Experience</Link>
                  </li>
                  <li className="hover:text-cyan-300 transition-colors cursor-pointer">
                    <Link to="/allblogs">Journal & Articles</Link>
                  </li>
                  <li className="hover:text-cyan-300 transition-colors cursor-pointer">
                    <Link to="/contactus">Client Consultation</Link>
                  </li>
                  <li className="hover:text-cyan-300 transition-colors cursor-pointer">
                    <Link to="/admin">Executive Portal</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 border-t border-slate-800 text-center text-slate-400 text-xs sm:text-sm font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 ROHA Architectural Studio & Scale Model Making. All rights reserved.</p>
            <p className="text-slate-500">Precision Physical Scale & Spatial Architecture</p>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Footer;