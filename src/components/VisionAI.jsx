import React from 'react';
import { Scan, Bus, ExternalLink } from 'lucide-react';

export default function VisionAI() {
    return (
        <div className="h-full flex flex-col bg-slate-900 pb-20 animate-fade-in">
            <div className="p-4 z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Scan className="text-primary-400 w-6 h-6" /> Bharat Vision AI
                </h2>
                <p className="text-sm text-slate-400 mt-1">Point camera at a bus or sign to scan</p>
            </div>

            {/* Camera Viewfinder Placeholder */}
            <div className="flex-1 relative mx-4 mb-4 rounded-3xl overflow-hidden border-2 border-slate-700 bg-slate-800 flex items-center justify-center">
                {/* Viewfinder borders */}
                <div className="absolute inset-8 border border-white/20 rounded-2xl">
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-xl"></div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-xl"></div>
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-xl"></div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-xl"></div>
                </div>

                <Scan className="w-16 h-16 text-slate-600 animate-pulse" />
            </div>

            {/* Detection Result Card */}
            <div className="mx-4 bg-white p-5 rounded-3xl shadow-xl animate-slide-up relative z-10 border border-slate-100">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-100 p-3 rounded-xl">
                            <Bus className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">Bus 764 - Dwarka</h3>
                            <p className="text-primary-600 font-bold text-sm">ETA: 5 mins</p>
                        </div>
                    </div>
                </div>

                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 interactive-tap">
                    <ExternalLink size={18} /> View Route Details
                </button>
            </div>
        </div>
    );
}
