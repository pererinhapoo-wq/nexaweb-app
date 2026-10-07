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

export interface AdvancedFeatureGroup {
  category: AdvancedFeatureCategory;
  items: AdvancedFeatureItem[];
}

// Limites canônicos oficiais de funcionalidades avançadas selecionáveis no Briefing (Regra 14)
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
// MATRIZ ESPECÍFICA OFICIAL DOS 14 SEGMENTOS DO APP (ETAPA 7)
// =========================================================================
export const SEGMENT_FEATURES_MATRIX: Record<
  string,
  {
    personalizado: SegmentPlanFeatureRaw[];
    profissional: SegmentPlanFeatureRaw[];
    premium: SegmentPlanFeatureRaw[];
  }
> = {
  // 1. ACADEMIA & FITNESS
  academia: {
    personalizado: [
      { nome: 'Agendamento de aula experimental', categoria: 'Atendimento / Agendamento', descricao: 'Formulário direto para agendar primeira aula gratuita' },
      { nome: 'Horários de funcionamento', categoria: 'Atendimento / Agendamento', descricao: 'Grade informativa de horários de abertura e turnos' },
      { nome: 'Catálogo de modalidades', categoria: 'Catálogo', descricao: 'Apresentação das modalidades oferecidas (musculação, cross, lutas)' },
      { nome: 'Planos e mensalidades', categoria: 'Catálogo', descricao: 'Tabela de preços, planos semestrais e anuais com descontos' },
      { nome: 'Equipe e professores', categoria: 'Conteúdo', descricao: 'Apresentação dos instrutores, qualificações e registros CREF' },
      { nome: 'Área do aluno', categoria: 'Área do Cliente', descricao: 'Ambiente com login para avisos e consulta básica', isComplex: true },
      { nome: 'Acompanhamento de progresso', categoria: 'Área do Cliente', descricao: 'Registro de metas e medidas do aluno', isComplex: true },
      { nome: 'Fichas de treinos', categoria: 'Área do Cliente', descricao: 'Ficha digital para consulta dos exercícios', isComplex: true },
    ],
    profissional: [
      { nome: 'Agendamento de aulas', categoria: 'Atendimento / Agendamento', descricao: 'Reserva prévia de vagas para aulas concorridas' },
      { nome: 'Grade de horários dinâmica', categoria: 'Atendimento / Agendamento', descricao: 'Horários interativos organizados por modalidade e sala' },
      { nome: 'Catálogo completo de modalidades', categoria: 'Catálogo', descricao: 'Detalhamento com fotos, duração e intensidade' },
      { nome: 'Planos e benefícios', categoria: 'Catálogo', descricao: 'Tabela interativa com comparação de planos e serviços inclusos' },
      { nome: 'Equipe de professores', categoria: 'Conteúdo', descricao: 'Bios dos profissionais com especialidades e fotos' },
      { nome: 'Área do aluno', categoria: 'Área do Cliente', descricao: 'Portal com login para acompanhamento de treinos e avisos', isComplex: true },
      { nome: 'Acompanhamento de treinos', categoria: 'Área do Cliente', descricao: 'Consulta de rotinas, séries e repetições', isComplex: true },
      { nome: 'Metas e progresso', categoria: 'Área do Cliente', descricao: 'Painel visual de evolução física e frequência', isComplex: true },
      { nome: 'Métricas de frequência', categoria: 'Métricas / Analytics', descricao: 'Controle de assiduidade e objetivos atingidos', isComplex: true },
      { nome: 'SEO para academia', categoria: 'SEO', descricao: 'Otimização para buscas locais de treino e musculação' },
      { nome: 'Automação de lembretes', categoria: 'Automação', descricao: 'Disparo de avisos de aulas via WhatsApp', isComplex: true },
    ],
    premium: [
      { nome: 'Área avançada do aluno', categoria: 'Área do Cliente', descricao: 'Ambiente interativo completo com treinos e avaliações', isComplex: true },
      { nome: 'Status e equipamentos', categoria: 'Gestão', descricao: 'Informações de manutenção e disponibilidade de aparelhos', isComplex: true },
      { nome: 'Lotação em tempo real', categoria: 'Tempo real', descricao: 'Indicador ao vivo da ocupação e fluxo na academia', isComplex: true },
      { nome: 'Métricas avançadas e relatórios', categoria: 'Métricas / Analytics', descricao: 'Gráficos de evolução física e engajamento', isComplex: true },
      { nome: 'Integrações externas', categoria: 'Integrações', descricao: 'Conexão com catracas, ERPs ou sistemas de academia', isComplex: true },
      { nome: 'Automações para alunos', categoria: 'Automação', descricao: 'Notificações de renovação e motivação no WhatsApp', isComplex: true },
      { nome: 'Experiência web app do aluno', categoria: 'Recursos avançados', descricao: 'Aplicativo web instalável no celular do aluno', isComplex: true },
      { nome: 'Painel administrativo da academia', categoria: 'Gestão', descricao: 'Controle de modalidades, turmas e avisos gerais', isComplex: true },
    ],
  },

  // 2. RESTAURANTE & GASTRONOMIA
  restaurante: {
    personalizado: [
      { nome: 'Cardápio digital', categoria: 'Catálogo', descricao: 'Visualização de pratos, bebidas e preços no site' },
      { nome: 'Categorias do cardápio', categoria: 'Catálogo', descricao: 'Separação por entradas, pratos principais, sobremesas e drinks' },
      { nome: 'Reserva de mesas', categoria: 'Atendimento / Agendamento', descricao: 'Formulário rápido para solicitação de reserva' },
      { nome: 'Horários de atendimento', categoria: 'Atendimento / Agendamento', descricao: 'Informativo dos turnos de almoço e jantar' },
      { nome: 'Localização e mapa', categoria: 'Conteúdo', descricao: 'Endereço detalhado com link para GPS e rotas' },
      { nome: 'Pedidos via WhatsApp', categoria: 'Pedidos', descricao: 'Seleção de pratos com envio formatado para o WhatsApp' },
      { nome: 'Avaliações de clientes', categoria: 'Clientes', descricao: 'Depoimentos de clientes e notas de experiência' },
      { nome: 'Promoções e novidades', categoria: 'Conteúdo', descricao: 'Destaques sazonais e pratos especiais da semana' },
    ],
    profissional: [
      { nome: 'Cardápio digital interativo', categoria: 'Catálogo', descricao: 'Menu com fotos apetitosas em alta resolução e filtros' },
      { nome: 'Categorias e destaques do chef', categoria: 'Catálogo', descricao: 'Seções temáticas com ingredientes e avisos para alérgicos' },
      { nome: 'Montagem de pedidos online', categoria: 'Pedidos', descricao: 'Carrinho de pedidos integrado para envio sem erros' },
      { nome: 'Reserva de mesas online', categoria: 'Atendimento / Agendamento', descricao: 'Agendamento com escolha de data, horário e número de pessoas' },
      { nome: 'Delivery com cálculo de taxa', categoria: 'Pedidos', descricao: 'Roteamento com estimativa de entrega por bairro', isComplex: true },
      { nome: 'Avaliações e depoimentos', categoria: 'Clientes', descricao: 'Mural de notas e fotos de pratos compartilhadas por clientes' },
      { nome: 'Promoções e eventos', categoria: 'Conteúdo', descricao: 'Página especial para reservas de aniversários e confraternizações' },
      { nome: 'Métricas de pedidos e visitas', categoria: 'Métricas / Analytics', descricao: 'Relatório de pratos mais acessados e pedidos', isComplex: true },
      { nome: 'SEO gastronômico local', categoria: 'SEO', descricao: 'Otimização para aparecer nas buscas de restaurantes da cidade' },
    ],
    premium: [
      { nome: 'Gestão avançada de pedidos', categoria: 'Pedidos', descricao: 'Fluxo de recepção e despacho de pedidos da cozinha', isComplex: true },
      { nome: 'Status do pedido em tempo real', categoria: 'Tempo real', descricao: 'Acompanhamento ao vivo do preparo e entrega pelo cliente', isComplex: true },
      { nome: 'Integração de delivery', categoria: 'Integrações', descricao: 'Conexão com iFood, WhatsApp Business ou motoboys', isComplex: true },
      { nome: 'Integração com sistemas externos', categoria: 'Integrações', descricao: 'Conexão avaliada com PDV ou impressora de comandas', isComplex: true },
      { nome: 'Área do cliente frequente', categoria: 'Área do Cliente', descricao: 'Login para histórico de pedidos e pratos favoritos', isComplex: true },
      { nome: 'Automação de alertas de status', categoria: 'Automação', descricao: 'Mensagens automáticas no WhatsApp quando o pedido sair', isComplex: true },
      { nome: 'Painel administrativo do restaurante', categoria: 'Gestão', descricao: 'Gestão de cardápio, preços, horários e fila de mesas', isComplex: true },
      { nome: 'Experiência visual gastronômica', categoria: 'Recursos avançados', descricao: 'Direção de arte nobre com animações sutis de pratos', isComplex: true },
    ],
  },

  // 3. SALÃO DE BELEZA & ESTÉTICA
  salao: {
    personalizado: [
      { nome: 'Catálogo de serviços e valores', categoria: 'Catálogo', descricao: 'Lista com procedimentos, durações e valores médios' },
      { nome: 'Profissionais e equipe', categoria: 'Conteúdo', descricao: 'Apresentação das cabeleireiras, manicures e esteticistas' },
      { nome: 'Horários de funcionamento', categoria: 'Atendimento / Agendamento', descricao: 'Dias de atendimento e turnos disponíveis' },
      { nome: 'Agendamento de horários', categoria: 'Atendimento / Agendamento', descricao: 'Formulário com escolha de procedimento e turno' },
      { nome: 'Escolha de profissional', categoria: 'Atendimento / Agendamento', descricao: 'Opção de direcionar o atendimento para especialista favorita' },
      { nome: 'Localização e WhatsApp', categoria: 'Atendimento / Agendamento', descricao: 'Botão de contato direto e mapa de fácil acesso' },
      { nome: 'Galeria de procedimentos', categoria: 'Conteúdo', descricao: 'Fotos de mechas, cortes e procedimentos estéticos' },
      { nome: 'Depoimentos de clientes', categoria: 'Clientes', descricao: 'Opiniões e recomendações de clientes atendidas' },
    ],
    profissional: [
      { nome: 'Agendamento online por profissional', categoria: 'Atendimento / Agendamento', descricao: 'Marcação com visualização de horários por especialista' },
      { nome: 'Disponibilidade de agenda', categoria: 'Atendimento / Agendamento', descricao: 'Sinalização clara de turnos vagos para atendimento' },
      { nome: 'Catálogo de procedimentos detalhado', categoria: 'Catálogo', descricao: 'Descritivo completo com produtos e cuidados pós-tratamento' },
      { nome: 'Galeria visual com filtros', categoria: 'Conteúdo', descricao: 'Filtros por loiros, morenas, unhas, maquiagem e noivas' },
      { nome: 'Avaliações de clientes', categoria: 'Clientes', descricao: 'Mural de depoimentos e notas dos procedimentos' },
      { nome: 'Lembretes automáticos via WhatsApp', categoria: 'Automação', descricao: 'Avisos antes do horário para evitar faltas', isComplex: true },
      { nome: 'Área do cliente', categoria: 'Área do Cliente', descricao: 'Acesso para conferir agendamentos futuros', isComplex: true },
      { nome: 'Métricas de agendamento', categoria: 'Métricas / Analytics', descricao: 'Relatórios de serviços e profissionais mais demandados', isComplex: true },
      { nome: 'SEO para salão de beleza', categoria: 'SEO', descricao: 'Otimização nas buscas locais do Google' },
    ],
    premium: [
      { nome: 'Disponibilidade em tempo real', categoria: 'Tempo real', descricao: 'Bloqueio e liberação de horários ao vivo', isComplex: true },
      { nome: 'Gestão de agenda por profissional', categoria: 'Gestão', descricao: 'Controle de turnos, folgas e comissões da equipe', isComplex: true },
      { nome: 'Área completa da cliente', categoria: 'Área do Cliente', descricao: 'Histórico de químicas e procedimentos anteriores', isComplex: true },
      { nome: 'Automações de retorno e cuidados', categoria: 'Automação', descricao: 'Lembretes de retoque de raiz ou manutenção de unhas', isComplex: true },
      { nome: 'Integração com calendários externos', categoria: 'Integrações', descricao: 'Sincronização com Google Agenda ou softwares de salão', isComplex: true },
      { nome: 'Programa de fidelidade', categoria: 'Clientes', descricao: 'Acúmulo de benefícios e descontos para clientes assíduas', isComplex: true },
      { nome: 'Painel administrativo do salão', categoria: 'Gestão', descricao: 'Painel central de gestão de atendimentos e profissionais', isComplex: true },
      { nome: 'Experiência exclusiva de agendamento', categoria: 'Recursos avançados', descricao: 'Fluxo visual ultra-fluido e personalizado para mobile', isComplex: true },
    ],
  },

  // 4. BARBEARIA & MASCULINO
  barbearia: {
    personalizado: [
      { nome: 'Tabela de serviços e valores', categoria: 'Catálogo', descricao: 'Valores e tempos de cortes, barba na toalha e combos' },
      { nome: 'Profissionais e barbeiros', categoria: 'Conteúdo', descricao: 'Fotos e estilos dos barbeiros da equipe' },
      { nome: 'Horários de atendimento', categoria: 'Atendimento / Agendamento', descricao: 'Informativo de dias e horários da barbearia' },
      { nome: 'Agendamento de horários', categoria: 'Atendimento / Agendamento', descricao: 'Escolha de data, barbeiro e serviço' },
      { nome: 'Localização e WhatsApp', categoria: 'Atendimento / Agendamento', descricao: 'Canal rápido de contato e localização no mapa' },
      { nome: 'Galeria de cortes', categoria: 'Conteúdo', descricao: 'Fotos de degradê, barboterapia e alinhamento' },
      { nome: 'Depoimentos de clientes', categoria: 'Clientes', descricao: 'Recomendações de clientes frequentes' },
    ],
    profissional: [
      { nome: 'Agendamento online por barbeiro', categoria: 'Atendimento / Agendamento', descricao: 'Seleção direta da cadeira e horário do barbeiro' },
      { nome: 'Disponibilidade de horários', categoria: 'Atendimento / Agendamento', descricao: 'Grade visual de horários vagos no dia' },
      { nome: 'Catálogo de serviços e produtos', categoria: 'Catálogo', descricao: 'Serviços e vitrine de pomadas, óleos e balms' },
      { nome: 'Galeria com filtro de cortes', categoria: 'Conteúdo', descricao: 'Filtro por social, fade, militar e barba clássica' },
      { nome: 'Avaliações de clientes', categoria: 'Clientes', descricao: 'Mural de notas e avaliações dos clientes' },
      { nome: 'Lembretes via WhatsApp', categoria: 'Automação', descricao: 'Avisos automáticos de horário para reduzir no-show', isComplex: true },
      { nome: 'Área do cliente', categoria: 'Área do Cliente', descricao: 'Acesso rápido para reagendar e ver histórico', isComplex: true },
      { nome: 'SEO para barbearia local', categoria: 'SEO', descricao: 'Otimização para aparecer nas buscas próximas' },
      { nome: 'Métricas de agendamento', categoria: 'Métricas / Analytics', descricao: 'Serviços mais solicitados e taxa de retorno', isComplex: true },
    ],
    premium: [
      { nome: 'Fila e horários em tempo real', categoria: 'Tempo real', descricao: 'Status da fila e tempo estimado para atendimento', isComplex: true },
      { nome: 'Gestão de agenda da barbearia', categoria: 'Gestão', descricao: 'Controle de cadeiras, horários e comissões da equipe', isComplex: true },
      { nome: 'Área VIP do cliente', categoria: 'Área do Cliente', descricao: 'Portal com assinatura recorrente e histórico', isComplex: true },
      { nome: 'Automações de lembretes e pós-corte', categoria: 'Automação', descricao: 'Disparos no WhatsApp lembrando de cortar o cabelo', isComplex: true },
      { nome: 'Integração com Google Agenda', categoria: 'Integrações', descricao: 'Sincronização de horários com calendário do barbeiro', isComplex: true },
      { nome: 'Clube de assinatura recorrente', categoria: 'Integrações', descricao: 'Planos mensais com cobrança automática', isComplex: true },
      { nome: 'Painel administrativo completo', categoria: 'Gestão', descricao: 'Relatórios de faturamento e fluxo de atendimentos', isComplex: true },
      { nome: 'Experiência autoral da barbearia', categoria: 'Recursos avançados', descricao: 'Design exclusivo com estética moderna e marcante', isComplex: true },
    ],
  },

  // 5. CLÍNICA MÉDICA & SAÚDE (Sem prontuário, sem diagnóstico, sem prescrição)
  clinica: {
    personalizado: [
      { nome: 'Especialidades atendidas', categoria: 'Catálogo', descricao: 'Apresentação das áreas médicas e de saúde disponíveis' },
      { nome: 'Corpo clínico e profissionais', categoria: 'Conteúdo', descricao: 'Apresentação dos médicos, especialidades e registros (CRM/CRO)' },
      { nome: 'Horários de atendimento', categoria: 'Atendimento / Agendamento', descricao: 'Informação dos turnos de consulta e exames' },
      { nome: 'Localização e rotas de acesso', categoria: 'Conteúdo', descricao: 'Endereço da clínica com mapa, estacionamento e acessibilidade' },
      { nome: 'Contato e triagem da recepção', categoria: 'Atendimento / Agendamento', descricao: 'Formulário limpo para dúvidas e encaminhamentos' },
      { nome: 'Solicitação de agendamento', categoria: 'Atendimento / Agendamento', descricao: 'Canal de pré-agendamento de consultas via formulário e WhatsApp' },
      { nome: 'Lista de convênios aceitos', categoria: 'Catálogo', descricao: 'Relação dos planos de saúde e modalidades particulares' },
    ],
    profissional: [
      { nome: 'Agendamento online de consultas', categoria: 'Atendimento / Agendamento', descricao: 'Marcação com seleção de especialidade e profissional' },
      { nome: 'Perfis e titulações médicas', categoria: 'Conteúdo', descricao: 'Currículo, formação, titulações e foto dos profissionais' },
      { nome: 'Detalhamento de especialidades e exames', categoria: 'Catálogo', descricao: 'Descrição dos procedimentos e indicações' },
      { nome: 'Orientações e preparo de exames', categoria: 'Conteúdo', descricao: 'Guias e instruções pré-consulta e preparo para exames' },
      { nome: 'Convênios e planos de saúde', categoria: 'Catálogo', descricao: 'Tabela interativa de operadoras credenciadas' },
      { nome: 'Lembretes de consulta via WhatsApp', categoria: 'Automação', descricao: 'Mensagens automáticas para confirmação de comparecimento', isComplex: true },
      { nome: 'Área do paciente (consultas)', categoria: 'Área do Cliente', descricao: 'Portal para consultar horários agendados e orientações', isComplex: true },
      { nome: 'SEO para clínica e especialidades', categoria: 'SEO', descricao: 'Otimização nas buscas do Google para médicos e clínicas locais' },
      { nome: 'Métricas de solicitações de consulta', categoria: 'Métricas / Analytics', descricao: 'Estatísticas de procura por especialidade', isComplex: true },
    ],
    premium: [
      { nome: 'Área do paciente com orientações', categoria: 'Área do Cliente', descricao: 'Acesso com senha para guias, retornos e preparos', isComplex: true },
      { nome: 'Gestão de horários por especialista', categoria: 'Gestão', descricao: 'Configuração de agendas por médico e sala de atendimento', isComplex: true },
      { nome: 'Notificações de confirmação de consulta', categoria: 'Automação', descricao: 'Automação inteligente de confirmação e reagendamento', isComplex: true },
      { nome: 'Infraestrutura para teleatendimento', categoria: 'Recursos avançados', descricao: 'Link seguro de videochamada para orientação online', isComplex: true },
      { nome: 'Integração com sistemas da clínica', categoria: 'Integrações', descricao: 'Conexão avaliada com sistema de agendamento existente', isComplex: true },
      { nome: 'Painel administrativo da recepção', categoria: 'Gestão', descricao: 'Organização de filas de confirmação e solicitações', isComplex: true },
      { nome: 'Triagem inteligente de especialidade', categoria: 'Automação', descricao: 'Questionário simples para guiar o paciente ao médico certo', isComplex: true },
      { nome: 'Portal de artigos e saúde preventiva', categoria: 'Conteúdo', descricao: 'Seção de conteúdos informativos com revisão do corpo clínico' },
    ],
  },

  // 6. LOJA CONCEITO & E-COMMERCE
  loja: {
    personalizado: [
      { nome: 'Catálogo de produtos', categoria: 'Catálogo', descricao: 'Vitrine dos produtos com fotos e descrições claras' },
      { nome: 'Categorias de produtos', categoria: 'Catálogo', descricao: 'Separação organizada por tipos de itens' },
      { nome: 'Busca de produtos', categoria: 'Catálogo', descricao: 'Campo de pesquisa para encontrar itens por nome' },
      { nome: 'Filtros básicos', categoria: 'Catálogo', descricao: 'Filtros por categoria e novidades' },
      { nome: 'Carrinho de compras', categoria: 'Pedidos', descricao: 'Seleção de itens para compra antes do fechamento' },
      { nome: 'Envio de pedidos para o WhatsApp', categoria: 'Pedidos', descricao: 'Formulário que gera o resumo do pedido no WhatsApp da loja' },
      { nome: 'Avaliações de clientes', categoria: 'Clientes', descricao: 'Depoimentos de compradores satisfeitos' },
    ],
    profissional: [
      { nome: 'Catálogo com variações', categoria: 'Catálogo', descricao: 'Múltiplas fotos por produto, cores e tamanhos' },
      { nome: 'Busca e filtros combinados', categoria: 'Catálogo', descricao: 'Filtros por preço, tamanho, disponibilidade e categoria' },
      { nome: 'Carrinho com cálculo de frete', categoria: 'Pedidos', descricao: 'Cálculo de CEP e envio antes do fechamento' },
      { nome: 'Checkout no site', categoria: 'Pedidos', descricao: 'Finalização de compra diretamente na plataforma', isComplex: true },
      { nome: 'Integração de pagamento avaliada', categoria: 'Integrações', descricao: 'Recebimento online seguro via Pix e cartão', isComplex: true },
      { nome: 'Cupons de desconto', categoria: 'Clientes', descricao: 'Códigos promocionais e campanhas de desconto' },
      { nome: 'Gestão de pedidos', categoria: 'Pedidos', descricao: 'Acompanhamento do status dos pedidos recebidos' },
      { nome: 'Avaliações com fotos de clientes', categoria: 'Clientes', descricao: 'Feedback visual de compradores com fotos dos produtos' },
      { nome: 'SEO para e-commerce', categoria: 'SEO', descricao: 'Otimização das páginas de produtos para o Google Shopping e busca' },
      { nome: 'Métricas de vendas e conversão', categoria: 'Métricas / Analytics', descricao: 'Relatórios de produtos mais visualizados e taxa de compra', isComplex: true },
    ],
    premium: [
      { nome: 'Área do cliente para pedidos', categoria: 'Área do Cliente', descricao: 'Login do comprador para ver compras e rastreamento', isComplex: true },
      { nome: 'Rastreamento de entrega', categoria: 'Pedidos', descricao: 'Código e status do envio integrado ao pedido', isComplex: true },
      { nome: 'Controle de estoque sob avaliação', categoria: 'Gestão', descricao: 'Baixa automática e aviso de produto esgotado', isComplex: true },
      { nome: 'Recomendações inteligentes', categoria: 'Clientes', descricao: 'Sugestões de produtos complementares e compre junto', isComplex: true },
      { nome: 'Automação de carrinho abandonado', categoria: 'Automação', descricao: 'Disparos para recuperar clientes que não finalizaram', isComplex: true },
      { nome: 'Programa de fidelidade e pontos', categoria: 'Clientes', descricao: 'Benefícios e cashback para compras recorrentes', isComplex: true },
      { nome: 'Integrações com ERP ou expedição', categoria: 'Integrações', descricao: 'Conexão com plataformas de logística e notas fiscais', isComplex: true },
      { nome: 'Painel avançado de vendas', categoria: 'Gestão', descricao: 'Relatório completo de faturamento, ticket médio e clientes', isComplex: true },
    ],
  },

  // 7. IMOBILIÁRIA & CONSTRUTORA
  imobiliaria: {
    personalizado: [
      { nome: 'Catálogo de imóveis', categoria: 'Catálogo', descricao: 'Listagem de casas, apartamentos, terrenos e salas comerciais' },
      { nome: 'Filtros por tipo e valor', categoria: 'Catálogo', descricao: 'Filtros rápidos por compra, locação e faixa de preço' },
      { nome: 'Busca por código ou bairro', categoria: 'Catálogo', descricao: 'Campo de pesquisa para encontrar imóveis com facilidade' },
      { nome: 'Detalhes e características', categoria: 'Catálogo', descricao: 'Metragem, quartos, vagas, condomínio e comodidades' },
      { nome: 'Galeria de fotos do imóvel', categoria: 'Conteúdo', descricao: 'Fotos em alta resolução com visualizador ampliado' },
      { nome: 'Formulário de interesse e contato', categoria: 'Atendimento / Agendamento', descricao: 'Contato direto do cliente interessado no imóvel específico' },
      { nome: 'Equipe de corretores (CRECI)', categoria: 'Conteúdo', descricao: 'Apresentação dos corretores credenciados responsáveis' },
    ],
    profissional: [
      { nome: 'Busca avançada de imóveis', categoria: 'Catálogo', descricao: 'Filtros combinados por quartos, suítes, vagas, bairro e condomínio' },
      { nome: 'Mapa com localização dos imóveis', categoria: 'Recursos avançados', descricao: 'Visualização geográfica de imóveis no mapa' },
      { nome: 'Favoritos salvos no navegador', categoria: 'Clientes', descricao: 'Possibilidade de guardar imóveis de interesse sem login' },
      { nome: 'Comparativo de imóveis', categoria: 'Catálogo', descricao: 'Comparador de características lado a lado' },
      { nome: 'Captação estratégica de leads', categoria: 'Clientes', descricao: 'Formulários para compradores, proprietários e locatários' },
      { nome: 'Perfis de corretores com imóveis', categoria: 'Conteúdo', descricao: 'Página exclusiva de cada corretor com sua carteira' },
      { nome: 'SEO imobiliário regional', categoria: 'SEO', descricao: 'Otimização para aparecer nas buscas de imóveis da região' },
      { nome: 'Métricas de imóveis mais visitados', categoria: 'Métricas / Analytics', descricao: 'Relatório de visualizações e leads por imóvel', isComplex: true },
    ],
    premium: [
      { nome: 'Tour virtual 360° e vídeos', categoria: 'Recursos avançados', descricao: 'Visita imersiva em 360 graus do imóvel', isComplex: true },
      { nome: 'Área do cliente / proprietário', categoria: 'Área do Cliente', descricao: 'Portal para proprietários acompanharem propostas', isComplex: true },
      { nome: 'Alertas de novos imóveis', categoria: 'Automação', descricao: 'Notificação automática quando entrar imóvel no perfil buscado', isComplex: true },
      { nome: 'Integração com CRM imobiliário', categoria: 'Integrações', descricao: 'Conexão com sistemas como Vista, RD Station ou semelhantes', isComplex: true },
      { nome: 'Integração com portais imobiliários', categoria: 'Integrações', descricao: 'Exportação e sincronização com portais parceiros', isComplex: true },
      { nome: 'Painel de distribuição de leads', categoria: 'Gestão', descricao: 'Roteamento de contatos para corretores de plantão', isComplex: true },
      { nome: 'Analytics imobiliário completo', categoria: 'Métricas / Analytics', descricao: 'Dashboard com métricas de propostas e visitas agendadas', isComplex: true },
      { nome: 'Simulador interativo de financiamento', categoria: 'Recursos avançados', descricao: 'Estimativa de parcelas bancárias para o cliente', isComplex: true },
    ],
  },

  // 8. PRESTADOR DE SERVIÇOS
  prestador: {
    personalizado: [
      { nome: 'Catálogo de serviços prestados', categoria: 'Catálogo', descricao: 'Apresentação clara dos serviços e especialidades' },
      { nome: 'Solicitação de orçamento', categoria: 'Atendimento / Agendamento', descricao: 'Formulário limpo para envio de requisitos do cliente' },
      { nome: 'Agendamento de visita técnica', categoria: 'Atendimento / Agendamento', descricao: 'Opção para marcar dia e turno de atendimento' },
      { nome: 'Regiões e cidades atendidas', categoria: 'Conteúdo', descricao: 'Lista de bairros com raio de atendimento' },
      { nome: 'Equipe e qualificações técnicas', categoria: 'Conteúdo', descricao: 'Certificados e experiência dos profissionais' },
      { nome: 'Portfólio de serviços realizados', categoria: 'Conteúdo', descricao: 'Fotos de serviços executados com antes e depois' },
      { nome: 'Depoimentos de clientes', categoria: 'Clientes', descricao: 'Recomendações e avaliações de atendimentos anteriores' },
    ],
    profissional: [
      { nome: 'Solicitação detalhada de proposta', categoria: 'Atendimento / Agendamento', descricao: 'Formulário com triagem técnica e opção de anexos' },
      { nome: 'Portfólio categorizado por serviço', categoria: 'Catálogo', descricao: 'Exibição de serviços com fotos em alta definição' },
      { nome: 'Agendamento com escolha de turno', categoria: 'Atendimento / Agendamento', descricao: 'Definição de data com confirmação ágil' },
      { nome: 'Área do cliente para orçamentos', categoria: 'Área do Cliente', descricao: 'Acesso do cliente para consultar propostas e laudos', isComplex: true },
      { nome: 'Histórico de chamados do cliente', categoria: 'Clientes', descricao: 'Registro de manutenções e serviços prestados', isComplex: true },
      { nome: 'Depoimentos corporativos e residenciais', categoria: 'Clientes', descricao: 'Provas sociais com nomes e fotos de clientes' },
      { nome: 'SEO para serviços locais', categoria: 'SEO', descricao: 'Otimização nas buscas de técnicos e serviços na região' },
      { nome: 'Métricas de orçamentos e contatos', categoria: 'Métricas / Analytics', descricao: 'Estatísticas de serviços mais demandados', isComplex: true },
    ],
    premium: [
      { nome: 'Status do serviço ao vivo', categoria: 'Tempo real', descricao: 'Atualização do andamento ou deslocamento da equipe', isComplex: true },
      { nome: 'Área completa do cliente', categoria: 'Área do Cliente', descricao: 'Portal com ordens de serviço, notas e termos de garantia', isComplex: true },
      { nome: 'Gestão de ordens de serviço', categoria: 'Gestão', descricao: 'Controle digital de O.S. e alocação de técnicos', isComplex: true },
      { nome: 'Notificações automáticas de etapas', categoria: 'Automação', descricao: 'Avisos automáticos no WhatsApp sobre o serviço', isComplex: true },
      { nome: 'Integrações com ERP ou faturamento', categoria: 'Integrações', descricao: 'Conexão avaliada com sistemas de gestão do prestador', isComplex: true },
      { nome: 'Pesquisa automática de satisfação', categoria: 'Automação', descricao: 'Disparo de avaliação após conclusão do serviço', isComplex: true },
      { nome: 'Painel da equipe e rotas', categoria: 'Gestão', descricao: 'Distribuição inteligente de chamados diários', isComplex: true },
      { nome: 'Analytics e conversão de propostas', categoria: 'Métricas / Analytics', descricao: 'Dashboard com taxa de aprovação de orçamentos', isComplex: true },
    ],
  },

  // 9. ENGENHARIA CIVIL & ARQUITETURA
  engenharia: {
    personalizado: [
      { nome: 'Portfólio de obras e projetos', categoria: 'Catálogo', descricao: 'Apresentação de obras residenciais e comerciais entregues' },
      { nome: 'Solicitação de orçamento técnico', categoria: 'Atendimento / Agendamento', descricao: 'Formulário focado no escopo e metragem da obra' },
      { nome: 'Corpo técnico (CREA / CAU)', categoria: 'Conteúdo', descricao: 'Apresentação dos engenheiros e arquitetos responsáveis' },
      { nome: 'Serviços de engenharia e laudos', categoria: 'Catálogo', descricao: 'Reformas, projetos estruturais, perícias e alvarás' },
      { nome: 'Galeria de fotos em alta resolução', categoria: 'Conteúdo', descricao: 'Visualizador de imagens dos projetos arquitetônicos' },
      { nome: 'Certificações e normas técnicas', categoria: 'Conteúdo', descricao: 'Selos de qualidade, conformidade e segurança da construtora' },
      { nome: 'Depoimentos de clientes', categoria: 'Clientes', descricao: 'Avaliações de proprietários e empresas contratantes' },
    ],
    profissional: [
      { nome: 'Portfólio com filtros por tipo de obra', categoria: 'Catálogo', descricao: 'Filtros por residencial, corporativo, industrial e reformas' },
      { nome: 'Solicitação detalhada de proposta', categoria: 'Atendimento / Agendamento', descricao: 'Triagem com upload de projetos e localização do terreno' },
      { nome: 'Cases de sucesso com memorial técnico', categoria: 'Conteúdo', descricao: 'Estudos de caso com metragem, prazo e desafios superados' },
      { nome: 'Acompanhamento do cliente', categoria: 'Área do Cliente', descricao: 'Acesso do cliente para acompanhar marcos da obra', isComplex: true },
      { nome: 'Formulário de laudos e vistorias', categoria: 'Atendimento / Agendamento', descricao: 'Agendamento de perícias técnicas com engenheiro' },
      { nome: 'Blog técnico e notícias do setor', categoria: 'Conteúdo', descricao: 'Artigos sobre construção civil, sustentabilidade e materiais' },
      { nome: 'SEO para engenharia e construtora', categoria: 'SEO', descricao: 'Otimização nas buscas por engenheiros e construtoras' },
      { nome: 'Métricas de propostas comerciais', categoria: 'Métricas / Analytics', descricao: 'Relatórios de visualizações de obras e orçamentos', isComplex: true },
    ],
    premium: [
      { nome: 'Progresso da obra ao vivo', categoria: 'Tempo real', descricao: 'Fotos periódicas e percentual de avanço do cronograma', isComplex: true },
      { nome: 'Portal completo do cliente', categoria: 'Área do Cliente', descricao: 'Acesso a contratos, cronogramas físico-financeiros e laudos', isComplex: true },
      { nome: 'Maquete 3D e tour virtual', categoria: 'Recursos avançados', descricao: 'Visualização interativa 3D de projetos arquitetônicos', isComplex: true },
      { nome: 'Painel da construtora', categoria: 'Gestão', descricao: 'Controle de múltiplas obras, etapas e fornecedores', isComplex: true },
      { nome: 'Notificações automáticas de marcos de obra', categoria: 'Automação', descricao: 'Avisos no WhatsApp a cada etapa concluída', isComplex: true },
      { nome: 'Integração com ERP de construção', categoria: 'Integrações', descricao: 'Conexão com plataformas como Sienge ou planilhas de obra', isComplex: true },
      { nome: 'Analytics avançado de obras', categoria: 'Métricas / Analytics', descricao: 'Dashboard com métricas de propostas e fechamentos', isComplex: true },
      { nome: 'Diário de obra digital', categoria: 'Gestão', descricao: 'Registro digital de ocorrências diárias da construção', isComplex: true },
    ],
  },

  // 10. PORTFÓLIO PROFISSIONAL
  portfolio: {
    personalizado: [
      { nome: 'Projetos autorais', categoria: 'Catálogo', descricao: 'Vitrine dos principais trabalhos desenvolvidos' },
      { nome: 'Categorias de projetos', categoria: 'Catálogo', descricao: 'Separação por disciplina, tecnologia ou tipo de trabalho' },
      { nome: 'Galeria visual de alta resolução', categoria: 'Conteúdo', descricao: 'Visualizador limpo com fotos e mockups em alta definição' },
      { nome: 'Apresentação profissional e bio', categoria: 'Conteúdo', descricao: 'Trajetória, conquistas profissionais e diferenciais' },
      { nome: 'Serviços e formatos de contratação', categoria: 'Catálogo', descricao: 'Modalidades de prestação de serviço e consultoria' },
      { nome: 'Contato direto e propostas', categoria: 'Atendimento / Agendamento', descricao: 'Formulário direto para contratações e parcerias' },
      { nome: 'Depoimentos e recomendações', categoria: 'Conteúdo', descricao: 'Opiniões de clientes, diretores e parceiros de projeto' },
      { nome: 'Links externos profissionais', categoria: 'Conteúdo', descricao: 'Atalhos para LinkedIn, GitHub, Behance ou redes autorais' },
    ],
    profissional: [
      { nome: 'Filtros dinâmicos de projetos', categoria: 'Catálogo', descricao: 'Filtragem por ano, tecnologia, cliente ou categoria' },
      { nome: 'Estudos de caso aprofundados', categoria: 'Conteúdo', descricao: 'Páginas detalhadas com desafio, metodologia e resultados' },
      { nome: 'Galeria interativa de projetos', categoria: 'Conteúdo', descricao: 'Carrossel interativo e visualizador imersivo de imagens' },
      { nome: 'Formulário de briefing e orçamento', categoria: 'Atendimento / Agendamento', descricao: 'Triagem de escopo, prazo e investimento do cliente' },
      { nome: 'Artigos e publicações técnicas', categoria: 'Conteúdo', descricao: 'Blog com textos autorais para posicionamento de autoridade' },
      { nome: 'Captura de contatos e newsletter', categoria: 'Clientes', descricao: 'Caixa de inscrição para receber artigos e novidades' },
      { nome: 'SEO para marca pessoal', categoria: 'SEO', descricao: 'Otimização nas buscas do Google para o nome e nicho' },
      { nome: 'Métricas de visualizações e cliques', categoria: 'Métricas / Analytics', descricao: 'Relatório de projetos mais acessados e contatos', isComplex: true },
    ],
    premium: [
      { nome: 'Área exclusiva para clientes', categoria: 'Área do Cliente', descricao: 'Ambiente com senha para clientes revisarem entregas', isComplex: true },
      { nome: 'Demonstrações e protótipos interativos', categoria: 'Recursos avançados', descricao: 'Projetos ao vivo ou telas interativas no navegador', isComplex: true },
      { nome: 'Estudos de caso com métricas de impacto', categoria: 'Conteúdo', descricao: 'Cases comprovando retorno sobre investimento do cliente', isComplex: true },
      { nome: 'Integrações externas', categoria: 'Integrações', descricao: 'Conexão com plataformas autorais como Dribbble, Notion ou GitHub', isComplex: true },
      { nome: 'Analytics detalhado de tráfego', categoria: 'Métricas / Analytics', descricao: 'Rastreamento aprofundado de conversões e visitantes', isComplex: true },
      { nome: 'Qualificação automática de propostas', categoria: 'Clientes', descricao: 'Formulário inteligente com pontuação de leads', isComplex: true },
      { nome: 'Experiência autoral de design', categoria: 'Recursos avançados', descricao: 'Direção de arte exclusiva e microinterações refinadas', isComplex: true },
      { nome: 'Automação de resposta inicial', categoria: 'Automação', descricao: 'E-mail ou WhatsApp imediato com disponibilidade de agenda', isComplex: true },
    ],
  },

  // 11. LANDING PAGE DE ALTA CONVERSÃO
  landing_page: {
    personalizado: [
      { nome: 'Dobra de abertura com CTA forte', categoria: 'Recursos avançados', descricao: 'Headline de alto impacto com botão direto de conversão' },
      { nome: 'Seções modulares da oferta', categoria: 'Conteúdo', descricao: 'Blocos estruturados com benefícios claros e objetivos' },
      { nome: 'Formulário limpo de contato', categoria: 'Atendimento / Agendamento', descricao: 'Campos essenciais para máxima taxa de preenchimento' },
      { nome: 'Botão direto para WhatsApp', categoria: 'Atendimento / Agendamento', descricao: 'Atalho flutuante com mensagem de abertura personalizada' },
      { nome: 'Depoimentos e prova social', categoria: 'Conteúdo', descricao: 'Avaliações com nomes e fotos de clientes satisfeitos' },
      { nome: 'FAQ com perguntas frequentes', categoria: 'Conteúdo', descricao: 'Acordeão respondendo às principais objeções de compra' },
      { nome: 'Galeria visual do produto ou serviço', categoria: 'Conteúdo', descricao: 'Fotos atrativas destacando a qualidade da oferta' },
    ],
    profissional: [
      { nome: 'Captura estratégica de leads', categoria: 'Clientes', descricao: 'Formulário desenhado para gerar oportunidades qualificadas' },
      { nome: 'Formulário avançado com validação', categoria: 'Atendimento / Agendamento', descricao: 'Validação em tempo real de e-mail e telefone' },
      { nome: 'FAQ interativo em acordeão', categoria: 'Conteúdo', descricao: 'Perguntas e respostas organizadas para conversão rápida' },
      { nome: 'Depoimentos com prints e vídeos', categoria: 'Conteúdo', descricao: 'Provas sociais autênticas com prints de mensagens e vídeos' },
      { nome: 'Configuração de Google Analytics e Pixel', categoria: 'Métricas / Analytics', descricao: 'Instalação de tags de rastreamento para anúncios', isComplex: true },
      { nome: 'SEO e ultra-velocidade mobile', categoria: 'SEO', descricao: 'Carregamento instantâneo no 4G/5G com código limpo' },
      { nome: 'Integração de leads para webhook ou e-mail', categoria: 'Integrações', descricao: 'Envio automático de leads para planilha ou e-mail', isComplex: true },
      { nome: 'Garantia e selos de segurança', categoria: 'Conteúdo', descricao: 'Elementos de autoridade para aumentar a confiança do visitante' },
    ],
    premium: [
      { nome: 'Microinterações e animações de conversão', categoria: 'Recursos avançados', descricao: 'Efeitos visuais elegantes que guiam o olhar até o CTA', isComplex: true },
      { nome: 'Integração direta com CRM', categoria: 'Integrações', descricao: 'Conexão com plataformas como RD Station, HubSpot ou ActiveCampaign', isComplex: true },
      { nome: 'Automação pós-preenchimento', categoria: 'Automação', descricao: 'Disparo de mensagem instantânea no WhatsApp do lead', isComplex: true },
      { nome: 'Analytics avançado e mapa de cliques', categoria: 'Métricas / Analytics', descricao: 'Monitoramento detalhado de rolagem e cliques nos botões', isComplex: true },
      { nome: 'Estrutura preparada para testes A/B', categoria: 'Métricas / Analytics', descricao: 'Variações de títulos e botões para teste de conversão', isComplex: true },
      { nome: 'Personalização dinâmica da oferta', categoria: 'Recursos avançados', descricao: 'Adaptação de headlines conforme parâmetros de campanha', isComplex: true },
      { nome: 'Simulador ou calculadora de conversão', categoria: 'Recursos avançados', descricao: 'Ferramenta interativa de estimativa para o cliente', isComplex: true },
      { nome: 'Enriquecimento e pontuação de leads', categoria: 'Clientes', descricao: 'Filtro automático de leads prioritários para vendas', isComplex: true },
    ],
  },

  // 12. PET SHOP & VETERINÁRIA
  petshop: {
    personalizado: [
      { nome: 'Agendamento de banho e tosa', categoria: 'Atendimento / Agendamento', descricao: 'Formulário para escolha de horário e serviços para o pet' },
      { nome: 'Catálogo de serviços e pacotes', categoria: 'Catálogo', descricao: 'Valores de banhos, tosas higiênicas e hidratações' },
      { nome: 'Perfil do pet e do tutor', categoria: 'Clientes', descricao: 'Nome, porte, raça e dados de contato do responsável' },
      { nome: 'Horários de funcionamento', categoria: 'Atendimento / Agendamento', descricao: 'Informação dos turnos de atendimento pet e clínica' },
      { nome: 'Localização e Táxi Dog', categoria: 'Conteúdo', descricao: 'Endereço e informações sobre o serviço de leva e traz' },
      { nome: 'Galeria de pets atendidos', categoria: 'Conteúdo', descricao: 'Fotos com o resultado dos banhos e tosas do dia' },
      { nome: 'Depoimentos de tutores', categoria: 'Clientes', descricao: 'Avaliações de donos de pets sobre o carinho e atendimento' },
    ],
    profissional: [
      { nome: 'Agendamento online com escolha de profissional', categoria: 'Atendimento / Agendamento', descricao: 'Marcação com tosador ou veterinário de preferência' },
      { nome: 'Histórico do pet e cuidados especiais', categoria: 'Clientes', descricao: 'Registro de preferências, alergias e comportamento', isComplex: true },
      { nome: 'Lembretes via WhatsApp para tutores', categoria: 'Automação', descricao: 'Avisos automáticos para não esquecer o horário do pet', isComplex: true },
      { nome: 'Planos mensais e banhos recorrentes', categoria: 'Catálogo', descricao: 'Tabela de assinaturas mensais com desconto' },
      { nome: 'Status do atendimento pet', categoria: 'Gestão', descricao: 'Sinalização quando o pet estiver pronto para ser buscado' },
      { nome: 'Vitrine de rações e acessórios', categoria: 'Catálogo', descricao: 'Produtos disponíveis para retirada na loja física' },
      { nome: 'SEO para pet shop e veterinária local', categoria: 'SEO', descricao: 'Otimização nas buscas locais de banho e tosa e veterinário' },
      { nome: 'Métricas de agendamento pet', categoria: 'Métricas / Analytics', descricao: 'Relatórios de serviços e horários mais procurados', isComplex: true },
    ],
    premium: [
      { nome: 'Área do tutor com carteirinha digital', categoria: 'Área do Cliente', descricao: 'Portal com controle de vacinas e banhos agendados', isComplex: true },
      { nome: 'Notificação em tempo real (Pet Pronto)', categoria: 'Tempo real', descricao: 'Mensagem automática avisando que o pet terminou o banho', isComplex: true },
      { nome: 'Gestão de agenda e banhistas', categoria: 'Gestão', descricao: 'Controle de baias, banheiras e profissionais', isComplex: true },
      { nome: 'Automações de retorno e vacinas', categoria: 'Automação', descricao: 'Lembretes periódicos de banho e reforço de vermífugos', isComplex: true },
      { nome: 'Programa de fidelidade pet', categoria: 'Clientes', descricao: 'Pontos e brindes para banhos frequentes', isComplex: true },
      { nome: 'Integrações com software de pet shop', categoria: 'Integrações', descricao: 'Conexão avaliada com sistemas de gestão veterinária', isComplex: true },
      { nome: 'Painel administrativo completo', categoria: 'Gestão', descricao: 'Visão unificada de agendamentos, clientes e produtos', isComplex: true },
      { nome: 'Experiência exclusiva e carinhosa para tutores', categoria: 'Recursos avançados', descricao: 'Visual afetivo e moderno projetado para encantar tutores', isComplex: true },
    ],
  },

  // 13. CRIADOR DE CONTEÚDO & MÍDIA
  criador: {
    personalizado: [
      { nome: 'Mídia kit institucional', categoria: 'Conteúdo', descricao: 'Apresentação de alcance, audiência e formatos de publi' },
      { nome: 'Contato comercial para marcas', categoria: 'Atendimento / Agendamento', descricao: 'Formulário direto para propostas de patrocínio' },
      { nome: 'Vitrine de vídeos e episódios', categoria: 'Conteúdo', descricao: 'Destaques dos principais conteúdos do YouTube e podcasts' },
      { nome: 'Links oficiais e cupons de desconto', categoria: 'Catálogo', descricao: 'Centralizadora de parcerias com links comissionados' },
      { nome: 'Biografia e marcos da carreira', categoria: 'Conteúdo', descricao: 'História do criador e principais números alcançados' },
      { nome: 'Depoimentos de marcas parceiras', categoria: 'Conteúdo', descricao: 'Cases de sucesso em campanhas publicitárias' },
      { nome: 'Captura de e-mails de seguidores', categoria: 'Clientes', descricao: 'Caixa de inscrição para avisos e conteúdos especiais' },
    ],
    profissional: [
      { nome: 'Mídia kit interativo com métricas', categoria: 'Conteúdo', descricao: 'Painel visual com audiência e engajamento das redes' },
      { nome: 'Formulário de briefing para marcas', categoria: 'Atendimento / Agendamento', descricao: 'Triagem de formato de ação, orçamento e cronograma' },
      { nome: 'Vitrine de infoprodutos e mentorias', categoria: 'Catálogo', descricao: 'Páginas comerciais de cursos, e-books e consultorias' },
      { nome: 'Blog e artigos autorais', categoria: 'Conteúdo', descricao: 'Publicações textuais para consolidar posicionamento' },
      { nome: 'Comunidade e newsletter de inscritos', categoria: 'Clientes', descricao: 'Gestão da base de e-mails de seguidores fiéis' },
      { nome: 'SEO para nome do criador', categoria: 'SEO', descricao: 'Otimização nas buscas do Google pelo nome do influenciador' },
      { nome: 'Integração com feeds de redes sociais', categoria: 'Integrações', descricao: 'Exibição de últimos posts ou vídeos publicados', isComplex: true },
      { nome: 'Métricas de cliques em cupons', categoria: 'Métricas / Analytics', descricao: 'Relatório de links mais acessados pelos seguidores', isComplex: true },
    ],
    premium: [
      { nome: 'Área exclusiva para membros VIP', categoria: 'Área do Cliente', descricao: 'Ambiente com login e materiais exclusivos para a comunidade', isComplex: true },
      { nome: 'Automação de propostas e contratos', categoria: 'Automação', descricao: 'Envio automático de apresentações para agências parceiras', isComplex: true },
      { nome: 'Painel comercial de campanhas', categoria: 'Gestão', descricao: 'Controle de marcas parceiras, prazos e faturamento', isComplex: true },
      { nome: 'Integração com plataformas de infoproduto', categoria: 'Integrações', descricao: 'Conexão com plataformas como Hotmart, Kiwify ou Eduzz', isComplex: true },
      { nome: 'Disparo automático de comunicados', categoria: 'Automação', descricao: 'Alertas automáticos no WhatsApp ou Telegram da comunidade', isComplex: true },
      { nome: 'Analytics avançado de conversão de publis', categoria: 'Métricas / Analytics', descricao: 'Métricas completas de conversão para apresentar às marcas', isComplex: true },
      { nome: 'Experiência interativa para seguidores', categoria: 'Recursos avançados', descricao: 'Quizzes, calculadoras ou dinâmicas personalizadas', isComplex: true },
      { nome: 'Direção de arte totalmente autoral', categoria: 'Recursos avançados', descricao: 'Identidade visual única e diferenciada no mercado', isComplex: true },
    ],
  },

  // 14. PROJETO SOB MEDIDA / OUTRO SEGMENTO
  sob_medida: {
    personalizado: [
      { nome: 'Apresentação institucional completa', categoria: 'Conteúdo', descricao: 'Página estruturada com valores, diferenciais e missão da empresa' },
      { nome: 'Formulário personalizado de contato', categoria: 'Atendimento / Agendamento', descricao: 'Campos sob medida para triagem de interessados' },
      { nome: 'Catálogo de serviços ou produtos', categoria: 'Catálogo', descricao: 'Vitrine organizada com descrições e imagens dos serviços' },
      { nome: 'Galeria de projetos realizados', categoria: 'Conteúdo', descricao: 'Fotos e demonstrações de entregas anteriores' },
      { nome: 'Depoimentos e avaliações de clientes', categoria: 'Conteúdo', descricao: 'Opiniões e recomendações de clientes atendidos' },
      { nome: 'FAQ com dúvidas frequentes', categoria: 'Conteúdo', descricao: 'Acordeão interativo respondendo às principais perguntas' },
      { nome: 'Localização e canais de contato', categoria: 'Atendimento / Agendamento', descricao: 'Mapa, endereço, e-mail e botão de WhatsApp' },
    ],
    profissional: [
      { nome: 'Formulário avançado com triagem', categoria: 'Atendimento / Agendamento', descricao: 'Campos condicionais para qualificação comercial' },
      { nome: 'Solicitação de orçamento estruturado', categoria: 'Atendimento / Agendamento', descricao: 'Coleta de requisitos técnicos e dados de projeto' },
      { nome: 'Catálogo avançado com filtros', categoria: 'Catálogo', descricao: 'Organização dos produtos ou serviços por categorias' },
      { nome: 'Área do cliente / portal de acesso', categoria: 'Área do Cliente', descricao: 'Ambiente com login para consulta de status e propostas', isComplex: true },
      { nome: 'Histórico e acompanhamento de solicitações', categoria: 'Clientes', descricao: 'Registro de interações e solicitações do cliente', isComplex: true },
      { nome: 'SEO estruturado para o Google', categoria: 'SEO', descricao: 'Marcação de dados estruturados e meta-tags' },
      { nome: 'Configuração de Tags e Analytics', categoria: 'Métricas / Analytics', descricao: 'Instalação de Google Analytics e métricas de visitantes', isComplex: true },
      { nome: 'Integração de envio para planilhas / CRM', categoria: 'Integrações', descricao: 'Envio automático dos contatos para o Google Sheets ou CRM', isComplex: true },
    ],
    premium: [
      { nome: 'Área completa do cliente com login', categoria: 'Área do Cliente', descricao: 'Ambiente seguro para arquivos, faturas e propostas', isComplex: true },
      { nome: 'Painel administrativo para a empresa', categoria: 'Gestão', descricao: 'Gerenciamento de pedidos, contatos e conteúdos', isComplex: true },
      { nome: 'Status e atualizações em tempo real', categoria: 'Tempo real', descricao: 'Sinalização ao vivo de processos ou serviços', isComplex: true },
      { nome: 'Automação de e-mails e WhatsApp', categoria: 'Automação', descricao: 'Disparo imediato de confirmação e boas-vindas', isComplex: true },
      { nome: 'Integração com gateway de pagamento', categoria: 'Integrações', descricao: 'Recebimento online sob avaliação via Pix ou Cartão', isComplex: true },
      { nome: 'Integração com sistemas externos ou APIs', categoria: 'Integrações', descricao: 'Conexão avaliada com ERPs, CRMs ou ferramentas proprietárias', isComplex: true },
      { nome: 'Analytics avançado e funil de conversão', categoria: 'Métricas / Analytics', descricao: 'Monitoramento completo da jornada do visitante', isComplex: true },
      { nome: 'Experiência e layout totalmente autorais', categoria: 'Recursos avançados', descricao: 'Design exclusivo sob medida com interações ricas', isComplex: true },
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
