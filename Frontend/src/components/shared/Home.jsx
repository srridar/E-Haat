import React, { useState, useEffect } from 'react'
import Navbar from '@/components/shared/Navbar'
import { useNavigate } from "react-router-dom";

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
    <div className="font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[var(--background-light)]">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] leading-tight">
              Connecting <span className="text-[var(--primary-green)]">Farmers</span>
              <br /> Directly with <span className="text-[var(--secondary-orange)]">Businesses</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-gray)]">
              E-Haat is a digital marketplace dedicated to providing remote village farmers access to wider markets, ensuring fair prices by removing unnecessary middlemen.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => navigate("/product/all")} className="bg-[var(--primary-green)] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
                Explore Products
              </button>
              <button onClick={() => navigate("/seller/sign-in")} className="border-2 border-[var(--secondary-orange)] text-[var(--secondary-orange)] px-8 py-3 rounded-lg font-semibold hover:bg-[var(--secondary-orange)] hover:text-white transition">
                Join as Farmer
              </button>
            </div>
          </div>
          <div className="flex justify-center relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
            <img src="hero.png" alt="Agriculture" className="w-full max-w-md rounded-2xl shadow-2xl relative z-10" />
          </div>
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
        {/* Background Image with better overlay handling */}
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
            <h2 className="text-sm font-semibold uppercase tracking-widest text-green-300 mb-3">Our Global Reach</h2>
            <p className="text-4xl font-bold text-white">Numbers that speak for themselves</p>
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


      <section className="py-20 bg-gray-50">
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

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Simple 3-Step Process</h2>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-20 h-20 bg-orange-50 text-[var(--secondary-orange)] rounded-full flex items-center justify-center text-3xl mx-auto mb-6 border-2 border-orange-100">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">What People Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">{t.avatar}</div>
                <p className="text-gray-600 italic mb-6">"{t.message}"</p>
                <h4 className="font-bold">{t.name}</h4>
                <p className="text-sm text-[var(--primary-green)]">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-[var(--secondary-orange)] text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to empower local agriculture?</h2>
          <p className="mb-8 text-lg">Join E-Haat today and be part of the sustainable food revolution in Nepal.</p>
          <button onClick={() => navigate("/register-as")} className="bg-white text-[var(--secondary-orange)] px-8 py-2 rounded-full font-bold text-lg hover:bg-gray-100 transition">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
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