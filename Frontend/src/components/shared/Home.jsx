import React from 'react'
import Navbar from '@/components/shared/Navbar'

const Home = () => {
  return (
    <div>
        <Navbar/>
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
    </div>
  )
}

export default Home