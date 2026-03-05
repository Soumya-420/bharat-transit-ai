import React from 'react';
import { Shield, UserPlus, Star } from 'lucide-react';

export default function SafeCompanion() {
    const companions = [
        { name: 'Anjali', trust: 4.8, type: 'Same Route' },
        { name: 'Priya', trust: 4.6, type: 'Same Time' }
    ];

    return (
        <div className="p-4 space-y-6 pb-20 animate-fade-in bg-slate-50 min-h-full">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Shield className="text-emerald-500 w-6 h-6" /> SafeCompanion
                </h2>
                <p className="text-sm text-slate-500 mt-1">Find verified travel companions for your route.</p>
            </div>

            <div className="space-y-4">
                {companions.map((comp, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{comp.name}</h3>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="flex items-center text-amber-500 font-bold">
                                        Trust {comp.trust} <Star size={10} className="ml-0.5 fill-current" />
                                    </span>
                                    <span className="text-slate-400">•</span>
                                    <span className="text-slate-500">{comp.type}</span>
                                </div>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors">
                            Connect
                        </button>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-colors interactive-tap">
                <UserPlus size={18} /> Create Safety Circle
            </button>
        </div>
    );
}
