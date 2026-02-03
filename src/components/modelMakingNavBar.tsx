import  { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';

export default function MargaNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-[100] p-6 flex justify-center">
      {/* Main Navbar Container */}
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-full px-8 py-3 flex items-center justify-between shadow-sm">
        
        {/* Logo - Marga Style (Minimal Typography) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#395e63] rounded-full flex items-center justify-center text-white font-bold text-lg">
            R
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            Roha<span className="font-light text-slate-400">Arch</span>
          </span>
        </div>

        {/* Desktop Links - Hover Effects like Marga */}
        <div className="hidden lg:flex items-center gap-8">
          {['Home', 'About', 'Modeling', 'Interior', 'Contact', ''].map((item) => (
            <div key={item} className="group relative py-2">
              <a href={`/${item.toLowerCase()}`} className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-[#395e63] transition-colors">
                {item}
              </a>
              {/* Animated underline like Marga templates */}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#395e63] transition-all duration-300 group-hover:w-full"></span>
            </div>
          ))}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Search className="w-5 h-5 text-slate-600" />
          </button>
          <button className="hidden md:block bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#395e63] transition-all">
            Consult Now
          </button>
          
          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Reveal - Slide down animation */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-24 inset-x-6 bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl lg:hidden"
        >
          <div className="flex flex-col gap-6 text-center">
            {['Home', 'About', 'Modeling', 'Interior', 'Contact'].map((item) => (
              <a key={item} href="/" className="text-lg font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}