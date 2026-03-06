import React, { useState } from 'react';
import { IndianRupee, Lightbulb, TrendingUp, Bus, ArrowRight, MapPin, Loader2 } from 'lucide-react';

export default function BudgetMode() {
    const [isCalculating, setIsCalculating] = useState(false);
    const [routeLoaded, setRouteLoaded] = useState(false);

    const handleCalculate = () => {
        setIsCalculating(true);
        // Simulate an AWS Lambda query against transit matrices
        setTimeout(() => {
            setIsCalculating(false);
            setRouteLoaded(true);
        }, 1500);
    };
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

            {!routeLoaded ? (
                <>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100 shadow-sm flex items-center justify-between relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <p className="text-sm font-bold text-emerald-800 mb-1">Your Monthly Savings</p>
                            <p className="text-3xl font-black text-emerald-600 flex items-center tracking-tight">
                                <span className="text-xl mr-1 font-bold">₹</span>2,420
                            </p>
                            <p className="text-[10px] font-semibold text-emerald-600/70 mt-1">vs regular auto fares</p>
                        </div>
                        <div className="bg-emerald-100 p-4 rounded-full relative z-10 shadow-inner">
                            <TrendingUp className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>

                    <button
                        onClick={handleCalculate}
                        disabled={isCalculating}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 transition-all interactive-tap hover-lift disabled:opacity-80"
                    >
                        {isCalculating ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Mining AWS Data...</>
                        ) : (
                            <>Activate ₹10 Challenge Routing</>
                        )}
                    </button>
                </>
            ) : (
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-lg animate-slide-up space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h3 className="font-bold text-slate-800 text-lg">AI Budget Route</h3>
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-2 py-1 rounded-lg uppercase tracking-wide">Found</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-slate-300 border-2 border-white shadow-sm ring-1 ring-slate-200"></div>
                                <div className="w-0.5 h-10 bg-slate-200"></div>
                                <div className="p-1.5 bg-amber-100 rounded-full my-1">
                                    <Bus className="w-4 h-4 text-amber-600" />
                                </div>
                                <div className="w-0.5 h-10 bg-slate-200"></div>
                                <div className="w-3 h-3 rounded-full bg-primary-500 border-2 border-white shadow-sm ring-1 ring-primary-200"></div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">New Delhi Rly Station</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Walk 200m to Super Bazar</p>
                                </div>

                                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-sm border border-amber-100">Bus 894</span>
                                        <span className="text-xs font-semibold text-slate-500">12 stops</span>
                                    </div>
                                    <span className="font-bold text-emerald-600">₹10</span>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-slate-800">India Gate Match</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Arrive via Tilak Marg</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setRouteLoaded(false)}
                        className="w-full bg-amber-50 text-amber-700 font-bold py-3 text-sm rounded-xl mt-4 border border-amber-100 hover:bg-amber-100 transition-colors interactive-tap"
                    >
                        Reset Challenge
                    </button>
                </div>
            )}
        </div>
    );
}
