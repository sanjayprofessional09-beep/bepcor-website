import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pollinatorGroups } from '../data/mock';
import { Leaf, Bug, Bird, Rabbit, Wind, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const iconFor = (id) => ({ insects: Bug, birds: Bird, mammals: Rabbit, abiotic: Wind }[id] || Leaf);

const Pollinators = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div>
      <section className="pt-40 pb-20 bg-[#f7f2e4] border-b border-[#eee6d3]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-5 flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5" /> Who We Conserve
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-[0.98] text-[#1c2a1e]">
              The many messengers of life.
            </h1>
            <p className="mt-8 text-lg text-[#4a5a4c] leading-relaxed">
              Pollination is a crucial process in the reproduction of plants and crops. In nature, many living organisms and natural elements help this quiet, essential work. BEPCoR conserves them all — not just honeybees.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <img src="/images/sadhupatil.jpg" alt="Bee" className="w-full h-64 object-cover rounded-2xl" />
            <img src="/images/conservator.jpg" alt="Butterfly on flower" className="w-full h-64 object-cover rounded-2xl" />
            <img src="/images/westernghats.jpg" alt="Wildflowers" className="w-full h-64 object-cover rounded-2xl" />
            <img src="/images/sanjaybee.jpg" alt="Bee" className="w-full h-64 object-cover rounded-2xl" />
          </div>
        </div>
      </section>

      {pollinatorGroups.map((g, gi) => {
        const Icon = iconFor(g.id);
        const flipped = gi % 2 === 1;
        return (
          <section key={g.id} className={`py-20 md:py-28 ${gi % 2 === 0 ? 'bg-white' : 'bg-[#fdfaf3]'}`}>
            <div className="max-w-7xl mx-auto px-5 md:px-8">
              <div className={`grid lg:grid-cols-12 gap-10 lg:gap-14 items-center ${flipped ? 'lg:[&>div:first-child]:order-2' : ''}`}>
                <div className="lg:col-span-5 reveal">
                  <div className="rounded-3xl overflow-hidden aspect-[4/3]">
                    <img src={g.image} alt={g.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[900ms]" />
                  </div>
                </div>
                <div className="lg:col-span-7 reveal">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4ecd1] text-[#8a6a1f] text-xs uppercase tracking-[0.18em] mb-5">
                    <Icon className="w-3.5 h-3.5" /> Group {gi + 1} of {pollinatorGroups.length}
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl leading-[1.02] text-[#1c2a1e]">{g.title}</h2>
                  <p className="mt-5 text-lg text-[#4a5a4c] leading-relaxed">{g.lead}</p>
                  <div className="mt-8 grid sm:grid-cols-2 gap-4">
                    {g.items.map((it) => (
                      <div key={it.name} className="p-5 rounded-2xl bg-white border border-[#eee6d3] lift">
                        <div className="font-display text-lg text-[#1c2a1e] mb-1.5">{it.name}</div>
                        <div className="text-sm text-[#4a5a4c] leading-relaxed">{it.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="py-24 bg-[#2d5a3d] text-white">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
            Every pollinator counts — and so does every act to protect them.
          </h2>
          <p className="mt-6 text-white/85 text-lg">
            Whether you plant a garden, join a citizen-science survey, or fund a hive — you are keeping this quiet system alive.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link to="/programs">
              <Button className="h-14 px-8 rounded-full bg-[#d4a33c] hover:bg-[#c09330] text-[#1c2a1e] font-semibold">See our programs <ArrowRight className="ml-1 w-4 h-4" /></Button>
            </Link>
            <Link to="/get-involved">
              <Button variant="outline" className="h-14 px-8 rounded-full bg-transparent border-white/40 text-white hover:bg-white hover:text-[#1c2a1e]">Support the work</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pollinators;
