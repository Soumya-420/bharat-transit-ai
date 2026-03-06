import React, { useState, useEffect } from 'react';
import { Scan, Bus, ExternalLink, Globe, Camera, Layers, MapPin, Navigation, ArrowRight, X, Clock, Navigation2, Compass, Radio } from 'lucide-react';

export default function VisionAI({ lang, onNavigate }) {
    const [mode, setMode] = useState('detect'); // 'detect' or 'translate'
    const [scanStatus, setScanStatus] = useState('waiting'); // 'waiting', 'scanning', 'identified'
    const [showLiveData, setShowLiveData] = useState(false);
    const [busProgress, setBusProgress] = useState(1);
    const [mockLocation, setMockLocation] = useState({
        near: "Park Street",
        status: "Moving toward Ballygunge"
    });

    const stops = [
        { id: 1, name: "Park Street", time: "10:15 AM", status: "Passed" },
        { id: 2, name: "Elliot Road", time: "10:22 AM", status: "Near" },
        { id: 3, name: "Beckbagan", time: "10:35 AM", status: "Upcoming" },
        { id: 4, name: "Ballygunge", time: "10:45 AM", status: "Destination" }
    ];

    // Translation dictionary
    const t = {
        EN: {
            title: "Bharat Vision",
            subtitle: "AI-Powered Recognition",
            waiting: "Waiting for Lens Stream...",
            scanning: "Scanning for Transport Signs...",
            identified: "Bus 764 Identified (94%)",
            liveData: "Live Route Data",
            viewRoute: "View Route",
            navigate: "Navigate with This Bus",
            compare: "Compare Routes",
            currentLoc: "Near",
            movingTo: "Moving toward",
            eta: "Estimated Arrival"
        },
        HI: {
            title: "भारत विजन",
            subtitle: "एआई-पावर्ड पहचान",
            waiting: "लेंस स्ट्रीम की प्रतीक्षा कर रहा है...",
            scanning: "परिवहन संकेतों को स्कैन कर रहा है...",
            identified: "बस 764 की पहचान (94%)",
            liveData: "लाइव रूट डेटा",
            viewRoute: "रूट देखें",
            navigate: "इस बस के साथ नेविगेट करें",
            compare: "रूट की तुलना करें",
            currentLoc: "के पास",
            movingTo: "की ओर बढ़ रहा है",
            eta: "अनुमानित आगमन"
        }
    }[lang || 'EN'];

    // Simulation: Multi-stage scanning
    useEffect(() => {
        if (mode === 'detect' && scanStatus === 'waiting') {
            const timer = setTimeout(() => setScanStatus('scanning'), 2000);
            return () => clearTimeout(timer);
        }
        if (scanStatus === 'scanning') {
            const timer = setTimeout(() => {
                setScanStatus('identified');
                announceIdentification();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [scanStatus, mode]);

    // Simulation: Mock movement
    useEffect(() => {
        const interval = setInterval(() => {
            setBusProgress(prev => {
                const next = (prev % 4) + 1;
                // Update mock location text based on progress
                if (next === 1) setMockLocation({ near: "Park Street", status: "Moving toward Elliot Road" });
                if (next === 2) setMockLocation({ near: "Elliot Road", status: "Moving toward Beckbagan" });
                if (next === 3) setMockLocation({ near: "Beckbagan", status: "Moving toward Ballygunge" });
                if (next === 4) setMockLocation({ near: "Near Ballygunge", status: "Arriving at Destination" });
                return next;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const announceIdentification = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(lang === 'HI' ? "बस 764 की पहचान हुई" : "Bus 764 identified");
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
                path: "DTC Route 764"
            });
        }
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
                        onClick={() => { setMode('detect'); setScanStatus('waiting'); }}
                        className={`p-2.5 rounded-xl transition-all ${mode === 'detect' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500'}`}
                    >
                        <Layers size={18} />
                    </button>
                    <button
                        onClick={() => setMode('translate')}
                        className={`p-2.5 rounded-xl transition-all ${mode === 'translate' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}
                    >
                        <Globe size={18} />
                    </button>
                </div>
            </div>

            {/* Viewfinder Section */}
            <div className="flex-1 relative mx-6 mb-6 rounded-[3rem] overflow-hidden border-2 border-white/10 bg-slate-900 shadow-2xl group ring-1 ring-white/5">
                {/* Simulated Camera Feed Background */}
                <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center p-10 text-center">
                    <div className="relative">
                        <Camera className={`w-16 h-16 text-slate-700 mb-4 transition-all duration-700 ${scanStatus === 'scanning' ? 'scale-110 text-primary-500/50' : ''}`} />
                        {scanStatus === 'scanning' && <Radio className="absolute -top-2 -right-2 text-primary-400 animate-ping w-6 h-6" />}
                    </div>

                    <div className="space-y-1">
                        <p className="text-slate-400 font-bold text-sm tracking-wide">
                            {scanStatus === 'waiting' ? t.waiting : scanStatus === 'scanning' ? t.scanning : t.identified}
                        </p>
                        {scanStatus !== 'identified' && (
                            <div className="flex gap-1.5 justify-center mt-4">
                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-duration:1s]"></div>
                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1s]"></div>
                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1s]"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cyberpunk Scanning Grid */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary-500/5 to-transparent"></div>

                {/* Viewfinder Overlay Frames */}
                <div className="absolute inset-10 border border-white/10 rounded-[2.5rem] pointer-events-none transition-all duration-500">
                    <div className={`absolute -top-2 -left-2 w-16 h-16 border-t-[6px] border-l-[6px] rounded-tl-3xl transition-colors duration-500 ${scanStatus === 'identified' ? 'border-emerald-500' : 'border-primary-500'}`}></div>
                    <div className={`absolute -top-2 -right-2 w-16 h-16 border-t-[6px] border-r-[6px] rounded-tr-3xl transition-colors duration-500 ${scanStatus === 'identified' ? 'border-emerald-500' : 'border-primary-500'}`}></div>
                    <div className={`absolute -bottom-2 -left-2 w-16 h-16 border-b-[6px] border-l-[6px] rounded-bl-3xl transition-colors duration-500 ${scanStatus === 'identified' ? 'border-emerald-500' : 'border-primary-500'}`}></div>
                    <div className={`absolute -bottom-2 -right-2 w-16 h-16 border-b-[6px] border-r-[6px] rounded-br-3xl transition-colors duration-500 ${scanStatus === 'identified' ? 'border-emerald-500' : 'border-primary-500'}`}></div>

                    {/* Scanning Laser Line */}
                    {scanStatus === 'scanning' && (
                        <div className="absolute inset-x-0 h-[2px] bg-primary-400 shadow-[0_0_15px_rgba(14,165,233,1)] animate-scan-line top-0"></div>
                    )}
                </div>

                {/* Detection Banner (Appears when Identified) */}
                {scanStatus === 'identified' && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] animate-bounce-in">
                        <div className="bg-emerald-500/90 backdrop-blur-xl border-2 border-emerald-400 p-5 rounded-3xl shadow-2xl shadow-emerald-500/20 text-center">
                            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <Bus size={24} className="text-white" />
                            </div>
                            <h4 className="text-2xl font-black text-white">{t.identified}</h4>
                            <div className="mt-3 flex items-center justify-center gap-2 text-emerald-100 text-[10px] font-black uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                                Live Tracking Enabled
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Result Bottom Card - Auto-reveal or user toggle */}
            <div className={`mx-6 bg-white/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl relative z-20 border border-white/50 transition-all duration-700 ${scanStatus === 'identified' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95 pointer-events-none'}`}>
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
                                <span className="flex items-center gap-1"><MapPin size={10} className="text-primary-500" /> Park Street → Ballygunge</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
                        <p className="text-xs font-bold text-emerald-600 mt-1 uppercase">In Transit</p>
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
                            <p className="text-xs font-bold text-slate-700">{mockLocation.status}</p>
                        </div>
                    </div>
                    <p className="text-xs font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl border border-primary-100 shadow-sm">ETA: 4m</p>
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                        onClick={() => setShowLiveData(true)}
                        className="bg-slate-900 text-white font-black py-4 rounded-[1.25rem] text-xs transition-all flex items-center justify-center gap-2 interactive-tap shadow-lg shadow-slate-200 overflow-hidden"
                    >
                        <Radio size={16} className="text-primary-400 shrink-0" />
                        <span className="truncate">{t.liveData}</span>
                    </button>
                    <button
                        className="bg-slate-100 text-slate-700 font-black py-4 rounded-[1.25rem] text-xs transition-all flex items-center justify-center gap-2 interactive-tap border border-slate-200/50"
                    >
                        <Compass size={16} className="text-slate-500 shrink-0" />
                        <span className="truncate">{t.compare}</span>
                    </button>
                </div>

                <button
                    onClick={handleStartNav}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-[1.5rem] text-sm transition-all flex items-center justify-center gap-3 interactive-tap shadow-xl shadow-primary-500/20 border-t border-white/20"
                >
                    <Navigation size={20} className="fill-white" />
                    {t.navigate}
                </button>
            </div>

            {/* Live Data Dashboard Overlay */}
            {showLiveData && (
                <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex flex-col animate-fade-in p-6 font-sans">
                    <div className="flex justify-between items-center mb-8 bg-slate-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/30">Live Tracking</span>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            </div>
                            <h3 className="text-4xl font-black text-white mt-2 tracking-tighter">Bus 764</h3>
                            <p className="text-primary-400 text-xs font-bold flex items-center gap-2 mt-1">
                                <Navigation2 size={12} className="rotate-45" /> Park Street → Ballygunge
                            </p>
                        </div>
                        <button
                            onClick={() => setShowLiveData(false)}
                            className="bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all text-white border border-white/10 group"
                        >
                            <X size={24} className="group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>

                    <div className="bg-slate-900/40 rounded-[3rem] border border-white/5 p-8 flex-1 overflow-y-auto relative shadow-inner">
                        <div className="relative pl-10 space-y-12 pb-6">
                            {/* Route Path Vertical Line */}
                            <div className="absolute left-[13px] top-3 bottom-3 w-[6px] bg-slate-800 rounded-full border border-white/5">
                                <div
                                    className="w-full bg-primary-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(14,165,233,0.8)]"
                                    style={{ height: `${(busProgress - 1) * 33.3}%` }}
                                ></div>
                            </div>

                            {stops.map((stop) => (
                                <div key={stop.id} className="relative group">
                                    <div className={`absolute -left-[35px] top-1.5 w-5 h-5 rounded-full z-10 border-[3px] transition-all duration-700 ${busProgress === stop.id
                                            ? 'bg-primary-500 border-white scale-125 shadow-[0_0_25px_rgba(14,165,233,1)]'
                                            : busProgress > stop.id
                                                ? 'bg-primary-700 border-primary-400'
                                                : 'bg-slate-800 border-slate-700'
                                        }`}>
                                        {busProgress === stop.id && <div className="absolute inset-0 bg-primary-400 rounded-full animate-ping opacity-50 scale-150"></div>}
                                    </div>
                                    <div className={`flex justify-between items-center transition-all duration-500 ${busProgress === stop.id ? 'translate-x-3 scale-105' : ''}`}>
                                        <div>
                                            <p className={`font-black text-xl transition-colors duration-500 ${busProgress === stop.id ? 'text-white' : 'text-slate-500'}`}>
                                                {stop.name}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                {busProgress === stop.id ? (
                                                    <span className="text-[9px] bg-primary-500/20 text-primary-400 px-3 py-1 rounded-lg border border-primary-500/30 flex items-center gap-1.5 font-black uppercase tracking-wider animate-pulse">
                                                        <Clock size={10} /> Currently Here
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{stop.status}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-400 font-black text-sm">{stop.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Arrival Summary Card */}
                    <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 p-7 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-primary-500/30 border-t border-white/20">
                        <div className="flex items-center gap-5">
                            <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md shadow-inner">
                                <Bus className="text-white w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-1">{t.eta}</p>
                                <p className="text-2xl font-black text-white tracking-tight">{stops[busProgress < 4 ? busProgress : 3].time}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleStartNav}
                            className="bg-white text-primary-600 p-4 rounded-full shadow-lg shadow-black/10 hover:scale-110 active:scale-95 transition-all"
                        >
                            <ArrowRight className="w-7 h-7" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
