import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sprout, BookOpen, Users, Microscope, Heart, Leaf, Quote, Bug, Bird, Rabbit, Wind } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { heroSlides, stats, missionPillars, programs, impactStories, partners, pollinatorGroups } from '../data/mock';

const iconMap = { Sprout, BookOpen, Users, Microscope };

const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view'));
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const Counter = ({ value }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const numeric = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = value.replace(/[0-9,]/g, '');

  useEffect(() => {
    let started = false;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        const duration = 1600;
        const start = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - start) / duration);
          setN(Math.round(numeric * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [numeric]);

  return <span ref={ref} className="tabular">{n.toLocaleString()}{suffix}</span>;
};

const Home = () => {
  const [slide, setSlide] = useState(0);
  useReveal();

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6500);
    return () => clearInterval(id);
  }, []);

  const cur = heroSlides[slide];

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[100vh] min-h-[640px] w-full overflow-hidden">
        {heroSlides.map((s, i) => (
          <div key={s.id} className={`absolute inset-0 transition-opacity duration-[1400ms] ${i === slide ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-cover bg-center kenburns" style={{ backgroundImage: `url(${s.image})` }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1c2a1e]/70 via-[#1c2a1e]/30 to-[#1c2a1e]/80" />
          </div>
        ))}

        <div className="relative h-full max-w-7xl mx-auto px-5 md:px-8 flex flex-col justify-end pb-10 md:pb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs uppercase tracking-[0.2em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a33c] animate-pulse" />
              {cur.eyebrow}
            </div>
            <h1 className="font-display text-white text-4xl md:text-6xl lg:text-[88px] leading-[0.98] font-bold">
              {cur.title}
            </h1>
            <p className="mt-6 text-white/85 text-lg md:text-xl max-w-2xl leading-relaxed">
              {cur.subtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to={cur.cta.link}>
                <Button className="h-14 px-8 rounded-full bg-[#d4a33c] hover:bg-[#c09330] text-[#1c2a1e] font-semibold text-base">
                  {cur.cta.label} <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
              <Link to={cur.secondaryCta.link}>
                <Button variant="outline" className="h-14 px-8 rounded-full bg-transparent border-white/40 text-white hover:bg-white hover:text-[#1c2a1e] font-medium text-base">
                  {cur.secondaryCta.label}
                </Button>
              </Link>
            </div>
          </div>

          {/* Slide dots */}
          <div className="absolute bottom-10 right-5 md:right-8 flex items-center gap-3">
            {heroSlides.map((s, i) => (
              <button key={s.id} onClick={() => setSlide(i)}
                className={`transition-all duration-500 ${i === slide ? 'w-10 bg-[#d4a33c]' : 'w-4 bg-white/40'} h-1 rounded-full`}
                aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#2d5a3d] text-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="font-display text-4xl md:text-5xl font-bold text-[#d4a33c]">
                <Counter value={s.value} />
              </div>
              <div className="mt-2 text-sm text-white/80 uppercase tracking-[0.14em]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="py-24 md:py-36 honeycomb-bg">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5 reveal">
              <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-5 flex items-center gap-2">
                <Leaf className="w-3.5 h-3.5" /> Our Mission
              </div>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.02] text-[#1c2a1e]">
                Four commitments to a living, buzzing world.
              </h2>
              <p className="mt-6 text-lg text-[#4a5a4c] leading-relaxed max-w-lg">
                BEPCoR is built on the belief that biodiversity and rural well-being are the same conversation. We work bottom-up across Maharashtra, Karnataka and Tamil Nadu — with beekeepers, teachers, farmers, students and scientists.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 mt-8 text-[#2d5a3d] font-medium link-underline">
                Read the full story <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
              {missionPillars.map((p, i) => {
                const Icon = iconMap[p.icon];
                return (
                  <div key={p.title} className={`reveal lift bg-white border border-[#eee6d3] rounded-2xl p-8 ${i % 2 === 1 ? 'sm:translate-y-8' : ''}`} style={{ transitionDelay: `${i * 80}ms` }}>
                    <div className="w-12 h-12 rounded-full bg-[#f4ecd1] flex items-center justify-center mb-6">
                      <Icon className="w-5 h-5 text-[#2d5a3d]" />
                    </div>
                    <h3 className="font-display text-2xl text-[#1c2a1e] mb-3">{p.title}</h3>
                    <p className="text-[#4a5a4c] leading-relaxed text-sm">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* POLLINATORS PREVIEW */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 reveal">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-4">Who We Conserve</div>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.02] text-[#1c2a1e]">
                Not just honeybees.
              </h2>
              <p className="mt-5 text-lg text-[#4a5a4c] leading-relaxed">
                Pollination happens through many messengers — insects, birds, mammals, and even the elements. BEPCoR works to conserve them all.
              </p>
            </div>
            <Link to="/pollinators">
              <Button variant="outline" className="rounded-full h-12 px-6 border-[#2d5a3d] text-[#2d5a3d] hover:bg-[#2d5a3d] hover:text-white">
                Meet the Pollinators <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pollinatorGroups.map((g, i) => {
              const Icon = [Bug, Bird, Rabbit, Wind][i];
              return (
                <Link to="/pollinators" key={g.id} className="reveal lift group relative rounded-2xl overflow-hidden aspect-[3/4]" style={{ transitionDelay: `${i * 70}ms` }}>
                  <img src={g.image} alt={g.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c2a1e] via-[#1c2a1e]/60 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <Icon className="w-6 h-6 text-[#d4a33c] mb-3" strokeWidth={1.5} />
                    <div className="font-display text-2xl">{g.title}</div>
                    <div className="text-sm text-white/80 mt-2 line-clamp-2">{g.lead}</div>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#d4a33c] opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-24 md:py-32 bg-[#f7f2e4]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 reveal">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-4">What We Do</div>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.02] text-[#1c2a1e] max-w-2xl">
                Programs rooted in the field, scaled with care.
              </h2>
            </div>
            <Link to="/programs">
              <Button variant="outline" className="rounded-full h-12 px-6 border-[#2d5a3d] text-[#2d5a3d] hover:bg-[#2d5a3d] hover:text-white">
                All Programs <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.slice(0, 6).map((p, i) => (
              <Link to="/programs" key={p.id} className="reveal lift group bg-white rounded-2xl overflow-hidden border border-[#eee6d3]" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms]" />
                </div>
                <div className="p-7">
                  <Badge className="bg-[#f4ecd1] hover:bg-[#f4ecd1] text-[#8a6a1f] border-0 rounded-full mb-4">{p.tag}</Badge>
                  <h3 className="font-display text-2xl text-[#1c2a1e] leading-tight mb-3 group-hover:text-[#2d5a3d] transition-colors">{p.title}</h3>
                  <p className="text-sm text-[#4a5a4c] leading-relaxed">{p.summary}</p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#2d5a3d]">
                    Learn more <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT / STORIES */}
      <section className="py-24 md:py-32 bg-[#fdfaf3]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-4">Voices From the Field</div>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.02] text-[#1c2a1e]">
              Small hives. Long ripples.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {impactStories.map((s, i) => (
              <div key={s.id} className="reveal lift bg-white border border-[#eee6d3] rounded-2xl p-8 flex flex-col" style={{ transitionDelay: `${i * 80}ms` }}>
                <Quote className="w-8 h-8 text-[#d4a33c] mb-5" />
                <p className="font-display text-xl text-[#1c2a1e] leading-snug flex-1">“{s.quote}”</p>
                <div className="mt-8 flex items-center gap-4 pt-6 border-t border-[#eee6d3]">
                  <img src={s.image} alt={s.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-[#1c2a1e]">{s.name}</div>
                    <div className="text-xs text-[#5a6f5c]">{s.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONATE STRIP */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-[#1c2a1e] text-white">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'url(https://images.pexels.com/photos/27418555/pexels-photo-27418555.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c2a1e] via-[#1c2a1e]/85 to-[#1c2a1e]/70" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <div className="text-xs uppercase tracking-[0.24em] text-[#d4a33c] mb-5 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" /> Support the Work
            </div>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.02]">
              Fund a hive. Plant a garden. Change a landscape.
            </h2>
            <p className="mt-6 text-white/80 text-lg max-w-lg">
              Every rupee moves through community collectives, native plants and school gardens — not overheads. Registered Section 8 Company.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 reveal">
            {[{ v: '₹1,000', l: 'Plants 10 saplings' }, { v: '₹2,500', l: 'Sponsors a hive' }, { v: '₹5,000', l: 'E-STEM module' }, { v: '₹25,000', l: 'A full garden' }].map((c) => (
              <div key={c.v} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="font-display text-3xl font-bold text-[#d4a33c]">{c.v}</div>
                <div className="mt-2 text-sm text-white/80">{c.l}</div>
              </div>
            ))}
            <div className="sm:col-span-2">
              <Link to="/get-involved">
                <Button className="w-full h-14 rounded-full bg-[#d4a33c] hover:bg-[#c09330] text-[#1c2a1e] font-semibold text-base">
                  Donate Now <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-16 bg-[#fdfaf3] border-t border-[#eee6d3] overflow-hidden">
        <div className="text-center text-xs uppercase tracking-[0.24em] text-[#5a6f5c] mb-10">
          Supported by & Working With
        </div>
        <div className="relative">
          <div className="flex marquee-track gap-16 whitespace-nowrap">
            {[...partners, ...partners].map((p, i) => (
              <div key={`${p}-${i}`} className="font-display text-2xl text-[#8ea991] hover:text-[#2d5a3d] transition-colors">{p}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
