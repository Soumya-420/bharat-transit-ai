import React, { useState, useRef, useEffect } from 'react';
import {
    MessageSquare, Send, Wifi, WifiOff, Phone, CheckCircle2,
    Copy, RefreshCw, MapPin, Navigation2, Volume2, Info,
    ChevronRight, Clock, Bus, Train, CarTaxiFront, Mic
} from 'lucide-react';

// ─── Simulated offline route steps (plain text, screen-reader friendly) ──────
const buildSMSSteps = (destination) => {
    const dest = destination.trim() || 'India Gate';
    return [
        `STEP 1: Start at New Delhi Railway Station. Face EAST exit (Gate 1).`,
        `STEP 2: Walk 200 metres straight ahead. You will reach the bus stop.`,
        `STEP 3: Board BUS 620. Tell conductor: "${dest}". Fare Rs 10.`,
        `STEP 4: Ride 8 stops. Listen for announcement: Kartavya Path.`,
        `STEP 5: Exit bus. Walk 400 metres south (keep sun on your left at noon).`,
        `STEP 6: You have ARRIVED at ${dest}. Total time approx 42 minutes.`,
    ];
};

// ─── SMS Code Generator ───────────────────────────────────────────────────────
const generateSMSCode = () =>
    'BTA' + Math.floor(1000 + Math.random() * 9000);

// ─── Simulated SMS conversation ───────────────────────────────────────────────
const buildConversation = (code, destination) => [
    {
        from: 'user',
        text: `ROUTE ${code} ${destination}`,
        time: '10:02 AM',
        label: 'Your SMS to 56789'
    },
    {
        from: 'system',
        text: `BHARAT TRANSIT AI\nRoute found: NDLS → ${destination}\nSteps: 6 | Mode: Bus 620\nReply STEPS ${code} to get full directions.`,
        time: '10:02 AM',
        label: 'Reply from 56789 (free)'
    },
    {
        from: 'user',
        text: `STEPS ${code}`,
        time: '10:03 AM',
        label: 'Your SMS'
    },
    {
        from: 'system',
        text: buildSMSSteps(destination).join('\n\n'),
        time: '10:03 AM',
        label: 'Directions SMS (free · no internet needed)'
    },
];

// ─── TTS helper ───────────────────────────────────────────────────────────────
function speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN';
    u.rate = 0.88;
    window.speechSynthesis.speak(u);
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SMSNavigation() {
    const [destination, setDestination] = useState('');
    const [phase, setPhase] = useState('input'); // input | generating | chatSim | steps
    const [smsCode, setSmsCode] = useState('');
    const [progress, setProgress] = useState(0);
    const [copied, setCopied] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const chatRef = useRef(null);

    const steps = buildSMSSteps(destination);
    const conversation = buildConversation(smsCode, destination || 'India Gate');

    // Simulate SMS API processing
    const handleGenerate = () => {
        if (!destination.trim()) return;
        const code = generateSMSCode();
        setSmsCode(code);
        setPhase('generating');
        setProgress(0);
        let p = 0;
        const t = setInterval(() => {
            p += 20;
            setProgress(p);
            if (p >= 100) {
                clearInterval(t);
                setPhase('chatSim');
                setTimeout(() => chatRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
            }
        }, 300);
    };

    // Voice input
    const handleVoice = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert('Voice not supported in this browser'); return; }
        const r = new SR();
        r.lang = 'en-IN';
        r.onstart = () => setIsListening(true);
        r.onresult = e => { setDestination(e.results[0][0].transcript); setIsListening(false); };
        r.onerror = () => setIsListening(false);
        r.onend = () => setIsListening(false);
        r.start();
    };

    return (
        <div className="pb-24 min-h-full bg-slate-50 animate-slide-up">

            {/* ── Header ── */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 pt-6 pb-10 text-white">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/15 backdrop-blur-sm p-2.5 rounded-2xl">
                        <WifiOff size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-black text-lg leading-tight">SMS Navigation</h2>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Offline Accessible · No Internet Needed</p>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-start gap-2 border border-white/10">
                    <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <p className="text-[11px] font-medium text-slate-300 leading-relaxed">
                        Works without internet. Send an SMS to <span className="font-black text-white">56789</span> (free) and receive turn-by-turn directions on any basic phone. Designed for visually impaired users.
                    </p>
                </div>
            </div>

            {/* ── Input card ── */}
            <div className="mx-4 -mt-6">
                <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-5">

                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Enter Your Destination
                    </p>

                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin size={16} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 placeholder:text-slate-400 focus:border-slate-600 focus:bg-white focus:outline-none transition-all text-[15px]"
                            placeholder="e.g. India Gate, Rajiv Chowk…"
                            value={destination}
                            onChange={e => setDestination(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                            onClick={handleVoice}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                            <Mic size={15} />
                        </button>
                    </div>

                    {/* SMS number display */}
                    <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3.5 border border-slate-100 mb-4">
                        <Phone size={15} className="text-slate-400 shrink-0" />
                        <div className="flex-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SMS Number</p>
                            <p className="font-black text-slate-800 text-base">56789</p>
                        </div>
                        <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">FREE</span>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!destination.trim() || phase === 'generating'}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:pointer-events-none transition-all hover:scale-[1.01] interactive-tap"
                    >
                        {phase === 'generating'
                            ? <><RefreshCw size={18} className="animate-spin" /> Generating SMS Route…</>
                            : <><MessageSquare size={18} /> Generate SMS Navigation</>}
                    </button>
                </div>
            </div>

            {/* ── Generating progress ── */}
            {phase === 'generating' && (
                <div className="mx-4 mt-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm animate-fade-in">
                    <p className="text-xs font-black text-slate-700 mb-2 flex items-center gap-2">
                        <RefreshCw size={13} className="animate-spin text-slate-500" /> Connecting to SMS Route Engine…
                    </p>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 mb-1">
                        <div className="h-2.5 rounded-full bg-gradient-to-r from-slate-600 to-slate-800 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold text-right">{progress}%</p>
                    <div className="mt-3 space-y-1.5">
                        {[
                            { done: progress >= 20, msg: '📡 Connecting to BTA SMS Gateway (56789)…' },
                            { done: progress >= 40, msg: '🗺️ Loading offline route map for your area…' },
                            { done: progress >= 60, msg: '📝 Building plain-text step instructions…' },
                            { done: progress >= 80, msg: '♿ Optimising for accessibility & screen readers…' },
                            { done: progress >= 100, msg: '✅ SMS dispatched! Check below for simulation.' },
                        ].map((item, i) => (
                            <div key={i} className={`flex items-center gap-2 text-[10px] font-bold transition-all ${item.done ? 'text-slate-700' : 'text-slate-300'}`}>
                                {item.done ? <CheckCircle2 size={11} className="text-emerald-500 shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-200 shrink-0"></div>}
                                {item.msg}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── SMS Chat Simulation ── */}
            {(phase === 'chatSim' || phase === 'steps') && (
                <div className="mx-4 mt-5" ref={chatRef}>
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="font-black text-slate-800 text-sm">SMS Simulation</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sent to 56789 · Reply received</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full">
                            <WifiOff size={10} className="text-emerald-400" />
                            <span className="text-[9px] font-black text-emerald-400 uppercase">Offline</span>
                        </div>
                    </div>

                    {/* SMS Code Banner */}
                    <div className="bg-slate-800 rounded-3xl p-4 mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Your Route Code</p>
                            <p className="font-black text-white text-2xl tracking-widest">{smsCode}</p>
                            <p className="text-[9px] text-slate-400 font-medium mt-0.5">Used in SMS: <span className="text-slate-300">ROUTE {smsCode} {destination}</span></p>
                        </div>
                        <button
                            onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                            className="bg-white/10 border border-white/20 px-3 py-2 rounded-xl text-xs font-black text-white flex items-center gap-1.5"
                        >
                            {copied ? <><CheckCircle2 size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                        </button>
                    </div>

                    {/* Chat bubbles */}
                    <div className="space-y-3">
                        {conversation.map((msg, i) => (
                            <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                                {msg.from === 'system' && (
                                    <div className="w-8 h-8 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 mt-1">
                                        <MessageSquare size={14} className="text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1 px-1">{msg.label}</p>
                                    <div className={`px-4 py-3 rounded-3xl text-xs font-medium leading-relaxed whitespace-pre-wrap shadow-sm
                                        ${msg.from === 'user'
                                            ? 'bg-slate-800 text-white rounded-tr-lg'
                                            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-lg'}
                                    `}>
                                        {msg.text}
                                    </div>
                                    <p className="text-[8px] text-slate-400 font-bold mt-1 px-1">{msg.time}</p>
                                </div>
                                {msg.from === 'system' && (
                                    <button
                                        onClick={() => speak(msg.text)}
                                        className="w-8 h-8 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 mt-1 hover:bg-slate-200 transition-all"
                                        title="Listen to this message"
                                    >
                                        <Volume2 size={13} className="text-slate-600" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* View Steps button */}
                    <button
                        onClick={() => setPhase('steps')}
                        className="mt-5 w-full py-4 bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl interactive-tap hover:scale-[1.01] transition-all"
                    >
                        <Navigation2 size={18} /> View Step-by-Step Directions
                    </button>
                </div>
            )}

            {/* ── Full accessible step directions ── */}
            {phase === 'steps' && (
                <div className="mx-4 mt-5">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="font-black text-slate-800 text-sm">
                                Turn-by-Turn Directions
                            </h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                NDLS → {destination} · Accessible Format
                            </p>
                        </div>
                        <button
                            onClick={() => speak(steps.join('. '))}
                            className="flex items-center gap-1.5 bg-slate-800 text-white px-3 py-2 rounded-xl text-[10px] font-black"
                        >
                            <Volume2 size={12} /> Read All
                        </button>
                    </div>

                    <div className="space-y-3">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveStep(i)}
                                className={`bg-white rounded-3xl p-5 border-2 shadow-sm cursor-pointer transition-all ${activeStep === i ? 'border-slate-800 shadow-slate-200' : 'border-slate-100 hover:border-slate-200'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${activeStep === i ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-bold text-sm leading-relaxed ${activeStep === i ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {step}
                                        </p>
                                        {activeStep === i && (
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); speak(step); }}
                                                    className="flex items-center gap-1.5 bg-slate-800 text-white text-[10px] font-black px-3 py-1.5 rounded-xl"
                                                >
                                                    <Volume2 size={11} /> Listen
                                                </button>
                                                {i < steps.length - 1 && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setActiveStep(i + 1); speak(steps[i + 1]); }}
                                                        className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-xl"
                                                    >
                                                        Next Step →
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); speak(step); }}
                                        className="bg-slate-50 p-2 rounded-xl border border-slate-100 shrink-0"
                                    >
                                        <Volume2 size={14} className="text-slate-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Accessibility + future SMS API note */}
                    <div className="mt-5 bg-slate-800 rounded-3xl p-5 text-white">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">♿ Accessibility & Future Integration</p>
                        <div className="space-y-2 text-[11px] text-slate-300 font-medium leading-relaxed">
                            <p>• All step text optimised for screen readers (NVDA, TalkBack)</p>
                            <p>• Directions use landmarks & cardinal directions — no visual cues required</p>
                            <p>• Future: integrate with <span className="text-white font-black">Twilio / MSG91 SMS API</span> for real delivery</p>
                            <p>• Back-end ready: AWS Lambda + route DB + SMS gateway → works fully offline</p>
                        </div>
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {['Twilio SMS', 'MSG91', 'AWS Lambda', 'TRAI Free SMS'].map(t => (
                                <span key={t} className="text-[9px] font-black bg-white/10 border border-white/20 px-2.5 py-1 rounded-full">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* How it works */}
            {phase === 'input' && (
                <div className="mx-4 mt-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">How It Works</p>
                    <div className="space-y-2">
                        {[
                            { n: '1', icon: '📱', title: 'No internet needed', desc: 'Works on any basic phone with SMS capability' },
                            { n: '2', icon: '✉️', title: 'Send one SMS', desc: 'Text your destination to 56789 — it\'s free' },
                            { n: '3', icon: '📩', title: 'Get directions back', desc: 'Receive plain-text turn-by-turn steps instantly' },
                            { n: '4', icon: '🔊', title: 'Audio readout', desc: 'Listen to each step — designed for visual impairment' },
                        ].map(item => (
                            <div key={item.n} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-start gap-3">
                                <div className="w-9 h-9 bg-slate-800 rounded-2xl flex items-center justify-center text-lg shrink-0">{item.icon}</div>
                                <div>
                                    <p className="font-black text-slate-800 text-sm">{item.title}</p>
                                    <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
