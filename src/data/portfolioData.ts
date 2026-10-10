import { PortfolioCategory, PortfolioProject, Language } from '../types';

export const getPortfolioCategories = (_lang: Language = 'pt-BR'): PortfolioCategory[] => {
  return [
    { id: 'todos', nome: 'Todos os Segmentos' },
    { id: 'beleza-estetica', nome: 'Beleza & Estética' },
    { id: 'saude-fitness', nome: 'Saúde & Fitness' },
    { id: 'imobiliario', nome: 'Imobiliário' },
    { id: 'gastronomia', nome: 'Gastronomia / Restaurante' },
    { id: 'arquitetura', nome: 'Arquitetura' },
    { id: 'tecnologia', nome: 'Tecnologia' },
    { id: 'pet', nome: 'Pet Shop' },
    { id: 'engenharia', nome: 'Engenharia' },
    { id: 'comercio', nome: 'Comércio & Loja' },
    { id: 'juridico', nome: 'Jurídico' },
  ];
};

const projectsCache: Partial<Record<Language, PortfolioProject[]>> = {};

export const getPortfolioProjects = (lang: Language = 'pt-BR'): PortfolioProject[] => {
  if (projectsCache[lang]) {
    return projectsCache[lang]!;
  }
  // 13 Demonstrações Oficiais Verificadas (Essencial, Profissional e Premium)
  // Imagens reais de cada segmento em alta resolução e carregamento veloz
  const projects: PortfolioProject[] = [
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
      imagemUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://king-s-barber-2-yn3c.vercel.app/assets/hero_kings_barber_1790816886244-C5Xee-BA.jpg',
        'https://king-s-barber-2-yn3c.vercel.app/assets/service_fade_haircut_1790816895910-BogR4UIi.jpg',
        'https://king-s-barber-2-yn3c.vercel.app/assets/service_beard_grooming_1790816905975-CRui_1xQ.jpg',
        'https://king-s-barber-2-yn3c.vercel.app/assets/team_master_barber_1790816914439-Dei9K88O.jpg',
        'https://king-s-barber-2-yn3c.vercel.app/assets/barbershop_interior_lounge_1790816923816-CBpQiwhw.jpg'
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
      imagemUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://sal-o-premium.vercel.app/assets/hero_editorial_salon_1791177517311-C9WiYYfS.jpg',
        'https://sal-o-premium.vercel.app/assets/specialist_master_stylist_1791177552940-D4AAiYGk.jpg',
        'https://sal-o-premium.vercel.app/assets/gallery_hair_balayage_1791177532910-Dr1tKkoN.jpg',
        'https://sal-o-premium.vercel.app/assets/gallery_salon_interior_1791177542993-C137vUgF.jpg',
        'https://sal-o-premium.vercel.app/assets/hair_transformation_editorial_1791177562306-oaSM_RPZ.jpg'
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
      linkDemo: 'https://nexaweb-nova-arq-1.vercel.app/',
      imagemUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://nexaweb-nova-arq-1.vercel.app/assets/hero_architecture_1790883865890-DH0ewb0B.jpg',
        'https://nexaweb-nova-arq-1.vercel.app/assets/proj_casa_horizonte_1790883876712-CDFQ7PT-.jpg',
        'https://nexaweb-nova-arq-1.vercel.app/assets/proj_residencia_aurea_1790883886644-Co-U5f05.jpg',
        'https://nexaweb-nova-arq-1.vercel.app/assets/feature_espaco_ideia_1790883905363-B3RNVLyZ.jpg',
        'https://nexaweb-nova-arq-1.vercel.app/assets/proj_escritorio_linha_1790883896492-CU1DaN3b.jpg'
      ]
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
      linkDemo: 'https://nexaweb-lumiere.vercel.app/',
      imagemUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://nexaweb-lumiere.vercel.app/assets/hero_lumiere_wellness_1790886982882-_CGrplcT.jpg',
        'https://nexaweb-lumiere.vercel.app/assets/treatment_skincare_facial_1790887003509-V322YoMS.jpg',
        'https://nexaweb-lumiere.vercel.app/assets/clinic_interior_experience_1790886992775-Q7yruN5m.jpg',
        'https://nexaweb-lumiere.vercel.app/assets/specialists_demonstration_1790887017397-BzM3CQcD.jpg'
      ]
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
      linkDemo: 'https://nexaweb-vertex-digital.vercel.app/',
      imagemUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
      ]
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
      linkDemo: 'https://pet-shop-personalidade-e-profission.vercel.app/',
      imagemUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://pet-shop-personalidade-e-profission.vercel.app/assets/vet_hero_care_1791213411609-DLU4Dlgw.jpg',
        'https://pet-shop-personalidade-e-profission.vercel.app/assets/cat_friendly_suite_1791213423130-BzuQ9VVq.jpg',
        'https://pet-shop-personalidade-e-profission.vercel.app/assets/pet_spa_grooming_1791213433780-C1nfDM6R.jpg',
        'https://pet-shop-personalidade-e-profission.vercel.app/assets/pet_boutique_nutrition_1791213443351-BF6TQvk1.jpg',
        'https://pet-shop-personalidade-e-profission.vercel.app/assets/vet_helena_portrait_1791215175019-CsdiSaVN.jpg'
      ]
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
      linkDemo: 'https://restaurante-premium-delta.vercel.app/',
      imagemUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://restaurante-premium-delta.vercel.app/assets/vitrae_hero_architecture_1790827939043-CruZLfzU.jpg',
        'https://restaurante-premium-delta.vercel.app/assets/vitrae_ambience_consultorio_1790827951139-rVG4hpvs.jpg',
        'https://restaurante-premium-delta.vercel.app/assets/vitrae_ambience_lounge_1790827963789-CdtfRx-P.jpg',
        'https://restaurante-premium-delta.vercel.app/assets/vitrae_wellness_rehab_1790827972018-DH_IfCfQ.jpg'
      ]
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
      linkDemo: 'https://academia-premium-beryl.vercel.app/',
      imagemUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://academia-premium-beryl.vercel.app/assets/hero_aurea_performance_1790826920112-BrlHrDue.jpg',
        'https://academia-premium-beryl.vercel.app/assets/facility_recovery_suite_1790826930359-De-nuvBN.jpg',
        'https://academia-premium-beryl.vercel.app/assets/gym_precision_detail_1790826959491-YLZ5opRn.jpg',
        'https://academia-premium-beryl.vercel.app/assets/trainer_marina_duarte_1790826939993-B-Of7Qun.jpg',
        'https://academia-premium-beryl.vercel.app/assets/trainer_lucas_almeida_1790826949519-OeHbKQ5I.jpg'
      ]
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
      linkDemo: 'https://engenharia-premium.vercel.app/',
      imagemUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'
      ]
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
      linkDemo: 'https://imobili-ria-premium.vercel.app/',
      imagemUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://imobili-ria-premium.vercel.app/assets/hero_luxury_penthouse_1790834541629-D47iXe8J.jpg',
        'https://imobili-ria-premium.vercel.app/assets/property_villa_jardins_1790834552384-BjB5yIR9.jpg',
        'https://imobili-ria-premium.vercel.app/assets/property_penthouse_terrace_1790834563010-SpNQk_7M.jpg',
        'https://imobili-ria-premium.vercel.app/assets/property_loft_architectural_1790834573444-w5tes-VE.jpg',
        'https://imobili-ria-premium.vercel.app/assets/property_mansion_golf_1790834582867-C6m7r73v.jpg'
      ]
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
      linkDemo: 'https://loja-premium.vercel.app/',
      imagemUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2070',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070'
      ]
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
      linkDemo: 'https://grok-workspace-1-three-alpha.vercel.app/',
      imagemUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://grok-workspace-1-three-alpha.vercel.app/images/hero.jpg',
        'https://grok-workspace-1-three-alpha.vercel.app/images/about.jpg',
        'https://grok-workspace-1-three-alpha.vercel.app/images/recepcao.jpg',
        'https://grok-workspace-1-three-alpha.vercel.app/images/consultorio.jpg',
        'https://grok-workspace-1-three-alpha.vercel.app/images/fachada.jpg'
      ]
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
      linkDemo: 'https://grok-workspace-puce.vercel.app/',
      imagemUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      imagens: [
        'https://grok-workspace-puce.vercel.app/images/hero.jpg',
        'https://grok-workspace-puce.vercel.app/images/about.jpg',
        'https://grok-workspace-puce.vercel.app/images/featured.jpg',
        'https://grok-workspace-puce.vercel.app/images/gallery-salon.jpg',
        'https://grok-workspace-puce.vercel.app/images/gallery-table.jpg'
      ]
    }
  ];
  projectsCache[lang] = projects;
  return projects;
};

export const PORTFOLIO_CATEGORIES = getPortfolioCategories('pt-BR');
export const PORTFOLIO_PROJECTS = getPortfolioProjects('pt-BR');
