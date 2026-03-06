import React from 'react';
import { Menu, MoreVertical, Home, QrCode, Shield, IndianRupee, User } from 'lucide-react';

export default function Layout({ children, currentScreen, setCurrentScreen }) {
    return (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-surface-50 shadow-2xl overflow-hidden relative border-x border-slate-200">

            {/* Top App Bar */}
            <header className="flex items-center justify-between px-4 py-4 bg-white shadow-sm z-10 animate-fade-in relative">
                <button className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors interactive-tap text-slate-700">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">
                        Bharat <span className="text-accent-amber">Transit</span> AI
                    </h1>
                    <div className="flex items-center gap-1 mt-0.5 bg-slate-100 px-2 py-0.5 rounded-md">
                        <span className="text-[9px] font-bold text-primary-600 uppercase tracking-tighter">EN</span>
                        <div className="w-[1px] h-2 bg-slate-300 mx-0.5"></div>
                        <span className="text-[9px] font-medium text-slate-500 hover:text-primary-600 cursor-pointer transition-colors tracking-tighter">हिंदी</span>
                        <div className="w-[1px] h-2 bg-slate-200 mx-0.5"></div>
                        <div className="flex items-center gap-1 ml-1 pl-1 border-l border-slate-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.1em]">Offline Ready</span>
                        </div>
                    </div>
                </div>
                <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 transition-colors interactive-tap text-slate-700">
                    <MoreVertical className="w-6 h-6" />
                </button>
            </header>

            {/* Main Scrollable Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                {children}
            </main>

            {/* Bottom Navigation Bar */}
            <nav className="bg-white border-t border-slate-200 px-2 py-2 pb-safe z-20">
                <ul className="flex justify-between items-center">
                    <NavItem
                        icon={<Home />}
                        label="Home"
                        isActive={currentScreen === 'home'}
                        onClick={() => setCurrentScreen('home')}
                    />
                    <NavItem
                        icon={<QrCode />}
                        label="Scan"
                        isActive={currentScreen === 'scan'}
                        onClick={() => setCurrentScreen('scan')}
                    />
                    <NavItem
                        icon={<Shield />}
                        label="Companion"
                        isActive={currentScreen === 'companion'}
                        onClick={() => setCurrentScreen('companion')}
                    />
                    <NavItem
                        icon={<IndianRupee />}
                        label="Budget"
                        isActive={currentScreen === 'budget'}
                        onClick={() => setCurrentScreen('budget')}
                    />
                    <NavItem
                        icon={<User />}
                        label="Profile"
                        isActive={currentScreen === 'profile'}
                        onClick={() => setCurrentScreen('profile')}
                    />
                </ul>
            </nav>

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
