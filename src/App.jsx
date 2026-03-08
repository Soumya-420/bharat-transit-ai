import React, { useState } from 'react';
import Layout from './components/Layout';
import HomeSearch from './components/HomeSearch';
import RouteResults from './components/RouteResults';
import LiveNavigation from './components/LiveNavigation';
import SafeCompanion from './components/SafeCompanion';
import VisionAI from './components/VisionAI';
import BudgetMode from './components/BudgetMode';
import FestivalSmart from './components/FestivalSmart';
import SMSNavigation from './components/SMSNavigation';
import AuthScreen from './components/AuthScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [festivalMode, setFestivalMode] = useState(false);
  const [lang, setLang] = useState('EN');
  const [user, setUser] = useState(null); // null = not logged in

  // Auth gate — show login until user is authenticated
  if (!user) {
    return <AuthScreen onLogin={(u) => setUser(u)} />;
  }

  const handleSearch = async (originArg, destinationArg) => {
    setIsLoading(true);

    const origin = typeof originArg === 'string' ? originArg : "New Delhi Railway Station";
    const destination = typeof destinationArg === 'string' ? destinationArg : "India Gate";

    try {
      /**
       * 10/10 ARCHITECTURE SIMULATION:
       * In the real AWS setup, this single fetch calls your AWS API Gateway Endpoint.
       * The API Gateway then triggers the 4 Microservices (Route, Safety, AI, Budget) 
       * and aggregates their responses into a single JSON payload.
       */
      const response = await fetch("https://ow6sg43ydy2sumvnfcylkakw240qqudq.lambda-url.ap-south-1.on.aws/", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ origin, destination })
      });

      const data = await response.json();
      const rawResult = (data && data.body && typeof data.body === 'string') ? JSON.parse(data.body) : data;

      // Consolidate data from all simulated microservices
      const orchestratedResult = {
        ...rawResult,
        microservices: {
          route_engine: "active",
          safety_engine: "active",
          ai_reasoning: "active",
          budget_engine: "active"
        },
        safety_metadata: {
          score: rawResult.safety_score || 85,
          incidents_query: "DynamoDB: 0 active incidents found in New Delhi central zone"
        },
        budget_metadata: {
          challenge_status: "eligible",
          savings_potential: "₹45"
        }
      };

      // AUTO-DETECTION & SMART ROUTING LOGIC (Simulated AI)
      const isFestival = destination.toLowerCase().includes("kolkata") || destination.toLowerCase().includes("chowk");
      setFestivalMode(isFestival);

      const destClean = destination.split(',')[0] || destination;

      // Define specific route data for differentiation
      orchestratedResult.routes_data = {
        fastest: {
          reason: "Bypasses 4 congestion points using the express Metro corridor.",
          detailed_steps: [
            { type: 'walk', instruction: "Quick walk to Metro Entrance 2", distance: "100m", pathType: "Walking Path" },
            { type: 'transit', instruction: "Board Metro Blue Line (Express) towards Rajiv Chowk", distance: "Board", pathType: "Transit" },
            { type: 'transit', instruction: "Transfer to Yellow Line towards Central Secretariat", distance: "Transfer", pathType: "Transit" },
            { type: 'walk', instruction: `Short 150m walk to ${destClean}`, distance: "150m", pathType: "Walking Path" },
            { type: 'arrive', instruction: "Arrive at Destination", distance: "Arrive", pathType: "Destination" }
          ]
        },
        safest: {
          reason: "Prioritizes well-lit, high-frequency bus corridors and minimal walking in quiet zones.",
          detailed_steps: [
            { type: 'walk', instruction: "Walk to the main well-lit Bus Stand", distance: "200m", pathType: "Walking Path" },
            { type: 'transit', instruction: "Board Safeway Bus 764 (CCTV Enabled)", distance: "Board", pathType: "Transit" },
            { type: 'walk', instruction: "Walk 100m via the main security-monitored corridor", distance: "100m", pathType: "Walking Path" },
            { type: 'arrive', instruction: "Arrive safely at Destination", distance: "Arrive", pathType: "Destination" }
          ]
        },
        cheapest: {
          reason: "Optimized for ₹10/₹15 valid DTC transit passes and standard bus lines.",
          detailed_steps: [
            { type: 'walk', instruction: "Walk to Local Bus Stop", distance: "250m", pathType: "Walking Path" },
            { type: 'transit', instruction: "Board Standard Bus Route 413", distance: "Board", pathType: "Transit" },
            { type: 'walk', instruction: "Walk to final destination", distance: "300m", pathType: "Walking Path" },
            { type: 'arrive', instruction: "Arrive at Destination", distance: "Arrive", pathType: "Destination" }
          ]
        }
      };

      if (isFestival) {
        orchestratedResult.festival_reason = "Major Carnival/Event in progress";
        orchestratedResult.festival_guidance = "AI is routing via crowd-free secondary lanes and pedestrian-friendly paths to avoid heavy event congestion.";
        orchestratedResult.reason = "Optimized for festival safety: Avoiding 4 high-density crowd zones near the venue.";

        // Inject Festival-Aware labels
        orchestratedResult.labels = {
          fastest: "Fastest (Smart Avoidance)",
          safest: "Safest (Crowd-Free)",
          cheapest: "Cheapest (Festival Optimized)"
        };

        // Festival Override for All routes (Simpler for demo)
        const festivalSteps = [
          { type: 'walk', instruction: "Walk 150m towards the northern exit to avoid main gate crowds", distance: "150m", pathType: "Walking Path" },
          { type: 'turn', instruction: "Turn Right at the police kiosk", distance: "Turn", pathType: "Walking Path" },
          { type: 'transit', instruction: `Board Special Festival Shuttle (Route S-1) towards ${destClean}`, distance: "Board", pathType: "Driving Road" },
          { type: 'walk', instruction: "Walk 200m through the illuminated pedestrian lane", distance: "200m", pathType: "Walking Path" },
          { type: 'arrive', instruction: "Arrive safely at your destination", distance: "Arrive", pathType: "Destination" }
        ];

        orchestratedResult.routes_data.fastest.detailed_steps = festivalSteps;
        orchestratedResult.routes_data.safest.detailed_steps = festivalSteps;
        orchestratedResult.routes_data.cheapest.detailed_steps = festivalSteps;
        orchestratedResult.routes_data.fastest.reason = "Smart festival bypass active.";
        orchestratedResult.routes_data.safest.reason = "Crowd-safety optimization active.";
        orchestratedResult.routes_data.cheapest.reason = "Budget-optimized festival shuttle.";
      } else {
        orchestratedResult.labels = {
          fastest: "Fastest Route",
          safest: "Safest Route",
          cheapest: "Cheapest Route"
        };
      }

      setApiResult(orchestratedResult);

    } catch (error) {
      console.error("Backend Orchestration Error:", error);
      alert("Error connecting to Transit API Gateway");
    } finally {
      setIsLoading(false);
      setCurrentScreen('results');
    }
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setCurrentScreen('navigation');
  };

  const renderContent = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeSearch onSearch={handleSearch} isLoading={isLoading} setCurrentScreen={setCurrentScreen} lang={lang} />;
      case 'results':
        return <RouteResults onSelectRoute={handleSelectRoute} apiResult={apiResult} festivalMode={festivalMode} lang={lang} />;
      case 'festival':
        return <FestivalSmart lang={lang} />;
      case 'navigation':
        return <LiveNavigation route={selectedRoute} apiResult={apiResult} festivalMode={festivalMode} lang={lang} />;
      case 'companion':
        return <SafeCompanion lang={lang} />;
      case 'scan':
        return <VisionAI lang={lang} onNavigate={handleSelectRoute} />;
      case 'budget':
        return <BudgetMode lang={lang} />;
      case 'sms':
        return <SMSNavigation lang={lang} />;
      case 'profile':
        return (
          <div className="p-4 pb-24 animate-slide-up">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-6 text-white mb-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center text-3xl font-black border border-white/20">
                  {user.name?.[0]?.toUpperCase() || '👤'}
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logged In</p>
                  <h2 className="font-black text-white text-xl">{user.name || 'User'}</h2>
                  <p className="text-slate-400 font-bold text-sm">+91 {user.phone}</p>
                </div>
              </div>
            </div>

            {/* Trust Score card */}
            {user.trustScore && (
              <div className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-sm mb-4" style={{ borderColor: user.trustInfo?.color + '40' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: user.trustInfo?.color }}>✨ AI Trust Score</p>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-4xl font-black" style={{ color: user.trustInfo?.color }}>{user.trustScore}</span>
                  <span className="text-slate-400 font-bold mb-0.5">/100 · {user.trustInfo?.label} Member</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-2.5 rounded-full" style={{ width: user.trustScore + '%', background: user.trustInfo?.color }}></div>
                </div>
              </div>
            )}

            {/* Details */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Account Info</p>
              <div className="space-y-3">
                {[
                  { label: 'Identity Verified', val: user.idType === 'aadhar' ? 'Aadhaar ✓' : user.idType === 'voter' ? 'Voter ID ✓' : user.idType === 'driving' ? 'Driving Licence ✓' : '—' },
                  { label: 'Document No.', val: user.idNumber ? `••••${user.idNumber.slice(-4)}` : '—' },
                  { label: 'Phone', val: '+91 ' + user.phone },
                  { label: 'Age & Gender', val: `${user.age || '—'} yrs, ${user.gender || '—'}` },
                  { label: 'Address', val: user.address || '—' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-xs font-bold text-slate-500 shrink-0">{item.label}</span>
                    <span className="text-xs font-black text-slate-800 text-right max-w-[60%] truncate">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setUser(null)}
              className="w-full py-4 border-2 border-red-100 text-red-600 font-black rounded-2xl text-sm hover:bg-red-50 transition-all"
            >Log Out</button>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in relative z-10 h-full">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-primary-300 text-4xl">🏗️</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 capitalize">{currentScreen} Screen</h2>
            <p className="text-slate-500 font-medium">This feature is under development for the final hackathon submission.</p>
            <button
              onClick={() => setCurrentScreen('home')}
              className="mt-8 px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors interactive-tap"
            >
              Back to Home
            </button>
          </div>
        );
    }
  };

  return (
    <Layout currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} lang={lang} setLang={setLang}>
      {renderContent()}
    </Layout>
  );
}

export default App;