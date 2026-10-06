import { ServicePlan, Language } from '../types';

export const getNexawebPlans = (lang: Language = 'pt-BR'): ServicePlan[] => {
  if (lang === 'en') {
    return [
      {
        id: 'essencial',
        nome: 'ESSENCIAL',
        tagline: 'Professional website to get started',
        preco: 'R$ 1.000',
        prazo: '3–5 days',
        corIdentidade: 'azul',
        descricao: 'Professional website to get started. Ideal for small businesses and independent professionals.',
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
        tagline: 'More features for your business',
        preco: 'R$ 1.700',
        prazo: '5–8 days',
        corIdentidade: 'dourado',
        destaque: true,
        descricao: 'More resources and strategic impact for established businesses looking to stand out and generate contacts.',
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
        tagline: 'A project crafted for you',
        preco: 'Starting from R$ 2.800',
        prazo: 'Custom scope',
        corIdentidade: 'roxo',
        descricao: 'A tailor-made project designed exclusively for your unique brand identity and goals.',
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
        tagline: 'High-impact digital experience',
        preco: 'Starting from R$ 4.500',
        prazo: 'VIP delivery',
        corIdentidade: 'dourado',
        descricao: 'High-impact digital experience featuring top-tier art direction, micro-interactions, and VIP support.',
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
        descricao: 'Sitio profesional para comenzar. Ideal para pequeños negocios y profesionales autónomos.',
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
        tagline: 'Más recursos para su negocio',
        preco: 'R$ 1.700',
        prazo: '5–8 días',
        corIdentidade: 'dourado',
        destaque: true,
        descricao: 'Más recursos y presencia sólida para negocios que buscan liderar su segmento y generar clientes.',
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
        tagline: 'Un proyecto hecho para usted',
        preco: 'A partir de R$ 2.800',
        prazo: 'Según alcance',
        corIdentidade: 'roxo',
        descricao: 'Un proyecto exclusivo hecho para su negocio, con arquitectura a medida y atención estratégica.',
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
        tagline: 'Experiencia digital de alto impacto',
        preco: 'A partir de R$ 4.500',
        prazo: 'Entrega VIP',
        corIdentidade: 'dourado',
        descricao: 'Experiencia digital de alto impacto con dirección de arte exclusiva y nivel superior de sofisticación.',
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
        descricao: 'Site professionnel pour démarrer. Idéal pour indépendants et petites entreprises.',
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
        tagline: 'Davantage de fonctionnalités pour grandir',
        preco: 'R$ 1.700',
        prazo: '5–8 jours',
        corIdentidade: 'dourado',
        destaque: true,
        descricao: 'Davantage de ressources et d’impact pour les entreprises souhaitant affirmer leur crédibilité.',
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
        tagline: 'Un projet conçu pour vous',
        preco: 'À partir de R$ 2.800',
        prazo: 'Selon cahier des charges',
        corIdentidade: 'roxo',
        descricao: 'Un projet conçu sur mesure selon vos exigences et votre identité de marque.',
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
        tagline: 'Expérience digitale à fort impact',
        preco: 'À partir de R$ 4.500',
        prazo: 'Suivi VIP',
        corIdentidade: 'dourado',
        descricao: 'Expérience digitale d’excellence avec direction artistique d’élite et suivi VIP.',
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
        descricao: 'Sítio profissional para começar. Ideal para pequenos negócios e profissionais liberais.',
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
        tagline: 'Mais funcionalidades para o seu negócio',
        preco: 'R$ 1.700',
        prazo: '5–8 dias',
        corIdentidade: 'dourado',
        destaque: true,
        descricao: 'Mais recursos para o seu negócio. Ideal para marcas que procuram destacar diferenciais e gerar contactos.',
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
        tagline: 'Um projeto feito para si',
        preco: 'A partir de R$ 2.800',
        prazo: 'Sob consulta',
        corIdentidade: 'roxo',
        descricao: 'Um projeto feito para si, com arquitetura própria e acompanhamento consultivo da NexaWeb.',
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
        tagline: 'Experiência digital de alto impacto',
        preco: 'A partir de R$ 4.500',
        prazo: 'Acompanhamento VIP',
        corIdentidade: 'dourado',
        descricao: 'Experiência digital de alto impacto com direção de arte de topo e microinterações de prestígio.',
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
      descricao: 'Site profissional para começar. Ideal para pequenos negócios e profissionais autônomos.',
      recursos: [
        'Apresentação completa do negócio, serviços e diferenciais',
        'Estrutura Home, Sobre, Serviços, Informações e Contato',
        'Botão fixo de WhatsApp e links para redes sociais',
        'Layout responsivo',
        'SEO básico com título, descrição e meta',
        'Hospedagem em nuvem + SSL',
        'Aprovação antes da publicação'
      ],
      projetosRelacionados: ['demo-barbearia-kings']
    },
    {
      id: 'profissional',
      nome: 'PROFISSIONAL',
      tagline: 'Mais recursos para o seu negócio',
      preco: 'R$ 1.700',
      prazo: '5–8 dias',
      corIdentidade: 'dourado',
      destaque: true,
      descricao: 'Mais recursos para o seu negócio. A escolha mais procurada por empresas para gerar autoridade e atrair clientes.',
      recursos: [
        'Estrutura mais completa',
        'Seções estratégicas',
        'CTAs otimizados',
        'Destaques interativos',
        'Core Web Vitals de alta velocidade',
        'Redes sociais e e-mail corporativo',
        'Formulários avançados de contato',
        'Responsividade refinada para celular',
        'Aprovação de projeto'
      ],
      projetosRelacionados: ['demo-salao-premium', 'demo-academia-premium']
    },
    {
      id: 'personalizado',
      nome: 'PERSONALIZADO',
      tagline: 'Um projeto feito para você',
      preco: 'A partir de R$ 2.800',
      prazo: 'Conforme escopo',
      corIdentidade: 'roxo',
      descricao: 'Um projeto feito para você. Estrutura sob medida, visual exclusivo e suporte consultivo da NexaWeb.',
      recursos: [
        'Visual personalizado',
        'Identidade visual sob medida',
        'Estrutura sob medida',
        'Referências e moodboard alinhados',
        'Recursos personalizados',
        'Briefing interativo',
        'Suporte consultivo'
      ],
      projetosRelacionados: ['demo-imobiliaria-premium', 'demo-restaurante-premium']
    },
    {
      id: 'premium',
      nome: 'PREMIUM',
      tagline: 'Experiência digital de alto impacto',
      preco: 'A partir de R$ 4.500',
      prazo: 'Atendimento VIP',
      corIdentidade: 'dourado',
      descricao: 'Experiência digital de alto impacto. Direção de arte exclusiva, microinterações e máxima autoridade de mercado.',
      recursos: [
        'Direção de arte refinada',
        'Apresentação premium',
        'Microinterações exclusivas',
        'Experiências diferenciadas',
        'Copywriting persuasivo e estratégico',
        'Suporte VIP prioritário',
        'Recursos conforme escopo'
      ],
      projetosRelacionados: ['demo-clinica-saude']
    }
  ];
};

export const NEXAWEB_PLANS = getNexawebPlans('pt-BR');
