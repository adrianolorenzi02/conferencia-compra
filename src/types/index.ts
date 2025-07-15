export interface NFItem {
  id: string;
  codigo: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  codigoBarras: string[];
  lote?: string;
  validade?: string;
}

export interface NotaFiscal {
  chave: string;
  numero: string;
  serie: string;
  fornecedor: string;
  dataEmissao: string;
  valor: number;
  itens: NFItem[];
}

export interface ConferenceItem extends NFItem {
  quantidadeConferida: number;
  status: 'pendente' | 'completo' | 'excedente' | 'faltante';
  loteConferido?: string;
  validadeConferida?: string;
  validadeVencida?: boolean;
}

export interface BarcodeResult {
  code: string;
  type: 'nf' | 'product';
  success: boolean;
  message?: string;
}

export type AppStep = 'scan-nf' | 'nf-details' | 'conference' | 'results';