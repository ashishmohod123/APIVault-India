import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import DemoUserBanner from './components/DemoUserBanner';
import MarketplacePage from './pages/MarketplacePage';
import ApiDetailPage from './pages/ApiDetailPage';
import DeveloperDashboard from './pages/DeveloperDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApiKeyModal from './components/ApiKeyModal';
import AuthModal from './pages/AuthModal';
import { Terminal, Heart, Sparkles } from 'lucide-react';

function AppContent() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('marketplace'); // marketplace, detail, dashboard, admin
  const [selectedApi, setSelectedApi] = useState(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSelectApi = (apiItem) => {
    setSelectedApi(apiItem);
    setActiveTab('detail');
  };

  const handleBackToMarketplace = () => {
    setSelectedApi(null);
    setActiveTab('marketplace');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-devDark-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1-Click Demo Switcher Banner */}
      <DemoUserBanner setActiveTab={setActiveTab} />

      {/* Main Developer Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'marketplace') setSelectedApi(null);
          setActiveTab(tab);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Main Page Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'marketplace' && (
          <MarketplacePage onSelectApi={handleSelectApi} />
        )}

        {activeTab === 'detail' && selectedApi && (
          <ApiDetailPage
            selectedApi={selectedApi}
            onBack={handleBackToMarketplace}
            onOpenKeyModal={() => setIsKeyModalOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DeveloperDashboard
            onOpenKeyModal={() => setIsKeyModalOpen(true)}
          />
        )}

        {activeTab === 'admin' && isAdmin && (
          <AdminDashboard />
        )}
      </main>

      {/* Footer with Developer & Location Credits */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-devDark-900 py-8 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">APIVault India</span>
            <span>— Developer API Marketplace & Metered Gateway Engine</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Architected & Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>by</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Ashish Mohod</strong>
            <span>(Nagpur, Maharashtra)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
