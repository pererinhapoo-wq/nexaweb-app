export type Language =
  | 'pt-BR'
  | 'pt-PT'
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'ja'
  | 'zh';

export type WebsiteLanguage =
  | 'pt-BR'
  | 'pt-PT'
  | 'en'
  | 'es'
  | 'fr'
  | 'pt-en'
  | 'other';

export type ViewTab = 'home' | 'services' | 'portfolio' | 'project' | 'settings';

export type ThemeMode = 'dark' | 'light' | 'auto';

export type AnimationMode = 'enabled' | 'reduced';

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
  corIdentidade: 'azul' | 'dourado' | 'roxo' | 'esmeralda';
  destaque?: boolean;
  descricao: string;
  recursos: string[];
}

export interface ProjectBriefingData {
  tipoInicio: 'modelo' | 'segmento' | 'propria';
  modeloEscolhido?: string;
  segmentoEscolhido?: string;
  planoEscolhido?: string;
  idiomaSiteEscolhido: WebsiteLanguage;
  nomeNegocio: string;
  descricaoNecessidade: string;
  nomeContato: string;
  whatsappContato: string;
}

export type InterestOption =
  | 'new_site'
  | 'renew_site'
  | 'ecommerce'
  | 'landing_page'
  | 'not_sure';

export type ObjectiveOption =
  | 'contacts'
  | 'company'
  | 'sell'
  | 'services'
  | 'brand'
  | 'presence'
  | 'not_sure';

export type CustomizationOption =
  | 'simple'
  | 'complete'
  | 'custom'
  | 'need_help';

export interface OnboardingAnswers {
  interest: InterestOption;
  segment: string;
  objective: ObjectiveOption;
  websiteLanguage: WebsiteLanguage;
  customization: CustomizationOption;
}

export interface AlternativePlanOption {
  id: string;
  nome: string;
  tagline: string;
  corIdentidade: 'azul' | 'dourado' | 'roxo' | 'esmeralda';
  motivo: string;
}

export interface ProjectRecommendation {
  planId: string;
  planName: string;
  planTagline: string;
  planColor: 'azul' | 'dourado' | 'roxo' | 'esmeralda';
  projectId?: string;
  projectTitle?: string;
  matchedProjects: PortfolioProject[];
  alternativePlan?: AlternativePlanOption;
  segmentKey: string;
  segmentLabel: string;
  objectiveLabel: string;
  websiteLanguageLabel: string;
  interestLabel: string;
  customizationLabel: string;
  reason: string;
  reasonsList: string[];
  keyFeatures: string[];
}
