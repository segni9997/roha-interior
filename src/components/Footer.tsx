import { Twitter, Instagram, Youtube, Twitch } from 'lucide-react';
import { Link } from 'react-router-dom';

import GeoButton from './Buttons';
const Footer = () => {
  return (
    <div className="font-sans">
      {/* CTA Section */}
      <section className=" bg-gradient-to-b from-white to-[#172a2b] text-white py-16 px-6 relative overflow-hidden">
        {/* Decorative Grid Lines */}
        {/* <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} /> */}
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          {/* Image Circles (Left) */}
          <div className="relative w-64 h-64 shrink-0">
            <div className="w-48 h-48 rounded-full border-4 border-white/20 overflow-hidden absolute top-0 left-0">
               <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400" alt="arch" className="w-full h-full object-cover" />
            </div>
            <div className="w-20 h-20 rounded-full bg-blue-400/50 absolute top-4 right-4" />
          </div>

          <div className="text-center max-w-xl text-[#172a2b]">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 ">Have a dream projects?</h2>
            <p className="opacity-80 mb-8">Let's talk to us, share your dream project and we will transform it into reality</p>
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
          <div className="relative w-64 h-64 shrink-0 hidden md:block">
            <div className="w-56 h-56 rounded-full border-4 border-white/20 overflow-hidden absolute bottom-0 right-0">
                            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400" alt="arch" className="w-full h-full object-cover" />

            </div>
            <div className="w-16 h-16 rounded-full bg-white absolute bottom-8 left-4" />
          </div>
        </div>
         <footer className=" text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
          <div className="flex-1 max-w-md">
            <h2 className="text-3xl font-bold mb-6">ROHA</h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Twitch, Youtube].map((Icon, i) => (
                <div key={i} className="p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
                  <Icon size={20} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-20">
            <div>
              <h3 className="text-lg font-bold mb-6">Services</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-white cursor-pointer">Hotel design</li>
                <li className="hover:text-white cursor-pointer">Residential</li>
                <li className="hover:text-white cursor-pointer">Commercials</li>
                <li className="hover:text-white cursor-pointer">Coworking space</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Company</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-white cursor-pointer">About us</li>
                <li className="hover:text-white cursor-pointer">News and update</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">Projects</li>
                <li className="hover:text-white cursor-pointer">Contact us</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>Copyright 2023 Hirings. All rights reserved</p>
        </div>
      </footer>
      </section>

      {/* Footer Section */}
     
    </div>
  );
};

export default Footer;