import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Star, AlertTriangle, MessageCircle, MapPin, CheckCircle2, X, Radio, Clock, Navigation, Wifi, Navigation2, Phone, MessageSquare } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Simulated peer locations near NDLS / India Gate area Delhi
const peerLocations = {
    1: { lat: 28.6141, lng: 77.2090, address: 'Near Connaught Place Metro', moving: 'Heading to Metro' },
    2: { lat: 28.6280, lng: 77.2180, address: 'Near New Delhi Rly Station', moving: 'Walking to Bus Stand' },
};

export default function SafeCompanion() {
    const [activeTab, setActiveTab] = useState('companions');
    const [connected, setConnected] = useState([]);
    const [pairedPeer, setPairedPeer] = useState(null);
    const [alertSent, setAlertSent] = useState(false);
    const [broadcastSent, setBroadcastSent] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [broadcastForm, setBroadcastForm] = useState({ destination: '', time: '', mode: 'Metro' });
    const [broadcastedIntent, setBroadcastedIntent] = useState(null);
    const [peerDistance, setPeerDistance] = useState(null);

    const [companions] = useState([
        { id: 1, name: 'Anjali Verma', trust: 4.8, type: 'Same Route (Metro)', eta: '2 mins away' },
        { id: 2, name: 'Priya Sharma', trust: 4.6, type: 'Same Time (Bus)', eta: '5 mins away' }
    ]);

    const [displayCompanions, setDisplayCompanions] = useState(companions);

    const [alerts, setAlerts] = useState([
        { id: 1, type: 'Poor Lighting', location: 'Gate 3, NDLS', time: '10 mins ago', verifies: 12 },
        { id: 2, type: 'Crowd Surge', location: 'Platform 2', time: 'Just now', verifies: 4 }
    ]);

    // Simulate live distance update for paired peer
    useEffect(() => {
        if (!pairedPeer) return;
        const distances = ['350m', '290m', '230m', '180m', '120m'];
        let i = 0;
        setPeerDistance(distances[0]);
        const interval = setInterval(() => {
            i = (i + 1) % distances.length;
            setPeerDistance(distances[i]);
        }, 3000);
        return () => clearInterval(interval);
    }, [pairedPeer]);

    const handleConnect = (comp) => {
        setConnected(prev => [...prev, comp.id]);
        setPairedPeer(comp);
    };

    const handleFinalReport = (type) => {
        const newAlert = { id: Date.now(), type, location: 'Current Location', time: 'Just now', verifies: 1 };
        setAlerts([newAlert, ...alerts]);
        setAlertSent(true);
        setShowReportModal(false);
        setTimeout(() => setAlertSent(false), 3000);
    };

    const handleBroadcast = () => {
        if (!broadcastForm.destination.trim()) return;
        const selfEntry = {
            id: Date.now(),
            name: 'You',
            trust: 5.0,
            type: `${broadcastForm.mode} → ${broadcastForm.destination}`,
            eta: broadcastForm.time ? `Departing at ${broadcastForm.time}` : 'Departing soon',
            isSelf: true
        };
        setDisplayCompanions(prev => [selfEntry, ...prev.filter(c => !c.isSelf)]);
        setBroadcastedIntent(selfEntry);
        setShowBroadcastModal(false);
        setBroadcastSent(true);
        setTimeout(() => setBroadcastSent(false), 4000);
    };

    const peerLoc = pairedPeer ? peerLocations[pairedPeer.id] : null;

    return (
        <div className="pb-20 animate-slide-up bg-slate-100 min-h-full">

            {/* Paired Peer Location View */}
            {pairedPeer && peerLoc && (
                <div className="animate-fade-in">
                    <div className="bg-slate-900 text-white px-5 pt-5 pb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg">
                                {pairedPeer.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-black text-white text-sm">{pairedPeer.name}</p>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Location Shared</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 rounded-full">
                                <p className="text-[11px] font-black text-emerald-400 flex items-center gap-1">
                                    <Navigation2 size={10} className="animate-pulse" /> {peerDistance || '350m'} away
                                </p>
                            </div>
                            <button onClick={() => { setPairedPeer(null); setConnected([]); }} className="bg-white/10 p-2 rounded-full">
                                <X size={16} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="h-56 w-full relative">
                        <MapContainer
                            center={[peerLoc.lat, peerLoc.lng]}
                            zoom={15}
                            zoomControl={false}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[peerLoc.lat, peerLoc.lng]}>
                                <Popup>{pairedPeer.name}</Popup>
                            </Marker>
                            <Circle
                                center={[peerLoc.lat, peerLoc.lng]}
                                radius={80}
                                pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.15 }}
                            />
                            {/* You (slightly offset) */}
                            <Marker position={[peerLoc.lat - 0.003, peerLoc.lng + 0.002]}>
                                <Popup>You</Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {/* Peer Status Bar */}
                    <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100">
                                <MapPin size={16} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-800">{peerLoc.address}</p>
                                <p className="text-[10px] font-bold text-slate-500">{peerLoc.moving}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-slate-100 p-2.5 rounded-xl text-slate-600">
                                <Phone size={16} />
                            </button>
                            <button className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                                <MessageSquare size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            <Shield className="text-emerald-500 w-7 h-7" /> SafeNetwork
                        </h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 opacity-70">AWS Cloud Verified</p>
                    </div>
                    <div className="flex gap-1 bg-slate-200 p-1.5 rounded-2xl shadow-inner">
                        <button onClick={() => setActiveTab('companions')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'companions' ? 'bg-white text-emerald-600 shadow-md scale-105' : 'text-slate-500'}`}>Peers</button>
                        <button onClick={() => setActiveTab('alerts')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'alerts' ? 'bg-white text-rose-600 shadow-md scale-105' : 'text-slate-500'}`}>Alerts</button>
                    </div>
                </div>

                {activeTab === 'companions' ? (
                    <>
                        {broadcastedIntent && (
                            <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-3xl flex items-center gap-3 animate-fade-in shadow-sm">
                                <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-md"><Wifi className="w-5 h-5 text-white" /></div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">LIVE BROADCAST ACTIVE</p>
                                    <p className="text-sm font-bold text-slate-700">{broadcastedIntent.type}</p>
                                </div>
                                <button onClick={() => { setBroadcastedIntent(null); setDisplayCompanions(companions); }} className="bg-emerald-100 p-1.5 rounded-full text-emerald-600"><X size={14} /></button>
                            </div>
                        )}

                        <div className="space-y-4">
                            {displayCompanions.map((comp) => (
                                <div key={comp.id} className={`bg-white p-5 rounded-[2rem] border shadow-xl flex flex-col gap-4 transition-all hover:scale-[1.02] relative overflow-hidden ${connected.includes(comp.id) ? 'border-emerald-300 ring-2 ring-emerald-100' : comp.isSelf ? 'border-emerald-300' : 'border-emerald-100'}`}>
                                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-50 ${comp.isSelf || connected.includes(comp.id) ? 'bg-gradient-to-bl from-emerald-100 to-transparent' : 'bg-gradient-to-bl from-emerald-50 to-transparent'}`}></div>

                                    {comp.isSelf && (
                                        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                            <Radio size={9} className="animate-pulse" /> Broadcasting
                                        </div>
                                    )}
                                    {connected.includes(comp.id) && !comp.isSelf && (
                                        <div className="absolute top-3 left-3 bg-blue-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                            <Navigation2 size={9} className="animate-pulse" /> Location Shared
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between relative z-10" style={{ marginTop: (comp.isSelf || connected.includes(comp.id)) && !comp.isSelf === false ? '1.5rem' : connected.includes(comp.id) ? '1.5rem' : 0 }}>
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black border-2 border-white shadow-lg ${comp.isSelf ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' : connected.includes(comp.id) ? 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700' : 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700'}`}>
                                                    {comp.name.charAt(0)}
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg border border-emerald-50">
                                                    <Shield size={14} className="text-emerald-500 fill-emerald-500" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-800 text-lg">{comp.name}</h3>
                                                <div className="flex items-center gap-2 text-xs mt-0.5">
                                                    <span className="flex items-center text-amber-600 font-black bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                                        Trust {comp.trust} <Star size={12} className="ml-1 fill-current" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{comp.eta}</p>
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full ml-auto mt-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50 relative z-10">
                                        <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                                            <MapPin size={14} className="text-emerald-500" /> {comp.type}
                                        </span>
                                        {comp.isSelf ? (
                                            <span className="px-5 py-2.5 bg-emerald-50 text-emerald-700 font-black text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                                                <Wifi size={14} className="animate-pulse" /> Live
                                            </span>
                                        ) : connected.includes(comp.id) ? (
                                            <button
                                                onClick={() => setPairedPeer(comp)}
                                                className="px-5 py-2.5 bg-blue-600 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/20 interactive-tap"
                                            >
                                                <MapPin size={14} /> View Location
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleConnect(comp)}
                                                className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-black text-xs rounded-xl transition-all interactive-tap shadow-lg"
                                            >
                                                Request Pair
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowBroadcastModal(true)}
                            className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-[1.02] text-white font-black py-5 rounded-3xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition-all interactive-tap"
                        >
                            <UserPlus size={20} /> Broadcast Travel Intent
                        </button>
                    </>
                ) : (
                    <div className="space-y-4 animate-fade-in pb-10">
                        <div className="bg-rose-50 p-6 rounded-[2.5rem] border-2 border-rose-100 relative overflow-hidden shadow-xl">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-rose-200/30 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <h3 className="text-rose-900 font-black text-lg mb-2 flex items-center gap-2 relative z-10">
                                <AlertTriangle className="w-6 h-6 text-rose-500" /> Community Alerts
                            </h3>
                            <p className="text-rose-700/70 text-xs mb-6 font-bold leading-relaxed relative z-10">Real-time reports from travelers. Your safety is powered by the community.</p>
                            <div className="space-y-3 relative z-10">
                                {alerts.map((alert) => (
                                    <div key={alert.id} className="bg-white/80 p-4 rounded-2xl shadow-sm border border-rose-100/50 flex items-start justify-between">
                                        <div className="flex gap-3">
                                            <div className="bg-rose-100 p-2.5 rounded-xl h-fit"><AlertTriangle size={16} className="text-rose-600" /></div>
                                            <div>
                                                <p className="font-black text-slate-800 text-[15px]">{alert.type}</p>
                                                <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-1"><MapPin size={12} className="text-rose-400" /> {alert.location}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-black uppercase">{alert.time}</p>
                                            <p className="text-[10px] text-rose-600 font-black mt-2 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 inline-block">{alert.verifies} verifies</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => setShowReportModal(true)} className="w-full bg-rose-600 text-white font-black py-5 rounded-3xl shadow-xl flex items-center justify-center gap-3 interactive-tap hover:scale-[1.02]">
                            <MessageCircle size={22} /> Report Incident (Live)
                        </button>
                    </div>
                )}
            </div>

            {/* Broadcast Modal */}
            {showBroadcastModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-end animate-fade-in">
                    <div className="w-full bg-white rounded-t-[3rem] p-8 pb-12 animate-slide-up border-t-4 border-emerald-500">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800">Broadcast Trip</h3>
                                <p className="text-xs text-slate-500 font-bold mt-1">Share your travel intent with nearby peers</p>
                            </div>
                            <button onClick={() => setShowBroadcastModal(false)} className="bg-slate-100 p-2 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1.5">Destination *</label>
                                <input type="text" value={broadcastForm.destination} onChange={e => setBroadcastForm(p => ({ ...p, destination: e.target.value }))} placeholder="e.g. India Gate, Lajpat Nagar..." className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-400" />
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1.5">Departure Time (optional)</label>
                                <input type="time" value={broadcastForm.time} onChange={e => setBroadcastForm(p => ({ ...p, time: e.target.value }))} className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-emerald-400" />
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1.5">Transit Mode</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Metro', 'Bus', 'Auto'].map(m => (
                                        <button key={m} onClick={() => setBroadcastForm(p => ({ ...p, mode: m }))} className={`py-2.5 rounded-xl text-sm font-black border-2 transition-all ${broadcastForm.mode === m ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}>{m}</button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleBroadcast} disabled={!broadcastForm.destination.trim()} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg mt-2">
                                <Radio size={18} /> Broadcast Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-end animate-fade-in">
                    <div className="w-full bg-white rounded-t-[3rem] p-8 pb-12 animate-slide-up border-t-4 border-rose-500">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-800">What's the issue?</h3>
                            <button onClick={() => setShowReportModal(false)} className="bg-slate-100 p-2 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {['Poor Lighting', 'Crowd Surge', 'Harassment', 'Unsafe Zone', 'Suspicious', 'Delay'].map(type => (
                                <button key={type} onClick={() => handleFinalReport(type)} className="p-4 bg-slate-50 hover:bg-rose-50 border-2 border-slate-100 hover:border-rose-200 rounded-2xl text-left transition-all group">
                                    <p className="font-black text-slate-700 group-hover:text-rose-700">{type}</p>
                                    <div className="mt-2 w-6 h-1 bg-slate-200 group-hover:bg-rose-400 rounded-full transition-all"></div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {broadcastSent && (
                <div className="fixed top-8 left-4 right-4 z-[3000] animate-bounce-in">
                    <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400">
                        <div className="bg-white/20 p-2 rounded-xl"><Radio size={20} className="animate-pulse" /></div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-widest">Intent Broadcasted!</p>
                            <p className="text-xs font-bold text-emerald-100">Nearby peers notified via SafeNetwork</p>
                        </div>
                    </div>
                </div>
            )}

            {alertSent && (
                <div className="fixed top-8 left-4 right-4 z-[3000] animate-bounce-in">
                    <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400">
                        <CheckCircle2 size={24} />
                        <div>
                            <p className="font-black text-sm uppercase tracking-widest">Alert Dispatched</p>
                            <p className="text-xs font-bold text-emerald-100">Nearby travelers notified via AWS Pub/Sub</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
