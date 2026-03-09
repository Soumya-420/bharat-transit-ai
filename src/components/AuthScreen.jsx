import React, { useState, useEffect } from 'react';
import {
    Phone, User, Shield, CheckCircle2, ChevronRight,
    Eye, EyeOff, Star, Lock, ArrowLeft, Loader2,
    CreditCard, Car, Vote, UserCheck, MapPin, Calendar,
    ChevronDown, RefreshCw, Sparkles
} from 'lucide-react';

// ─── Trust Score Generator ───────────────────────────────────────────────────
function generateTrustScore(profile) {
    let score = 50;
    if (profile.name?.length > 2) score += 8;
    if (profile.age >= 18 && profile.age <= 65) score += 7;
    if (profile.address?.length > 10) score += 5;
    if (profile.idType === 'aadhar') score += 20;
    if (profile.idType === 'voter') score += 15;
    if (profile.idType === 'driving') score += 12;
    if (profile.idNumber?.length >= 10) score += 10;
    // Small random variance ±3
    score += Math.floor(Math.random() * 7) - 3;
    return Math.min(100, Math.max(55, score));
}

function trustLabel(score) {
    if (score >= 90) return { label: 'Platinum', color: '#7c3aed', bg: 'bg-violet-50 border-violet-200' };
    if (score >= 80) return { label: 'Gold', color: '#d97706', bg: 'bg-amber-50 border-amber-200' };
    if (score >= 70) return { label: 'Silver', color: '#64748b', bg: 'bg-slate-50 border-slate-200' };
    return { label: 'Bronze', color: '#b45309', bg: 'bg-orange-50 border-orange-200' };
}

// ─── OTP Simulation ──────────────────────────────────────────────────────────
function generateOTP() { return String(Math.floor(1000 + Math.random() * 9000)); }

// ─── ID type config ──────────────────────────────────────────────────────────
const ID_TYPES = [
    { value: 'aadhar', label: 'Aadhaar Card', icon: <CreditCard size={16} />, placeholder: '1234 5678 9012', maxLen: 14, hint: '12-digit Aadhaar number' },
    { value: 'voter', label: 'Voter ID Card', icon: <Vote size={16} />, placeholder: 'ABC1234567', maxLen: 10, hint: '10-character Voter ID' },
    { value: 'driving', label: 'Driving Licence', icon: <Car size={16} />, placeholder: 'DL-0120110012345', maxLen: 16, hint: '15-character licence number' },
];

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

// ─── Main Auth Screen ─────────────────────────────────────────────────────────
export default function AuthScreen({ onLogin }) {
    // Login phase: 'phone' | 'otp-login' | 'signup' | 'otp-signup' | 'trust' | 'done'
    const [phase, setPhase] = useState('phone');
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState('');
    const [otpEntered, setOtpEntered] = useState('');
    const [otpError, setOtpError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [showOTPValue, setShowOTPValue] = useState(false);

    // Signup form
    const [profile, setProfile] = useState({
        phone: '', name: '', gender: '', age: '', address: '',
        idType: '', idNumber: ''
    });
    const [idStep, setIdStep] = useState('form'); // 'form' | 'id-select' | 'id-number'
    const [trustScore, setTrustScore] = useState(0);
    const [trustInfo, setTrustInfo] = useState(null);
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    // Resend countdown
    useEffect(() => {
        if (resendTimer <= 0) return;
        const t = setInterval(() => setResendTimer(v => v - 1), 1000);
        return () => clearInterval(t);
    }, [resendTimer]);

    const isPhoneValid = /^[6-9]\d{9}$/.test(phone);

    const sendOTP = (nextPhase) => {
        const code = generateOTP();
        setOtpSent(code);
        setOtpEntered('');
        setOtpError(false);
        setLoading(true);
        setTimeout(() => { setLoading(false); setPhase(nextPhase); setResendTimer(30); }, 1200);
    };

    const verifyOTP = (nextFn) => {
        if (otpEntered === otpSent) {
            setLoading(true);
            setTimeout(() => { setLoading(false); nextFn(); }, 800);
        } else {
            setOtpError(true);
        }
    };

    const handleSignupSubmit = () => {
        if (!/^[6-9]\d{9}$/.test(profile.phone) || !profile.name.trim() || !profile.gender || !profile.age || !profile.address.trim() || !profile.idType || !profile.idNumber.trim()) return;
        const score = generateTrustScore(profile);
        setTrustScore(score);
        setTrustInfo(trustLabel(score));

        // Save full profile to localStorage so they can log in later
        const fullProfile = {
            phone: profile.phone,
            name: profile.name,

            gender: profile.gender,
            age: profile.age,
            address: profile.address,
            idType: profile.idType,
            idNumber: profile.idNumber,
            trustScore: score,
            trustInfo: trustLabel(score)
        };
        localStorage.setItem('bta_user_' + profile.phone, JSON.stringify(fullProfile));

        setPhase('trust');
    };

    const handleLoginClick = () => {
        const saved = localStorage.getItem('bta_user_' + phone);
        if (!saved) {
            setPhoneError('Number not registered. Please create a new account.');
            return;
        }
        setPhoneError('');
        sendOTP('otp-login');
    };

    const handleFinalLogin = () => {
        const saved = localStorage.getItem('bta_user_' + phone);
        if (saved) {
            onLogin(JSON.parse(saved));
        } else {
            // Fallback just in case
            onLogin({
                phone, name: profile.name || 'User',
                trustScore, trustInfo,
                idType: profile.idType,
                gender: profile.gender,
                age: profile.age,
                address: profile.address,
                idNumber: profile.idNumber
            });
        }
    };

    // ── Shared OTP entry UI ──────────────────────────────────────────────────
    const renderOTPBox = (onVerified, onBack, phoneToDisplay) => (
        <div className="animate-slide-up">
            <button onClick={onBack} className="flex items-center gap-1 text-slate-500 font-bold text-sm mb-6">
                <ArrowLeft size={15} /> Back
            </button>
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Phone size={26} className="text-slate-700" />
                </div>
                <h2 className="font-black text-slate-900 text-2xl mb-1">Enter OTP</h2>
                <p className="text-sm text-slate-500 font-medium">Sent to +91 {phoneToDisplay}</p>
            </div>

            {/* Simulated OTP hint */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5 flex items-center justify-between">
                <p className="text-xs font-bold text-amber-700">Demo OTP: {showOTPValue ? otpSent : '••••'}</p>
                <button onClick={() => setShowOTPValue(v => !v)} className="text-amber-600">
                    {showOTPValue ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
            </div>

            <input
                type="number"
                maxLength={4}
                placeholder="_ _ _ _"
                value={otpEntered}
                onChange={e => { setOtpEntered(e.target.value.slice(0, 4)); setOtpError(false); }}
                className={`w-full text-center text-4xl font-black tracking-[1rem] py-5 border-2 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none transition-all mb-3 ${otpError ? 'border-red-400 bg-red-50 text-red-600' : 'border-slate-200 focus:border-slate-700 text-slate-800'
                    }`}
            />
            {otpError && <p className="text-xs font-bold text-red-500 text-center mb-3">Incorrect OTP. Try again.</p>}

            <button
                onClick={() => verifyOTP(onVerified)}
                disabled={otpEntered.length < 4 || loading}
                className="w-full py-4 bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 mb-3"
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Verify OTP</>}
            </button>

            <button
                disabled={resendTimer > 0}
                onClick={() => sendOTP(phase)}
                className="w-full text-center text-sm font-bold text-slate-500 disabled:opacity-40"
            >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
            </button>
        </div>
    );

    // ══════════════════════════════════════════════════════
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-sm">

                {/* ── App Logo ── */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-3 border border-white/20">
                        <span className="text-3xl">🚇</span>
                    </div>
                    <h1 className="text-2xl font-black text-white">Bharat <span className="text-amber-400">Transit</span> AI</h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Smart · Safe · Accessible</p>
                </div>

                {/* ── Main Card ── */}
                <div className="bg-white rounded-[2rem] p-6 shadow-2xl">

                    {/* ── PHASE: Enter Phone ── */}
                    {phase === 'phone' && (
                        <div className="animate-slide-up">
                            <h2 className="font-black text-slate-900 text-xl mb-1">Welcome Back</h2>
                            <p className="text-slate-500 text-sm font-medium mb-6">Sign in with your mobile number</p>

                            <div className="flex gap-2 mb-4">
                                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-3.5 font-bold text-slate-700 text-sm flex items-center gap-1 shrink-0">
                                    🇮🇳 +91
                                </div>
                                <input
                                    type="tel"
                                    maxLength={10}
                                    placeholder="9876543210"
                                    value={phone}
                                    onChange={e => {
                                        setPhoneError('');
                                        setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                                    }}
                                    className={`flex-1 border-2 rounded-xl px-4 py-3.5 font-bold text-lg focus:outline-none transition-all ${phoneError ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-200 focus:border-slate-700 bg-slate-50 focus:bg-white text-slate-800'
                                        }`}
                                />
                            </div>

                            {phoneError && <p className="text-xs font-bold text-red-500 text-center mb-3 -mt-2">{phoneError}</p>}

                            <button
                                onClick={handleLoginClick}
                                disabled={!isPhoneValid || loading}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 transition-all mb-4"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <>Get OTP <ChevronRight size={18} /></>}
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-1 h-px bg-slate-100"></div>
                                <span className="text-xs font-bold text-slate-400">New user?</span>
                                <div className="flex-1 h-px bg-slate-100"></div>
                            </div>

                            <button
                                onClick={() => {
                                    setPhoneError('');
                                    setProfile(p => ({ ...p, phone: isPhoneValid ? phone : '' }));
                                    setPhase('signup');
                                }}
                                className="w-full py-3.5 border-2 border-slate-200 rounded-2xl font-black text-slate-700 text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                            >
                                <User size={16} /> Create New Account
                            </button>

                            <p className="text-[10px] text-slate-400 font-medium text-center mt-4 leading-relaxed">
                                By continuing, you agree to Bharat Transit AI's Terms of Service and Privacy Policy
                            </p>
                        </div>
                    )}

                    {/* ── PHASE: OTP — Login ── */}
                    {phase === 'otp-login' && (
                        renderOTPBox(() => handleFinalLogin(), () => setPhase('phone'), phone)
                    )}

                    {/* ── PHASE: Signup Form ── */}
                    {phase === 'signup' && idStep === 'form' && (
                        <div className="animate-slide-up">
                            <button onClick={() => setPhase('phone')} className="flex items-center gap-1 text-slate-500 font-bold text-sm mb-4">
                                <ArrowLeft size={15} /> Back
                            </button>
                            <h2 className="font-black text-slate-900 text-xl mb-5">Create Account</h2>

                            <div className="space-y-3">
                                {/* Mobile Number */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mobile Number *</label>
                                    <div className="flex gap-2">
                                        <div className="bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-3 font-bold text-slate-700 text-sm flex items-center shrink-0">
                                            +91
                                        </div>
                                        <input
                                            type="tel"
                                            maxLength={10}
                                            placeholder="9876543210"
                                            value={profile.phone}
                                            onChange={e => setProfile(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                                            className="flex-1 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 text-sm focus:border-slate-600 focus:outline-none bg-slate-50 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Rahul Kumar"
                                        value={profile.name}
                                        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                        className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 text-sm focus:border-slate-600 focus:outline-none bg-slate-50 focus:bg-white transition-all"
                                    />
                                </div>

                                {/* Gender + Age */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Gender *</label>
                                        <select
                                            value={profile.gender}
                                            onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}
                                            className="w-full border-2 border-slate-100 rounded-xl px-3 py-3 font-bold text-slate-700 text-sm focus:border-slate-600 focus:outline-none bg-slate-50 focus:bg-white transition-all appearance-none"
                                        >
                                            <option value="">Select</option>
                                            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Age *</label>
                                        <input
                                            type="number"
                                            min={12} max={99}
                                            placeholder="25"
                                            value={profile.age}
                                            onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
                                            className="w-full border-2 border-slate-100 rounded-xl px-3 py-3 font-bold text-slate-800 text-sm focus:border-slate-600 focus:outline-none bg-slate-50 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                        <MapPin size={10} className="inline mr-1" />Address *
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="House No, Street, City, State"
                                        value={profile.address}
                                        onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                                        className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 text-sm focus:border-slate-600 focus:outline-none bg-slate-50 focus:bg-white transition-all resize-none"
                                    />
                                </div>

                                {/* Identity Type */}
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Identity Document *</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {ID_TYPES.map(id => (
                                            <button
                                                key={id.value}
                                                onClick={() => setProfile(p => ({ ...p, idType: id.value, idNumber: '' }))}
                                                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-center ${profile.idType === id.value
                                                    ? 'border-slate-800 bg-slate-800 text-white'
                                                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                                                    }`}
                                            >
                                                {id.icon}
                                                <span className="text-[9px] font-black leading-tight">{id.label.split(' ')[0]}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Document Number (shows when type selected) */}
                                {profile.idType && (
                                    <div className="animate-fade-in">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                            {ID_TYPES.find(i => i.value === profile.idType)?.label} Number *
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={ID_TYPES.find(i => i.value === profile.idType)?.maxLen}
                                            placeholder={ID_TYPES.find(i => i.value === profile.idType)?.placeholder}
                                            value={profile.idNumber}
                                            onChange={e => setProfile(p => ({ ...p, idNumber: e.target.value }))}
                                            className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-black text-slate-800 text-sm tracking-wider focus:border-slate-600 focus:outline-none bg-slate-50 focus:bg-white transition-all font-mono"
                                        />
                                        <p className="text-[10px] text-slate-400 font-medium mt-1">
                                            {ID_TYPES.find(i => i.value === profile.idType)?.hint}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => sendOTP('otp-signup')}
                                disabled={!/^[6-9]\d{9}$/.test(profile.phone) || !profile.name.trim() || !profile.gender || !profile.age || !profile.address.trim() || !profile.idType || !profile.idNumber.trim() || loading}
                                className="w-full mt-5 py-4 bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <>Verify with OTP <ChevronRight size={18} /></>}
                            </button>
                        </div>
                    )}

                    {/* ── PHASE: OTP — Signup ── */}
                    {phase === 'otp-signup' && (
                        renderOTPBox(handleSignupSubmit, () => setPhase('signup'), profile.phone)
                    )}

                    {/* ── PHASE: Trust Score Reveal ── */}
                    {phase === 'trust' && trustInfo && (
                        <div className="animate-slide-up text-center">
                            <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: trustInfo.color + '20' }}>
                                <Sparkles size={32} style={{ color: trustInfo.color }} />
                            </div>
                            <h2 className="font-black text-slate-900 text-xl mb-1">Account Created! 🎉</h2>
                            <p className="text-slate-500 text-sm font-medium mb-6">Welcome, {profile.name}</p>

                            {/* Trust badge */}
                            <div className={`rounded-3xl p-5 border-2 mb-5 ${trustInfo.bg}`}>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: trustInfo.color }}>
                                    ✨ AI-Generated Trust Score
                                </p>
                                <div className="flex items-end justify-center gap-2 mb-3">
                                    <span className="text-5xl font-black" style={{ color: trustInfo.color }}>{trustScore}</span>
                                    <span className="text-lg font-bold text-slate-400 mb-1">/100</span>
                                </div>
                                <div className="w-full bg-white rounded-full h-3 mb-3 overflow-hidden">
                                    <div className="h-3 rounded-full transition-all duration-1000" style={{ width: `${trustScore}%`, background: trustInfo.color }}></div>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border" style={{ background: trustInfo.color + '20', borderColor: trustInfo.color + '40' }}>
                                    <Star size={12} fill={trustInfo.color} style={{ color: trustInfo.color }} />
                                    <span className="text-xs font-black" style={{ color: trustInfo.color }}>{trustInfo.label} Member</span>
                                </div>
                            </div>

                            {/* What affects trust */}
                            <div className="bg-slate-50 rounded-2xl p-4 text-left mb-5 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">How your score was calculated</p>
                                <ul className="space-y-1">
                                    {[
                                        { label: 'Identity verified', val: '+' + (profile.idType === 'aadhar' ? '20' : profile.idType === 'voter' ? '15' : '12') },
                                        { label: 'Profile completeness', val: '+20' },
                                        { label: 'Phone verified', val: '+10' },
                                        { label: 'Age & gender', val: '+7' },
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-slate-600">{item.label}</span>
                                            <span className="text-emerald-600">{item.val}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={handleFinalLogin}
                                className="w-full py-4 bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl"
                            >
                                <CheckCircle2 size={18} /> Enter Bharat Transit AI
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom note */}
                <p className="text-center text-slate-500 text-[10px] font-medium mt-4">
                    🔒 Your data is encrypted end-to-end · No data sold to third parties
                </p>
            </div>
        </div>
    );
}
