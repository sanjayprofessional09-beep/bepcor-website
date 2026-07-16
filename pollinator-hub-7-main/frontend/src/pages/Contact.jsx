import React, { useEffect, useState } from 'react';
import { MapPin, Mail, Phone, Instagram, Linkedin, Facebook, Youtube, Send, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from '../hooks/use-toast';
import { siteInfo } from '../data/mock';
import api from '../lib/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill in your name, email and message', variant: 'destructive' });
      return;
    }
    setBusy(true);
    const res = await api.sendContact({
      name: form.name, email: form.email, subject: form.subject || undefined, message: form.message,
    });
    setBusy(false);
    if (res.ok) {
      toast({ title: 'Message sent', description: `Thank you, ${form.name}. We usually reply within 2 working days.` });
      setForm({ name: '', email: '', subject: '', message: '' });
    } else {
      toast({ title: 'Could not send message', description: res.error, variant: 'destructive' });
    }
  };

  return (
    <div>
      <section className="pt-40 pb-16 bg-[#f7f2e4] border-b border-[#eee6d3]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-5">Contact</div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.98] text-[#1c2a1e] max-w-3xl">
            Let’s start a conversation.
          </h1>
          <p className="mt-6 text-lg text-[#4a5a4c] max-w-2xl leading-relaxed">
            Whether you want to volunteer, partner, invite us to your school, or simply understand what native bees are up to in your neighbourhood — write to us.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 reveal">
            <h2 className="font-display text-3xl text-[#1c2a1e] mb-6">Reach us directly</h2>
            <div className="space-y-6">
              {[
                { Icon: MapPin, l: 'Office', v: siteInfo.location },
                { Icon: Mail, l: 'Email', v: siteInfo.email },
                { Icon: Phone, l: 'Phone', v: siteInfo.phone },
              ].map((c) => (
                <div key={c.l} className="flex gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#f4ecd1] flex items-center justify-center flex-none">
                    <c.Icon className="w-5 h-5 text-[#2d5a3d]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-[#5a6f5c]">{c.l}</div>
                    <div className="text-[#1c2a1e] font-medium mt-1">{c.v}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <div className="text-xs uppercase tracking-[0.18em] text-[#5a6f5c] mb-4">Follow along</div>
              <div className="flex gap-3">
                {[
                  { key: 'instagram', Icon: Instagram, href: siteInfo.socials.instagram },
                  { key: 'linkedin', Icon: Linkedin, href: siteInfo.socials.linkedin },
                  { key: 'facebook', Icon: Facebook, href: siteInfo.socials.facebook },
                  { key: 'youtube', Icon: Youtube, href: siteInfo.socials.youtube },
                ].map(({ key, Icon, href }) => (
                  <a key={key} href={href} target="_blank" rel="noreferrer"
                    className="w-11 h-11 rounded-full border border-[#eee6d3] flex items-center justify-center text-[#1c2a1e] hover:bg-[#2d5a3d] hover:border-[#2d5a3d] hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-2xl overflow-hidden border border-[#eee6d3]">
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09" alt="Field" className="w-full h-56 object-cover" />
            </div>
          </div>

          <form onSubmit={submit} className="lg:col-span-3 bg-white border border-[#eee6d3] rounded-3xl p-8 md:p-12 reveal">
            <h2 className="font-display text-3xl text-[#1c2a1e] mb-8">Send a message</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Subject</Label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Message</Label>
                <Textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 rounded-xl border-[#eee6d3]" />
              </div>
            </div>
            <Button type="submit" disabled={busy} className="mt-8 h-14 px-8 rounded-full bg-[#2d5a3d] hover:bg-[#234a31] text-white text-base font-semibold disabled:opacity-70">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send message <Send className="ml-2 w-4 h-4" /></>}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
