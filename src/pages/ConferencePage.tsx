import { useConference } from '@/hooks/useConference';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { NFDetails } from '@/components/NFDetails';
import { ConferenceProgress } from '@/components/ConferenceProgress';
import { ConferenceResults } from '@/components/ConferenceResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ClipboardCheck, Scan, FileText, BarChart3 } from 'lucide-react';

export const ConferencePage = () => {
  const {
    currentStep,
    notaFiscal,
    conferenceItems,
    isLoading,
    processNFBarcode,
    processProductBarcode,
    startConference,
    finishConference,
    resetConference
  } = useConference();

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'scan-nf':
        return <Scan className="h-5 w-5" />;
      case 'nf-details':
        return <FileText className="h-5 w-5" />;
      case 'conference':
        return <ClipboardCheck className="h-5 w-5" />;
      case 'results':
        return <BarChart3 className="h-5 w-5" />;
      default:
        return <Scan className="h-5 w-5" />;
    }
  };

  const getStepTitle = (step: string) => {
    switch (step) {
      case 'scan-nf':
        return 'Escaneie a Nota Fiscal';
      case 'nf-details':
        return 'Dados da Nota Fiscal';
      case 'conference':
        return 'Conferência de Produtos';
      case 'results':
        return 'Resultados';
      default:
        return 'Conferência NF';
    }
  };

  const renderStepIndicator = () => {
    const steps = ['scan-nf', 'nf-details', 'conference', 'results'];
    const currentIndex = steps.indexOf(currentStep);

    return (
      <Card className="w-full max-w-4xl mx-auto mb-6 bg-gradient-card shadow-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  index <= currentIndex 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-border text-muted-foreground'
                }`}>
                  {getStepIcon(step)}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                    index < currentIndex ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold text-foreground">{getStepTitle(currentStep)}</h2>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'scan-nf':
        return (
          <div className="space-y-6">
            {renderStepIndicator()}
            <BarcodeScanner
              title="Leitura da Nota Fiscal"
              placeholder="Digite a chave da nota fiscal"
              onScan={processNFBarcode}
              isLoading={isLoading}
            />
            <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="text-center text-sm text-muted-foreground">
                  Como usar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">1</Badge>
                  <p>Escaneie ou digite a chave da nota fiscal</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">2</Badge>
                  <p>Aguarde o carregamento dos dados</p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">3</Badge>
                  <p>Inicie a conferência dos produtos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'nf-details':
        return (
          <div className="space-y-6">
            {renderStepIndicator()}
            {notaFiscal && (
              <NFDetails 
                notaFiscal={notaFiscal} 
                onStartConference={startConference}
              />
            )}
          </div>
        );

      case 'conference':
        return (
          <div className="space-y-4">
            {renderStepIndicator()}
            <div className="space-y-4">
              <div className="max-w-2xl mx-auto">
                <BarcodeScanner
                  title="Leitura de Produtos"
                  placeholder="Digite o código de barras do produto"
                  onScan={(barcode, lote, validade) => processProductBarcode(barcode, lote, validade)}
                  showLoteFields={true}
                />
              </div>
              
              {/* Lista de itens com quantidades */}
              <div className="space-y-2">
                {conferenceItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-card border border-border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => processProductBarcode(item.codigoBarras[0])}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm leading-tight">{item.descricao}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Código: {item.codigo}
                        </p>
                      </div>
                      <div className="text-right ml-3">
                        <div className={`text-sm font-semibold ${
                          item.quantidadeConferida > item.quantidade 
                            ? 'text-destructive' 
                            : item.quantidadeConferida === item.quantidade
                            ? 'text-success'
                            : 'text-warning'
                        }`}>
                          {item.quantidadeConferida} / {item.quantidade}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.unidade}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Botões de ação */}
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={resetConference}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={finishConference}
                  variant="default"
                  className="flex-1"
                >
                  Finalizar
                </Button>
              </div>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="space-y-6">
            {renderStepIndicator()}
            <ConferenceResults 
              items={conferenceItems}
              onReset={resetConference}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header fixo */}
      {currentStep === 'conference' && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 p-2">
          <div className="container mx-auto">
            <ConferenceProgress 
              items={conferenceItems}
              onFinish={() => {}} // Removido do cabeçalho
              compact={true}
            />
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-2">
        {/* Current Step Content */}
        {renderCurrentStep()}
      </div>
    </div>
  );
};