import React, { useState } from 'react';
import { Search, MapPin, Mic, Navigation, Shield, RotateCw, Loader2 } from 'lucide-react';

// Map language code → BCP47 speech recognition locale
const SPEECH_LOCALE = {
    EN: 'en-IN', HI: 'hi-IN', BN: 'bn-IN', TE: 'te-IN', MR: 'mr-IN',
    TA: 'ta-IN', GU: 'gu-IN', KN: 'kn-IN', ML: 'ml-IN', PA: 'pa-IN',
    UR: 'ur-PK', OD: 'or-IN', AS: 'as-IN',
};

const STRINGS = {
    originPlaceholder: {
        EN: 'Enter Origin', HI: 'प्रारंभिक स्थान दर्ज करें', BN: 'উৎপত্তি লিখুন',
        TE: 'మూలం నమోదు చేయండి', MR: 'उगम नोंदवा', TA: 'தொடக்க இடம் உள்ளிடுக',
        GU: 'ઉત્પत્તિ દાખલ કરો', KN: 'ಮೂಲ ನಮೂದಿಸಿ', ML: 'ഉൽ‌ഭവം നൽകുക',
        PA: 'ਮੂਲ ਦਾਖਲ ਕਰੋ', UR: 'ابتدا درج کریں', OD: 'ଆରମ୍ଭ ଲେଖ',
    },
    destinationPlaceholder: {
        EN: 'Enter Destination', HI: 'गंतव्य दर्ज करें', BN: 'গন্তব্য লিখুন',
        TE: 'గమ్యం నమోదు చేయండి', MR: 'गंतव्य नोंदवा', TA: 'இலக்கை உள்ளிடுக',
        GU: 'ગంతવ્ય દाखल करो', KN: 'ಗಮ್ಯ ನಮೂದಿಸಿ', ML: 'ലക്ഷ്യം നൽകുക',
        PA: 'ਮੰਜ਼ਿਲ ਦਾਖਲ ਕਰੋ', UR: 'منزل درج کریں', OD: 'ଗନ୍ତବ୍ୟ ଲେଖ',
    },
    voiceInput: {
        EN: 'Voice Input', HI: 'वॉइस इनपुट', BN: 'ভয়েস ইনপুট',
        TE: 'వాయిస్ ఇన్‌పుట్', MR: 'आवाज इनपुट', TA: 'குரல் உள்ளீடு',
        GU: 'વૉઇс ઇнпут', KN: 'ಧ್ವನಿ ಇನ್‌ಪুಟ್', ML: 'ശബ്ദ ഇൻ‌പുട്ട്',
        PA: 'ਵੌਇਸ ਇਨਪੁਟ', UR: 'وائس ان پٹ', OD: 'ভয়ସ ଇନপୁଟ',
    },
    listening: {
        EN: 'Listening...', HI: 'सुन रहे हैं...', BN: 'শুনছি...',
        TE: 'వింటున్నాం...', MR: 'ऐकत आहे...', TA: 'கேட்கிறோம்...',
        GU: 'સাংભळી ρήa...', KN: 'ಆಲಿಸುತ್ತಿದ್ದೇನೆ...', ML: 'ശ്രദ്ധിക്കുന്നു...',
        PA: 'ਸੁਣ ਰਿਹਾ ਹਾਂ...', UR: 'سن رہا ہوں...', OD: 'ଶୁଣୁଛୁ...',
    },
    tapToSpeak: {
        EN: 'Tap to Speak', HI: 'बोलने के लिए टैप करें', BN: 'কথা বলতে ট্যাপ করুন',
        TE: 'మాట్లాడటానికి నొక్కండి', MR: 'बोलण्यासाठी टॅप करा', TA: 'பேச தட்டவும்',
        GU: 'બোল�ा ટॅप করো', KN: 'ಮಾтనাడলु ಟ್ಯಾপ್ ಮಾಡಿ', ML: 'സംসارিക്കাൻ ടాপ്',
        PA: 'ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ', UR: 'بولنے کے لیے ٹیپ کریں', OD: 'ଟ୍ୟାପ କର',
    },
    useLocation: {
        EN: 'Use Current Location', HI: 'वर्तमान स्थान का उपयोग करें',
        BN: 'বর্তমান অবস্থান ব্যবহার করুন', TE: 'ప్రస్తుత స్థానం ఉపయోగించండి',
        MR: 'सद्य স্थান वापरा', TA: 'தற்போதைய இடத்தை பயன்படுத்து',
        GU: 'वर्तমाн স্থান వापरো', KN: 'ಪ್ರস్తుτ ಸ್ಥಳ ಬಳಸಿ', ML: 'നিলवิルे സ്ഥലം ഉपयोगിക്കൂ',
        PA: 'ਮੌਜੂਦਾ ਟਿਕਾਣਾ ਵਰਤੋ', UR: 'موجودہ مقام استعمال کریں', OD: 'ସ୍ଥାନ ବ୍ୟবهার করা',
    },
    findRoutes: {
        EN: 'Find Routes', HI: 'रास्ते खोजें', BN: 'রুট খুঁজুন', TE: 'మార్గాలు కనుగొనండి',
        MR: 'मार्ग शोधा', TA: 'வழிகளை கண்டறி', GU: 'माর्গ শোধো', KN: 'ಮಾর্গ ಹுডুকி',
        ML: 'வழிகள் കণ্ডেত্তুക', PA: 'ਰਸਤੇ ਲੱਭੋ', UR: 'راستے تلاش کریں', OD: 'ରাস্তা ఖোজ',
    },
    analyzing: {
        EN: 'Analyzing Routes...', HI: 'रास्तों का विश्लेषण...', BN: 'রুট বিশ্লেষণ করা হচ্ছে...',
        TE: 'మార్గాలు విశ్లేషిస్తున్నాం...', MR: 'मार्ग विश्लेषण...', TA: 'வழி பகுப்பாய்வு...',
        GU: 'মার্গ বিশ্লেষণ...', KN: 'ಮাರ್ಗ বিশ্লেষণ...', ML: 'वழி വিশ்கলনం...',
        PA: 'ਰਸਤੇ ਵਿਸ਼ਲੇਸ਼ਣ...', UR: 'راستے تجزیہ...', OD: 'ରাস্তা বিশ্লেষণ...',
    },
    aiActive: {
        EN: 'AI Intelligence Active', HI: 'AI इंटेलिजेंस सक्रिय', BN: 'AI বুদ্ধিমত্তা সক্রিয়',
        TE: 'AI ఇంటెలిజెన్స్ యాక్టివ్', MR: 'AI बुद्धिमत्ता सक्रिय', TA: 'AI நுண்ணறிவு செயலில்',
        GU: 'AI ইন্টেলিজেন্স সক্রিয়', KN: 'AI ইন্টেলিজেন্স সক্রিয়', ML: 'AI ইন্টলিজেন্স সজীবম্',
        PA: 'AI ਇੰਟੈਲੀਜੈਂਸ ਸਰਗਰਮ', UR: 'AI ذہانت فعال', OD: 'AI ইন্টেলিজেন্স সক্রিয়',
    },
    aiDesc: {
        EN: 'Optimization modes available on results page after AI analysis.',
        HI: 'AI विश्लेषण के बाद परिणाम पृष्ठ पर अनुकूलन मोड उपलब्ध हैं।',
        BN: 'AI বিশ্লেষণের পরে ফলাফল পৃষ্ঠায় অপ্টিমাইজেশন মোড পাওয়া যাচ্ছে।',
        TE: 'AI విశ్లేషణ తర్వాత ఫలితాల పేజీలో ఆప్టిమైజే మోడ్ అందుబాటులో ఉన్నాయి.',
        MR: 'AI विश्लेषणानंतर निकाल पृष्ठावर ऑप्टिमायझेशन मोड उपलब्ध आहेत.',
        TA: 'AI பகுப்பாய்வுக்குப் பிறகு முடிவுகள் பக்கத்தில் தகுதிமாற்ற முறைகள் கிடைக்கின்றன.',
    },
    companionActive: {
        EN: 'SafeCompanion Active', HI: 'SafeCompanion सक्रिय', BN: 'SafeCompanion সক্রিয়',
        TE: 'SafeCompanion యాక్టివ్', MR: 'SafeCompanion सक्रिय', TA: 'SafeCompanion செயலில்',
        GU: 'SafeCompanion সক্রিয়', KN: 'SafeCompanion সক্রিয়', ML: 'SafeCompanion সজীবম্',
        PA: 'SafeCompanion ਸਰਗਰਮ', UR: 'SafeCompanion فعال', OD: 'SafeCompanion সক্রিয়',
    },
    companionDesc: {
        EN: 'We found 2 trusted companions sharing your likely route to India Gate.',
        HI: 'हमें आपके संभावित रास्ते के लिए 2 विश्वसनीय साथी मिले हैं।',
        BN: 'আমরা ইন্ডিয়া গেটের রুটে ২ জন বিশ্বস্ত সঙ্গী খুঁজে পেয়েছি।',
        TE: 'ఇండియా గేట్ మార్గంలో 2 నమ్మకమైన సహచరులు కనుగొనబడ్డారు.',
        MR: 'आम्हाला इंडिया गेटच्या मार्गासाठी 2 विश्वसनीय साथी मिळाले.',
        TA: 'இந்தியா கேட் வழியில் 2 நம்பகமான தோழர்கள் கண்டறியப்பட்டனர்.',
    },
    viewCompanions: {
        EN: 'View Companions', HI: 'साथी देखें', BN: 'সঙ্গীদের দেখুন',
        TE: 'సహచరులను చూడండి', MR: 'साथी पहा', TA: 'தோழர்களை பார்க்க',
        GU: 'সাথী দেখুন', KN: 'ਸਾਥੀ ਦੇਖੋ', ML: 'കൂট্টালিカளை কাণुக',
        PA: 'ਸਾਥੀ ਦੇਖੋ', UR: 'ساتھی دیکھیں', OD: 'ਸਾਥੀ দেখ',
    },
};

function s(key, lang) {
    return STRINGS[key]?.[lang] || STRINGS[key]?.['EN'] || key;
}

export default function HomeSearch({ onSearch, isLoading, setCurrentScreen, lang }) {
    const [isListening, setIsListening] = useState(false);
    const [destinationText, setDestinationText] = useState("India Gate");

    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition API is not supported in your browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = SPEECH_LOCALE[lang] || 'en-IN';
        recognition.interimResults = false;

        recognition.onstart = () => { setIsListening(true); };
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setDestinationText(transcript);
            setIsListening(false);
        };
        recognition.onerror = () => { setIsListening(false); };
        recognition.onend = () => { setIsListening(false); };
        recognition.start();
    };

    return (
        <div className="p-4 space-y-6 pb-20 animate-slide-up">
            {/* Search Card */}
            <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                {/* Inputs */}
                <div className="space-y-4 relative">
                    <div className="absolute left-[22px] top-[40px] bottom-[40px] w-0.5 bg-slate-200 z-0 border-l border-dashed border-slate-300"></div>
                    <div className="relative z-10">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <div className="p-1 bg-blue-100 rounded-full">
                                <Search className="h-4 w-4 text-primary-600" />
                            </div>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-0 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-inner font-medium text-[15px]"
                            placeholder={s('originPlaceholder', lang)}
                            defaultValue="New Delhi Railway Station"
                        />
                    </div>
                    <div className="relative z-10">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <div className="p-1 bg-amber-100 rounded-full">
                                <MapPin className="h-4 w-4 text-amber-600" />
                            </div>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-0 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-inner font-medium text-[15px]"
                            placeholder={s('destinationPlaceholder', lang)}
                            value={destinationText}
                            onChange={(e) => setDestinationText(e.target.value)}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                    <button
                        className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors interactive-tap border-2
                            ${isListening ? 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse' : 'bg-primary-50 hover:bg-primary-100 text-primary-700 border-primary-100'}
                        `}
                        onClick={handleVoiceInput}
                    >
                        <Mic className={`h-5 w-5 ${isListening ? 'animate-bounce' : ''}`} />
                        <span>{isListening ? s('listening', lang) : s('voiceInput', lang)}</span>
                        {!isListening && <span className="bg-primary-200 text-primary-800 text-[10px] uppercase font-black px-2 py-0.5 rounded-full ml-1 rotate-3">{s('tapToSpeak', lang)}</span>}
                    </button>

                    <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors interactive-tap">
                        <Navigation className="h-4 w-4" />
                        <span>{s('useLocation', lang)}</span>
                    </button>
                </div>

                {/* Search Primary Button */}
                <button
                    onClick={() => onSearch("New Delhi Railway Station", destinationText)}
                    disabled={isLoading}
                    className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary-500/30 interactive-tap hover-lift flex justify-center items-center gap-2 disabled:opacity-70 disabled:pointer-events-none transition-all"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {s('analyzing', lang)}
                        </>
                    ) : (
                        s('findRoutes', lang)
                    )}
                </button>
            </div>

            {/* AI Optimization Insight */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <RotateCw className="w-3 h-3 animate-spin-slow" />
                    {s('aiActive', lang)}
                </p>
                <p className="text-xs text-slate-600 font-medium">{s('aiDesc', lang)}</p>
            </div>

            {/* SafeCompanion Promo */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-5 border border-emerald-100/50 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl -mr-8 -mt-8"></div>
                <h3 className="text-emerald-900 font-bold mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    {s('companionActive', lang)}
                </h3>
                <p className="text-emerald-700/80 text-xs mb-3 font-medium leading-relaxed max-w-[85%] relative z-10">
                    {s('companionDesc', lang)}
                </p>
                <button
                    onClick={() => setCurrentScreen('companion')}
                    className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-emerald-700 interactive-tap relative z-10"
                >
                    {s('viewCompanions', lang)}
                </button>
            </div>
        </div>
    );
}
