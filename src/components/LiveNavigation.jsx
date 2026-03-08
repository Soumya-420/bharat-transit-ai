import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
    Mic, MicOff, ShieldAlert, Share2, Navigation, MapPin,
    ArrowRight, Train, Bus, CarTaxiFront, Bike, Globe,
    Clock, IndianRupee, ShieldCheck, X, Phone, Radio,
    Users, Link2, Send, CheckCircle2, AlertTriangle, Volume2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function stepBadge(text) {
    if (!text) return 'bg-slate-50 text-slate-500 border-slate-100';
    const t = text.toLowerCase();
    if (t.includes('metro') || t.includes('🚇')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (t.includes('bus') || t.includes('🚍')) return 'bg-green-50 text-green-600 border-green-100';
    if (t.includes('auto') || t.includes('🛺')) return 'bg-amber-50 text-amber-600 border-amber-100';
    if (t.includes('cycle') || t.includes('🚲')) return 'bg-violet-50 text-violet-600 border-violet-100';
    return 'bg-slate-50 text-slate-500 border-slate-100';
}

function stepType(text) {
    if (!text) return 'Transit';
    const t = text.toLowerCase();
    if (t.includes('metro')) return 'Metro Rail';
    if (t.includes('bus')) return 'DTC Bus';
    if (t.includes('auto')) return 'Auto';
    if (t.includes('cycle')) return 'Cycle Share';
    if (t.includes('walk')) return 'Walking';
    return 'Transit';
}

// ── SOS Modal ────────────────────────────────────────────────────────────────
function SOSModal({ onClose, routeColor }) {
    const [phase, setPhase] = useState('options'); // 'options' | 'calling' | 'done'
    const [timer, setTimer] = useState(5);
    const timerRef = useRef(null);

    const startCall = () => {
        setPhase('calling');
        setTimer(5);
        timerRef.current = setInterval(() => {
            setTimer(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    setPhase('done');
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    };

    useEffect(() => () => clearInterval(timerRef.current), []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-sm bg-white rounded-t-[2.5rem] p-6 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>

                {/* Handle */}
                <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5"></div>

                {phase === 'options' && (<>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-red-100 p-3 rounded-2xl">
                            <ShieldAlert className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-lg">SOS Emergency</h3>
                            <p className="text-xs text-slate-500 font-medium">Choose an emergency action</p>
                        </div>
                    </div>

                    {/* Type selector prompt */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 mb-3 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-slate-500 shrink-0" />
                        <p className="text-xs font-black text-slate-600">What type of SOS do you need?</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { icon: '🚔', bg: 'bg-blue-50 border-blue-200', label: 'Call Police', sub: 'Dial 100', action: startCall },
                            { icon: '🚑', bg: 'bg-red-50 border-red-200', label: 'Call Ambulance', sub: 'Dial 108', action: startCall },
                            { icon: '🚒', bg: 'bg-orange-50 border-orange-200', label: 'Fire Brigade', sub: 'Dial 101', action: startCall },
                            { icon: '👩', bg: 'bg-pink-50 border-pink-200', label: 'Women Helpline', sub: 'Dial 1091', action: startCall },
                            { icon: '🚦', bg: 'bg-amber-50 border-amber-200', label: 'Traffic Police', sub: 'Dial 103', action: startCall },
                            { icon: '📞', bg: 'bg-emerald-50 border-emerald-200', label: 'Trusted Contact', sub: 'Riya Sharma', action: startCall },
                            { icon: '📍', bg: 'bg-indigo-50 border-indigo-200', label: 'Share Location', sub: 'GPS Broadcast', action: startCall },
                            { icon: '🛡️', bg: 'bg-slate-100 border-slate-300', label: 'SafeNet Alert', sub: '3 nearby', action: startCall },
                        ].map((opt, i) => (
                            <button
                                key={i}
                                onClick={opt.action}
                                className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${opt.bg}`}
                            >
                                <div className="bg-white w-10 h-10 rounded-xl shadow-sm flex items-center justify-center text-xl shrink-0">{opt.icon}</div>
                                <div>
                                    <p className="font-black text-slate-800 text-xs leading-tight">{opt.label}</p>
                                    <p className="text-[9px] text-slate-500 font-bold mt-0.5">{opt.sub}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button onClick={onClose} className="mt-4 w-full py-3 text-slate-500 font-bold text-sm">Cancel</button>
                </>)}

                {phase === 'calling' && (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Phone className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="font-black text-slate-900 text-xl mb-1">Contacting Help…</h3>
                        <p className="text-slate-500 font-medium text-sm mb-4">Connecting in {timer}s…</p>
                        <div className="flex gap-2 w-full max-w-xs mx-auto">
                            {[1, 2, 3, 4, 5].map(n => (
                                <div key={n} className={`flex-1 h-2 rounded-full transition-all duration-500 ${n > timer ? 'bg-red-500' : 'bg-slate-100'}`}></div>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Sharing live GPS location</p>
                    </div>
                )}

                {phase === 'done' && (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="font-black text-slate-900 text-xl mb-1">Help Notified ✓</h3>
                        <p className="text-slate-500 font-medium text-sm mb-4">Emergency contact & nearest patrol alerted. Your live location is being shared.</p>
                        <button onClick={onClose} className="bg-emerald-600 text-white font-black px-8 py-3 rounded-2xl">Done</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Share Modal ───────────────────────────────────────────────────────────────
function ShareModal({ onClose, route }) {
    const [copied, setCopied] = useState(false);
    const [sent, setSent] = useState(false);

    const fakeLink = 'bharattransit.app/trip/live?id=BTA-2026-' + Math.floor(Math.random() * 9000 + 1000);

    return (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-sm bg-white rounded-t-[2.5rem] p-6 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5"></div>

                <div className="flex items-center gap-3 mb-5">
                    <div className="bg-primary-100 p-3 rounded-2xl">
                        <Share2 className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 text-lg">Share Trip</h3>
                        <p className="text-xs text-slate-500 font-medium">{route?.type || 'Current Route'} · Live</p>
                    </div>
                </div>

                {/* Live link row */}
                <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3 border border-slate-100 mb-4">
                    <Link2 size={16} className="text-slate-400 shrink-0" />
                    <p className="text-[11px] font-bold text-slate-600 flex-1 truncate">{fakeLink}</p>
                    <button
                        onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                        className="text-[10px] font-black px-3 py-1 rounded-xl transition-all"
                        style={{ background: copied ? '#dcfce7' : '#eff6ff', color: copied ? '#16a34a' : '#2563eb' }}
                    >
                        {copied ? '✓ Copied' : 'Copy'}
                    </button>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {[
                        {
                            icon: <Link2 size={18} className="text-primary-600" />, bg: 'bg-primary-50 border-primary-200',
                            label: 'Share Route Link', sub: 'Anyone with this link can view your route', tag: 'Web Link'
                        },
                        {
                            icon: <Radio size={18} className="text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-200',
                            label: 'Send Live Trip Status', sub: 'Contacts see your real-time position', tag: 'Live GPS'
                        },
                        {
                            icon: <Send size={18} className="text-purple-600" />, bg: 'bg-purple-50 border-purple-200',
                            label: 'Share ETA', sub: `Arriving in ${route?.time || '~35 min'} via ${route?.type || 'transit'}`, tag: 'ETA SMS'
                        },
                    ].map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => { setSent(true); setTimeout(() => setSent(false), 2000); }}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.01] ${opt.bg}`}
                        >
                            <div className="bg-white p-2.5 rounded-xl shadow-sm">{opt.icon}</div>
                            <div className="flex-1">
                                <p className="font-black text-slate-800 text-sm">{opt.label}</p>
                                <p className="text-[10px] text-slate-500 font-medium">{opt.sub}</p>
                            </div>
                            <span className="text-[9px] font-black bg-white/80 px-2 py-0.5 rounded-full border border-current opacity-60">{opt.tag}</span>
                        </button>
                    ))}
                </div>

                {sent && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center gap-2 animate-fade-in">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <p className="text-xs font-black text-emerald-700">Sent! Recipient will receive your trip details.</p>
                    </div>
                )}

                <button onClick={onClose} className="mt-4 w-full py-3 text-slate-500 font-bold text-sm">Done</button>
            </div>
        </div>
    );
}

// ── Voice Guidance Hook ───────────────────────────────────────────────────────
function useVoiceGuidance() {
    const [isActive, setIsActive] = useState(false);
    const [speaking, setSpeaking] = useState(false);

    const speak = (text) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        utterance.rate = 0.92;
        utterance.pitch = 1;
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const toggle = (stepText) => {
        if (isActive) {
            window.speechSynthesis?.cancel();
            setIsActive(false);
            setSpeaking(false);
        } else {
            setIsActive(true);
            // Strip emojis for cleaner TTS
            const clean = stepText?.replace(/[\u{1F000}-\u{1FFFF}]/gu, '').replace(/[🚶🚇🚍🛺🚲🛣️]/gu, '').trim();
            speak(clean || 'Proceeding to next step.');
        }
    };

    return { isActive, speaking, toggle, speak };
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LiveNavigation({ route, apiResult, festivalMode }) {
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [showSOS, setShowSOS] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const { isActive: voiceActive, speaking, toggle: toggleVoice, speak } = useVoiceGuidance();

    // Route metadata
    const routeType = route?.type || 'Route';
    const routeEmoji = route?.emoji || '🗺️';
    const routeColor = route?.color || '#0ea5e9';
    const bgGradient = route?.bgGradient || 'from-sky-600 to-blue-600';
    const routeTime = route?.time || '--';
    const routeCost = route?.cost || '₹--';
    const routeSafety = route?.safety || '--';
    const aiReason = route?.reason || route?.aiReason || 'Optimised via real-time AI traffic & safety data.';
    const modes = route?.modes || [];

    const steps = route?.detailed_steps || route?.steps || [
        { icon: '🚶', text: 'Walk to boarding point' },
        { icon: '🚇', text: 'Board transit vehicle' },
        { icon: '🚶', text: 'Walk to destination' },
    ];

    const mapCoords = useMemo(() => {
        if (route?.mapRoute) return route.mapRoute;
        const geojson = apiResult?.route_geojson || route?.route_geojson;
        if (geojson) return geojson.map(c => [c[1], c[0]]);
        return [[28.6419, 77.2194], [28.6320, 77.2180], [28.6200, 77.2120], [28.6140, 77.2090]];
    }, [route, apiResult]);

    const startCoord = mapCoords[0];
    const endCoord = mapCoords[mapCoords.length - 1];
    const mapCenter = mapCoords[Math.floor(mapCoords.length / 2)];
    const currentStep = steps[currentStepIdx];

    // Auto-announce step when voice is active and step changes
    useEffect(() => {
        if (voiceActive && currentStep?.text) {
            const clean = currentStep.text.replace(/[\u{1F000}-\u{1FFFF}]/gu, '').replace(/[🚶🚇🚍🛺🚲🛣️]/gu, '').trim();
            speak(clean);
        }
    }, [currentStepIdx, voiceActive]);

    return (
        <div className="h-full flex flex-col bg-slate-50 animate-slide-up relative overflow-hidden">

            {/* ── Mode-aware header (NO language button) ── */}
            <div className={`shrink-0 bg-gradient-to-r ${bgGradient} px-4 pt-4 pb-5 z-[1001] shadow-lg`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-2xl">
                            <span className="text-xl leading-none">{routeEmoji}</span>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-white/70 uppercase tracking-widest">Live Navigation</p>
                            <p className="font-black text-white text-base leading-tight">{routeType}</p>
                        </div>
                    </div>

                    {/* Voice active badge replaces clutter */}
                    {voiceActive && (
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full animate-pulse">
                            <Volume2 size={12} className="text-white" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Voice On</span>
                        </div>
                    )}
                </div>

                {/* Metric strip */}
                <div className="flex gap-2">
                    {[
                        { icon: <Clock size={11} />, val: routeTime },
                        { icon: <IndianRupee size={11} />, val: routeCost },
                        { icon: <ShieldCheck size={11} />, val: `${routeSafety}% safe` },
                    ].map((m, i) => (
                        <div key={i} className="flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
                            <span className="text-white/80">{m.icon}</span>
                            <span className="text-[10px] font-black text-white">{m.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto relative z-0 pb-24">

                {/* Map */}
                <div className="h-52 w-full relative">
                    <MapContainer center={mapCenter} zoom={14} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Polyline positions={mapCoords} pathOptions={{ color: routeColor, weight: 6, opacity: 0.95 }} />
                        <Marker position={startCoord}><></></Marker>
                        <Marker position={endCoord}><></></Marker>
                    </MapContainer>

                    {festivalMode && (
                        <div className="absolute top-3 left-3 right-3 z-[1000] animate-bounce-in">
                            <div className="bg-orange-600/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-orange-400/50">
                                <span className="text-xl animate-pulse">🕉️</span>
                                <p className="text-xs font-bold leading-snug">{apiResult?.festival_reason || 'Event detected — re-routed via safe corridor.'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom sheet */}
                <div className="relative z-10 bg-slate-50 rounded-t-[2.5rem] mt-[-1.5rem] pt-5 px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.10)]">
                    <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-5"></div>

                    {/* ── Current Step Card (dark) ── */}
                    <div className="bg-slate-900 text-white rounded-3xl p-5 mb-5 shadow-xl border border-slate-800">
                        <div className="flex gap-4">
                            <div className="p-3 rounded-2xl h-fit border border-white/20" style={{ background: routeColor + '28' }}>
                                <span className="text-2xl leading-none">{currentStep?.icon || '🗺️'}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: routeColor }}>
                                    Step {currentStepIdx + 1} of {steps.length}
                                </p>
                                <p className="font-bold text-base leading-snug mb-4">{currentStep?.text}</p>

                                {/* Prev / Next */}
                                <div className="flex gap-2 mb-4">
                                    <button
                                        disabled={currentStepIdx === 0}
                                        onClick={() => setCurrentStepIdx(i => i - 1)}
                                        className="flex-1 py-2 rounded-xl text-xs font-black border border-white/20 disabled:opacity-30 hover:bg-white/10 transition-all"
                                    >← Prev</button>
                                    <button
                                        disabled={currentStepIdx === steps.length - 1}
                                        onClick={() => setCurrentStepIdx(i => i + 1)}
                                        className="flex-1 py-2 rounded-xl text-xs font-black border border-white/20 disabled:opacity-30 hover:bg-white/10 transition-all"
                                        style={{ background: currentStepIdx < steps.length - 1 ? routeColor + '55' : undefined }}
                                    >Next →</button>
                                </div>

                                {/* ── Action Buttons ── */}
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Voice */}
                                    <button
                                        onClick={() => toggleVoice(currentStep?.text)}
                                        className={`flex flex-col items-center py-3 rounded-xl gap-1.5 border transition-all interactive-tap ${voiceActive
                                            ? 'border-yellow-400/60 bg-yellow-400/20'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        {voiceActive
                                            ? <Volume2 size={16} className="text-yellow-300 animate-pulse" />
                                            : <Mic size={16} className="text-slate-300" />}
                                        <span className={`text-[9px] font-black uppercase ${voiceActive ? 'text-yellow-300' : 'text-slate-400'}`}>
                                            {voiceActive ? 'Voice On' : 'Voice'}
                                        </span>
                                    </button>

                                    {/* SOS */}
                                    <button
                                        onClick={() => setShowSOS(true)}
                                        className="flex flex-col items-center py-3 bg-rose-500/20 border border-rose-500/40 rounded-xl gap-1.5 interactive-tap hover:bg-rose-500/30 transition-all"
                                    >
                                        <ShieldAlert size={16} className="text-rose-400" />
                                        <span className="text-[9px] font-black text-rose-400 uppercase">SOS</span>
                                    </button>

                                    {/* Share */}
                                    <button
                                        onClick={() => setShowShare(true)}
                                        className="flex flex-col items-center py-3 bg-white/5 border border-white/10 rounded-xl gap-1.5 interactive-tap hover:bg-white/10 transition-all"
                                    >
                                        <Share2 size={16} className="text-slate-300" />
                                        <span className="text-[9px] font-black text-slate-400 uppercase">Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Speaking indicator */}
                        {speaking && (
                            <div className="mt-3 bg-yellow-400/15 border border-yellow-400/30 rounded-2xl px-3 py-2 flex items-center gap-2 animate-pulse">
                                <Volume2 size={12} className="text-yellow-300" />
                                <p className="text-[10px] font-black text-yellow-300 uppercase tracking-widest">Reading step aloud…</p>
                            </div>
                        )}

                        {/* AI Reason */}
                        <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-2.5">
                            <span className="text-base">✨</span>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: routeColor }}>
                                    AI Route Analysis
                                </p>
                                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{aiReason}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Mode Chain ── */}
                    {modes.length > 0 && (
                        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm mb-5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Route Mode Chain</p>
                            <div className="flex items-center gap-1">
                                {modes.map((mode, idx) => (
                                    <React.Fragment key={idx}>
                                        <div className="flex flex-col items-center gap-1 flex-1">
                                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center border-2"
                                                style={{ background: (mode.color || routeColor) + '20', color: mode.color || routeColor, borderColor: (mode.color || routeColor) + '40' }}>
                                                {mode.icon}
                                            </div>
                                            <p className="text-[9px] font-black text-slate-600 text-center">{mode.label}</p>
                                            <p className="text-[8px] text-slate-400 font-bold">{mode.duration}</p>
                                        </div>
                                        {idx < modes.length - 1 && <span className="text-slate-300 text-xs shrink-0">›</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Journey Flow ── */}
                    <div className="mb-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Journey Flow</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{routeType} · {steps.length} steps</p>
                            </div>
                            <span className="text-2xl">{routeEmoji}</span>
                        </div>

                        <div className="space-y-2 relative">
                            <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-slate-100 z-0"></div>
                            {steps.map((step, i) => {
                                const isActive = i === currentStepIdx;
                                const isDone = i < currentStepIdx;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setCurrentStepIdx(i);
                                            if (voiceActive) {
                                                const clean = step.text.replace(/[\u{1F000}-\u{1FFFF}]/gu, '').replace(/[🚶🚇🚍🛺🚲🛣️]/gu, '').trim();
                                                // speak triggered by useEffect
                                            }
                                        }}
                                        className={`w-full flex gap-3 items-start p-4 rounded-3xl border text-left transition-all relative z-10 ${isActive ? 'border-2 shadow-lg scale-[1.01]'
                                            : isDone ? 'bg-slate-50/50 border-slate-50 opacity-60'
                                                : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'
                                            }`}
                                        style={isActive ? { borderColor: routeColor, background: routeColor + '08', boxShadow: `0 4px 16px ${routeColor}20` } : {}}
                                    >
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                                            style={{ background: isActive ? routeColor : isDone ? '#94a3b8' : '#f1f5f9' }}>
                                            <span className="text-base leading-none">{step.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-black text-sm leading-snug ${isActive ? 'text-slate-900' : isDone ? 'text-slate-400' : 'text-slate-700'}`}>
                                                {step.text}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${stepBadge(step.text)}`}>{stepType(step.text)}</span>
                                                {isActive && <span className="text-[9px] font-black px-2 py-0.5 rounded-full border animate-pulse" style={{ background: routeColor + '20', borderColor: routeColor + '40', color: routeColor }}>▶ Active</span>}
                                                {isDone && <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">✓ Done</span>}
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-slate-400 shrink-0 mt-0.5">{i + 1}/{steps.length}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Live tips */}
                    <div className="bg-slate-800 rounded-3xl p-4 text-white mb-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">💡 Live Tips</p>
                        <ul className="space-y-1.5 text-[11px] text-slate-300 font-medium">
                            {route?.id === 1 && <><li>• Metro Blue Line: Next train in ~4 min</li><li>• Exit Gate 3 at Udyog Bhawan</li><li>• Rajpath walk is well-lit & CCTV monitored</li></>}
                            {route?.id === 2 && <><li>• DTC Bus 620: Bay 3 — ~8 min wait</li><li>• Rajpath corridor: police patrol every 15 min</li><li>• CCTV cover 100% on this route</li></>}
                            {route?.id === 3 && <><li>• Negotiate ₹8 flat rate for shared auto</li><li>• Board ₹10 DTC e-Bus at CP Outer Circle</li><li>• Carry exact change — contactless unavailable</li></>}
                            {route?.id === 4 && <><li>• Cycle Share Dock 4 has 6 bikes available</li><li>• Helmet included · Rajpath is cycle-friendly</li><li>• CO₂ saved: 0.1 kg 🌿 — lowest of all routes</li></>}
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            {showSOS && <SOSModal onClose={() => setShowSOS(false)} routeColor={routeColor} />}
            {showShare && <ShareModal onClose={() => setShowShare(false)} route={route} />}
        </div>
    );
}
