import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Facebook, Youtube, Mail, MapPin, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';
import { siteInfo, BRAND_LOGO } from '../data/mock';
import api from '../lib/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({ title: 'Please enter a valid email', variant: 'destructive' });
      return;
    }
    setBusy(true);
    const res = await api.subscribeNewsletter(email);
    setBusy(false);
    if (res.ok) {
      toast({ title: 'Subscribed! Welcome to the swarm.', description: 'You will hear from us once a month, never more.' });
      setEmail('');
    } else {
      toast({ title: res.status === 409 ? 'Already subscribed' : 'Could not subscribe', description: res.error, variant: 'destructive' });
    }
  };

  return (
    <footer className="bg-[#1c2a1e] text-[#e8e0c8] pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* CTA row */}
        <div className="grid md:grid-cols-2 gap-12 pb-16 border-b border-white/10">
          <div>
            <h3 className="font-display text-3xl md:text-5xl leading-[1.05] text-white">
              Stay close to the hive.
            </h3>
            <p className="mt-4 text-[#c8c0a8] max-w-md">
              One thoughtful email a month — field notes from the Western Ghats, new research, and ways to support pollinators from wherever you are.
            </p>
          </div>
          <form onSubmit={submit} className="flex flex-col justify-center">
            <label className="text-xs uppercase tracking-[0.2em] text-[#c8c0a8] mb-3">Newsletter</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="your@email.com"
                className="h-14 bg-white/5 border-white/15 text-white placeholder:text-white/40 rounded-full px-5"
              />
              <Button type="submit" disabled={busy} className="h-14 px-7 rounded-full bg-[#d4a33c] hover:bg-[#c09330] text-[#1c2a1e] font-semibold disabled:opacity-70">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Subscribe <ArrowRight className="ml-1 w-4 h-4" /></>}
              </Button>
            </div>
          </form>
        </div>

        {/* Links */}
        <div className="grid md:grid-cols-4 gap-10 py-14">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/bepcorwhite.png" alt="BEPCoR" className="w-12 h-12 object-contain bg-white/10 rounded-lg p-1"/>
              <div className="font-display text-2xl font-bold text-white">BEPCoR</div>
            </Link>
            <p className="mt-5 text-sm text-[#c8c0a8] leading-relaxed">
              {siteInfo.fullName}. A social enterprise for pollinators, people and the living planet — working across Maharashtra, Karnataka and Tamil Nadu.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { key: 'instagram', Icon: Instagram, href: siteInfo.socials.instagram },
                { key: 'linkedin', Icon: Linkedin, href: siteInfo.socials.linkedin },
                { key: 'facebook', Icon: Facebook, href: siteInfo.socials.facebook },
                { key: 'youtube', Icon: Youtube, href: siteInfo.socials.youtube },
              ].map(({ key, Icon, href }) => (
                <a key={key} href={href} target="_blank" rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-[#d4a33c] hover:border-[#d4a33c] hover:text-[#1c2a1e] transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#d4a33c] mb-5">Explore</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="link-underline hover:text-white">About Us</Link></li>
              <li><Link to="/programs" className="link-underline hover:text-white">Programs</Link></li>
              <li><Link to="/resources" className="link-underline hover:text-white">Field Journal</Link></li>
              <li><Link to="/get-involved" className="link-underline hover:text-white">Volunteer</Link></li>
              <li><Link to="/get-involved" className="link-underline hover:text-white">Donate</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#d4a33c] mb-5">Programs</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/programs" className="link-underline hover:text-white">Native Beekeeping</Link></li>
              <li><Link to="/programs" className="link-underline hover:text-white">E-STEM Programme</Link></li>
              <li><Link to="/programs" className="link-underline hover:text-white">Pollinator Gardens</Link></li>
              <li><Link to="/programs" className="link-underline hover:text-white">Madhu Shakti</Link></li>
              <li><Link to="/programs" className="link-underline hover:text-white">WMPPC Campaign</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#d4a33c] mb-5">Contact</div>
            <ul className="space-y-3 text-sm text-[#c8c0a8]">
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 flex-none" /> {siteInfo.location}</li>
              <li className="flex items-start gap-3"><Mail className="w-4 h-4 mt-0.5 flex-none" /> {siteInfo.email}</li>
              <li className="flex items-start gap-3"><Phone className="w-4 h-4 mt-0.5 flex-none" /> {siteInfo.phone}</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-[#8a8770]">
          <div>© {new Date().getFullYear()} BEPCoR. All rights reserved. Registered under Section 8 Company.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Annual Reports</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
