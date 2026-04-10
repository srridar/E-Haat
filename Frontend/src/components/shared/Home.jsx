import React, { useState, useEffect } from 'react'
import Navbar from '@/components/shared/Navbar'
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { Quote } from "lucide-react";
import { ArrowRight, ShoppingCart, Leaf } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);


  const images = [
    "farmer1.jpg",
    "farmer4.avif",
    "farmer6.jpg",
    "farmer7.png",
    "farmer8.jpg",
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // 1 second

    return () => clearInterval(interval); // cleanup
  }, [images.length]);



  const features = [
    { title: "Direct Farmer Connection", description: "Connect with local farmers directly for fresh and bulk products.", icon: "🌾" },
    { title: "Location-Based Recommendations", description: "Find farmers near you based on your location preferences.", icon: "📍" },
    { title: "Secure Transactions", description: "Safe and transparent transactions between buyers and farmers.", icon: "💳" },
    { title: "Real-Time Updates", description: "Get notified when new products are available nearby.", icon: "⏱️" },
    { title: "Remote support", description: "Provides market space to those who don't have direct access to market.", icon: "💻" },
    { title: "Transportation Support", description: "Connects nearby transporters to reduce logistical costs.", icon: "🚚" },
    { title: "Promotes Local Products", description: "Helps local producers showcase products and reach more buyers.", icon: "🛒" },
    { title: "Compare Products", description: "Easily compare quality and price from multiple farmers.", icon: "📊" }
  ];

  const steps = [
    { title: "List Products", desc: "Farmers upload their seasonal harvest with pricing.", icon: "📝" },
    { title: "Bulk Order", desc: "Businesses browse and place bulk orders directly.", icon: "📦" },
    { title: "Fast Delivery", desc: "Local transporters deliver goods to your doorstep.", icon: "🚀" }
  ];

  const stats = [
    { label: "Farmers Joined", value: "5,000+" },
    { label: "Products Sold", value: "10k+ Tons" },
    { label: "Happy Businesses", value: "1,200+" },
    { label: "Districts Covered", value: "45+" }
  ];

  const testimonials = [
    { name: "Ram Prasad Sharma", role: "Vegetable Farmer, Chitwan", message: "E-Haat helped me reach businesses directly. I now sell my vegetables in bulk without middlemen.", avatar: "👨‍🌾" },
    { name: "Anita Karki", role: "Restaurant Owner, Kathmandu", message: "Comparing products from multiple farmers saved me money and ensured quality supply.", avatar: "👩‍🍳" },
    { name: "Bishnu Adhikari", role: "Local Transporter", message: "E-Haat connects me with nearby sellers, making transportation efficient.", avatar: "🚚" },
  ];

  return (
    <div className="font-sans overflow-hidden">
      <Navbar />
      <section className="relative overflow-hidden bg-[#fafaf9] py-24 lg:py-32">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-teal-200 rounded-full blur-[100px] opacity-60" />
        <div className="absolute top-0 left-2/4 w-64 h-64 bg-emerald-200 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200 rounded-full blur-[120px] opacity-50" />
        <div className="absolute w-full top-4 flex flex-col justify-center items-center gap-2 ">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.8 }}
            className="h-1 bg-orange-500 rounded-full "
          />

          <h2 className="text-2xl md:text-2xl lg:text-2xl font-black tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500">
              उक्साऊँ
            </span>{" "}
            <span className="text-slate-900">
              स्थानीय उत्पादनलाई
            </span>
          </h2>

          {/* Sub-tag in English or Nepali for context */}
          <p className="text-emerald-600 font-bold tracking-[0.2em] text-xs uppercase mt-2">
            Empowering Local Growth
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">


          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Leaf size={14} />
              <span>Direct-to-Business Marketplace</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Connecting <span className="text-emerald-600">Farmers</span>
              <br />
              Directly with <span className="text-orange-500">Businesses</span>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
              Empowering remote village farmers with digital tools to access wider markets.
              We ensure <span className="font-semibold text-slate-900">fair pricing</span> by eliminating unnecessary middlemen.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <button
                onClick={() => navigate("/product/all")}
                className="group flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-300"
              >
                <ShoppingCart size={18} />
                Explore Products
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/seller/sign-in")}
                className="px-8 py-4 rounded-2xl font-bold border-2 border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300"
              >
                Join as Farmer
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-20"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-400 to-orange-400 rounded-[32px] blur-2xl opacity-30 -z-10" />
              <img
                src="hero_section.png"
                alt="Agriculture"
                className="w-full max-w-[550px] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-8 border-white object-cover aspect-[4/5] lg:aspect-auto"
              />


              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Leaf size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Verified Quality</p>
                    <p className="text-sm font-bold text-slate-900">Organic Standard</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full border border-emerald-500/20 animate-pulse" />
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Supporting Nepali <span className="text-[var(--primary-green)]">Farmers</span> & <span className="text-[var(--secondary-orange)]">Innovators</span>
            </h2>
            <p className="mt-4 text-gray-500 text-lg">Directly impacting lives across the Himalayas.</p>
          </div>

          <div className="relative group max-w-6xl mx-auto h-[500px] overflow-hidden rounded-[2rem] shadow-2xl border-8 border-white">

            {/* Main Image */}
            <img
              src={images[currentIndex]}
              alt="Community"
              className="w-full h-full object-cover transform scale-105 transition-transform duration-[2000ms]"
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
              <div className="max-w-2xl">
                <span className="text-[var(--secondary-orange)] font-bold tracking-widest uppercase text-sm">Our Impact</span>
                <h3 className="text-white text-4xl md:text-5xl font-bold mt-2 mb-4 leading-tight">
                  Empowering the hands that feed the nation.
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  From the hills of Ilam to the plains of Chitwan, we bring the market to the doorstep of every innovator.
                </p>
              </div>
            </div>

            {/* Custom Navigation Dots */}
            <div className="absolute bottom-8 right-12 flex gap-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 transition-all duration-300 rounded-full ${currentIndex === i ? "w-10 bg-[var(--primary-green)]" : "w-3 bg-white/50 hover:bg-white"
                    }`}
                />
              ))}
            </div>

            {/* Image Counter Badge */}
            <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium">
              0{currentIndex + 1} / 0{images.length}
            </div>
          </div>
        </div>
      </section>


      <section className="relative py-24 overflow-hidden bg-[var(--primary-green)]">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-40"
            src="img2.png"
            alt="Our Impact"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary-green)] via-transparent to-[var(--primary-green)]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Optional Header for context */}
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-green-300 mb-2">Our Global Reach</h2>
            <p className="text-3xl font-bold text-slate-300">Numbers that speak for themselves</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="group">
                <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight transition-transform duration-300 group-hover:scale-105">
                  {stat.value}
                </h3>
                <div className="w-8 h-1 bg-green-400 mx-auto mb-4 rounded-full opacity-60"></div>
                <p className="text-green-100 text-sm md:text-base font-medium uppercase tracking-wide opacity-80">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="relative py-20 bg-gray-50">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-teal-200 rounded-full blur-[120px] opacity-60" />
        <div className="absolute top-0 left-2/4 w-64 h-64 bg-emerald-200 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-12 right-3/4 w-96 h-96 bg-orange-100 rounded-full blur-[150px] opacity-50" />
        <div className="absolute bottom-12 left-3/4 w-96 h-96 bg-orange-100 rounded-full blur-[150px] opacity-50" />

        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose E-Haat?</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">We bridge the gap between rural production and urban demand through technology.</p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-[var(--primary-green)] transition duration-300">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

  
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative mb-20 flex flex-col items-center">

            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-100/50 rounded-full blur-3xl -z-10" />
            <span className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
              How it works
            </span>
            <h2 className="relative text-3xl md:text-4xl font-black text-slate-900 tracking-tight text-center">
              Simple <span className="text-emerald-600">3-Step</span> Process
              <span className="block h-1.5 w-46 bg-orange-400 rounded-full mx-auto mt-4" />
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-20 h-20 bg-orange-50 text-[var(--secondary-orange)] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-orange-100">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-slate-50 py-24 overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-green-100/40 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-extrabold text-slate-800 mb-4"
            >
              What Our Community Says
            </motion.h2>

            {/* Animated Horizontal Strip */}
            <div className="flex justify-center items-center gap-4">
              <div className="relative w-48 h-2 bg-green-200 rounded-full overflow-hidden">

                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear",
                  }}
                  className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-teal-400 to-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white border border-slate-100 p-8 rounded-3xl shadow-xl shadow-slate-200/50 transition-all duration-300"
              >
                {/* Decorative Quote Icon */}
                <div className="absolute top-6 right-8 text-slate-100 group-hover:text-green-50 transition-colors">
                  <Quote size={40} fill="currentColor" />
                </div>

                <div className="relative z-10">
                  <div className="text-5xl mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-300 scale-100 group-hover:scale-110 origin-left">
                    {t.avatar}
                  </div>

                  <p className="text-slate-600 italic mb-8 leading-relaxed">
                    "{t.message}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-[3px] bg-green-500 rounded-full" />
                    <div>
                      <h4 className="font-bold text-slate-800 tracking-tight">{t.name}</h4>
                      <p className="text-xs font-bold uppercase tracking-widest text-green-600">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

   
      <section className="py-12 bg-[var(--secondary-orange)] text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to empower local agriculture?</h2>
          <p className="mb-8 text-lg">Join E-Haat today and be part of the sustainable food revolution in Nepal.</p>
          <button onClick={() => navigate("/register-as")} className="bg-white text-[var(--secondary-orange)] px-8 py-2 rounded-full font-bold text-lg hover:bg-gray-100 transition">
            Get Started Now
          </button>
        </div>
      </section>


      <footer className="bg-green-950 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[var(--secondary-orange)]">E-Haat</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering farmers through direct market access. We believe in fair trade, fresh produce, and community growth.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
              <li><a href="/impact" className="hover:text-white transition">Our Impact</a></li>
              <li><a href="/careers" className="hover:text-white transition">Careers</a></li>
              <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="/help" className="hover:text-white transition">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact Support</a></li>
              <li><a href="/faq" className="hover:text-white transition">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Get updates on new seasonal harvests.</p>
            <div className="flex">
              <input type="email" placeholder="Email" className="bg-green-900 border-none rounded-l-md px-4 py-2 w-full text-sm" />
              <button className="bg-[var(--secondary-orange)] px-4 py-2 rounded-r-md hover:opacity-90">Go</button>
            </div>
          </div>
        </div>
        <div className="border-t border-green-900 mt-16 pt-8 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} E-Haat Marketplace. All rights reserved. Made for Nepal.
        </div>
      </footer>
      
    </div>
  )
}

export default Home;