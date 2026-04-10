import React, { useState } from "react";
import axios from "axios";
import { CONTACT_API_END_POINT } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, subject, message, phone } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    if (name.length < 3 || !nameRegex.test(name)) {
      toast.error("Please enter a valid name (min 3 letters).");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (subject.length < 5) {
      toast.error("Subject is too short.");
      return false;
    }
    if (message.length < 10) {
      toast.error("Message should be more descriptive.");
      return false;
    }
    if (phone && !/^(98|97)\d{8}$/.test(phone)) {
      toast.error("Enter a valid Nepali phone number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${CONTACT_API_END_POINT}/create`, formData);
      if (res.data.success) {
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:bg-orange-500 hover:text-white transition-all duration-300"
      >
        <ArrowLeft size={24} />
      </motion.button>

      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">Let's Connect</h1>
          <p className="text-lg opacity-90 font-medium max-w-xl mx-auto">
            Have a question or a proposal? We'd love to hear from you.
            Our team typically responds within 24 hours.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 -mt-16 pb-20 relative z-20">

        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-200 rounded-full blur-[120px] opacity-60" />
        <div className="absolute buttom-0 left-0 w-64 h-64 bg-emerald-200 rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-4 right-0 w-96 h-96 bg-orange-100 rounded-full blur-[150px] opacity-10" />
        <div className="absolute bottom-2 left-3/4 w-96 h-96 bg-orange-100 rounded-full blur-[150px] opacity-50" />
        <div className="grid lg:grid-cols-5 gap-8">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 h-full">
              <h2 className="text-2xl font-bold mb-8 text-slate-800">Contact Information</h2>

              <div className="space-y-8">
                <motion.div variants={itemVariants} className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Location</h4>
                    <p className="text-slate-800">Butwal, Rupandehi, Nepal</p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700">Phone</h4>
                    <p className="text-slate-500">9704840128</p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700">Email</h4>
                    <p className="text-slate-500">support@ehaat.com</p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="text-sm text-slate-400 font-medium italic">
                  "Empowering local trade through digital connection."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-100"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Phone (Optional)</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="98XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Message</label>
                <textarea
                  name="message"
                  placeholder="Describe your inquiry in detail..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 text-center text-slate-400 text-sm">
        <p>© 2026 eHaat Platform. All rights reserved. Created By Sushil Bhattarai, Madhu Sudhan Gaire and Min Prasad Khanal</p>
      </footer>
    </div>
  );
};

export default Contact;