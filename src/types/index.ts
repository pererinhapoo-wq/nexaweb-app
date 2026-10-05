export type LeadStatus =
  | 'Novo'
  | 'Contatado'
  | 'Respondeu'
  | 'Interessado'
  | 'Fechado'
  | 'Perdido';

export interface Lead {
  id: string;
  nomeEmpresa: string;
  segmento: string;
  cidade: string;
  instagram?: string;
  site?: string;
  whatsapp?: string;
  observacoes?: string;
  status: LeadStatus;
  mensagemAbordagem?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export type ViewTab = 'home' | 'find' | 'leads' | 'portfolio';

export interface PortfolioCategory {
  id: string;
  nome: string;
  icone?: string;
}

export interface PortfolioProject {
  id: string;
  titulo: string;
  categoria: string;
  descricaoCurta: string;
  descricaoCompleta: string;
  segmentoAlvo: string;
  tags: string[];
  recursos: string[];
  corDestaque: string;
  linkDemo?: string;
}
