import { useState } from 'react';
import { Search, Sun, Moon, Calendar, ChevronDown } from 'lucide-react-native';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DatePicker } from './DatePicker';

interface HeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
  showDatePicker: boolean;
}

export function Header({
  isDarkMode,
  onThemeToggle,
  searchQuery,
  onSearchChange,
  startDate,
  endDate,
  onDateChange,
  showDatePicker
}: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showDateSelector, setShowDateSelector] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 dark:border-slate-700/30">
      {/* Glass Header with Backdrop Blur */}
      <div className="glass p-4 pb-3">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* App Logo/Icon */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Meu Dindin
              </h1>
              <p className="text-xs text-muted-foreground">Suas finanças em ordem</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="w-9 h-9 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/70 border border-white/20 dark:border-slate-600/30 shadow-sm transition-premium"
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeToggle}
              className="w-9 h-9 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/70 border border-white/20 dark:border-slate-600/30 shadow-sm transition-premium"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Date Picker Row (when enabled) */}
        {showDatePicker && (
          <div className="mb-3">
            <Button
              variant="ghost"
              onClick={() => setShowDateSelector(!showDateSelector)}
              className="w-full h-10 rounded-xl bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 justify-between shadow-sm transition-premium"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">
                  {startDate} - {endDate}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDateSelector ? 'rotate-180' : ''}`} />
            </Button>

            {/* Date Picker Dropdown */}
            {showDateSelector && (
              <div className="mt-2 p-3 rounded-xl glass border border-white/20 dark:border-slate-600/30 shadow-xl">
                <DatePicker
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={onDateChange}
                />
              </div>
            )}
          </div>
        )}

        {/* Search Input (when expanded) */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar transações, categorias..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-600/30 focus:border-blue-400 dark:focus:border-blue-500 shadow-sm transition-premium"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Subtle Gradient Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
    </header>
  );
}