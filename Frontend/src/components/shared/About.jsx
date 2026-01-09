import React from "react";

const About = () => {
  return (
    <div className="bg-background-light text-text-dark">
      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-r from-green-700 to-green-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About E-Haat
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            Empowering local sellers, connecting communities, and creating
            a trusted digital marketplace for everyone.
          </p>
        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">
              Who We Are
            </h2>
            <p className="text-text-gray leading-relaxed mb-4">
              E-Haat is a modern digital marketplace designed to bridge the gap
              between local sellers and buyers. Our platform provides small
              businesses, farmers, and entrepreneurs with a powerful online
              presence while giving buyers access to authentic and verified
              products.
            </p>
            <p className="text-text-gray leading-relaxed">
              We believe technology should uplift communities, create
              opportunities, and ensure fairness in digital trade.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✔</span>
                <span>Trusted & verified sellers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✔</span>
                <span>Secure and transparent transactions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✔</span>
                <span>Support for local & remote businesses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✔</span>
                <span>User-friendly buying & selling experience</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-2xl font-semibold mb-3 text-green-700">
              Our Mission
            </h3>
            <p className="text-text-gray leading-relaxed">
              To create an inclusive digital marketplace where sellers can grow
              their businesses and buyers can shop with confidence, transparency,
              and convenience.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-2xl font-semibold mb-3 text-orange-600">
              Our Vision
            </h3>
            <p className="text-text-gray leading-relaxed">
              To become a trusted e-commerce ecosystem that strengthens local
              economies and promotes ethical digital trade across regions.
            </p>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Why Choose E-Haat?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-3xl mb-3">🛡️</div>
              <h4 className="font-semibold mb-2">Verified Products</h4>
              <p className="text-sm text-text-gray">
                Every product goes through verification to ensure quality
                and authenticity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-3xl mb-3">🚚</div>
              <h4 className="font-semibold mb-2">Reliable Delivery</h4>
              <p className="text-sm text-text-gray">
                Efficient logistics and timely delivery for a smooth experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-semibold mb-2">Customer Support</h4>
              <p className="text-sm text-text-gray">
                Dedicated support to assist buyers and sellers at every step.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-3xl mb-3">🌱</div>
              <h4 className="font-semibold mb-2">Community Growth</h4>
              <p className="text-sm text-text-gray">
                Focused on empowering local and small-scale entrepreneurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-green-700 text-white py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Join the E-Haat Community
          </h2>
          <p className="mb-6 opacity-90">
            Whether you are a seller or a buyer, E-Haat is built for you.
            Experience a smarter, fairer, and more connected marketplace.
          </p>
          <button className="bg-white text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
