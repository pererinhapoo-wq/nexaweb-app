export interface SiteObjectiveOption {
  id: string;
  label: string;
  desc: string;
}

export const SITE_OBJECTIVES: SiteObjectiveOption[] = [
  { id: 'apresentar_negocio', label: 'Apresentar o negócio', desc: 'Fortalecer autoridade e presença institucional da marca' },
  { id: 'receber_contatos', label: 'Receber contatos', desc: 'Canal direto para mensagens no WhatsApp e formulários' },
  { id: 'receber_agendamentos', label: 'Receber agendamentos', desc: 'Facilitar marcação de horários para clientes' },
  { id: 'receber_pedidos', label: 'Receber pedidos', desc: 'Cardápio ou catálogo com envio direto de pedidos' },
  { id: 'vender_produtos', label: 'Vender produtos', desc: 'Vitrine comercial com direcionamento para compra' },
  { id: 'captar_leads', label: 'Captar leads', desc: 'Formulários estratégicos para geração de oportunidades' },
  { id: 'apresentar_portfolio', label: 'Apresentar portfólio', desc: 'Galeria visual com fotos de trabalhos e projetos' },
  { id: 'solicitacoes_orcamento', label: 'Receber solicitações de orçamento', desc: 'Coleta de requisitos para propostas comerciais' },
];

export interface VisualStyleOption {
  id: string;
  label: string;
  desc: string;
}

export const VISUAL_STYLES: VisualStyleOption[] = [
  { id: 'Moderno', label: 'Moderno', desc: 'Visual atual com tipografia limpa e espaçamentos equilibrados' },
  { id: 'Minimalista', label: 'Minimalista', desc: 'Design direto ao ponto, foco no conteúdo essencial e sem excessos' },
  { id: 'Elegante', label: 'Elegante', desc: 'Harmonia visual sofisticada com acabamentos sutis' },
  { id: 'Luxuoso', label: 'Luxuoso', desc: 'Padrão premium com contrastes nobres e refinamento estético' },
  { id: 'Criativo', label: 'Criativo', desc: 'Layout marcante com personalidade autoral e dinâmica diferenciada' },
];

export type BriefingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const BRIEFING_STEP_NAMES: Record<BriefingStep, string> = {
  1: 'Tipo / Origem',
  2: 'Informações Principais',
  3: 'Segmento',
  4: 'Necessidades',
  5: 'Funcionalidades',
  6: 'Visual',
  7: 'Conteúdo & Inspirações',
  8: 'Arquivos',
  9: 'Resumo & Envio',
};
