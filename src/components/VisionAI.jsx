import React, { useState, useEffect } from 'react';
import { Scan, Bus, ExternalLink, Globe, Camera, Layers, MapPin, Navigation, ArrowRight, X, Clock, Navigation2, Compass, Radio, Save, Check } from 'lucide-react';

export default function VisionAI({ lang, onNavigate }) {
    const [mode, setMode] = useState('detect'); // 'detect' or 'translate'
    const [scanStatus, setScanStatus] = useState('waiting'); // 'waiting', 'scanning', 'identified'
    const [showLiveData, setShowLiveData] = useState(false);
    const [busProgress, setBusProgress] = useState(1);
    const [mockLocation, setMockLocation] = useState({
        near: "Nehru Place",
        status: "Moving toward IIT Gate"
    });
    const [isSaved, setIsSaved] = useState(false);

    const stops = [
        { id: 1, name: "Nehru Place", time: "10:15 AM", status: "Passed" },
        { id: 2, name: "IIT Gate", time: "10:30 AM", status: "Near" },
        { id: 3, name: "Munirka", time: "10:45 AM", status: "Upcoming" },
        { id: 4, name: "Dhaula Kuan", time: "11:15 AM", status: "Destination" }
    ];

    // Translation dictionary
    const t = {
        EN: {
            title: "Bharat Vision",
            subtitle: "AI-Powered Recognition",
            waiting: "Waiting for Lens Stream...",
            scanningSigns: "Scanning for Transport Signs...",
            scanningBus: "Identifying Public Transport...",
            busIdentified: "Bus 764 Identified (94%)",
            signTranslated: "Sign Translated (98%)",
            liveData: "Live Route Data",
            viewRoute: "View Route",
            navigate: "Navigate with This Bus",
            compare: "Compare Routes",
            currentLoc: "Near",
            movingTo: "Moving toward",
            eta: "Estimated Arrival",
            save: "Save Translation",
            saved: "Saved to History",
            signResult: "India Gate",
            signType: "Heritage Site Sign"
        },
        HI: {
            title: "भारत विजन",
            subtitle: "एआई-पावर्ड पहचान",
            waiting: "लेंस स्ट्रीम की प्रतीक्षा कर रहा है...",
            scanningSigns: "परिवहन संकेतों को स्कैन कर रहा है...",
            scanningBus: "सार्वजनिक परिवहन की पहचान...",
            busIdentified: "बस 764 की पहचान (94%)",
            signTranslated: "संकेत अनुवादित (98%)",
            liveData: "लाइव रूट डेटा",
            viewRoute: "रूट देखें",
            navigate: "इस बस के साथ नेविगेट करें",
            compare: "रूट की तुलना करें",
            currentLoc: "के पास",
            movingTo: "की ओर बढ़ रहा है",
            eta: "अनुमानित आगमन",
            save: "अनुवाद सहेजें",
            saved: "इतिहास में सहेजा गया",
            signResult: "इंडिया गेट",
            signType: "विरासत स्थल संकेत"
        }
    }[lang || 'EN'];

    // Simulation: Multi-stage scanning
    useEffect(() => {
        if (scanStatus === 'waiting') {
            const timer = setTimeout(() => setScanStatus('scanning'), 2000);
            return () => clearTimeout(timer);
        }
        if (scanStatus === 'scanning') {
            const timer = setTimeout(() => {
                setScanStatus('identified');
                announceIdentification();
            }, 8000); // Increased from 5000 to 8000 for visibility
            return () => clearTimeout(timer);
        }
    }, [scanStatus, mode]);

    // Simulation: Mock movement
    useEffect(() => {
        const interval = setInterval(() => {
            setBusProgress(prev => {
                const next = (prev % 4) + 1;
                if (next === 1) setMockLocation({ near: "Nehru Place", status: "Moving toward IIT Gate" });
                if (next === 2) setMockLocation({ near: "IIT Gate", status: "Moving toward Munirka" });
                if (next === 3) setMockLocation({ near: "Munirka", status: "Moving toward Dhaula Kuan" });
                if (next === 4) setMockLocation({ near: "Near Dhaula Kuan", status: "Arriving at Destination" });
                return next;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const announceIdentification = () => {
        if ('speechSynthesis' in window) {
            let message = "";
            if (mode === 'detect') {
                message = lang === 'HI' ? "बस 764 की पहचान हुई" : "Bus 764 identified";
            } else {
                message = lang === 'HI' ? "संकेत का अनुवाद हुआ: इंडिया गेट" : "Sign translated: India Gate";
            }
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = lang === 'HI' ? 'hi-IN' : 'en-IN';
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleStartNav = () => {
        if (onNavigate) {
            onNavigate({
                name: "Bus 764",
                type: "bus",
                duration: "25 min",
                price: "₹10",
                path: "DTC Route 764",
                detailed_steps: [
                    { type: 'walk', instruction: lang === 'HI' ? "नेहरू प्लेस स्टॉप पर प्रतीक्षा करें" : "Wait at Nehru Place Stop", distance: "0m", pathType: "Walking Path" },
                    { type: 'transit', instruction: lang === 'HI' ? "धौला कुआं की ओर बस 764 पर चढ़ें" : "Board Bus 764 towards Dhaula Kuan", distance: "Board", pathType: "Driving Road" },
                    { type: 'walk', instruction: lang === 'HI' ? "धौला कुआं पर उतरें" : "Alight at Dhaula Kuan", distance: "0m", pathType: "Walking Path" },
                    { type: 'arrive', instruction: lang === 'HI' ? "गंतव्य की ओर थोड़ा चलें" : "Walk short distance to Destination", distance: "50m", pathType: "Destination" }
                ],
                route_geojson: [
                    [77.2519, 28.5494], // Nehru Place
                    [77.1950, 28.5445], // IIT Gate
                    [77.1726, 28.5562], // Munirka
                    [77.1607, 28.5910]  // Dhaula Kuan
                ]
            });
        }
    };

    const toggleMode = (newMode) => {
        setMode(newMode);
        setScanStatus('waiting');
        setIsSaved(false);
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 pb-20 animate-fade-in relative overflow-hidden text-white font-sans">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none"></div>

            <div className="p-6 pt-8 z-10 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <div className="bg-primary-500 p-2 rounded-xl shadow-lg shadow-primary-500/20">
                            <Scan className="text-white w-6 h-6 animate-pulse" />
                        </div>
                        {t.title}
                    </h2>
                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mt-2 ml-1">{t.subtitle}</p>
                </div>
                <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl backdrop-blur-md border border-white/5">
                    <button
                        onClick={() => toggleMode('detect')}
                        className={`p-2.5 rounded-xl transition-all ${mode === 'detect' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500'}`}
                    >
                        <Layers size={18} />
                    </button>
                    <button
                        onClick={() => toggleMode('translate')}
                        className={`p-2.5 rounded-xl transition-all ${mode === 'translate' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}
                    >
                        <Globe size={18} />
                    </button>
                </div>
            </div>

            {/* Viewfinder Section */}
            <div className="flex-1 relative mx-6 mb-6 rounded-[3rem] overflow-hidden border-2 border-white/10 bg-slate-900 shadow-2xl group ring-1 ring-white/5">
                {/* Simulated Camera Feed Background - Making it explicitly tall */}
                <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-10 text-center z-10 transition-colors duration-1000 group">
                    <div className="relative">
                        {/* Glow effect for camera icon */}
                        <div className={`absolute inset-0 bg-primary-500 rounded-full blur-2xl transition-all duration-1000 ${scanStatus === 'scanning' ? 'opacity-40 animate-pulse' : 'opacity-0'}`}></div>
                        <Camera className={`w-20 h-20 text-slate-500 mb-6 transition-all duration-700 relative z-10 ${scanStatus === 'scanning' ? 'scale-110 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : ''}`} />
                        {scanStatus === 'scanning' && <Radio className="absolute -top-3 -right-3 text-primary-300 animate-ping w-8 h-8 z-20" />}
                    </div>

                    <div className="space-y-1 mt-4 relative z-10">
                        <p className={`font-black tracking-widest uppercase transition-all duration-500 ${scanStatus === 'scanning' ? 'text-primary-400 text-lg animate-pulse' : 'text-slate-500 text-xs'}`}>
                            {scanStatus === 'waiting' ? t.waiting : scanStatus === 'scanning' ? (mode === 'detect' ? t.scanningBus : t.scanningSigns) : (mode === 'detect' ? t.busIdentified : t.signTranslated)}
                        </p>
                    </div>
                </div>

                {/* Viewfinder Overlay Frames - Fix inset positioning */}
                <div className="absolute inset-x-8 top-12 bottom-12 border-[4px] border-white/30 rounded-[3rem] pointer-events-none transition-all duration-500 z-30 shadow-[0_0_100px_rgba(0,0,0,0.9)_inset]">
                    {/* Corners */}
                    <div className={`absolute -top-4 -left-4 w-20 h-20 border-t-[10px] border-l-[10px] rounded-tl-[3rem] transition-colors duration-500 ${scanStatus === 'identified' ? (mode === 'detect' ? 'border-primary-400 shadow-[-10px_-10px_30px_rgba(56,189,248,0.8)]' : 'border-emerald-400 shadow-[-10px_-10px_30px_rgba(52,211,153,0.8)]') : scanStatus === 'scanning' ? 'border-white animate-pulse' : 'border-slate-500'}`}></div>

                    <div className={`absolute -top-4 -right-4 w-20 h-20 border-t-[10px] border-r-[10px] rounded-tr-[3rem] transition-colors duration-500 ${scanStatus === 'identified' ? (mode === 'detect' ? 'border-primary-400 shadow-[10px_-10px_30px_rgba(56,189,248,0.8)]' : 'border-emerald-400 shadow-[10px_-10px_30px_rgba(52,211,153,0.8)]') : scanStatus === 'scanning' ? 'border-white animate-pulse' : 'border-slate-500'}`}></div>

                    <div className={`absolute -bottom-4 -left-4 w-20 h-20 border-b-[10px] border-l-[10px] rounded-bl-[3rem] transition-colors duration-500 ${scanStatus === 'identified' ? (mode === 'detect' ? 'border-primary-400 shadow-[-10px_10px_30px_rgba(56,189,248,0.8)]' : 'border-emerald-400 shadow-[-10px_10px_30px_rgba(52,211,153,0.8)]') : scanStatus === 'scanning' ? 'border-white animate-pulse' : 'border-slate-500'}`}></div>

                    <div className={`absolute -bottom-4 -right-4 w-20 h-20 border-b-[10px] border-r-[10px] rounded-br-[3rem] transition-colors duration-500 ${scanStatus === 'identified' ? (mode === 'detect' ? 'border-primary-400 shadow-[10px_10px_30px_rgba(56,189,248,0.8)]' : 'border-emerald-400 shadow-[10px_10px_30px_rgba(52,211,153,0.8)]') : scanStatus === 'scanning' ? 'border-white animate-pulse' : 'border-slate-500'}`}></div>

                    {/* Highly visible scanning laser line */}
                    {scanStatus === 'scanning' && (
                        <div className="absolute inset-x-0 h-[8px] bg-primary-400 shadow-[0_0_30px_rgba(56,189,248,1),0_0_15px_rgba(255,255,255,1)] animate-scan-line top-0 z-40 rounded-full"></div>
                    )}
                </div>

                {/* Translation Simulation Overlay (INDIA GATE) */}
                {mode === 'translate' && scanStatus === 'identified' && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center animate-bounce-in pointer-events-none">
                        <div className="bg-emerald-900/40 backdrop-blur-md p-6 rounded-[2rem] border-2 border-emerald-400/30 text-center scale-90 shadow-2xl">
                            <div className="flex items-center gap-2 justify-center mb-2">
                                <span className="bg-emerald-500 text-[10px] font-black px-2 py-0.5 rounded-full text-white">HI</span>
                                <ArrowRight size={12} className="text-emerald-400" />
                                <span className="bg-blue-500 text-[10px] font-black px-2 py-0.5 rounded-full text-white">EN</span>
                            </div>
                            <p className="text-emerald-100/50 text-xs font-bold mb-3">Tesseract OCR Prediction:</p>
                            <p className="text-3xl font-black text-white italic tracking-tighter">INDIA GATE</p>
                            <div className="mt-4 h-1 w-24 bg-emerald-400/50 mx-auto rounded-full"></div>
                        </div>
                    </div>
                )}

                {/* Bus Detection Box */}
                {mode === 'detect' && scanStatus === 'identified' && (
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/3 border-2 border-dashed border-primary-500 rounded-3xl animate-pulse pointer-events-none flex items-center justify-center">
                        <div className="absolute -top-8 left-0 bg-primary-600 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                            <Bus size={14} /> Bus 764
                        </div>
                        <div className="text-[10px] font-black text-primary-400 bg-slate-900/80 px-2 py-1 rounded-md">94% Confidence</div>
                    </div>
                )}
            </div>

            {/* AI Result Bottom Card */}
            <div className={`mx-6 bg-white/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl relative z-20 border border-white/50 transition-all duration-700 ${scanStatus === 'identified' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
                {mode === 'detect' ? (
                    <>
                        <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-900 p-4 rounded-2xl relative shadow-xl shadow-slate-200">
                                    <Bus className="w-8 h-8 text-primary-400" />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white animate-pulse"></div>
                                </div>
                                <div>
                                    <h3 className="font-black text-2xl text-slate-900 leading-tight">Bus 764</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black mt-1 text-slate-500 uppercase tracking-tighter">
                                        <span className="text-primary-600 px-1.5 py-0.5 bg-primary-50 rounded-md border border-primary-100">DTC Route</span>
                                        <span className="flex items-center gap-1 leading-none"><MapPin size={10} className="text-primary-500" /> Nehru Place → Dhaula Kuan</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mock Live Movement Display */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100">
                                    <Navigation2 size={16} className="text-primary-500 animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.currentLoc} {mockLocation.near}</p>
                                    <p className="text-xs font-bold text-slate-700 leading-tight">{mockLocation.status}</p>
                                </div>
                            </div>
                            <p className="text-xs font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-100">4m</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <button
                                onClick={() => setShowLiveData(true)}
                                className="bg-slate-900 text-white font-black py-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 interactive-tap shadow-lg"
                            >
                                <Radio size={16} className="text-primary-400" /> {t.liveData}
                            </button>
                            <button className="bg-slate-100 text-slate-700 font-black py-4 rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-200/50">
                                <Compass size={16} className="text-slate-500" /> {t.compare}
                            </button>
                        </div>

                        <button
                            onClick={handleStartNav}
                            className="w-full bg-primary-600 text-white font-black py-5 rounded-[1.5rem] text-sm flex items-center justify-center gap-3 interactive-tap shadow-xl shadow-primary-500/20"
                        >
                            <Navigation size={20} className="fill-white" /> {t.navigate}
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-200">
                                <Check className="text-white w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-black text-2xl text-slate-900 leading-tight">{t.signResult}</h3>
                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{t.signType}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Translated Content</p>
                            <p className="text-slate-700 font-bold leading-relaxed italic">"Symbol of India, formerly known as All India War Memorial, located at the heart of Delhi."</p>
                        </div>

                        <button
                            onClick={() => setIsSaved(true)}
                            className={`w-full font-black py-5 rounded-[1.5rem] text-sm flex items-center justify-center gap-3 transition-all interactive-tap shadow-xl ${isSaved ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500' : 'bg-slate-900 text-white shadow-slate-200'}`}
                        >
                            {isSaved ? <Check size={20} /> : <Save size={20} />}
                            {isSaved ? t.saved : t.save}
                        </button>
                    </>
                )}
            </div>

            {/* Live Data Dashboard Overlay */}
            {showLiveData && (
                <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex flex-col animate-fade-in p-6 font-sans">
                    <div className="flex justify-between items-center mb-8 bg-slate-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <div>
                            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Live Tracking</span>
                            <h3 className="text-4xl font-black text-white mt-2 tracking-tighter">Bus 764</h3>
                            <p className="text-primary-400 text-xs font-bold flex items-center gap-2 mt-1">
                                <Navigation2 size={12} className="rotate-45" /> Nehru Place → Dhaula Kuan
                            </p>
                        </div>
                        <button onClick={() => setShowLiveData(false)} className="bg-white/10 p-4 rounded-full text-white border border-white/10 group">
                            <X size={24} className="group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>

                    <div className="bg-slate-900/40 rounded-[3rem] border border-white/5 p-8 flex-1 overflow-y-auto relative">
                        <div className="relative pl-10 space-y-12 pb-6">
                            <div className="absolute left-[13px] top-3 bottom-3 w-[6px] bg-slate-800 rounded-full">
                                <div className="w-full bg-primary-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(14,165,233,0.8)]" style={{ height: `${(busProgress - 1) * 33.3}%` }}></div>
                            </div>
                            {stops.map((stop) => (
                                <div key={stop.id} className="relative group">
                                    <div className={`absolute -left-[35px] top-1.5 w-5 h-5 rounded-full z-10 border-[3px] transition-all duration-700 ${busProgress === stop.id ? 'bg-primary-500 border-white scale-125 shadow-[0_0_25px_rgba(14,165,233,1)]' : busProgress > stop.id ? 'bg-primary-700 border-primary-400' : 'bg-slate-800 border-slate-700'}`}>
                                        {busProgress === stop.id && <div className="absolute inset-0 bg-primary-400 rounded-full animate-ping opacity-50 scale-150"></div>}
                                    </div>
                                    <div className={`flex justify-between items-center transition-all ${busProgress === stop.id ? 'translate-x-3 scale-105' : ''}`}>
                                        <div>
                                            <p className={`font-black text-xl ${busProgress === stop.id ? 'text-white' : 'text-slate-500'}`}>{stop.name}</p>
                                            {busProgress === stop.id && (
                                                <span className="text-[9px] bg-primary-500/20 text-primary-400 px-3 py-1 rounded-lg border border-primary-500/30 flex items-center gap-1.5 font-black uppercase tracking-wider mt-1 animate-pulse">
                                                    <Clock size={10} /> Currently Here
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-400 font-black text-sm">{stop.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 p-7 rounded-[2.5rem] flex items-center justify-between shadow-2xl">
                        <div className="flex items-center gap-5">
                            <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                                <Bus className="text-white w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">{t.eta}</p>
                                <p className="text-2xl font-black text-white tracking-tight">{stops[busProgress < 4 ? busProgress : 3].time}</p>
                            </div>
                        </div>
                        <button onClick={handleStartNav} className="bg-white text-primary-600 p-4 rounded-full shadow-lg">
                            <ArrowRight className="w-7 h-7" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
