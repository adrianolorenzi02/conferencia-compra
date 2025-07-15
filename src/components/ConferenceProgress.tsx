import { ConferenceItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Clock, Package, Flag } from 'lucide-react';

interface ConferenceProgressProps {
  items: ConferenceItem[];
  onFinish: () => void;
  compact?: boolean;
}

export const ConferenceProgress = ({ items, onFinish, compact = false }: ConferenceProgressProps) => {
  const totalItems = items.length;
  const completedItems = items.filter(item => item.status === 'completo').length;
  const pendingItems = items.filter(item => item.status === 'pendente' && item.quantidadeConferida === 0).length;
  const partialItems = items.filter(item => item.status === 'pendente' && item.quantidadeConferida > 0).length;
  const excessItems = items.filter(item => item.status === 'excedente').length;
  const expiredItems = items.filter(item => item.validadeVencida).length;

  const progressPercentage = (completedItems / totalItems) * 100;

  const getStatusIcon = (status: ConferenceItem['status'], validadeVencida?: boolean) => {
    if (validadeVencida) {
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
    
    switch (status) {
      case 'completo':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'excedente':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (item: ConferenceItem) => {
    if (item.validadeVencida) {
      return <Badge variant="destructive" className="text-xs">Validade próxima</Badge>;
    }
    
    switch (item.status) {
      case 'completo':
        return <Badge variant="default" className="bg-success text-success-foreground text-xs">Completo</Badge>;
      case 'excedente':
        return <Badge variant="destructive" className="text-xs">Excedente</Badge>;
      case 'pendente':
        return item.quantidadeConferida > 0 
          ? <Badge variant="secondary" className="text-xs">Parcial</Badge>
          : <Badge variant="outline" className="text-xs">Pendente</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Pendente</Badge>;
    }
  };

  if (compact) {
    return (
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-4 w-4 text-primary" />
              <div className="grid grid-cols-4 gap-3 text-center text-xs">
                <div>
                  <p className="font-bold text-success">{completedItems}</p>
                  <p className="text-muted-foreground">OK</p>
                </div>
                <div>
                  <p className="font-bold text-warning">{partialItems}</p>
                  <p className="text-muted-foreground">Parc</p>
                </div>
                <div>
                  <p className="font-bold text-muted-foreground">{pendingItems}</p>
                  <p className="text-muted-foreground">Pend</p>
                </div>
                <div>
                  <p className="font-bold text-destructive">{excessItems}</p>
                  <p className="text-muted-foreground">Exc</p>
                </div>
              </div>
            </div>
            <Button onClick={onFinish} size="sm" variant="success">
              <Flag className="h-4 w-4 mr-1" />
              Finalizar
            </Button>
          </div>
          <Progress value={progressPercentage} className="h-2 mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Resumo do progresso */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-foreground text-lg">
            <Package className="h-5 w-5 text-primary" />
            Progresso da Conferência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={progressPercentage} className="h-3" />
          
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="space-y-1">
              <p className="text-xl font-bold text-success">{completedItems}</p>
              <p className="text-xs text-muted-foreground">Completos</p>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-warning">{partialItems}</p>
              <p className="text-xs text-muted-foreground">Parciais</p>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-muted-foreground">{pendingItems}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-destructive">{excessItems}</p>
              <p className="text-xs text-muted-foreground">Excedentes</p>
            </div>
          </div>

          {expiredItems > 0 && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <p className="text-sm font-medium text-warning-foreground">
                  {expiredItems} produto(s) com validade próxima
                </p>
              </div>
            </div>
          )}

          {/* Botão finalizar para versão não compacta */}
          <Button
            onClick={onFinish}
            size="lg"
            variant="success"
            className="w-full"
          >
            <Flag className="h-4 w-4 mr-2" />
            Finalizar Conferência
          </Button>
        </CardContent>
      </Card>

      {/* Lista compacta dos itens */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardContent className="p-3">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-2 bg-card border border-border rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status, item.validadeVencida)}
                      <p className="font-medium text-foreground truncate text-sm">{item.descricao}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className={`text-sm font-semibold ${
                      item.quantidadeConferida > item.quantidade 
                        ? 'text-destructive' 
                        : item.quantidadeConferida === item.quantidade
                        ? 'text-success'
                        : 'text-warning'
                    }`}>
                      {item.quantidadeConferida}/{item.quantidade}
                    </span>
                    {getStatusBadge(item)}
                  </div>
                </div>
                
                {/* Progresso individual compacto */}
                <Progress 
                  value={(item.quantidadeConferida / item.quantidade) * 100} 
                  className={`h-1 mt-1 ${
                    item.quantidadeConferida > item.quantidade ? '[&>div]:bg-destructive' : 
                    item.quantidadeConferida === item.quantidade ? '[&>div]:bg-success' : 
                    '[&>div]:bg-warning'
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};