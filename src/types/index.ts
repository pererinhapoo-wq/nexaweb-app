export type Language = 'pt' | 'en';

export type WebsiteLanguage = 'pt' | 'en' | 'pt-en';

export type ViewTab = 'home' | 'services' | 'portfolio' | 'project';

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
  linkDemo: string;
}

export interface ServicePlan {
  id: string;
  nome: string;
  tagline: string;
  corIdentidade: 'azul' | 'dourado' | 'roxo';
  destaque?: boolean;
  descricao: string;
  recursos: string[];
}

export interface ProjectBriefingData {
  tipoInicio: 'modelo' | 'segmento' | 'propria';
  modeloEscolhido?: string;
  segmentoEscolhido?: string;
  planoEscolhido?: string;
  nomeNegocio: string;
  descricaoNecessidade: string;
  nomeContato: string;
  whatsappContato: string;
}

