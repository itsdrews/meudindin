import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation'
import { Header } from '../components/Header';
import { OverviewScreen } from '../components/OverviewScreen';
import { TransactionsScreen } from '../components/TransactionsScreen';
import { AccountsScreen } from '../components/AccountsScreen';
import { GoalsScreen } from '../components/GoalsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('01/08/2025');
  const [endDate, setEndDate] = useState('24/08/2025');

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewScreen searchQuery={searchQuery} />;
      case 'transactions':
        return <TransactionsScreen searchQuery={searchQuery} />;
      case 'accounts':
        return <AccountsScreen searchQuery={searchQuery} />;
      case 'goals':
        return <GoalsScreen searchQuery={searchQuery} />;
      default:
        return <OverviewScreen searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Container with Premium Design */}
      <div className="max-w-md mx-auto min-h-screen relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20 pointer-events-none" />
        
        {/* Glass Container */}
        <div className="relative z-10 min-h-screen glass border-x border-white/20 dark:border-slate-700/30">
          {/* Header */}
          <Header
            isDarkMode={isDarkMode}
            onThemeToggle={handleThemeToggle}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            showDatePicker={activeTab === 'overview'}
          />

          {/* Content with smooth transitions */}
          <main className="relative transition-premium">
            {renderActiveScreen()}
          </main>

          {/* Navigation */}
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        {/* Floating Gradient Orbs for Visual Appeal */}
        <div className="absolute top-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 -right-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}