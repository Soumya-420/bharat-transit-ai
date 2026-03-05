import React, { useState } from 'react';
import { Search, MapPin, Mic, Navigation, Shield, Zap, IndianRupee, RotateCw } from 'lucide-react';

export default function HomeSearch({ onSearch }) {
    const [activeTab, setActiveTab] = useState('fastest');

    const tabs = [
        { id: 'fastest', label: 'Fastest', icon: <Zap size={14} /> },
        { id: 'safest', label: 'Safest', icon: <Shield size={14} /> },
        { id: 'cheapest', label: 'Cheapest', icon: <IndianRupee size={14} /> },
        { id: 'jugaad', label: 'Jugaad', icon: <RotateCw size={14} /> },
    ];

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
                            placeholder="Enter Origin"
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
                            placeholder="Enter Destination"
                            defaultValue="India Gate"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                    <button
                        className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors interactive-tap border-2 border-primary-100"
                        onClick={() => { }}
                    >
                        <Mic className="h-5 w-5" />
                        <span>Voice Input</span>
                        <span className="bg-primary-200 text-primary-800 text-[10px] uppercase font-black px-2 py-0.5 rounded-full ml-1 rotate-3">Tap to Speak</span>
                    </button>

                    <button
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors interactive-tap"
                    >
                        <Navigation className="h-4 w-4" />
                        <span>Use Current Location</span>
                    </button>
                </div>

                {/* Search Primary Button */}
                <button
                    onClick={onSearch}
                    className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary-500/30 interactive-tap hover-lift flex justify-center items-center gap-2"
                >
                    Find Routes
                </button>
            </div>

            {/* Quick Filters / Modes */}
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">Optimization Mode</h3>
                <div className="grid grid-cols-4 gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center p-3 rounded-2xl transition-all interactive-tap gap-1.5
                ${activeTab === tab.id
                                    ? 'bg-slate-800 text-white shadow-md'
                                    : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50 shadow-sm'
                                }
              `}
                        >
                            <div className={activeTab === tab.id ? 'opacity-100' : 'opacity-70'}>
                                {tab.icon}
                            </div>
                            <span className="text-[10px] font-bold tracking-wide">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            {/* SafeCompanion Promo */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-5 border border-emerald-100/50 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl -mr-8 -mt-8"></div>
                <h3 className="text-emerald-900 font-bold mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    SafeCompanion Active
                </h3>
                <p className="text-emerald-700/80 text-xs mb-3 font-medium leading-relaxed max-w-[85%] relative z-10">
                    We found 2 trusted companions sharing your likely route to India Gate.
                </p>
                <button className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-emerald-700 interactive-tap">
                    View Companions
                </button>
            </div>
        </div>
    );
}
