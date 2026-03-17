import React from 'react';
import SEO from '@/components/SEO';
import {
  ShieldCheck,
  Zap,
  Globe,
  Printer,
  Package,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Headphones,
  Leaf,
  Wrench,
  Target,
  Users,
  ChevronsRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const capabilities = [
    {
      icon: Printer,
      title: "Top Quality Products",
      desc: "Expert selection of LaserJet, All-in-One, and high-volume industrial systems tailored for your business needs."
    },
    {
      icon: Package,
      title: "Supply Chain Excellence",
      desc: "Source for 100% genuine ink, toner, and certified replacement parts with rapid nationwide delivery."
    },
    {
      icon: Headphones,
      title: "Quick Assistance",
      desc: "Factory-trained technicians providing troubleshooting, installation guidance, and long-term hardware maintenance."
    }
  ];

  const advantages = [
    { title: "Verified Status", icon: ShieldCheck },
    { title: "Genuine Supplies", icon: Package },
    { title: "Hardware Service", icon: Zap },
    { title: "Safe Logistics", icon: Globe },
    { title: "Original Hardware", icon: CheckCircle2 },
    { title: "Quick Assistance", icon: Headphones },
    { title: "Sustainable Tech", icon: Leaf },
    { title: "Professional Hub", icon: Wrench }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-['Rubik'] text-[#222] pb-14 md:pb-20">
      <SEO
        title="About Us | Our Mission"
        description="Learn about our commitment to hardware excellence, our journey, and the core pillars that drive our specialized services."
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
              <span className="text-[#ff3b30]">About Us</span>
            </nav>

            <div className="flex items-center gap-3 border-b border-[#dddddd] pb-4">
              <ChevronsRight
                size={26}
                className="text-[#ff3b30] shrink-0"
                strokeWidth={3}
              />
              <h1 className="text-[26px] md:text-[30px] font-extrabold uppercase tracking-tight text-[#1f2937]">
                Hardware Excellence
              </h1>
            </div>

            <p className="max-w-[820px] text-[15px] md:text-[18px] leading-relaxed text-[#666]">
              A new generation partner bridging the gap between complex technology and a seamless experience.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 xl:px-10 py-8 md:py-10 space-y-8 md:space-y-10">
        {/* VISION SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white border border-[#e5e5e5] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <ChevronsRight
                size={24}
                className="text-[#ff3b30] shrink-0"
                strokeWidth={3}
              />
              <h2 className="text-[22px] md:text-[24px] font-extrabold uppercase tracking-tight text-[#222]">
                The Vision
              </h2>
            </div>

            <h3 className="text-[28px] md:text-[34px] font-bold leading-tight text-[#1f2937] mb-4">
              Built on trust and precision
            </h3>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 h-[42px] px-5 bg-[#111] text-white text-[13px] font-semibold uppercase rounded-sm hover:bg-[#ff3b30] transition-all"
            >
              Browse Catalog
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-white border border-[#e5e5e5] p-6 md:p-8 space-y-5">
            <p className="text-[15px] md:text-[17px] text-[#666] leading-relaxed">
              Founded in 2026, Dash Printer shop was established to solve a singular challenge: making the acquisition of high-performance printing infrastructure simple, transparent, and absolutely authentic.
            </p>
            <p className="text-[15px] md:text-[17px] text-[#666] leading-relaxed">
              As a new generation partner, we bridge the gap between complex industrial technology and a seamless, personalized experience. Technology should work as hard as you do.
            </p>
          </div>
        </div>

        {/* CORE CAPABILITIES */}
        <div className="bg-white border border-[#e5e5e5]">
          <div className="flex items-center gap-3 border-b border-[#ededed] px-6 md:px-8 py-5">
            <ChevronsRight
              size={24}
              className="text-[#ff3b30] shrink-0"
              strokeWidth={3}
            />
            <h2 className="text-[22px] md:text-[24px] font-extrabold uppercase tracking-tight text-[#222]">
              Core Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {capabilities.map((item, i) => (
              <div
                key={i}
                className={`p-6 md:p-8 ${i < 2 ? 'md:border-r border-[#ededed]' : ''}`}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-sm bg-[#fff5f5] text-[#ff3b30] mb-5">
                  <item.icon size={22} />
                </div>
                <h3 className="text-[20px] font-bold text-[#222] mb-3">
                  {item.title}
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* MISSION + COMMUNITY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white border border-[#e5e5e5] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-[#ff3b30]" size={20} />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#888]">
                Our Mission
              </span>
            </div>

            <h3 className="text-[24px] md:text-[28px] font-bold text-[#222] mb-4">
              The customer standard
            </h3>

            <p className="text-[15px] md:text-[17px] text-[#666] leading-relaxed">
              To empower professionals with reliable, efficient, and sustainable hardware solutions through original products and certified advice. We believe in technology that works as hard as you do.
            </p>
          </div>

          <div className="bg-white border border-[#e5e5e5] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-[#ff3b30]" size={20} />
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#888]">
                Our Community
              </span>
            </div>

            <h3 className="text-[24px] md:text-[28px] font-bold text-[#222] mb-4">
              Nationwide reach
            </h3>

            <p className="text-[15px] md:text-[17px] text-[#666] leading-relaxed">
              Expanding across the United States to deliver professional technology solutions with dependable logistics and long-term service value. Our network ensures you always have access to reliable support.
            </p>
          </div>
        </div>

        {/* ADVANTAGE SECTION */}
        <div className="bg-white border border-[#e5e5e5]">
          <div className="flex items-center gap-3 border-b border-[#ededed] px-6 md:px-8 py-5">
            <ChevronsRight
              size={24}
              className="text-[#ff3b30] shrink-0"
              strokeWidth={3}
            />
            <h2 className="text-[22px] md:text-[24px] font-extrabold uppercase tracking-tight text-[#222]">
              The Dash Printer shop Advantage
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {advantages.map((item, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center gap-4 p-6 md:p-8 border-r border-b border-[#efefef] last:border-r-0"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#f8f8f8] text-[#888] border border-[#e5e5e5] group-hover:text-[#ff3b30] group-hover:border-[#ff3b30] transition-all">
                  <item.icon size={20} />
                </div>
                <h4 className="text-[14px] md:text-[15px] font-semibold text-[#333]">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}