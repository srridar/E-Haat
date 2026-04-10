import React from 'react';
import { Star, Quote, Award, Sprout } from 'lucide-react';

const farmers = [
  {
    id: 1,
    name: "Utsab poudel",
    product: "Organic Avocardo",
    rating: 5.0,
    image: "utsab.webp", 
    struggle: "Spent two years clearing rocky soil by hand while working as a substitute teacher. Her first harvest was nearly wiped out by frost, but she persisted with the surviving seeds.",
    status: "Top Rated 2024"
  },
  {
    id: 2,
    name: "Salikram belbase",
    product: "Heirloom Cocoa Beans",
    rating: 4.9,
    image: "salikram belbase.jpg",
    struggle: "Moved back to his ancestral village with zero savings. He worked manual labor in the city for 5 years just to afford his first hectare of land.",
    status: "Quality Master"
  },
  {     
    id: 3,     
    name: "Maya Gurung",     
    product: "Organic Turmeric Powder",     
    rating: 4.6,     
    image: "maya grurung.webp",     
    struggle: "After losing her husband, she had to raise two children alone. With no formal education, she started farming turmeric on a small leased land and slowly built her own sustainable business.",     
    status: "Rising Star"   
},
  // Add more farmer objects here
];

const FarmerCard = ({ farmer }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-300 hover:-translate-y-2">
    <div className="relative">
      <img 
        src={farmer.image} 
        alt={farmer.name} 
        className="w-full h-56 object-center"
      />
      <div className="absolute top-4 right-4 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1">
        <Star size={16} fill="black" /> {farmer.rating}
      </div>
    </div>
    
    <div className="p-6">
      <div className="flex items-center gap-2 mb-2">
        <Award className="text-green-600" size={20} />
        <span className="text-xs font-bold uppercase tracking-wider text-green-600">{farmer.status}</span>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{farmer.name}</h3>
      <p className="text-gray-500 font-medium mb-4 flex items-center gap-2">
        <Sprout size={18} /> {farmer.product}
      </p>
      
      <div className="bg-gray-50 p-4 rounded-xl italic text-gray-600 relative">
        <Quote className="text-gray-200 absolute -top-2 -left-1" size={32} />
        <p className="relative z-10 text-sm leading-relaxed">
          {farmer.struggle}
        </p>
      </div>
      
      <button className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors">
        Support This Farmer
      </button>
    </div>
  </div>
);

export default function Farmers() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-4">
          The <span className="text-green-600">Roots</span> of Our Marketplace
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Behind every product is a story of resilience. Meet our top 10 producers who turned 
          hardship into the harvests you love.
        </p>
      </div>

      {/* Leaderboard Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {farmers.map((farmer) => (
          <FarmerCard key={farmer.id} farmer={farmer} />
        ))}
      </div>

      {/* Call to Action for Other Sellers */}
      <div className="max-w-4xl mx-auto mt-20 bg-green-900 rounded-3xl p-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Want to see your story here?</h2>
        <p className="text-green-100 mb-8">
          Excellence isn't just about sales; it's about quality and community. 
          Maintain a 4.8+ rating to join our next Hall of Fame cycle.
        </p>
        <button className="bg-white text-green-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors">
          View Seller Guidelines
        </button>
      </div>
    </div>
  );
}