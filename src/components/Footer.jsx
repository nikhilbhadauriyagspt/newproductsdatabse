import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  MapPin,
  ChevronRight,
  Send,
  ShieldCheck,
  Globe,
  Lock,
  ArrowUpRight,
  Instagram,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const printerParent = data.data.find(cat => cat.slug === 'printers' || cat.id === 46);
          if (printerParent && printerParent.children) {
            setCategories(printerParent.children.slice(0, 5));
          }
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <footer className="w-full bg-[#fafbfc] font-['Rubik'] border-t border-slate-100">

      {/* MAIN FOOTER ENGINE */}
      <div className="max-w-full mx-auto px-6 lg:px-24 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">

          {/* BRAND & NEWSLETTER SIDE */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-8">
              <img src="/logo/logo.png" alt="Dash Printer shop" className="h-9 object-contain" />
            </Link>
            <p className="text-slate-500 text-base font-medium leading-relaxed max-w-sm mb-10">
              Redefining professional printing with precision-engineered hardware and global logistics expertise.
            </p>

            <div className="space-y-8">
              <form onSubmit={handleSubscribe} className="max-w-md relative group">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 block">Join our newsletter</span>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Professional email"
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl px-5 text-slate-900 text-sm outline-none focus:border-[#FF2D37] transition-all pr-12"
                  />
                  <button
                    disabled={loading}
                    type="submit"
                    className="absolute right-1.5 top-1.5 h-9 w-9 bg-[#222] text-white rounded-lg flex items-center justify-center hover:bg-[#FF2D37] transition-all disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-6 left-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                      Confirmed
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>

          {/* DYNAMIC LINKS SIDE */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-10">

            {/* DEPARTMENTS */}
            <div>
              <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] mb-8 relative">
                Department
                <span className="absolute -bottom-3 left-0 w-5 h-[2px] bg-[#FF2D37] rounded-full"></span>
              </h4>
              <ul className="space-y-4">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link to={`/shop?category=${cat.slug}`} className="text-slate-500 hover:text-[#FF2D37] font-bold text-[13px] transition-all">
                      <span className="capitalize">{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CORPORATE */}
            <div>
              <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] mb-8 relative">
                Corporate
                <span className="absolute -bottom-3 left-0 w-5 h-[2px] bg-[#FF2D37] rounded-full"></span>
              </h4>
              <ul className="space-y-4">
                {['About', 'Contact Us', 'FAQs', 'Track Order'].map(item => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-slate-500 hover:text-[#FF2D37] font-bold text-[13px] transition-all">
                      <span>{item}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] mb-8 relative">
                Policy
                <span className="absolute -bottom-3 left-0 w-5 h-[2px] bg-[#FF2D37] rounded-full"></span>
              </h4>
              <ul className="space-y-4">
                {[
                  { name: 'Privacy Policy', path: '/privacy-policy' },
                  { name: 'Terms & Conditions', path: '/terms-and-conditions' },
                  { name: 'Shipping Policy', path: '/shipping-policy' },
                  { name: 'Return Policy', path: '/return-policy' },
                  { name: 'Cookie Policy', path: '/cookie-policy' }
                ].map(link => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-slate-500 hover:text-[#FF2D37] font-bold text-[13px] transition-all">
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT */}
            <div>
              <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] mb-8 relative">
                Support
                <span className="absolute -bottom-3 left-0 w-5 h-[2px] bg-[#FF2D37] rounded-full"></span>
              </h4>
              <div className="space-y-5">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Direct Line</span>
                  <a href="mailto:info@dashprintershop.com" className="text-slate-900 font-bold text-[13px] hover:text-[#FF2D37] transition-colors break-all">info@dashprintershop.com</a>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">USA HQ</span>
                  <span className="text-slate-900 font-bold text-[13px] leading-tight">Morgantown, WV 26501</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ULTRA-MINIMAL BOTTOM BAR */}
      <div className="w-full border-t border-slate-100 bg-white py-8">
        <div className="max-w-full mx-auto px-6 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-4">
            <p className="text-slate-400 text-[11px] font-bold tracking-wide">
              &copy; {new Date().getFullYear()} <span className="text-slate-900">Dash Printer shop Inc.</span> All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <img src="/logo/PayPal.svg.webp" alt="PayPal" className="h-3.5 opacity-30 grayscale hover:opacity-100 transition-all duration-500" />
            <div className="h-3 w-px bg-slate-100"></div>
            <div className="flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
              <Lock size={11} className="text-emerald-500" /> Secured Transaction
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}
