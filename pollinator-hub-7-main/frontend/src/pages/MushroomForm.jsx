import React, { useState, useEffect } from 'react';

const MushroomForm = () => {
  const [formData, setFormData] = useState({
    fullName: '', village: '', taluka: '', district: '', pincode: '',
    mobile: '', email: '', age: '', education: '',
    occupation: '', otherOccupation: '', farmingExp: '', mushroomExp: '',
    objectives: [], otherObjective: '',
    paymentMode: '', amountPaid: '', transactionId: '', paymentDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // CAPTCHA State
  const [captchaText, setCaptchaText] = useState('');
  const [userInputCaptcha, setUserInputCaptcha] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const generateCaptcha = () => {
    // सारखे दिसणारे वर्ण (O, o, 0, I, i, L, l) वगळले आहेत
    const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
    const nums = "123456789";
    const all = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789";
    
    let result = "";
    // १. पहिले अक्षर: कॅपिटल (A-Z)
    result += upper.charAt(Math.floor(Math.random() * upper.length));
    // २. दुसरे अक्षर: अंक (1-9)
    result += nums.charAt(Math.floor(Math.random() * nums.length));
    // ३. पुढील ४ अक्षरे: रँडम
    for (let i = 0; i < 4; i++) {
      result += all.charAt(Math.floor(Math.random() * all.length));
    }
    
    setCaptchaText(result);
    setUserInputCaptcha('');
    setIsCaptchaValid(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // युजरने टाईप केल्यावर लगेच पडताळणी करण्यासाठी
  const handleCaptchaChange = (e) => {
    const value = e.target.value;
    setUserInputCaptcha(value);
    
    // बरोबर जुळल्यास State अपडेट करणे
    if (value === captchaText) {
      setIsCaptchaValid(true);
    } else {
      setIsCaptchaValid(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let newObjectives = [...formData.objectives];
    if (checked) newObjectives.push(value);
    else newObjectives = newObjectives.filter(obj => obj !== value);
    setFormData({ ...formData, objectives: newObjectives });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isCaptchaValid) {
      alert("कृपया सिक्युरिटी कोड बरोबर टाका.");
      return; 
    }

    setIsSubmitting(true);

    const scriptURL = "YOUR_COPIED_URL_HERE"; // येथे तुमची Google Sheet ची लिंक टाका

    fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(() => {
      alert("तुमचा अर्ज यशस्वीरित्या जमा झाला आहे! (Form Submitted Successfully!)");
      setIsSubmitting(false);
      window.location.reload(); 
    })
    .catch((error) => {
      alert("काहीतरी चूक झाली आहे. कृपया पुन्हा प्रयत्न करा.");
      console.error('Error!', error.message);
      setIsSubmitting(false);
    });
  };

  // CAPTCHA साठी मल्टी-कलर्स
  const captchaColors = ['#991b1b', '#1e40af', '#166534', '#6b21a8', '#b45309', '#0f766e'];

  return (
    <div className="min-h-screen bg-[#fcfaf5] py-12 px-4 sm:px-6 lg:px-8 font-mukta">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-[#eee6d3]">
        
        <div className="bg-[#2d5a3d] px-6 py-8 text-center text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 font-display tracking-wide">BEPCOR</h1>
          <p className="text-sm md:text-base text-[#e8e0c8] mb-4 uppercase tracking-widest">
            BE-Ecoliteracy Pollinator Conservation And Research Foundation
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-[#d4a33c]">
            ऑयस्टर मशरूम उत्पादन प्रशिक्षण कार्यशाळा
          </h2>
          <p className="text-lg mt-1 text-white opacity-90">प्रवेश अर्ज (Application Form)</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10 text-[#1c2a1e]">
          
          <section>
            <h3 className="text-xl font-bold border-b-2 border-[#d4a33c] pb-2 mb-6 text-[#2d5a3d]">
              भाग १: वैयक्तिक माहिती (Personal Details)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">१. संपूर्ण नाव (Full Name): *</label>
                <input type="text" name="fullName" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">२. संपूर्ण पत्ता (Address):</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input type="text" name="village" placeholder="गाव/शहर" onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
                  <input type="text" name="taluka" placeholder="तालुका" onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
                  <input type="text" name="district" placeholder="जिल्हा" onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
                  <input type="text" name="pincode" placeholder="पिन कोड" onChange={handleChange} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">३. मोबाईल क्रमांक (WhatsApp Number): *</label>
                <input type="tel" name="mobile" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">४. ईमेल आयडी (Email ID):</label>
                <input type="email" name="email" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">५. वय (Age):</label>
                <input type="number" name="age" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">६. शिक्षण (Education Qualification):</label>
                <input type="text" name="education" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b-2 border-[#d4a33c] pb-2 mb-6 text-[#2d5a3d]">
              भाग २: व्यावसायिक माहिती (Professional Background)
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3">७. सध्याचा व्यवसाय (Current Occupation):</label>
                <div className="flex flex-wrap gap-4">
                  {['शेतकरी (Farmer)', 'नोकरदार (Employed)', 'व्यावसायिक (Business)', 'विद्यार्थी (Student)'].map(occ => (
                    <label key={occ} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="occupation" value={occ} onChange={handleChange} className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]" />
                      <span>{occ}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer w-full md:w-auto">
                    <input type="radio" name="occupation" value="इतर (Other)" onChange={handleChange} className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]" />
                    <span>इतर (Other):</span>
                    <input type="text" name="otherOccupation" onChange={handleChange} disabled={formData.occupation !== 'इतर (Other)'} className="ml-2 p-1 border-b border-gray-400 focus:outline-none focus:border-[#2d5a3d]" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">८. तुम्हाला शेतीचा पूर्व अनुभव आहे का?:</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="farmingExp" value="होय (Yes)" onChange={handleChange} className="w-4 h-4 text-[#2d5a3d]" /> होय (Yes)</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="farmingExp" value="नाही (No)" onChange={handleChange} className="w-4 h-4 text-[#2d5a3d]" /> नाही (No)</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">९. मशरूम उत्पादनाबद्दल तुम्हाला यापूर्वी काही माहिती किंवा अनुभव आहे का?:</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="mushroomExp" value="होय (Yes)" onChange={handleChange} className="w-4 h-4 text-[#2d5a3d]" /> होय (Yes)</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="mushroomExp" value="नाही (No)" onChange={handleChange} className="w-4 h-4 text-[#2d5a3d]" /> नाही (No)</label>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b-2 border-[#d4a33c] pb-2 mb-6 text-[#2d5a3d]">
              भाग ३: प्रशिक्षणाविषयी माहिती (Training Objective)
            </h3>
            <div>
              <label className="block text-sm font-semibold mb-3">१०. हे प्रशिक्षण घेण्याचे तुमचे मुख्य उद्दिष्ट काय आहे? (तुम्ही एकापेक्षा जास्त पर्याय निवडू शकता)</label>
              <div className="space-y-3">
                {[
                  'स्वतःचा नवीन व्यवसाय/यूनिट सुरू करण्यासाठी',
                  'शेतीला जोडधंदा म्हणून',
                  'सेंद्रिय पद्धतीचा अभ्यास आणि ज्ञानासाठी'
                ].map(obj => (
                  <label key={obj} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" value={obj} onChange={handleCheckboxChange} className="w-5 h-5 text-[#2d5a3d] rounded focus:ring-[#2d5a3d]" />
                    <span>{obj}</span>
                  </label>
                ))}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" value="इतर" onChange={handleCheckboxChange} className="w-5 h-5 text-[#2d5a3d] rounded focus:ring-[#2d5a3d]" />
                  <span>इतर:</span>
                  <input type="text" name="otherObjective" onChange={handleChange} className="flex-1 p-2 border-b border-gray-400 focus:outline-none focus:border-[#2d5a3d]" />
                </label>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b-2 border-[#d4a33c] pb-2 mb-6 text-[#2d5a3d]">
              भाग ४: शुल्क आणि नोंदणी तपशील (Payment Details)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-3">११. फी भरल्याची पद्धत (Payment Mode):</label>
                <div className="flex flex-wrap gap-6">
                  {['UPI / GPay / PhonePe', 'Bank Transfer', 'Cash'].map(mode => (
                    <label key={mode} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="paymentMode" value={mode} onChange={handleChange} className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]" />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
                
                {formData.paymentMode === 'UPI / GPay / PhonePe' && (
                  <div className="mt-6 p-6 border-2 border-dashed border-[#2d5a3d] bg-[#f4ecd1]/30 rounded-xl text-center max-w-sm mx-auto">
                    <p className="text-lg font-bold text-[#1c2a1e] mb-1">स्कॅन करून फी भरा (Scan to Pay)</p>
                    <p className="text-xl font-black text-[#2d5a3d] mb-4">प्रशिक्षण फी: ₹१५००</p>
                    
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3D9552958464m%40pnb%26pn%3DBEPCOR%26am%3D1500%26cu%3DINR" 
                      alt="BEPCOR Payment QR Code" 
                      className="w-48 h-48 mx-auto object-contain border border-[#eee6d3] p-2 bg-white rounded-lg shadow-sm"
                    />
                    
                    <p className="text-sm font-semibold text-[#5a6f5c] mt-3">UPI ID: 9552958464m@pnb</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">१२. भरलेली रक्कम (Amount Paid):</label>
                <input type="number" name="amountPaid" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">१३. व्यवहार क्रमांक (Transaction ID / UTR No.):</label>
                <input type="text" name="transactionId" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">१४. फी भरल्याचा दिनांक (Date of Payment):</label>
                <input type="date" name="paymentDate" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
            </div>
          </section>

          {/* CAPTCHA Section */}
          <section className="bg-[#f4ecd1]/40 p-6 rounded-xl border border-[#eee6d3]">
            <label className="block text-sm font-bold mb-4 text-[#1c2a1e]">१५. CAPTCHA (Verification): *</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* Custom CAPTCHA Box */}
              <div 
                className="relative overflow-hidden px-6 py-3 bg-[#ffffff] border border-[#d4a33c] rounded-lg shadow-sm select-none pointer-events-none flex items-center justify-center min-w-[160px]"
                style={{
                  backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.06) 5px, rgba(0,0,0,0.06) 6px)"
                }}
              >
                {/* Wavy Line Overlay */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M 0 20 Q 25 5, 50 20 T 100 20" stroke="rgba(0, 0, 0, 0.4)" strokeWidth="1.5" fill="none" />
                </svg>

                {/* Multi-color text */}
                <div className="relative z-10 flex gap-[6px] text-2xl font-black tracking-wider">
                  {captchaText.split('').map((char, index) => (
                    <span key={index} style={{ color: captchaColors[index % captchaColors.length] }}>
                      {char}
                    </span>
                  ))}
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={generateCaptcha} 
                className="text-sm font-bold text-[#2d5a3d] hover:text-[#1c2a1e] flex items-center gap-1 transition-colors bg-white px-3 py-2 border border-[#eee6d3] rounded-md shadow-sm"
              >
                ↻ Refresh
              </button>
            </div>
            
            <div className="relative w-full md:w-1/2 mt-5">
              <input 
                type="text" 
                value={userInputCaptcha}
                onChange={handleCaptchaChange}
                placeholder="CAPTCHA" 
                required
                maxLength={6}
                className={`w-full p-3 pr-10 border-2 rounded-lg font-bold tracking-widest outline-none transition-colors ${
                  isCaptchaValid ? 'border-green-500 bg-green-50/50' : 'border-gray-300 focus:border-[#2d5a3d]'
                }`} 
              />
              {/* Tick Mark Indicator */}
              {isCaptchaValid && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 font-black text-xl">
                  ✓
                </span>
              )}
            </div>
          </section>

          {/* Submit Button - CAPTCHA बरोबर असल्यावरच दिसेल */}
          {isCaptchaValid && (
            <div className="pt-6 border-t border-gray-200 transition-all duration-500 ease-in-out">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-[#2d5a3d] text-white text-lg font-bold py-4 rounded-xl hover:bg-[#1c2a1e] transition-colors shadow-lg shadow-[#2d5a3d]/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "अर्ज जमा होत आहे (Submitting...)" : "प्रवेश अर्ज जमा करा (Submit Application)"}
              </button>
              <p className="text-xs text-center text-gray-500 mt-4">
                * नोंदणी केल्यानंतर अधिकृत पुष्टीकरणासाठी (Confirmation) आमच्या टीमकडून संपर्क साधला जाईल.
              </p>
            </div>
          )}
          
        </form>
      </div>
    </div>
  );
};

export default MushroomForm;