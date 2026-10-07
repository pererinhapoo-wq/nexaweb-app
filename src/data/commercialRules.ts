// ====================================================
// NEXAWEB — REGRAS COMERCIAIS OFICIAIS E CANÔNICAS
// ====================================================

export interface ExtraFeature {
  id: string;
  nome: string;
  descricao: string;
  preco: number; // em Reais (R$)
  categoria: 'estrutural' | 'interatividade' | 'gestao' | 'realtime';
  isRealtime?: boolean;
}

export interface SegmentPreset {
  segmentId: string;
  segmentName: string;
  suggestedFeatureIds: string[]; // Apenas recomendações contextuais, NUNCA gratuitos
}

// 1. RECURSOS EXTRAS OFICIAIS (Tabela de Preços Canônica)
export const OFFICIAL_EXTRA_FEATURES: ExtraFeature[] = [
  // --- Nível R$ 150 ---
  {
    id: 'pagina_adicional',
    nome: 'Página Adicional',
    descricao: 'Estruturação de nova página com layout integrado',
    preco: 150,
    categoria: 'estrutural',
  },
  {
    id: 'galeria_videos',
    nome: 'Galeria de Vídeos',
    descricao: 'Vitrine multimídia integrada com vídeos do YouTube/Vimeo',
    preco: 150,
    categoria: 'estrutural',
  },
  {
    id: 'galeria_fotos',
    nome: 'Galeria de Fotos',
    descricao: 'Exibição em grade de alta qualidade com visualizador modal',
    preco: 150,
    categoria: 'estrutural',
  },
  {
    id: 'animacoes_suaves',
    nome: 'Animações Suaves',
    descricao: 'Microinterações e transições fluidas de alto padrão',
    preco: 150,
    categoria: 'interatividade',
  },
  {
    id: 'efeitos_scroll',
    nome: 'Efeitos de Scroll',
    descricao: 'Parallax e transições dinâmicas ao rolar a página',
    preco: 150,
    categoria: 'interatividade',
  },

  // --- Nível R$ 200 ---
  {
    id: 'formulario_personalizado',
    nome: 'Formulário Personalizado',
    descricao: 'Campos específicos e direcionamento direto para contato ou e-mail',
    preco: 200,
    categoria: 'interatividade',
  },
  {
    id: 'solicitacao_orcamento',
    nome: 'Solicitação de Orçamento',
    descricao: 'Etapas de triagem e cálculo estimado para o cliente',
    preco: 200,
    categoria: 'interatividade',
  },
  {
    id: 'cardapio_digital',
    nome: 'Cardápio Digital',
    descricao: 'Apresentação de pratos, bebidas e combos organizada por seções',
    preco: 200,
    categoria: 'interatividade',
  },
  {
    id: 'agendamento_simples',
    nome: 'Agendamento Simples',
    descricao: 'Seleção de data/horário e encaminhamento pré-formatado',
    preco: 200,
    categoria: 'interatividade',
  },
  {
    id: 'catalogo_produtos',
    nome: 'Catálogo de Produtos',
    descricao: 'Vitrine organizada com fotos, preços e especificações técnicas',
    preco: 200,
    categoria: 'interatividade',
  },
  {
    id: 'busca_imoveis',
    nome: 'Busca de Imóveis',
    descricao: 'Filtro por localização, tipo de imóvel e faixa de preço',
    preco: 200,
    categoria: 'interatividade',
  },
  {
    id: 'favoritos_busca',
    nome: 'Favoritos de Busca',
    descricao: 'Armazenamento de itens favoritados pelo visitante',
    preco: 200,
    categoria: 'interatividade',
  },

  // --- Nível R$ 300 ---
  {
    id: 'personalizacao_avancada',
    nome: 'Personalização Avançada',
    descricao: 'Adaptações exclusivas de design e identidade de marca',
    preco: 300,
    categoria: 'estrutural',
  },
  {
    id: 'area_aluno',
    nome: 'Área do Aluno',
    descricao: 'Acesso restrito para consulta de materiais e aulas',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'historico_treinos',
    nome: 'Histórico de Treinos',
    descricao: 'Módulo de fichas e acompanhamento de rotina esportiva',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'estatisticas_progresso',
    nome: 'Estatísticas de Progresso',
    descricao: 'Gráficos e evolução de métricas do usuário',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'area_treinador',
    nome: 'Área do Treinador',
    descricao: 'Gestão de treinos e acompanhamento de alunos',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'painel_administrativo',
    nome: 'Painel Administrativo',
    descricao: 'Gerenciamento simplificado de conteúdos e pedidos',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'conta_cliente',
    nome: 'Conta do Cliente',
    descricao: 'Login e área exclusiva do usuário cadastrado',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'gestao_agenda',
    nome: 'Gestão de Agenda',
    descricao: 'Painel para bloqueio e controle de horários disponíveis',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'pedido_online',
    nome: 'Pedido Online',
    descricao: 'Carrinho de compras simplificado com finalização de pedido',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'acompanhamento_veiculo',
    nome: 'Acompanhamento de Veículo',
    descricao: 'Status da revisão ou reparo do carro para o cliente',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'reserva_quartos',
    nome: 'Reserva de Quartos',
    descricao: 'Seletor de acomodações com cálculo de diárias',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'cursos_progresso',
    nome: 'Cursos / Progresso',
    descricao: 'Estrutura de módulos e marcação de aulas concluídas',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'galeria_privada',
    nome: 'Galeria Privada',
    descricao: 'Álbum protegido por senha ou link exclusivo',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'acompanhamento_obras',
    nome: 'Acompanhamento de Obras',
    descricao: 'Etapas da construção com fotos e relatórios de progresso',
    preco: 300,
    categoria: 'gestao',
  },
  {
    id: 'conteudo_exclusivo',
    nome: 'Conteúdo Exclusivo',
    descricao: 'Área com materiais VIP para clientes qualificados',
    preco: 300,
    categoria: 'gestao',
  },

  // --- Recursos Realtime Existentes (+ R$ 300 cada | Somente Personalizado & Premium) ---
  {
    id: 'realtime_ocupacao_academia',
    nome: 'Ocupação da Academia (Realtime)',
    descricao: 'Indicador em tempo real de lotação da academia',
    preco: 300,
    categoria: 'realtime',
    isRealtime: true,
  },
  {
    id: 'realtime_equipamentos',
    nome: 'Disponibilidade de Equipamentos (Realtime)',
    descricao: 'Status de máquinas e aparelhos em tempo real',
    preco: 300,
    categoria: 'realtime',
    isRealtime: true,
  },
  {
    id: 'realtime_fila_barbearia',
    nome: 'Fila de Espera da Barbearia (Realtime)',
    descricao: 'Status da fila e tempo estimado para atendimento',
    preco: 300,
    categoria: 'realtime',
    isRealtime: true,
  },
  {
    id: 'realtime_mesas_restaurante',
    nome: 'Mesas do Restaurante (Realtime)',
    descricao: 'Disponibilidade ao vivo de mesas para clientes',
    preco: 300,
    categoria: 'realtime',
    isRealtime: true,
  },
  {
    id: 'realtime_status_imovel',
    nome: 'Status do Imóvel (Realtime)',
    descricao: 'Sinalização instantânea de unidades disponíveis ou reservadas',
    preco: 300,
    categoria: 'realtime',
    isRealtime: true,
  },
  {
    id: 'realtime_status_oficina',
    nome: 'Status da Oficina (Realtime)',
    descricao: 'Acompanhamento ao vivo da bancada mecânica',
    preco: 300,
    categoria: 'realtime',
    isRealtime: true,
  },
  {
    id: 'realtime_quartos_hotel',
    nome: 'Quartos do Hotel (Realtime)',
    descricao: 'Atualização instantânea de vagas e ocupação',
    preco: 300,
    categoria: 'realtime',
    isRealtime: true,
  },
  {
    id: 'realtime_estoque_ecommerce',
    nome: 'Estoque do E-commerce (Realtime)',
    descricao: 'Contador em tempo real de unidades disponíveis',
    preco: 300,
    categoria: 'realtime',
    isRealtime: true,
  },
  {
    id: 'realtime_aulas_aovivo',
    nome: 'Aulas ao Vivo (Realtime)',
    descricao: 'Indicador de transmissões e salas ativas',
    preco: 300,
    categoria: 'realtime',
    isRealtime: true,
  },
  {
    id: 'realtime_checkin_eventos',
    nome: 'Check-in de Eventos (Realtime)',
    descricao: 'Controle ao vivo de ingressos e participantes',
    preco: 300,
    categoria: 'realtime',
    isRealtime: true,
  },
  {
    id: 'realtime_progresso_obras',
    nome: 'Progresso de Obras (Realtime)',
    descricao: 'Atualização periódica e status ao vivo da obra',
    preco: 300,
    categoria: 'realtime',
    isRealtime: true,
  },
];

// 2. PRESETS POR SEGMENTO (Apenas recomendações, seguem seus preços oficiais)
export const SEGMENT_PRESETS: Record<string, SegmentPreset> = {
  food: {
    segmentId: 'food',
    segmentName: 'Restaurante & Gastronomia',
    suggestedFeatureIds: ['cardapio_digital', 'pedido_online', 'realtime_mesas_restaurante'],
  },
  barber: {
    segmentId: 'barber',
    segmentName: 'Barbearia & Barbearias',
    suggestedFeatureIds: ['agendamento_simples', 'galeria_fotos', 'realtime_fila_barbearia'],
  },
  beauty: {
    segmentId: 'beauty',
    segmentName: 'Beleza & Estética',
    suggestedFeatureIds: ['agendamento_simples', 'galeria_fotos', 'formulario_personalizado'],
  },
  fitness: {
    segmentId: 'fitness',
    segmentName: 'Saúde & Fitness',
    suggestedFeatureIds: ['agendamento_simples', 'historico_treinos', 'realtime_ocupacao_academia'],
  },
  realEstate: {
    segmentId: 'realEstate',
    segmentName: 'Imobiliário & Construtoras',
    suggestedFeatureIds: ['busca_imoveis', 'favoritos_busca', 'realtime_status_imovel'],
  },
  clinic: {
    segmentId: 'clinic',
    segmentName: 'Clínicas & Consultórios',
    suggestedFeatureIds: ['agendamento_simples', 'formulario_personalizado'],
  },
  retail: {
    segmentId: 'retail',
    segmentName: 'Comércio & Varejo',
    suggestedFeatureIds: ['catalogo_produtos', 'pedido_online', 'realtime_estoque_ecommerce'],
  },
  services: {
    segmentId: 'services',
    segmentName: 'Prestação de Serviços',
    suggestedFeatureIds: ['formulario_personalizado', 'solicitacao_orcamento', 'galeria_fotos'],
  },
  other: {
    segmentId: 'other',
    segmentName: 'Outro Segmento',
    suggestedFeatureIds: ['pagina_adicional', 'formulario_personalizado'],
  },
};

// 3. TABELA DE PLANOS E VALORES BASE OFICIAIS
export interface OfficialPlanCommercial {
  id: 'essencial' | 'profissional' | 'personalizado' | 'premium';
  nome: string;
  precoBase: number;
  prazo: string;
  tagline: string;
  posicionamento: string;
  advancedFeaturesLimit: number; // 0 para essencial, 3 para personalizado, 5 para profissional, 8 para premium
  isStartingFrom?: boolean; // Personalizado e Premium são "A partir de"
  allowExtras: boolean; // Essencial é fechado
  allowRealtime: boolean; // Realtime somente Personalizado e Premium
  descricaoComercial: string;
}

export const OFFICIAL_PLANS_COMMERCIAL: Record<string, OfficialPlanCommercial> = {
  essencial: {
    id: 'essencial',
    nome: 'ESSENCIAL',
    precoBase: 1000,
    prazo: '3–5 dias',
    tagline: 'Site profissional para começar',
    posicionamento: 'Para quem está começando.',
    advancedFeaturesLimit: 0,
    allowExtras: false, // Plano fechado
    allowRealtime: false,
    descricaoComercial: 'Para quem está começando.',
  },
  profissional: {
    id: 'profissional',
    nome: 'PROFISSIONAL',
    precoBase: 1700,
    prazo: '5–8 dias',
    tagline: 'Mais recursos e autoridade para fortalecer sua marca no mercado',
    posicionamento: 'Para negócios que precisam de mais recursos e presença profissional.',
    advancedFeaturesLimit: 5,
    allowExtras: true, // Aceita extras normais
    allowRealtime: false, // Realtime requer Personalizado ou Premium
    descricaoComercial: 'Para negócios que precisam de mais recursos e presença profissional.',
  },
  personalizado: {
    id: 'personalizado',
    nome: 'PERSONALIZADO',
    precoBase: 2800,
    prazo: 'Conforme escopo',
    isStartingFrom: true,
    tagline: 'Escopo dependente do projeto',
    posicionamento: 'Para quem precisa de um projeto sob medida.',
    advancedFeaturesLimit: 3,
    allowExtras: true,
    allowRealtime: true,
    descricaoComercial: 'Para quem precisa de um projeto sob medida.',
  },
  premium: {
    id: 'premium',
    nome: 'PREMIUM',
    precoBase: 4500,
    prazo: 'VIP / conforme escopo',
    isStartingFrom: true,
    tagline: 'VIP / conforme escopo',
    posicionamento: 'Para projetos avançados e experiências mais completas.',
    advancedFeaturesLimit: 8,
    allowExtras: true,
    allowRealtime: true,
    descricaoComercial: 'Para projetos avançados e experiências mais completas.',
  },
};

// 4. REGRAS DE UPLOAD DE ARQUIVOS
export const UPLOAD_RULES = {
  maxFiles: 6,
  maxSizeBytes: 10 * 1024 * 1024, // 10 MB por arquivo
  maxSizeMB: 10,
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
};
