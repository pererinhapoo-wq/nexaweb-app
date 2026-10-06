import { PortfolioCategory, PortfolioProject, Language } from '../types';

export const getPortfolioCategories = (lang: Language = 'pt-BR'): PortfolioCategory[] => {
  if (lang === 'en') {
    return [
      { id: 'todos', nome: 'All' },
      { id: 'beleza-estetica', nome: 'Beauty & Aesthetics' },
      { id: 'saude-fitness', nome: 'Health & Fitness' },
      { id: 'imobiliario', nome: 'Real Estate' },
      { id: 'gastronomia', nome: 'Gastronomy' },
    ];
  }

  if (lang === 'es') {
    return [
      { id: 'todos', nome: 'Todos' },
      { id: 'beleza-estetica', nome: 'Belleza & Estética' },
      { id: 'saude-fitness', nome: 'Salud & Fitness' },
      { id: 'imobiliario', nome: 'Inmobiliario' },
      { id: 'gastronomia', nome: 'Gastronomía' },
    ];
  }

  if (lang === 'fr') {
    return [
      { id: 'todos', nome: 'Tous' },
      { id: 'beleza-estetica', nome: 'Beauté & Esthétique' },
      { id: 'saude-fitness', nome: 'Santé & Fitness' },
      { id: 'imobiliario', nome: 'Immobilier' },
      { id: 'gastronomia', nome: 'Gastronomie' },
    ];
  }

  // pt-BR e pt-PT
  return [
    { id: 'todos', nome: 'Todos' },
    { id: 'beleza-estetica', nome: 'Beleza & Estética' },
    { id: 'saude-fitness', nome: 'Saúde & Fitness' },
    { id: 'imobiliario', nome: 'Imobiliário' },
    { id: 'gastronomia', nome: 'Gastronomia' },
  ];
};

export const getPortfolioProjects = (lang: Language = 'pt-BR'): PortfolioProject[] => {
  if (lang === 'en') {
    return [
      {
        id: 'demo-salao-premium',
        titulo: 'Premium Salon & Beauty Studio',
        categoria: 'beleza-estetica',
        planoId: 'profissional',
        destaqueHome: true,
        descricaoCurta: 'Refined visual layout showcasing aesthetic procedures with instant appointment booking.',
        descricaoCompleta: 'Built for high-end beauty studios and salons. Displays the treatment catalog, hair services, transformation gallery, and direct booking integration.',
        segmentoAlvo: 'Beauty salons, aesthetic studios, makeup artists and luxury spas',
        tags: ['Sophisticated Design', 'Easy Booking', 'Service Showcase', 'Mobile First'],
        recursos: [
          'Elegant visual display of services and treatments',
          'Direct booking buttons with instant appointment confirmation',
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
        planoId: 'essencial',
        destaqueHome: true,
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
        planoId: 'profissional',
        destaqueHome: true,
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
        planoId: 'personalizado',
        destaqueHome: true,
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
        planoId: 'premium',
        destaqueHome: false,
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
        planoId: 'personalizado',
        destaqueHome: false,
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

  if (lang === 'es') {
    return [
      {
        id: 'demo-salao-premium',
        titulo: 'Salón Premium & Estudio de Belleza',
        categoria: 'beleza-estetica',
        planoId: 'profissional',
        destaqueHome: true,
        descricaoCurta: 'Diseño visual refinado con presentación de tratamientos estéticos y botón de reservas ágil.',
        descricaoCompleta: 'Creado para estudios de estética y salones de alto nivel. Muestra el catálogo de servicios, tratamientos capilares, galería de fotos y citas inmediatas por WhatsApp.',
        segmentoAlvo: 'Salones de belleza, centros de estética, maquilladoras y spas de lujo',
        tags: ['Diseño Exclusivo', 'Reserva Rápida', 'Catálogo Visual', 'Mobile First'],
        recursos: [
          'Exhibición elegante de tratamientos y servicios',
          'Botones de reserva directa con mensaje preparado en WhatsApp',
          'Diseño sobrio enfocado en transmitir distinción y confianza',
          'Carga ultra rápida en cualquier dispositivo móvil'
        ],
        corDestaque: 'from-pink-600 via-rose-500 to-amber-500',
        linkDemo: 'https://sal-o-premium.vercel.app/'
      },
      {
        id: 'demo-barbearia-kings',
        titulo: 'Barbería King\'s Barber',
        categoria: 'beleza-estetica',
        planoId: 'essencial',
        destaqueHome: true,
        descricaoCurta: 'Estilo contemporáneo con toque rústico enfocado en reservas y cuidado personal masculino.',
        descricaoCompleta: 'Modelo ideal para barberías modernas y tradicionales. Destaca tarifas de corte y barba, horarios de atención y perfiles de barberos.',
        segmentoAlvo: 'Barberías, centros de estética masculina y estudios de tatuaje',
        tags: ['Estilo Moderno', 'Tabla de Precios', 'Reserva Directa', 'Ubicación'],
        recursos: [
          'Identidad visual llamativa con contraste moderno',
          'Tabla detallada de cortes y tiempos estimados',
          'Mapa de ubicación integrado y horarios comerciales',
          'Botón de cita rápida con confirmación por chat'
        ],
        corDestaque: 'from-amber-600 via-orange-600 to-stone-800',
        linkDemo: 'https://king-s-barber-2-yn3c.vercel.app/'
      },
      {
        id: 'demo-academia-premium',
        titulo: 'Gimnasio & Centro de Entrenamiento',
        categoria: 'saude-fitness',
        planoId: 'profissional',
        destaqueHome: true,
        descricaoCurta: 'Página dinámica y motivadora con planes de membresía, horarios y reserva de clase de prueba.',
        descricaoCompleta: 'Estructura pensada para gimnasios, centros de CrossFit, pilates y entrenadores personales. Muestra modalidades, planes mensuales e invitación a una clase gratis.',
        segmentoAlvo: 'Gimnasios, boxes de CrossFit, centros de pilates y entrenadores',
        tags: ['Alta Energía', 'Planes Mensuales', 'Clase de Prueba', 'Modalidades'],
        recursos: [
          'Presentación clara de tarifas y beneficios incluidos',
          'Galería de actividades con fotos de alto impacto',
          'Llamada directa para agendar clase de prueba',
          'Diseño completamente optimizado para móviles'
        ],
        corDestaque: 'from-cyan-600 via-blue-600 to-indigo-800',
        linkDemo: 'https://academia-premium-beryl.vercel.app/'
      },
      {
        id: 'demo-imobiliaria-premium',
        titulo: 'Portal Inmobiliario & Negocios',
        categoria: 'imobiliario',
        planoId: 'personalizado',
        destaqueHome: true,
        descricaoCurta: 'Presentación de propiedades residenciales y comerciales con diseño imponente y captación de clientes cualificados.',
        descricaoCompleta: 'Diseñado para agencias inmobiliarias, agentes independientes y promotoras. Destaca nuevos lanzamientos, inmuebles en venta o alquiler y contacto directo con el agente.',
        segmentoAlvo: 'Inmobiliarias, agentes independientes, promotores y constructoras',
        tags: ['Autoridad', 'Inmuebles Destacados', 'Filtro por Tipo', 'Contacto con Agente'],
        recursos: [
          'Vitrina elegante de inmuebles con fotos y especificaciones',
          'Formulario conciso de interés para atención prioritaria',
          'Sección institucional que consolida la confianza de la marca',
          'Botones de contacto inmediato con agentes comerciales'
        ],
        corDestaque: 'from-emerald-600 via-teal-600 to-slate-800',
        linkDemo: 'https://imobili-ria-premium.vercel.app/'
      },
      {
        id: 'demo-clinica-saude',
        titulo: 'Clínica Médica & Salud Especializada',
        categoria: 'saude-fitness',
        planoId: 'premium',
        destaqueHome: false,
        descricaoCurta: 'Transmite serenidad, cercanía y autoridad médica para consultas y tratamientos especializados.',
        descricaoCompleta: 'Solución ideal para consultorios, clínicas multidisciplinares, odontología y profesionales de la salud. Informa sobre especialidades, equipo médico y coberturas aceptadas.',
        segmentoAlvo: 'Clínicas médicas, odontología, fisioterapia y especialistas de salud',
        tags: ['Confianza Médica', 'Especialidades', 'Citas Online', 'Informativo'],
        recursos: [
          'Presentación humanizada del equipo de facultativos',
          'Listado completo de especialidades y procedimientos',
          'Canal de triaje y citas directas por WhatsApp',
          'Ubicación con mapa interactivo y datos de acceso'
        ],
        corDestaque: 'from-indigo-600 via-sky-600 to-blue-900',
        linkDemo: 'https://grok-workspace-1-three-alpha.vercel.app/'
      },
      {
        id: 'demo-restaurante-premium',
        titulo: 'Restaurante Gourmet & Gastronomía',
        categoria: 'gastronomia',
        planoId: 'personalizado',
        destaqueHome: false,
        descricaoCurta: 'Menú apetitoso con fotografías cautivadoras, ambiente acogedor y reserva de mesas en un toque.',
        descricaoCompleta: 'Desarrollado para restaurantes, bistrós, pizzerías y espacios gastronómicos. Expone la carta con platos destacados, bebidas y opción para reservas o pedidos a domicilio.',
        segmentoAlvo: 'Restaurantes, bistrós, hamburgueserías, pizzerías y bares',
        tags: ['Menú Digital', 'Reserva de Mesa', 'Fotos Apetitosas', 'Experiencia Culinaria'],
        recursos: [
          'Carta digital interactiva organizada por categorías',
          'Fotografía sensorial de platos en alta resolución',
          'Módulo de reservas de mesa y pedidos directos',
          'Horarios de apertura y mapa de ubicación'
        ],
        corDestaque: 'from-orange-600 via-amber-600 to-red-700',
        linkDemo: 'https://restaurante-premium-delta.vercel.app/'
      }
    ];
  }

  if (lang === 'fr') {
    return [
      {
        id: 'demo-salao-premium',
        titulo: 'Salon Premium & Studio de Beauté',
        categoria: 'beleza-estetica',
        planoId: 'profissional',
        destaqueHome: true,
        descricaoCurta: 'Mise en page raffinée mettant en valeur les soins esthétiques avec prise de rendez-vous instantanée.',
        descricaoCompleta: 'Conçu pour instituts de beauté et salons haut de gamme. Présente la carte des soins, coiffure, galerie de transformations et intégration WhatsApp.',
        segmentoAlvo: 'Instituts de beauté, salons de coiffure, maquilleuses et spas de luxe',
        tags: ['Design Raffiné', 'Réservation Simple', 'Vitrine de Soins', 'Mobile First'],
        recursos: [
          'Présentation élégante des soins et prestations',
          'Boutons de réservation directe via WhatsApp',
          'Atmosphère soignée instaurant confiance et prestige',
          'Temps de chargement ultra rapide sur tous smartphones'
        ],
        corDestaque: 'from-pink-600 via-rose-500 to-amber-500',
        linkDemo: 'https://sal-o-premium.vercel.app/'
      },
      {
        id: 'demo-barbearia-kings',
        titulo: 'Barber Shop King\'s Barber',
        categoria: 'beleza-estetica',
        planoId: 'essencial',
        destaqueHome: true,
        descricaoCurta: 'Style contemporain et authentique axé sur les rendez-vous et le soin masculin.',
        descricaoCompleta: 'Le modèle parfait pour barbiers traditionnels ou modernes. Met en avant la grille tarifaire barbe et coupe, horaires et équipe.',
        segmentoAlvo: 'Barbiers, salons de soins masculins et studios de tatouage',
        tags: ['Style Moderne', 'Grille Tarifaire', 'Réservation Directe', 'Plan d’Accès'],
        recursos: [
          'Identité visuelle forte et contrastée',
          'Tarifs détaillés avec durée estimée des prestations',
          'Plan Google Maps intégré et horaires d’ouverture',
          'Bouton de prise de rendez-vous en un clic'
        ],
        corDestaque: 'from-amber-600 via-orange-600 to-stone-800',
        linkDemo: 'https://king-s-barber-2-yn3c.vercel.app/'
      },
      {
        id: 'demo-academia-premium',
        titulo: 'Salle de Sport & Centre Fitness',
        categoria: 'saude-fitness',
        planoId: 'profissional',
        destaqueHome: true,
        descricaoCurta: 'Page dynamique et motivante avec formules d’abonnement, plannings et séance d’essai.',
        descricaoCompleta: 'Conçu pour salles de sport, studios de pilates, box CrossFit et coachs personnels. Valorise les disciplines, tarifs et séance découverte.',
        segmentoAlvo: 'Salles de sport, clubs CrossFit, studios de pilates et coachs sportifs',
        tags: ['Énergie Pure', 'Abonnements', 'Séance d’Essai', 'Disciplines'],
        recursos: [
          'Présentation lisible des formules et avantages',
          'Mise en valeur visuelle des activités et équipements',
          'Incitation directe à réserver une séance d’essai offerte',
          'Ergonomie fluide pensée pour mobile'
        ],
        corDestaque: 'from-cyan-600 via-blue-600 to-indigo-800',
        linkDemo: 'https://academia-premium-beryl.vercel.app/'
      },
      {
        id: 'demo-imobiliaria-premium',
        titulo: 'Portail Immobilier & Résidences',
        categoria: 'imobiliario',
        planoId: 'personalizado',
        destaqueHome: true,
        descricaoCurta: 'Présentation de biens résidentiels et commerciaux avec design valorisant et capture de leads qualifiés.',
        descricaoCompleta: 'Créé pour agences immobilières, mandataires et promoteurs. Met en avant programmes neufs, ventes, locations et prise de contact agent.',
        segmentoAlvo: 'Agences immobilières, promoteurs, mandataires et gestionnaires',
        tags: ['Prestige', 'Biens en Vedette', 'Filtres de Recherche', 'Contact Agent'],
        recursos: [
          'Vitrine soignée avec photographies et caractéristiques',
          'Formulaire rapide de demande de visite prioritaire',
          'Section renforçant l’autorité et les garanties de l’agence',
          'Accès direct aux coordonnées des conseillers dédiés'
        ],
        corDestaque: 'from-emerald-600 via-teal-600 to-slate-800',
        linkDemo: 'https://imobili-ria-premium.vercel.app/'
      },
      {
        id: 'demo-clinica-saude',
        titulo: 'Cabinet Médical & Soins Spécialisés',
        categoria: 'saude-fitness',
        planoId: 'premium',
        destaqueHome: false,
        descricaoCurta: 'Inspire sérénité, bienveillance et autorité médicale pour consultations et actes spécialisés.',
        descricaoCompleta: 'La solution complète pour cabinets, centres médicaux, chirurgiens-dentistes et thérapeutes. Détaille praticiens, spécialités et accès.',
        segmentoAlvo: 'Cabinets médicaux, dentistes, kinésithérapeutes et professionnels de santé',
        tags: ['Crédibilité Médicale', 'Spécialités', 'Prise de Rdv', 'Informatif'],
        recursos: [
          'Présentation humaine et professionnelle de l’équipe',
          'Liste exhaustive des spécialités et actes dispensés',
          'Orientation et prise de contact WhatsApp pour consultation',
          'Plan interactif avec accès transports et parking'
        ],
        corDestaque: 'from-indigo-600 via-sky-600 to-blue-900',
        linkDemo: 'https://grok-workspace-1-three-alpha.vercel.app/'
      },
      {
        id: 'demo-restaurante-premium',
        titulo: 'Restaurant Gourmand & Bistronomie',
        categoria: 'gastronomia',
        planoId: 'personalizado',
        destaqueHome: false,
        descricaoCurta: 'Menu appétissant avec superbes photos, ambiance chaleureuse et réservation de table en un geste.',
        descricaoCompleta: 'Réalisé pour restaurants, bistrots, pizzerias et bars à cocktails. Propose la carte des mets, suggestions du chef et réservation instantanée.',
        segmentoAlvo: 'Restaurants, bistrots, pizzerias, brasseries et bars',
        tags: ['Carte en Ligne', 'Réservation Table', 'Photos Gourmandes', 'Art de la Table'],
        recursos: [
          'Menu digital clair classé par entrées, plats et desserts',
          'Photographies culinaires haute définition',
          'Réservation de table et commandes à emporter',
          'Horaires de service et localisation GPS'
        ],
        corDestaque: 'from-orange-600 via-amber-600 to-red-700',
        linkDemo: 'https://restaurante-premium-delta.vercel.app/'
      }
    ];
  }

  if (lang === 'pt-PT') {
    return [
      {
        id: 'demo-salao-premium',
        titulo: 'Salão Premium & Studio de Beleza',
        categoria: 'beleza-estetica',
        planoId: 'profissional',
        destaqueHome: true,
        descricaoCurta: 'Ambiente visual refinado com apresentação de procedimentos estéticos e botão de marcação ágil.',
        descricaoCompleta: 'Criado para estúdios de beleza e salões sofisticados. Apresenta o catálogo de serviços, tratamentos capilares, galeria de resultados e integração direta para marcações rápidas.',
        segmentoAlvo: 'Salões de beleza, estúdios de estética, maquilhadoras e spas',
        tags: ['Design Sofisticado', 'Marcação Fácil', 'Galeria de Serviços', 'Mobile First'],
        recursos: [
          'Exibição visual elegante dos tratamentos e serviços',
          'Botões de marcação direta com mensagem pronta no WhatsApp',
          'Design clean com foco em transmitir luxo e confiança',
          'Carregamento ultra veloz em qualquer ligação móvel'
        ],
        corDestaque: 'from-pink-600 via-rose-500 to-amber-500',
        linkDemo: 'https://sal-o-premium.vercel.app/'
      },
      {
        id: 'demo-barbearia-kings',
        titulo: 'Barbearia King\'s Barber',
        categoria: 'beleza-estetica',
        planoId: 'essencial',
        destaqueHome: true,
        descricaoCurta: 'Visual moderno com estilo rústico e contemporâneo focado em reservas e serviços para o público masculino.',
        descricaoCompleta: 'Modelo ideal para barbearias tradicionais e contemporâneas. Destaca a tabela de preços, combo de barba e cabelo, horários de atendimento e equipa de barbeiros.',
        segmentoAlvo: 'Barbearias, centros de estética masculina e barbearias modernas',
        tags: ['Estilo Moderno', 'Tabela de Cortes', 'Marcação Direta', 'Localização'],
        recursos: [
          'Identidade visual marcante com contraste refinado',
          'Grelha de serviços com tempo estimado e valores',
          'Localização integrada e horários da barbearia',
          'Botão de marcação com confirmação rápida'
        ],
        corDestaque: 'from-amber-600 via-orange-600 to-stone-800',
        linkDemo: 'https://king-s-barber-2-yn3c.vercel.app/'
      },
      {
        id: 'demo-academia-premium',
        titulo: 'Ginásio & Centro de Treino',
        categoria: 'saude-fitness',
        planoId: 'profissional',
        destaqueHome: true,
        descricaoCurta: 'Página dinâmica e motivacional com planos de inscrição, grelha de treinos e chamada para aula experimental.',
        descricaoCompleta: 'Estrutura voltada para ginásios, estúdios de pilates, crossfit e centros de treino físico. Apresenta modalidades, planos mensais e incentivo para aula experimental gratuita.',
        segmentoAlvo: 'Ginásios, estúdios de crossfit, pilates e personal trainers',
        tags: ['Alta Energia', 'Planos de Inscrição', 'Aula Experimental', 'Modalidades'],
        recursos: [
          'Apresentação clara dos planos e benefícios incluídos',
          'Secção de modalidades desportivas com fotos de alta energia',
          'Chamada para marcação de aula experimental gratuita',
          'Compatibilidade total com telemóveis'
        ],
        corDestaque: 'from-cyan-600 via-blue-600 to-indigo-800',
        linkDemo: 'https://academia-premium-beryl.vercel.app/'
      },
      {
        id: 'demo-imobiliaria-premium',
        titulo: 'Portal Imobiliário & Negócios',
        categoria: 'imobiliario',
        planoId: 'personalizado',
        destaqueHome: true,
        descricaoCurta: 'Apresentação de imóveis residenciais e comerciais com visual imponente e captação de clientes qualificados.',
        descricaoCompleta: 'Desenvolvido para agências imobiliárias, consultores independentes e promotores. Destaca empreendimentos novos, imóveis para venda ou arrendamento e contacto facilitado.',
        segmentoAlvo: 'Imobiliárias, consultores imobiliários, promotores e loteamentos',
        tags: ['Autoridade', 'Destaque de Imóveis', 'Filtro por Tipo', 'Contacto com Consultor'],
        recursos: [
          'Montra elegante de imóveis com fotografias e pormenores técnicos',
          'Formulário conciso de interesse para atendimento prioritário',
          'Secção institucional que transmite credibilidade e garantia',
          'Botões de atendimento direto para consultores credenciados'
        ],
        corDestaque: 'from-emerald-600 via-teal-600 to-slate-800',
        linkDemo: 'https://imobili-ria-premium.vercel.app/'
      },
      {
        id: 'demo-clinica-saude',
        titulo: 'Clínica Médica & Saúde Especializada',
        categoria: 'saude-fitness',
        planoId: 'premium',
        destaqueHome: false,
        descricaoCurta: 'Transmite serenidade, acolhimento e autoridade médica para consultas e atos clínicos especializados.',
        descricaoCompleta: 'Solução perfeita para consultórios, clínicas multidisciplinares, medicina dentária e profissionais da saúde. Informa sobre especialidades, corpo clínico e acordos.',
        segmentoAlvo: 'Clínicas médicas, medicina dentária, fisioterapia, psicologia e diagnóstico',
        tags: ['Credibilidade Médica', 'Especialidades', 'Marcação de Consulta', 'Informativo'],
        recursos: [
          'Apresentação humanizada dos profissionais de saúde',
          'Lista de especialidades e procedimentos realizados',
          'Canal de triagem e marcação de consultas por WhatsApp',
          'Localização com mapa interativo e informações de acesso'
        ],
        corDestaque: 'from-indigo-600 via-sky-600 to-blue-900',
        linkDemo: 'https://grok-workspace-1-three-alpha.vercel.app/'
      },
      {
        id: 'demo-restaurante-premium',
        titulo: 'Restaurante & Gastronomia Gourmet',
        categoria: 'gastronomia',
        planoId: 'personalizado',
        destaqueHome: false,
        descricaoCurta: 'Ementa apetitosa com fotos expressivas, ambiente acolhedor e reserva de mesas com um toque.',
        descricaoCompleta: 'Desenvolvido à medida para restaurantes, bistrôs, pizzarias e espaços gastronómicos. Exibe o menu com pratos em destaque, carta de vinhos e botão para reservas ou takeaway.',
        segmentoAlvo: 'Restaurantes, bistrôs, hamburguerias, pizzarias e bares',
        tags: ['Ementa Visual', 'Reserva de Mesa', 'Fotos Apetitosas', 'Experiência Gastronómica'],
        recursos: [
          'Ementa digital organizada por categorias e pratos especiais',
          'Fotografias atraentes com foco na experiência sensorial',
          'Sistema direto para reserva de mesas e pedidos',
          'Horários de funcionamento e localização GPS'
        ],
        corDestaque: 'from-orange-600 via-amber-600 to-red-700',
        linkDemo: 'https://restaurante-premium-delta.vercel.app/'
      }
    ];
  }

  // pt-BR (padrão)
  return [
    {
      id: 'demo-salao-premium',
      titulo: 'Salão Premium & Studio de Beleza',
      categoria: 'beleza-estetica',
      planoId: 'profissional',
      destaqueHome: true,
      descricaoCurta: 'Ambiente visual refinado com apresentação de procedimentos estéticos e botão de agendamento ágil.',
      descricaoCompleta: 'Criado para estúdios de beleza e salões sofisticados. Apresenta o catálogo de serviços, tratamentos capilares, galeria de resultados e integração direta para agendamentos rápidos.',
      segmentoAlvo: 'Salões de beleza, estúdios de estética, maquiadoras e spas',
      tags: ['Design Sofisticado', 'Agendamento Fácil', 'Galeria de Serviços', 'Mobile First'],
      recursos: [
        'Exibição visual elegante dos tratamentos e serviços',
        'Botões de agendamento direto com confirmação rápida',
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
      planoId: 'essencial',
      destaqueHome: true,
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
      planoId: 'profissional',
      destaqueHome: true,
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
      planoId: 'personalizado',
      destaqueHome: true,
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
      planoId: 'premium',
      destaqueHome: false,
      descricaoCurta: 'Transmite serenidade, acolhimento e autoridade médica para consultas e procedimentos especializados.',
      descricaoCompleta: 'Solução perfeita para consultórios, clínicas multidisciplinares, odontologia e profissionais da saúde. Informa sobre especialidades atendidas, corpo clínico e convênios aceitos.',
      segmentoAlvo: 'Clínicas médicas, odontologia, fisioterapia, psicologia e diagnósticos',
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
      id: 'demo-restaurante-premium',
      titulo: 'Restaurante & Gastronomia Gourmet',
      categoria: 'gastronomia',
      planoId: 'personalizado',
      destaqueHome: false,
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

export const PORTFOLIO_CATEGORIES = getPortfolioCategories('pt-BR');
export const PORTFOLIO_PROJECTS = getPortfolioProjects('pt-BR');
