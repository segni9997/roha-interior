import { Twitter, Instagram, Youtube, Twitch } from 'lucide-react';
import { Link } from 'react-router-dom';

import GeoButton from './Buttons';
const Footer = () => {
  return (
    <div className="font-sans">
      {/* CTA Section */}
      <section className=" bg-gradient-to-b from-[#f5f7f7] to-[#172a2b] text-white py-10 sm:py-12 md:py-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative Grid Lines */}
        {/* <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} /> */}
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12 relative z-10">
          {/* Image Circles (Left) */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 shrink-0">
            <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 border-white/20 overflow-hidden absolute top-0 left-0">
               <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400" alt="arch" className="w-full h-full object-cover" />
            </div>
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-blue-400/50 absolute top-3 right-3 sm:top-4 sm:right-4" />
          </div>

          <div className="text-center max-w-xl text-[#172a2b]">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Have a dream projects?</h2>
            <p className="text-sm sm:text-base opacity-80 mb-6 sm:mb-8 px-4">Let's talk to us, share your dream project and we will transform it into reality</p>
           <Link to="/contactus">
           <div className="flex flex-row justify-center">
             <GeoButton label='Get Started' from='172a2b' to='ffffff' textColor='#ffffff' />
           </div>
           </Link>
             {/* <button className=' relative bg-transparent border-2 border-dashed rounded-full px-3 py-1 overflow- w-fit h-10'>
                <div className="">
                   segni
                </div>
                <div className="absolute">
                  <img src={shape1} alt="" className='to transition -translate-y-32.5 w' />
                  <img src={shape2} alt="" />
                  <img src={shape3} alt="" />
                </div>
             </button> */}
          </div>

          {/* Image Circles (Right) */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 shrink-0 hidden md:block">
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full border-4 border-white/20 overflow-hidden absolute bottom-0 right-0">
                            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400" alt="arch" className="w-full h-full object-cover" />

            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white absolute bottom-6 left-3 sm:bottom-8 sm:left-4" />
          </div>
        </div>
         <footer className=" text-white pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 sm:gap-12 md:gap-16">
          <div className="flex-1 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">ROHA</h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6 sm:mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {[Twitter, Instagram, Twitch, Youtube].map((Icon, i) => (
                <div key={i} className="p-2.5 sm:p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
                  <Icon size={18} className="sm:w-5 sm:h-5" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-10 sm:gap-12 md:gap-20">
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Services</h3>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-400">
                <li className="hover:text-white cursor-pointer">Hotel design</li>
                <li className="hover:text-white cursor-pointer">Residential</li>
                <li className="hover:text-white cursor-pointer">Commercials</li>
                <li className="hover:text-white cursor-pointer">Coworking space</li>
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Company</h3>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-400">
                <li className="hover:text-white cursor-pointer">About us</li>
                <li className="hover:text-white cursor-pointer">News and update</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">Projects</li>
                <li className="hover:text-white cursor-pointer">Contact us</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 sm:mt-16 md:mt-20 pt-6 sm:pt-8 border-t border-gray-800 text-center text-gray-500 text-xs sm:text-sm">
          <p>Copyright 2026 ROHA. All rights reserved</p>
        </div>
      </footer>
      </section>


    </div>
  );
};

export default Footer;