import { useState, useCallback } from 'react';
import { ConferenceItem, NotaFiscal, AppStep, BarcodeResult } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useConference = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('scan-nf');
  const [notaFiscal, setNotaFiscal] = useState<NotaFiscal | null>(null);
  const [conferenceItems, setConferenceItems] = useState<ConferenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const processNFBarcode = useCallback(async (barcode: string): Promise<BarcodeResult> => {
    setIsLoading(true);
    
    try {
      // Simular busca da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock de dados da NF
      const mockNF: NotaFiscal = {
        chave: barcode,
        numero: '001234',
        serie: '001',
        fornecedor: 'DISTRIBUIDORA ABC LTDA',
        dataEmissao: '2024-01-15',
        valor: 2450.00,
        itens: [
          {
            id: '1',
            codigo: 'PROD001',
            descricao: 'BISCOITO RECHEADO CHOCOLATE 150G',
            quantidade: 24,
            unidade: 'UN',
            codigoBarras: ['7891234567890', '17891234567897012345']
          },
          {
            id: '2',
            codigo: 'PROD002',
            descricao: 'REFRIGERANTE COLA 2L',
            quantidade: 12,
            unidade: 'UN',
            codigoBarras: ['7899876543210', '17899876543217567890']
          },
          {
            id: '3',
            codigo: 'PROD003',
            descricao: 'ACHOCOLATADO PÓ 400G',
            quantidade: 18,
            unidade: 'UN',
            codigoBarras: ['7895555444333', '17895555444330123456']
          }
        ]
      };

      setNotaFiscal(mockNF);
      
      const items: ConferenceItem[] = mockNF.itens.map(item => ({
        ...item,
        quantidadeConferida: 0,
        status: 'pendente'
      }));
      
      setConferenceItems(items);
      setCurrentStep('nf-details');
      
      toast({
        title: "Nota fiscal encontrada!",
        description: `NF ${mockNF.numero} - ${mockNF.fornecedor}`,
      });

      return {
        code: barcode,
        type: 'nf',
        success: true,
        message: 'Nota fiscal carregada com sucesso'
      };
    } catch (error) {
      toast({
        title: "Erro ao buscar nota fiscal",
        description: "Verifique o código de barras e tente novamente",
        variant: "destructive"
      });
      
      return {
        code: barcode,
        type: 'nf',
        success: false,
        message: 'Erro ao buscar dados da nota fiscal'
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processProductBarcode = useCallback((barcode: string, lote?: string, validade?: string): BarcodeResult => {
    if (!notaFiscal) {
      return {
        code: barcode,
        type: 'product',
        success: false,
        message: 'Nenhuma nota fiscal carregada'
      };
    }

    // Buscar produto pelo código de barras
    const foundItem = conferenceItems.find(item =>
      item.codigoBarras.some(codigo => codigo === barcode)
    );

    if (!foundItem) {
      toast({
        title: "Produto não encontrado",
        description: "Este produto não pertence à nota fiscal",
        variant: "destructive"
      });
      
      return {
        code: barcode,
        type: 'product',
        success: false,
        message: 'Produto não encontrado na nota fiscal'
      };
    }

    // Verificar validade se informada
    let validadeVencida = false;
    if (validade) {
      const dataValidade = new Date(validade);
      const umAnoAFrente = new Date();
      umAnoAFrente.setFullYear(umAnoAFrente.getFullYear() + 1);
      
      if (dataValidade < umAnoAFrente) {
        validadeVencida = true;
        toast({
          title: "Atenção: Validade próxima do vencimento",
          description: `Produto vence em menos de 1 ano (${validade})`,
          variant: "destructive"
        });
      }
    }

    // Atualizar quantidade
    const novaQuantidade = foundItem.quantidadeConferida + 1;
    let novoStatus: ConferenceItem['status'];

    if (novaQuantidade > foundItem.quantidade) {
      novoStatus = 'excedente';
      toast({
        title: "Quantidade excedente!",
        description: `${foundItem.descricao} - Quantidade superior à nota fiscal`,
        variant: "destructive"
      });
    } else if (novaQuantidade === foundItem.quantidade) {
      novoStatus = 'completo';
      toast({
        title: "Item completo!",
        description: `${foundItem.descricao} - Conferência finalizada`,
      });
    } else {
      novoStatus = 'pendente';
    }

    setConferenceItems(items =>
      items.map(item =>
        item.id === foundItem.id
          ? {
              ...item,
              quantidadeConferida: novaQuantidade,
              status: novoStatus,
              loteConferido: lote || item.loteConferido,
              validadeConferida: validade || item.validadeConferida,
              validadeVencida: validadeVencida || item.validadeVencida
            }
          : item
      )
    );

    return {
      code: barcode,
      type: 'product',
      success: true,
      message: `Produto adicionado: ${foundItem.descricao}`
    };
  }, [conferenceItems, notaFiscal]);

  const startConference = useCallback(() => {
    setCurrentStep('conference');
  }, []);

  const finishConference = useCallback(() => {
    setCurrentStep('results');
    
    // Atualizar status dos itens
    setConferenceItems(items =>
      items.map(item => ({
        ...item,
        status: item.quantidadeConferida === 0
          ? 'pendente'
          : item.quantidadeConferida < item.quantidade
          ? 'faltante'
          : item.quantidadeConferida === item.quantidade
          ? 'completo'
          : 'excedente'
      }))
    );
    
    toast({
      title: "Conferência finalizada!",
      description: "Verifique os resultados abaixo",
    });
  }, []);

  const resetConference = useCallback(() => {
    setCurrentStep('scan-nf');
    setNotaFiscal(null);
    setConferenceItems([]);
  }, []);

  return {
    currentStep,
    notaFiscal,
    conferenceItems,
    isLoading,
    processNFBarcode,
    processProductBarcode,
    startConference,
    finishConference,
    resetConference,
    setCurrentStep
  };
};