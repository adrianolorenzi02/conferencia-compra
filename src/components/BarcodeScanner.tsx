import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Keyboard } from 'lucide-react';

interface BarcodeScannerProps {
  title: string;
  placeholder: string;
  onScan: (barcode: string, lote?: string, validade?: string) => void;
  isLoading?: boolean;
  showLoteFields?: boolean;
  lastScannedProduct?: string;
}

export const BarcodeScanner = ({ 
  title, 
  placeholder, 
  onScan, 
  isLoading = false,
  showLoteFields = false,
  lastScannedProduct 
}: BarcodeScannerProps) => {
  const [manualMode, setManualMode] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [lote, setLote] = useState('');
  const [validade, setValidade] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      onScan(barcode.trim(), lote.trim() || undefined, validade || undefined);
      setBarcode('');
      setLote('');
      setValidade('');
    }
  };

  const simulateNFScan = () => {
    // Simular leitura de código de barras de NF
    const mockNFCode = '35240114200166000187550010001234561123456789';
    onScan(mockNFCode);
  };

  const simulateProductScan = (productCode: string) => {
    onScan(productCode, lote.trim() || undefined, validade || undefined);
    setLote('');
    setValidade('');
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-card shadow-card border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-foreground">
          <Scan className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scanner visual */}
        <div className="relative bg-black/20 rounded-lg p-4 border-2 border-dashed border-primary/30">
          <div className="h-48 flex items-center justify-center relative overflow-hidden">
            <div className="text-muted-foreground text-center">
              <Scan className="h-12 w-12 mx-auto mb-2 text-primary" />
              <p className="text-sm">Posicione o código de barras</p>
              <p className="text-xs opacity-70">na área de leitura</p>
            </div>
            
            {/* Linha de scan animada */}
            <div className="absolute inset-0">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line"></div>
            </div>
          </div>
          
          {/* Botões de simulação */}
          <div className="mt-4 space-y-2">
            {!showLoteFields ? (
              <Button 
                variant="scanner" 
                size="sm" 
                className="w-full"
                onClick={simulateNFScan}
                disabled={isLoading}
              >
                Simular Leitura NF
              </Button>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => simulateProductScan('7891234567890')}
                  disabled={isLoading}
                >
                  Biscoito (EAN13)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => simulateProductScan('17891234567897012345')}
                  disabled={isLoading}
                >
                  Biscoito (DUN14)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => simulateProductScan('7899876543210')}
                  disabled={isLoading}
                >
                  Refrigerante
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => simulateProductScan('7895555444333')}
                  disabled={isLoading}
                >
                  Achocolatado
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Modo manual */}
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setManualMode(!manualMode)}
          >
            <Keyboard className="h-4 w-4 mr-2" />
            {manualMode ? 'Ocultar' : 'Entrada Manual'}
          </Button>

          {manualMode && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="barcode">Código de Barras</Label>
                <Input
                  id="barcode"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder={placeholder}
                  className="bg-background/50"
                />
              </div>

              {showLoteFields && (
                <>
                  <div>
                    <Label htmlFor="lote">Lote (opcional)</Label>
                    <Input
                      id="lote"
                      value={lote}
                      onChange={(e) => setLote(e.target.value)}
                      placeholder="Número do lote"
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="validade">Validade (opcional)</Label>
                    <Input
                      id="validade"
                      type="date"
                      value={validade}
                      onChange={(e) => setValidade(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                variant="default" 
                className="w-full"
                disabled={!barcode.trim() || isLoading}
              >
                {isLoading ? 'Processando...' : 'Confirmar'}
              </Button>
            </form>
          )}
        </div>

        {lastScannedProduct && (
          <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-xs text-success-foreground font-medium">Último produto:</p>
            <p className="text-sm text-success-foreground">{lastScannedProduct}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};