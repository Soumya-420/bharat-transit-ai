import React, { useMemo, useState } from 'react';
import { Mic, ShieldAlert, Share2, Compass, ArrowRight, Train, Navigation, BellRing, MapPin, List, Globe, MoveUpLeft, MoveUpRight, ArrowBigRight } from 'lucide-react';
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

export default function LiveNavigation({ route, apiResult, festivalMode }) {
    const [lang, setLang] = useState('EN');
    const [showSteps, setShowSteps] = useState(false);

    const polylineCoords = useMemo(() => {
        const geojson = apiResult?.route_geojson || route?.route_geojson;
        if (!geojson) return [];
        return geojson.map(coord => [coord[1], coord[0]]);
    }, [apiResult, route]);

    const startCoords = polylineCoords.length > 0 ? polylineCoords[0] : [28.6141, 77.2185];
    const endCoords = polylineCoords.length > 0 ? polylineCoords[polylineCoords.length - 1] : [28.6139, 77.2090];

    const detailedSteps = apiResult?.detailed_steps || route?.detailed_steps || [
        { type: 'walk', instruction: "Walk 200m to Exit 3", distance: "200m", pathType: "Walking Path" },
        { type: 'transit', instruction: "Board metro towards destination", distance: "Board", pathType: "Driving Road" }
    ];

    const getStepIcon = (type) => {
        switch (type) {
            case 'walk': return <PersonStanding size={18} />;
            case 'turn': return <MoveUpRight size={18} />;
            case 'transit': return <Train size={18} />;
            case 'arrive': return <MapPin size={18} />;
            default: return <ArrowBigRight size={18} />;
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 animate-slide-up pb-20 relative overflow-hidden">

            {/* Sub-Header: Multilingual & Controls */}
            <div className="bg-white px-4 py-3 shadow-md z-[1001] flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="bg-slate-100 p-2 rounded-lg">
                        <Navigation className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Tracking</p>
                        <p className="text-xs font-bold text-slate-800 uppercase tracking-tighter">Turn-by-Turn</p>
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
                {festivalMode && (
                    <div className="absolute top-4 left-4 right-4 z-[1000] animate-bounce-in">
                        <div className="bg-orange-600/95 backdrop-blur-md text-white px-4 py-4 rounded-3xl shadow-xl flex items-center gap-3 border border-orange-400/50">
                            <div className="bg-white/20 p-2.5 rounded-2xl animate-pulse text-xl">🕉️</div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-0.5">AI Festival Smart-Routing</p>
                                <p className="text-xs font-bold leading-snug">{apiResult?.festival_reason || "Event detected in your path."}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Step List Drawer */}
            {showSteps && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/98 backdrop-blur-md z-[1005] animate-fade-in p-6 pt-20 overflow-y-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">Journey Flow</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Detailed Path Breakdown</p>
                        </div>
                        <button onClick={() => setShowSteps(false)} className="bg-slate-100 p-2 rounded-full text-slate-600 hover:bg-slate-200 interactive-tap">
                            <ArrowBigRight className="rotate-90" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {detailedSteps.map((step, i) => (
                            <div key={i} className="flex gap-4 items-start p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="bg-slate-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                                    {getStepIcon(step.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-black text-slate-900 text-[16px] leading-tight flex-1 mr-2">{step.instruction}</p>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${step.pathType === 'Walking Path' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                            {step.pathType}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step.distance}</p>
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
                            {detailedSteps[0]?.instruction}
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

const PersonStanding = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="1" />
        <path d="m9 20 3-6 3 6" />
        <path d="m6 8 6 2 6-2" />
        <path d="M12 10v4" />
    </svg>
);
