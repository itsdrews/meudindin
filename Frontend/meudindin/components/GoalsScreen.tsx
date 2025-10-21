import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, Target } from "lucide-react-native";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

interface GoalsScreenProps {
  searchQuery: string;
}

export function GoalsScreen({ searchQuery }: GoalsScreenProps) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      name: "Emergência",
      targetAmount: 10000,
      currentAmount: 6500,
      targetDate: "2025-12-31",
      category: "Reserva"
    },
    {
      id: 2,
      name: "Viagem Europa",
      targetAmount: 15000,
      currentAmount: 3200,
      targetDate: "2026-06-30",
      category: "Lazer"
    },
    {
      id: 3,
      name: "Carro Novo",
      targetAmount: 50000,
      currentAmount: 12000,
      targetDate: "2026-03-31",
      category: "Transporte"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    category: ""
  });

  // Filter goals based on search query
  const filteredGoals = goals.filter(goal =>
    goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    goal.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "0",
      targetDate: "",
      category: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate,
      category: goal.category
    });
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = (goalId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      setGoals(goals.filter(goal => goal.id !== goalId));
    }
  };

  const handleSaveGoal = () => {
    if (!formData.name.trim() || !formData.targetAmount || !formData.targetDate) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const goalData: Omit<Goal, 'id'> = {
      name: formData.name.trim(),
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      targetDate: formData.targetDate,
      category: formData.category.trim() || 'Geral'
    };

    if (editingGoal) {
      // Update existing goal
      setGoals(goals.map(goal => 
        goal.id === editingGoal.id 
          ? { ...goalData, id: editingGoal.id }
          : goal
      ));
    } else {
      // Add new goal
      const newGoal: Goal = {
        ...goalData,
        id: Math.max(...goals.map(g => g.id), 0) + 1
      };
      setGoals([...goals, newGoal]);
    }

    setIsDialogOpen(false);
    setEditingGoal(null);
    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "0",
      targetDate: "",
      category: ""
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Title and Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Metas</h1>
          <p className="text-sm text-muted-foreground">Defina e acompanhe suas metas de economia</p>
        </div>
        <Button size="sm" className="flex items-center gap-2" onClick={handleAddGoal}>
          <Plus className="w-4 h-4" />
          Nova meta
        </Button>
      </div>

      {/* Goals Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total de Metas</span>
            </div>
            <div className="text-xl">{goals.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Concluídas</span>
            </div>
            <div className="text-xl">{goals.filter(g => calculateProgress(g.currentAmount, g.targetAmount) >= 100).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma meta encontrada</p>
            {searchQuery && <p className="text-sm">para "{searchQuery}"</p>}
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const daysRemaining = getDaysRemaining(goal.targetDate);
            
            return (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{goal.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {goal.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Meta: {formatCurrency(goal.targetAmount)} até {formatDate(goal.targetDate)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditGoal(goal)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso: {progress}%</span>
                        <span>{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Footer Info */}
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>
                        {daysRemaining > 0 
                          ? `${daysRemaining} dias restantes`
                          : daysRemaining === 0
                          ? "Vence hoje"
                          : `Venceu há ${Math.abs(daysRemaining)} dias`
                        }
                      </span>
                      <span>
                        Faltam: {formatCurrency(goal.targetAmount - goal.currentAmount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add/Edit Goal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? "Editar Meta" : "Nova Meta"}
            </DialogTitle>
            <DialogDescription>
              {editingGoal 
                ? "Faça as alterações necessárias na sua meta de economia." 
                : "Defina uma nova meta de economia com valor e prazo."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Meta</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Reserva de emergência"
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Ex: Reserva, Lazer, Transporte"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetAmount">Valor Meta (R$)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                  placeholder="10000"
                />
              </div>

              <div>
                <Label htmlFor="currentAmount">Valor Atual (R$)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({...formData, currentAmount: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="targetDate">Data Meta</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveGoal}
                disabled={!formData.name || !formData.targetAmount || !formData.targetDate}
              >
                {editingGoal ? "Atualizar" : "Criar"} Meta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}