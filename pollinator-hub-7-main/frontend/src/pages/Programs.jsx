import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { programs } from '../data/mock';

const tags = ['All', 'Livelihoods', 'Education', 'Conservation', 'Research'];

const Programs = () => {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? programs : programs.filter((p) => p.tag === filter);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filter]);

  return (
    <div>
      <section className="pt-40 pb-20 bg-[#f7f2e4] border-b border-[#eee6d3]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-5">Our Programs</div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.98] text-[#1c2a1e] max-w-4xl">
            Six programs. One living, breathing landscape.
          </h1>
          <p className="mt-8 text-lg text-[#4a5a4c] max-w-2xl leading-relaxed">
            Every BEPCoR program answers a specific gap — in livelihoods, in classrooms, in habitat or in data. Filter by focus area to explore.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-wrap items-center gap-3 mb-12 reveal">
            <div className="flex items-center gap-2 text-sm text-[#5a6f5c] mr-2">
              <Filter className="w-4 h-4" /> Filter:
            </div>
            {tags.map((t) => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                  filter === t ? 'bg-[#2d5a3d] text-white border-[#2d5a3d]' : 'bg-white text-[#1c2a1e] border-[#eee6d3] hover:border-[#2d5a3d]'
                }`}>
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filtered.map((p, i) => (
              <div key={p.id} className={`reveal grid md:grid-cols-12 gap-8 bg-white border border-[#eee6d3] rounded-3xl overflow-hidden lift ${i % 2 === 1 ? 'md:[&>div:first-child]:order-2' : ''}`}>
                <div className="md:col-span-5 aspect-[4/3] md:aspect-auto overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[900ms]" />
                </div>
                <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
                  <Badge className="self-start bg-[#f4ecd1] hover:bg-[#f4ecd1] text-[#8a6a1f] border-0 rounded-full mb-5">{p.tag}</Badge>
                  <h2 className="font-display text-3xl md:text-4xl leading-tight text-[#1c2a1e] mb-4">{p.title}</h2>
                  <p className="text-[#4a5a4c] leading-relaxed mb-6">{p.summary}</p>
                  <div className="space-y-2 mb-8">
                    {p.outcomes.map((o) => (
                      <div key={o} className="flex items-center gap-3 text-sm text-[#1c2a1e]"><CheckCircle2 className="w-4 h-4 text-[#2d5a3d] flex-none" />{o}</div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/get-involved"><Button className="rounded-full bg-[#2d5a3d] hover:bg-[#234a31] text-white h-11 px-6">Support this program</Button></Link>
                    <Link to="/contact"><Button variant="outline" className="rounded-full border-[#2d5a3d] text-[#2d5a3d] hover:bg-[#2d5a3d] hover:text-white h-11 px-6">Partner with us <ArrowRight className="ml-1 w-4 h-4" /></Button></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
