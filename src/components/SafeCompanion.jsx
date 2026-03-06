import React, { useState } from 'react';
import { Shield, UserPlus, Star, AlertTriangle, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';

export default function SafeCompanion() {
    const [activeTab, setActiveTab] = useState('companions');
    const [connected, setConnected] = useState([]);
    const [alertSent, setAlertSent] = useState(false);

    const companions = [
        { id: 1, name: 'Anjali Verma', trust: 4.8, type: 'Same Route (Metro)', eta: '2 mins away' },
        { id: 2, name: 'Priya Sharma', trust: 4.6, type: 'Same Time (Bus)', eta: '5 mins away' }
    ];

    const alerts = [
        { id: 1, type: 'Poor Lighting', location: 'Gate 3, NDLS', time: '10 mins ago', verifies: 12 },
        { id: 2, type: 'Crowd Surge', location: 'Platform 2', time: 'Just now', verifies: 4 }
    ];

    const handleConnect = (id) => {
        setConnected(prev => [...prev, id]);
    };

    const handleReport = () => {
        setAlertSent(true);
        setTimeout(() => setAlertSent(false), 3000);
    };

    return (
        <div className="p-4 space-y-6 pb-20 animate-slide-up bg-slate-50 min-h-full">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Shield className="text-emerald-500 w-6 h-6" /> SafeNetwork
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">AWS-verified traveler network</p>
                </div>
                <div className="flex gap-1 bg-slate-200 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('companions')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'companions' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Peers
                    </button>
                    <button
                        onClick={() => setActiveTab('alerts')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'alerts' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Alerts
                    </button>
                </div>
            </div>

            {activeTab === 'companions' ? (
                <>
                    <div className="space-y-4">
                        {companions.map((comp) => (
                            <div key={comp.id} className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col gap-3 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-3xl"></div>

                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg border-2 border-white shadow-sm">
                                                {comp.name.charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                <Shield size={12} className="text-emerald-500 fill-emerald-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{comp.name}</h3>
                                            <div className="flex items-center gap-2 text-xs mt-0.5">
                                                <span className="flex items-center text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
                                                    Trust {comp.trust} <Star size={10} className="ml-0.5 fill-current" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{comp.eta}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-50 relative z-10">
                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                        <MapPin size={12} /> {comp.type}
                                    </span>
                                    {connected.includes(comp.id) ? (
                                        <button disabled className="px-4 py-1.5 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-lg flex items-center gap-1 border border-emerald-100">
                                            <CheckCircle2 size={14} /> Connected
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleConnect(comp.id)}
                                            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors interactive-tap shadow-sm"
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all interactive-tap hover-lift border border-emerald-400">
                        <UserPlus size={18} /> Broadcast Route Privately
                    </button>
                </>
            ) : (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-rose-100/50 rounded-full blur-2xl -mr-8 -mt-8"></div>
                        <h3 className="text-rose-900 font-bold mb-1 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                            Community Alerts
                        </h3>
                        <p className="text-rose-700/80 text-xs mb-4 font-medium leading-relaxed max-w-[85%] relative z-10">
                            Powered by AWS DynamoDB streams for real-time crowd incident reporting.
                        </p>

                        <div className="space-y-2 relative z-10">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="bg-white p-3 rounded-xl shadow-sm border border-rose-50 flex items-start justify-between">
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{alert.type}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                            <MapPin size={10} /> {alert.location}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase">{alert.time}</p>
                                        <p className="text-[10px] text-rose-500 font-bold mt-1 bg-rose-50 px-1.5 py-0.5 rounded inline-block">{alert.verifies} verifies</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleReport}
                        disabled={alertSent}
                        className={`w-full font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all interactive-tap hover-lift
                            ${alertSent ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 border border-rose-400'}
                        `}
                    >
                        {alertSent ? (
                            <><CheckCircle2 size={18} /> Alert Broadcasted</>
                        ) : (
                            <><MessageCircle size={18} /> Report Incident Here</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
