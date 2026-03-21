import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Search, User, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for a dynamic glass look
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Farmers", path: "/farmers" },
    { name: "Products", path: "/product/all" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? "py-3 bg-white/60 backdrop-blur-2xl border-b border-slate-200/50 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)]" 
          : "py-5 bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        
        {/* LOGO AREA */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-md transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
            <img
              src="logo.png"
              alt="e-haat"
              className="h-12 w-14 object-cover p-1"
            />
          </div>
          <span className="hidden lg:block text-xl font-black tracking-tighter text-slate-900">
            E-HAAT<span className="text-emerald-500">.</span>
          </span>
        </Link>

        {/* CENTER NAVIGATION */}
        <nav className="hidden md:flex items-center bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  isActive 
                    ? "bg-white text-emerald-600 shadow-sm" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          {/* Minimalist Search */}
          <div className="hidden lg:flex items-center bg-slate-100/80 rounded-full px-3 py-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all border border-transparent focus-within:border-emerald-500/30">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="bg-transparent border-none outline-none text-sm px-2 w-32 focus:w-48 transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => navigate(`/${user?.role}/profile`)}
                className="flex items-center gap-2 p-1 pr-4 bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border border-emerald-100">
                  <img
                    src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=10b981&color=fff`}
                    alt="User"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {/* IMPROVED LOGIN BUTTON */}
                <Button 
                  variant="ghost" 
                  className="hidden sm:flex rounded-full font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 gap-2 px-6"
                  asChild
                >
                  <Link to="/login-as">
                    <LogIn size={16} />
                    Log In
                  </Link>
                </Button>

                <Button 
                  className="rounded-full bg-slate-900 text-white hover:bg-emerald-600 px-8 font-bold shadow-lg shadow-slate-200 hover:shadow-emerald-200 transition-all duration-300 transform active:scale-95 gap-2"
                  asChild
                >
                  <Link to="/register-as">
                    <UserPlus size={16} />
                    Join Haat
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
              <Menu size={24} />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-2xl">
              <div className="flex flex-col gap-8 mt-12">
                <div className="flex flex-col gap-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Navigation</p>
                   {navLinks.map(link => (
                      <Link key={link.name} to={link.path} className="text-2xl font-bold px-4 hover:text-emerald-500 transition-colors">
                        {link.name}
                      </Link>
                   ))}
                </div>
                <hr className="border-slate-100" />
                <div className="flex flex-col gap-4 px-4">
                   {!isAuthenticated && (
                     <>
                        <Button className="w-full justify-start text-lg h-12 bg-slate-100 text-slate-900 hover:bg-slate-200" variant="secondary" asChild>
                          <Link to="/login-as">Log In</Link>
                        </Button>
                        <Button className="w-full justify-start text-lg h-12 bg-emerald-600 text-white" asChild>
                          <Link to="/register-as">Sign In</Link>
                        </Button>
                     </>
                   )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;