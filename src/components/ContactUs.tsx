import { useState } from 'react';
import { Mail, MapPin, Twitter, Instagram, Linkedin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import pattern from "/pattern-01.png";
import GeoButton from './Buttons';
import { NavigationOverlay } from './NavBar';
import { api } from '../services/api';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+251',
    service: 'Interior Design',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.message) {
      setStatus('error');
      setFeedbackMessage('Please provide your name, email, and message brief.');
      return;
    }

    setStatus('loading');
    setFeedbackMessage('');

    try {
      await api.submitInquiry({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        service_interest: formData.service,
        message: formData.message,
      });

      setStatus('success');
      setFeedbackMessage('Thank you! Your architectural inquiry has been received. Our team will contact you shortly.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '+251',
        service: 'Interior Design',
        message: ''
      });
    } catch {
      setStatus('error');
      setFeedbackMessage('Unable to reach backend server. Please verify connection.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#172a2b] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <NavigationOverlay />

      {/* Background Decorative Circles */}
      <div className="absolute top-20 right-[-5%] w-96 h-96 bg-cyan-400 rounded-full blur-[100px] opacity-30" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-30" />
      <div className="absolute top-[40%] left-[20%] w-24 h-24 bg-purple-500 rounded-full blur-[60px] opacity-40" />
      <div className="absolute left-0 top-0 h-full w-full overflow-hidden bg-transparent">
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
        <h1 className="text-5xl font-bold mb-2 text-[#172a2b]">Contact Us</h1>
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
                  HANAN K Plaza, 8th floor,<br />
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
          {status === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm text-gray-100">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-cyan-100 transition-colors"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-100">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-cyan-100 transition-colors"
                placeholder="Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-100">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-cyan-100 transition-colors"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-100">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-cyan-100 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-100">Area of Interest</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full bg-[#172a2b] border border-white/20 rounded-lg py-2.5 px-3 outline-none focus:border-cyan-400 text-sm text-white"
            >
              <option value="Interior Design">Interior Architecture & Curation</option>
              <option value="Scale Model Making">Precision Scale Model Making</option>
              <option value="360 Virtual Tour">360° Virtual Tour & Panoramas</option>
              <option value="General Architectural Inquiry">General Architectural Inquiry</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-100">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project scale, location, or vision..."
              className="w-full bg-transparent border-b border-white/20 py-2 outline-none focus:border-cyan-400 transition-colors resize-none h-20"
            />
          </div>

          <div className="flex justify-end pt-4">
            <div className="flex items-center gap-4">
              {status === 'loading' && (
                <span className="flex items-center gap-2 text-xs text-cyan-300 font-mono">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending brief...
                </span>
              )}
              <GeoButton
                label={status === 'loading' ? "Sending..." : "Send"}
                from="172a2b"
                to="fefefe"
                textColor="#fff"
                isuppercase="uppercase tracking-widest"
                onClick={() => handleSubmit()}
                disabled={status === 'loading'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;