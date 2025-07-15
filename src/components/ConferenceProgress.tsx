import { ConferenceItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Clock, Package, Flag } from 'lucide-react';

interface ConferenceProgressProps {
  items: ConferenceItem[];
  onFinish: () => void;
}

export const ConferenceProgress = ({ items, onFinish }: ConferenceProgressProps) => {
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Resumo do progresso */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Package className="h-5 w-5 text-primary" />
            Progresso da Conferência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressPercentage} className="h-3" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-success">{completedItems}</p>
              <p className="text-xs text-muted-foreground">Completos</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-warning">{partialItems}</p>
              <p className="text-xs text-muted-foreground">Parciais</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-muted-foreground">{pendingItems}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-destructive">{excessItems}</p>
              <p className="text-xs text-muted-foreground">Excedentes</p>
            </div>
          </div>

          {expiredItems > 0 && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <p className="text-sm font-medium text-warning-foreground">
                  {expiredItems} produto(s) com validade próxima do vencimento
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista detalhada dos itens */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Package className="h-5 w-5 text-primary" />
            Itens da Conferência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-card border border-border rounded-lg hover:shadow-card transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(item.status, item.validadeVencida)}
                      <p className="font-medium text-foreground">{item.descricao}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Código: {item.codigo}</p>
                  </div>
                  {getStatusBadge(item)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantidade NF:</p>
                    <p className="font-semibold">{item.quantidade} {item.unidade}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conferido:</p>
                    <p className={`font-semibold ${
                      item.quantidadeConferida > item.quantidade 
                        ? 'text-destructive' 
                        : item.quantidadeConferida === item.quantidade
                        ? 'text-success'
                        : 'text-warning'
                    }`}>
                      {item.quantidadeConferida} {item.unidade}
                    </p>
                  </div>
                </div>

                {(item.loteConferido || item.validadeConferida) && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {item.loteConferido && (
                        <div>
                          <p className="text-muted-foreground">Lote:</p>
                          <p className="font-semibold">{item.loteConferido}</p>
                        </div>
                      )}
                      {item.validadeConferida && (
                        <div>
                          <p className="text-muted-foreground">Validade:</p>
                          <p className={`font-semibold ${item.validadeVencida ? 'text-warning' : ''}`}>
                            {new Date(item.validadeConferida).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Progresso individual */}
                <div className="mt-3">
                  <Progress 
                    value={(item.quantidadeConferida / item.quantidade) * 100} 
                    className={`h-2 ${
                      item.quantidadeConferida > item.quantidade ? '[&>div]:bg-destructive' : 
                      item.quantidadeConferida === item.quantidade ? '[&>div]:bg-success' : 
                      '[&>div]:bg-warning'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botão finalizar */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onFinish}
          size="xl"
          variant="success"
          className="w-full max-w-sm"
        >
          <Flag className="h-5 w-5 mr-2" />
          Finalizar Conferência
        </Button>
      </div>
    </div>
  );
};