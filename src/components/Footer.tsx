import React from 'react';
import bg from "/ethio1.jpg"
import { 
  Twitter, 
  Instagram, 
  Youtube, 
  
  
} from 'lucide-react';
import AnimatedButton from './AnimatedButton';



interface FooterLink {
  label: string;
  href: string;
}

const Footer: React.FC = () => {
  const services: FooterLink[] = [
    { label: 'Architectural design', href: '#' },
    { label: 'Interiror Design', href: '#' },
    { label: 'Model', href: '#' },
    { label: 'Coworking space', href: '#' },
  ];

  const company: FooterLink[] = [
    { label: 'About Interiors', href: '#' },
    { label: 'About Model makers', href: '#' },
    { label: 'Blogs', href: '#' },
    // { label: 'Careers', href: '#' },
    // { label: 'Projects', href: '#' },
    // { label: 'Contact us', href: '#' },
  ];

  return (
    <div className="font-sans antialiased text-slate-900">
      
      {/* --- CTA SECTION --- */}
      <section className="bg-[#007bff] py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Visual Element */}
          {/* <div className="hidden lg:block relative group">
            <div className="w-52 h-72 border-8 border-white/10 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000" 
                alt="Modern Skyscraper" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-full shadow-xl">
              <Building2 className="text-[#007bff] w-6 h-6" />
            </div>
          </div> */}

          <div className="relative h-[400px]">
  <img 
    src={bg} 
    className="absolute inset-0 w-full h-full object-cover [mask-image:]" 
    
  />
  <h1 className="relative text-white pt-20 pl-10">Modern Skyscraper</h1>
</div>

          {/* Center Content */}
          <div className="text-center md:text-left flex-1 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Have a dream <span className="underline decoration-white/30">project?</span>
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed">
              Let's talk to us, share your vision, and we will transform your architectural concepts into livable reality.
            </p>
           <AnimatedButton to="/projects">
    VIEW PROJECTS
  </AnimatedButton>
          </div>

          {/* Right Visual Element */}
          <div className="hidden lg:block relative group">
            <div className="w-72 h-72 rounded-full border-8 border-white/10 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=1000" 
                alt="Architecture Interior" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="bg-[#121416] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-8">
            <h2 className="text-3xl font-black tracking-tighter italic">Roha.</h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Leading the industry in sustainable urban design and biomimetic architecture. We build spaces that breathe.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={20} />} href="#" />
              <SocialIcon icon={<Instagram size={20} />} href="#" />
              <SocialIcon icon={<Youtube size={20} />} href="#" />
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterColumn title="Services" links={services} />
            <FooterColumn title="Company" links={company} />
            
            {/* Newsletter / Contact Hint */}
            <div className="hidden sm:block">
              <h3 className="text-lg font-bold mb-6 text-white">Office</h3>
              <p className="text-slate-400 text-sm leading-6">
                123 Design District<br />
                Manhattan, NY 10001<br />
                contact@Roha.arch
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© 2026 Roha Design Studio. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Sub-components for better organization
const FooterColumn = ({ title, links }: { title: string, links: FooterLink[] }) => (
  <div>
    <h3 className="text-lg font-bold mb-6 text-white">{title}</h3>
    <ul className="space-y-4">
      {links.map((link) => (
        <li key={link.label}>
          <a href={link.href} className="text-slate-400 hover:text-[#007bff] transition-colors duration-200">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const SocialIcon = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
  <a 
    href={href} 
    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#007bff] hover:text-white transition-all duration-300 border border-white/10"
  >
    {icon}
  </a>
);

export default Footer;