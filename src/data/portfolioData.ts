import { PortfolioCategory, PortfolioProject, Language } from '../types';

export const getPortfolioCategories = (lang: Language = 'pt-BR'): PortfolioCategory[] => {
  if (lang === 'en') {
    return [
      { id: 'todos', nome: 'All' },
      { id: 'beleza-estetica', nome: 'Beauty & Aesthetics' },
      { id: 'saude-fitness', nome: 'Health & Fitness' },
      { id: 'imobiliario', nome: 'Real Estate' },
      { id: 'gastronomia', nome: 'Gastronomy' },
      { id: 'arquitetura', nome: 'Architecture' },
      { id: 'tecnologia', nome: 'Technology' },
      { id: 'pet', nome: 'Pet & Vet' },
      { id: 'engenharia', nome: 'Engineering' },
      { id: 'comercio', nome: 'Retail & Store' },
      { id: 'juridico', nome: 'Legal & Consulting' },
    ];
  }

  // pt-BR, pt-PT, es, fr padrão
  return [
    { id: 'todos', nome: 'Todos' },
    { id: 'beleza-estetica', nome: 'Beleza & Estética' },
    { id: 'saude-fitness', nome: 'Saúde & Fitness' },
    { id: 'imobiliario', nome: 'Imobiliário' },
    { id: 'gastronomia', nome: 'Gastronomia' },
    { id: 'arquitetura', nome: 'Arquitetura' },
    { id: 'tecnologia', nome: 'Tecnologia' },
    { id: 'pet', nome: 'Pet Shop' },
    { id: 'engenharia', nome: 'Engenharia' },
    { id: 'comercio', nome: 'Comércio' },
    { id: 'juridico', nome: 'Jurídico' },
  ];
};

export const getPortfolioProjects = (lang: Language = 'pt-BR'): PortfolioProject[] => {
  // 13 Demonstrações Oficiais Verificadas (Essencial, Profissional e Premium)
  // Nota: Projetos Personalizados são criados sob medida para o cliente e não possuem demos fixas.
  return [
    // ----------------------------------------------------
    // 1. ESSENCIAL (1 projeto oficial)
    // ----------------------------------------------------
    {
      id: 'demo-barbearia-kings',
      titulo: "Barbearia King's Barber",
      categoria: 'beleza-estetica',
      planoId: 'essencial',
      destaqueHome: true,
      descricaoCurta: 'Visual moderno focado em agendamentos rápidos e serviços para o público masculino.',
      descricaoCompleta: 'Modelo ideal para barbearias tradicionais e contemporâneas. Destaca a tabela de serviços, valores, horários e botão de atendimento direto.',
      segmentoAlvo: 'Barbearias, centros de estética masculina e tatuarias',
      tags: ['Design Moderno', 'Tabela de Cortes', 'Agendamento Direto', 'Mobile First'],
      recursos: [
        'Identidade visual marcante com alto contraste',
        'Tabela clara de serviços com tempo e valores',
        'Horários de funcionamento e localização',
        'Botão de agendamento ágil para WhatsApp'
      ],
      corDestaque: 'from-amber-600 via-orange-600 to-stone-800',
      linkDemo: 'https://king-s-barber-2-yn3c.vercel.app/',
      imagens: [
        'https://image.thum.io/get/width/900/crop/550/noanimate/https://king-s-barber-2-yn3c.vercel.app/',
        'https://image.thum.io/get/width/420/crop/650/noanimate/https://king-s-barber-2-yn3c.vercel.app/'
      ]
    },

    // ----------------------------------------------------
    // 2. PROFISSIONAL (6 projetos oficiais)
    // ----------------------------------------------------
    {
      id: 'demo-salao-premium',
      titulo: 'Salão Premium & Studio de Beleza',
      categoria: 'beleza-estetica',
      planoId: 'profissional',
      destaqueHome: true,
      descricaoCurta: 'Apresentação refinada de procedimentos estéticos com agendamento ágil.',
      descricaoCompleta: 'Criado para salões e estúdios que buscam transmitir sofisticação. Apresenta catálogo de serviços, tratamentos capilares e agendamento instantâneo.',
      segmentoAlvo: 'Salões de beleza, estúdios de estética, maquiadoras e spas',
      tags: ['Design Sofisticado', 'Agendamento Fácil', 'Galeria de Serviços', 'Mobile First'],
      recursos: [
        'Exibição visual elegante dos serviços e procedimentos',
        'Botões de agendamento com confirmação rápida',
        'Layout clean com foco em transmitir luxo e confiança',
        'Carregamento ultra veloz em redes móveis'
      ],
      corDestaque: 'from-pink-600 via-rose-500 to-amber-500',
      linkDemo: 'https://sal-o-premium.vercel.app/',
      imagens: [
        'https://image.thum.io/get/width/900/crop/550/noanimate/https://sal-o-premium.vercel.app/',
        'https://image.thum.io/get/width/420/crop/650/noanimate/https://sal-o-premium.vercel.app/'
      ]
    },
    {
      id: 'demo-nova-arq',
      titulo: 'Nova Arquitetura & Interiores',
      categoria: 'arquitetura',
      planoId: 'profissional',
      destaqueHome: true,
      descricaoCurta: 'Portfólio elegante de projetos residenciais e comerciais de arquitetura.',
      descricaoCompleta: 'Desenvolvido para arquitetos, escritórios de urbanismo e designers de interiores. Valoriza fotografias de projetos concluídos e captação de clientes.',
      segmentoAlvo: 'Escritórios de arquitetura, design de interiores e reformas',
      tags: ['Minimalismo', 'Galeria de Projetos', 'Autoridade Visual', 'Contato Rápido'],
      recursos: [
        'Vitrine fotográfica de projetos residenciais e corporativos',
        'Apresentação da metodologia de trabalho e equipe',
        'Formulário enxuto de solicitação de proposta',
        'Otimização completa para visualização em smartphones'
      ],
      corDestaque: 'from-stone-700 via-zinc-800 to-cyan-900',
      linkDemo: 'https://nexaweb-nova-arq-1.vercel.app/'
    },
    {
      id: 'demo-lumiere',
      titulo: 'Lumière Estética & Bem-Estar',
      categoria: 'beleza-estetica',
      planoId: 'profissional',
      destaqueHome: false,
      descricaoCurta: 'Clínica estética com catálogo de tratamentos faciais e corporais.',
      descricaoCompleta: 'Layout fluido e sofisticado para clínicas de estética avançada e harmonização. Apresenta tratamentos em detalhes e incentivo para consulta de avaliação.',
      segmentoAlvo: 'Clínicas de estética, dermatologia, harmonização e spas',
      tags: ['Beleza & Luxo', 'Procedimentos', 'Avaliação Grátis', 'Design Fluido'],
      recursos: [
        'Apresentação clara de procedimentos faciais e corporais',
        'Seção antes e depois com foco em credibilidade',
        'Chamada direta para agendamento de avaliação inicial',
        'Navegação intuitiva com carregamento rápido'
      ],
      corDestaque: 'from-rose-600 via-pink-500 to-purple-800',
      linkDemo: 'https://nexaweb-lumiere.vercel.app/'
    },
    {
      id: 'demo-vertex-digital',
      titulo: 'Vertex Digital Agency',
      categoria: 'tecnologia',
      planoId: 'profissional',
      destaqueHome: false,
      descricaoCurta: 'Posicionamento estratégico para agências e empresas de tecnologia.',
      descricaoCompleta: 'Conceito tecnológico para empresas de software, agências de marketing e consultorias digitais que exigem autoridade e conversão.',
      segmentoAlvo: 'Agências digitais, startups e empresas de tecnologia',
      tags: ['Tech Futurista', 'Soluções Digitais', 'Cases de Sucesso', 'Conversão B2B'],
      recursos: [
        'Apresentação de serviços digitais e soluções estratégicas',
        'Seção de métricas de impacto e resultados comprovados',
        'Chamada para diagnóstico gratuito do negócio',
        'Design moderno com microinterações refinadas'
      ],
      corDestaque: 'from-indigo-600 via-blue-600 to-cyan-700',
      linkDemo: 'https://nexaweb-vertex-digital.vercel.app/'
    },
    {
      id: 'demo-pet-shop',
      titulo: 'Pet Shop & Clínica Veterinária',
      categoria: 'pet',
      planoId: 'profissional',
      destaqueHome: false,
      descricaoCurta: 'Ambiente acolhedor e dinâmico para serviços pet e consultas veterinárias.',
      descricaoCompleta: 'Criado para pet shops modernos, banho & tosa e clínicas veterinárias. Facilita o agendamento de horários para os pets com um clique.',
      segmentoAlvo: 'Pet shops, clínicas veterinárias, banho & tosa e hotéis pet',
      tags: ['Cuidado Animal', 'Banho & Tosa', 'Agendamento Fácil', 'Amigável'],
      recursos: [
        'Apresentação amigável de serviços de banho, tosa e clínica',
        'Tabela transparente de planos e pacotes mensais',
        'Botão de agendamento com confirmação rápida',
        'Localização no mapa e horários de plantão'
      ],
      corDestaque: 'from-amber-500 via-emerald-600 to-teal-800',
      linkDemo: 'https://pet-shop-personalidade-e-profission.vercel.app/'
    },
    {
      id: 'demo-restaurante-premium',
      titulo: 'Restaurante & Gastronomia Gourmet',
      categoria: 'gastronomia',
      planoId: 'profissional',
      destaqueHome: false,
      descricaoCurta: 'Cardápio digital apetitoso com fotos expressivas e reserva de mesas.',
      descricaoCompleta: 'Desenvolvido para restaurantes, bistrôs, pizzarias e hamburguerias. Exibe o cardápio com pratos em destaque e canal direto para reservas.',
      segmentoAlvo: 'Restaurantes, bistrôs, pizzarias, hamburguerias e bares',
      tags: ['Cardápio Visual', 'Reserva de Mesa', 'Fotos Apetitosas', 'Experiência Gastronômica'],
      recursos: [
        'Cardápio digital organizado por categorias e especialidades',
        'Fotos atraentes com foco na experiência sensorial',
        'Sistema direto para reserva de mesas e pedidos',
        'Horários de funcionamento e localização GPS'
      ],
      corDestaque: 'from-orange-600 via-amber-600 to-red-700',
      linkDemo: 'https://restaurante-premium-delta.vercel.app/'
    },

    // ----------------------------------------------------
    // 3. PREMIUM (6 projetos oficiais)
    // ----------------------------------------------------
    {
      id: 'demo-academia-premium',
      titulo: 'Academia & Centro de Treinamento',
      categoria: 'saude-fitness',
      planoId: 'premium',
      destaqueHome: true,
      descricaoCurta: 'Página de alta energia com modalidades, planos e aula experimental.',
      descricaoCompleta: 'Estrutura premium voltada para centros fitness, crossfit e estúdios de treino. Apresenta modalidades, diferenciais e passe livre para aula experimental.',
      segmentoAlvo: 'Academias, estúdios de crossfit, pilates e centros de treino',
      tags: ['Alta Energia', 'Planos de Matrícula', 'Aula Experimental', 'Experiência VIP'],
      recursos: [
        'Apresentação clara dos planos e benefícios inclusos',
        'Seção de modalidades esportivas com fotos de alta energia',
        'Chamada para agendamento de aula experimental gratuita',
        'Design dinâmico otimizado para celulares'
      ],
      corDestaque: 'from-cyan-600 via-blue-600 to-indigo-800',
      linkDemo: 'https://academia-premium-beryl.vercel.app/'
    },
    {
      id: 'demo-engenharia-premium',
      titulo: 'Engenharia Civil & Projetos Premium',
      categoria: 'engenharia',
      planoId: 'premium',
      destaqueHome: false,
      descricaoCurta: 'Autoridade e precisão técnica para construtoras e engenharia de obras.',
      descricaoCompleta: 'Layout imponente para construtoras, incorporadoras e engenheiros civis. Apresenta portfólio de obras de grande porte e certificações de qualidade.',
      segmentoAlvo: 'Construtoras, engenheiros civis, loteadoras e perícias de engenharia',
      tags: ['Solidez Técnica', 'Obras de Grande Porte', 'Certificações', 'Autoridade'],
      recursos: [
        'Exibição de obras concluídas com detalhes técnicos e fotos',
        'Seção institucional com certificações e dados de segurança',
        'Canal para orçamentos e reuniões com corpo de engenheiros',
        'Responsividade técnica com carregamento fluido'
      ],
      corDestaque: 'from-blue-700 via-indigo-800 to-slate-900',
      linkDemo: 'https://engenharia-premium.vercel.app/'
    },
    {
      id: 'demo-imobiliaria-premium',
      titulo: 'Portal Imobiliário & Negócios',
      categoria: 'imobiliario',
      planoId: 'premium',
      destaqueHome: false,
      descricaoCurta: 'Apresentação de imóveis com visual imponente e captação de clientes.',
      descricaoCompleta: 'Desenvolvido para imobiliárias e corretores de imóveis de alto padrão. Dá destaque a lançamentos, imóveis selecionados e atendimento exclusivo.',
      segmentoAlvo: 'Imobiliárias, corretores de imóveis de alto padrão e incorporadoras',
      tags: ['Alto Padrão', 'Destaque de Imóveis', 'Filtro por Tipo', 'Atendimento VIP'],
      recursos: [
        'Vitrine elegante de imóveis com fotos e detalhes técnicos',
        'Formulário enxuto de interesse para atendimento prioritário',
        'Seção institucional que constrói credibilidade',
        'Botões de atendimento direto para corretores credenciados'
      ],
      corDestaque: 'from-emerald-600 via-teal-600 to-slate-800',
      linkDemo: 'https://imobili-ria-premium.vercel.app/'
    },
    {
      id: 'demo-loja-premium',
      titulo: 'Loja Conceito & E-commerce Premium',
      categoria: 'comercio',
      planoId: 'premium',
      destaqueHome: false,
      descricaoCurta: 'Experiência visual de marca para lojas de moda, joias e produtos exclusivos.',
      descricaoCompleta: 'Desenvolvido para marcas de moda, acessórios e lojas conceito. Destaca lançamentos de coleção e encaminha para compras imediatas.',
      segmentoAlvo: 'Lojas de moda, acessórios, calçados e varejo de alto padrão',
      tags: ['Loja Conceito', 'Coleções Exclusivas', 'Experiência Visual', 'Vendas Ágeis'],
      recursos: [
        'Vitrine de coleções com visual moderno e cativante',
        'Exibição de produtos em destaque com variações',
        'Encaminhamento direto para compras e atendimento via WhatsApp',
        'Navegação rápida sem travamentos no celular'
      ],
      corDestaque: 'from-purple-600 via-pink-600 to-rose-800',
      linkDemo: 'https://loja-premium.vercel.app/'
    },
    {
      id: 'demo-clinica-saude',
      titulo: 'Clínica Médica & Saúde Especializada',
      categoria: 'saude-fitness',
      planoId: 'premium',
      destaqueHome: false,
      descricaoCurta: 'Transmite serenidade, acolhimento e autoridade para clínicas e médicos.',
      descricaoCompleta: 'Solução premium para clínicas multidisciplinares, odontologia e consultórios médicos. Informa especialidades, corpo clínico e convênios.',
      segmentoAlvo: 'Clínicas médicas, odontologia, fisioterapia e diagnósticos',
      tags: ['Credibilidade Médica', 'Especialidades', 'Marcação de Consulta', 'Informativo'],
      recursos: [
        'Apresentação humanizada dos profissionais de saúde',
        'Lista de especialidades e procedimentos realizados',
        'Canal de triagem e agendamento de consultas',
        'Endereço com mapa interativo e informações de acesso'
      ],
      corDestaque: 'from-indigo-600 via-sky-600 to-blue-900',
      linkDemo: 'https://grok-workspace-1-three-alpha.vercel.app/'
    },
    {
      id: 'demo-grok-workspace-puce',
      titulo: 'Advocacia & Consultoria Jurídica',
      categoria: 'juridico',
      planoId: 'premium',
      destaqueHome: false,
      descricaoCurta: 'Postura imponente e credibilidade para escritórios jurídicos e consultorias.',
      descricaoCompleta: 'Desenvolvido para advogados e consultores empresariais que precisam transmitir máxima seriedade, áreas de atuação e atendimento seguro.',
      segmentoAlvo: 'Escritórios de advocacia, consultorias jurídicas e auditorias',
      tags: ['Autoridade Jurídica', 'Áreas de Atuação', 'Consulta Inicial', 'Segurança'],
      recursos: [
        'Apresentação das áreas do direito atendidas com clareza',
        'Perfil dos sócios e histórico de atuação do escritório',
        'Canal seguro para consulta inicial e triagem de casos',
        'Design sóbrio e elegante que reforça a confiança do cliente'
      ],
      corDestaque: 'from-amber-700 via-stone-800 to-slate-900',
      linkDemo: 'https://grok-workspace-puce.vercel.app/'
    }
  ];
};

export const PORTFOLIO_CATEGORIES = getPortfolioCategories('pt-BR');
export const PORTFOLIO_PROJECTS = getPortfolioProjects('pt-BR');
