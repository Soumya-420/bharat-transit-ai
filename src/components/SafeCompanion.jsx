import React, { useState } from 'react';
import { Shield, UserPlus, Star, AlertTriangle, MessageCircle, MapPin, CheckCircle2, X } from 'lucide-react';

export default function SafeCompanion() {
    const [activeTab, setActiveTab] = useState('companions');
    const [connected, setConnected] = useState([]);
    const [alertSent, setAlertSent] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const companions = [
        { id: 1, name: 'Anjali Verma', trust: 4.8, type: 'Same Route (Metro)', eta: '2 mins away' },
        { id: 2, name: 'Priya Sharma', trust: 4.6, type: 'Same Time (Bus)', eta: '5 mins away' }
    ];

    const [alerts, setAlerts] = useState([
        { id: 1, type: 'Poor Lighting', location: 'Gate 3, NDLS', time: '10 mins ago', verifies: 12 },
        { id: 2, type: 'Crowd Surge', location: 'Platform 2', time: 'Just now', verifies: 4 }
    ]);

    const handleConnect = (id) => {
        setConnected(prev => [...prev, id]);
    };

    const handleFinalReport = (type) => {
        const newAlert = {
            id: Date.now(),
            type: type,
            location: 'Current Location',
            time: 'Just now',
            verifies: 1
        };
        setAlerts([newAlert, ...alerts]);
        setAlertSent(true);
        setShowReportModal(false);
        setTimeout(() => setAlertSent(false), 3000);
    };

    return (
        <div className="p-4 space-y-6 pb-20 animate-slide-up bg-slate-100 min-h-full">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                        <Shield className="text-emerald-500 w-7 h-7" /> SafeNetwork
                    </h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 opacity-70">AWS Cloud Verified</p>
                </div>
                <div className="flex gap-1 bg-slate-200 p-1.5 rounded-2xl shadow-inner">
                    <button
                        onClick={() => setActiveTab('companions')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'companions' ? 'bg-white text-emerald-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Peers
                    </button>
                    <button
                        onClick={() => setActiveTab('alerts')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'alerts' ? 'bg-white text-rose-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Alerts
                    </button>
                </div>
            </div>

            {activeTab === 'companions' ? (
                <>
                    <div className="space-y-4">
                        {companions.map((comp) => (
                            <div key={comp.id} className="bg-white p-5 rounded-[2rem] border border-emerald-100 shadow-xl flex flex-col gap-4 transition-all hover:scale-[1.02] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full opacity-50"></div>

                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center text-emerald-700 font-black text-xl border-2 border-white shadow-lg">
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
                                    {connected.includes(comp.id) ? (
                                        <button disabled className="px-5 py-2.5 bg-emerald-50/50 text-emerald-600 font-black text-xs rounded-xl flex items-center gap-2 border-2 border-emerald-100/50">
                                            <CheckCircle2 size={16} /> Connected
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleConnect(comp.id)}
                                            className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-black text-xs rounded-xl transition-all interactive-tap shadow-lg shadow-slate-200"
                                        >
                                            Request Pair
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-[1.02] text-white font-black py-5 rounded-3xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition-all interactive-tap border-t border-emerald-400/30">
                        <UserPlus size={20} /> Broadcast Travel Intent
                    </button>
                </>
            ) : (
                <div className="space-y-4 animate-fade-in pb-10">
                    <div className="bg-rose-50 p-6 rounded-[2.5rem] border-2 border-rose-100 relative overflow-hidden shadow-xl shadow-rose-500/5">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-rose-200/30 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <h3 className="text-rose-900 font-black text-lg mb-2 flex items-center gap-2 relative z-10">
                            <AlertTriangle className="w-6 h-6 text-rose-500" />
                            Community Alerts
                        </h3>
                        <p className="text-rose-700/70 text-xs mb-6 font-bold leading-relaxed max-w-[90%] relative z-10">
                            Real-time reports from travelers. Your safety is powered by the community.
                        </p>

                        <div className="space-y-3 relative z-10">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-rose-100/50 flex items-start justify-between group transition-all hover:translate-x-1">
                                    <div className="flex gap-3">
                                        <div className="bg-rose-100 p-2.5 rounded-xl h-fit">
                                            <AlertTriangle size={16} className="text-rose-600" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-[15px]">{alert.type}</p>
                                            <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-1">
                                                <MapPin size={12} className="text-rose-400" /> {alert.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{alert.time}</p>
                                        <p className="text-[10px] text-rose-600 font-black mt-2 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 inline-block">{alert.verifies} verifies</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowReportModal(true)}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-rose-500/40 flex items-center justify-center gap-3 transition-all interactive-tap hover:scale-[1.02] border-t border-rose-400/50"
                    >
                        <MessageCircle size={22} /> Report Incident (Live)
                    </button>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-end animate-fade-in">
                    <div className="w-full bg-white rounded-t-[3rem] p-8 pb-12 animate-slide-up border-t-4 border-rose-500">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-800">What's the issue?</h3>
                            <button onClick={() => setShowReportModal(false)} className="bg-slate-100 p-2 rounded-full text-slate-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {['Poor Lighting', 'Crowd Surge', 'Harassment', 'Unsafe Zone', 'Suspicious', 'Delay'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => handleFinalReport(type)}
                                    className="p-4 bg-slate-50 hover:bg-rose-50 border-2 border-slate-100 hover:border-rose-200 rounded-2xl text-left transition-all group"
                                >
                                    <p className="font-black text-slate-700 group-hover:text-rose-700">{type}</p>
                                    <div className="mt-2 w-6 h-1 bg-slate-200 group-hover:bg-rose-400 rounded-full transition-all"></div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {alertSent && (
                <div className="fixed top-8 left-4 right-4 z-[3000] animate-bounce-in">
                    <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 shadow-emerald-500/20">
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
