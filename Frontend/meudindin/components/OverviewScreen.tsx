import { Plus, TrendingUp, TrendingDown, Wallet, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface OverviewScreenProps {
  searchQuery: string;
}

export function OverviewScreen({ searchQuery }: OverviewScreenProps) {
  const [showBalance, setShowBalance] = useState(true);

  const summaryData = {
    totalBalance: 20050.15,
    income: 6538.55,
    expenses: 1619.43,
    growth: 12.5
  };

  const accountDistribution = [
    { name: "Carteira", amount: 151.10, percentage: 0.8, color: "#f59e0b" },
    { name: "Banco", amount: 7899.05, percentage: 39.4, color: "#3b82f6" },
    { name: "Poupança", amount: 12000.00, percentage: 59.8, color: "#10b981" }
  ];

  // Monthly trend data for line chart
  const monthlyData = [
    { month: 'Jan', receitas: 4200, despesas: 2800, saldo: 18500 },
    { month: 'Fev', receitas: 5100, despesas: 3200, saldo: 19400 },
    { month: 'Mar', receitas: 4800, despesas: 2900, saldo: 19300 },
    { month: 'Abr', receitas: 5500, despesas: 3500, saldo: 19300 },
    { month: 'Mai', receitas: 4900, despesas: 3100, saldo: 19100 },
    { month: 'Jun', receitas: 6200, despesas: 2800, saldo: 19500 },
    { month: 'Jul', receitas: 5800, despesas: 3300, saldo: 20000 },
    { month: 'Ago', receitas: 6538, despesas: 1619, saldo: 20050 }
  ];

  // Weekly spending data for bar chart
  const weeklySpending = [
    { day: 'Seg', valor: 125 },
    { day: 'Ter', valor: 89 },
    { day: 'Qua', valor: 234 },
    { day: 'Qui', valor: 156 },
    { day: 'Sex', valor: 298 },
    { day: 'Sáb', valor: 445 },
    { day: 'Dom', valor: 187 }
  ];

  // Categories spending data for pie chart
  const categoriesData = [
    { name: 'Alimentação', value: 520, color: '#ef4444' },
    { name: 'Transporte', value: 340, color: '#f59e0b' },
    { name: 'Entretenimento', value: 180, color: '#8b5cf6' },
    { name: 'Saúde', value: 225, color: '#10b981' },
    { name: 'Outros', value: 354, color: '#6b7280' }
  ];

  const filteredAccounts = accountDistribution.filter(account =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-xl border border-white/20 dark:border-slate-600/30 shadow-xl">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Visão Geral
            </h1>
            <p className="text-sm text-muted-foreground">Suas finanças em um só lugar</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalance(!showBalance)}
            className="w-9 h-9 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/70 border border-white/20 dark:border-slate-600/30 shadow-sm transition-premium"
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Button size="sm" className="gradient-primary text-white shadow-lg hover:shadow-xl transition-premium px-4 py-2 rounded-xl whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Nova transação
          </Button>
          <Button variant="ghost" size="sm" className="bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/70 border border-white/20 dark:border-slate-600/30 rounded-xl whitespace-nowrap transition-premium">
            <Plus className="w-4 h-4 mr-2" />
            Conta
          </Button>
          <Button variant="ghost" size="sm" className="bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/70 border border-white/20 dark:border-slate-600/30 rounded-xl whitespace-nowrap transition-premium">
            <Plus className="w-4 h-4 mr-2" />
            Orçamento
          </Button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="space-y-4">
        {/* Main Balance Card */}
        <div className="card-premium p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Total</p>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  {showBalance ? formatCurrency(summaryData.totalBalance) : "••••••"}
                </h2>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{summaryData.growth}%
              </div>
              <p className="text-xs text-muted-foreground">vs mês anterior</p>
            </div>
          </div>

          {/* Income and Expenses */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-muted-foreground">Receitas</span>
              </div>
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                {showBalance ? formatCurrency(summaryData.income) : "••••••"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-muted-foreground">Despesas</span>
              </div>
              <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                {showBalance ? formatCurrency(summaryData.expenses) : "••••••"}
              </p>
            </div>
          </div>
        </div>

        {/* Account Distribution */}
        <div className="card-premium p-6 rounded-2xl">
          <h3 className="font-semibold mb-4 flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
            Distribuição por Conta
          </h3>
          <div className="space-y-4">
            {filteredAccounts.map((account, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: account.color }}
                    ></div>
                    <span className="text-sm font-medium">{account.name}</span>
                  </div>
                  <span className="font-semibold">
                    {showBalance ? formatCurrency(account.amount) : "••••••"}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${account.percentage}%`,
                      backgroundColor: account.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
            {filteredAccounts.length === 0 && searchQuery && (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma conta encontrada para "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Monthly Trend Chart */}
        <div className="card-premium p-6 rounded-2xl">
          <h3 className="font-semibold mb-4 flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
            Evolução Mensal
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgb(148, 163, 184)' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgb(148, 163, 184)' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="receitas"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorReceitas)"
                />
                <Area
                  type="monotone"
                  dataKey="despesas"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDespesas)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Spending and Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly Spending Bar Chart */}
          <div className="card-premium p-6 rounded-2xl">
            <h3 className="font-semibold mb-4 flex items-center">
              <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
              Gastos Semanais
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'rgb(148, 163, 184)' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'rgb(148, 163, 184)' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="valor" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories Pie Chart */}
          <div className="card-premium p-6 rounded-2xl">
            <h3 className="font-semibold mb-4 flex items-center">
              <div className="w-2 h-2 rounded-full bg-violet-500 mr-3"></div>
              Gastos por Categoria
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoriesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Valor']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoriesData.map((category, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-muted-foreground truncate">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}