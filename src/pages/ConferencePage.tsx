import { useConference } from '@/hooks/useConference';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { NFDetails } from '@/components/NFDetails';
import { ConferenceProgress } from '@/components/ConferenceProgress';
import { ConferenceResults } from '@/components/ConferenceResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
          <div className="space-y-6">
            {renderStepIndicator()}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
              {/* Scanner de produtos */}
              <div className="space-y-4">
                <BarcodeScanner
                  title="Leitura de Produtos"
                  placeholder="Digite o código de barras do produto"
                  onScan={(barcode, lote, validade) => processProductBarcode(barcode, lote, validade)}
                  showLoteFields={true}
                />
                
                <Card className="bg-gradient-card shadow-card border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground text-center">
                      Dicas importantes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">•</Badge>
                      <p>Escaneie cada produto individualmente</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">•</Badge>
                      <p>Informe lote e validade quando disponível</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">•</Badge>
                      <p>Verifique produtos com validade inferior a 1 ano</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progresso da conferência */}
              <div>
                <ConferenceProgress 
                  items={conferenceItems}
                  onFinish={finishConference}
                />
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
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Conferência de Nota Fiscal
          </h1>
          <p className="text-muted-foreground">
            Sistema de conferência de produtos para notas fiscais de compra
          </p>
        </div>

        {/* Current Step Content */}
        {renderCurrentStep()}
      </div>
    </div>
  );
};