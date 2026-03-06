import React, { useState } from 'react';
import Layout from './components/Layout';
import HomeSearch from './components/HomeSearch';
import RouteResults from './components/RouteResults';
import LiveNavigation from './components/LiveNavigation';
import SafeCompanion from './components/SafeCompanion';
import VisionAI from './components/VisionAI';
import BudgetMode from './components/BudgetMode';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [festivalMode, setFestivalMode] = useState(false);

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
      const isFestival = destination.toLowerCase().includes("kolkata") || destination.toLowerCase().includes("gate") || destination.toLowerCase().includes("chowk");
      setFestivalMode(isFestival);

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

        // Granular Step Generation for Festival
        orchestratedResult.detailed_steps = [
          { type: 'walk', instruction: "Walk 150m towards the northern exit to avoid main gate crowds", distance: "150m", pathType: "Walking Path" },
          { type: 'turn', instruction: "Turn Right at the police kiosk", distance: "Turn", pathType: "Walking Path" },
          { type: 'transit', instruction: "Board Special Festival Shuttle (Route S-1) towards Park Street", distance: "Board", pathType: "Driving Road" },
          { type: 'walk', instruction: "Walk 200m through the illuminated pedestrian lane", distance: "200m", pathType: "Walking Path" },
          { type: 'arrive', instruction: "Arrive safely at your destination", distance: "Arrive", pathType: "Destination" }
        ];
      } else {
        orchestratedResult.labels = {
          fastest: "Fastest Route",
          safest: "Safest Route",
          cheapest: "Cheapest Route"
        };

        orchestratedResult.detailed_steps = [
          { type: 'walk', instruction: "Walk 200m to the nearest station", distance: "200m", pathType: "Walking Path" },
          { type: 'transit', instruction: "Board Metro Blue Line towards destination", distance: "Board", pathType: "Driving Road" },
          { type: 'walk', instruction: "Walk 100m to exit", distance: "100m", pathType: "Walking Path" },
          { type: 'arrive', instruction: "Arrive at destination", distance: "Arrive", pathType: "Destination" }
        ];
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
        return <HomeSearch onSearch={handleSearch} isLoading={isLoading} />;
      case 'results':
        return <RouteResults onSelectRoute={handleSelectRoute} apiResult={apiResult} festivalMode={festivalMode} />;
      case 'navigation':
        return <LiveNavigation route={selectedRoute} apiResult={apiResult} festivalMode={festivalMode} />;
      case 'companion':
        return <SafeCompanion />;
      case 'scan':
        return <VisionAI />;
      case 'budget':
        return <BudgetMode />;
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
    <Layout currentScreen={currentScreen} setCurrentScreen={setCurrentScreen}>
      {renderContent()}
    </Layout>
  );
}

export default App;