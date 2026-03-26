import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import {
  Mail,
  MapPin,
  Send,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Headphones,
  ChevronDown,
  Clock,
  Globe,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';
import API_BASE_URL from '../config';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          origin: window.location.origin
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: '',
        });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-['Rubik'] text-[#222] pb-14 md:pb-20">
      <SEO
        title="Contact Us | Printer Mania Support"
        description="Connect with the Printer Mania team for support, orders, or hardware inquiries."
      />

      {/* PAGE HEADER */}
      <div className="bg-[#f5f5f5] border-b border-[#dddddd]">
        <div className="w-full px-4 md:px-6 xl:px-10 py-8 md:py-10">
          <div className="flex flex-col gap-5">
            <nav className="flex items-center gap-2 text-[12px] font-semibold text-[#7a7a7a]">
              <Link to="/" className="hover:text-[#ff3b30] transition-colors">
                Home
              </Link>
              <ChevronRight size={14} className="text-[#bdbdbd]" />
              <span className="text-[#ff3b30]">Contact</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#dddddd] pb-4">
              <div className="flex items-center gap-3">
                <ChevronsRight
                  size={26}
                  className="text-[#ff3b30] shrink-0"
                  strokeWidth={3}
                />
                <h1 className="text-[26px] md:text-[30px] font-extrabold uppercase tracking-tight text-[#1f2937]">
                  Get In Touch
                </h1>
              </div>

              <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#666]">
                <Headphones size={16} className="text-[#ff3b30]" />
                <span>Support Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 xl:px-10 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* LEFT INFO */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#e5e5e5] p-6 md:p-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-sm bg-[#fff5f5] text-[#ff3b30] mb-5">
                <Mail size={22} />
              </div>

              <h4 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#888] mb-3">
                Email Support
              </h4>

              <p className="text-[22px] md:text-[24px] font-bold text-[#222] leading-tight break-words">
                info@dashprintershop.com
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <Clock size={12} />
                <span>Response in 24 hours</span>
              </div>
            </div>

            <div className="bg-white border border-[#e5e5e5] p-6 md:p-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-sm bg-[#fff5f5] text-[#ff3b30] mb-5">
                <MapPin size={22} />
              </div>

              <h4 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#888] mb-3">
                Store Location
              </h4>

              <p className="text-[20px] md:text-[22px] font-bold text-[#222] leading-snug">
                78 Holland Ave,
                <br />
                Morgantown, WV 26501,
                <br />
                USA
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium text-[#ff3b30] uppercase bg-[#fff5f5] px-3 py-1 rounded-full border border-[#ffd9dc]">
                <Globe size={12} />
                <span>United States Delivery</span>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-[#e5e5e5] p-6 md:p-8">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 md:py-14"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={36} />
                  </div>

                  <h2 className="text-[28px] md:text-[34px] font-bold text-[#222] mb-4">
                    Message Sent Successfully
                  </h2>

                  <p className="text-[#666] text-[15px] md:text-[17px] mb-8 max-w-[560px] mx-auto leading-relaxed">
                    Thank you for reaching out. Our team will review your request and get back to you shortly.
                  </p>

                  <button
                    onClick={() => setStatus(null)}
                    className="h-[44px] px-8 bg-[#111] text-white text-[13px] font-semibold uppercase rounded-sm hover:bg-[#ff3b30] transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <div>
                      <label className="block text-[12px] font-semibold uppercase tracking-[0.18em] text-[#888] mb-3">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full h-[48px] px-4 bg-white border border-[#dcdcdc] rounded-sm outline-none text-[14px] font-medium text-[#222] focus:border-[#ff3b30] transition-all placeholder:text-[#999]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold uppercase tracking-[0.18em] text-[#888] mb-3">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full h-[48px] px-4 bg-white border border-[#dcdcdc] rounded-sm outline-none text-[14px] font-medium text-[#222] focus:border-[#ff3b30] transition-all placeholder:text-[#999]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <div>
                      <label className="block text-[12px] font-semibold uppercase tracking-[0.18em] text-[#888] mb-3">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full h-[48px] px-4 bg-white border border-[#dcdcdc] rounded-sm outline-none text-[14px] font-medium text-[#222] focus:border-[#ff3b30] transition-all placeholder:text-[#999]"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold uppercase tracking-[0.18em] text-[#888] mb-3">
                        Subject
                      </label>
                      <div className="relative">
                        <select
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({ ...formData, subject: e.target.value })
                          }
                          className="w-full h-[48px] px-4 pr-10 bg-white border border-[#dcdcdc] rounded-sm outline-none text-[14px] font-medium text-[#222] focus:border-[#ff3b30] transition-all appearance-none cursor-pointer"
                        >
                          <option>General Inquiry</option>
                          <option>Technical Support</option>
                          <option>Order Tracking</option>
                          <option>Bulk Orders</option>
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"
                          size={16}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[0.18em] text-[#888] mb-3">
                      Message
                    </label>
                    <textarea
                      required
                      rows="6"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full p-4 bg-white border border-[#dcdcdc] rounded-sm outline-none text-[14px] font-medium text-[#222] focus:border-[#ff3b30] transition-all resize-none placeholder:text-[#999]"
                    ></textarea>
                  </div>

                  <button
                    disabled={loading}
                    className="w-full h-[48px] bg-[#111] text-white flex items-center justify-center gap-2 text-[13px] font-semibold uppercase rounded-sm hover:bg-[#ff3b30] transition-all disabled:opacity-50 group"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <p className="text-center text-red-500 text-[12px] font-semibold uppercase tracking-[0.16em]">
                      Error sending message. Please try again.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}