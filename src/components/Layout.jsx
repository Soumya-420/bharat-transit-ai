import React, { useState } from 'react';
import { Menu, MoreVertical, Home, QrCode, Shield, IndianRupee, User, X, Globe, Check } from 'lucide-react';

// 22+ Indian Languages with Google Translate BCP47 codes
const LANGUAGES = [
    { code: 'EN', label: 'English', native: 'English', googleCode: 'en' },
    { code: 'HI', label: 'Hindi', native: 'हिंदी', googleCode: 'hi' },
    { code: 'BN', label: 'Bengali', native: 'বাংলা', googleCode: 'bn' },
    { code: 'TE', label: 'Telugu', native: 'తెలుగు', googleCode: 'te' },
    { code: 'MR', label: 'Marathi', native: 'मराठी', googleCode: 'mr' },
    { code: 'TA', label: 'Tamil', native: 'தமிழ்', googleCode: 'ta' },
    { code: 'GU', label: 'Gujarati', native: 'ગુજરાતી', googleCode: 'gu' },
    { code: 'KN', label: 'Kannada', native: 'ಕನ್ನಡ', googleCode: 'kn' },
    { code: 'ML', label: 'Malayalam', native: 'മലയാളം', googleCode: 'ml' },
    { code: 'PA', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', googleCode: 'pa' },
    { code: 'UR', label: 'Urdu', native: 'اردو', googleCode: 'ur' },
    { code: 'OD', label: 'Odia', native: 'ଓଡ଼ିଆ', googleCode: 'or' },
    { code: 'AS', label: 'Assamese', native: 'অসমীয়া', googleCode: 'as' },
    { code: 'MN', label: 'Maithili', native: 'मैथिली', googleCode: 'mai' },
    { code: 'SA', label: 'Sanskrit', native: 'संस्कृत', googleCode: 'sa' },
    { code: 'SD', label: 'Sindhi', native: 'سنڌي', googleCode: 'sd' },
    { code: 'KS', label: 'Kashmiri', native: 'کشمیری', googleCode: 'ks' },
    { code: 'KO', label: 'Konkani', native: 'कोंकणी', googleCode: 'gom' },
    { code: 'MZ', label: 'Mizo', native: 'Mizo ṭawng', googleCode: 'lus' },
    { code: 'NT', label: 'Nepali', native: 'नेपाली', googleCode: 'ne' },
    { code: 'BP', label: 'Bhojpuri', native: 'भोजपुरी', googleCode: 'bho' },
    { code: 'TL', label: 'Tulu', native: 'ತುಳು', googleCode: 'tcy' },
];

// Global translations map (key → language code → translated string)
export const TRANSLATIONS = {
    offlineReady: {
        EN: 'Offline Ready', HI: 'ऑफ़लाइन तैयार', BN: 'অফলাইন প্রস্তুত',
        TE: 'ఆఫ్లైన్ సిద్ధం', MR: 'ऑफलाइन तयार', TA: 'ஆஃப்லைன் தயார்',
        GU: 'ઑફલાઇન તૈयார', KN: 'ಆಫ್‌ಲೈನ್ ಸಿದ್ಧ', ML: 'ഓഫ്‌ലൈൻ തയ്യാർ',
        PA: 'ਔਫਲਾਈਨ ਤਿਆਰ', UR: 'آف لائن تیار', OD: 'ଅଫଲାଇନ ପ୍ରସ୍ତୁତ',
    },
    home: {
        EN: 'Home', HI: 'होम', BN: 'হোম', TE: 'హోం', MR: 'होम', TA: 'முகப்பு',
        GU: 'હોમ', KN: 'ಹೋಮ್', ML: 'ഹോം', PA: 'ਹੋਮ', UR: 'ہوم', OD: 'ହୋମ',
    },
    scan: {
        EN: 'Scan', HI: 'स्कैन', BN: 'স্ক্যান', TE: 'స్కాన్', MR: 'स्कॅन', TA: 'ஸ்கேன்',
        GU: 'સ્કૅન', KN: 'ಸ್ಕ್ಯಾನ್', ML: 'സ്കാൻ', PA: 'ਸਕੈਨ', UR: 'اسکین', OD: 'ସ୍କ୍ୟାନ',
    },
    companion: {
        EN: 'Companion', HI: 'साथी', BN: 'সঙ্গী', TE: 'సహచరుడు', MR: 'साथी', TA: 'தோழர்',
        GU: 'સાથી', KN: 'ಸಹ', ML: 'സഹചാരി', PA: 'ਸਾਥੀ', UR: 'ساتھی', OD: 'ସାଥୀ',
    },
    budget: {
        EN: 'Budget', HI: 'बजट', BN: 'বাজেট', TE: 'బడ్జెట్', MR: 'बजेट', TA: 'பட்ஜெட்',
        GU: 'બજેટ', KN: 'ಬಜೆಟ್', ML: 'ബജറ്റ്', PA: 'ਬਜਟ', UR: 'بجٹ', OD: 'ବଜେଟ',
    },
    profile: {
        EN: 'Profile', HI: 'प्रोफ़ाइल', BN: 'প্রোফাইল', TE: 'ప్రొఫైల్', MR: 'प्रोफाइल', TA: 'சுயவிவரம்',
        GU: 'પ્રોફાઇલ', KN: 'ಪ್ರೊಫೈಲ್', ML: 'പ്രൊഫൈൽ', PA: 'ਪ੍ਰੋਫਾਈਲ', UR: 'پروفائل', OD: 'ପ୍ରୋଫାଇଲ',
    },
    findRoutes: {
        EN: 'Find Routes', HI: 'रास्ते खोजें', BN: 'রুট খুঁজুন', TE: 'మార్గాలు కనుగొనండి', MR: 'मार्ग शोधा',
        TA: 'வழிகளை கண்டறி', GU: 'માર્ગ શોધો', KN: 'ಮಾರ್ಗ ಹುಡುಕಿ', ML: 'വഴികൾ കണ്ടെത്തുക',
        PA: 'ਰਸਤੇ ਲੱਭੋ', UR: 'راستے تلاش کریں', OD: 'ରାସ୍ତା ଖୋଜ',
    },
    selectLanguage: {
        EN: 'Select Language', HI: 'भाषा चुनें', BN: 'ভাষা বেছে নিন', TE: 'భాష ఎంచుకోండి',
        MR: 'भाषा निवडा', TA: 'மொழி தேர்ந்தெடு', GU: 'ભાષા પસંદ કરો', KN: 'ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ',
        ML: 'ഭാഷ തിരഞ്ഞെടുക്കുക', PA: 'ਭਾਸ਼ਾ ਚੁਣੋ', UR: 'زبان منتخب کریں', OD: 'ଭାଷା ଚୟନ କରନ୍ତୁ',
    }
};

export function t(key, lang) {
    return TRANSLATIONS[key]?.[lang] || TRANSLATIONS[key]?.['EN'] || key;
}

export default function Layout({ children, currentScreen, setCurrentScreen, lang, setLang }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const activeLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

    const sidebarItems = [
        { icon: '🏠', label: 'Home', screen: 'home' },
        { icon: '🔍', label: 'Vision AI Scan', screen: 'scan' },
        { icon: '🛡️', label: 'Safe Companion', screen: 'companion' },
        { icon: '💰', label: 'Budget Mode', screen: 'budget' },
        { icon: '🎉', label: 'Festival-Smart', screen: 'festival' },
        { icon: '📵', label: 'Offline SMS Navigation', screen: 'sms', highlight: true },
    ];

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-surface-50 shadow-2xl overflow-hidden relative border-x border-slate-200">

            {/* Top App Bar */}
            <header className="flex items-center justify-between px-4 py-4 bg-white shadow-sm z-10 animate-fade-in relative">
                <button
                    onClick={() => setShowSidebar(true)}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors interactive-tap text-slate-700"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">
                        Bharat <span className="text-accent-amber">Transit</span> AI
                    </h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.1em]">
                                {t('offlineReady', lang)}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowMenu(true)}
                    className="p-2 -mr-2 rounded-full hover:bg-slate-100 transition-colors interactive-tap text-slate-700"
                >
                    <MoreVertical className="w-6 h-6" />
                </button>
            </header>

            {/* Main Scrollable Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                {children}
            </main>

            {/* ── Left Sidebar Drawer ── */}
            {showSidebar && (
                <div className="absolute inset-0 z-[2000] flex">
                    {/* Backdrop */}
                    <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setShowSidebar(false)}></div>
                    {/* Drawer */}
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col animate-slide-right overflow-y-auto">
                        {/* Drawer header */}
                        <div className="bg-slate-900 px-5 pt-8 pb-6">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Bharat Transit AI</p>
                            <h2 className="font-black text-white text-lg">Main Menu</h2>
                        </div>

                        {/* Menu items */}
                        <div className="flex-1 px-4 py-4 space-y-1">
                            {sidebarItems.map(item => (
                                <button
                                    key={item.screen}
                                    onClick={() => { setCurrentScreen(item.screen); setShowSidebar(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all ${item.highlight
                                            ? 'bg-slate-800 text-white shadow-lg'
                                            : currentScreen === item.screen
                                                ? 'bg-slate-100 text-slate-900'
                                                : 'hover:bg-slate-50 text-slate-700'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-bold text-sm">{item.label}</span>
                                    {item.highlight && (
                                        <span className="ml-auto text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">NEW</span>
                                    )}
                                    {currentScreen === item.screen && !item.highlight && (
                                        <span className="ml-auto w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Language quick-pick */}
                        <div className="px-4 pb-6 border-t border-slate-100 pt-4">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Language</p>
                            <button
                                onClick={() => { setShowMenu(true); setShowSidebar(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200"
                            >
                                <span className="text-xl">🌐</span>
                                <span className="font-bold text-sm text-slate-700">{activeLang?.native} ({activeLang?.label})</span>
                                <span className="ml-auto text-xs text-slate-400">Change →</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation Bar */}
            <nav className="bg-white border-t border-slate-200 px-2 py-2 pb-safe z-20">
                <ul className="flex justify-between items-center">
                    <NavItem icon={<Home />} label={t('home', lang)} isActive={currentScreen === 'home'} onClick={() => setCurrentScreen('home')} />
                    <NavItem icon={<QrCode />} label={t('scan', lang)} isActive={currentScreen === 'scan'} onClick={() => setCurrentScreen('scan')} />
                    <NavItem icon={<Shield />} label={t('companion', lang)} isActive={currentScreen === 'companion'} onClick={() => setCurrentScreen('companion')} />
                    <NavItem icon={<IndianRupee />} label={t('budget', lang)} isActive={currentScreen === 'budget'} onClick={() => setCurrentScreen('budget')} />
                    <NavItem icon={<User />} label={t('profile', lang)} isActive={currentScreen === 'profile'} onClick={() => setCurrentScreen('profile')} />
                </ul>
            </nav>

            {/* 3-dot Menu: Language Picker */}
            {showMenu && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[5000] flex items-end animate-fade-in" onClick={() => setShowMenu(false)}>
                    <div
                        className="w-full max-w-md mx-auto bg-white rounded-t-[2.5rem] pb-8 animate-slide-up border-t-4 border-primary-500 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary-50 p-2.5 rounded-2xl">
                                    <Globe className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-base">{t('selectLanguage', lang)}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">22+ Indian Languages</p>
                                </div>
                            </div>
                            <button onClick={() => setShowMenu(false)} className="bg-slate-100 p-2 rounded-full text-slate-500">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Language Grid */}
                        <div className="px-4 pt-5 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-2">
                                {LANGUAGES.map(lng => (
                                    <button
                                        key={lng.code}
                                        onClick={() => {
                                            setLang(lng.code);
                                            setShowMenu(false);
                                            // Trigger Google Translate engine
                                            if (typeof window.changeAppLanguage === 'function') {
                                                window.changeAppLanguage(lng.googleCode);
                                            }
                                        }}
                                        className={`flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all text-left group ${lang === lng.code ? 'bg-primary-50 border-primary-400 shadow-md' : 'bg-slate-50 border-slate-100 hover:border-primary-200 hover:bg-primary-50/50'}`}
                                    >
                                        <div>
                                            <p className={`font-black text-sm ${lang === lng.code ? 'text-primary-700' : 'text-slate-700'}`}>{lng.native}</p>
                                            <p className="text-[10px] font-bold text-slate-400">{lng.label}</p>
                                        </div>
                                        {lang === lng.code && (
                                            <Check size={16} className="text-primary-600 shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function NavItem({ icon, label, isActive, onClick }) {
    return (
        <li className="flex-1">
            <button
                onClick={onClick}
                className={`w-full flex flex-col items-center justify-center p-2 rounded-xl transition-all interactive-tap gap-1
          ${isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
        `}
            >
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110 mb-0.5' : 'scale-100'}`}>
                    {React.cloneElement(icon, { className: `w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}` })}
                </div>
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-semibold' : ''}`}>
                    {label}
                </span>
            </button>
        </li>
    );
}
