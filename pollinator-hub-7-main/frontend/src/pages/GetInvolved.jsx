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
import { QRCodeSVG } from 'qrcode.react';
import emailjs from '@emailjs/browser';

const GetInvolved = () => {
  const [amount, setAmount] = useState(2500);
  const [custom, setCustom] = useState('');
  
  // डोनर स्टेटमध्ये पॅन कार्ड ॲड केले
  const [donor, setDonor] = useState({ name: '', email: '', phone: '', pan: '' });
  const [donorBusy, setDonorBusy] = useState(false);

  const [volForm, setVolForm] = useState({ name: '', email: '', interest: 'Field Volunteer', message: '' });
  const [volBusy, setVolBusy] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [utr, setUtr] = useState('');
  const [isSendingData, setIsSendingData] = useState(false);

  // तुमची Google Sheet लिंक
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzRQNauXTBHKnKI6ceBUk5g4q3caw6TNzdZsmPWbq3NPn-s42J8zCcN44T_7UHuHaMy/exec";

  const finalDonationAmount = custom ? parseInt(custom || '0', 10) : amount;

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const donate = async (e) => {
    e.preventDefault();
    if (!donor.name || !donor.email) {
      toast({ title: 'Please add your name and email', variant: 'destructive' });
      return;
    }
    if (!finalDonationAmount || finalDonationAmount <= 0) {
      toast({ title: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }
    
    // ₹२००० च्या वर देणगी असल्यास PAN सक्तीचे करण्याची अट
    if (finalDonationAmount > 2000 && !donor.pan.trim()) {
      toast({ title: 'PAN Card is mandatory', description: 'Please provide your PAN card number for donations above ₹2,000.', variant: 'destructive' });
      return;
    }
    
    setUtr(''); 
    setShowModal(true);
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!utr || utr.length < 6) {
      toast({ title: 'Please enter a valid UTR/Transaction number', variant: 'destructive' });
      return;
    }
    
    setIsSendingData(true);
    const donorPhone = donor.phone || 'Not provided';
    const donorPan = donor.pan || 'Not provided';

    // १. EmailJS साठी माहिती
    const templateParams = {
      name: donor.name,
      email: donor.email,
      phone: donorPhone,
      amount: finalDonationAmount,
      pan: donorPan, 
      utr: utr
    };

    // २. Google Sheet साठी माहिती (FormData)
    const formData = new FormData();
    formData.append('name', donor.name);
    formData.append('email', donor.email);
    formData.append('phone', donorPhone);
    formData.append('amount', finalDonationAmount);
    formData.append('pan', donorPan); 
    formData.append('utr', utr);

    try {
      // ईमेल आणि गुगल शीट दोन्ही एकाच वेळी पाठवणे
      await Promise.all([
        emailjs.send(
          'service_f39fold',      
          'template_sfn76yr',     
          templateParams,
          'RQpxMWbY1pdRGSEQ4'       
        ),
        fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors', // गुगल शीट मध्ये डेटा जाण्यासाठी महत्त्वाचे
          body: formData,
        })
      ]);

      toast({ title: 'Thank You!', description: 'Your donation details have been saved successfully.' });
      setShowModal(false);
      setDonor({ name: '', email: '', phone: '', pan: '' });
      setCustom('');
      setUtr('');
      
    } catch (error) {
      console.error('Error saving details:', error);
      // 'no-cors' मुळे कधीकधी error block रन होतो, पण डेटा गेलेला असतो.
      toast({ title: 'Submitted', description: 'Your details have been submitted. We will verify your payment.', variant: 'default' });
      setShowModal(false);
      setDonor({ name: '', email: '', phone: '', pan: '' });
      setCustom('');
      setUtr('');
    } finally {
      setIsSendingData(false);
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

  const upiId = "9552958464m@pnb"; 
  const payeeName = "BEPCoR";
  const upiLink = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${finalDonationAmount}&cu=INR`;

  return (
    <div>
      <section className="pt-40 pb-20 bg-[#f7f2e4] border-b border-[#eee6d3]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-[#2d5a3d] mb-5 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" /> Get Involved
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-[0.98] text-[#1c2a1e]">Bee the change.</h1>
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

                <form onSubmit={donate} className="bg-white border border-[#eee6d3] rounded-3xl p-8 md:p-10 relative">
                  <h3 className="font-display text-2xl text-[#1c2a1e] mb-6">Your details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Custom amount (₹)</Label>
                      <Input value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g. 3000" className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Full name</Label>
                      <Input value={donor.name} onChange={(e) => setDonor({ ...donor, name: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" required />
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Email</Label>
                      <Input type="email" value={donor.email} onChange={(e) => setDonor({ ...donor, email: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Phone</Label>
                        <Input value={donor.phone} onChange={(e) => setDonor({ ...donor, phone: e.target.value })} className="h-12 mt-2 rounded-xl border-[#eee6d3]" />
                      </div>
                      <div>
                        <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">
                          PAN Card {finalDonationAmount > 2000 ? <span className="text-red-500 text-lg leading-none">*</span> : ''}
                        </Label>
                        <Input 
                          value={donor.pan} 
                          onChange={(e) => setDonor({ ...donor, pan: e.target.value.toUpperCase() })} 
                          placeholder="ABCDE1234F" 
                          className="h-12 mt-2 rounded-xl border-[#eee6d3] uppercase" 
                        />
                      </div>
                    </div>
                    {finalDonationAmount > 2000 && (
                      <p className="text-xs text-red-600 font-medium mt-1">PAN Card is required for donations above ₹2,000 for tax exemption.</p>
                    )}
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-[#f4ecd1] text-sm text-[#4a5a4c] flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2d5a3d] flex-none mt-0.5" />
                    <div>BEPCoR is a Registered Section 8 Company. Receipt within 7 working days.</div>
                  </div>
                  <Button type="submit" disabled={donorBusy} className="w-full h-14 mt-6 rounded-full bg-[#2d5a3d] hover:bg-[#234a31] text-white text-base font-semibold disabled:opacity-70">
                    Donate ₹{finalDonationAmount.toLocaleString()} <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="volunteer">
              <div className="max-w-2xl mx-auto bg-white border border-[#eee6d3] rounded-3xl p-8 md:p-10 reveal">
                <h3 className="font-display text-3xl text-[#1c2a1e] mb-2">Join our network</h3>
                <p className="text-[#4a5a4c] mb-8">We are looking for field researchers, content creators, and community mobilizers.</p>
                <form onSubmit={volunteer} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Name</Label>
                      <Input value={volForm.name} onChange={(e) => setVolForm({ ...volForm, name: e.target.value })} className="h-12 mt-2" required />
                    </div>
                    <div>
                      <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Email</Label>
                      <Input type="email" value={volForm.email} onChange={(e) => setVolForm({ ...volForm, email: e.target.value })} className="h-12 mt-2" required />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Area of Interest</Label>
                    <select value={volForm.interest} onChange={(e) => setVolForm({ ...volForm, interest: e.target.value })} className="w-full h-12 mt-2 px-3 rounded-xl border border-[#eee6d3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent">
                      <option>Field Volunteer</option>
                      <option>Research Assistant</option>
                      <option>Content & Social Media</option>
                      <option>Corporate Connections</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Message (Optional)</Label>
                    <Textarea value={volForm.message} onChange={(e) => setVolForm({ ...volForm, message: e.target.value })} className="mt-2 min-h-[100px] resize-none" placeholder="Tell us a bit about your background..." />
                  </div>
                  <Button type="submit" disabled={volBusy} className="w-full h-14 mt-4 rounded-full bg-[#2d5a3d] hover:bg-[#234a31] text-white">
                    {volBusy ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="partner">
              <div className="max-w-2xl mx-auto bg-white border border-[#eee6d3] rounded-3xl p-8 md:p-10 text-center reveal">
                <Building2 className="w-12 h-12 text-[#2d5a3d] mx-auto mb-6" strokeWidth={1} />
                <h3 className="font-display text-3xl text-[#1c2a1e] mb-4">Corporate & Institutional Partnerships</h3>
                <p className="text-[#4a5a4c] mb-8 leading-relaxed">
                  We collaborate with businesses, CSR wings, and educational institutions to implement large-scale pollinator corridors and rural empowerment programs.
                </p>
                <div className="inline-flex flex-col items-center p-6 bg-[#f7f2e4] rounded-2xl border border-[#eee6d3]">
                  <div className="text-sm text-[#5a6f5c] mb-2 uppercase tracking-widest text-xs">Reach out to our partnership team</div>
                  <a href="mailto:contact@bepcor.org" className="font-display text-2xl text-[#2d5a3d] hover:text-[#1c2a1e] transition-colors">contact@bepcor.org</a>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* --- QR Code आणि UTR इनपुट पॉपअप --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white p-8 rounded-[24px] w-full max-w-[420px] text-center relative border-t-[6px] border-[#2d5a3d] shadow-2xl my-8">
            
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-5 text-gray-400 hover:text-[#1c2a1e] text-3xl font-light"
            >
              &times;
            </button>
            
            <h3 className="font-display text-2xl text-[#1c2a1e] mb-2">Complete Donation</h3>
            <p className="text-sm text-[#4a5a4c] mb-6">Scan the QR code to send ₹{finalDonationAmount.toLocaleString()}</p>
            
            <div className="bg-white border-2 border-dashed border-[#eee6d3] p-4 rounded-2xl w-52 h-52 mx-auto flex items-center justify-center mb-4">
              <QRCodeSVG 
                value={upiLink} 
                size={180} 
                bgColor={"#ffffff"}
                fgColor={"#1c2a1e"}
                level={"M"}
              />
            </div>

            <div className="text-left bg-[#f4ecd1] p-4 rounded-2xl text-xs text-[#4a5a4c] mb-6 space-y-1">
              <div className="font-semibold text-[#1c2a1e] mb-1 text-sm">Bank Transfer Details</div>
              <div><strong className="font-medium">Name:</strong> BEPCOR</div>
              <div><strong className="font-medium">Bank:</strong> Punjab National Bank (PNB)</div>
              <div><strong className="font-medium">A/C No:</strong> 9986002100002092</div>
              <div><strong className="font-medium">IFSC:</strong> PUNB0998600</div>
            </div>

            <div className="text-left bg-[#fcfaf5] p-4 rounded-2xl border border-[#eee6d3]">
              <Label className="text-xs uppercase tracking-[0.14em] text-[#5a6f5c]">Enter UTR / Transaction No.</Label>
              <Input 
                value={utr} 
                onChange={(e) => setUtr(e.target.value)} 
                placeholder="After paying, enter UTR here" 
                className="h-12 mt-2 rounded-xl border-[#eee6d3]" 
              />
              <Button 
                onClick={handleConfirmPayment} 
                disabled={isSendingData} 
                className="w-full h-12 mt-4 rounded-xl bg-[#2d5a3d] hover:bg-[#234a31] text-white text-sm font-semibold disabled:opacity-70 flex justify-center items-center"
              >
                {isSendingData ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Payment & Send Details'
                )}
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default GetInvolved;