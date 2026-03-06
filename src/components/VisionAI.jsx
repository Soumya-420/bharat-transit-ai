import React, { useState, useEffect } from 'react';
import { Scan, Bus, ExternalLink, Globe, Camera, Layers, MapPin, Navigation, ArrowRight, X, Clock } from 'lucide-react';

export default function VisionAI() {
    const [mode, setMode] = useState('detect'); // 'detect' or 'translate'
    const [showLiveData, setShowLiveData] = useState(false);
    const [busProgress, setBusProgress] = useState(1);

    // Mock bus movement animation
    useEffect(() => {
        if (showLiveData) {
            const interval = setInterval(() => {
                setBusProgress(prev => (prev % 4) + 1);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [showLiveData]);

    const stops = [
        { id: 1, name: "Nehru Place", time: "10:15 AM" },
        { id: 2, name: "IIT Gate", time: "10:28 AM" },
        { id: 3, name: "Munirka", time: "10:35 AM" },
        { id: 4, name: "Dhaula Kuan", time: "10:50 AM" }
    ];

    return (
        <div className="h-full flex flex-col bg-slate-950 pb-20 animate-fade-in relative overflow-hidden text-white">
            {/* Background Grain Effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="p-6 pt-8 z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <div className="bg-primary-500 p-2 rounded-xl shadow-lg shadow-primary-500/20">
                                <Scan className="text-white w-6 h-6 animate-pulse" />
                            </div>
                            Bharat Vision
                        </h2>
                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mt-2 ml-1">AI-Powered Recognition</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMode('detect')}
                            className={`p-3 rounded-2xl transition-all shadow-lg ${mode === 'detect' ? 'bg-primary-600 text-white scale-110' : 'bg-slate-800 text-slate-400'}`}
                        >
                            <Layers size={20} />
                        </button>
                        <button
                            onClick={() => setMode('translate')}
                            className={`p-3 rounded-2xl transition-all shadow-lg ${mode === 'translate' ? 'bg-emerald-600 text-white scale-110' : 'bg-slate-800 text-slate-400'}`}
                        >
                            <Globe size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Camera Viewfinder */}
            <div className="flex-1 relative mx-6 mb-6 rounded-[3rem] overflow-hidden border-2 border-white/10 bg-slate-900 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-10 text-center">
                    <Camera className="w-16 h-16 text-slate-700 mb-4 group-hover:scale-110 transition-transform duration-500" />
                    <p className="text-slate-500 font-bold text-sm">Waiting for Lens Stream...</p>
                </div>

                {/* Viewfinder Overlay */}
                <div className="absolute inset-10 border border-white/10 rounded-[2rem] pointer-events-none">
                    <div className="absolute -top-2 -left-2 w-12 h-12 border-t-8 border-l-8 border-primary-500 rounded-tl-2xl"></div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 border-t-8 border-r-8 border-primary-500 rounded-tr-2xl"></div>
                    <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-8 border-l-8 border-primary-500 rounded-bl-2xl"></div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-8 border-r-8 border-primary-500 rounded-br-2xl"></div>
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent shadow-[0_0_15px_rgba(14,165,233,0.8)] animate-scan-line"></div>
                </div>

                {mode === 'detect' && (
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/3 border-2 border-dashed border-primary-500 rounded-2xl animate-pulse pointer-events-none">
                        <div className="absolute -top-6 left-0 bg-primary-600 text-white px-3 py-1 rounded-t-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Bus size={12} /> Bus 764 Identified (94%)
                        </div>
                    </div>
                )}
            </div>

            {/* Result Card */}
            <div className="mx-6 bg-white/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl animate-slide-up relative z-20 border border-white/50">
                <div className="flex items-center gap-4 mb-5">
                    <div className="bg-slate-900 p-4 rounded-2xl relative shadow-lg">
                        {mode === 'detect' ? <Bus className="w-7 h-7 text-primary-400" /> : <Globe className="w-7 h-7 text-emerald-400" />}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                        <h3 className="font-black text-xl text-slate-800">
                            {mode === 'detect' ? 'DTC Bus Identified' : 'Sign Translated'}
                        </h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Live Data Available</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowLiveData(true)}
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 interactive-tap shadow-lg"
                >
                    <ExternalLink size={20} />
                    {mode === 'detect' ? 'Live Route Data' : 'Save Translation'}
                </button>
            </div>

            {/* Live Data Modal */}
            {showLiveData && (
                <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col animate-fade-in p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Live Tracking</span>
                            <h3 className="text-3xl font-black text-white mt-2">Bus 764</h3>
                            <p className="text-primary-400 text-xs font-bold flex items-center gap-2">
                                <Navigation size={12} /> Nehru Place → Dhaula Kuan
                            </p>
                        </div>
                        <button
                            onClick={() => setShowLiveData(false)}
                            className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6 flex-1 overflow-y-auto">
                        <div className="relative pl-8 space-y-10">
                            {/* Route Path Line */}
                            <div className="absolute left-[11px] top-2 bottom-2 w-1 bg-white/10 rounded-full">
                                <div
                                    className="w-full bg-primary-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                                    style={{ height: `${(busProgress - 1) * 33.3}%` }}
                                ></div>
                            </div>

                            {stops.map((stop) => (
                                <div key={stop.id} className="relative group">
                                    <div className={`absolute -left-[27px] top-1 w-3 h-3 rounded-full z-10 border-2 transition-all ${busProgress === stop.id
                                            ? 'bg-primary-500 border-primary-200 scale-150 shadow-[0_0_15px_rgba(14,165,233,0.8)]'
                                            : busProgress > stop.id
                                                ? 'bg-primary-600 border-primary-400'
                                                : 'bg-white/20 border-white/40'
                                        }`}>
                                        {busProgress === stop.id && <div className="absolute inset-0 bg-primary-400 rounded-full animate-ping opacity-75"></div>}
                                    </div>
                                    <div className={`flex justify-between items-center transition-all ${busProgress === stop.id ? 'translate-x-2' : ''}`}>
                                        <div>
                                            <p className={`font-black text-lg transition-colors ${busProgress === stop.id ? 'text-primary-400' : 'text-white'}`}>
                                                {stop.name}
                                            </p>
                                            {busProgress === stop.id && (
                                                <span className="text-[10px] bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-lg border border-primary-500/30 flex items-center gap-1 mt-1 font-black uppercase">
                                                    <Clock size={10} /> Currently Here
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-500 font-bold text-xs">{stop.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 bg-primary-600 p-6 rounded-[2rem] flex items-center justify-between shadow-xl shadow-primary-500/20">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <Bus className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Estimated Arrival</p>
                                <p className="text-xl font-black text-white">{stops[busProgress < 4 ? busProgress : 3].time}</p>
                            </div>
                        </div>
                        <ArrowRight className="text-white w-6 h-6" />
                    </div>
                </div>
            )}
        </div>
    );
}
