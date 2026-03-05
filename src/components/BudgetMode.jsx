import React from 'react';
import { IndianRupee, Lightbulb, TrendingUp } from 'lucide-react';

export default function BudgetMode() {
    return (
        <div className="p-4 space-y-6 pb-20 animate-fade-in bg-amber-50/50 min-h-full">
            <div className="mb-2">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="bg-amber-100 p-1.5 rounded-lg">
                        <IndianRupee className="text-amber-600 w-5 h-5" />
                    </div>
                    ₹10 Budget Mode
                </h2>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm relative overflow-hidden">
                {/* Top Accent line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-400"></div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Cheapest Route</p>
                            <p className="text-sm font-semibold text-slate-500 mt-1">Time</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-slate-800">₹12</p>
                            <p className="text-base font-bold text-slate-700 mt-0.5">48 mins</p>
                        </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-xl flex items-start gap-3 border border-amber-100">
                        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-amber-900 leading-snug">
                            <span className="font-bold">Tip:</span> Walk 300m from the first stop to save ₹5 on your total journey.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-emerald-800 mb-1">Monthly Savings</p>
                    <p className="text-3xl font-black text-emerald-600 flex items-center">
                        <span className="text-xl mr-1">₹</span>220
                    </p>
                </div>
                <div className="bg-emerald-100 p-4 rounded-full">
                    <TrendingUp className="w-8 h-8 text-emerald-500" />
                </div>
            </div>

            <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-colors interactive-tap">
                View Budget Routes
            </button>
        </div>
    );
}
