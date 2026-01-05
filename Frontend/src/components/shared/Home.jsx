import React from 'react'
import Navbar from '@/components/shared/Navbar'

const Home = () => {

  const features = [
    {
      title: "Direct Farmer Connection",
      description: "Connect with local farmers directly for fresh and bulk products.",
      icon: "🌾",
    },
    {
      title: "Location-Based Recommendations",
      description: "Find farmers near you based on your location preferences.",
      icon: "📍",
    },
    {
      title: "Secure Transactions",
      description: "Safe and transparent transactions between buyers and farmers.",
      icon: "💳",
    },
    {
      title: "Real-Time Updates",
      description: "Get notified when new products are available nearby.",
      icon: "⏱️",
    },
    {
      title: "Remote support",
      description: "Provides market space to those who don't have direct access to market.",
      icon: "💻",
    },
    {
      title: "Transportation Support",
      description: "Provides transportation services to sellers and buyers using nearby transporters to reduce costs.",
      icon: "🚚",
    },
    {
      title: "Promotes Local Products",
      description: "Helps local farmers and producers showcase their products and reach more buyers.",
      icon: "🛒",
    },
    {
      title: "Compare Products",
      description: "Easily compare products from multiple farmers to choose the best quality and price before buying.",
      icon: "📊",
    }



  ];


  const testimonials = [
    {
      name: "Ram Prasad Sharma",
      role: "Vegetable Farmer, Chitwan",
      message:
        "E-Haat helped me reach businesses directly. I now sell my vegetables in bulk without depending on middlemen.",
      avatar: "👨‍🌾",
    },
    {
      name: "Anita Karki",
      role: "Restaurant Owner, Kathmandu",
      message:
        "Comparing products from multiple farmers before buying saved me money and ensured quality supply for my restaurant.",
      avatar: "👩‍🍳",
    },
    {
      name: "Bishnu Adhikari",
      role: "Local Transporter",
      message:
        "E-Haat connects me with nearby sellers and buyers, making transportation efficient and reducing empty trips.",
      avatar: "🚚",
    },
  ];

  return (
    <div>
      <Navbar />


      <section className="bg-[var(--background-light)]">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] leading-tight">
              Connecting <span className="text-[var(--primary-green)]">Farmers</span>
              <br /> Directly with <span className="text-[var(--secondary-orange)]">Businesses</span>
            </h1>

            <p className="mt-6 text-lg text-[var(--text-gray)]">
              E-Haat helps local farmers sell vegetables and agricultural products
              in bulk to nearby businesses, reducing middlemen and ensuring fair prices.
              it is dedicated to provide market to remote village farmers
            </p>

            {/* Buttons */}
            <div className="mt-8 flex gap-4">
              <button className="bg-[var(--primary-green)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition">
                Explore Products
              </button>

              <button className="border border-[var(--secondary-orange)] text-[var(--secondary-orange)] px-6 py-3 rounded-lg hover:bg-[var(--secondary-orange)] hover:text-white transition">
                Join as Farmer
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src="hero.png"
              alt="Farmers selling vegetables"
              className="w-full max-w-md rounded-2xl shadow-lg"
            />
          </div>

        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Choose E-Haat?
          </h2>
          <p className="text-gray-600 mb-12">
            E-Haat makes it easy for buyers to connect with farmers and get fresh
            products in bulk.
          </p>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--background-light)] py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-dark)] mb-4">
            What People Say About E-Haat
          </h2>
          <p className="text-[var(--text-gray)] mb-12">
            Trusted by farmers, buyers, and transporters across Nepal.
          </p>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4">{item.avatar}</div>
                <p className="text-gray-600 italic mb-6">
                  “{item.message}”
                </p>
                <h4 className="font-semibold text-lg text-[var(--text-dark)]">
                  {item.name}
                </h4>
                <span className="text-sm text-gray-500">{item.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      <footer className="bg-green-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">

          {/* About Section */}
          <div>
            <h3 className="text-xl text-[var(--secondary-orange)] font-bold mb-4"> <span className='text-[var(--primary-green)]'>E</span>-Haat</h3>
            <p className="text-gray-200 text-sm">
              E-Haat connects farmers and buyers to promote local products, ensure fair trade, and make bulk purchases easier.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-200">
              <li><a href="/" className="hover:text-yellow-400">Home</a></li>
              <li><a href="/about" className="hover:text-yellow-400">About</a></li>
              <li><a href="/contact" className="hover:text-yellow-400">Contact</a></li>
              <li><a href="/farmers" className="hover:text-yellow-400">Farmers</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-200 text-sm">
              <li>Email: support3@e-haat.com</li>
              <li>Phone: +977 980-4589345</li>
              <li>Address: Butwal, Nepal</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="hover:text-yellow-400">🌐</a>
              <a href="#" className="hover:text-yellow-400">🐦</a>
              <a href="#" className="hover:text-yellow-400">📘</a>
              <a href="#" className="hover:text-yellow-400">📸</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-800 mt-8 pt-4 text-center text-gray-300 text-sm">
          © {new Date().getFullYear()} E-Haat. All rights reserved.
        </div>
      </footer>


    </div>
  )
}

export default Home