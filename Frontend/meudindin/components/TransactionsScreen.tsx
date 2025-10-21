import { useState } from "react";
import { Plus, Filter, TrendingUp, TrendingDown } from "lucide-react-native";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Transaction {
  id: number;
  date: string;
  description: string;
  account: string;
  category: string;
  type: 'Receita' | 'Despesa';
  tags: string[];
  amount: string;
  amountValue: number;
}

interface TransactionsScreenProps {
  searchQuery: string;
}

export function TransactionsScreen({ searchQuery }: TransactionsScreenProps) {
  const [selectedType, setSelectedType] = useState<string>("Todos");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [selectedAccount, setSelectedAccount] = useState<string>("Todas");

  const transactions: Transaction[] = [
    // RECEITAS - BANCO
    {
      id: 1,
      date: "23/08/2025",
      description: "Salário Mensal",
      account: "Banco",
      category: "Salário",
      type: "Receita",
      tags: ["folha", "mensal"],
      amount: "R$ 5.000,00",
      amountValue: 5000
    },
    {
      id: 2,
      date: "22/08/2025",
      description: "Freelance Design",
      account: "Banco",
      category: "Trabalho Extra",
      type: "Receita",
      tags: ["freelance", "design"],
      amount: "R$ 800,00",
      amountValue: 800
    },
    {
      id: 3,
      date: "21/08/2025",
      description: "Rendimento Investimentos",
      account: "Banco",
      category: "Investimentos",
      type: "Receita",
      tags: ["dividendos", "ações"],
      amount: "R$ 250,75",
      amountValue: 250.75
    },
    {
      id: 4,
      date: "20/08/2025",
      description: "Venda Produto Online",
      account: "Banco",
      category: "Vendas",
      type: "Receita",
      tags: ["ecommerce", "online"],
      amount: "R$ 150,00",
      amountValue: 150
    },

    // RECEITAS - CARTEIRA
    {
      id: 5,
      date: "19/08/2025",
      description: "Dinheiro Encontrado",
      account: "Carteira",
      category: "Outros",
      type: "Receita",
      tags: ["acaso"],
      amount: "R$ 20,00",
      amountValue: 20
    },
    {
      id: 6,
      date: "18/08/2025",
      description: "Troco Devolvido",
      account: "Carteira",
      category: "Outros",
      type: "Receita",
      tags: ["troco"],
      amount: "R$ 5,50",
      amountValue: 5.50
    },

    // RECEITAS - POUPANÇA
    {
      id: 7,
      date: "17/08/2025",
      description: "Juros da Poupança",
      account: "Poupança",
      category: "Investimentos",
      type: "Receita",
      tags: ["juros", "poupança"],
      amount: "R$ 12,30",
      amountValue: 12.30
    },
    {
      id: 8,
      date: "16/08/2025",
      description: "Transferência Emergência",
      account: "Poupança",
      category: "Transferência",
      type: "Receita",
      tags: ["emergência"],
      amount: "R$ 300,00",
      amountValue: 300
    },

    // DESPESAS - BANCO
    {
      id: 9,
      date: "23/08/2025",
      description: "Compras Supermercado",
      account: "Banco",
      category: "Mercado",
      type: "Despesa",
      tags: ["casa", "alimentação"],
      amount: "R$ 420,55",
      amountValue: -420.55
    },
    {
      id: 10,
      date: "23/08/2025",
      description: "Gasolina Posto Shell",
      account: "Banco",
      category: "Transporte",
      type: "Despesa",
      tags: ["carro", "gasolina"],
      amount: "R$ 180,40",
      amountValue: -180.40
    },
    {
      id: 11,
      date: "22/08/2025",
      description: "Jantar Restaurante",
      account: "Banco",
      category: "Restaurante",
      type: "Despesa",
      tags: ["jantar", "família"],
      amount: "R$ 89,90",
      amountValue: -89.90
    },
    {
      id: 12,
      date: "21/08/2025",
      description: "Conta de Luz",
      account: "Banco",
      category: "Contas",
      type: "Despesa",
      tags: ["energia", "casa"],
      amount: "R$ 156,78",
      amountValue: -156.78
    },
    {
      id: 13,
      date: "20/08/2025",
      description: "Netflix Assinatura",
      account: "Banco",
      category: "Entretenimento",
      type: "Despesa",
      tags: ["streaming", "mensal"],
      amount: "R$ 32,90",
      amountValue: -32.90
    },
    {
      id: 14,
      date: "19/08/2025",
      description: "Consulta Médica",
      account: "Banco",
      category: "Saúde",
      type: "Despesa",
      tags: ["médico", "saúde"],
      amount: "R$ 200,00",
      amountValue: -200
    },
    {
      id: 15,
      date: "18/08/2025",
      description: "Curso Online",
      account: "Banco",
      category: "Educação",
      type: "Despesa",
      tags: ["curso", "desenvolvimento"],
      amount: "R$ 97,00",
      amountValue: -97
    },
    {
      id: 16,
      date: "17/08/2025",
      description: "Roupas Shopping",
      account: "Banco",
      category: "Compras",
      type: "Despesa",
      tags: ["roupas", "shopping"],
      amount: "R$ 280,50",
      amountValue: -280.50
    },

    // DESPESAS - CARTEIRA
    {
      id: 17,
      date: "23/08/2025",
      description: "Almoço Self-Service",
      account: "Carteira",
      category: "Restaurante",
      type: "Despesa",
      tags: ["almoço", "trabalho"],
      amount: "R$ 18,50",
      amountValue: -18.50
    },
    {
      id: 18,
      date: "22/08/2025",
      description: "Passagem Ônibus",
      account: "Carteira",
      category: "Transporte",
      type: "Despesa",
      tags: ["ônibus", "transporte público"],
      amount: "R$ 4,50",
      amountValue: -4.50
    },
    {
      id: 19,
      date: "21/08/2025",
      description: "Café da Manhã",
      account: "Carteira",
      category: "Alimentação",
      type: "Despesa",
      tags: ["café", "padaria"],
      amount: "R$ 12,00",
      amountValue: -12
    },
    {
      id: 20,
      date: "20/08/2025",
      description: "Estacionamento",
      account: "Carteira",
      category: "Transporte",
      type: "Despesa",
      tags: ["estacionamento", "centro"],
      amount: "R$ 8,00",
      amountValue: -8
    },
    {
      id: 21,
      date: "19/08/2025",
      description: "Doação Igreja",
      account: "Carteira",
      category: "Doação",
      type: "Despesa",
      tags: ["igreja", "caridade"],
      amount: "R$ 50,00",
      amountValue: -50
    },
    {
      id: 22,
      date: "18/08/2025",
      description: "Remédio Farmácia",
      account: "Carteira",
      category: "Saúde",
      type: "Despesa",
      tags: ["farmácia", "medicamento"],
      amount: "R$ 25,80",
      amountValue: -25.80
    },

    // DESPESAS - POUPANÇA
    {
      id: 23,
      date: "17/08/2025",
      description: "Saque Emergencial",
      account: "Poupança",
      category: "Transferência",
      type: "Despesa",
      tags: ["saque", "emergência"],
      amount: "R$ 500,00",
      amountValue: -500
    },
    {
      id: 24,
      date: "16/08/2025",
      description: "Taxa Bancária",
      account: "Poupança",
      category: "Contas",
      type: "Despesa",
      tags: ["taxa", "banco"],
      amount: "R$ 15,00",
      amountValue: -15
    }
  ];

  // Filter transactions based on selections and search
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === "Todos" || transaction.type === selectedType;
    const matchesCategory = selectedCategory === "Todas" || transaction.category === selectedCategory;
    const matchesAccount = selectedAccount === "Todas" || transaction.account === selectedAccount;
    
    return matchesSearch && matchesType && matchesCategory && matchesAccount;
  });

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        {/* Title and Add Button */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Transações
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredTransactions.length} de {transactions.length} transações
            </p>
          </div>
          <Button 
            size="sm" 
            className="gradient-primary text-white shadow-lg hover:shadow-xl transition-premium px-4 py-2 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova
          </Button>
        </div>

        {/* Filter Section */}
        <div className="card-premium p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtros</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-600/30 transition-premium">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="rounded-xl glass border-white/20 dark:border-slate-600/30">
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Receita">Receitas</SelectItem>
                <SelectItem value="Despesa">Despesas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-600/30 transition-premium">
                <SelectValue placeholder="Categorias" />
              </SelectTrigger>
              <SelectContent className="rounded-xl glass border-white/20 dark:border-slate-600/30">
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="Salário">Salário</SelectItem>
                <SelectItem value="Trabalho Extra">Trabalho Extra</SelectItem>
                <SelectItem value="Investimentos">Investimentos</SelectItem>
                <SelectItem value="Vendas">Vendas</SelectItem>
                <SelectItem value="Transferência">Transferência</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
                <SelectItem value="Mercado">Mercado</SelectItem>
                <SelectItem value="Transporte">Transporte</SelectItem>
                <SelectItem value="Restaurante">Restaurante</SelectItem>
                <SelectItem value="Alimentação">Alimentação</SelectItem>
                <SelectItem value="Contas">Contas</SelectItem>
                <SelectItem value="Entretenimento">Entretenimento</SelectItem>
                <SelectItem value="Saúde">Saúde</SelectItem>
                <SelectItem value="Educação">Educação</SelectItem>
                <SelectItem value="Compras">Compras</SelectItem>
                <SelectItem value="Doação">Doação</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="h-10 rounded-xl bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-600/30 transition-premium">
                <SelectValue placeholder="Contas" />
              </SelectTrigger>
              <SelectContent className="rounded-xl glass border-white/20 dark:border-slate-600/30">
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="Banco">Banco</SelectItem>
                <SelectItem value="Carteira">Carteira</SelectItem>
                <SelectItem value="Poupança">Poupança</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="card-premium p-8 rounded-2xl text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Nenhuma transação encontrada</p>
              {searchQuery && <p className="text-sm text-muted-foreground">para "{searchQuery}"</p>}
            </div>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <div 
              key={transaction.id} 
              className="card-premium p-4 rounded-2xl hover:shadow-xl transition-premium"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  {/* Transaction Icon */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shadow-sm
                    ${transaction.type === 'Receita' 
                      ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30' 
                      : 'bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30'
                    }
                  `}>
                    {transaction.type === 'Receita' ? (
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-card-foreground">{transaction.description}</h3>
                      <Badge 
                        variant={transaction.type === 'Receita' ? 'default' : 'secondary'}
                        className="text-xs px-2 py-0.5 rounded-lg"
                      >
                        {transaction.type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <span>{transaction.account}</span>
                      <span>•</span>
                      <span>{transaction.category}</span>
                    </div>

                    {/* Tags */}
                    {transaction.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {transaction.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 rounded-lg border-white/20 dark:border-slate-600/30">
                            {tag}
                          </Badge>
                        ))}
                        {transaction.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-lg border-white/20 dark:border-slate-600/30">
                            +{transaction.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount and Action */}
                <div className="text-right space-y-2">
                  <div className={`
                    font-bold
                    ${transaction.type === 'Receita' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                    }
                  `}>
                    {transaction.amount}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs px-3 py-1 h-7 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-premium"
                  >
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}