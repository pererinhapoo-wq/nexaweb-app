import { ServicePlan, Language } from '../types';

export const getNexawebPlans = (lang: Language = 'pt-BR'): ServicePlan[] => {
  if (lang === 'en') {
    return [
      {
        id: 'essencial',
        nome: 'ESSENCIAL',
        tagline: 'Professional website to get started',
        corIdentidade: 'azul',
        descricao: 'Ideal for independent professionals and small businesses needing an impactful, fast, and professional digital presence.',
        recursos: [
          'Professional single-page landing page',
          'Responsive design for mobile, tablet, and desktop',
          'Direct WhatsApp contact buttons',
          'Optimized fast loading speed',
          'Services & products showcase section',
          'Secure hosting & SSL certificate included'
        ]
      },
      {
        id: 'profissional',
        nome: 'PROFISSIONAL',
        tagline: 'More features for your business',
        corIdentidade: 'dourado',
        destaque: true,
        descricao: 'The top choice for established companies looking to attract new clients, build brand authority, and highlight their key differentiators.',
        recursos: [
          'Multi-page structure or in-depth sections',
          'Interactive catalog of services or products',
          'Smart client inquiry form',
          'Complete Google SEO optimization',
          'Google Maps and review integration',
          'Custom premium layout with tailored typography and palette',
          'Floating personalized customer service button'
        ]
      },
      {
        id: 'premium',
        nome: 'PREMIUM',
        tagline: 'Maximum authority and digital prominence',
        corIdentidade: 'esmeralda',
        descricao: 'High-end design, advanced animations, and robust lead capture for brands seeking maximum market credibility and online excellence.',
        recursos: [
          'Exclusive luxury visual layout tailored to your brand',
          'Advanced Google SEO Master positioning',
          'High-converting micro-interactions and smooth effects',
          'Strategic customer conversion and multi-channel triage',
          'Blazing fast cloud hosting with global SSL',
          'Priority VIP maintenance and technical monitoring'
        ]
      },
      {
        id: 'personalizado',
        nome: 'PERSONALIZADO',
        tagline: 'A custom project crafted for you',
        corIdentidade: 'roxo',
        descricao: 'Tailor-made development featuring exclusive architecture, custom functionalities, and direct strategic support from NexaWeb.',
        recursos: [
          '100% custom project built for your unique business',
          'Specific systems (online booking, custom menu, dynamic portfolio)',
          'Strategic persuasive copywriting aligned with your audience',
          'Integration with management tools and CRM',
          'Advanced performance and metrics optimization',
          'Priority dedicated support and guidance'
        ]
      }
    ];
  }

  if (lang === 'es') {
    return [
      {
        id: 'essencial',
        nome: 'ESENCIAL',
        tagline: 'Sitio web profesional para comenzar',
        corIdentidade: 'azul',
        descricao: 'Ideal para profesionales autónomos y pequeños negocios que necesitan presencia digital profesional con rapidez y alto impacto.',
        recursos: [
          'Landing page profesional de página única',
          'Diseño responsivo para móvil, tablet y ordenador',
          'Botones de contacto directo hacia WhatsApp',
          'Velocidad de carga ultra rápida optimizada',
          'Sección para mostrar servicios o productos',
          'Alojamiento web seguro y certificado SSL incluidos'
        ]
      },
      {
        id: 'profissional',
        nome: 'PROFESIONAL',
        tagline: 'Más recursos para su negocio',
        corIdentidade: 'dourado',
        destaque: true,
        descricao: 'La opción más elegida por empresas consolidadas que buscan atraer nuevos clientes, reforzar la autoridad de la marca y destacar sus ventajas.',
        recursos: [
          'Estructura multisección o multipágina completa',
          'Catálogo interactivo de servicios o productos',
          'Formulario inteligente de captación de clientes',
          'Optimización completa de SEO para Google',
          'Integración con Google Maps y opiniones',
          'Diseño visual exclusivo con tipografía a medida',
          'Botón flotante de atención personalizada'
        ]
      },
      {
        id: 'premium',
        nome: 'PREMIUM',
        tagline: 'Máxima autoridad y excelencia digital',
        corIdentidade: 'esmeralda',
        descricao: 'Diseño de alto estándar, animaciones refinadas y captación estratégica de clientes para marcas que exigen distinción en el mercado.',
        recursos: [
          'Diseño visual exclusivo de lujo adaptado a su marca',
          'Posicionamiento avanzado Google SEO Master',
          'Microinteracciones y efectos de alto impacto',
          'Canal prioritario de captación multicanal y WhatsApp',
          'Alojamiento en la nube ultra veloz con SSL',
          'Soporte técnico y monitorización VIP prioritaria'
        ]
      },
      {
        id: 'personalizado',
        nome: 'PERSONALIZADO',
        tagline: 'Un proyecto hecho a su medida',
        corIdentidade: 'roxo',
        descricao: 'Desarrollo exclusivo con arquitectura única, funciones avanzadas y acompañamiento estratégico directo de NexaWeb.',
        recursos: [
          'Proyecto 100% exclusivo diseñado para su negocio',
          'Sistemas específicos (reservas, menú digital, catálogo dinámico)',
          'Textos persuasivos orientados a la conversión',
          'Integración con herramientas de gestión o CRM',
          'Optimización avanzada de rendimiento y analítica',
          'Soporte prioritario y asesoramiento directo'
        ]
      }
    ];
  }

  if (lang === 'fr') {
    return [
      {
        id: 'essencial',
        nome: 'ESSENTIEL',
        tagline: 'Site professionnel pour démarrer',
        corIdentidade: 'azul',
        descricao: 'Idéal pour indépendants et petites entreprises ayant besoin d’une présence numérique moderne, rapide et percutante.',
        recursos: [
          'Landing page professionnelle d’une page',
          'Design 100% adapté aux smartphones et ordinateurs',
          'Boutons d’accès direct vers WhatsApp',
          'Vitesse de chargement ultra rapide',
          'Section de présentation des services ou produits',
          'Hébergement sécurisé et certificat SSL inclus'
        ]
      },
      {
        id: 'profissional',
        nome: 'PROFESSIONNEL',
        tagline: 'Davantage de fonctionnalités pour grandir',
        corIdentidade: 'dourado',
        destaque: true,
        descricao: 'Le choix privilégié des entreprises établies pour attirer de nouveaux prospects, asseoir leur crédibilité et valoriser leurs atouts.',
        recursos: [
          'Structure multi-pages ou sections approfondies',
          'Catalogue interactif de services ou produits',
          'Formulaire intelligent de qualification des contacts',
          'Optimisation complète du référencement naturel (SEO)',
          'Intégration Google Maps et avis clients',
          'Identité graphique soignée et sur mesure',
          'Bouton flottant d’assistance rapide'
        ]
      },
      {
        id: 'premium',
        nome: 'PREMIUM',
        tagline: 'Autorité maximale et prestige digital',
        corIdentidade: 'esmeralda',
        descricao: 'Design haut de gamme exclusif, animations raffinées et acquisition stratégique pour les marques visant l’excellence.',
        recursos: [
          'Identité visuelle de prestige conçue pour votre marque',
          'Référencement naturel de pointe (Google SEO Master)',
          'Micro-interactions fluides et dynamisme soigné',
          'Acquisition de prospects qualifiés et WhatsApp direct',
          'Hébergement cloud ultra rapide avec certificat SSL',
          'Support technique prioritaire et suivi VIP'
        ]
      },
      {
        id: 'personalizado',
        nome: 'SUR MESURE',
        tagline: 'Un projet conçu exclusivement pour vous',
        corIdentidade: 'roxo',
        descricao: 'Conception sur mesure dotée d’une architecture unique, de fonctionnalités spécifiques et du suivi stratégique direct de NexaWeb.',
        recursos: [
          'Projet 100% sur mesure pour votre secteur',
          'Modules dédiés (prise de rendez-vous, carte en ligne, portfolio)',
          'Rédaction persuasive alignée sur votre audience',
          'Intégration aux outils de gestion et CRM',
          'Optimisation avancée des performances et métriques',
          'Accompagnement et support prioritaire dédié'
        ]
      }
    ];
  }

  if (lang === 'pt-PT') {
    return [
      {
        id: 'essencial',
        nome: 'ESSENCIAL',
        tagline: 'Sítio profissional para começar',
        corIdentidade: 'azul',
        descricao: 'Ideal para profissionais liberais e pequenas empresas que precisam de presença digital profissional com agilidade e elevado impacto.',
        recursos: [
          'Landing page profissional de página única',
          'Design responsivo para telemóvel, tablet e computador',
          'Botões de contacto direto para o WhatsApp',
          'Carregamento rápido otimizado',
          'Secção de apresentação de serviços e produtos',
          'Alojamento seguro e certificado SSL incluídos'
        ]
      },
      {
        id: 'profissional',
        nome: 'PROFISSIONAL',
        tagline: 'Mais funcionalidades para o seu negócio',
        corIdentidade: 'dourado',
        destaque: true,
        descricao: 'A melhor escolha para empresas consolidadas que desejam atrair novos clientes, reforçar a autoridade da marca e destacar os seus diferenciais.',
        recursos: [
          'Estrutura multipágina ou secções aprofundadas',
          'Catálogo interativo de serviços ou produtos',
          'Formulário inteligente de captação de clientes',
          'Otimização completa de SEO para o Google',
          'Integração com Google Maps e avaliações',
          'Layout premium com tipografia e paleta à medida',
          'Botão flutuante de atendimento personalizado'
        ]
      },
      {
        id: 'premium',
        nome: 'PREMIUM',
        tagline: 'Máxima autoridade e excelência digital',
        corIdentidade: 'esmeralda',
        descricao: 'Design exclusivo de alto luxo, animações refinadas e conversão estratégica para marcas que exigem destaque e credibilidade no mercado.',
        recursos: [
          'Identidade visual de luxo desenhada para a sua marca',
          'Posicionamento de topo no Google (SEO Master)',
          'Microinterações sofisticadas e carregamento instantâneo',
          'Canal prioritário de captação comercial e WhatsApp',
          'Alojamento em nuvem ultra rápido com certificado SSL',
          'Acompanhamento técnico e monitorização VIP contínua'
        ]
      },
      {
        id: 'personalizado',
        nome: 'PERSONALIZADO',
        tagline: 'Um projeto feito à sua medida',
        corIdentidade: 'roxo',
        descricao: 'Desenvolvimento à medida com arquitetura exclusiva, funcionalidades específicas e acompanhamento estratégico da NexaWeb.',
        recursos: [
          'Projeto 100% exclusivo criado para o seu negócio',
          'Sistemas específicos (marcações, ementa própria, portfólio dinâmico)',
          'Copywriting persuasivo e estratégico alinhado ao seu público',
          'Integração com ferramentas de gestão e CRM',
          'Otimização avançada de desempenho e métricas',
          'Acompanhamento e apoio prioritário direto'
        ]
      }
    ];
  }

  // pt-BR (padrão)
  return [
    {
      id: 'essencial',
      nome: 'ESSENCIAL',
      tagline: 'Site profissional para começar',
      corIdentidade: 'azul',
      descricao: 'Ideal para profissionais autônomos e pequenos negócios que precisam de presença digital profissional com agilidade e alto impacto.',
      recursos: [
        'Landing page profissional de página única',
        'Design responsivo para celular, tablet e computador',
        'Botões de contato direto para o WhatsApp',
        'Carregamento rápido otimizado',
        'Seção de apresentação de serviços e produtos',
        'Hospedagem segura e certificado SSL incluídos'
      ]
    },
    {
      id: 'profissional',
      nome: 'PROFISSIONAL',
      tagline: 'Mais recursos para o seu negócio',
      corIdentidade: 'dourado',
      destaque: true,
      descricao: 'A melhor escolha para empresas consolidadas que desejam atrair novos clientes, fortalecer a autoridade da marca e destacar seus diferenciais.',
      recursos: [
        'Estrutura multipágina ou seções aprofundadas',
        'Catálogo interativo de serviços ou produtos',
        'Formulário inteligente de captação de clientes',
        'Otimização completa de SEO para o Google',
        'Integração com Google Maps e avaliações',
        'Layout premium com tipografia e paleta sob medida',
        'Botão flutuante de atendimento personalizado'
      ]
    },
    {
      id: 'premium',
      nome: 'PREMIUM',
      tagline: 'Máxima autoridade e destaque digital',
      corIdentidade: 'esmeralda',
      descricao: 'Design exclusivo de alto padrão, animações sofisticadas e captação estratégica para marcas que buscam liderança e autoridade máxima.',
      recursos: [
        'Identidade visual de alto luxo desenhada para a sua marca',
        'Posicionamento de ponta no Google (SEO Master)',
        'Microinterações refinadas e velocidade máxima de carregamento',
        'Canal prioritário de conversão e captação no WhatsApp',
        'Hospedagem em nuvem de alto desempenho com certificado SSL',
        'Suporte prioritário e acompanhamento técnico VIP contínuo'
      ]
    },
    {
      id: 'personalizado',
      nome: 'PERSONALIZADO',
      tagline: 'Um projeto feito para você',
      corIdentidade: 'roxo',
      descricao: 'Desenvolvimento sob medida com arquitetura exclusiva, funcionalidades específicas e acompanhamento estratégico da NexaWeb.',
      recursos: [
        'Projeto 100% exclusivo criado para o seu negócio',
        'Sistemas específicos (agendamentos, cardápio próprio, portfólio dinâmico)',
        'Copywriting persuasivo e estratégico alinhado ao seu público',
        'Integração com ferramentas de gestão e CRM',
        'Otimização avançada de performance e métricas',
        'Acompanhamento e suporte prioritário direto'
      ]
    }
  ];
};

export const NEXAWEB_PLANS = getNexawebPlans('pt-BR');
