import React, { useMemo, useState } from 'react';
import { Mic, ShieldAlert, Share2, Compass, ArrowRight, Train, Navigation, BellRing, MapPin, List, Globe } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default function LiveNavigation({ route, apiResult }) {
    const [lang, setLang] = useState('EN');
    const [showSteps, setShowSteps] = useState(false);

    const polylineCoords = useMemo(() => {
        if (!apiResult?.route_geojson) return [];
        return apiResult.route_geojson.map(coord => [coord[1], coord[0]]);
    }, [apiResult]);

    const startCoords = polylineCoords.length > 0 ? polylineCoords[0] : [28.6141, 77.2185];
    const endCoords = polylineCoords.length > 0 ? polylineCoords[polylineCoords.length - 1] : [28.6139, 77.2090];

    const turnByTurn = [
        { instruction: lang === 'EN' ? "Walk 200m to Exit 3" : "निकास 3 तक 200 मीटर चलें", distance: "200m" },
        { instruction: lang === 'EN' ? "Board Yellow Line towards HUDA" : "हुडा की ओर येलो लाइन पकड़ें", distance: "Board" },
        { instruction: lang === 'EN' ? "Switch to Blue Line at Rajiv Chowk" : "राजीव चौक पर ब्लू लाइन में बदलें", distance: "Transfer" },
        { instruction: lang === 'EN' ? "Exit at India Gate Station" : "इंडिया गेट स्टेशन पर उतरें", distance: "Arrive" }
    ];

    return (
        <div className="h-full flex flex-col bg-slate-50 animate-slide-up pb-20 relative overflow-hidden">

            {/* Sub-Header: Multilingual & Controls */}
            <div className="bg-white px-4 py-3 shadow-md z-[1001] flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="bg-slate-100 p-2 rounded-lg">
                        <Navigation className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigation Mode</p>
                        <p className="text-xs font-bold text-slate-800 uppercase tracking-tighter">Turn-by-Turn Live</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-xl font-bold text-xs border border-primary-100 interactive-tap"
                    >
                        <Globe size={14} />
                        {lang === 'EN' ? 'English' : 'हिंदी'}
                    </button>
                    <button
                        onClick={() => setShowSteps(!showSteps)}
                        className={`p-2 rounded-xl transition-colors interactive-tap ${showSteps ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-slate-200 z-0">
                <MapContainer
                    center={startCoords}
                    zoom={15}
                    zoomControl={false}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {polylineCoords.length > 0 && <Polyline positions={polylineCoords} pathOptions={{ color: '#0ea5e9', weight: 6 }} />}
                    <Marker position={startCoords} />
                    <Marker position={endCoords} />
                </MapContainer>

                {/* Festival Alert Overlay */}
                <div className="absolute top-4 left-4 right-4 z-[1000] animate-bounce-in">
                    <div className="bg-orange-500/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 border border-orange-400/50">
                        <div className="bg-white/20 p-1.5 rounded-lg animate-pulse">🕉️</div>
                        <p className="text-xs font-bold">Festival Active: Routing via Low-Congestion Zones</p>
                    </div>
                </div>
            </div>

            {/* Step List Drawer */}
            {showSteps && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-sm z-[1005] animate-fade-in p-6 pt-20">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-slate-800">Journey Steps</h3>
                        <button onClick={() => setShowSteps(false)} className="text-primary-600 font-bold">Close Map</button>
                    </div>
                    <div className="space-y-4">
                        {turnByTurn.map((step, i) => (
                            <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 shadow-md">
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-800 text-[15px] leading-snug">{step.instruction}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{step.distance}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Floating Navigation Card */}
            <div className="absolute bottom-24 left-4 right-4 bg-slate-900 text-white rounded-[2.5rem] p-6 shadow-2xl z-[1002] border border-white/10 glass-panel-dark">
                <div className="flex gap-4">
                    <div className="bg-primary-500/20 p-4 rounded-[1.5rem] h-fit border border-primary-500/30 shadow-inner">
                        <ArrowRight className="w-8 h-8 text-primary-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-primary-400 text-[10px] font-black tracking-[0.2em] uppercase mb-1">
                            {lang === 'EN' ? 'Next Instruction' : 'अगला निर्देश'}
                        </p>
                        <p className="font-bold text-lg leading-tight mb-5">
                            {lang === 'EN' ? 'Board Metro - Blue Line' : 'ब्लू लाइन मेट्रो पकड़ें'}
                            <span className="text-slate-400 font-normal ml-1">towards India Gate</span>
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                            <button className="flex flex-col items-center justify-center bg-white/5 py-3 rounded-2xl interactive-tap gap-1">
                                <Mic className="w-4 h-4 text-slate-300" />
                                <span className="text-[9px] font-black text-slate-400 uppercase">Voice AI</span>
                            </button>
                            <button className="flex flex-col items-center justify-center bg-rose-500/20 border border-rose-500/30 py-3 rounded-2xl interactive-tap gap-1">
                                <ShieldAlert className="w-4 h-4 text-rose-400" />
                                <span className="text-[9px] font-black text-rose-400 uppercase">SOS</span>
                            </button>
                            <button className="flex flex-col items-center justify-center bg-white/5 py-3 rounded-2xl interactive-tap gap-1">
                                <Share2 className="w-4 h-4 text-slate-300" />
                                <span className="text-[9px] font-black text-slate-400 uppercase">Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
