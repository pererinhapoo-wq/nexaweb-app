import { PortfolioCategory, PortfolioProject, Language } from '../types';

export const getPortfolioCategories = (lang: Language = 'pt'): PortfolioCategory[] => {
  if (lang === 'en') {
    return [
      { id: 'todos', nome: 'All' },
      { id: 'beleza-estetica', nome: 'Beauty & Aesthetics' },
      { id: 'saude-fitness', nome: 'Health & Fitness' },
      { id: 'imobiliario', nome: 'Real Estate' },
      { id: 'gastronomia', nome: 'Gastronomy' },
    ];
  }

  return [
    { id: 'todos', nome: 'Todos' },
    { id: 'beleza-estetica', nome: 'Beleza & Estética' },
    { id: 'saude-fitness', nome: 'Saúde & Fitness' },
    { id: 'imobiliario', nome: 'Imobiliário' },
    { id: 'gastronomia', nome: 'Gastronomia' },
  ];
};

export const getPortfolioProjects = (lang: Language = 'pt'): PortfolioProject[] => {
  if (lang === 'en') {
    return [
      {
        id: 'demo-salao-premium',
        titulo: 'Premium Salon & Beauty Studio',
        categoria: 'beleza-estetica',
        descricaoCurta: 'Refined visual layout showcasing aesthetic procedures with instant appointment booking.',
        descricaoCompleta: 'Built for high-end beauty studios and salons. Displays the treatment catalog, hair services, transformation gallery, and direct WhatsApp booking integration.',
        segmentoAlvo: 'Beauty salons, aesthetic studios, makeup artists and luxury spas',
        tags: ['Sophisticated Design', 'Easy Booking', 'Service Showcase', 'Mobile First'],
        recursos: [
          'Elegant visual display of services and treatments',
          'Direct booking buttons with pre-filled WhatsApp messages',
          'Clean, luxurious layout built to convey trust and authority',
          'Lightning-fast load time across any mobile network'
        ],
        corDestaque: 'from-pink-600 via-rose-500 to-amber-500',
        linkDemo: 'https://sal-o-premium.vercel.app/'
      },
      {
        id: 'demo-barbearia-kings',
        titulo: "King's Barber Shop",
        categoria: 'beleza-estetica',
        descricaoCurta: 'Modern aesthetic with rustic-contemporary flair focused on bookings and men grooming.',
        descricaoCompleta: 'The perfect template for traditional and modern barbershops. Highlights service pricing, beard & haircut combos, operating hours, and barber profiles.',
        segmentoAlvo: 'Barbershops, male grooming studios and tattoo parlors',
        tags: ['Modern Style', 'Price Table', 'Direct Booking', 'Location Map'],
        recursos: [
          'Strong visual branding with refined contrast',
          'Detailed services table with estimated duration and rates',
          'Integrated location map and working schedule',
          'Quick appointment button with instant confirmation'
        ],
        corDestaque: 'from-amber-600 via-orange-600 to-stone-800',
        linkDemo: 'https://king-s-barber-2-yn3c.vercel.app/'
      },
      {
        id: 'demo-academia-premium',
        titulo: 'Fitness Center & Gym Club',
        categoria: 'saude-fitness',
        descricaoCurta: 'Dynamic and motivational layout with membership tiers, workout schedules, and trial pass booking.',
        descricaoCompleta: 'Engineered for fitness centers, pilates studios, CrossFit boxes, and personal trainers. Highlights workout modalities, monthly plans, and free trial pass booking.',
        segmentoAlvo: 'Gyms, CrossFit boxes, pilates studios and personal trainers',
        tags: ['High Energy', 'Membership Plans', 'Trial Workout', 'Modalities'],
        recursos: [
          'Clear presentation of membership plans and perks',
          'Sports modalities section with high-energy imagery',
          'Call-to-action for free trial workout pass',
          'Full responsiveness tailored for mobile phones'
        ],
        corDestaque: 'from-cyan-600 via-blue-600 to-indigo-800',
        linkDemo: 'https://academia-premium-beryl.vercel.app/'
      },
      {
        id: 'demo-imobiliaria-premium',
        titulo: 'Prime Real Estate & Properties',
        categoria: 'imobiliario',
        descricaoCurta: 'Presentation of residential and commercial properties with imposing design and qualified lead capture.',
        descricaoCompleta: 'Created for real estate agencies, independent brokers, and property developers. Highlights new developments, properties for sale or rent, and easy agent contact.',
        segmentoAlvo: 'Real estate agencies, property brokers and developers',
        tags: ['Authority', 'Featured Listings', 'Property Filtering', 'Agent Contact'],
        recursos: [
          'Elegant property showcase with photos and technical details',
          'Streamlined inquiry form for priority customer service',
          'Company credibility and credentials section',
          'Direct contact buttons for certified real estate agents'
        ],
        corDestaque: 'from-emerald-600 via-teal-600 to-slate-800',
        linkDemo: 'https://imobili-ria-premium.vercel.app/'
      },
      {
        id: 'demo-clinica-saude',
        titulo: 'Medical Clinic & Specialized Care',
        categoria: 'saude-fitness',
        descricaoCurta: 'Conveys serenity, trust, and medical authority for consultations and specialized health treatments.',
        descricaoCompleta: 'The ideal solution for private practices, multidisciplinary clinics, dentists, and health professionals. Details specialties, medical team credentials, and accepted health plans.',
        segmentoAlvo: 'Medical clinics, dentists, physical therapists and healthcare specialists',
        tags: ['Medical Trust', 'Specialties', 'Appointment Booking', 'Informative'],
        recursos: [
          'Humanized presentation of healthcare professionals',
          'Complete list of medical specialties and procedures',
          'Direct triage and WhatsApp consultation scheduling',
          'Interactive location map with parking and access info'
        ],
        corDestaque: 'from-indigo-600 via-sky-600 to-blue-900',
        linkDemo: 'https://grok-workspace-1-three-alpha.vercel.app/'
      },
      {
        id: 'demo-restaurante-premium',
        titulo: 'Gourmet Restaurant & Dining',
        categoria: 'gastronomia',
        descricaoCurta: 'Appetizing visual menu with vibrant dish photography, cozy atmosphere, and 1-tap table reservation.',
        descricaoCompleta: 'Crafted for restaurants, bistros, pizzerias, and culinary spaces. Displays the culinary menu with chef specialties, drink pairings, and instant table booking.',
        segmentoAlvo: 'Restaurants, bistros, burger joints, pizzerias and cocktail bars',
        tags: ['Visual Menu', 'Table Booking', 'Appetizing Photos', 'Culinary Experience'],
        recursos: [
          'Digital menu organized by categories and specials',
          'Mouth-watering photography focused on sensory appeal',
          'Direct table reservation and takeaway ordering system',
          'Working hours and Google Maps navigation'
        ],
        corDestaque: 'from-orange-600 via-amber-600 to-red-700',
        linkDemo: 'https://restaurante-premium-delta.vercel.app/'
      }
    ];
  }

  return [
    {
      id: 'demo-salao-premium',
      titulo: 'Salão Premium & Studio de Beleza',
      categoria: 'beleza-estetica',
      descricaoCurta: 'Ambiente visual refinado com apresentação de procedimentos estéticos e botão de agendamento ágil.',
      descricaoCompleta: 'Criado para estúdios de beleza e salões sofisticados. Apresenta o catálogo de serviços, tratamentos capilares, galeria de resultados e integração direta para agendamentos rápidos.',
      segmentoAlvo: 'Salões de beleza, estúdios de estética, maquiadoras e spas',
      tags: ['Design Sofisticado', 'Agendamento Fácil', 'Galeria de Serviços', 'Mobile First'],
      recursos: [
        'Exibição visual elegante dos tratamentos e serviços',
        'Botões de agendamento direto com mensagem pronta no WhatsApp',
        'Design clean com foco em transmitir luxo e confiança',
        'Carregamento ultra veloz em qualquer conexão móvel'
      ],
      corDestaque: 'from-pink-600 via-rose-500 to-amber-500',
      linkDemo: 'https://sal-o-premium.vercel.app/'
    },
    {
      id: 'demo-barbearia-kings',
      titulo: 'Barbearia King\'s Barber',
      categoria: 'beleza-estetica',
      descricaoCurta: 'Visual moderno com estilo rústico e contemporâneo focado em reservas e serviços para o público masculino.',
      descricaoCompleta: 'Modelo ideal para barbearias tradicionais e contemporâneas. Destaca a tabela de preços, combo de barba e cabelo, horários de atendimento e equipe de profissionais.',
      segmentoAlvo: 'Barbearias, centros de estética masculina e tatuarias',
      tags: ['Estilo Moderno', 'Tabela de Cortes', 'Agendamento Direto', 'Localização'],
      recursos: [
        'Identidade visual marcante com contraste refinado',
        'Grade de serviços com tempo estimado e valores',
        'Localização integrada e horários da barbearia',
        'Botão de marcação com confirmação rápida'
      ],
      corDestaque: 'from-amber-600 via-orange-600 to-stone-800',
      linkDemo: 'https://king-s-barber-2-yn3c.vercel.app/'
    },
    {
      id: 'demo-academia-premium',
      titulo: 'Academia & Centro de Treinamento',
      categoria: 'saude-fitness',
      descricaoCurta: 'Página dinâmica e motivacional com planos de matrícula, grade de treinos e chamada para aula experimental.',
      descricaoCompleta: 'Estrutura voltada para academias, estúdios de pilates, crossfit e centros de treinamento físico. Apresenta modalidades, planos mensais e incentivo para aula experimental imediata.',
      segmentoAlvo: 'Academias, estúdios de crossfit, pilates e personal trainers',
      tags: ['Alta Energia', 'Planos de Matrícula', 'Aula Experimental', 'Modalidades'],
      recursos: [
        'Apresentação clara dos planos e benefícios inclusos',
        'Seção de modalidades esportivas com fotos de alta energia',
        'Chamada para agendamento de aula experimental gratuita',
        'Compatibilidade total com dispositivos móveis'
      ],
      corDestaque: 'from-cyan-600 via-blue-600 to-indigo-800',
      linkDemo: 'https://academia-premium-beryl.vercel.app/'
    },
    {
      id: 'demo-imobiliaria-premium',
      titulo: 'Portal Imobiliário & Negócios',
      categoria: 'imobiliario',
      descricaoCurta: 'Apresentação de imóveis residenciais e comerciais com visual imponente e captação de clientes qualificados.',
      descricaoCompleta: 'Desenvolvido para imobiliárias, corretores autônomos e construtoras. Dá destaque a empreendimentos em lançamento, imóveis para venda ou locação e contato facilitado com o corretor.',
      segmentoAlvo: 'Imobiliárias, corretores de imóveis, incorporadoras e loteamentos',
      tags: ['Autoridade', 'Destaque de Imóveis', 'Filtro por Tipo', 'Contato com Corretor'],
      recursos: [
        'Vitrine elegante de imóveis com fotos e detalhes técnicos',
        'Formulário enxuto de interesse para atendimento prioritário',
        'Seção sobre a imobiliária que constrói credibilidade',
        'Botões de atendimento direto para corretores credenciados'
      ],
      corDestaque: 'from-emerald-600 via-teal-600 to-slate-800',
      linkDemo: 'https://imobili-ria-premium.vercel.app/'
    },
    {
      id: 'demo-clinica-saude',
      titulo: 'Clínica Médica & Saúde Especializada',
      categoria: 'saude-fitness',
      descricaoCurta: 'Transmite serenidade, acolhimento e autoridade médica para consultas e procedimentos especializados.',
      descricaoCompleta: 'Solução perfeita para consultórios, clínicas multidisciplinares, odontologia e profissionais da saúde. Informa sobre especialidades atendidas, corpo clínico e convênios aceitos.',
      segmentoAlvo: 'Clínicas médicas, odontologia, fisioterapia, psicologia e diagnósticos',
      tags: ['Credibilidade Médica', 'Especialidades', 'Marcação de Consulta', 'Informativo'],
      recursos: [
        'Apresentação humanizada dos profissionais de saúde',
        'Lista de especialidades e procedimentos realizados',
        'Canal de triagem e agendamento de consultas pelo WhatsApp',
        'Endereço com mapa interativo e informações de acesso'
      ],
      corDestaque: 'from-indigo-600 via-sky-600 to-blue-900',
      linkDemo: 'https://grok-workspace-1-three-alpha.vercel.app/'
    },
    {
      id: 'demo-restaurante-premium',
      titulo: 'Restaurante & Gastronomia Gourmet',
      categoria: 'gastronomia',
      descricaoCurta: 'Cardápio apetitoso com fotos expressivas, ambiente acolhedor e reserva de mesas com um toque.',
      descricaoCompleta: 'Desenvolvido sob medida para restaurantes, bistrôs, pizzarias e espaços gastronômicos. Exibe o menu com pratos em destaque, carta de bebidas e botão para reservas ou delivery.',
      segmentoAlvo: 'Restaurantes, bistrôs, hamburguerias, pizzarias e bares',
      tags: ['Cardápio Visual', 'Reserva de Mesa', 'Fotos Apetitosas', 'Experiência Gastronômica'],
      recursos: [
        'Cardápio digital organizado por seções e especialidades',
        'Fotos atraentes com foco na experiência sensorial',
        'Sistema direto para reserva de mesas e pedidos',
        'Informações de horários de funcionamento e localização'
      ],
      corDestaque: 'from-orange-600 via-amber-600 to-red-700',
      linkDemo: 'https://restaurante-premium-delta.vercel.app/'
    }
  ];
};

export const PORTFOLIO_CATEGORIES = getPortfolioCategories('pt');
export const PORTFOLIO_PROJECTS = getPortfolioProjects('pt');
