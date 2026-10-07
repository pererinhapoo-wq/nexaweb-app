// =========================================================================
// NEXAWEB — MATRIZ OFICIAL DE FUNCIONALIDADES POR SEGMENTO & PLANO (ETAPA 7)
// =========================================================================

export type AdvancedFeatureCategory =
  | 'Atendimento / Agendamento'
  | 'Clientes'
  | 'Gestão'
  | 'Pedidos'
  | 'Catálogo'
  | 'Área do Cliente'
  | 'Métricas / Analytics'
  | 'SEO'
  | 'Integrações'
  | 'Conteúdo'
  | 'Tempo real'
  | 'Automação'
  | 'Recursos avançados';

export const ADVANCED_FEATURE_CATEGORIES: AdvancedFeatureCategory[] = [
  'Atendimento / Agendamento',
  'Clientes',
  'Gestão',
  'Pedidos',
  'Catálogo',
  'Área do Cliente',
  'Métricas / Analytics',
  'SEO',
  'Integrações',
  'Conteúdo',
  'Tempo real',
  'Automação',
  'Recursos avançados',
];

export interface AdvancedFeatureItem {
  id: string;
  nome: string;
  descricao: string;
  categoria: AdvancedFeatureCategory;
  isComplex?: boolean; // Identificado como "Avançado / avaliação" (depende de análise técnica)
  planLevel?: 'personalizado' | 'profissional' | 'premium';
  segmentKey?: string;
}

// Limites canônicos oficiais de funcionalidades avançadas selecionáveis no Briefing (Regra 1)
export const PLAN_ADVANCED_FEATURES_LIMITS: Record<string, number> = {
  essencial: 0,
  personalizado: 3,
  profissional: 5,
  premium: 8,
};

export function getPlanAdvancedFeaturesLimit(planId: string): number {
  const norm = planId ? planId.toLowerCase() : 'profissional';
  if (norm in PLAN_ADVANCED_FEATURES_LIMITS) {
    return PLAN_ADVANCED_FEATURES_LIMITS[norm];
  }
  return 5;
}

export interface SegmentPlanFeatureRaw {
  nome: string;
  categoria: AdvancedFeatureCategory;
  descricao: string;
  isComplex?: boolean;
}

// =========================================================================
// MATRIZ ESPECÍFICA OFICIAL DOS 10 SEGMENTOS CANÔNICOS (SEÇÕES 3 A 12)
// =========================================================================
export const SEGMENT_FEATURES_MATRIX: Record<
  string,
  {
    personalizado: SegmentPlanFeatureRaw[];
    profissional: SegmentPlanFeatureRaw[];
    premium: SegmentPlanFeatureRaw[];
  }
> = {
  // 3. ACADEMIA
  academia: {
    personalizado: [
      { nome: 'Horários de aulas', categoria: 'Atendimento / Agendamento', descricao: 'Grade de horários das aulas e modalidades' },
      { nome: 'Perfil de professores', categoria: 'Conteúdo', descricao: 'Apresentação da equipe de instrutores e qualificações' },
      { nome: 'Planos/mensalidades', categoria: 'Catálogo', descricao: 'Tabela com valores e condições de mensalidades' },
      { nome: 'Área do aluno', categoria: 'Área do Cliente', descricao: 'Ambiente com login para consulta de treinos e avisos', isComplex: true },
      { nome: 'Histórico de treinos', categoria: 'Área do Cliente', descricao: 'Fichas digitais com acompanhamento de treinos', isComplex: true },
      { nome: 'Metas/progresso', categoria: 'Área do Cliente', descricao: 'Registro de objetivos e evolução do aluno' },
    ],
    profissional: [
      { nome: 'Área do aluno', categoria: 'Área do Cliente', descricao: 'Portal do aluno para treinos, avisos e comunicados', isComplex: true },
      { nome: 'Histórico de treinos', categoria: 'Área do Cliente', descricao: 'Acompanhamento da evolução física e rotinas', isComplex: true },
      { nome: 'Horários de aulas', categoria: 'Atendimento / Agendamento', descricao: 'Grade interativa de horários por modalidade' },
      { nome: 'Perfil de professores', categoria: 'Conteúdo', descricao: 'Bio completa, fotos e especialidades dos instrutores' },
      { nome: 'Metas/progresso', categoria: 'Área do Cliente', descricao: 'Painel de metas e acompanhamento de resultados' },
      { nome: 'Reservas de aulas', categoria: 'Atendimento / Agendamento', descricao: 'Agendamento prévio de vagas para aulas concorridas' },
      { nome: 'Avaliação física', categoria: 'Atendimento / Agendamento', descricao: 'Formulário de solicitação e dados de bioimpedância' },
    ],
    premium: [
      { nome: 'Acompanhamento de treinos', categoria: 'Área do Cliente', descricao: 'Monitoramento detalhado de rotinas e séries', isComplex: true },
      { nome: 'Área avançada do professor', categoria: 'Gestão', descricao: 'Portal exclusivo para professores gerenciarem fichas', isComplex: true },
      { nome: 'Progresso e métricas', categoria: 'Métricas / Analytics', descricao: 'Gráficos e indicadores de evolução do aluno', isComplex: true },
      { nome: 'Ocupação em tempo real', categoria: 'Tempo real', descricao: 'Indicador ao vivo de lotação da academia', isComplex: true },
      { nome: 'Painel administrativo', categoria: 'Gestão', descricao: 'Painel completo para gestão da academia', isComplex: true },
      { nome: 'Notificações', categoria: 'Automação', descricao: 'Alertas automáticos para alunos via WhatsApp e e-mail', isComplex: true },
      { nome: 'Integrações externas', categoria: 'Integrações', descricao: 'Conexão com catracas, ERPs ou sistemas externos', isComplex: true },
      { nome: 'Experiência/app do aluno', categoria: 'Recursos avançados', descricao: 'Interface de aplicativo web instalável para o aluno', isComplex: true },
    ],
  },

  // 4. RESTAURANTE
  restaurante: {
    personalizado: [
      { nome: 'Cardápio digital', categoria: 'Catálogo', descricao: 'Visualização de pratos, bebidas e preços no site' },
      { nome: 'Reservas', categoria: 'Atendimento / Agendamento', descricao: 'Formulário para solicitar reserva de mesas' },
      { nome: 'Pedidos online', categoria: 'Pedidos', descricao: 'Seleção de itens e montagem de pedido online', isComplex: true },
      { nome: 'Retirada', categoria: 'Pedidos', descricao: 'Opção para cliente buscar o pedido no balcão' },
      { nome: 'Delivery', categoria: 'Pedidos', descricao: 'Roteamento de pedidos para entrega', isComplex: true },
      { nome: 'Eventos', categoria: 'Conteúdo', descricao: 'Seção informativa para reservas de eventos e festas' },
    ],
    profissional: [
      { nome: 'Cardápio avançado', categoria: 'Catálogo', descricao: 'Menu interativo com fotos em alta resolução e filtros' },
      { nome: 'Reservas', categoria: 'Atendimento / Agendamento', descricao: 'Sistema de solicitação de reservas de mesas' },
      { nome: 'Pedidos', categoria: 'Pedidos', descricao: 'Fluxo de montagem de pedidos com envio formatado', isComplex: true },
      { nome: 'Delivery/retirada', categoria: 'Pedidos', descricao: 'Opções combinadas de entrega e retirada', isComplex: true },
      { nome: 'Cupons', categoria: 'Clientes', descricao: 'Sistema de códigos promocionais e descontos' },
      { nome: 'Fidelidade', categoria: 'Clientes', descricao: 'Programa de pontos ou selos de fidelidade' },
      { nome: 'Avaliações', categoria: 'Clientes', descricao: 'Mural de depoimentos e notas dos clientes' },
      { nome: 'Eventos', categoria: 'Conteúdo', descricao: 'Formulário e detalhes para locação de espaço' },
    ],
    premium: [
      { nome: 'Gestão avançada de pedidos', categoria: 'Pedidos', descricao: 'Controle do fluxo de cozinha e expedição de pedidos', isComplex: true },
      { nome: 'Fidelidade avançada', categoria: 'Clientes', descricao: 'Mecânica avançada com pontuação e recompensas automáticas', isComplex: true },
      { nome: 'Área do cliente', categoria: 'Área do Cliente', descricao: 'Login para histórico de pedidos e favoritos', isComplex: true },
      { nome: 'Status do pedido em tempo real', categoria: 'Tempo real', descricao: 'Acompanhamento ao vivo do preparo e entrega', isComplex: true },
      { nome: 'Integração de delivery', categoria: 'Integrações', descricao: 'Conexão com iFood, WhatsApp ou motoboys', isComplex: true },
      { nome: 'Sistemas externos', categoria: 'Integrações', descricao: 'Integração com PDV, ERP ou impressora térmica', isComplex: true },
      { nome: 'Painel administrativo', categoria: 'Gestão', descricao: 'Gestão centralizada de cardápio, horários e pedidos', isComplex: true },
      { nome: 'Automação', categoria: 'Automação', descricao: 'Mensagens e alertas automáticos de status do pedido', isComplex: true },
    ],
  },

  // 5. SALÃO
  salao: {
    personalizado: [
      { nome: 'Agendamento', categoria: 'Atendimento / Agendamento', descricao: 'Formulário para escolha de data e horário' },
      { nome: 'Escolha do profissional', categoria: 'Atendimento / Agendamento', descricao: 'Opção para cliente escolher o cabeleireiro ou manicure' },
      { nome: 'Serviços', categoria: 'Catálogo', descricao: 'Lista detalhada dos procedimentos oferecidos' },
      { nome: 'Horários disponíveis', categoria: 'Atendimento / Agendamento', descricao: 'Visualização de turnos de atendimento' },
      { nome: 'Galeria', categoria: 'Conteúdo', descricao: 'Fotos de cortes, colorações e procedimentos realizados' },
      { nome: 'Depoimentos', categoria: 'Conteúdo', descricao: 'Opiniões e feedbacks de clientes atendidas' },
    ],
    profissional: [
      { nome: 'Agenda por profissional', categoria: 'Atendimento / Agendamento', descricao: 'Agendas individuais separadas por especialista' },
      { nome: 'Agendamento online', categoria: 'Atendimento / Agendamento', descricao: 'Marcação de procedimentos com seleção de serviços' },
      { nome: 'Histórico do cliente', categoria: 'Clientes', descricao: 'Registro de preferências e procedimentos anteriores', isComplex: true },
      { nome: 'Equipe', categoria: 'Conteúdo', descricao: 'Apresentação completa das especialistas do salão' },
      { nome: 'Serviços e preços', categoria: 'Catálogo', descricao: 'Tabela detalhada de serviços, durações e valores' },
      { nome: 'Lembretes', categoria: 'Automação', descricao: 'Mensagens automáticas para confirmar horários', isComplex: true },
      { nome: 'Fidelidade', categoria: 'Clientes', descricao: 'Cartão de benefícios e retorno para clientes assíduas' },
    ],
    premium: [
      { nome: 'Disponibilidade em tempo real', categoria: 'Tempo real', descricao: 'Bloqueio e liberação de horários ao vivo', isComplex: true },
      { nome: 'Área do cliente', categoria: 'Área do Cliente', descricao: 'Acesso exclusivo com histórico e agendamentos futuros', isComplex: true },
      { nome: 'Histórico avançado', categoria: 'Clientes', descricao: 'Registro completo de fórmulas de cor, químicas e fotos', isComplex: true },
      { nome: 'Fidelidade', categoria: 'Clientes', descricao: 'Programa de pontos e benefícios recorrentes', isComplex: true },
      { nome: 'Gestão da equipe', categoria: 'Gestão', descricao: 'Controle de turnos e comissões dos profissionais', isComplex: true },
      { nome: 'Notificações', categoria: 'Automação', descricao: 'Disparos automáticos no WhatsApp antes do atendimento', isComplex: true },
      { nome: 'Integrações', categoria: 'Integrações', descricao: 'Conexão com Google Agenda ou softwares de salão', isComplex: true },
      { nome: 'Painel administrativo', categoria: 'Gestão', descricao: 'Painel completo para gestão do salão', isComplex: true },
    ],
  },

  // 6. CLÍNICA (Regra: recursos relacionados a dados sensíveis marcados para avaliação de segurança)
  clinica: {
    personalizado: [
      { nome: 'Especialidades', categoria: 'Catálogo', descricao: 'Apresentação das áreas médicas atendidas' },
      { nome: 'Profissionais', categoria: 'Conteúdo', descricao: 'Apresentação do corpo clínico e registros (CRM/CRO)' },
      { nome: 'Agendamentos', categoria: 'Atendimento / Agendamento', descricao: 'Solicitação de pré-agendamento de consultas' },
      { nome: 'Horários', categoria: 'Atendimento / Agendamento', descricao: 'Informação dos dias e horários de atendimento' },
      { nome: 'Serviços', categoria: 'Catálogo', descricao: 'Relação de exames e procedimentos realizados' },
      { nome: 'Formulário de contato', categoria: 'Atendimento / Agendamento', descricao: 'Triagem e dúvidas para a recepção da clínica' },
    ],
    profissional: [
      { nome: 'Agendamento online', categoria: 'Atendimento / Agendamento', descricao: 'Marcação de consultas por especialidade' },
      { nome: 'Perfis profissionais', categoria: 'Conteúdo', descricao: 'Mini-currículo, titulações e foto dos médicos' },
      { nome: 'Especialidades', categoria: 'Catálogo', descricao: 'Detalhamento das áreas médicas da clínica' },
      { nome: 'Histórico do paciente', categoria: 'Clientes', descricao: 'Registro e acompanhamento seguro de retornos', isComplex: true },
      { nome: 'Lembretes', categoria: 'Automação', descricao: 'Lembretes automáticos para evitar faltas em consultas', isComplex: true },
      { nome: 'Área do paciente', categoria: 'Área do Cliente', descricao: 'Portal de acesso restrito para o paciente', isComplex: true },
      { nome: 'Convênios', categoria: 'Catálogo', descricao: 'Lista de planos de saúde e convênios credenciados' },
    ],
    premium: [
      { nome: 'Área completa do paciente', categoria: 'Área do Cliente', descricao: 'Portal com exames, agendamentos e orientações', isComplex: true },
      { nome: 'Agenda avançada', categoria: 'Gestão', descricao: 'Gestão multiprofissional com regras de encaixe', isComplex: true },
      { nome: 'Histórico integrado', categoria: 'Gestão', descricao: 'Prontuário ou histórico clínico com proteção de dados', isComplex: true },
      { nome: 'Notificações', categoria: 'Automação', descricao: 'Avisos de confirmação e preparo para exames', isComplex: true },
      { nome: 'Teleatendimento, quando aplicável', categoria: 'Recursos avançados', descricao: 'Infraestrutura para videochamadas ou teleconsulta', isComplex: true },
      { nome: 'Integrações externas', categoria: 'Integrações', descricao: 'Conexão com laboratórios ou sistemas de gestão médica', isComplex: true },
      { nome: 'Painel administrativo', categoria: 'Gestão', descricao: 'Controle de acessos, salas e secretárias', isComplex: true },
      { nome: 'Automação', categoria: 'Automação', descricao: 'Fluxos inteligentes de triagem e envio de resultados', isComplex: true },
    ],
  },

  // 7. LOJA / E-COMMERCE
  loja: {
    personalizado: [
      { nome: 'Catálogo', categoria: 'Catálogo', descricao: 'Apresentação dos produtos disponíveis' },
      { nome: 'Categorias', categoria: 'Catálogo', descricao: 'Separação organizada por tipos de produto' },
      { nome: 'Busca', categoria: 'Catálogo', descricao: 'Barra de pesquisa para encontrar itens rapidamente' },
      { nome: 'Filtros', categoria: 'Catálogo', descricao: 'Filtros básicos por categoria ou tipo' },
      { nome: 'Carrinho', categoria: 'Pedidos', descricao: 'Seleção de múltiplos itens antes de pedir' },
      { nome: 'Formulário de pedido', categoria: 'Pedidos', descricao: 'Envio direto do pedido para o WhatsApp da loja' },
    ],
    profissional: [
      { nome: 'Catálogo avançado', categoria: 'Catálogo', descricao: 'Vitrine com múltiplas fotos, variações de cor e tamanho' },
      { nome: 'Busca/filtros', categoria: 'Catálogo', descricao: 'Filtros combinados por preço, tamanho e novidades' },
      { nome: 'Carrinho', categoria: 'Pedidos', descricao: 'Carrinho dinâmico com cálculo de frete' },
      { nome: 'Checkout', categoria: 'Pedidos', descricao: 'Finalização completa de compra no próprio site', isComplex: true },
      { nome: 'Pagamento', categoria: 'Integrações', descricao: 'Integração com Pix e cartão de crédito', isComplex: true },
      { nome: 'Cupons', categoria: 'Clientes', descricao: 'Campo para aplicação de descontos promocionais' },
      { nome: 'Pedidos', categoria: 'Pedidos', descricao: 'Gestão e histórico dos pedidos recebidos' },
      { nome: 'Avaliações', categoria: 'Clientes', descricao: 'Comentários e fotos de clientes com os produtos' },
    ],
    premium: [
      { nome: 'Área do cliente', categoria: 'Área do Cliente', descricao: 'Portal com histórico de compras e endereços salvos', isComplex: true },
      { nome: 'Rastreamento de pedidos', categoria: 'Pedidos', descricao: 'Código e status da entrega dos Correios ou transportadora', isComplex: true },
      { nome: 'Estoque', categoria: 'Gestão', descricao: 'Controle de saldo e baixa automática de estoque', isComplex: true },
      { nome: 'Recomendações', categoria: 'Clientes', descricao: 'Sugestão personalizada de produtos relacionados', isComplex: true },
      { nome: 'Recuperação de carrinho', categoria: 'Automação', descricao: 'Disparo de mensagens para carrinhos abandonados', isComplex: true },
      { nome: 'Fidelidade', categoria: 'Clientes', descricao: 'Acúmulo de cashback ou pontos por compra', isComplex: true },
      { nome: 'Integrações', categoria: 'Integrações', descricao: 'Conexão com Bling, Tiny, Correios ou ERPs', isComplex: true },
      { nome: 'Painel avançado', categoria: 'Gestão', descricao: 'Relatórios de vendas, faturamento e curva ABC', isComplex: true },
    ],
  },

  // 8. IMOBILIÁRIA
  imobiliaria: {
    personalizado: [
      { nome: 'Catálogo de imóveis', categoria: 'Catálogo', descricao: 'Listagem de casas, apartamentos e terrenos' },
      { nome: 'Filtros', categoria: 'Catálogo', descricao: 'Filtro por tipo de imóvel e cidade' },
      { nome: 'Busca', categoria: 'Catálogo', descricao: 'Campo de busca por código de referência ou bairro' },
      { nome: 'Galeria', categoria: 'Conteúdo', descricao: 'Fotos dos imóveis com visualizador ampliado' },
      { nome: 'Formulário de interesse', categoria: 'Atendimento / Agendamento', descricao: 'Contato direto do cliente interessado no imóvel' },
      { nome: 'Perfil de corretor', categoria: 'Conteúdo', descricao: 'Informações de contato e CRECI do corretor' },
    ],
    profissional: [
      { nome: 'Mapa', categoria: 'Recursos avançados', descricao: 'Visualização dos imóveis em mapa geográfico interativo' },
      { nome: 'Busca avançada', categoria: 'Catálogo', descricao: 'Filtro por faixa de preço, número de quartos e vagas' },
      { nome: 'Filtros avançados', categoria: 'Catálogo', descricao: 'Filtros por condomínio, área útil e itens de lazer' },
      { nome: 'Favoritos', categoria: 'Clientes', descricao: 'Possibilidade de salvar imóveis favoritos no navegador' },
      { nome: 'Comparação', categoria: 'Catálogo', descricao: 'Comparativo lado a lado das características dos imóveis' },
      { nome: 'Perfil de corretor', categoria: 'Conteúdo', descricao: 'Lista de corretores e seus imóveis atribuídos' },
      { nome: 'Captação de leads', categoria: 'Clientes', descricao: 'Formulários estratégicos para novos compradores ou locatários' },
    ],
    premium: [
      { nome: 'Tour virtual', categoria: 'Recursos avançados', descricao: 'Visualização 360° ou vídeo imersivo do imóvel', isComplex: true },
      { nome: 'Área do cliente', categoria: 'Área do Cliente', descricao: 'Portal do proprietário e do locatário com extratos', isComplex: true },
      { nome: 'Favoritos avançados', categoria: 'Clientes', descricao: 'Alertas quando um imóvel favoritado muda de valor', isComplex: true },
      { nome: 'Alertas de novos imóveis', categoria: 'Automação', descricao: 'Notificação quando entra um imóvel com o perfil buscado', isComplex: true },
      { nome: 'CRM/integração', categoria: 'Integrações', descricao: 'Conexão com Vista CRM, RD Station ou sistemas imobiliários', isComplex: true },
      { nome: 'Painel de leads', categoria: 'Gestão', descricao: 'Distribuição inteligente de leads para corretores de plantão', isComplex: true },
      { nome: 'Analytics', categoria: 'Métricas / Analytics', descricao: 'Métricas de imóveis mais visualizados e convertidos', isComplex: true },
      { nome: 'Integrações externas', categoria: 'Integrações', descricao: 'Integração com ZAP Imóveis, VivaReal e portais parceiros', isComplex: true },
    ],
  },

  // 9. PRESTADOR DE SERVIÇOS
  prestador: {
    personalizado: [
      { nome: 'Serviços', categoria: 'Catálogo', descricao: 'Apresentação detalhada dos serviços prestados' },
      { nome: 'Orçamentos', categoria: 'Atendimento / Agendamento', descricao: 'Formulário simples para solicitação de orçamento' },
      { nome: 'Agendamento', categoria: 'Atendimento / Agendamento', descricao: 'Opção para marcar visita técnica ou atendimento' },
      { nome: 'Regiões atendidas', categoria: 'Conteúdo', descricao: 'Mapa ou lista de bairros e cidades atendidas' },
      { nome: 'Equipe', categoria: 'Conteúdo', descricao: 'Apresentação dos técnicos ou profissionais' },
      { nome: 'Portfólio', categoria: 'Conteúdo', descricao: 'Fotos de serviços executados com antes e depois' },
    ],
    profissional: [
      { nome: 'Solicitação de orçamento', categoria: 'Atendimento / Agendamento', descricao: 'Formulário com triagem detalhada do serviço' },
      { nome: 'Agendamento', categoria: 'Atendimento / Agendamento', descricao: 'Escolha de data e turno para a realização do serviço' },
      { nome: 'Área do cliente', categoria: 'Área do Cliente', descricao: 'Acesso do cliente para consultar propostas e laudos', isComplex: true },
      { nome: 'Histórico de serviços', categoria: 'Clientes', descricao: 'Registro de chamados e manutenções anteriores', isComplex: true },
      { nome: 'Equipe', categoria: 'Conteúdo', descricao: 'Qualificações técnicas e certificados da equipe' },
      { nome: 'Status do serviço', categoria: 'Gestão', descricao: 'Indicação das etapas do serviço em andamento' },
      { nome: 'Avaliações', categoria: 'Clientes', descricao: 'Depoimentos e notas de clientes atendidos' },
    ],
    premium: [
      { nome: 'Rastreamento em tempo real', categoria: 'Tempo real', descricao: 'Localização ou status ao vivo do deslocamento técnico', isComplex: true },
      { nome: 'Área completa do cliente', categoria: 'Área do Cliente', descricao: 'Portal com ordens de serviço, notas e garantias', isComplex: true },
      { nome: 'Painel da equipe', categoria: 'Gestão', descricao: 'Distribuição de chamados e rotas para os técnicos', isComplex: true },
      { nome: 'Ordens de serviço', categoria: 'Gestão', descricao: 'Emissão e controle digital de O.S.', isComplex: true },
      { nome: 'Notificações', categoria: 'Automação', descricao: 'Avisos automáticos no WhatsApp sobre o andamento do serviço', isComplex: true },
      { nome: 'Histórico avançado', categoria: 'Clientes', descricao: 'Relatórios técnicos detalhados com fotos', isComplex: true },
      { nome: 'Integrações', categoria: 'Integrações', descricao: 'Conexão com sistemas de faturamento e ERPs', isComplex: true },
      { nome: 'Automação', categoria: 'Automação', descricao: 'Disparo de pesquisas de satisfação e garantias', isComplex: true },
    ],
  },

  // 10. PET SHOP
  petshop: {
    personalizado: [
      { nome: 'Agendamento', categoria: 'Atendimento / Agendamento', descricao: 'Solicitação de banho e tosa com escolha de data' },
      { nome: 'Serviços', categoria: 'Catálogo', descricao: 'Lista de procedimentos estéticos e consultas' },
      { nome: 'Banho/tosa', categoria: 'Catálogo', descricao: 'Tipos de tosa, hidratações e pacotes' },
      { nome: 'Perfil do pet', categoria: 'Clientes', descricao: 'Nome, raça, porte e idade do pet' },
      { nome: 'Perfil do responsável', categoria: 'Clientes', descricao: 'Contato e dados do tutor do animal' },
      { nome: 'Galeria', categoria: 'Conteúdo', descricao: 'Fotos dos pets atendidos no salão' },
    ],
    profissional: [
      { nome: 'Agenda por profissional', categoria: 'Atendimento / Agendamento', descricao: 'Escolha do tosador ou veterinário de preferência' },
      { nome: 'Histórico do pet', categoria: 'Clientes', descricao: 'Registro de banhos, tosas e particularidades de comportamento', isComplex: true },
      { nome: 'Lembretes', categoria: 'Automação', descricao: 'Alertas automáticos para o tutor não esquecer o agendamento', isComplex: true },
      { nome: 'Serviços recorrentes', categoria: 'Catálogo', descricao: 'Planos mensais ou quinzenais de banho' },
      { nome: 'Avaliações', categoria: 'Clientes', descricao: 'Depoimentos de tutores com fotos dos seus pets' },
      { nome: 'Status do serviço', categoria: 'Gestão', descricao: 'Sinalização se o pet está pronto para retirada' },
      { nome: 'Cadastro do pet', categoria: 'Clientes', descricao: 'Ficha detalhada com alergias, vacinas e temperamento' },
    ],
    premium: [
      { nome: 'Área do responsável', categoria: 'Área do Cliente', descricao: 'Portal do tutor com histórico e agendamentos futuros', isComplex: true },
      { nome: 'Histórico completo do pet', categoria: 'Clientes', descricao: 'Prontuário estético e de saúde com fotos', isComplex: true },
      { nome: 'Vacinas/cuidados', categoria: 'Clientes', descricao: 'Carteirinha digital de vacinação e controle de vermífugos', isComplex: true },
      { nome: 'Acompanhamento do serviço', categoria: 'Gestão', descricao: 'Notificação em tempo real quando o pet terminar o banho', isComplex: true },
      { nome: 'Notificações', categoria: 'Automação', descricao: 'Mensagens no WhatsApp quando o pet estiver pronto', isComplex: true },
      { nome: 'Fidelidade', categoria: 'Clientes', descricao: 'Programa de pontos e recompensas para banhos frequentes', isComplex: true },
      { nome: 'Painel administrativo', categoria: 'Gestão', descricao: 'Gestão completa de agendamentos, clientes e produtos', isComplex: true },
      { nome: 'Integrações', categoria: 'Integrações', descricao: 'Conexão com sistemas veterinários ou ERP de pet shop', isComplex: true },
    ],
  },

  // 11. PORTFÓLIO PROFISSIONAL
  portfolio: {
    personalizado: [
      { nome: 'Projetos', categoria: 'Catálogo', descricao: 'Vitrine dos principais trabalhos realizados' },
      { nome: 'Categorias', categoria: 'Catálogo', descricao: 'Separação por tipo de projeto ou disciplina' },
      { nome: 'Serviços', categoria: 'Catálogo', descricao: 'Relação de serviços e formatos de contratação' },
      { nome: 'Currículo', categoria: 'Conteúdo', descricao: 'Trajetória profissional, formações e experiências' },
      { nome: 'Depoimentos', categoria: 'Conteúdo', descricao: 'Recomendações de clientes e parceiros' },
      { nome: 'Contato', categoria: 'Atendimento / Agendamento', descricao: 'Formulário direto para novas oportunidades' },
    ],
    profissional: [
      { nome: 'Filtros de projetos', categoria: 'Catálogo', descricao: 'Filtragem dinâmica por tecnologia, cliente ou ano' },
      { nome: 'Cases', categoria: 'Conteúdo', descricao: 'Estudos de caso detalhados com desafios, solução e impacto' },
      { nome: 'Blog/conteúdo', categoria: 'Conteúdo', descricao: 'Artigos e publicações técnicas para autoridade' },
      { nome: 'Formulário avançado', categoria: 'Atendimento / Agendamento', descricao: 'Briefing inicial com orçamento estimado do cliente' },
      { nome: 'Disponibilidade', categoria: 'Atendimento / Agendamento', descricao: 'Sinalizador de vagas para novos projetos' },
      { nome: 'Depoimentos', categoria: 'Conteúdo', descricao: 'Depoimentos com logo das empresas atendidas' },
      { nome: 'Newsletter', categoria: 'Clientes', descricao: 'Caixa de captura de e-mails para artigos periódicos' },
    ],
    premium: [
      { nome: 'Área exclusiva', categoria: 'Área do Cliente', descricao: 'Acesso com senha para clientes revisarem entregas', isComplex: true },
      { nome: 'Projetos interativos', categoria: 'Recursos avançados', descricao: 'Protótipos ao vivo ou demonstrações interativas', isComplex: true },
      { nome: 'Cases avançados', categoria: 'Conteúdo', descricao: 'Relatórios aprofundados com métricas e ROI do cliente', isComplex: true },
      { nome: 'Analytics', categoria: 'Métricas / Analytics', descricao: 'Rastreamento detalhado de visitantes e cliques', isComplex: true },
      { nome: 'Captação avançada de leads', categoria: 'Clientes', descricao: 'Formulário integrado com qualificação de leads', isComplex: true },
      { nome: 'Integrações', categoria: 'Integrações', descricao: 'Conexão com Notion, Dribbble, GitHub ou CRM', isComplex: true },
      { nome: 'Conteúdo personalizado', categoria: 'Conteúdo', descricao: 'Exibição adaptada conforme a origem da visita', isComplex: true },
      { nome: 'Experiência totalmente personalizada', categoria: 'Recursos avançados', descricao: 'Direção de arte autoral e interações exclusivas', isComplex: true },
    ],
  },

  // 12. LANDING PAGE
  landing_page: {
    personalizado: [
      { nome: 'CTA', categoria: 'Recursos avançados', descricao: 'Botões estratégicos de chamada para ação de alto impacto' },
      { nome: 'Formulário', categoria: 'Atendimento / Agendamento', descricao: 'Formulário limpo e direto para envio de contato' },
      { nome: 'Depoimentos', categoria: 'Conteúdo', descricao: 'Prova social com avaliações de clientes satisfeitos' },
      { nome: 'FAQ', categoria: 'Conteúdo', descricao: 'Respostas para as dúvidas mais comuns do visitante' },
      { nome: 'Galeria', categoria: 'Conteúdo', descricao: 'Fotos do produto, serviço ou evento promovido' },
      { nome: 'Seções personalizadas', categoria: 'Conteúdo', descricao: 'Blocos modulares desenhados para a oferta' },
    ],
    profissional: [
      { nome: 'Captação de leads', categoria: 'Clientes', descricao: 'Formulários de captura com alta taxa de conversão' },
      { nome: 'Formulário avançado', categoria: 'Atendimento / Agendamento', descricao: 'Campos com validação e triagem rápida' },
      { nome: 'FAQ', categoria: 'Conteúdo', descricao: 'Acordeão de perguntas frequentes interativo' },
      { nome: 'Depoimentos', categoria: 'Conteúdo', descricao: 'Provas sociais com prints, vídeos ou fotos' },
      { nome: 'Analytics', categoria: 'Métricas / Analytics', descricao: 'Configuração de Google Analytics e metas de conversão', isComplex: true },
      { nome: 'SEO avançado', categoria: 'SEO', descricao: 'Otimização de meta-tags e velocidade de carregamento' },
      { nome: 'Integrações', categoria: 'Integrações', descricao: 'Envio dos leads para webhook, e-mail ou planilha', isComplex: true },
    ],
    premium: [
      { nome: 'Experiência interativa', categoria: 'Recursos avançados', descricao: 'Calculadoras, simuladores ou quizzes na página', isComplex: true },
      { nome: 'Personalização avançada', categoria: 'Recursos avançados', descricao: 'Adaptação dinâmica de títulos e ofertas', isComplex: true },
      { nome: 'Animações avançadas', categoria: 'Recursos avançados', descricao: 'Microinterações sofisticadas e efeitos visuais', isComplex: true },
      { nome: 'Integrações', categoria: 'Integrações', descricao: 'Conexão direta com CRM (HubSpot, RD Station, ActiveCampaign)', isComplex: true },
      { nome: 'Automação', categoria: 'Automação', descricao: 'Fluxo de automação imediato após o preenchimento', isComplex: true },
      { nome: 'Analytics avançado', categoria: 'Métricas / Analytics', descricao: 'Mapas de calor e acompanhamento de funil', isComplex: true },
      { nome: 'Testes/variações', categoria: 'Métricas / Analytics', descricao: 'Estrutura preparada para testes A/B de conversão', isComplex: true },
      { nome: 'Captação avançada de leads', categoria: 'Clientes', descricao: 'Enriquecimento de dados e pontuação de leads', isComplex: true },
    ],
  },

  // 13. OUTROS SEGMENTOS (Preservados integralmente)
  barbearia: {
    personalizado: [
      { nome: 'Agendamento de Horários', categoria: 'Atendimento / Agendamento', descricao: 'Formulário focado para marcação de corte ou barba' },
      { nome: 'Tabela de Serviços & Valores', categoria: 'Catálogo', descricao: 'Apresentação detalhada dos cortes, barbas e combos' },
      { nome: 'Perfil dos Barbeiros', categoria: 'Conteúdo', descricao: 'Apresentação dos profissionais da barbearia' },
      { nome: 'Galeria de Cortes', categoria: 'Conteúdo', descricao: 'Fotos de cortes degradê e barboterapia' },
      { nome: 'Depoimentos de Clientes', categoria: 'Conteúdo', descricao: 'Opiniões e recomendações de clientes atendidos' },
      { nome: 'Planos Mensais', categoria: 'Catálogo', descricao: 'Clube de assinatura para corte e barba recorrentes' },
    ],
    profissional: [
      { nome: 'Agendamento por Barbeiro', categoria: 'Atendimento / Agendamento', descricao: 'Agenda individualizada por profissional' },
      { nome: 'Lembretes via WhatsApp', categoria: 'Automação', descricao: 'Disparo de lembretes para evitar no-show', isComplex: true },
      { nome: 'Histórico de Cortes do Cliente', categoria: 'Clientes', descricao: 'Registro de preferências e estilo de corte', isComplex: true },
      { nome: 'Galeria de Cortes', categoria: 'Conteúdo', descricao: 'Fotos em alta resolução com filtro por estilo' },
      { nome: 'Programa de Fidelidade', categoria: 'Clientes', descricao: 'Pontos e benefícios para cortes frequentes' },
      { nome: 'Venda de Pomadas & Produtos', categoria: 'Catálogo', descricao: 'Vitrine de cosméticos masculinos para retirada' },
      { nome: 'Avaliações de Clientes', categoria: 'Clientes', descricao: 'Mural de depoimentos e notas dos clientes' },
    ],
    premium: [
      { nome: 'Fila de Espera ao Vivo', categoria: 'Tempo real', descricao: 'Visualização da fila de atendimento e tempo para corte', isComplex: true },
      { nome: 'Área do Cliente VIP', categoria: 'Área do Cliente', descricao: 'Portal com agendamentos, histórico e benefícios', isComplex: true },
      { nome: 'Painel da Equipe', categoria: 'Gestão', descricao: 'Gestão de horários, turnos e comissões dos barbeiros', isComplex: true },
      { nome: 'Disparo Automático de Lembretes', categoria: 'Automação', descricao: 'Automação completa via WhatsApp e SMS', isComplex: true },
      { nome: 'Integração com Google Agenda', categoria: 'Integrações', descricao: 'Sincronização bidirecional de horários', isComplex: true },
      { nome: 'Clube de Assinatura Recorrente', categoria: 'Integrações', descricao: 'Cobrança automática de mensalidade via cartão', isComplex: true },
      { nome: 'Painel Administrativo Completo', categoria: 'Gestão', descricao: 'Relatórios de faturamento e serviços mais procurados', isComplex: true },
      { nome: 'Experiência Autoral da Barbearia', categoria: 'Recursos avançados', descricao: 'Direção de arte e interações exclusivas', isComplex: true },
    ],
  },

  engenharia: {
    personalizado: [
      { nome: 'Portfólio de Obras', categoria: 'Catálogo', descricao: 'Apresentação de projetos executados e em andamento' },
      { nome: 'Solicitação de Orçamento Técnico', categoria: 'Atendimento / Agendamento', descricao: 'Formulário para levantamento de requisitos de obra' },
      { nome: 'Corpo Técnico & Responsáveis', categoria: 'Conteúdo', descricao: 'Engenheiros com registro no CREA e especialidades' },
      { nome: 'Serviços de Engenharia', categoria: 'Catálogo', descricao: 'Laudos, reformas, projetos estruturais e elétricos' },
      { nome: 'Galeria de Fotos em Alta', categoria: 'Conteúdo', descricao: 'Fotos de alta resolução com visualizador ampliado' },
      { nome: 'Certificações & Qualidade', categoria: 'Conteúdo', descricao: 'Normas técnicas e selos de conformidade' },
    ],
    profissional: [
      { nome: 'Portfólio com Filtro por Tipo de Obra', categoria: 'Catálogo', descricao: 'Filtros para obras residenciais, comerciais e industriais' },
      { nome: 'Solicitação Detalhada de Proposta', categoria: 'Atendimento / Agendamento', descricao: 'Triagem completa com upload de plantas' },
      { nome: 'Acompanhamento do Cliente', categoria: 'Área do Cliente', descricao: 'Acesso para cliente acompanhar etapas da obra', isComplex: true },
      { nome: 'Cases de Sucesso', categoria: 'Conteúdo', descricao: 'Estudos de caso com metragem, prazo e desafios superados' },
      { nome: 'Formulário de Laudos & Vistorias', categoria: 'Atendimento / Agendamento', descricao: 'Agendamento de perícias e visitas técnicas' },
      { nome: 'Blog Técnico & Notícias', categoria: 'Conteúdo', descricao: 'Artigos sobre construção civil e inovações' },
      { nome: 'Avaliações de Clientes Corporativos', categoria: 'Clientes', descricao: 'Depoimentos de empresas e construtoras' },
    ],
    premium: [
      { nome: 'Progresso da Obra ao Vivo', categoria: 'Tempo real', descricao: 'Transmissão periódica de fotos e percentual de avanço', isComplex: true },
      { nome: 'Portal Completo do Cliente', categoria: 'Área do Cliente', descricao: 'Acesso a cronogramas físico-financeiros e laudos', isComplex: true },
      { nome: 'Painel da Construtora', categoria: 'Gestão', descricao: 'Controle de múltiplas obras e fornecedores', isComplex: true },
      { nome: 'Acompanhamento de Diário de Obra', categoria: 'Gestão', descricao: 'Registro digital diário de ocorrências da construção', isComplex: true },
      { nome: 'Notificações Automáticas de Etapas', categoria: 'Automação', descricao: 'Avisos aos clientes a cada marco de obra concluído', isComplex: true },
      { nome: 'Integração com ERP de Construção', categoria: 'Integrações', descricao: 'Conexão com Sienge, Mega ou planilhas de obra', isComplex: true },
      { nome: 'Analytics de Obras & Propostas', categoria: 'Métricas / Analytics', descricao: 'Dashboard com métricas de propostas e fechamentos', isComplex: true },
      { nome: 'Maquete 3D & Tour Virtual', categoria: 'Recursos avançados', descricao: 'Visualização interativa 3D de projetos', isComplex: true },
    ],
  },

  criador: {
    personalizado: [
      { nome: 'Mídia Kit & Estatísticas', categoria: 'Conteúdo', descricao: 'Métricas de audiência, alcance e demografia' },
      { nome: 'Contato para Parcerias', categoria: 'Atendimento / Agendamento', descricao: 'Formulário focado para marcas e agências' },
      { nome: 'Vitrine de Conteúdos & Vídeos', categoria: 'Conteúdo', descricao: 'Links e embeds dos melhores vídeos e podcasts' },
      { nome: 'Links Oficiais & Cupons', categoria: 'Catálogo', descricao: 'Central de links com descontos para seguidores' },
      { nome: 'Biografia & Carreira', categoria: 'Conteúdo', descricao: 'História do criador e principais marcos da trajetória' },
      { nome: 'Depoimentos de Marcas Parceiras', categoria: 'Conteúdo', descricao: 'Cases de publis bem-sucedidas' },
    ],
    profissional: [
      { nome: 'Mídia Kit Interativo', categoria: 'Conteúdo', descricao: 'Dashboard dinâmico com números das redes sociais' },
      { nome: 'Formulário de Briefing para Marcas', categoria: 'Atendimento / Agendamento', descricao: 'Triagem de formato de ação e orçamento da marca' },
      { nome: 'Captura de E-mails / Newsletter', categoria: 'Clientes', descricao: 'Inscrição para conteúdos e avisos exclusivos' },
      { nome: 'Vitrine de Infoprodutos & Mentorias', categoria: 'Catálogo', descricao: 'Páginas de vendas de cursos ou consultorias' },
      { nome: 'Blog & Artigos Autorais', categoria: 'Conteúdo', descricao: 'Publicações textuais para fortalecer autoridade' },
      { nome: 'SEO para Nome do Criador', categoria: 'SEO', descricao: 'Otimização para busca do nome no topo do Google' },
      { nome: 'Integração com Redes Sociais', categoria: 'Integrações', descricao: 'Feeds dinâmicos do Instagram ou YouTube', isComplex: true },
    ],
    premium: [
      { nome: 'Área Exclusiva para Membros', categoria: 'Área do Cliente', descricao: 'Ambiente com login e materiais exclusivos VIP', isComplex: true },
      { nome: 'Automação de Contratos de Parceria', categoria: 'Automação', descricao: 'Envio automático de propostas e contratos', isComplex: true },
      { nome: 'Painel Comercial do Criador', categoria: 'Gestão', descricao: 'Controle de campanhas ativas e faturamento', isComplex: true },
      { nome: 'Integração com Plataforma de Cursos', categoria: 'Integrações', descricao: 'Conexão com Hotmart, Kiwify ou Eduzz', isComplex: true },
      { nome: 'Disparo Automático de Comunicados', categoria: 'Automação', descricao: 'Alertas no Telegram ou WhatsApp para a comunidade', isComplex: true },
      { nome: 'Analytics Avançado de Conversão', categoria: 'Métricas / Analytics', descricao: 'Rastreamento de cliques e conversões de publis', isComplex: true },
      { nome: 'Experiência Interativa para Fãs', categoria: 'Recursos avançados', descricao: 'Gamificação ou quizzes exclusivos para a audiência', isComplex: true },
      { nome: 'Direção de Arte Totalmente Exclusiva', categoria: 'Recursos avançados', descricao: 'Visual premium de altíssimo impacto estético', isComplex: true },
    ],
  },

  sob_medida: {
    personalizado: [
      { nome: 'Apresentação Institucional da Empresa', categoria: 'Conteúdo', descricao: 'Página estruturada com valores, diferenciais e missão' },
      { nome: 'Formulário Personalizado de Contato', categoria: 'Atendimento / Agendamento', descricao: 'Campos sob medida para triagem de interessados' },
      { nome: 'Catálogo de Serviços ou Produtos', categoria: 'Catálogo', descricao: 'Vitrine organizada com descrições e imagens' },
      { nome: 'Galeria de Trabalhos Realizados', categoria: 'Conteúdo', descricao: 'Fotos e demonstrações de projetos entregues' },
      { nome: 'Seção de Depoimentos & Avaliações', categoria: 'Conteúdo', descricao: 'Opiniões e recomendações de clientes atendidos' },
      { nome: 'FAQ com Dúvidas Frequentes', categoria: 'Conteúdo', descricao: 'Acordeão interativo respondendo às principais perguntas' },
    ],
    profissional: [
      { nome: 'Formulário Avançado com Triagem', categoria: 'Atendimento / Agendamento', descricao: 'Campos condicionais para qualificação comercial' },
      { nome: 'Solicitação de Orçamento Estruturado', categoria: 'Atendimento / Agendamento', descricao: 'Coleta de requisitos técnicos e dados de projeto' },
      { nome: 'Área do Cliente / Portal de Acesso', categoria: 'Área do Cliente', descricao: 'Ambiente com login para consulta de status', isComplex: true },
      { nome: 'Histórico & Acompanhamento de Pedidos', categoria: 'Clientes', descricao: 'Registro de interações e solicitações do cliente', isComplex: true },
      { nome: 'SEO Estruturado para o Google', categoria: 'SEO', descricao: 'Marcação de dados estruturados e meta-tags' },
      { nome: 'Configuração de Tags & Pixels', categoria: 'Métricas / Analytics', descricao: 'Instalação de Google Analytics e Meta Pixel' },
      { nome: 'Integração de Envio para Planilhas / CRM', categoria: 'Integrações', descricao: 'Envio automático dos contatos para o Google Sheets', isComplex: true },
    ],
    premium: [
      { nome: 'Área Completa do Cliente com Login', categoria: 'Área do Cliente', descricao: 'Ambiente seguro para arquivos, faturas e propostas', isComplex: true },
      { nome: 'Painel Administrativo para a Empresa', categoria: 'Gestão', descricao: 'Gerenciamento de pedidos, contatos e conteúdos', isComplex: true },
      { nome: 'Status & Atualizações em Tempo Real', categoria: 'Tempo real', descricao: 'Sinalização ao vivo de processos ou serviços', isComplex: true },
      { nome: 'Automação de E-mails & WhatsApp', categoria: 'Automação', descricao: 'Disparo imediato de confirmação e boas-vindas', isComplex: true },
      { nome: 'Integração com Gateway de Pagamento', categoria: 'Integrações', descricao: 'Recebimento online de pagamentos via Pix ou Cartão', isComplex: true },
      { nome: 'Integração com Sistemas Externos / API', categoria: 'Integrações', descricao: 'Conexão com ERPs, CRMs ou ferramentas proprietárias', isComplex: true },
      { nome: 'Analytics Avançado & Funil de Conversão', categoria: 'Métricas / Analytics', descricao: 'Monitoramento completo da jornada do visitante', isComplex: true },
      { nome: 'Experiência & Layout Totalmente Autorais', categoria: 'Recursos avançados', descricao: 'Design exclusivo sob medida com interações ricas', isComplex: true },
    ],
  },
};

/**
 * Retorna uma chave canônica de segmento compatível com a matriz
 */
export function normalizeMatrixSegmentKey(segmentKey: string): string {
  const s = (segmentKey || '').toLowerCase().trim();

  if (s.includes('academi') || s.includes('fitness') || s.includes('treino') || s.includes('crossfit')) {
    return 'academia';
  }
  if (s.includes('restaurante') || s.includes('gastronom') || s.includes('pizza') || s.includes('burger') || s.includes('food') || s.includes('bistr')) {
    return 'restaurante';
  }
  if (s.includes('salao') || s.includes('salão') || s.includes('beleza') || s.includes('estetica') || s.includes('estética') || s.includes('beauty')) {
    return 'salao';
  }
  if (s.includes('pet') || s.includes('vet')) {
    return 'petshop';
  }
  if (s.includes('clinic') || s.includes('clínic') || s.includes('saude') || s.includes('saúde') || s.includes('medic') || s.includes('médic') || s.includes('odonto')) {
    return 'clinica';
  }
  if (s.includes('loja') || s.includes('comercio') || s.includes('comércio') || s.includes('varejo') || s.includes('ecommerce') || s.includes('e-commerce') || s.includes('retail')) {
    return 'loja';
  }
  if (s.includes('imobil') || s.includes('imóve') || s.includes('imove') || s.includes('corretor') || s.includes('realestate')) {
    return 'imobiliaria';
  }
  if (s.includes('prestad') || s.includes('servico') || s.includes('serviço') || s.includes('oficina') || s.includes('assistenc')) {
    return 'prestador';
  }
  if (s.includes('portfolio') || s.includes('portfólio') || s.includes('curriculo') || s.includes('case')) {
    return 'portfolio';
  }
  if (s.includes('landing') || s.includes('conversao') || s.includes('conversão')) {
    return 'landing_page';
  }
  if (s.includes('barbearia') || s.includes('barber') || s.includes('barba')) {
    return 'barbearia';
  }
  if (s.includes('engenhar') || s.includes('arquit') || s.includes('obra') || s.includes('constru')) {
    return 'engenharia';
  }
  if (s.includes('criador') || s.includes('influenc') || s.includes('creator') || s.includes('midia') || s.includes('mídia')) {
    return 'criador';
  }

  return 'sob_medida';
}

/**
 * Cria um ID determinístico e estável para cada funcionalidade da matriz
 */
function generateFeatureId(segmentKey: string, planLevel: string, featureName: string): string {
  const normName = featureName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `${segmentKey}_${planLevel}_${normName}`;
}

// Catálogo indexado para busca rápida por ID
const ALL_FEATURES_BY_ID = new Map<string, AdvancedFeatureItem>();

// Popula o catálogo indexado
Object.entries(SEGMENT_FEATURES_MATRIX).forEach(([segKey, plans]) => {
  (['personalizado', 'profissional', 'premium'] as const).forEach((planLvl) => {
    const list = plans[planLvl] || [];
    list.forEach((item) => {
      const id = generateFeatureId(segKey, planLvl, item.nome);
      const featureObj: AdvancedFeatureItem = {
        id,
        nome: item.nome,
        descricao: item.descricao,
        categoria: item.categoria,
        isComplex: Boolean(item.isComplex),
        planLevel: planLvl,
        segmentKey: segKey,
      };
      ALL_FEATURES_BY_ID.set(id, featureObj);

      // Índices alternativos para retrocompatibilidade
      ALL_FEATURES_BY_ID.set(`${segKey}_${item.nome}`, featureObj);
      ALL_FEATURES_BY_ID.set(item.nome.toLowerCase(), featureObj);
    });
  });
});

/**
 * Retorna as funcionalidades agrupadas por categoria para o segmento e plano informados.
 * - Respeita as 13 categorias oficiais
 * - Não mostra categorias vazias
 * - Para o plano 'essencial', exibe as funcionalidades do escopo base do segmento com limite 0
 */
export function getAdvancedFeaturesGroupedBySegment(
  segmentKey: string,
  planId: string = 'profissional'
): Array<{ category: AdvancedFeatureCategory; items: AdvancedFeatureItem[] }> {
  const normSeg = normalizeMatrixSegmentKey(segmentKey);
  const normPlan = planId ? planId.toLowerCase() : 'profissional';

  const segmentMatrix = SEGMENT_FEATURES_MATRIX[normSeg] || SEGMENT_FEATURES_MATRIX.sob_medida;

  let rawList: SegmentPlanFeatureRaw[] = [];
  let planLevel: 'personalizado' | 'profissional' | 'premium' = 'profissional';

  if (normPlan === 'personalizado') {
    rawList = segmentMatrix.personalizado;
    planLevel = 'personalizado';
  } else if (normPlan === 'premium') {
    rawList = segmentMatrix.premium;
    planLevel = 'premium';
  } else {
    // 'profissional' ou 'essencial' (o Essencial mostra a base profissional informativa, com limite 0)
    rawList = segmentMatrix.profissional;
    planLevel = 'profissional';
  }

  // Agrupa os itens pelas categorias oficiais
  const grouped: Partial<Record<AdvancedFeatureCategory, AdvancedFeatureItem[]>> = {};

  rawList.forEach((raw) => {
    const id = generateFeatureId(normSeg, planLevel, raw.nome);
    const item: AdvancedFeatureItem = {
      id,
      nome: raw.nome,
      descricao: raw.descricao,
      categoria: raw.categoria,
      isComplex: Boolean(raw.isComplex),
      planLevel,
      segmentKey: normSeg,
    };

    if (!grouped[raw.categoria]) {
      grouped[raw.categoria] = [];
    }
    grouped[raw.categoria]!.push(item);
  });

  const result: Array<{ category: AdvancedFeatureCategory; items: AdvancedFeatureItem[] }> = [];

  // Mantém a ordem canônica das 13 categorias e exclui categorias vazias
  ADVANCED_FEATURE_CATEGORIES.forEach((cat) => {
    const items = grouped[cat];
    if (items && items.length > 0) {
      result.push({
        category: cat,
        items,
      });
    }
  });

  return result;
}

/**
 * Busca uma funcionalidade por qualquer ID ou nome registrado
 */
export function findAdvancedFeatureById(id: string): AdvancedFeatureItem | undefined {
  if (!id) return undefined;
  if (ALL_FEATURES_BY_ID.has(id)) {
    return ALL_FEATURES_BY_ID.get(id);
  }

  // Busca de fallback por nome ou substring
  const search = id.toLowerCase();
  for (const [key, item] of ALL_FEATURES_BY_ID.entries()) {
    if (key.includes(search) || item.nome.toLowerCase() === search) {
      return item;
    }
  }

  return undefined;
}
