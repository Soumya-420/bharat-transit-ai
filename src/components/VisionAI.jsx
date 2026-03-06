import React, { useState } from 'react';
import { Scan, Bus, ExternalLink, Globe, Camera, Layers } from 'lucide-react';

export default function VisionAI() {
    const [mode, setMode] = useState('detect'); // 'detect' or 'translate'
    const [isScanning, setIsScanning] = useState(false);

    return (
        <div className="h-full flex flex-col bg-slate-950 pb-20 animate-fade-in relative overflow-hidden">
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
                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mt-2 ml-1">AI-Powered OCR & Recognition</p>
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
                {/* Simulated Camera Feed */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-10 text-center">
                    <Camera className="w-16 h-16 text-slate-700 mb-4 group-hover:scale-110 transition-transform duration-500" />
                    <p className="text-slate-500 font-bold text-sm">Waiting for Lens Stream...</p>
                    <div className="mt-8 flex gap-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                </div>

                {/* Viewfinder Overlay */}
                <div className="absolute inset-10 border border-white/10 rounded-[2rem] pointer-events-none">
                    <div className="absolute -top-2 -left-2 w-12 h-12 border-t-8 border-l-8 border-primary-500 rounded-tl-2xl"></div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 border-t-8 border-r-8 border-primary-500 rounded-tr-2xl"></div>
                    <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-8 border-l-8 border-primary-500 rounded-bl-2xl"></div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-8 border-r-8 border-primary-500 rounded-br-2xl"></div>

                    {/* Scanning Line */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent shadow-[0_0_15px_rgba(14,165,233,0.8)] animate-scan-line"></div>
                </div>

                {/* Phase 2: Translation Simulation Overlay */}
                {mode === 'translate' && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center animate-fade-in pointer-events-none">
                        <div className="bg-emerald-900/40 backdrop-blur-md p-6 rounded-[2rem] border-2 border-emerald-400/30 text-center scale-90 shadow-2xl">
                            <div className="flex items-center gap-2 justify-center mb-2">
                                <span className="bg-emerald-500 text-[10px] font-black px-2 py-0.5 rounded-full text-white">HI</span>
                                <ArrowRight size={12} className="text-emerald-400" />
                                <span className="bg-blue-500 text-[10px] font-black px-2 py-0.5 rounded-full text-white">EN</span>
                            </div>
                            <p className="text-emerald-100/50 text-xs font-bold mb-3">Tesseract OCR Identified Sign:</p>
                            <p className="text-3xl font-black text-white italic tracking-tighter">INDIA GATE</p>
                            <div className="mt-4 h-1 w-24 bg-emerald-400/50 mx-auto rounded-full"></div>
                        </div>
                    </div>
                )}

                {/* Detect Mode: Object Box */}
                {mode === 'detect' && (
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/3 border-2 border-dashed border-primary-500 rounded-2xl animate-pulse pointer-events-none">
                        <div className="absolute -top-6 left-0 bg-primary-600 text-white px-3 py-1 rounded-t-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Bus size={12} /> Bus 764 Identified (94%)
                        </div>
                    </div>
                )}
            </div>

            {/* AI Result Bottom Card */}
            <div className="mx-6 bg-white/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl animate-slide-up relative z-20 border border-white/50 group hover:scale-[1.01] transition-all">
                <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 p-4 rounded-2xl relative shadow-lg shadow-slate-300">
                            {mode === 'detect' ? <Bus className="w-7 h-7 text-primary-400" /> : <Globe className="w-7 h-7 text-emerald-400" />}
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-slate-800 leading-tight">
                                {mode === 'detect' ? 'DTC Bus identified' : 'Sign Translated'}
                            </h3>
                            <div className="flex items-center gap-2 text-xs font-bold mt-1 uppercase tracking-wider">
                                <span className="text-emerald-600">Verified by AWS Bedrock</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 interactive-tap shadow-lg shadow-slate-200">
                    <ExternalLink size={20} />
                    {mode === 'detect' ? 'Live Route Data' : 'Save Translation'}
                </button>
            </div>

            {/* Intelligence Badges Sidebar */}
            <div className="absolute left-1 bottom-1/3 flex flex-col gap-2 z-[30] pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur-md p-2 rounded-r-xl border-y border-r border-white/10">
                    <p className="text-[8px] font-black text-primary-400 uppercase">Detection</p>
                    <p className="text-[10px] font-bold text-white">YOLO v8 active</p>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md p-2 rounded-r-xl border-y border-r border-white/10">
                    <p className="text-[8px] font-black text-emerald-400 uppercase">NLP</p>
                    <p className="text-[10px] font-bold text-white">IndicBERT ready</p>
                </div>
            </div>
        </div>
    );
}
