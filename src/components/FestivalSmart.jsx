import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    AlertTriangle, Shield, Navigation2, Clock, Users, Zap, ChevronRight,
    X, RefreshCw, Flame, CheckCircle2, Info, MapPin, Radio
} from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Simulated festval database (future: replace with Google Crowd Data / Police API) ──
const FESTIVAL_DB = [
    {
        id: 1,
        name: 'Holi Procession 2026',
        type: 'Religious Festival',
        emoji: '🎨',
        crowdLevel: 'Extreme',
        crowdPct: 95,
        startTime: '08:00 AM',
        endTime: '02:00 PM',
        area: 'Chandni Chowk → Red Fort',
        affectedRadius: 800,
        center: [28.6506, 77.2400],
        festivalRoute: [
            [28.6506, 77.2400], [28.6490, 77.2370], [28.6475, 77.2350],
            [28.6460, 77.2330], [28.6448, 77.2310]
        ],
        altRoutes: [
            {
                id: 'a1',
                label: 'Outer Ring Bypass',
                color: '#16a34a',
                via: 'via Ring Road N',
                timeSaved: '12 min faster',
                safetyScore: 92,
                coords: [
                    [28.6506, 77.2400], [28.6530, 77.2450], [28.6560, 77.2500],
                    [28.6520, 77.2560], [28.6480, 77.2540], [28.6448, 77.2310]
                ]
            },
            {
                id: 'a2',
                label: 'Metro + Walk',
                color: '#0ea5e9',
                via: 'via Kashmere Gate Metro',
                timeSaved: '8 min faster',
                safetyScore: 96,
                coords: [
                    [28.6506, 77.2400], [28.6540, 77.2380], [28.6562, 77.2356],
                    [28.6555, 77.2300], [28.6490, 77.2290], [28.6448, 77.2310]
                ]
            }
        ]
    },
    {
        id: 2,
        name: 'Eid Milad-un-Nabi',
        type: 'Religious Procession',
        emoji: '🌙',
        crowdLevel: 'High',
        crowdPct: 78,
        startTime: '10:00 AM',
        endTime: '05:00 PM',
        area: 'Jama Masjid → Karol Bagh',
        affectedRadius: 600,
        center: [28.6507, 77.2334],
        festivalRoute: [
            [28.6507, 77.2334], [28.6495, 77.2280], [28.6480, 77.2230],
            [28.6460, 77.2190], [28.6445, 77.2160]
        ],
        altRoutes: [
            {
                id: 'b1',
                label: 'South Delhi Route',
                color: '#16a34a',
                via: 'via ITO → Pragati Maidan',
                timeSaved: '5 min faster',
                safetyScore: 88,
                coords: [
                    [28.6507, 77.2334], [28.6460, 77.2400], [28.6420, 77.2420],
                    [28.6400, 77.2380], [28.6390, 77.2300], [28.6445, 77.2160]
                ]
            }
        ]
    }
];

const CROWD_COLOR = { Extreme: '#dc2626', High: '#ea580c', Moderate: '#ca8a04', Low: '#16a34a' };
const CROWD_BG = { Extreme: 'bg-red-100 text-red-700 border-red-200', High: 'bg-orange-100 text-orange-700 border-orange-200', Moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200', Low: 'bg-green-100 text-green-700 border-green-200' };

export default function FestivalSmart({ lang }) {
    const [detected, setDetected] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [showRouteDetail, setShowRouteDetail] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [activeAlt, setActiveAlt] = useState(null);
    const [scanFeed, setScanFeed] = useState([]);
    const intervalRef = useRef(null);

    // Simulate AI scan feed messages
    const SCAN_MSGS = [
        '📡 Scanning live traffic feeds...',
        '🛰️ Checking police event database...',
        '📍 Analyzing GPS crowd density...',
        '🔍 Parsing social media geo-tags...',
        '⚙️ Running Festival-Smart AI model...',
        '✅ Generating alternate route matrix...',
    ];

    useEffect(() => {
        let progress = 0;
        const tick = setInterval(() => {
            progress += 18;
            setScanProgress(Math.min(progress, 100));
            setScanFeed(prev => {
                const idx = Math.min(Math.floor(progress / 18), SCAN_MSGS.length - 1);
                return [...new Set([...prev, SCAN_MSGS[idx]])];
            });
            if (progress >= 100) {
                clearInterval(tick);
                setTimeout(() => {
                    setIsScanning(false);
                    // Randomly detect one of the festival events
                    setDetected(FESTIVAL_DB[0]);
                    setActiveAlt(FESTIVAL_DB[0].altRoutes[0]);
                }, 600);
            }
        }, 500);
        return () => clearInterval(tick);
    }, []);

    const handleRescan = () => {
        setIsScanning(true);
        setScanFeed([]);
        setScanProgress(0);
        setDetected(null);
        setActiveAlt(null);
    };

    const mapCenter = detected ? detected.center : [28.6139, 77.2090];

    return (
        <div className="pb-20 min-h-full bg-slate-50 animate-slide-up">

            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-5 pt-6 pb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-sm">
                            <Flame className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-black text-lg leading-tight">Festival-Smart AI</h2>
                            <p className="text-[10px] text-orange-200 font-bold uppercase tracking-widest">Auto Route Optimizer</p>
                        </div>
                    </div>
                    <button onClick={handleRescan} className="bg-white/20 p-2.5 rounded-2xl interactive-tap" title="Re-scan">
                        <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} />
                    </button>
                </div>
                <div className="mt-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-2">
                    <Radio size={12} className="text-orange-200 animate-pulse" />
                    <p className="text-xs font-bold text-orange-100">
                        {isScanning ? 'Scanning live data sources...' : `${detected ? '1 active event detected near you' : 'No active events detected'}`}
                    </p>
                </div>
            </div>

            {/* Scanning State */}
            {isScanning && (
                <div className="mx-4 -mt-4 bg-white rounded-3xl shadow-xl p-6 border border-orange-100 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-orange-50 p-2.5 rounded-2xl">
                            <Zap className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-slate-800 text-sm">AI Detection Running</p>
                            <div className="mt-1.5 w-full bg-slate-100 rounded-full h-2">
                                <div
                                    className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                                    style={{ width: `${scanProgress}%` }}
                                ></div>
                            </div>
                        </div>
                        <span className="text-sm font-black text-orange-600">{Math.round(scanProgress)}%</span>
                    </div>
                    <div className="space-y-2">
                        {scanFeed.map((msg, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 font-medium animate-fade-in">
                                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                                {msg}
                            </div>
                        ))}
                    </div>

                    {/* Data Sources */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Connected Data Sources</p>
                        <div className="flex gap-2 flex-wrap">
                            {['Police Event API', 'Crowd Density AI', 'Social Geo-tags', 'Live Traffic Feed'].map(s => (
                                <span key={s} className="text-[9px] font-black bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full border border-slate-200">{s}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Festival Detected View */}
            {!isScanning && detected && (
                <>
                    {/* Alert Card */}
                    <div className="mx-4 -mt-4 animate-bounce-in">
                        <div className="bg-red-600 text-white rounded-3xl p-5 shadow-2xl shadow-red-500/30 border border-red-500">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 text-3xl p-2 rounded-2xl leading-none">{detected.emoji}</div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-red-200">⚠️ Event Detected Nearby</p>
                                        <p className="font-black text-lg leading-tight">{detected.name}</p>
                                        <p className="text-xs text-red-200 font-bold">{detected.type}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-black px-2 py-1 rounded-xl border bg-white/20 border-white/30 whitespace-nowrap`}>
                                    {detected.crowdLevel} Crowd
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-white/10 rounded-2xl p-3 text-center">
                                    <Clock size={14} className="mx-auto mb-1 text-red-200" />
                                    <p className="text-[9px] font-black text-red-200 uppercase tracking-wider">Time</p>
                                    <p className="text-xs font-black">{detected.startTime}</p>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-3 text-center">
                                    <Users size={14} className="mx-auto mb-1 text-red-200" />
                                    <p className="text-[9px] font-black text-red-200 uppercase tracking-wider">Crowd</p>
                                    <p className="text-xs font-black">{detected.crowdPct}%</p>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-3 text-center">
                                    <MapPin size={14} className="mx-auto mb-1 text-red-200" />
                                    <p className="text-[9px] font-black text-red-200 uppercase tracking-wider">Ends</p>
                                    <p className="text-xs font-black">{detected.endTime}</p>
                                </div>
                            </div>

                            <div className="mt-3 bg-white/10 rounded-2xl px-3 py-2 flex items-center gap-2">
                                <MapPin size={12} className="text-red-200 shrink-0" />
                                <p className="text-[10px] font-bold text-red-100">{detected.area}</p>
                            </div>
                        </div>
                    </div>

                    {/* Map with colored routes */}
                    <div className="mx-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-black text-slate-800 text-base">Live Route Map</h3>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase">
                                <span className="flex items-center gap-1"><span className="w-3 h-1.5 bg-red-500 rounded-full inline-block"></span>Festival Zone</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-1.5 bg-green-600 rounded-full inline-block"></span>Safe Alt</span>
                            </div>
                        </div>
                        <div className="h-56 rounded-3xl overflow-hidden shadow-lg border-2 border-slate-100">
                            <MapContainer
                                center={mapCenter}
                                zoom={14}
                                zoomControl={false}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                {/* Festival Route — Red */}
                                <Polyline
                                    positions={detected.festivalRoute}
                                    pathOptions={{ color: '#dc2626', weight: 6, opacity: 0.85, dashArray: '10 6' }}
                                />

                                {/* Festival Zone Circle */}
                                <Circle
                                    center={detected.center}
                                    radius={detected.affectedRadius}
                                    pathOptions={{ color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.08, weight: 2 }}
                                />
                                <Marker position={detected.center}>
                                    <Popup><b>{detected.name}</b><br />Crowd: {detected.crowdPct}%</Popup>
                                </Marker>

                                {/* Alt Routes */}
                                {detected.altRoutes.map(r => (
                                    <Polyline
                                        key={r.id}
                                        positions={r.coords}
                                        pathOptions={{
                                            color: r.id === activeAlt?.id ? r.color : '#94a3b8',
                                            weight: r.id === activeAlt?.id ? 5 : 3,
                                            opacity: r.id === activeAlt?.id ? 0.95 : 0.5
                                        }}
                                    />
                                ))}
                            </MapContainer>
                        </div>
                    </div>

                    {/* Crowd Level Bar */}
                    <div className="mx-4 mt-4 bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-black text-slate-700 flex items-center gap-1"><Users size={13} /> Crowd Intensity</p>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${CROWD_BG[detected.crowdLevel]}`}>{detected.crowdLevel}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                            <div
                                className="h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${detected.crowdPct}%`, background: CROWD_COLOR[detected.crowdLevel] }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[9px] text-slate-400 font-bold">Low</span>
                            <span className="text-[9px] text-slate-400 font-bold">Extreme</span>
                        </div>
                    </div>

                    {/* Smart Alternative Routes */}
                    <div className="mx-4 mt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-emerald-50 p-1.5 rounded-xl">
                                <Shield size={14} className="text-emerald-600" />
                            </div>
                            <h3 className="font-black text-slate-800 text-base">Smart Alternative Routes</h3>
                        </div>
                        <div className="space-y-3">
                            {detected.altRoutes.map(route => (
                                <div
                                    key={route.id}
                                    onClick={() => setActiveAlt(route)}
                                    className={`bg-white rounded-3xl p-5 border-2 shadow-sm transition-all cursor-pointer ${activeAlt?.id === route.id ? 'border-emerald-400 shadow-emerald-100' : 'border-slate-100 hover:border-emerald-200'}`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full mt-0.5 shrink-0 shadow-sm border-2 border-white" style={{ background: route.color }}></div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm">{route.label}</p>
                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{route.via}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                                                        <Zap size={9} /> {route.timeSaved}
                                                    </span>
                                                    <span className="text-[10px] bg-blue-50 text-blue-700 font-black px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                                                        <Shield size={9} /> Safety {route.safetyScore}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-1 shrink-0 mt-1 transition-all ${activeAlt?.id === route.id ? 'opacity-100' : 'opacity-0'}`}>
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                        </div>
                                    </div>
                                    {activeAlt?.id === route.id && (
                                        <button className="mt-4 w-full bg-emerald-600 text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 interactive-tap shadow-lg shadow-emerald-500/20">
                                            <Navigation2 size={14} /> Navigate via This Route
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Future Integration Note */}
                    <div className="mx-4 mt-5 mb-4 bg-slate-800 rounded-3xl p-5 text-white">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Info size={10} /> Future Integration
                        </p>
                        <p className="text-xs font-medium text-slate-300 leading-relaxed">
                            This system is designed to integrate with <span className="text-primary-400 font-black">Police Traffic API</span>, <span className="text-primary-400 font-black">Google Crowd Data</span>, and <span className="text-primary-400 font-black">Smart City IoT sensors</span> for real-time festival detection across India.
                        </p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {['Police API', 'Google Crowd', 'IoT Sensors', 'Weather Feed'].map(s => (
                                <span key={s} className="text-[9px] font-black bg-slate-700 text-slate-400 px-2 py-1 rounded-xl border border-slate-600">{s}</span>
                            ))}
                        </div>
                    </div>

                    {/* Other events */}
                    {FESTIVAL_DB.length > 1 && (
                        <div className="mx-4 mb-4">
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Other Nearby Events</p>
                            {FESTIVAL_DB.slice(1).map(f => (
                                <div key={f.id} onClick={() => { setDetected(f); setActiveAlt(f.altRoutes[0]); }} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-orange-200 transition-all mb-2">
                                    <span className="text-2xl">{f.emoji}</span>
                                    <div className="flex-1">
                                        <p className="font-black text-slate-800 text-sm">{f.name}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">{f.area} · {f.startTime}</p>
                                    </div>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${CROWD_BG[f.crowdLevel]}`}>{f.crowdLevel}</span>
                                    <ChevronRight size={16} className="text-slate-400" />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* No event state */}
            {!isScanning && !detected && (
                <div className="mx-4 -mt-4 bg-white rounded-3xl p-8 text-center shadow-lg animate-fade-in">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="font-black text-slate-800 text-lg">All Clear!</h3>
                    <p className="text-slate-500 text-sm font-medium mt-2">No active festivals or processions detected in your area right now.</p>
                    <button onClick={handleRescan} className="mt-6 bg-orange-600 text-white font-black px-6 py-3 rounded-2xl flex items-center justify-center gap-2 mx-auto shadow-lg">
                        <RefreshCw size={16} /> Re-scan Area
                    </button>
                </div>
            )}
        </div>
    );
}
