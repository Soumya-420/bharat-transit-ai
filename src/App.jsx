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
  // currentScreen can be: 'home', 'results', 'navigation', 'scan', 'companion', 'budget', 'profile'

  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleSearch = () => {
    setCurrentScreen('results');
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setCurrentScreen('navigation');
  };

  const renderContent = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeSearch onSearch={handleSearch} />;
      case 'results':
        return <RouteResults onSelectRoute={handleSelectRoute} />;
      case 'navigation':
        return <LiveNavigation route={selectedRoute} />;
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
