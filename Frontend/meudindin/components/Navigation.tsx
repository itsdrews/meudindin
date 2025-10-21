import { Home, ArrowUpDown, Wallet, Target } from 'lucide-react-native';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Visão Geral', icon: Home },
  { id: 'transactions', label: 'Transações', icon: ArrowUpDown },
  { id: 'accounts', label: 'Contas', icon: Wallet },
  { id: 'goals', label: 'Metas', icon: Target },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
      {/* Glass Navigation Container */}
      <div className="mx-4 mb-4 glass rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-premium overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-slate-800/20 dark:via-slate-800/10 dark:to-slate-800/20" />
        
        <div className="relative flex items-center justify-around p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  group relative flex flex-col items-center justify-center p-3 rounded-xl transition-premium
                  ${isActive 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/20 dark:hover:bg-slate-700/20'
                  }
                `}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-sm" />
                )}
                
                {/* Icon with Animation */}
                <Icon 
                  className={`
                    w-5 h-5 mb-1 transition-premium
                    ${isActive ? 'text-white' : 'group-hover:scale-110'}
                  `} 
                />
                
                {/* Label */}
                <span 
                  className={`
                    text-xs font-medium transition-premium
                    ${isActive 
                      ? 'text-white' 
                      : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                    }
                  `}
                >
                  {tab.label}
                </span>
                
                {/* Ripple Effect on Hover */}
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Safe Area for iPhone */}
      <div className="h-6 bg-transparent" />
    </nav>
  );
}