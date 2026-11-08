import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { BRAND_LOGO } from '../data/mock';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Pollinators', to: '/pollinators' },
  { label: 'Programs', to: '/programs' },
  { label: 'Get Involved', to: '/get-involved' },
  { label: 'Resources', to: '/resources' },
  { label: 'Blog', to: '/blog' }, 
  { label: 'Contact', to: '/contact' },
  { label: 'Training', to: '/training/mushroom' }, 
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // === नवीन: मोबाईल मध्ये ड्रॉपडाऊन उघडण्यासाठी/बंद करण्यासाठी State ===
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);

  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // पेज बदलल्यावर मेनू आणि उघडलेले ड्रॉपडाऊन बंद करा
  useEffect(() => { 
    setOpen(false); 
    setActiveMobileDropdown(null);
  }, [pathname]);

  // मोबाईलमध्ये ड्रॉपडाऊन टॉगल करण्याचे फंक्शन
  const toggleMobileDropdown = (menuName) => {
    setActiveMobileDropdown(activeMobileDropdown === menuName ? null : menuName);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#fdfaf3]/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={BRAND_LOGO} alt="BEPCoR" className="w-11 h-11 object-contain group-hover:scale-105 transition-transform" />
            <div className="leading-tight">
              <div className="font-display text-2xl font-bold text-[#1c2a1e] tracking-tight">BEPCoR</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#5a6f5c]">Conservation of Living Planet</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-7">
            {navItems.map((item) => {
              // Blog Dropdown
              if (item.label === 'Blog') {
                return (
                  <div key={item.to} className="relative group">
                    <NavLink to={item.to} className={({ isActive }) => `flex items-center gap-1 text-sm font-medium transition-colors ${isActive ? 'text-[#2d5a3d]' : 'text-[#1c2a1e] hover:text-[#2d5a3d]'}`}>
                      {item.label} <ChevronDown className="w-4 h-4" />
                    </NavLink>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="w-44 bg-white border border-[#eee6d3] shadow-xl rounded-xl overflow-hidden flex flex-col">
                        <Link to="/blog" state={{ lang: 'English' }} className="px-5 py-3.5 text-sm font-medium text-[#1c2a1e] hover:bg-[#f4ecd1] hover:text-[#2d5a3d] transition-colors border-b border-[#eee6d3]">English</Link>
                        <Link to="/blog" state={{ lang: 'Marathi' }} className="px-5 py-3.5 text-sm font-medium text-[#1c2a1e] hover:bg-[#f4ecd1] hover:text-[#2d5a3d] transition-colors">मराठी / ಕನ್ನಡ</Link>
                      </div>
                    </div>
                  </div>
                );
              }
              
              // Training Dropdown (Desktop)
              if (item.label === 'Training') {
                return (
                  <div key={item.to} className="relative group">
                    <button className="flex items-center gap-1 text-sm font-medium transition-colors text-[#1c2a1e] hover:text-[#2d5a3d]">
                      {item.label} <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="w-56 bg-white border border-[#eee6d3] shadow-xl rounded-xl overflow-hidden flex flex-col">
                        <Link to="/training/mushroom" className="px-5 py-3.5 text-sm font-medium text-[#1c2a1e] hover:bg-[#f4ecd1] transition-colors border-b border-[#eee6d3]">Mushroom</Link>
                        <Link to="/training/beekeeping" className="px-5 py-3.5 text-sm font-medium text-[#1c2a1e] hover:bg-[#f4ecd1] transition-colors border-b border-[#eee6d3]">Beekeeping</Link>
                        <Link to="/training/dairy" className="px-5 py-3.5 text-sm font-medium text-[#1c2a1e] hover:bg-[#f4ecd1] transition-colors border-b border-[#eee6d3]">Dairy</Link>
                        <Link to="/training/sericulture" className="px-5 py-3.5 text-sm font-medium text-[#1c2a1e] hover:bg-[#f4ecd1] transition-colors border-b border-[#eee6d3]">Sericulture</Link>
                        <Link to="/training/goat-farming" className="px-5 py-3.5 text-sm font-medium text-[#1c2a1e] hover:bg-[#f4ecd1] transition-colors">Goat Farming</Link>
                      </div>
                    </div>
                  </div>
                );
              }

              // Normal Links
              return (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `text-sm font-medium link-underline transition-colors ${isActive ? 'text-[#2d5a3d]' : 'text-[#1c2a1e] hover:text-[#2d5a3d]'}`}>
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden xl:block">
            <Link to="/get-involved">
              <Button className="bg-[#2d5a3d] hover:bg-[#234a31] text-white rounded-full px-6 h-11 font-medium">Join the Cause</Button>
            </Link>
          </div>

          <button className="xl:hidden p-2" onClick={() => setOpen((s) => !s)} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {/* येथे max-h-screen केले आहे जेणेकरून पूर्ण मेनू दिसेल */}
      <div className={`xl:hidden overflow-hidden bg-[#fdfaf3] border-t border-[#eee6d3] transition-[max-height] duration-500 ${open ? 'max-h-screen' : 'max-h-0'}`}>
        {/* overflow-y-auto मुळे लिंक्स जास्त असल्यास स्क्रोल करता येईल */}
        <div className="px-5 py-4 flex flex-col gap-1 overflow-y-auto max-h-[75vh]">
          {navItems.map((item) => {
            
            // === Mobile Blog Dropdown (Accordion) ===
            if (item.label === 'Blog') {
              const isOpen = activeMobileDropdown === 'Blog';
              return (
                <div key={item.to} className="flex flex-col">
                  <button 
                    onClick={() => toggleMobileDropdown('Blog')}
                    className={`py-3 px-3 rounded-lg text-base font-medium flex justify-between items-center w-full text-left transition-colors ${isOpen ? 'text-[#2d5a3d] bg-[#f2ecdb]' : 'text-[#1c2a1e]'}`}
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col ml-6 my-1 border-l-2 border-[#eee6d3]">
                      <Link to="/blog" state={{ lang: 'English' }} className="py-2.5 px-4 text-sm font-medium text-[#5a6f5c] hover:text-[#2d5a3d]">English</Link>
                      <Link to="/blog" state={{ lang: 'Marathi' }} className="py-2.5 px-4 text-sm font-medium text-[#5a6f5c] hover:text-[#2d5a3d]">मराठी / ಕನ್ನಡ</Link>
                    </div>
                  </div>
                </div>
              );
            }

            // === Mobile Training Dropdown (Accordion) ===
            if (item.label === 'Training') {
              const isOpen = activeMobileDropdown === 'Training';
              return (
                <div key={item.to} className="flex flex-col">
                  <button 
                    onClick={() => toggleMobileDropdown('Training')}
                    className={`py-3 px-3 rounded-lg text-base font-medium flex justify-between items-center w-full text-left transition-colors ${isOpen ? 'text-[#2d5a3d] bg-[#f2ecdb]' : 'text-[#1c2a1e]'}`}
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col ml-6 my-1 border-l-2 border-[#eee6d3]">
                      <Link to="/training/mushroom" className="py-2.5 px-4 text-sm font-medium text-[#5a6f5c] hover:text-[#2d5a3d]">Mushroom</Link>
                      <Link to="/training/beekeeping" className="py-2.5 px-4 text-sm font-medium text-[#5a6f5c] hover:text-[#2d5a3d]">Beekeeping</Link>
                      <Link to="/training/dairy" className="py-2.5 px-4 text-sm font-medium text-[#5a6f5c] hover:text-[#2d5a3d]">Dairy</Link>
                      <Link to="/training/sericulture" className="py-2.5 px-4 text-sm font-medium text-[#5a6f5c] hover:text-[#2d5a3d]">Sericulture</Link>
                      <Link to="/training/goat-farming" className="py-2.5 px-4 text-sm font-medium text-[#5a6f5c] hover:text-[#2d5a3d]">Goat Farming</Link>
                    </div>
                  </div>
                </div>
              );
            }

            // Normal Mobile Links
            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `py-3 px-3 rounded-lg text-base font-medium ${isActive ? 'text-[#2d5a3d] bg-[#f2ecdb]' : 'text-[#1c2a1e]'}`}>
                {item.label}
              </NavLink>
            );
          })}
          <Link to="/get-involved" className="mt-2">
            <Button className="w-full bg-[#2d5a3d] hover:bg-[#234a31] text-white rounded-full h-12">Join the Cause</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;