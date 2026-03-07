import React, { useState } from 'react';
import { Clock, IndianRupee, ShieldCheck, ChevronRight, Train, Bus, PersonStanding, CarTaxiFront, Users, Zap, Shield, RotateCw } from 'lucide-react';

export default function RouteResults({ onSelectRoute, apiResult, festivalMode }) {
    const [activeTab, setActiveTab] = useState('fastest');

    const tabs = [
        { id: 'fastest', label: 'Fastest', icon: <Zap size={14} /> },
        { id: 'safest', label: 'Safest', icon: <Shield size={14} /> },
        { id: 'cheapest', label: 'Cheapest', icon: <IndianRupee size={14} /> },
        { id: 'jugaad', label: 'Jugaad', icon: <RotateCw size={14} /> },
    ];
    // Dynamic safety score or fallback
    const dynamicSafety = apiResult?.safety_score ? parseInt(apiResult.safety_score) : null;

    // Helper to parse "Metro -> Bus" into an array of {icon, label}
    const parseRouteModes = (routeStr, fallbackModes) => {
        if (!routeStr) return fallbackModes;

        const modeLabels = routeStr.split('→').map(m => m.trim().toLowerCase());
        return modeLabels.map(label => {
            if (label.includes('metro') || label.includes('train')) return { icon: <Train size={16} />, label: 'Metro' };
            if (label.includes('bus')) return { icon: <Bus size={16} />, label: 'Bus' };
            if (label.includes('auto') || label.includes('cab')) return { icon: <CarTaxiFront size={16} />, label: 'Auto' };
            return { icon: <PersonStanding size={16} />, label: 'Walk' };
        });
    };

    // Use unique data from apiResult if available, otherwise fallback to mocks
    const getRouteData = (id, type) => {
        const key = type.toLowerCase().includes('fastest') ? 'fastest' :
            type.toLowerCase().includes('safest') ? 'safest' :
                type.toLowerCase().includes('cheapest') || type.toLowerCase().includes('₹10') ? 'cheapest' : null;

        const dynamicData = key ? apiResult?.routes_data?.[key] : null;

        const baseRoutes = {
            fastest: {
                id: 1,
                type: apiResult?.labels?.fastest || 'Fastest Route',
                time: '32 mins',
                cost: '45',
                safety: dynamicSafety || 82,
                modes: parseRouteModes(apiResult?.fastest_route, [
                    { icon: <Train size={16} />, label: 'Metro' },
                    { icon: <Bus size={16} />, label: 'Bus' },
                    { icon: <PersonStanding size={16} />, label: 'Walk' },
                ]),
                tagColor: 'bg-blue-100 text-blue-700 border-blue-200'
            },
            safest: {
                id: 2,
                type: apiResult?.labels?.safest || 'Safest Route',
                time: '40 mins',
                cost: '50',
                safety: dynamicSafety || 94,
                modes: parseRouteModes(apiResult?.safest_route, [
                    { icon: <Train size={16} />, label: 'Metro' },
                    { icon: <CarTaxiFront size={16} />, label: 'Auto' },
                ]),
                tagColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                isRecommended: true
            },
            cheapest: {
                id: 3,
                type: apiResult?.labels?.cheapest || 'Cheapest Route',
                time: '55 mins',
                cost: '15',
                safety: dynamicSafety ? Math.max(0, dynamicSafety - 15) : 76,
                modes: [
                    { icon: <Bus size={16} />, label: 'Bus (₹10 Mode)' },
                ],
                tagColor: 'bg-amber-100 text-amber-700 border-amber-200'
            }
        };

        const route = baseRoutes[key] || baseRoutes.fastest;

        return {
            ...route,
            detailed_steps: dynamicData?.detailed_steps || route.detailed_steps,
            reason: dynamicData?.reason || route.reason,
            crowd: key === 'safest' ? 'Low' : 'Medium',
            delay: (id * 2 + 1).toString()
        };
    };

    const routes = [
        getRouteData(1, 'fastest'),
        getRouteData(2, 'safest'),
        getRouteData(3, 'cheapest')
    ];

    return (
        <div className="p-4 space-y-4 pb-24 animate-fade-in bg-slate-50 min-h-full">
            {festivalMode && (
                <div className="bg-orange-600 text-white p-5 rounded-3xl mb-4 shadow-xl shadow-orange-200 border-2 border-orange-400 animate-bounce-in flex items-center gap-4 relative z-50">
                    <div className="bg-white/20 p-2.5 rounded-2xl">
                        <RotateCw className="w-6 h-6 animate-spin-slow" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-0.5 text-orange-100">AI Intelligence Override</p>
                        <p className="text-[13px] font-black leading-tight">{apiResult?.festival_guidance || 'Directing via crowd-free pedestrian zones.'}</p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-800">Smart Recommendations</h2>
                    <p className="text-xs text-slate-500 font-medium">NDLS to India Gate Hub</p>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-slate-600 border border-slate-200 flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" /> AI-Orchestrated
                </div>
            </div>

            {/* Optimization Tabs moved from Home */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-1 mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all interactive-tap gap-1
                            ${activeTab === tab.id
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }
                        `}
                    >
                        {tab.icon}
                        <span className="text-[9px] font-bold tracking-wide">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* AI Decision Reason - Dynamic for selected tab */}
            {(() => {
                const activeRoute = routes.find(r => r.type.toLowerCase().includes(activeTab));
                const reason = activeRoute?.reason || apiResult?.reason;
                if (!reason) return null;

                return (
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl mb-4 relative overflow-hidden shadow-sm animate-fade-in">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100 rounded-full blur-2xl -mr-4 -mt-4"></div>
                        <div className="relative z-10 flex gap-3">
                            <div className="bg-indigo-100 p-2 text-indigo-600 rounded-xl h-fit">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-indigo-900 mb-1">AI Recommendation Reason</h3>
                                <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                                    {reason}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {routes.map((route) => (
                <div
                    key={route.id}
                    className={`bg-white rounded-3xl p-5 border transition-all hover-lift interactive-tap relative overflow-hidden
            ${route.isRecommended ? 'border-emerald-500 shadow-md shadow-emerald-500/10' : 'border-slate-100 shadow-sm'}
          `}
                    onClick={() => onSelectRoute(route)}
                >
                    {route.isRecommended && (
                        <div className="absolute right-0 top-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                            Ai Recommended
                        </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${route.tagColor}`}>
                            {route.type}
                        </span>
                        <div className="text-right flex flex-col items-end">
                            <span className="font-black text-2xl text-slate-800 flex items-center justify-end">
                                <span className="text-sm text-slate-400 mr-0.5 font-bold">₹</span>{route.cost}
                            </span>
                            {festivalMode && (
                                <span className="text-[8px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mt-1 border border-orange-200">
                                    Adaptive Choice
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 mb-5">
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 rounded-xl font-semibold text-sm text-slate-700 w-fit">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {route.time}
                        </div>

                        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm bg-opacity-10
              ${route.safety > 90 ? 'text-emerald-700 bg-emerald-500' : 'text-amber-700 bg-amber-500'}
            `}>
                            <ShieldCheck className="w-4 h-4" />
                            Safety {route.safety}%
                        </div>
                    </div>

                    {/* Transit Steps Graphic */}
                    <div className="relative pt-2 pb-4 px-2">
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>

                        <div className="relative z-10 flex justify-between">
                            {route.modes.map((mode, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md mb-2">
                                        {mode.icon}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-wide">
                                        {mode.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Phase 2: Crowd & Delay Intelligence */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        <div className="bg-amber-50 px-3 py-1.5 rounded-xl text-[11px] font-bold text-amber-700 border border-amber-100 flex items-center gap-1.5 shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                            Crowd: {route.crowd}
                        </div>
                        <div className="bg-rose-50 px-3 py-1.5 rounded-xl text-[11px] font-bold text-rose-700 border border-rose-100 flex items-center gap-1.5 shadow-sm">
                            <Clock className="w-3 h-3 text-rose-500" />
                            Delay prediction: +{route.delay}m
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center group">
                        <span className="text-sm font-bold text-primary-600">Start Navigation</span>
                        <div className="bg-primary-50 p-1.5 rounded-full text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
