import React, { useState } from 'react';
import { Search, MapPin, Mic, Navigation, Shield, Zap, IndianRupee, RotateCw, Loader2 } from 'lucide-react';

export default function HomeSearch({ onSearch, isLoading, setCurrentScreen, lang }) {
    const [isListening, setIsListening] = useState(false);
    const [destinationText, setDestinationText] = useState("India Gate");

    const t = {
        EN: {
            originPlaceholder: "Enter Origin",
            destinationPlaceholder: "Enter Destination",
            voiceInput: "Voice Input",
            listening: "Listening...",
            tapToSpeak: "Tap to Speak",
            useLocation: "Use Current Location",
            findRoutes: "Find Routes",
            analyzing: "Analyzing Routes...",
            aiActive: "AI Intelligence Active",
            aiDesc: "Optimization modes now available on the results page after AI analysis.",
            companionActive: "SafeCompanion Active",
            companionDesc: "We found 2 trusted companions sharing your likely route to India Gate.",
            viewCompanions: "View Companions"
        },
        HI: {
            originPlaceholder: "प्रारंभिक स्थान दर्ज करें",
            destinationPlaceholder: "गंतव्य दर्ज करें",
            voiceInput: "वॉइस इनपुट",
            listening: "सुन रहे हैं...",
            tapToSpeak: "बोलने के लिए टैप करें",
            useLocation: "वर्तमान स्थान का उपयोग करें",
            findRoutes: "रास्ते खोजें",
            analyzing: "रास्तों का विश्लेषण...",
            aiActive: "AI इंटेलिजेंस सक्रिय",
            aiDesc: "AI विश्लेषण के बाद परिणाम पृष्ठ पर अनुकूलन मोड उपलब्ध हैं।",
            companionActive: "SafeCompanion सक्रिय",
            companionDesc: "हमें आपके संभावित रास्ते के लिए 2 विश्वसनीय साथी मिले हैं।",
            viewCompanions: "साथी देखें"
        }
    }[lang || 'EN'];

    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition API is not supported in your browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'EN' ? 'en-IN' : 'hi-IN';
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setDestinationText(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

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
                            placeholder={t.originPlaceholder}
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
                            placeholder={t.destinationPlaceholder}
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
                        <span>{isListening ? t.listening : t.voiceInput}</span>
                        {!isListening && <span className="bg-primary-200 text-primary-800 text-[10px] uppercase font-black px-2 py-0.5 rounded-full ml-1 rotate-3">{t.tapToSpeak}</span>}
                    </button>

                    <button
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors interactive-tap"
                    >
                        <Navigation className="h-4 w-4" />
                        <span>{t.useLocation}</span>
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
                            {t.analyzing}
                        </>
                    ) : (
                        t.findRoutes
                    )}
                </button>
            </div>

            {/* AI Optimization Insight */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <RotateCw className="w-3 h-3 animate-spin-slow" />
                    {t.aiActive}
                </p>
                <p className="text-xs text-slate-600 font-medium">{t.aiDesc}</p>
            </div>

            {/* SafeCompanion Promo */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-5 border border-emerald-100/50 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl -mr-8 -mt-8"></div>
                <h3 className="text-emerald-900 font-bold mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    {t.companionActive}
                </h3>
                <p className="text-emerald-700/80 text-xs mb-3 font-medium leading-relaxed max-w-[85%] relative z-10">
                    {t.companionDesc}
                </p>
                <button
                    onClick={() => setCurrentScreen('companion')}
                    className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-emerald-700 interactive-tap relative z-10"
                >
                    {t.viewCompanions}
                </button>
            </div>
        </div>
    );
}
