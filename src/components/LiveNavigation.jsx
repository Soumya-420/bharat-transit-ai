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

    const polylineCoords = useMemo(() => {
        const geojson = apiResult?.route_geojson || route?.route_geojson;
        if (!geojson) return [];
        return geojson.map(coord => [coord[1], coord[0]]);
    }, [apiResult, route]);

    const getDynamicAIExplanation = () => {
        if (!route) return {
            en: "This is the optimal option based on real-time data, avoiding major traffic.",
            hi: "यह रियल-टाइम डेटा के आधार पर सबसे इष्टतम मार्ग है, जो मुख्य ट्रैफ़िक से बचाता है।"
        };

        const isFastest = route.type?.toLowerCase().includes('fastest');
        const modes = route.modes?.map(m => m.label).join(' and ') || 'Transit';
        const hasMetro = route.modes?.some(m => m.label.toLowerCase() === 'metro');
        const hasBus = route.modes?.some(m => m.label.toLowerCase() === 'bus');

        if (hasMetro && hasBus) {
            return {
                en: `This ${isFastest ? 'is the fastest' : 'is the safest'} option based on real-time data. You'll take the Metro to bypass surface traffic, then connect via Bus to reach your destination smoothly.`,
                hi: `रीयल-टाइम डेटा के आधार पर यह ${isFastest ? 'सबसे तेज़' : 'सबसे सुरक्षित'} विकल्प है। आप बाहरी ट्रैफ़िक से बचने के लिए मेट्रो लेंगे, फिर आसानी से अपनी मंजिल तक पहुँचने के लिए बस से जुड़ेंगे।`
            };
        } else if (hasMetro) {
            return {
                en: `This ${isFastest ? 'is the fastest' : 'is the safest'} option. You'll take the Metro which completely bypasses all surface-level traffic junctions for a highly predictable arrival time.`,
                hi: `यह ${isFastest ? 'सबसे तेज़' : 'सबसे सुरक्षित'} विकल्प है। आप मेट्रो लेंगे जो पूरी तरह से सभी जमीनी स्तर के ट्रैफ़िक जंक्शनों से बचती है जिससे आप समय पर पहुँचेंगे।`
            };
        } else if (hasBus) {
            return {
                en: `This ${isFastest ? 'is the fastest' : 'is the safest'} option based on live AI tracking. You'll board the Bus which provides a direct ground connection while dynamically avoiding congested choke points.`,
                hi: `लाइव AI ट्रैकिंग के आधार पर यह ${isFastest ? 'सबसे तेज़' : 'सबसे सुरक्षित'} विकल्प है। आप बस पर चढ़ेंगे जो सीधे संपर्क प्रदान करती है और भीड़भाड़ वाले स्थानों से बचाती है।`
            };
        } else {
            return {
                en: `This ${isFastest ? 'is the fastest' : 'is the safest'} option based on real-time data. Your journey via ${modes} avoids major traffic junctions to reach your destination smoothly.`,
                hi: `रीयल-टाइम डेटा के आधार पर यह ${isFastest ? 'सबसे तेज़' : 'सबसे सुरक्षित'} विकल्प है। ${modes} के माध्यम से आपकी यात्रा प्रमुख ट्रैफ़िक जंक्शनों से बचती है।`
            };
        }
    };

    const aiExplanation = getDynamicAIExplanation();

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
        <div className="h-full flex flex-col bg-slate-50 animate-slide-up relative overflow-hidden">
            {/* Sub-Header: Multilingual & Controls */}
            <div className="shrink-0 bg-white px-4 py-3 shadow-md z-[1001] flex items-center justify-between border-b border-slate-100">
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
                </div>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto relative z-0 pb-24 scroll-smooth">
                {/* Map Area - Sticky at top */}
                <div className="h-[55vh] w-full sticky top-0 z-0">
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

                    {/* Festival Alert Overlay - top of map */}
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

                {/* Content Below Map (Scrolls over map) */}
                <div className="relative z-10 bg-slate-50 min-h-[60vh] rounded-t-[2.5rem] mt-[-2rem] pt-6 px-4 shadow-[0_-15px_40px_rgba(0,0,0,0.12)]">
                    {/* Visual drag handle */}
                    <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-6"></div>

                    {/* Dark Navigation Card */}
                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 shadow-2xl mb-8 border border-slate-800">
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

                                {/* AI Explanation Box */}
                                <div className="mt-5 bg-primary-950/60 border border-primary-500/30 rounded-2xl p-4 flex gap-3 items-start shadow-inner">
                                    <div className="bg-primary-500/20 p-2 rounded-xl border border-primary-500/40">
                                        <span className="text-xl leading-none">✨</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                            {lang === 'EN' ? 'AI Route Analysis' : 'AI रूट विश्लेषण'}
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse"></span>
                                        </p>
                                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                            {lang === 'EN' ? aiExplanation.en : aiExplanation.hi}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Journey Flow List */}
                    <div className="px-2">
                        <div className="flex justify-between items-center mb-5">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Journey Flow</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Detailed Path Breakdown</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {detailedSteps.map((step, i) => (
                                <div key={i} className="flex gap-4 items-start p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                    <div className="bg-slate-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 shrink-0">
                                        {getStepIcon(step.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1 gap-2">
                                            <p className="font-black text-slate-800 text-[15px] leading-tight flex-1">{step.instruction}</p>
                                            <span className={`shrink-0 text-[8px] font-black px-2 py-0.5 rounded-full uppercase border ${step.pathType === 'Walking Path' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                {step.pathType}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step.distance}</p>
                                    </div>
                                </div>
                            ))}
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
