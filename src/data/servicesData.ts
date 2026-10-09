import { ServicePlan, Language, NexawebPlan } from '../types';

export type { NexawebPlan, ServicePlan };

const plansCache: Partial<Record<Language, ServicePlan[]>> = {};

function buildNexawebPlans(_lang: Language = "pt-BR"): ServicePlan[] {
  return [
    {
      id: 'essencial',
      nome: 'ESSENCIAL',
      tagline: 'Site profissional para começar',
      preco: 'R$ 1.000',
      prazo: '3–5 dias',
      corIdentidade: 'azul',
      descricao: 'Site profissional para começar',
      recursos: [
        'Apresentação completa do negócio, serviços e diferenciais',
        'Estrutura Home, Sobre, Serviços, Informações e Contato',
        'Botão fixo de WhatsApp e links para redes sociais',
        'Layout 100% responsivo para celulares e computadores',
        'SEO básico com título, descrição e meta tags',
        'Hospedagem em nuvem de alta segurança + SSL',
        'Aprovação antes da publicação'
      ],
      projetosRelacionados: ['demo-barbearia-kings']
    },
    {
      id: 'profissional',
      nome: 'PROFISSIONAL',
      tagline: 'Mais recursos e autoridade para fortalecer sua marca no mercado',
      preco: 'R$ 1.700',
      prazo: '5–8 dias',
      corIdentidade: 'dourado',
      descricao: 'Mais recursos e autoridade para fortalecer sua marca no mercado',
      recursos: [
        'Estrutura completa com seções estratégicas de alta conversão',
        'Seções com chamadas de ação (CTAs) otimizadas',
        'Destaques interativos de produtos ou serviços',
        'Performance veloz otimizada para Core Web Vitals',
        'Redes sociais conectadas e e-mail corporativo',
        'Formulários avançados de contato e atendimento',
        'Responsividade refinada e navegação fluida em smartphones',
        'Aprovação de projeto em etapas'
      ],
      projetosRelacionados: ['demo-salao-premium', 'demo-academia-premium']
    },
    {
      id: 'personalizado',
      nome: 'PERSONALIZADO',
      tagline: 'Projeto sob medida conforme escopo',
      preco: 'A partir de R$ 2.800',
      prazo: 'Conforme escopo',
      corIdentidade: 'roxo',
      descricao: 'Projeto sob medida conforme escopo',
      recursos: [
        'Identidade visual autoral sob medida para o negócio',
        'Arquitetura e fluxo de navegação personalizados',
        'Alinhamento detalhado de referências e moodboard visual',
        'Recursos interativos desenvolvidos sob demanda',
        'Briefing interativo e estruturado',
        'Suporte consultivo dedicado da equipe NexaWeb'
      ],
      projetosRelacionados: ['demo-imobiliaria-premium', 'demo-restaurante-premium']
    },
    {
      id: 'premium',
      nome: 'PREMIUM',
      tagline: 'Experiência avançada / solução VIP',
      preco: 'A partir de R$ 4.500',
      prazo: 'VIP / conforme escopo',
      corIdentidade: 'dourado',
      descricao: 'Experiência avançada / solução VIP',
      recursos: [
        'Direção de arte exclusiva e padrão visual refinado',
        'Apresentação premium com máximo impacto e autoridade de marca',
        'Microinterações fluidas e transições dinâmicas de interface',
        'Experiências de navegação marcantes e imersivas',
        'Copywriting persuasivo e direcionamento estratégico de conteúdo',
        'Acompanhamento e suporte VIP prioritário',
        'Módulos e recursos avançados conforme escopo do projeto'
      ],
      projetosRelacionados: ['demo-clinica-saude']
    }
  ];
}

export const getNexawebPlans = (lang: Language = 'pt-BR'): ServicePlan[] => {
  if (!plansCache[lang]) {
    plansCache[lang] = buildNexawebPlans(lang);
  }
  return plansCache[lang]!;
};

export const NEXAWEB_PLANS = getNexawebPlans('pt-BR');
