import { NotaFiscal } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, FileText, Building, Calendar, DollarSign, Package } from 'lucide-react';

interface NFDetailsProps {
  notaFiscal: NotaFiscal;
  onStartConference: () => void;
}

export const NFDetails = ({ notaFiscal, onStartConference }: NFDetailsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Header da NF */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            Nota Fiscal Encontrada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Número:</span>
                <span className="font-semibold">{notaFiscal.numero}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Série:</span>
                <span className="font-semibold">{notaFiscal.serie}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Emissão:</span>
                <span className="font-semibold">{formatDate(notaFiscal.dataEmissao)}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Valor:</span>
                <span className="font-semibold text-success">{formatCurrency(notaFiscal.valor)}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Fornecedor:</span>
            <span className="font-semibold">{notaFiscal.fornecedor}</span>
          </div>

          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total de itens:</span>
            <Badge variant="secondary">{notaFiscal.itens.length} produtos</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Lista de produtos */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Package className="h-5 w-5 text-primary" />
            Produtos para Conferência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notaFiscal.itens.map((item, index) => (
              <div
                key={item.id}
                className="p-3 bg-card border border-border rounded-lg hover:shadow-card transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.descricao}</p>
                    <p className="text-sm text-muted-foreground">Código: {item.codigo}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {item.quantidade} {item.unidade}
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p>Códigos de barras:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.codigoBarras.map((codigo, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {codigo}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botão para iniciar conferência */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onStartConference}
          size="xl"
          className="w-full max-w-sm"
        >
          Iniciar Conferência
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};