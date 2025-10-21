import { Plus } from "lucide-react-native";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface Account {
  id: number;
  name: string;
  type: string;
  balance: string;
  balanceValue: number;
}

interface AccountsScreenProps {
  searchQuery: string;
}

export function AccountsScreen({ searchQuery }: AccountsScreenProps) {
  const accounts: Account[] = [
    {
      id: 1,
      name: "Carteira",
      type: "Carteira",
      balance: "R$ 151,10",
      balanceValue: 151.10
    },
    {
      id: 2,
      name: "Banco",
      type: "Corrente",
      balance: "R$ 7.899,05",
      balanceValue: 7899.05
    },
    {
      id: 3,
      name: "Poupança",
      type: "Poupança",
      balance: "R$ 12.000,00",
      balanceValue: 12000.00
    }
  ];

  // Filter accounts based on search query
  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Title and Add Button */}
      <div className="flex items-center justify-between">
        <h1>Contas</h1>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova conta
        </Button>
      </div>

      {/* Accounts List */}
      <div className="space-y-3">
        {filteredAccounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma conta encontrada</p>
            {searchQuery && <p className="text-sm">para "{searchQuery}"</p>}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground px-4 py-2 bg-muted rounded-lg">
              <span>NOME</span>
              <span>TIPO</span>
              <span>SALDO ATUAL</span>
              <span>AÇÕES</span>
            </div>

            {/* Account Items */}
            {filteredAccounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div>
                      <div className="font-medium">{account.name}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {account.type}
                    </div>
                    <div className="font-medium">
                      {account.balance}
                    </div>
                    <div>
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}