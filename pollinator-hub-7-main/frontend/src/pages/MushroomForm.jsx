import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <--- हे नवीन जोडले

// === १. डायनॅमिक शीर्षके (Dynamic Titles based on URL) ===
const courseTitles = {
  'mushroom': {
    'English': "Oyster Mushroom Production Training Workshop",
    'मराठी': "ऑयस्टर मशरूम उत्पादन प्रशिक्षण कार्यशाळा",
    'ಕನ್ನಡ': "ಆಯ್ಸ್ಟರ್ ಅಣಬೆ ಉತ್ಪಾದನಾ ತರಬೇತಿ",
    'தமிழ்': "காளான் உற்பத்தி பயிற்சி",
    'తెలుగు': "పుట్టగొడుగుల ఉత్పత్తి శిక్షణ"
  },
  'beekeeping': {
    'English': "Beekeeping Training Workshop",
    'मराठी': "मधुमक्षिका पालन प्रशिक्षण कार्यशाळा",
    'ಕನ್ನಡ': "ಜೇನುಸಾಕಾಣಿಕೆ ತರಬೇತಿ",
    'தமிழ்': "தேனீ வளர்ப்பு பயிற்சி",
    'తెలుగు': "తేనెటీగల పెంపకం శిక్షణ"
  },
  'dairy': {
    'English': "Dairy Farming Training Workshop",
    'मराठी': "दुग्ध व्यवसाय प्रशिक्षण कार्यशाळा",
    'ಕನ್ನಡ': "ಹೈನುಗಾರಿಕೆ ತರಬೇತಿ",
    'தமிழ்': "பால் பண்ணை பயிற்சி",
    'తెలుగు': "పాడి పరిశ్రమ శిక్షణ"
  },
  'sericulture': {
    'English': "Sericulture Training Workshop",
    'मराठी': "रेशीम कोष उत्पादन प्रशिक्षण कार्यशाळा",
    'ಕನ್ನಡ': "ರೇಷ್ಮೆ ಕೃಷಿ ತರಬೇತಿ",
    'தமிழ்': "பட்டுப்புழு வளர்ப்பு பயிற்சி",
    'తెలుగు': "పట్టు పురుగుల పెంపకం శిక్షణ"
  },
  'goat-farming': {
    'English': "Goat Farming Training Workshop",
    'मराठी': "शेळीपालन प्रशिक्षण कार्यशाळा",
    'ಕನ್ನಡ': "ಮೇಕೆ ಸಾಕಾಣಿಕೆ ತರಬೇತಿ",
    'தமிழ்': "ஆடு வளர்ப்பு பயிற்சி",
    'తెలుగు': "మేకల పెంపకం శిక్షణ"
  }
};

const translations = {
  'English': { appForm: "Application Form", langSelect: "Select Form Language:", part1: "Part 1: Personal Details", fullName: "1. Full Name", address: "2. Address", district: "District", taluka: "Taluka", village: "Village / City", pincode: "Pincode", mobile: "3. WhatsApp Number", email: "4. Email ID", age: "5. Age", education: "6. Education Qualification", part2: "Part 2: Professional Background", occupation: "7. Current Occupation", farmer: "Farmer", employed: "Employed", business: "Business", student: "Student", other: "Other", farmExp: "8. Do you have previous farming experience?", mushExp: "9. Do you have previous experience in this field?", yes: "Yes", no: "No", part3: "Part 3: Training Objective", objectiveQ: "10. What is your main objective for taking this training? (Select multiple)", obj1: "To start own new business/unit", obj2: "As an allied agricultural business", obj3: "For study of organic methods", part4: "Part 4: Payment Details", payMode: "11. Payment Mode", scanPay: "Scan to Pay", fee: "Training Fee: ₹1500", upiId: "UPI ID:", amtPaid: "12. Amount Paid", transId: "13. Transaction ID / UTR No.", payDate: "14. Date of Payment", part5: "15. CAPTCHA (Verification)", refresh: "Refresh Code", typeCode: "CAPTCHA", submitting: "Submitting...", submit: "Submit Application", note: "* After registration, our team will contact you for official confirmation." },
  'मराठी': { appForm: "प्रवेश अर्ज", langSelect: "फॉर्मची भाषा निवडा:", part1: "भाग १: वैयक्तिक माहिती", fullName: "१. संपूर्ण नाव", address: "२. संपूर्ण पत्ता", district: "जिल्हा", taluka: "तालुका", village: "गाव / शहर", pincode: "पिन कोड", mobile: "३. मोबाईल क्रमांक", email: "४. ईमेल आयडी", age: "५. वय", education: "६. शिक्षण", part2: "भाग २: व्यावसायिक माहिती", occupation: "७. सध्याचा व्यवसाय", farmer: "शेतकरी", employed: "नोकरदार", business: "व्यावसायिक", student: "विद्यार्थी", other: "इतर", farmExp: "८. तुम्हाला शेतीचा पूर्व अनुभव आहे का?", mushExp: "९. या व्यवसायाबद्दल तुम्हाला यापूर्वी काही माहिती किंवा अनुभव आहे का?", yes: "होय", no: "नाही", part3: "भाग ३: प्रशिक्षणाविषयी माहिती", objectiveQ: "१०. हे प्रशिक्षण घेण्याचे तुमचे मुख्य उद्दिष्ट काय आहे?", obj1: "स्वतःचा नवीन व्यवसाय/यूनिट सुरू करण्यासाठी", obj2: "शेतीला जोडधंदा म्हणून", obj3: "सेंद्रिय पद्धतीचा अभ्यास आणि ज्ञानासाठी", part4: "भाग ४: शुल्क आणि नोंदणी तपशील", payMode: "११. फी भरल्याची पद्धत", scanPay: "स्कॅन करून फी भरा", fee: "प्रशिक्षण फी: ₹१५००", upiId: "UPI ID:", amtPaid: "१२. भरलेली रक्कम", transId: "१३. व्यवहार क्रमांक", payDate: "१४. फी भरल्याचा दिनांक", part5: "१५. CAPTCHA (Verification)", refresh: "दुसरा कोड द्या", typeCode: "CAPTCHA", submitting: "अर्ज जमा होत आहे...", submit: "प्रवेश अर्ज जमा करा", note: "* नोंदणी केल्यानंतर अधिकृत पुष्टीकरणासाठी आमच्या टीमकडून संपर्क साधला जाईल." },
  'ಕನ್ನಡ': { appForm: "ಅರ್ಜಿ ನಮೂನೆ", langSelect: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:", part1: "ಭಾಗ 1: ವೈಯಕ್ತಿಕ ವಿವರಗಳು", fullName: "1. ಪೂರ್ಣ ಹೆಸರು", address: "2. ವಿಳಾಸ", district: "ಜಿಲ್ಲೆ", taluka: "ತಾಲೂಕು", village: "ಗ್ರಾಮ / ನಗರ", pincode: "ಪಿನ್ ಕೋಡ್", mobile: "3. ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", email: "4. ಇಮೇಲ್", age: "5. ವಯಸ್ಸು", education: "6. ಶಿಕ್ಷಣ", part2: "ಭಾಗ 2: ವೃತ್ತಿಪರ ಹಿನ್ನೆಲೆ", occupation: "7. ಪ್ರಸ್ತುತ ಉದ್ಯೋಗ", farmer: "ರೈತ", employed: "ಉದ್ಯೋಗಿ", business: "ವ್ಯಾಪಾರ", student: "ವಿದ್ಯಾರ್ಥಿ", other: "ಇತರ", farmExp: "8. ನಿಮಗೆ ಕೃಷಿ ಅನುಭವವಿದೆಯೇ?", mushExp: "9. ಈ ಕ್ಷೇತ್ರದಲ್ಲಿ ನಿಮಗೆ ಅನುಭವವಿದೆಯೇ?", yes: "ಹೌದು", no: "ಇಲ್ಲ", part3: "ಭಾಗ 3: ತರಬೇತಿಯ ಉದ್ದೇಶ", objectiveQ: "10. ಈ ತರಬೇತಿಯನ್ನು ಪಡೆಯುವ ನಿಮ್ಮ ಮುಖ್ಯ ಉದ್ದೇಶವೇನು?", obj1: "ಹೊಸ ವ್ಯಾಪಾರ ಪ್ರಾರಂಭಿಸಲು", obj2: "ಕೃಷಿಗೆ ಪೂರಕವಾಗಿ", obj3: "ಸಾವಯವ ವಿಧಾನಗಳ ಅಧ್ಯಯನಕ್ಕಾಗಿ", part4: "ಭಾಗ 4: ಪಾವತಿ ವಿವರಗಳು", payMode: "11. ಪಾವತಿ ವಿಧಾನ", scanPay: "ಪಾವತಿಸಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", fee: "ತರಬೇತಿ ಶುಲ್ಕ: ₹1500", upiId: "UPI ID:", amtPaid: "12. ಪಾವತಿಸಿದ ಮೊತ್ತ", transId: "13. ವಹಿವಾಟು ಸಂಖ್ಯೆ", payDate: "14. ಪಾವತಿಯ ದಿನಾಂಕ", part5: "15. CAPTCHA (Verification)", refresh: "ರಿಫ್ರೆಶ್", typeCode: "CAPTCHA", submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...", submit: "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ", note: "* ಅಧಿಕೃತ ದೃಢೀಕರಣಕ್ಕಾಗಿ ನಮ್ಮ ತಂಡ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ." },
  'தமிழ்': { appForm: "விண்ணப்ப படிவம்", langSelect: "மொழியைத் தேர்ந்தெடுக்கவும்:", part1: "பகுதி 1: தனிப்பட்ட விவரங்கள்", fullName: "1. முழு பெயர்", address: "2. முகவரி", district: "மாவட்டம்", taluka: "தாலுகா", village: "கிராமம் / நகரம்", pincode: "பின்கோடு", mobile: "3. மொபைல் எண்", email: "4. மின்னஞ்சல்", age: "5. வயது", education: "6. கல்வி", part2: "பகுதி 2: தொழில் விவரங்கள்", occupation: "7. தற்போதைய தொழில்", farmer: "விவசாயி", employed: "பணியாளர்", business: "வியாபாரம்", student: "மாணவர்", other: "மற்றவை", farmExp: "8. விவசாய முன் அனுபவம் உள்ளதா?", mushExp: "9. இந்த துறையில் முன் அனுபவம் உள்ளதா?", yes: "ஆம்", no: "இல்லை", part3: "பகுதி 3: பயிற்சியின் நோக்கம்", objectiveQ: "10. பயிற்சியின் முக்கிய நோக்கம் என்ன?", obj1: "புதிய தொழில் தொடங்க", obj2: "விவசாயத்துடன் இணைந்த தொழில்", obj3: "இயற்கை முறைகளை கற்க", part4: "பகுதி 4: கட்டண விவரங்கள்", payMode: "11. கட்டண முறை", scanPay: "ஸ்கேன் செய்து செலுத்தவும்", fee: "பயிற்சி கட்டணம்: ₹1500", upiId: "UPI ID:", amtPaid: "12. செலுத்திய தொகை", transId: "13. பரிவர்த்தனை எண்", payDate: "14. பணம் செலுத்திய தேதி", part5: "15. CAPTCHA (Verification)", refresh: "புதுப்பி", typeCode: "CAPTCHA", submitting: "சமர்ப்பிக்கப்படுகிறது...", submit: "சமர்ப்பிக்கவும்", note: "* அதிகாரப்பூர்வ உறுதிப்படுத்தலுக்கு எங்கள் குழு உங்களை தொடர்பு கொள்ளும்." },
  'తెలుగు': { appForm: "దరఖాస్తు ఫారం", langSelect: "భాషను ఎంచుకోండి:", part1: "భాగం 1: వ్యక్తిగత వివరాలు", fullName: "1. పూర్తి పేరు", address: "2. చిరునామా", district: "జిల్లా", taluka: "తాలూకా", village: "గ్రామం / నగరం", pincode: "పిన్‌కోడ్", mobile: "3. మొబైల్ నంబర్", email: "4. ఈమెయిల్", age: "5. వయస్సు", education: "6. విద్య", part2: "భాగం 2: వృత్తి వివరాలు", occupation: "7. ప్రస్తుత వృత్తి", farmer: "రైతు", employed: "ఉద్యోగి", business: "వ్యాపారం", student: "విద్యార్థి", other: "ఇతర", farmExp: "8. వ్యవసాయంలో అనుభవం ఉందా?", mushExp: "9. ఈ రంగంలో మీకు మునుపటి అనుభవం ఉందా?", yes: "అవును", no: "కాదు", part3: "భాగం 3: శిక్షణ ఉద్దేశ్యం", objectiveQ: "10. ఈ శిక్షణ తీసుకోవడానికి ముఖ్య ఉద్దేశ్యం ఏమిటి?", obj1: "కొత్త వ్యాపారం ప్రారంభించడానికి", obj2: "వ్యవసాయ అనుబంధ వ్యాపారంగా", obj3: "సేంద్రీయ పద్ధతుల అధ్యయనం కోసం", part4: "భాగం 4: చెల్లింపు వివరాలు", payMode: "11. చెల్లింపు విధానం", scanPay: "చెల్లించడానికి స్కాన్ చేయండి", fee: "శిక్షణ ఫీజు: ₹1500", upiId: "UPI ID:", amtPaid: "12. చెల్లించిన మొత్తం", transId: "13. లావాదేవీ సంఖ్య", payDate: "14. చెల్లించిన తేదీ", part5: "15. CAPTCHA (Verification)", refresh: "రిఫ్రెష్ చేయండి", typeCode: "CAPTCHA", submitting: "సమర్పించబడుతోంది...", submit: "దరఖాస్తు సమర్పించండి", note: "* అధికారిక నిర్ధారణ కోసం మా బృందం మిమ్మల్ని సంప్రదిస్తుంది." }
};

const MushroomForm = () => {
  // === URL मधील :courseId वाचणे ===
  const { courseId } = useParams();
  
  // जर लिंकमध्ये चुकीचे नाव आले, तर डीफॉल्ट 'mushroom' वापरले जाईल
  const validCourse = courseTitles[courseId] ? courseId : 'mushroom';

  const [language, setLanguage] = useState('English');

  const t = (key) => {
    if (language === 'English') return translations['English'][key];
    return `${translations[language][key]} (${translations['English'][key]})`;
  };

  // डायनॅमिक टायटल देणारे फंक्शन
  const getTitle = () => {
    if (language === 'English') return courseTitles[validCourse]['English'];
    return `${courseTitles[validCourse][language]} (${courseTitles[validCourse]['English']})`;
  };

  const [formData, setFormData] = useState({
    fullName: '', village: '', taluka: '', district: '', pincode: '',
    mobile: '', email: '', age: '', education: '',
    occupation: '', otherOccupation: '', farmingExp: '', mushroomExp: '',
    objectives: [], otherObjective: '',
    paymentMode: '', amountPaid: '', transactionId: '', paymentDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // CAPTCHA States
  const [captchaText, setCaptchaText] = useState('');
  const [userInputCaptcha, setUserInputCaptcha] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [captchaColors, setCaptchaColors] = useState([]);
  const [captchaWave, setCaptchaWave] = useState('');

  const generateCaptcha = () => {
    const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
    const nums = "123456789";
    const all = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789";
    let result = "";
    result += upper.charAt(Math.floor(Math.random() * upper.length));
    result += nums.charAt(Math.floor(Math.random() * nums.length));
    for (let i = 0; i < 4; i++) {
      result += all.charAt(Math.floor(Math.random() * all.length));
    }
    setCaptchaText(result);
    setUserInputCaptcha('');
    setIsCaptchaValid(false);

    const colorPalette = [
      '#450a0a', '#ef4444', '#fca5a5', '#052e16', '#16a34a', '#86efac',
      '#172554', '#2563eb', '#93c5fd', '#4a044e', '#9333ea', '#d8b4fe',
      '#422006', '#ca8a04', '#fde047', '#022c22', '#0d9488', '#5eead4'
    ];
    const newColors = Array.from({length: 6}, () => colorPalette[Math.floor(Math.random() * colorPalette.length)]);
    setCaptchaColors(newColors);

    const y1 = Math.floor(Math.random() * 20) + 10;
    const cy1 = Math.floor(Math.random() * 40);
    const y2 = Math.floor(Math.random() * 20) + 10;
    const y3 = Math.floor(Math.random() * 20) + 10;
    setCaptchaWave(`M 0 ${y1} Q 25 ${cy1}, 50 ${y2} T 100 ${y3}`);
  };

  useEffect(() => { generateCaptcha(); }, []);

  const handleCaptchaChange = (e) => {
    const value = e.target.value;
    setUserInputCaptcha(value);
    setIsCaptchaValid(value === captchaText);
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
    
    const scriptURL = "https://script.google.com/macros/s/AKfycbxxnBj5h9vcj_C1jR9f6G147TB0wsiehJ9KbwgO5AOJW6UI8tsknoJoOBE3Q1Dqvh6M/exec"; // येथे तुमची नवीन Google Sheet ची लिंक टाका

    // फॉर्म डेटामध्ये कोर्सचे नाव (courseName) पाठवणे
    const finalSubmitData = {
      ...formData,
      courseName: validCourse // हे Google Sheet ला सांगेल की फॉर्म कशाचा आहे
    };

    fetch(scriptURL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalSubmitData)
    })
    .then(() => {
      alert("तुमचा अर्ज यशस्वीरित्या जमा झाला आहे! (Form Submitted Successfully!)");
      setIsSubmitting(false);
      window.location.reload(); 
    })
    .catch((error) => {
      alert("काहीतरी चूक झाली आहे. कृपया पुन्हा प्रयत्न करा.");
      setIsSubmitting(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#fcfaf5] py-12 px-4 sm:px-6 lg:px-8 font-mukta">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-[#eee6d3]">
        
        {/* हिरवी पट्टी (Green Header Block) */}
        <div className="bg-[#2d5a3d] px-6 py-8 text-center text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 font-display tracking-wide">BEPCOR</h1>
          <p className="text-xs md:text-sm text-[#e8e0c8] mb-4 uppercase tracking-widest">
            BE-Ecoliteracy Pollinator Conservation And Research Foundation
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-[#d4a33c]">
            {getTitle()} {/* <--- येथे डायनॅमिक नाव दिसेल */}
          </h2>
          <p className="text-lg mt-1 text-white opacity-90">{t('appForm')}</p>
        </div>

        {/* भाषा निवडण्याची पट्टी */}
        <div className="bg-[#f4ecd1] px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-b border-[#eee6d3]">
           <label className="font-bold text-[#1c2a1e] mb-2 sm:mb-0 text-sm md:text-base">
             {t('langSelect')}
           </label>
           <select 
             value={language} 
             onChange={(e) => setLanguage(e.target.value)}
             className="p-2.5 rounded-lg border border-[#d4a33c] bg-white text-[#1c2a1e] font-semibold outline-none focus:ring-2 focus:ring-[#2d5a3d] min-w-[200px] cursor-pointer shadow-sm"
           >
             <option value="English">English</option>
             <option value="मराठी">मराठी (Marathi)</option>
             <option value="ಕನ್ನಡ">ಕನ್ನಡ (Kannada)</option>
             <option value="தமிழ்">தமிழ் (Tamil)</option>
             <option value="తెలుగు">తెలుగు (Telugu)</option>
           </select>
        </div>

        {/* मुख्य फॉर्म */}
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10 text-[#1c2a1e]">
          
          <section>
            <h3 className="text-xl font-bold border-b-2 border-[#d4a33c] pb-2 mb-6 text-[#2d5a3d]">
              {t('part1')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">{t('fullName')}: *</label>
                <input type="text" name="fullName" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">{t('address')}:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input type="text" name="village" placeholder={t('village')} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
                  <input type="text" name="taluka" placeholder={t('taluka')} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
                  <input type="text" name="district" placeholder={t('district')} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
                  <input type="text" name="pincode" placeholder={t('pincode')} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">{t('mobile')}: *</label>
                <input type="tel" name="mobile" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{t('email')}:</label>
                <input type="email" name="email" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{t('age')}:</label>
                <input type="number" name="age" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{t('education')}:</label>
                <input type="text" name="education" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b-2 border-[#d4a33c] pb-2 mb-6 text-[#2d5a3d]">
              {t('part2')}
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3">{t('occupation')}:</label>
                <div className="flex flex-wrap gap-4">
                  {[t('farmer'), t('employed'), t('business'), t('student')].map(occ => (
                    <label key={occ} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="occupation" value={occ} onChange={handleChange} className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]" />
                      <span>{occ}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer w-full md:w-auto">
                    <input type="radio" name="occupation" value="Other" onChange={handleChange} className="w-4 h-4 text-[#2d5a3d] focus:ring-[#2d5a3d]" />
                    <span>{t('other')}:</span>
                    <input type="text" name="otherOccupation" onChange={handleChange} disabled={formData.occupation !== 'Other'} className="ml-2 p-1 border-b border-gray-400 focus:outline-none focus:border-[#2d5a3d]" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">{t('farmExp')}:</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="farmingExp" value="Yes" onChange={handleChange} className="w-4 h-4 text-[#2d5a3d]" /> {t('yes')}</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="farmingExp" value="No" onChange={handleChange} className="w-4 h-4 text-[#2d5a3d]" /> {t('no')}</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">{t('mushExp')}:</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="mushroomExp" value="Yes" onChange={handleChange} className="w-4 h-4 text-[#2d5a3d]" /> {t('yes')}</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="mushroomExp" value="No" onChange={handleChange} className="w-4 h-4 text-[#2d5a3d]" /> {t('no')}</label>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b-2 border-[#d4a33c] pb-2 mb-6 text-[#2d5a3d]">
              {t('part3')}
            </h3>
            <div>
              <label className="block text-sm font-semibold mb-3">{t('objectiveQ')}</label>
              <div className="space-y-3">
                {[t('obj1'), t('obj2'), t('obj3')].map(obj => (
                  <label key={obj} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" value={obj} onChange={handleCheckboxChange} className="w-5 h-5 text-[#2d5a3d] rounded focus:ring-[#2d5a3d]" />
                    <span>{obj}</span>
                  </label>
                ))}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" value="Other" onChange={handleCheckboxChange} className="w-5 h-5 text-[#2d5a3d] rounded focus:ring-[#2d5a3d]" />
                  <span>{t('other')}:</span>
                  <input type="text" name="otherObjective" onChange={handleChange} className="flex-1 p-2 border-b border-gray-400 focus:outline-none focus:border-[#2d5a3d]" />
                </label>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b-2 border-[#d4a33c] pb-2 mb-6 text-[#2d5a3d]">
              {t('part4')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-3">{t('payMode')}:</label>
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
                    <p className="text-lg font-bold text-[#1c2a1e] mb-1">{t('scanPay')}</p>
                    <p className="text-xl font-black text-[#2d5a3d] mb-4">{t('fee')}</p>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3D9552958464m%40pnb%26pn%3DBEPCOR%26am%3D1500%26cu%3DINR" alt="QR Code" className="w-48 h-48 mx-auto object-contain border border-[#eee6d3] p-2 bg-white rounded-lg shadow-sm" />
                    <p className="text-sm font-semibold text-[#5a6f5c] mt-3">{t('upiId')} 9552958464m@pnb</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{t('amtPaid')}:</label>
                <input type="number" name="amountPaid" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{t('transId')}:</label>
                <input type="text" name="transactionId" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">{t('payDate')}:</label>
                <input type="date" name="paymentDate" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5a3d]" />
              </div>
            </div>
          </section>

          <section className="bg-[#f4ecd1]/40 p-6 rounded-xl border border-[#eee6d3]">
            <label className="block text-sm font-bold mb-4 text-[#1c2a1e]">{t('part5')}: *</label>
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
                ↻ {t('refresh')}
              </button>
            </div>
            
            <div className="relative w-full md:w-1/2 mt-5">
              <input 
                type="text" value={userInputCaptcha} onChange={handleCaptchaChange} placeholder={t('typeCode')} required maxLength={6}
                className={`w-full p-3 pr-10 border-2 rounded-lg font-bold tracking-widest outline-none transition-colors ${isCaptchaValid ? 'border-green-500 bg-green-50/50' : 'border-gray-300 focus:border-[#2d5a3d]'}`} 
              />
              {isCaptchaValid && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 font-black text-xl">✓</span>}
            </div>
          </section>

          {isCaptchaValid && (
            <div className="pt-6 border-t border-gray-200 transition-all duration-500 ease-in-out">
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#2d5a3d] text-white text-lg font-bold py-4 rounded-xl hover:bg-[#1c2a1e] transition-colors shadow-lg shadow-[#2d5a3d]/30 disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? t('submitting') : t('submit')}
              </button>
              <p className="text-xs text-center text-gray-500 mt-4">{t('note')}</p>
            </div>
          )}
          
        </form>
      </div>
    </div>
  );
};

export default MushroomForm;