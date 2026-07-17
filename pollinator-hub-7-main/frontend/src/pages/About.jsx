import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Leaf, Target, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { team, faqs } from '../data/mock';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

const About = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="pt-40 pb-24 bg-[#f7f2e4] border-b border-[#eee6d3]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-5">About BEPCoR</div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-[88px] leading-[0.98] text-[#1c2a1e] max-w-4xl">
            A quiet foundation for a noisier, healthier ecosystem.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-[#4a5a4c] max-w-3xl leading-relaxed">
            Be-Ecoliteracy Pollinator Conservation and Research Foundation — BEPCoR — was founded in Kolhapur to answer one honest question: if pollinators disappear, what does rural India eat, earn and remember? Today we work across Maharashtra, Karnataka and Tamil Nadu.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <div className="relative rounded-3xl overflow-hidden">
              <img src="/images/sbipitch.jpg" alt="Beekeeper" className="w-full h-[560px] object-cover" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6">
                <div className="font-display text-3xl text-[#1c2a1e]">₹11 lakh</div>
                <div className="text-sm text-[#4a5a4c] mt-1">Awarded by SBI Foundation at Youth for India Conclave, 2025.</div>
              </div>
            </div>
          </div>
          <div className="reveal">
            <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-4">Our Story</div>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-[#1c2a1e]">
              Started in a field. Grown by the people who work in it.
            </h2>
            <div className="mt-6 space-y-5 text-[#4a5a4c] leading-relaxed">
              <p>BEPCoR began as field notes — a founder listening to farmers, forest-dwellers and school children explain what they had stopped seeing: fewer bees, thinner honey seasons, quieter mornings.</p>
              <p>We chose to build slowly. Community first, science next, communications last. Today we run programs across the Western Ghats belt with a small team, a large network of partners, and an even larger network of pollinators we are trying to keep alive.</p>
              <p>Our tagline — <em>Conservation of the Living Planet</em> — is not decoration. It is our brief.</p>
            </div>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {['Founded in Kolhapur, Maharashtra', 'Registered Section 8 Company', 'Working across MH · KA · TN', '60+ trainings, 2000+ people'].map((t) => (
                <div key={t} className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[#2d5a3d] mt-0.5 flex-none" /><span className="text-sm">{t}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Values */}
      <section className="py-24 bg-[#f7f2e4]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-3 gap-6">
          {[
            { Icon: Target, title: 'Vision', text: 'A living, connected planet where pollinators, people and place-based knowledge thrive together.' },
            { Icon: Leaf, title: 'Mission', text: 'To conserve native pollinators through ecoliteracy, research and community-led rural enterprises.' },
            { Icon: Sparkles, title: 'Values', text: 'Rooted, honest, patient. We move at the pace of trust and the seasons of the land.' },
          ].map((v, i) => (
            <div key={v.title} className="reveal bg-white border border-[#eee6d3] rounded-2xl p-10" style={{ transitionDelay: `${i * 80}ms` }}>
              <v.Icon className="w-8 h-8 text-[#2d5a3d] mb-6" strokeWidth={1.5} />
              <h3 className="font-display text-3xl text-[#1c2a1e] mb-4">{v.title}</h3>
              <p className="text-[#4a5a4c] leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 reveal gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-4">The People</div>
              <h2 className="font-display text-4xl md:text-6xl leading-[1.02] text-[#1c2a1e] max-w-3xl">A small team. A wide field.</h2>
            </div>
            <p className="text-[#4a5a4c] max-w-md">Ecologists, community organisers, teachers, and beekeepers. We are neighbours before we are colleagues.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <div key={m.name} className="reveal group" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-[#f4ecd1]">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms]" />
                </div>
                <div className="font-display text-xl text-[#1c2a1e]">{m.name}</div>
                <div className="text-sm text-[#2d5a3d] mt-1">{m.role}</div>
                <p className="mt-3 text-sm text-[#4a5a4c] leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#f7f2e4] border-t border-[#eee6d3]">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14 reveal">
            <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-4">Frequently Asked</div>
            <h2 className="font-display text-4xl md:text-5xl text-[#1c2a1e]">Questions, honestly answered.</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="bg-white rounded-2xl border border-[#eee6d3] px-6">
                <AccordionTrigger className="text-left font-display text-lg text-[#1c2a1e] hover:no-underline py-5">{f.q}</AccordionTrigger>
                <AccordionContent className="text-[#4a5a4c] leading-relaxed pb-5">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-14">
            <Link to="/contact"><Button className="h-14 px-8 rounded-full bg-[#2d5a3d] hover:bg-[#234a31] text-white">Talk to us <ArrowRight className="ml-1 w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
