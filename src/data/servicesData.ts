import { ServicePlan, Language, NexawebPlan } from '../types';

export type { NexawebPlan, ServicePlan };

const plansCache: Partial<Record<Language, ServicePlan[]>> = {};

function buildNexawebPlans(lang: Language = 'pt-BR'): ServicePlan[] {
  if (lang === 'en') {
    return [
      {
        id: 'essencial',
        nome: 'ESSENCIAL',
        tagline: 'Professional website to get started',
        preco: 'R$ 1.000',
        prazo: '3–5 days',
        corIdentidade: 'azul',
        descricao: 'For those who are just getting started.',
        recursos: [
          'Professional presentation',
          'Essential structure & sections',
          'Direct contact integration',
          'Social media links',
          '100% mobile responsiveness',
          'Basic Google SEO',
          'Secure cloud hosting',
          'SSL security certificate',
          'Client review & approval'
        ],
        projetosRelacionados: ['demo-barbearia-kings']
      },
      {
        id: 'profissional',
        nome: 'PROFISSIONAL',
        tagline: 'More features and authority for your brand',
        preco: 'R$ 1.700',
        prazo: '5–8 days',
        corIdentidade: 'dourado',
        descricao: 'For businesses that need more features and a strong professional presence.',
        recursos: [
          'More complete site structure',
          'Strategic conversion sections',
          'Optimized CTAs & triggers',
          'Interactive highlights & catalog',
          'Core Web Vitals high performance',
          'Social links & Business Email',
          'Advanced lead capture forms',
          'Full smartphone responsiveness',
          'Client milestone approval'
        ],
        projetosRelacionados: ['demo-salao-premium', 'demo-academia-premium']
      },
      {
        id: 'personalizado',
        nome: 'PERSONALIZADO',
        tagline: 'Project scope dependent',
        preco: 'Starting from R$ 2.800',
        prazo: 'Custom scope',
        corIdentidade: 'roxo',
        descricao: 'For those who need a tailor-made project.',
        recursos: [
          'Custom visual design',
          'Distinctive brand identity',
          'Tailor-made site architecture',
          'Bespoke references & moodboard',
          'Customized interactive features',
          'Collaborative interactive briefing',
          'Dedicated consultative support'
        ],
        projetosRelacionados: ['demo-imobiliaria-premium', 'demo-restaurante-premium']
      },
      {
        id: 'premium',
        nome: 'PREMIUM',
        tagline: 'VIP / custom scope',
        preco: 'Starting from R$ 4.500',
        prazo: 'VIP delivery',
        corIdentidade: 'dourado',
        descricao: 'For advanced projects and more complete digital experiences.',
        recursos: [
          'Master art direction & luxury styling',
          'Premium visual presentation',
          'Refined high-converting micro-interactions',
          'Distinctive custom brand experiences',
          'Strategic copywriting & persuasive text',
          'Priority VIP support & monitoring',
          'Tailored scope resources'
        ],
        projetosRelacionados: ['demo-clinica-saude']
      }
    ];
  }

  if (lang === 'es') {
    return [
      {
        id: 'essencial',
        nome: 'ESENCIAL',
        tagline: 'Sitio profesional para comenzar',
        preco: 'R$ 1.000',
        prazo: '3–5 días',
        corIdentidade: 'azul',
        descricao: 'Para quienes están comenzando.',
        recursos: [
          'Presentación profesional',
          'Estructura esencial de alta conversión',
          'Integración de contacto directo',
          'Integración de redes sociales',
          'Diseño 100% responsivo para móviles',
          'SEO básico para Google',
          'Alojamiento web seguro',
          'Certificado SSL incluido',
          'Aprobación y entrega al cliente'
        ],
        projetosRelacionados: ['demo-barbearia-kings']
      },
      {
        id: 'profissional',
        nome: 'PROFESIONAL',
        tagline: 'Más recursos y autoridad para su negocio',
        preco: 'R$ 1.700',
        prazo: '5–8 días',
        corIdentidade: 'dourado',
        descricao: 'Para negocios que necesitan más recursos y presencia profesional.',
        recursos: [
          'Estructura más completa y secciones ricas',
          'Secciones estratégicas de conversión',
          'Llamadas a la acción (CTAs) de impacto',
          'Destaques interactivos de productos/servicios',
          'Optimización Core Web Vitals de alta velocidad',
          'Enlaces sociales y Correo corporativo',
          'Formularios avanzados de contacto',
          'Responsividad impecable en teléfonos',
          'Aprobación guiada con el cliente'
        ],
        projetosRelacionados: ['demo-salao-premium', 'demo-academia-premium']
      },
      {
        id: 'personalizado',
        nome: 'PERSONALIZADO',
        tagline: 'Alcance dependiente del proyecto',
        preco: 'A partir de R$ 2.800',
        prazo: 'Según alcance',
        corIdentidade: 'roxo',
        descricao: 'Para quienes necesitan un proyecto a medida.',
        recursos: [
          'Diseño visual personalizado',
          'Identidad visual adaptada',
          'Estructura sob medida',
          'Inspiración y referencias guiadas',
          'Funcionalidades interactivas personalizadas',
          'Briefing colaborativo interactivo',
          'Soporte consultivo directo'
        ],
        projetosRelacionados: ['demo-imobiliaria-premium', 'demo-restaurante-premium']
      },
      {
        id: 'premium',
        nome: 'PREMIUM',
        tagline: 'VIP / según alcance',
        preco: 'A partir de R$ 4.500',
        prazo: 'Entrega VIP',
        corIdentidade: 'dourado',
        descricao: 'Para proyectos avanzados y experiencias más completas.',
        recursos: [
          'Dirección de arte exclusiva de lujo',
          'Presentación premium de marca',
          'Microinteracciones dinámicas refinadas',
          'Experiencias diferenciadas y envolventes',
          'Copywriting persuasivo estratégico',
          'Soporte técnico VIP prioritario',
          'Recursos y módulos según alcance'
        ],
        projetosRelacionados: ['demo-clinica-saude']
      }
    ];
  }

  if (lang === 'fr') {
    return [
      {
        id: 'essencial',
        nome: 'ESSENTIEL',
        tagline: 'Site professionnel pour démarrer',
        preco: 'R$ 1.000',
        prazo: '3–5 jours',
        corIdentidade: 'azul',
        descricao: 'Pour ceux qui débutent.',
        recursos: [
          'Présentation professionnelle',
          'Structure essentielle claire',
          'Intégration de contact direct',
          'Réseaux sociaux connectés',
          'Design 100% adapté aux mobiles',
          'Référencement naturel (SEO) de base',
          'Hébergement cloud sécurisé',
          'Certificat de sécurité SSL',
          'Validation et approbation client'
        ],
        projetosRelacionados: ['demo-barbearia-kings']
      },
      {
        id: 'profissional',
        nome: 'PROFESSIONNEL',
        tagline: 'Davantage de fonctionnalités et d’autorité',
        preco: 'R$ 1.700',
        prazo: '5–8 jours',
        corIdentidade: 'dourado',
        descricao: 'Pour les entreprises nécessitant davantage de fonctionnalités et une présence professionnelle forte.',
        recursos: [
          'Structure approfondie et complète',
          'Sections stratégiques de conversion',
          'Appels à l’action (CTA) ciblés',
          'Mise en valeur interactive des services',
          'Optimisation Core Web Vitals ultra-rapide',
          'Réseaux sociaux et Email professionnel',
          'Formulaires avancés de contact',
          'Ergonomie fluide sur smartphones',
          'Validation par étapes'
        ],
        projetosRelacionados: ['demo-salao-premium', 'demo-academia-premium']
      },
      {
        id: 'personalizado',
        nome: 'SUR MESURE',
        tagline: 'Périmètre selon le projet',
        preco: 'À partir de R$ 2.800',
        prazo: 'Selon cahier des charges',
        corIdentidade: 'roxo',
        descricao: 'Pour ceux qui ont besoin d’un projet sur mesure.',
        recursos: [
          'Conception visuelle personnalisée',
          'Identité visuelle harmonisée',
          'Architecture sur mesure',
          'Cahier de références & design dédié',
          'Modules interactifs selon vos besoins',
          'Briefing interactif et guidé',
          'Accompagnement consultatif dédié'
        ],
        projetosRelacionados: ['demo-imobiliaria-premium', 'demo-restaurante-premium']
      },
      {
        id: 'premium',
        nome: 'PREMIUM',
        tagline: 'VIP / selon périmètre',
        preco: 'À partir de R$ 4.500',
        prazo: 'Suivi VIP',
        corIdentidade: 'dourado',
        descricao: 'Pour les projets avancés et les expériences plus complètes.',
        recursos: [
          'Direction artistique de prestige',
          'Présentation graphique haut de gamme',
          'Micro-interactions fluides et soignées',
          'Expériences immersives mémorables',
          'Copywriting persuasif sur mesure',
          'Support et accompagnement VIP prioritaire',
          'Ressources techniques selon le périmètre'
        ],
        projetosRelacionados: ['demo-clinica-saude']
      }
    ];
  }

  if (lang === 'pt-PT') {
    return [
      {
        id: 'essencial',
        nome: 'ESSENCIAL',
        tagline: 'Sítio profissional para começar',
        preco: 'R$ 1.000',
        prazo: '3–5 dias',
        corIdentidade: 'azul',
        descricao: 'Para quem está a começar.',
        recursos: [
          'Apresentação profissional',
          'Estrutura essencial focada',
          'Integração de contacto direto',
          'Redes sociais integradas',
          'Responsividade total para telemóveis',
          'SEO básico para motores de busca',
          'Alojamento em nuvem seguro',
          'Certificado de segurança SSL',
          'Aprovação do cliente'
        ],
        projetosRelacionados: ['demo-barbearia-kings']
      },
      {
        id: 'profissional',
        nome: 'PROFISSIONAL',
        tagline: 'Mais recursos e autoridade para fortalecer a sua marca no mercado',
        preco: 'R$ 1.700',
        prazo: '5–8 dias',
        corIdentidade: 'dourado',
        descricao: 'Para negócios que precisam de mais recursos e presença profissional.',
        recursos: [
          'Estrutura mais completa',
          'Secções estratégicas de conversão',
          'Chamadas para ação (CTAs) eficientes',
          'Destaques interativos de catálogo',
          'Otimização Core Web Vitals de alta velocidade',
          'Redes sociais e correio eletrónico',
          'Formulários avançados',
          'Responsividade refinada',
          'Aprovação em etapas com o cliente'
        ],
        projetosRelacionados: ['demo-salao-premium', 'demo-academia-premium']
      },
      {
        id: 'personalizado',
        nome: 'PERSONALIZADO',
        tagline: 'Âmbito dependente do projeto',
        preco: 'A partir de R$ 2.800',
        prazo: 'Sob consulta',
        corIdentidade: 'roxo',
        descricao: 'Para quem precisa de um projeto sob medida.',
        recursos: [
          'Visual personalizado',
          'Identidade visual à medida',
          'Estrutura sob medida',
          'Referências e alinhamento dedicado',
          'Recursos personalizados',
          'Briefing interativo e estruturado',
          'Apoio e suporte consultivo'
        ],
        projetosRelacionados: ['demo-imobiliaria-premium', 'demo-restaurante-premium']
      },
      {
        id: 'premium',
        nome: 'PREMIUM',
        tagline: 'VIP / conforme o âmbito',
        preco: 'A partir de R$ 4.500',
        prazo: 'Acompanhamento VIP',
        corIdentidade: 'dourado',
        descricao: 'Para projetos avançados e experiências mais completas.',
        recursos: [
          'Direção de arte e estilo de prestígio',
          'Apresentação premium exclusiva',
          'Microinterações fluidas',
          'Experiências diferenciadas de navegação',
          'Copywriting persuasivo e estratégico',
          'Acompanhamento e suporte VIP',
          'Recursos avançados conforme o âmbito'
        ],
        projetosRelacionados: ['demo-clinica-saude']
      }
    ];
  }

  // pt-BR (padrão)
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
