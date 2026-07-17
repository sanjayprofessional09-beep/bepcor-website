import React, { useEffect, useState } from 'react';
import { Search, Calendar, Clock, ArrowUpRight, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import api from '../lib/api';

const categories = ['All', 'Pollinators', 'Livelihoods', 'Education', 'Research', 'How-To', 'News'];

const Resources = () => {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounced fetch
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const t = setTimeout(async () => {
      const res = await api.listPosts({ category: cat, q: q.trim() || undefined });
      if (!cancelled) {
        setPosts(res.ok ? res.data : []);
        setLoading(false);
      }
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [q, cat]);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [posts]);

  const featured = posts[0];
  const rest = posts.slice(1);
  const readTime = (p) => p.read_time || p.readTime;

  return (
    <div>
      <section className="pt-40 pb-16 bg-[#f7f2e4] border-b border-[#eee6d3]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-5">Field Journal</div>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.98] text-[#1c2a1e] max-w-4xl">
            Notes, essays and research from the field.
          </h1>
          <p className="mt-6 text-lg text-[#4a5a4c] max-w-2xl leading-relaxed">
            Everything we learn, we try to share. Read stories from the Western Ghats, guides for your garden, and updates from our programs.
          </p>

          <div className="mt-10 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6f5c]" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" className="pl-11 h-12 rounded-full bg-white border-[#eee6d3]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    cat === c ? 'bg-[#2d5a3d] text-white border-[#2d5a3d]' : 'bg-white text-[#1c2a1e] border-[#eee6d3] hover:border-[#2d5a3d]'
                  }`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {loading && (
            <div className="flex items-center justify-center py-24 text-[#5a6f5c]">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading articles…
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-24 text-[#5a6f5c]">No articles match your search.</div>
          )}

          {!loading && featured && (
            <a href="#" className="group block reveal lift bg-white border border-[#eee6d3] rounded-3xl overflow-hidden mb-10">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                  <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms]" />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-[#f4ecd1] hover:bg-[#f4ecd1] text-[#8a6a1f] border-0 rounded-full">{featured.category}</Badge>
                    <span className="text-xs uppercase tracking-[0.18em] text-[#5a6f5c]">Featured</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-[#1c2a1e] mb-4 group-hover:text-[#2d5a3d] transition-colors">{featured.title}</h2>
                  <p className="text-[#4a5a4c] leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-5 text-sm text-[#5a6f5c]">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {featured.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {readTime(featured)}</span>
                    <span>By {featured.author}</span>
                  </div>
                </div>
              </div>
            </a>
          )}

          {!loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((p, i) => (
                <a href="#" key={p.id} className="reveal lift group bg-white border border-[#eee6d3] rounded-2xl overflow-hidden" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms]" />
                  </div>
                  <div className="p-6">
                    <Badge className="bg-[#f4ecd1] hover:bg-[#f4ecd1] text-[#8a6a1f] border-0 rounded-full mb-4">{p.category}</Badge>
                    <h3 className="font-display text-xl text-[#1c2a1e] leading-tight mb-3 group-hover:text-[#2d5a3d] transition-colors">{p.title}</h3>
                    <p className="text-sm text-[#4a5a4c] leading-relaxed line-clamp-2">{p.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between text-xs text-[#5a6f5c]">
                      <span>{p.date} · {readTime(p)}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#2d5a3d] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Resources;
