import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { BRAND_LOGO } from '../data/mock';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Pollinators', to: '/pollinators' },
  { label: 'Programs', to: '/programs' },
  { label: 'Get Involved', to: '/get-involved' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: '/contact' },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#fdfaf3]/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={BRAND_LOGO} alt="BEPCoR" className="w-11 h-11 object-contain group-hover:scale-105 transition-transform" />
            <div className="leading-tight">
              <div className="font-display text-2xl font-bold text-[#1c2a1e] tracking-tight">BEPCoR</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#5a6f5c]">Conservation of Living Planet</div>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-7">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium link-underline transition-colors ${isActive ? 'text-[#2d5a3d]' : 'text-[#1c2a1e] hover:text-[#2d5a3d]'}`
                }>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden xl:block">
            <Link to="/get-involved">
              <Button className="bg-[#2d5a3d] hover:bg-[#234a31] text-white rounded-full px-6 h-11 font-medium">Donate</Button>
            </Link>
          </div>

          <button className="xl:hidden p-2" onClick={() => setOpen((s) => !s)} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className={`xl:hidden overflow-hidden bg-[#fdfaf3] border-t border-[#eee6d3] transition-[max-height] duration-500 ${open ? 'max-h-[600px]' : 'max-h-0'}`}>
        <div className="px-5 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}
              className={({ isActive }) =>
                `py-3 px-3 rounded-lg text-base font-medium ${isActive ? 'text-[#2d5a3d] bg-[#f2ecdb]' : 'text-[#1c2a1e]'}`
              }>
              {item.label}
            </NavLink>
          ))}
          <Link to="/get-involved" className="mt-2">
            <Button className="w-full bg-[#2d5a3d] hover:bg-[#234a31] text-white rounded-full h-12">Donate</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
