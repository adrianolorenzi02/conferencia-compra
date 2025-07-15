import { ConferenceItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, XCircle, RotateCcw, Download, Package, FileText } from 'lucide-react';

interface ConferenceResultsProps {
  items: ConferenceItem[];
  onReset: () => void;
}

export const ConferenceResults = ({ items, onReset }: ConferenceResultsProps) => {
  const completedItems = items.filter(item => item.status === 'completo');
  const faltanteItems = items.filter(item => item.status === 'faltante' || (item.status === 'pendente' && item.quantidadeConferida === 0));
  const excessItems = items.filter(item => item.status === 'excedente');
  const expiredItems = items.filter(item => item.validadeVencida);

  const totalQuantityNF = items.reduce((sum, item) => sum + item.quantidade, 0);
  const totalQuantityConferida = items.reduce((sum, item) => sum + item.quantidadeConferida, 0);

  const getResultIcon = (type: 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const downloadReport = () => {
    const report = {
      dataConferencia: new Date().toLocaleString('pt-BR'),
      resumo: {
        totalItens: items.length,
        itensCompletos: completedItems.length,
        itensFaltantes: faltanteItems.length,
        itensExcedentes: excessItems.length,
        itensComValidadeProxima: expiredItems.length,
        quantidadeTotal: totalQuantityNF,
        quantidadeConferida: totalQuantityConferida
      },
      detalhes: items.map(item => ({
        codigo: item.codigo,
        descricao: item.descricao,
        quantidadeNF: item.quantidade,
        quantidadeConferida: item.quantidadeConferida,
        status: item.status,
        lote: item.loteConferido,
        validade: item.validadeConferida,
        validadeVencida: item.validadeVencida
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conferencia-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Resumo geral */}
      <Card className="bg-gradient-card shadow-elevated border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="h-6 w-6 text-primary" />
            Resultado da Conferência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                {getResultIcon('success')}
              </div>
              <p className="text-2xl font-bold text-success">{completedItems.length}</p>
              <p className="text-sm text-muted-foreground">Completos</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                {getResultIcon('warning')}
              </div>
              <p className="text-2xl font-bold text-warning">{faltanteItems.length}</p>
              <p className="text-sm text-muted-foreground">Faltantes</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                {getResultIcon('error')}
              </div>
              <p className="text-2xl font-bold text-destructive">{excessItems.length}</p>
              <p className="text-sm text-muted-foreground">Excedentes</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <p className="text-2xl font-bold text-warning">{expiredItems.length}</p>
              <p className="text-sm text-muted-foreground">Validade próxima</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-foreground">{totalQuantityNF}</p>
              <p className="text-sm text-muted-foreground">Quantidade Total (NF)</p>
            </div>
            <div>
              <p className={`text-lg font-semibold ${
                totalQuantityConferida === totalQuantityNF ? 'text-success' : 
                totalQuantityConferida > totalQuantityNF ? 'text-destructive' : 'text-warning'
              }`}>
                {totalQuantityConferida}
              </p>
              <p className="text-sm text-muted-foreground">Quantidade Conferida</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itens com problema */}
      {(faltanteItems.length > 0 || excessItems.length > 0 || expiredItems.length > 0) && (
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Itens que Requerem Atenção
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Itens faltantes */}
            {faltanteItems.length > 0 && (
              <div>
                <h4 className="font-semibold text-warning mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Itens Faltantes ({faltanteItems.length})
                </h4>
                <div className="space-y-2">
                  {faltanteItems.map(item => (
                    <div key={item.id} className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-foreground">{item.descricao}</p>
                          <p className="text-sm text-muted-foreground">
                            Faltam: {item.quantidade - item.quantidadeConferida} {item.unidade}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-warning text-warning">
                          {item.quantidadeConferida}/{item.quantidade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itens excedentes */}
            {excessItems.length > 0 && (
              <div>
                <h4 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Itens Excedentes ({excessItems.length})
                </h4>
                <div className="space-y-2">
                  {excessItems.map(item => (
                    <div key={item.id} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-foreground">{item.descricao}</p>
                          <p className="text-sm text-muted-foreground">
                            Excesso: {item.quantidadeConferida - item.quantidade} {item.unidade}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          {item.quantidadeConferida}/{item.quantidade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itens com validade vencida */}
            {expiredItems.length > 0 && (
              <div>
                <h4 className="font-semibold text-warning mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Produtos com Validade Próxima ({expiredItems.length})
                </h4>
                <div className="space-y-2">
                  {expiredItems.map(item => (
                    <div key={item.id} className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-foreground">{item.descricao}</p>
                          <p className="text-sm text-muted-foreground">
                            Validade: {item.validadeConferida ? new Date(item.validadeConferida).toLocaleDateString('pt-BR') : 'Não informada'}
                          </p>
                          {item.loteConferido && (
                            <p className="text-sm text-muted-foreground">Lote: {item.loteConferido}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="border-warning text-warning">
                          Validade menor que 1 ano
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Todos os itens */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Package className="h-5 w-5 text-primary" />
            Resumo Completo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center p-2 hover:bg-accent/50 rounded-lg transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.descricao}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantidadeConferida}/{item.quantidade} {item.unidade}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.validadeVencida && (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                  {item.status === 'completo' && <CheckCircle className="h-4 w-4 text-success" />}
                  {item.status === 'excedente' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  {(item.status === 'faltante' || (item.status === 'pendente' && item.quantidadeConferida === 0)) && (
                    <XCircle className="h-4 w-4 text-warning" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={downloadReport}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
        >
          <Download className="h-5 w-5 mr-2" />
          Baixar Relatório
        </Button>
        <Button
          onClick={onReset}
          variant="default"
          size="lg"
          className="w-full sm:w-auto"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Nova Conferência
        </Button>
      </div>
    </div>
  );
};