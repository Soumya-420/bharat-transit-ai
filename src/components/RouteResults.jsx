import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    Clock, IndianRupee, ShieldCheck, ChevronRight, Train, Bus,
    PersonStanding, CarTaxiFront, Zap, Shield, RotateCw,
    Bike, Anchor, Waves, Star, Navigation2
} from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Distinct route data for each mode ──────────────────────────────────────
const ROUTE_PROFILES = {
    fastest: {
        id: 1,
        label: 'Fastest',
        type: 'Express Metro',
        emoji: '⚡',
        color: '#1d4ed8',
        bgGradient: 'from-blue-600 to-indigo-600',
        tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
        badgeColor: 'bg-blue-600',
        time: '28 min',
        cost: '₹45',
        safety: 87,
        crowd: 'Medium',
        delay: '+2 min',
        co2: '0.8 kg',
        aiReason: 'Rajiv Chowk Metro (Blue Line) has zero signals between NDLS and India Gate. Nonstop express saves 14 min vs road.',
        modes: [
            { icon: <PersonStanding size={15} />, label: 'Walk', color: '#64748b', duration: '3 min' },
            { icon: <Train size={15} />, label: 'Metro', color: '#2563eb', duration: '18 min' },
            { icon: <PersonStanding size={15} />, label: 'Walk', color: '#64748b', duration: '7 min' },
        ],
        steps: [
            { icon: '🚶', text: 'Walk to NDLS Metro Gate 1 (3 min)' },
            { icon: '🚇', text: 'Board Blue Line → Rajiv Chowk (3 stops)' },
            { icon: '🚇', text: 'Change to Yellow Line (1 stop)' },
            { icon: '🚶', text: 'Walk via Tilak Marg to India Gate (7 min)' },
        ],
        mapRoute: [
            [28.6419, 77.2194], [28.6395, 77.2215], [28.6362, 77.2238],
            [28.6334, 77.2254], [28.6301, 77.2275], [28.6275, 77.2298],
            [28.6248, 77.2320], [28.6220, 77.2344], [28.6192, 77.2367],
            [28.6140, 77.2090]
        ],
        regionOptions: ['Metro Express', 'Rapid Rail', 'Express Bus'],
        realTransit: { line: 'Blue Line', stops: 3, platform: '2A', frequency: 'Every 4 min' }
    },
    safest: {
        id: 2,
        label: 'Safest',
        type: 'CCTV-Monitored Bus',
        emoji: '🛡️',
        color: '#16a34a',
        bgGradient: 'from-emerald-600 to-teal-600',
        tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badgeColor: 'bg-emerald-600',
        time: '42 min',
        cost: '₹30',
        safety: 96,
        crowd: 'Low',
        delay: '+4 min',
        co2: '1.2 kg',
        aiReason: 'DTC Route 620 runs via Rajpath — well-lit, CCTV-monitored, police-checked corridor. Highest safety score in this zone.',
        isRecommended: true,
        modes: [
            { icon: <Bus size={15} />, label: 'DTC Bus', color: '#16a34a', duration: '35 min' },
            { icon: <PersonStanding size={15} />, label: 'Walk', color: '#64748b', duration: '7 min' },
        ],
        steps: [
            { icon: '🚍', text: 'Board DTC Bus 620 at NDLS Bus Stop' },
            { icon: '🛣️', text: 'Via Rajpath Corridor (secure, CCTV-monitored)' },
            { icon: '🚍', text: 'Alight at Kartavya Path Stop' },
            { icon: '🚶', text: 'Walk to India Gate (7 min via Rajpath)' },
        ],
        mapRoute: [
            [28.6419, 77.2194], [28.6400, 77.2180], [28.6380, 77.2160],
            [28.6360, 77.2140], [28.6340, 77.2120], [28.6310, 77.2105],
            [28.6285, 77.2095], [28.6250, 77.2092], [28.6215, 77.2090],
            [28.6140, 77.2090]
        ],
        regionOptions: ['DTC Bus', 'e-Bus', 'CNG Mini-Bus'],
        realTransit: { line: 'Route 620', stops: 8, platform: 'Bay 3', frequency: 'Every 10 min' }
    },
    cheapest: {
        id: 3,
        label: 'Cheapest',
        type: 'Shared Auto + Walk',
        emoji: '💰',
        color: '#d97706',
        bgGradient: 'from-amber-500 to-orange-500',
        tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
        badgeColor: 'bg-amber-500',
        time: '55 min',
        cost: '₹12',
        safety: 78,
        crowd: 'High',
        delay: '+8 min',
        co2: '0.4 kg',
        aiReason: 'Shared auto pooling on Patel Rd reduces cost to ₹12. Combined with DTC ₹10 pass segment — minimum fare journey.',
        modes: [
            { icon: <CarTaxiFront size={15} />, label: 'Shared Auto', color: '#d97706', duration: '25 min' },
            { icon: <Bus size={15} />, label: 'DTC ₹10', color: '#ca8a04', duration: '20 min' },
            { icon: <PersonStanding size={15} />, label: 'Walk', color: '#64748b', duration: '10 min' },
        ],
        steps: [
            { icon: '🛺', text: 'Shared Auto from NDLS to Connaught Place (₹8)' },
            { icon: '🚍', text: 'DTC ₹10 e-Bus — CP to India Gate zone' },
            { icon: '🚶', text: 'Walk via Janpath to India Gate (10 min)' },
        ],
        mapRoute: [
            [28.6419, 77.2194], [28.6430, 77.2220], [28.6445, 77.2245],
            [28.6480, 77.2270], [28.6420, 77.2300], [28.6380, 77.2280],
            [28.6340, 77.2240], [28.6280, 77.2190], [28.6210, 77.2130],
            [28.6140, 77.2090]
        ],
        regionOptions: ['Shared Auto', 'E-Rickshaw', 'City Bus'],
        realTransit: { line: 'Auto + Bus', stops: 'Pooled', platform: 'Prepaid', frequency: 'On-demand' }
    },
    jugaad: {
        id: 4,
        label: 'Jugaad',
        type: 'Cycle + Metro',
        emoji: '🔧',
        color: '#7c3aed',
        bgGradient: 'from-violet-600 to-purple-600',
        tagColor: 'bg-violet-50 text-violet-700 border-violet-200',
        badgeColor: 'bg-violet-600',
        time: '38 min',
        cost: '₹25',
        safety: 82,
        crowd: 'Very Low',
        delay: '+1 min',
        co2: '0.1 kg',
        aiReason: 'Delhi Cycle Share + Metro combo — eco-friendly, avoids congestion entirely. 0.1kg CO₂ only. Best for green commuters.',
        modes: [
            { icon: <Bike size={15} />, label: 'Cycle', color: '#7c3aed', duration: '12 min' },
            { icon: <Train size={15} />, label: 'Metro', color: '#2563eb', duration: '16 min' },
            { icon: <Bike size={15} />, label: 'Cycle', color: '#7c3aed', duration: '10 min' },
        ],
        steps: [
            { icon: '🚲', text: 'Delhi Cycle Share from NDLS (₹5, 12 min)' },
            { icon: '🚇', text: 'Mandi House Metro → Udyog Bhawan (2 stops)' },
            { icon: '🚲', text: 'Cycle along Rajpath to India Gate (10 min)' },
        ],
        mapRoute: [
            [28.6419, 77.2194], [28.6405, 77.2220], [28.6395, 77.2245],
            [28.6378, 77.2265], [28.6360, 77.2280], [28.6330, 77.2275],
            [28.6300, 77.2260], [28.6270, 77.2230], [28.6210, 77.2170],
            [28.6140, 77.2090]
        ],
        regionOptions: ['Cycle Share', 'E-Scooter', 'Walk + Metro'],
        realTransit: { line: 'Cycle + Blue Line', stops: 2, platform: 'Dock 4', frequency: 'Always available' }
    }
};

// Region-specific alternate transport display
const REGION_TRANSPORT = {
    kolkata: [
        { icon: '🚋', label: 'Tram' }, { icon: '⛵', label: '& Ferry' }, { icon: '🚇', label: 'Metro' }
    ],
    mumbai: [
        { icon: '🚂', label: 'Local Train' }, { icon: '⛴️', label: 'Ferry' }, { icon: '🚌', label: 'BEST Bus' }
    ],
    goa: [
        { icon: '⛵', label: 'Ferry' }, { icon: '🛺', label: 'Auto' }, { icon: '🛵', label: 'Bike Taxi' }
    ],
    varanasi: [
        { icon: '⛵', label: 'Naav (Boat)' }, { icon: '🛺', label: 'E-Rickshaw' }, { icon: '🚌', label: 'City Bus' }
    ],
    default: [
        { icon: '🚌', label: 'City Bus' }, { icon: '🛺', label: 'Auto' }, { icon: '🚇', label: 'Metro' }
    ]
};

export default function RouteResults({ onSelectRoute, apiResult, festivalMode, lang }) {
    const [activeTab, setActiveTab] = useState('fastest');
    const [showMap, setShowMap] = useState(true);

    const tabs = [
        { id: 'fastest', label: 'Fastest', icon: <Zap size={13} />, color: 'text-blue-600', activeBg: 'bg-blue-600' },
        { id: 'safest', label: 'Safest', icon: <Shield size={13} />, color: 'text-emerald-600', activeBg: 'bg-emerald-600' },
        { id: 'cheapest', label: 'Cheapest', icon: <IndianRupee size={13} />, color: 'text-amber-600', activeBg: 'bg-amber-600' },
        { id: 'jugaad', label: 'Jugaad', icon: <RotateCw size={13} />, color: 'text-violet-600', activeBg: 'bg-violet-600' },
    ];

    const active = ROUTE_PROFILES[activeTab];
    const all = ['fastest', 'safest', 'cheapest', 'jugaad'].map(k => ROUTE_PROFILES[k]);

    // Determine region for local transport tips
    const dest = (apiResult?.destination || '').toLowerCase();
    const region = dest.includes('kolkata') ? 'kolkata'
        : dest.includes('mumbai') || dest.includes('bandra') ? 'mumbai'
            : dest.includes('goa') ? 'goa'
                : dest.includes('varanasi') || dest.includes('ghat') ? 'varanasi'
                    : 'default';

    const MAP_CENTER = [28.628, 77.214];

    return (
        <div className="pb-24 animate-fade-in bg-slate-50 min-h-full">

            {/* Header */}
            <div className={`bg-gradient-to-r ${active.bgGradient} text-white px-5 pt-6 pb-10 transition-all duration-500`}>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Smart Recommendations</p>
                        <h2 className="text-xl font-black text-white leading-tight">NDLS → India Gate</h2>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">AI Live</span>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="bg-white/15 backdrop-blur-md p-1.5 rounded-2xl flex gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all interactive-tap gap-0.5
                                ${activeTab === tab.id ? 'bg-white shadow-lg scale-[1.03]' : 'hover:bg-white/20'}
                            `}
                        >
                            <span className={activeTab === tab.id ? tab.color : 'text-white/80'}>{tab.icon}</span>
                            <span className={`text-[9px] font-black tracking-wide ${activeTab === tab.id ? tab.color : 'text-white/80'}`}>
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Route Card */}
            <div className="mx-4 -mt-6 animate-bounce-in">
                <div className="bg-white rounded-[2.5rem] shadow-2xl border-2 overflow-hidden" style={{ borderColor: active.color + '40' }}>

                    {/* Route Type Header */}
                    <div className="px-5 pt-5 pb-0 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">{active.emoji}</div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{active.label} Option</p>
                                <h3 className="font-black text-slate-800 text-lg leading-tight">{active.type}</h3>
                            </div>
                        </div>
                        {active.isRecommended && (
                            <div className="bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                                <Star size={8} fill="white" /> AI Pick
                            </div>
                        )}
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-4 gap-2 px-5 py-4">
                        {[
                            { icon: <Clock size={14} />, val: active.time, label: 'Time', c: '#1e293b' },
                            { icon: <IndianRupee size={14} />, val: active.cost, label: 'Cost', c: active.color },
                            { icon: <ShieldCheck size={14} />, val: `${active.safety}%`, label: 'Safety', c: active.safety > 90 ? '#16a34a' : '#d97706' },
                            { icon: <span className="text-xs">🌿</span>, val: active.co2, label: 'CO₂', c: '#64748b' },
                        ].map((m, i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-2.5 text-center border border-slate-100">
                                <div className="flex justify-center mb-1" style={{ color: m.c }}>{m.icon}</div>
                                <p className="font-black text-slate-800 text-sm leading-none">{m.val}</p>
                                <p className="text-[9px] font-bold text-slate-400 mt-0.5">{m.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Transport Mode Chain */}
                    <div className="px-5 pb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Journey Breakdown</p>
                        <div className="flex items-center gap-1">
                            {active.modes.map((mode, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="flex flex-col items-center gap-1.5 flex-1">
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border-2 border-white" style={{ background: mode.color + '20', color: mode.color, borderColor: mode.color + '40' }}>
                                            {mode.icon}
                                        </div>
                                        <p className="text-[9px] font-black text-slate-600 text-center leading-tight">{mode.label}</p>
                                        <p className="text-[8px] font-bold text-slate-400">{mode.duration}</p>
                                    </div>
                                    {idx < active.modes.length - 1 && (
                                        <ChevronRight size={14} className="text-slate-300 shrink-0" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Step by Step */}
                    <div className="px-5 pb-4 border-t border-slate-50 pt-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Step-by-Step</p>
                        <div className="space-y-2">
                            {active.steps.map((step, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <span className="text-base leading-none mt-0.5">{step.icon}</span>
                                    <p className="text-xs font-bold text-slate-600 leading-relaxed">{step.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Real Transit Info */}
                    <div className="mx-4 mb-4 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(active.realTransit).map(([k, v]) => (
                                <div key={k} className="text-center">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">{k}</p>
                                    <p className="text-[10px] font-black text-slate-700">{v}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Reason */}
                    <div className="mx-4 mb-4 bg-indigo-50 rounded-2xl p-3 border border-indigo-100 flex gap-2.5">
                        <ShieldCheck size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] font-bold text-indigo-700 leading-relaxed">{active.aiReason}</p>
                    </div>

                    {/* Status badges */}
                    <div className="px-5 pb-4 flex flex-wrap gap-2">
                        <span className="text-[10px] bg-amber-50 text-amber-700 font-black px-2.5 py-1 rounded-full border border-amber-100 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                            Crowd: {active.crowd}
                        </span>
                        <span className="text-[10px] bg-rose-50 text-rose-700 font-black px-2.5 py-1 rounded-full border border-rose-100 flex items-center gap-1">
                            <Clock size={10} className="text-rose-500" /> Delay: {active.delay}
                        </span>
                        <span className="text-[10px] bg-green-50 text-green-700 font-black px-2.5 py-1 rounded-full border border-green-100 flex items-center gap-1">
                            🌿 {active.co2} saved
                        </span>
                    </div>

                    {/* Start Nav button */}
                    <button
                        onClick={() => onSelectRoute({ ...active, detailed_steps: active.steps, reason: active.aiReason })}
                        className="mx-4 mb-5 w-[calc(100%-2rem)] py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 interactive-tap shadow-xl transition-all hover:scale-[1.02]"
                        style={{ background: `linear-gradient(135deg, ${active.color}, ${active.color}cc)`, boxShadow: `0 8px 24px ${active.color}40` }}
                    >
                        <Navigation2 size={18} /> Start Navigation — {active.type}
                    </button>
                </div>
            </div>

            {/* Map — all 4 routes shown simultaneously */}
            <div className="mx-4 mt-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black text-slate-800 text-sm">All Routes — Live Map</h3>
                    <button onClick={() => setShowMap(v => !v)} className="text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                        {showMap ? 'Hide Map' : 'Show Map'}
                    </button>
                </div>

                {showMap && (
                    <>
                        {/* Legend */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {all.map(r => (
                                <button
                                    key={r.id}
                                    onClick={() => setActiveTab(['fastest', 'safest', 'cheapest', 'jugaad'][r.id - 1])}
                                    className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full border transition-all ${activeTab === ['fastest', 'safest', 'cheapest', 'jugaad'][r.id - 1] ? 'shadow-md scale-105' : 'opacity-60'}`}
                                    style={{ borderColor: r.color + '60', color: r.color, background: r.color + '12' }}
                                >
                                    <span className="w-5 h-1 rounded-full inline-block" style={{ background: r.color }}></span>
                                    {r.emoji} {r.label}
                                </button>
                            ))}
                        </div>

                        <div className="h-64 rounded-3xl overflow-hidden shadow-lg border-2 border-slate-100">
                            <MapContainer center={MAP_CENTER} zoom={13} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                {/* Origin marker */}
                                <Marker position={[28.6419, 77.2194]}>
                                    <Popup>New Delhi Railway Station</Popup>
                                </Marker>
                                {/* Destination marker */}
                                <Marker position={[28.6140, 77.2090]}>
                                    <Popup>India Gate</Popup>
                                </Marker>

                                {/* All 4 routes as colored polylines */}
                                {all.map((r, i) => {
                                    const tabKey = ['fastest', 'safest', 'cheapest', 'jugaad'][i];
                                    const isActive = activeTab === tabKey;
                                    return (
                                        <Polyline
                                            key={r.id}
                                            positions={r.mapRoute}
                                            pathOptions={{
                                                color: r.color,
                                                weight: isActive ? 6 : 3,
                                                opacity: isActive ? 1 : 0.35,
                                                dashArray: isActive ? undefined : '6 4'
                                            }}
                                        />
                                    );
                                })}
                            </MapContainer>
                        </div>
                    </>
                )}
            </div>

            {/* Region-specific transport options */}
            <div className="mx-4 mt-5 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    🗺️ Local Transport Options {region !== 'default' ? `(${region.charAt(0).toUpperCase() + region.slice(1)})` : '(Delhi)'}
                </p>
                <div className="grid grid-cols-3 gap-3">
                    {(REGION_TRANSPORT[region] || REGION_TRANSPORT.default).map((t, i) => (
                        <div key={i} className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                            <div className="text-2xl mb-1">{t.icon}</div>
                            <p className="text-[10px] font-black text-slate-700">{t.label}</p>
                        </div>
                    ))}
                </div>
                <p className="text-[9px] text-slate-400 font-bold mt-3 leading-relaxed">
                    Future integration: Kolkata Tram API · Mumbai Local Rail · Varanasi Naav Ghats · Goa Ferry Schedule
                </p>
            </div>

            {/* Compare all routes */}
            <div className="mx-4 mt-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quick Compare</p>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-4 text-center py-2 bg-slate-50 border-b border-slate-100">
                        {['', 'Time', 'Cost', 'Safety'].map((h, i) => (
                            <p key={i} className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{h}</p>
                        ))}
                    </div>
                    {all.map((r, idx) => {
                        const tabKey = ['fastest', 'safest', 'cheapest', 'jugaad'][idx];
                        return (
                            <button
                                key={r.id}
                                onClick={() => setActiveTab(tabKey)}
                                className={`w-full grid grid-cols-4 text-center py-3 border-b border-slate-50 transition-all ${activeTab === tabKey ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    <div className="w-2 h-2 rounded-full" style={{ background: r.color }}></div>
                                    <span className="text-[9px] font-black" style={{ color: r.color }}>{r.label}</span>
                                </div>
                                <p className="text-xs font-bold text-slate-700">{r.time}</p>
                                <p className="text-xs font-bold text-slate-700">{r.cost}</p>
                                <p className="text-xs font-bold" style={{ color: r.safety > 90 ? '#16a34a' : r.safety > 80 ? '#d97706' : '#dc2626' }}>{r.safety}%</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
