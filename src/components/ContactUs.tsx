import { Mail, MapPin, Twitter, Instagram, Linkedin } from 'lucide-react';
import pattern from "/pattern-01.png"
import GeoButton from './Buttons';
const ContactUs = () => {
  return (
    <div className="min-h-screen  bg-gradient-to-t from-[#172a2b] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-20 right-[-5%] w-96 h-96 bg-cyan-400 rounded-full blur-[100px] opacity-30" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-30" />
      <div className="absolute top-[40%] left-[20%] w-24 h-24 bg-purple-500 rounded-full blur-[60px] opacity-40" />
<div className="absolute left-0 top-0 h-full  w-full overflow-hidden bg-transparent">
  <img
    src={pattern}
    alt=""
    className="
      absolute
      top-1/2
      left-0
      w-[300vh]
      h-auto
      -translate-x-1/2
      -translate-y-1/2
      rotate-90
      object-cover
    "
  />
</div>
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl font-bold mb-2 text text-[#172a2b]">Contact Us</h1>
        <p className="text-gray-400">Any question or remarks? Just write us a message!</p>
      </div>

      <div className="w-full max-w-6xl bg-white/5 backdrop-blur-xl border border-white/10 border-t-0 rounded-2xl flex flex-col md:flex-row p-4 gap-8 relative z-10 shadow-2xl">
        {/* Left Side: Contact Information */}
        <div className="md:w-2/5 bg-white/10 rounded-xl p-10 flex flex-col justify-between relative overflow-hidden">
          <div>
            <h2 className="text-2xl font-semibold mb-8">Contact Information</h2>
            <div className="space-y-10">
              <div className="flex items-start gap-4">
                <Mail className="text-white w-6 h-6" />
                <span>roha@gmail.com</span>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="text-white w-6 h-6 shrink-0" />
                <span className="text-sm leading-relaxed">
                 Golagol, Haile Gebre Silase St, Addis Ababa,<br />
                  HANAN K Plaza ,8th floor, <br />
               
                </span>
              </div>
              
            </div>
          </div>

          <div className="flex gap-4 mt-12">
            <a href="#" className="p-2 bg-cyan-500 rounded-lg hover:scale-110 transition-transform"><Twitter size={18} /></a>
            <a href="#" className="p-2 bg-pink-500 rounded-lg hover:scale-110 transition-transform"><Instagram size={18} /></a>
            <a href="#" className="p-2 bg-blue-600 rounded-lg hover:scale-110 transition-transform"><Linkedin size={18} /></a>
          </div>
          
          {/* Subtle circle inside info card */}
          <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Right Side: Form */}
        <div className="md:w-3/5 p-4 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm text-gray-100">First Name</label>
              <input type="text" className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-cyan-100 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-100">Last Name</label>
              <input type="text" className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-cyan-900 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-100">Email</label>
              <input type="email" className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-cyan-100 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-100">Phone Number</label>
              <input type="text" defaultValue="+251" className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-cyan-800 transition-colors" />
            </div>
          </div>

          {/* <div className="space-y-4">
            <p className="text-sm font-semibold">Select Subject?</p>
            <div className="flex flex-wrap gap-6">
              {['General Inquiry', 'Brand Identity', 'UI/UX', 'Packaging Design'].map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="subject" className="accent-cyan-400" />
                  {item}
                </label>
              ))}
            </div>
          </div> */}

          <div className="space-y-2">
            <label className="text-sm text-gray-100">Message</label>
            <textarea placeholder="Write your message.." className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-cyan-400 transition-colors resize-none h-20" />
          </div>

          <div className="flex justify-end pt-4">
            <p className=" flex items-center gap-2 transition-all">
         <GeoButton
          label="Send " 
          from="172a2b" 
          to="fefefe" // Purple
          textColor="#fff" // Cyan text
          isuppercase="uppercase tracking-widest"
        />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;