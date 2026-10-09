import { Language } from '../../types';

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

export function getSiteObjectives(lang: Language = 'pt-BR'): SiteObjectiveOption[] {
  if (lang === 'en') {
    return [
      { id: 'apresentar_negocio', label: 'Present the business', desc: 'Strengthen authority and institutional brand presence' },
      { id: 'receber_contatos', label: 'Receive inquiries', desc: 'Direct channel for WhatsApp messages and contact forms' },
      { id: 'receber_agendamentos', label: 'Online booking', desc: 'Make scheduling easy and effortless for customers' },
      { id: 'receber_pedidos', label: 'Receive orders', desc: 'Online menu or catalog with direct order checkout' },
      { id: 'vender_produtos', label: 'Sell products', desc: 'Commercial storefront guiding visitors to purchase' },
      { id: 'captar_leads', label: 'Capture leads', desc: 'Strategic opt-in forms for commercial opportunities' },
      { id: 'apresentar_portfolio', label: 'Showcase portfolio', desc: 'Visual gallery with project and work photography' },
      { id: 'solicitacoes_orcamento', label: 'Receive quote requests', desc: 'Structured requirements intake for proposals' },
    ];
  }
  if (lang === 'es') {
    return [
      { id: 'apresentar_negocio', label: 'Presentar el negocio', desc: 'Fortalecer autoridad y presencia institucional de marca' },
      { id: 'receber_contatos', label: 'Recibir contactos', desc: 'Canal directo para mensajes de WhatsApp y formularios' },
      { id: 'receber_agendamentos', label: 'Citas y reservas', desc: 'Facilitar la reserva de horarios para clientes' },
      { id: 'receber_pedidos', label: 'Recibir pedidos', desc: 'Menú o catálogo con envío directo de pedidos' },
      { id: 'vender_produtos', label: 'Vender productos', desc: 'Escaparate comercial con orientación a la compra' },
      { id: 'captar_leads', label: 'Captar clientes potenciales', desc: 'Formularios estratégicos para generar oportunidades' },
      { id: 'apresentar_portfolio', label: 'Mostrar portafolio', desc: 'Galería visual con fotografías de trabajos y proyectos' },
      { id: 'solicitacoes_orcamento', label: 'Recibir solicitudes de presupuesto', desc: 'Recolección de requisitos para propuestas comerciales' },
    ];
  }
  if (lang === 'fr') {
    return [
      { id: 'apresentar_negocio', label: 'Présenter l’activité', desc: 'Renforcer la notoriété et la présence institutionnelle' },
      { id: 'receber_contatos', label: 'Recevoir des prises de contact', desc: 'Canal direct pour messages WhatsApp et formulaires' },
      { id: 'receber_agendamentos', label: 'Prise de rendez-vous', desc: 'Faciliter la réservation de créneaux pour vos clients' },
      { id: 'receber_pedidos', label: 'Prendre des commandes', desc: 'Carte ou catalogue avec transmission directe de commandes' },
      { id: 'vender_produtos', label: 'Vendre des produits', desc: 'Vitrine marchande incitant à l’achat' },
      { id: 'captar_leads', label: 'Capter des prospects (leads)', desc: 'Formulaires stratégiques générateurs d’opportunités' },
      { id: 'apresentar_portfolio', label: 'Exposer son portfolio', desc: 'Galerie photo soignée mettant en valeur vos réalisations' },
      { id: 'solicitacoes_orcamento', label: 'Recevoir des demandes de devis', desc: 'Recueil des besoins pour propositions commerciales' },
    ];
  }
  if (lang === 'pt-PT') {
    return [
      { id: 'apresentar_negocio', label: 'Apresentar o negócio', desc: 'Fortalecer autoridade e presença institucional da marca' },
      { id: 'receber_contatos', label: 'Receber contactos', desc: 'Canal direto para mensagens no WhatsApp e formulários' },
      { id: 'receber_agendamentos', label: 'Receber marcações', desc: 'Facilitar marcação de horários para clientes' },
      { id: 'receber_pedidos', label: 'Receber encomendas', desc: 'Ementa ou catálogo com envio direto de encomendas' },
      { id: 'vender_produtos', label: 'Vender produtos', desc: 'Montra comercial com direcionamento para compra' },
      { id: 'captar_leads', label: 'Captar leads', desc: 'Formulários estratégicos para geração de oportunidades' },
      { id: 'apresentar_portfolio', label: 'Apresentar portfólio', desc: 'Galeria visual com fotos de trabalhos e projetos' },
      { id: 'solicitacoes_orcamento', label: 'Receber pedidos de orçamento', desc: 'Recolha de requisitos para propostas comerciais' },
    ];
  }
  return SITE_OBJECTIVES;
}

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

export function getVisualStyles(lang: Language = 'pt-BR'): VisualStyleOption[] {
  if (lang === 'en') {
    return [
      { id: 'Moderno', label: 'Modern', desc: 'Current look with clean typography and balanced whitespace' },
      { id: 'Minimalista', label: 'Minimalist', desc: 'Straightforward design, focus on essential content without clutter' },
      { id: 'Elegante', label: 'Elegant', desc: 'Sophisticated visual harmony with subtle refined finishes' },
      { id: 'Luxuoso', label: 'Luxurious', desc: 'Premium standard with noble contrasts and aesthetic refinement' },
      { id: 'Criativo', label: 'Creative', desc: 'Striking layout with unique personality and distinctive dynamics' },
    ];
  }
  if (lang === 'es') {
    return [
      { id: 'Moderno', label: 'Moderno', desc: 'Aspecto actual con tipografía limpia y espaciados equilibrados' },
      { id: 'Minimalista', label: 'Minimalista', desc: 'Diseño directo al grano, enfoque en contenido esencial sin excesos' },
      { id: 'Elegante', label: 'Elegante', desc: 'Armonía visual sofisticada con acabados sutiles' },
      { id: 'Luxuoso', label: 'Lujoso', desc: 'Estándar premium con contrastes nobles y refinamiento estético' },
      { id: 'Criativo', label: 'Creativo', desc: 'Diseño llamativo con personalidad propia y dinamismo diferenciado' },
    ];
  }
  if (lang === 'fr') {
    return [
      { id: 'Moderno', label: 'Moderne', desc: 'Allure actuelle avec typographie soignée et respirations équilibrées' },
      { id: 'Minimalista', label: 'Minimaliste', desc: 'Design épuré, centré sur le contenu essentiel sans superflu' },
      { id: 'Elegante', label: 'Élégant', desc: 'Harmonie visuelle raffinée aux finitions subtiles' },
      { id: 'Luxuoso', label: 'Haut de Gamme', desc: 'Standing d’exception aux contrastes nobles et finitions luxueuses' },
      { id: 'Criativo', label: 'Créatif', desc: 'Mise en page audacieuse à forte personnalité et dynamique singulière' },
    ];
  }
  if (lang === 'pt-PT') {
    return [
      { id: 'Moderno', label: 'Moderno', desc: 'Visual atual com tipografia limpa e espaçamentos equilibrados' },
      { id: 'Minimalista', label: 'Minimalista', desc: 'Design direto ao assunto, foco no conteúdo essencial e sem excessos' },
      { id: 'Elegante', label: 'Elegante', desc: 'Harmonia visual sofisticada com acabamentos subtis' },
      { id: 'Luxuoso', label: 'Luxuoso', desc: 'Padrão premium com contrastes nobres e refinamento estético' },
      { id: 'Criativo', label: 'Criativo', desc: 'Layout marcante com personalidade autoral e dinâmica diferenciada' },
    ];
  }
  return VISUAL_STYLES;
}

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

export function getBriefingStepNames(lang: Language = 'pt-BR'): Record<BriefingStep, string> {
  if (lang === 'en') {
    return {
      1: 'Type / Starting Point',
      2: 'Main Information',
      3: 'Industry / Niche',
      4: 'Requirements',
      5: 'Features',
      6: 'Visual Style',
      7: 'Content & Inspirations',
      8: 'Files',
      9: 'Summary & Submit',
    };
  }
  if (lang === 'es') {
    return {
      1: 'Tipo / Origen',
      2: 'Información Principal',
      3: 'Sector / Nicho',
      4: 'Necesidades',
      5: 'Funcionalidades',
      6: 'Estilo Visual',
      7: 'Contenido & Inspiraciones',
      8: 'Archivos',
      9: 'Resumen & Envío',
    };
  }
  if (lang === 'fr') {
    return {
      1: 'Type / Départ',
      2: 'Infos Principales',
      3: 'Secteur / Activité',
      4: 'Besoins Clés',
      5: 'Fonctionnalités',
      6: 'Style Visuel',
      7: 'Contenu & Inspirations',
      8: 'Fichiers',
      9: 'Résumé & Envoi',
    };
  }
  if (lang === 'pt-PT') {
    return {
      1: 'Tipo / Origem',
      2: 'Informações Principais',
      3: 'Segmento',
      4: 'Necessidades',
      5: 'Funcionalidades',
      6: 'Visual',
      7: 'Conteúdo & Inspirações',
      8: 'Ficheiros',
      9: 'Resumo & Envio',
    };
  }
  return BRIEFING_STEP_NAMES;
}
