export type ServiceAvailability = 'disponivel' | 'em_desenvolvimento' | 'em_breve';

export interface OurServiceItem {
  id: string;
  titulo: string;
  descricao: string;
  status: ServiceAvailability;
  statusLabel: string;
  finalidade: string;
  recursos: string[];
  iconeNome: string;
  demoProjectId?: string;
  segmentKey?: string;
  planoSugerido?: string;
  observacaoDisponibilidade?: string;
}

export const OUR_SERVICES: OurServiceItem[] = [
  {
    id: 'link-na-bio',
    titulo: 'Link na Bio',
    descricao: 'Página personalizada reunindo Instagram, TikTok, YouTube, WhatsApp e outros links.',
    status: 'em_desenvolvimento',
    statusLabel: 'Em desenvolvimento',
    finalidade:
      'Página mobile-first pensada para reunir em uma única URL todos os canais de contato, redes sociais e links estratégicos do negócio ou criador de conteúdo, com carregamento instantâneo no celular.',
    recursos: [
      'Links ilimitados para todas as suas redes sociais e contatos',
      'Botão de atendimento direto para WhatsApp',
      'Layout com a identidade visual e cores da sua marca',
      'Carregamento ultra veloz sem dependência de plataformas de terceiros',
    ],
    iconeNome: 'Share2',
    observacaoDisponibilidade:
      'Este formato de página está em desenvolvimento pela equipe NexaWeb. Em breve estará disponível com modelos exclusivos.',
  },
  {
    id: 'landing-pages',
    titulo: 'Landing Pages',
    descricao: 'Páginas focadas em divulgar produtos, serviços, campanhas e ofertas.',
    status: 'disponivel',
    statusLabel: 'Disponível',
    finalidade:
      'Páginas de conversão de alta performance estruturadas estrategicamente para direcionar a atenção do visitante para uma ação principal: contratar um serviço, comprar uma oferta ou falar direto no WhatsApp.',
    recursos: [
      'Estrutura com foco total em conversão e persuasão',
      'Chamadas para ação (CTAs) estrategicamente posicionadas',
      'Design responsivo impecável em celulares e computadores',
      'Otimização de velocidade e SEO básico para buscas',
    ],
    iconeNome: 'Layout',
    demoProjectId: 'demo-vertex-digital',
    segmentKey: 'landing_page',
    planoSugerido: 'profissional',
  },
  {
    id: 'curriculo-portfolio',
    titulo: 'Currículo e Portfólio',
    descricao: 'Página profissional para apresentar experiências, habilidades, projetos e trabalhos.',
    status: 'disponivel',
    statusLabel: 'Disponível',
    finalidade:
      'Página autoral desenvolvida para profissionais autônomos, arquitetos, designers, consultores e especialistas apresentarem suas realizações, galeria de trabalhos concluídos e contatos de contratação.',
    recursos: [
      'Vitrine fotográfica para projetos e trabalhos já realizados',
      'Apresentação clara de trajetória, qualificações e diferenciais',
      'Links para redes profissionais e canais diretos',
      'Formulário enxuto para orçamentos e propostas',
    ],
    iconeNome: 'Briefcase',
    demoProjectId: 'demo-nova-arq',
    segmentKey: 'portfolio',
    planoSugerido: 'profissional',
  },
  {
    id: 'pagina-agendamento',
    titulo: 'Página de Agendamento',
    descricao: 'Página para apresentar serviços e permitir que clientes solicitem ou realizem agendamentos.',
    status: 'disponivel',
    statusLabel: 'Disponível',
    finalidade:
      'Página voltada para barbearias, salões de beleza, estúdios de estética e clínicas apresentarem tabela clara de serviços, valores, horários e botão de atendimento direto para solicitação de agendamento.',
    recursos: [
      'Tabela transparente de serviços com duração e valores',
      'Exibição de horários de funcionamento e localização',
      'Botão de solicitação ágil de agendamento via WhatsApp',
      'Layout moderno com fotos reais dos procedimentos',
    ],
    iconeNome: 'Calendar',
    demoProjectId: 'demo-barbearia-kings',
    segmentKey: 'barbearia',
    planoSugerido: 'essencial',
  },
  {
    id: 'catalogo-online',
    titulo: 'Catálogo Online',
    descricao: 'Vitrine digital com produtos, fotos, descrições, preços e contato para pedidos.',
    status: 'disponivel',
    statusLabel: 'Disponível',
    finalidade:
      'Vitrine digital moderna para lojas de roupas, acessórios, calçados e comércio em geral, organizando produtos por categorias com fotos em alta definição, especificações e contato direto para pedidos.',
    recursos: [
      'Vitrine visual de produtos com fotos de alta qualidade',
      'Organização por categorias, coleções e novidades',
      'Detalhes de itens com descrições e valores',
      'Encaminhamento direto de interesse e pedidos para o WhatsApp',
    ],
    iconeNome: 'ShoppingBag',
    demoProjectId: 'demo-loja-premium',
    segmentKey: 'loja',
    planoSugerido: 'premium',
  },
  {
    id: 'pagina-instagram',
    titulo: 'Página para Instagram',
    descricao: 'Página comercial personalizada para transformar visitantes das redes sociais em potenciais clientes.',
    status: 'em_desenvolvimento',
    statusLabel: 'Em desenvolvimento',
    finalidade:
      'Página otimizada especificamente para o tráfego vindo de stories, reels e perfil do Instagram, com carregamento ultrarrápido e navegação vertical intuitiva com foco em conversão rápida de novos seguidores.',
    recursos: [
      'Layout vertical planejado para navegação fluida em telas mobile',
      'Apresentação rápida dos produtos ou serviços de maior interesse',
      'Botão de ação imediata com mensagem pronta para WhatsApp',
      'Identidade visual alinhada à estética do seu perfil nas redes',
    ],
    iconeNome: 'Camera',
    observacaoDisponibilidade:
      'Este modelo de página está atualmente em desenvolvimento por nossa equipe técnica. Fale conosco para detalhes.',
  },
  {
    id: 'pagina-eventos',
    titulo: 'Página para Eventos',
    descricao: 'Site para divulgar eventos, datas, programação, localização e inscrições.',
    status: 'em_breve',
    statusLabel: 'Em breve',
    finalidade:
      'Site dedicado à divulgação de congressos, workshops, palestras, conferências e celebrações, destacando cronograma de atividades, palestrantes convidados, mapa de acesso e canal de contato para inscrições.',
    recursos: [
      'Programação detalhada com datas, horários e atrações',
      'Apresentação de palestrantes, especialistas e convidados',
      'Informações de localização com mapa de acesso',
      'Canal de contato direto para dúvidas e inscrições',
    ],
    iconeNome: 'Ticket',
    observacaoDisponibilidade:
      'Solução em fase de planejamento na NexaWeb. Em breve anunciaremos a disponibilização deste modelo.',
  },
  {
    id: 'pagina-imovel',
    titulo: 'Página de Imóvel',
    descricao: 'Página para divulgar imóveis com fotos, características, localização e contato do corretor.',
    status: 'disponivel',
    statusLabel: 'Disponível',
    finalidade:
      'Página de alto padrão para imobiliárias, corretores e incorporadoras divulgarem lançamentos residenciais ou imóveis selecionados, com galeria fotográfica marcante, ficha técnica e atendimento exclusivo.',
    recursos: [
      'Vitrine fotográfica em alta definição dos ambientes do imóvel',
      'Ficha técnica completa com metragem, dormitórios e características',
      'Destaque dos diferenciais de localização e comodidades',
      'Botões de contato prioritário direto com o corretor responsável',
    ],
    iconeNome: 'Building2',
    demoProjectId: 'demo-imobiliaria-premium',
    segmentKey: 'imobiliaria',
    planoSugerido: 'premium',
  },
  {
    id: 'cardapio-digital',
    titulo: 'Cardápio Digital',
    descricao: 'Cardápio personalizado para restaurantes, lanchonetes, cafeterias e outros estabelecimentos.',
    status: 'disponivel',
    statusLabel: 'Disponível',
    finalidade:
      'Cardápio digital visual e responsivo para restaurantes, bistrôs, pizzarias e hamburguerias, acessível via QR Code ou link, destacando pratos do dia, fotos apetitosas e canal direto para reservas ou pedidos.',
    recursos: [
      'Cardápio organizado por categorias e especialidades',
      'Fotografias atrativas com foco na experiência sensorial',
      'Canal direto para pedidos e reservas de mesa via WhatsApp',
      'Horários de atendimento e localização geográfica do espaço',
    ],
    iconeNome: 'UtensilsCrossed',
    demoProjectId: 'demo-restaurante-premium',
    segmentKey: 'restaurante',
    planoSugerido: 'profissional',
  },
  {
    id: 'avaliacoes-depoimentos',
    titulo: 'Página de Avaliações e Depoimentos',
    descricao: 'Página para apresentar avaliações de clientes, depoimentos e trabalhos realizados.',
    status: 'em_breve',
    statusLabel: 'Em breve',
    finalidade:
      'Página estruturada como canal de autoridade e prova social, reunindo relatos reais de clientes, avaliações positivas de serviços e histórico de casos de sucesso para reforçar a credibilidade comercial do negócio.',
    recursos: [
      'Mural de depoimentos e experiências de clientes atendidos',
      'Destaques de avaliações e selos de satisfação',
      'Galeria de resultados e trabalhos executados',
      'Chamada estratégica para novos clientes solicitarem propostas',
    ],
    iconeNome: 'MessageSquareQuote',
    observacaoDisponibilidade:
      'Área especializada em desenvolvimento pela NexaWeb. Em breve disponível no aplicativo.',
  },
];
