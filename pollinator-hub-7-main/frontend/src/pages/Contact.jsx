import React, { useEffect, useState } from 'react';
import { MapPin, Mail, Phone, Instagram, Linkedin, Facebook, Youtube, Send, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from '../hooks/use-toast';
import { siteInfo } from '../data/mock';
import api from '../lib/api'; // जुना इम्पोर्ट तसाच ठेवला आहे जेणेकरून एरर येणार नाही

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [busy, setBusy] = useState(false);

  // === CAPTCHA States ===
  const [captchaText, setCaptchaText] = useState('');
  const [userInputCaptcha, setUserInputCaptcha] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [captchaColors, setCaptchaColors] = useState([]);
  const [captchaWave, setCaptchaWave] = useState('');

  // === CAPTCHA Generator Function ===
  const generateCaptcha = () => {
    const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
    const nums = "123456789";
    const all = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789";
    
    let result = "";
    result += upper.charAt(Math.floor(Math.random() * upper.length)); // पहिले अक्षर Capital
    result += nums.charAt(Math.floor(Math.random() * nums.length)); // दुसरे अक्षर अंक (Number)
    for (let i = 0; i < 4; i++) {
      result += all.charAt(Math.floor(Math.random() * all.length)); // उरलेले ४ Random
    }
    
    setCaptchaText(result);
    setUserInputCaptcha('');
    setIsCaptchaValid(false);

    // रंगांची यादी
    const colorPalette = [
      '#450a0a', '#ef4444', '#fca5a5', '#052e16', '#16a34a', '#86efac',
      '#172554', '#2563eb', '#93c5fd', '#4a044e', '#9333ea', '#d8b4fe',
      '#422006', '#ca8a04', '#fde047', '#022c22', '#0d9488', '#5eead4'
    ];
    const newColors = Array.from({length: 6}, () => colorPalette[Math.floor(Math.random() * colorPalette.length)]);
    setCaptchaColors(newColors);

    // Wavy Line (बदलणारी रेषा)
    const y1 = Math.floor(Math.random() * 20) + 10;
    const cy1 = Math.floor(Math.random() * 40);
    const y2 = Math.floor(Math.random() * 20) + 10;
    const y3 = Math.floor(Math.random() * 20) + 10;
    setCaptchaWave(`M 0 ${y1} Q 25 ${cy1}, 50 ${y2} T 100 ${y3}`);
  };

  // पेज पहिल्यांदा उघडल्यावर Animation आणि CAPTCHA लोड करणे
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    
    // CAPTCHA तयार करणे
    generateCaptcha();

    return () => io.disconnect();
  }, []);

  // CAPTCHA टाईप करताना तपासणे
  const handleCaptchaChange = (e) => {
    const value = e.target.value;
    setUserInputCaptcha(value);
    setIsCaptchaValid(value === captchaText);
  };

  const submit = async (e) => {
    e.preventDefault();
    
    // जर फॉर्म पूर्ण भरला नसेल तर एरर
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill in your name, email and message', variant: 'destructive' });
      return;
    }

    // CAPTCHA अचूक असल्याची अंतिम तपासणी
    if (!isCaptchaValid) {
      toast({ title: 'Invalid Security Code', description: 'Please enter the correct CAPTCHA.', variant: 'destructive' });
      return;
    }
    
    setBusy(true);

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwK_dBd4EYYKfsMA_LAdLZtkp2M9cvqT-XDtD6fVWe2fhQrfmcJyjuKCmmcQBtiDqKc/exec";

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('subject', form.subject || '');
      formData.append('message', form.message);

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' 
      });

      toast({ title: 'Message sent', description: `Thank you, ${form.name}. We usually reply within 2 working days.` });
      
      // फॉर्म आणि CAPTCHA रिकामा करणे
      setForm({ name: '', email: '', subject: '', message: '' });
      generateCaptcha(); 

    } catch (error) {
      console.error("Error submitting to Google Sheets:", error);
      toast({ title: 'Could not send message', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <section className="pt-40 pb-16 bg-[#f7f2e4] border-b border-[#eee6d3]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-5">Contact</div>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.98] text-[#1c2a1e] max-w-3xl">
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
              <img src="/images/madhushakti.jpg" alt="Field" className="w-full h-56 object-cover" />
            </div>
          </div>

          <form onSubmit={submit} className="lg:col-span-3 bg-white border border-[#eee6d3] rounded-3xl p-8 md:p-12 reveal">
            <h2 className="font-display text-3xl text-[#1c2a1e] mb-8">Send a message</h2>
            <div className="grid md:grid-cols-2 gap-5">
              
              <div>
                <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Name *</Label>
                <Input value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
              </div>
              
              <div>
                <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Email *</Label>
                <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Subject</Label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Message *</Label>
                <Textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 rounded-xl border-[#eee6d3]" />
              </div>

              {/* === CAPTCHA Section === */}
              <div className="md:col-span-2 mt-4 bg-[#f4ecd1]/40 p-5 rounded-xl border border-[#eee6d3]">
                <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c] mb-4 block font-bold">Security Verification (CAPTCHA) *</Label>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  
                  <div 
                    className="relative overflow-hidden px-6 py-3 bg-[#ffffff] border border-[#d4a33c] rounded-lg shadow-sm select-none pointer-events-none flex items-center justify-center min-w-[160px]"
                    style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4.5px)" }}
                  >
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                      <path d={captchaWave} stroke="rgba(0, 0, 0, 0.45)" strokeWidth="1.5" fill="none" />
                    </svg>
                    <div className="relative z-10 flex gap-[6px] text-2xl font-black tracking-wider drop-shadow-md">
                      {captchaText.split('').map((char, index) => (
                        <span key={index} style={{ color: captchaColors[index] }}>{char}</span>
                      ))}
                    </div>
                  </div>
                  
                  <button type="button" onClick={generateCaptcha} className="text-sm font-bold text-[#2d5a3d] hover:text-[#1c2a1e] flex items-center gap-1 transition-colors bg-white px-3 py-2 border border-[#eee6d3] rounded-md shadow-sm">
                    ↻ Refresh Code
                  </button>
                </div>
                
                <div className="relative w-full md:w-1/2 mt-5">
                  <Input 
                    type="text" value={userInputCaptcha} onChange={handleCaptchaChange} placeholder="Enter CAPTCHA" required maxLength={6}
                    className={`h-12 w-full pr-10 border-2 rounded-xl font-bold tracking-widest outline-none transition-colors ${isCaptchaValid ? 'border-green-500 bg-green-50/50' : 'border-[#eee6d3] focus:border-[#2d5a3d]'}`} 
                  />
                  {isCaptchaValid && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 font-black text-xl">✓</span>}
                </div>
              </div>

              {/* Submit Button (फक्त CAPTCHA अचूक असल्यावरच दिसेल) */}
              {isCaptchaValid && (
                <div className="md:col-span-2 pt-2 transition-all duration-500 ease-in-out">
                  <Button type="submit" disabled={busy} className="mt-4 h-14 px-8 rounded-full bg-[#2d5a3d] hover:bg-[#234a31] text-white text-base font-semibold disabled:opacity-70 w-full md:w-auto">
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send message <Send className="ml-2 w-4 h-4" /></>}
                  </Button>
                </div>
              )}

            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;