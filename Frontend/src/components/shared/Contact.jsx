import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend API call will go here
    console.log(formData);
  };

  return (
    <div className="bg-background-light text-text-dark">
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-green-700 to-green-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="max-w-2xl mx-auto opacity-90">
            Have questions, feedback, or need assistance?  
            We are here to help you.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          {/* ---------- CONTACT INFO ---------- */}
          <div>
            <h2 className="text-3xl font-semibold mb-6">
              Get in Touch
            </h2>

            <p className="text-text-gray mb-6 leading-relaxed">
              Whether you are a buyer, seller, or partner, feel free to reach
              out to us. Our support team will respond as soon as possible.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-2xl">📍</span>
                <span>Kathmandu, Nepal</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-2xl">📞</span>
                <span>+977 98XXXXXXXX</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-2xl">✉️</span>
                <span>support@ehaat.com</span>
              </div>
            </div>
          </div>

          {/* ---------- CONTACT FORM ---------- */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold mb-6">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ================= MAP / CTA ================= */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            We’d Love to Hear From You
          </h2>
          <p className="text-text-gray">
            Your feedback helps us improve and serve you better.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
