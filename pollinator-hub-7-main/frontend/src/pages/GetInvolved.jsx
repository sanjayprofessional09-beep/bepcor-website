import React, { useEffect, useState } from 'react';
import { Heart, HandHeart, Building2, Users, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from '../hooks/use-toast';
import { donationTiers } from '../data/mock';
import api from '../lib/api';

const GetInvolved = () => {
  const [amount, setAmount] = useState(2500);
  const [custom, setCustom] = useState('');
  const [donor, setDonor] = useState({ name: '', email: '', phone: '' });
  const [donorBusy, setDonorBusy] = useState(false);

  const [volForm, setVolForm] = useState({ name: '', email: '', interest: 'Field Volunteer', message: '' });
  const [volBusy, setVolBusy] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const donate = async (e) => {
    e.preventDefault();
    const final = custom ? parseInt(custom, 10) : amount;
    if (!donor.name || !donor.email) {
      toast({ title: 'Please add your name and email', variant: 'destructive' });
      return;
    }
    if (!final || final <= 0) {
      toast({ title: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }
    setDonorBusy(true);
    const tierLabel = donationTiers.find((t) => t.amount === final)?.label;
    const res = await api.createDonation({
      name: donor.name, email: donor.email, phone: donor.phone || undefined, amount: final, tier: tierLabel,
    });
    setDonorBusy(false);
    if (res.ok) {
      toast({ title: `Thank you, ${donor.name}!`, description: `Your ₹${final.toLocaleString()} donation is being processed. A receipt will reach ${donor.email}.` });
      setDonor({ name: '', email: '', phone: '' });
      setCustom('');
    } else {
      toast({ title: 'Could not record donation', description: res.error, variant: 'destructive' });
    }
  };

  const volunteer = async (e) => {
    e.preventDefault();
    if (!volForm.name || !volForm.email) {
      toast({ title: 'Name and email are required', variant: 'destructive' });
      return;
    }
    setVolBusy(true);
    const res = await api.createVolunteer({
      name: volForm.name, email: volForm.email, interest: volForm.interest, message: volForm.message || undefined,
    });
    setVolBusy(false);
    if (res.ok) {
      toast({ title: 'Application received', description: 'Our team will write back within 3–5 working days.' });
      setVolForm({ name: '', email: '', interest: 'Field Volunteer', message: '' });
    } else {
      toast({ title: 'Could not submit application', description: res.error, variant: 'destructive' });
    }
  };

  return (
    <div>
      <section className="pt-40 pb-20 bg-[#f7f2e4] border-b border-[#eee6d3]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-5 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" /> Get Involved
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.98] text-[#1c2a1e]">Bee the change.</h1>
            <p className="mt-6 text-lg text-[#4a5a4c] max-w-lg leading-relaxed">
              Donate, volunteer, partner or simply plant a pollinator garden. Every meaningful action moves this work forward.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[{ Icon: Heart, l: 'Donate' }, { Icon: HandHeart, l: 'Volunteer' }, { Icon: Building2, l: 'Partner' }].map((c) => (
              <div key={c.l} className="bg-white rounded-2xl p-6 text-center border border-[#eee6d3]">
                <c.Icon className="w-6 h-6 text-[#2d5a3d] mx-auto mb-3" strokeWidth={1.5} />
                <div className="text-sm font-medium text-[#1c2a1e]">{c.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <Tabs defaultValue="donate" className="w-full">
            <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-12 bg-[#f4ecd1] rounded-full p-1 h-14">
              <TabsTrigger value="donate" className="rounded-full data-[state=active]:bg-[#2d5a3d] data-[state=active]:text-white text-[#1c2a1e] h-full">Donate</TabsTrigger>
              <TabsTrigger value="volunteer" className="rounded-full data-[state=active]:bg-[#2d5a3d] data-[state=active]:text-white text-[#1c2a1e] h-full">Volunteer</TabsTrigger>
              <TabsTrigger value="partner" className="rounded-full data-[state=active]:bg-[#2d5a3d] data-[state=active]:text-white text-[#1c2a1e] h-full">Partner</TabsTrigger>
            </TabsList>

            {/* DONATE */}
            <TabsContent value="donate">
              <div className="grid lg:grid-cols-2 gap-10 items-start reveal">
                <div>
                  <h2 className="font-display text-4xl md:text-5xl text-[#1c2a1e] leading-tight">Choose an impact.</h2>
                  <p className="mt-4 text-[#4a5a4c] leading-relaxed">Every donation is tagged to a specific outcome — not a general fund. You will receive a photo update from the field.</p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-8">
                    {donationTiers.map((t) => (
                      <button key={t.amount} onClick={() => { setAmount(t.amount); setCustom(''); }}
                        className={`text-left p-6 rounded-2xl border-2 transition-all ${
                          amount === t.amount && !custom ? 'border-[#2d5a3d] bg-[#f4ecd1]' : 'border-[#eee6d3] bg-white hover:border-[#8ea991]'
                        }`}>
                        <div className="font-display text-2xl text-[#1c2a1e]">₹{t.amount.toLocaleString()}</div>
                        <div className="text-xs uppercase tracking-[0.14em] text-[#8a6a1f] mt-1">{t.label}</div>
                        <div className="text-sm text-[#4a5a4c] mt-3">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={donate} className="bg-white border border-[#eee6d3] rounded-3xl p-8 md:p-10">
                  <h3 className="font-display text-2xl text-[#1c2a1e] mb-6">Your details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Custom amount (₹)</Label>
                      <Input value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g. 3000" className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Full name</Label>
                      <Input value={donor.name} onChange={(e) => setDonor({ ...donor, name: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Email</Label>
                      <Input type="email" value={donor.email} onChange={(e) => setDonor({ ...donor, email: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Phone (optional)</Label>
                      <Input value={donor.phone} onChange={(e) => setDonor({ ...donor, phone: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
                    </div>
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-[#f4ecd1] text-sm text-[#4a5a4c] flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2d5a3d] flex-none mt-0.5" />
                    <div>BEPCoR is a Registered Section 8 Company. Receipt within 7 working days.</div>
                  </div>
                  <Button type="submit" disabled={donorBusy} className="w-full h-14 mt-6 rounded-full bg-[#2d5a3d] hover:bg-[#234a31] text-white text-base font-semibold disabled:opacity-70">
                    {donorBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Donate ₹{(custom ? parseInt(custom || '0', 10) : amount).toLocaleString()} <ArrowRight className="ml-1 w-4 h-4" /></>}
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* VOLUNTEER */}
            <TabsContent value="volunteer">
              <div className="grid lg:grid-cols-2 gap-10 items-start reveal">
                <div>
                  <h2 className="font-display text-4xl md:text-5xl text-[#1c2a1e] leading-tight">Bring a skill. Take a season.</h2>
                  <p className="mt-4 text-[#4a5a4c] leading-relaxed">We host volunteers in the field and remotely. Common tracks:</p>
                  <ul className="mt-6 space-y-3">
                    {['Field research assistant (Western Ghats)', 'E-STEM classroom co-facilitator', 'Content, translation & design (remote)', 'Data & citizen science analytics'].map((t) => (
                      <li key={t} className="flex items-start gap-3 text-[#1c2a1e]">
                        <CheckCircle2 className="w-5 h-5 text-[#2d5a3d] flex-none mt-0.5" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <form onSubmit={volunteer} className="bg-white border border-[#eee6d3] rounded-3xl p-8 md:p-10 space-y-4">
                  <h3 className="font-display text-2xl text-[#1c2a1e]">Volunteer with us</h3>
                  <div>
                    <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Name</Label>
                    <Input value={volForm.name} onChange={(e) => setVolForm({ ...volForm, name: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Email</Label>
                    <Input type="email" value={volForm.email} onChange={(e) => setVolForm({ ...volForm, email: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Track</Label>
                    <select value={volForm.interest} onChange={(e) => setVolForm({ ...volForm, interest: e.target.value })} className="w-full h-12 mt-2 rounded-xl border border-[#eee6d3] bg-white px-3 text-sm">
                      <option>Field Volunteer</option>
                      <option>E-STEM Co-facilitator</option>
                      <option>Remote (Content/Design)</option>
                      <option>Data & Research</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Tell us about you</Label>
                    <Textarea value={volForm.message} onChange={(e) => setVolForm({ ...volForm, message: e.target.value })} rows={4} className="mt-2 rounded-xl border-[#eee6d3]" />
                  </div>
                  <Button type="submit" disabled={volBusy} className="w-full h-14 rounded-full bg-[#2d5a3d] hover:bg-[#234a31] text-white text-base font-semibold disabled:opacity-70">
                    {volBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* PARTNER */}
            <TabsContent value="partner">
              <div className="grid lg:grid-cols-2 gap-10 items-center reveal">
                <img src="https://images.pexels.com/photos/2260933/pexels-photo-2260933.jpeg" alt="Partnership" className="w-full h-[480px] object-cover rounded-3xl" />
                <div>
                  <h2 className="font-display text-4xl md:text-5xl text-[#1c2a1e] leading-tight">Partner with BEPCoR.</h2>
                  <p className="mt-4 text-[#4a5a4c] leading-relaxed">We work with CSR teams, foundations, universities, forest departments and rural cooperatives. Ways to partner:</p>
                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    {[
                      { t: 'CSR Programs', d: 'Fund an entire program area or a district.' },
                      { t: 'Research MoUs', d: 'Co-design baseline studies and publish jointly.' },
                      { t: 'Corporate Volunteering', d: 'Team days in the field or school programs.' },
                      { t: 'Retail & Trade', d: 'Stock ethical honey from our producer collectives.' },
                    ].map((c) => (
                      <div key={c.t} className="p-5 bg-white border border-[#eee6d3] rounded-2xl">
                        <div className="flex items-center gap-2 font-medium text-[#1c2a1e]"><Users className="w-4 h-4 text-[#2d5a3d]" /> {c.t}</div>
                        <div className="text-sm text-[#4a5a4c] mt-2">{c.d}</div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => window.location.href = '/contact'} className="mt-8 h-12 px-6 rounded-full bg-[#2d5a3d] hover:bg-[#234a31] text-white">Start a conversation <ArrowRight className="ml-1 w-4 h-4" /></Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default GetInvolved;
