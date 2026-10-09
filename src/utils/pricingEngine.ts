import {
  OFFICIAL_EXTRA_FEATURES,
  OFFICIAL_PLANS_COMMERCIAL,
  SEGMENT_PRESETS,
  ExtraFeature,
} from '../data/commercialRules';
import { findAdvancedFeatureById } from '../data/advancedFeaturesData';

export interface BudgetBreakdownItem {
  id: string;
  nome: string;
  preco: number;
  formattedPreco: string;
  isRealtime?: boolean;
  isSuggestedBySegment?: boolean;
  isIncludedInPlan?: boolean;
  isComplex?: boolean;
}

export interface BudgetCalculationResult {
  planId: string;
  planName: string;
  basePrice: number;
  formattedBasePrice: string;
  extrasTotal: number;
  formattedExtrasTotal: string;
  totalPrice: number;
  formattedTotalPrice: string;
  isStartingFrom: boolean;
  allowExtras: boolean;
  selectedFeatures: BudgetBreakdownItem[];
  includedFeatures: BudgetBreakdownItem[];
  complexFeatures: BudgetBreakdownItem[];
  hasComplexFeatures: boolean;
  hasRealtimeFeatures: boolean;
  warnings: string[];
  scopeNotice?: string;
}

// Mapeamento canônico estrito e verificável entre os IDs gerados pela matriz de segmentos (Step5)
// e os IDs comerciais de OFFICIAL_EXTRA_FEATURES (commercialRules.ts).
export const MATRIX_TO_OFFICIAL_FEATURE_MAP: Record<string, string> = {
  // --- ACADEMIA & FITNESS ---
  'academia_profissional_agendamento_de_aulas': 'agendamento_simples',
  'academia_personalizado_agendamento_de_aula_experimental': 'agendamento_simples',
  'academia_profissional_fichas_de_treinos': 'historico_treinos',
  'academia_personalizado_fichas_de_treinos': 'historico_treinos',
  'academia_profissional_metas_e_progresso': 'estatisticas_progresso',
  'academia_personalizado_acompanhamento_de_progresso': 'estatisticas_progresso',
  'academia_premium_lotacao_em_tempo_real': 'realtime_ocupacao_academia',
  'academia_premium_status_e_equipamentos': 'realtime_equipamentos',

  // --- RESTAURANTE & GASTRONOMIA ---
  'restaurante_personalizado_cardapio_digital': 'cardapio_digital',
  'restaurante_profissional_cardapio_digital_interativo': 'cardapio_digital',
  'restaurante_profissional_montagem_de_pedidos_online': 'pedido_online',
  'restaurante_profissional_reserva_de_mesas_online': 'agendamento_simples',
  'restaurante_personalizado_reserva_de_mesas': 'agendamento_simples',
  'restaurante_premium_status_do_pedido_em_tempo_real': 'realtime_mesas_restaurante',

  // --- SALÃO DE BELEZA ---
  'salao_personalizado_agendamento_de_horarios': 'agendamento_simples',
  'salao_profissional_agendamento_online_por_profissional': 'agendamento_simples',
  'salao_personalizado_galeria_de_procedimentos': 'galeria_fotos',
  'salao_profissional_galeria_visual_com_filtros': 'galeria_fotos',

  // --- BARBEARIA ---
  'barbearia_personalizado_agendamento_de_horarios': 'agendamento_simples',
  'barbearia_profissional_agendamento_online_por_barbeiro': 'agendamento_simples',
  'barbearia_personalizado_galeria_de_cortes': 'galeria_fotos',
  'barbearia_profissional_galeria_com_filtro_de_cortes': 'galeria_fotos',
  'barbearia_premium_fila_e_horarios_em_tempo_real': 'realtime_fila_barbearia',

  // --- CLÍNICA MÉDICA ---
  'clinica_personalizado_solicitacao_de_agendamento': 'agendamento_simples',
  'clinica_profissional_agendamento_online_de_consultas': 'agendamento_simples',

  // --- LOJA & E-COMMERCE ---
  'loja_personalizado_catalogo_de_produtos': 'catalogo_produtos',
  'loja_personalizado_carrinho_de_compras': 'pedido_online',
  'loja_profissional_carrinho_com_calculo_de_frete': 'pedido_online',
  'loja_premium_controle_de_estoque_sob_avaliacao': 'realtime_estoque_ecommerce',

  // --- IMOBILIÁRIA & CONSTRUTORA ---
  'imobiliaria_personalizado_catálogo_de_imóveis': 'busca_imoveis',
  'imobiliaria_personalizado_filtros_por_tipo_e_valor': 'busca_imoveis',
  'imobiliaria_profissional_busca_avancada_de_imoveis': 'busca_imoveis',
  'imobiliaria_profissional_favoritos_salvos_no_navegador': 'favoritos_busca',
  'imobiliaria_personalizado_galeria_de_fotos_do_imóvel': 'galeria_fotos',

  // --- PRESTADOR DE SERVIÇOS ---
  'prestador_personalizado_solicitacao_de_orcamento': 'solicitacao_orcamento',
  'prestador_profissional_solicitacao_detalhada_de_proposta': 'solicitacao_orcamento',
  'prestador_personalizado_agendamento_de_visita_tecnica': 'agendamento_simples',
  'prestador_personalizado_portfolio_de_servicos_realizados': 'galeria_fotos',

  // --- ENGENHARIA CIVIL ---
  'engenharia_personalizado_solicitacao_de_orcamento_tecnico': 'solicitacao_orcamento',
  'engenharia_profissional_solicitacao_detalhada_de_proposta': 'solicitacao_orcamento',
  'engenharia_personalizado_galeria_de_fotos_em_alta_resolucao': 'galeria_fotos',
  'engenharia_premium_progresso_da_obra_ao_vivo': 'realtime_progresso_obras',
};

export function resolveCanonicalFeature(featureId: string): ExtraFeature | undefined {
  if (!featureId) return undefined;
  // 1. Tenta correspondência direta com ID oficial
  const direct = OFFICIAL_EXTRA_FEATURES.find((f) => f.id === featureId);
  if (direct) return direct;

  // 2. Tenta mapeamento explícito
  const mappedId = MATRIX_TO_OFFICIAL_FEATURE_MAP[featureId];
  if (mappedId) {
    return OFFICIAL_EXTRA_FEATURES.find((f) => f.id === mappedId);
  }

  return undefined;
}

export function calculateBudget(
  planId: string,
  selectedFeatureIds: string[] = [],
  segmentId?: string
): BudgetCalculationResult {
  const normPlanId = (planId || 'profissional').toLowerCase().trim();
  const plan = OFFICIAL_PLANS_COMMERCIAL[normPlanId] || OFFICIAL_PLANS_COMMERCIAL['profissional'];

  // Evita duplicidade usando conjunto único de IDs selecionados na interface
  const uniqueFeatureIds = Array.from(new Set(selectedFeatureIds));

  const segmentPreset = segmentId ? SEGMENT_PRESETS[segmentId] : null;
  const suggestedIds = segmentPreset ? segmentPreset.suggestedFeatureIds : [];

  const warnings: string[] = [];
  const selectedFeatures: BudgetBreakdownItem[] = [];
  const includedFeatures: BudgetBreakdownItem[] = [];
  const complexFeatures: BudgetBreakdownItem[] = [];

  // Conjunto para evitar cobrar duas vezes o mesmo recurso canônico oficial
  const chargedCanonicalIds = new Set<string>();

  let extrasTotal = 0;
  let hasRealtimeFeatures = false;

  // Se for Essencial: plano fechado
  if (!plan.allowExtras && uniqueFeatureIds.length > 0) {
    warnings.push('O plano Essencial possui escopo fechado. Recursos adicionais exigem o plano Profissional ou Personalizado.');
  }

  uniqueFeatureIds.forEach((rawId) => {
    // 1. Localiza metadados originais da matriz de funcionalidades (para rótulo e complexidade)
    const matrixItem = findAdvancedFeatureById(rawId);
    const itemName = matrixItem ? matrixItem.nome : rawId;
    const isComplex = matrixItem ? Boolean(matrixItem.isComplex) : false;

    // 2. Localiza correspondência canônica oficial se houver
    const canonicalFeat = resolveCanonicalFeature(rawId);

    // Se o item for complexo
    if (isComplex) {
      complexFeatures.push({
        id: rawId,
        nome: itemName,
        preco: 0,
        formattedPreco: 'Sob avaliação',
        isComplex: true,
      });
    }

    if (!canonicalFeat) {
      // Recurso sem preço tabelado em OFFICIAL_EXTRA_FEATURES:
      // Se não for complexo, é uma funcionalidade funcional incluída no escopo do plano
      if (!isComplex) {
        includedFeatures.push({
          id: rawId,
          nome: itemName,
          preco: 0,
          formattedPreco: 'Incluso no plano',
          isIncludedInPlan: true,
        });
      }
      return;
    }

    // O item possui correspondência canônica
    const isRealtime = Boolean(canonicalFeat.isRealtime);
    if (isRealtime) {
      hasRealtimeFeatures = true;
    }

    // Validação de Realtime: permitido somente em Personalizado e Premium
    if (isRealtime && !plan.allowRealtime) {
      warnings.push(`O recurso "${itemName}" é em tempo real e exclusivo para os planos Personalizado e Premium.`);
      // No plano sem suporte a realtime, não cobra nem adiciona ao total
      return;
    }

    // Se o plano for Essencial (não permite extras), não adiciona cobrança
    if (!plan.allowExtras) {
      return;
    }

    // Aplicação do Modelo Híbrido:
    // Recursos em tempo real (Realtime: + R$ 300) são sempre adicionais tabelados quando permitidos.
    if (!chargedCanonicalIds.has(canonicalFeat.id)) {
      chargedCanonicalIds.add(canonicalFeat.id);

      if (isRealtime) {
        extrasTotal += canonicalFeat.preco;
        selectedFeatures.push({
          id: rawId,
          nome: itemName,
          preco: canonicalFeat.preco,
          formattedPreco: `+ R$ ${canonicalFeat.preco.toLocaleString('pt-BR')}`,
          isRealtime: true,
          isSuggestedBySegment: suggestedIds.includes(canonicalFeat.id),
        });
      } else {
        // Recursos padrão selecionados dentro da franquia do plano estão inclusos no preço-base
        includedFeatures.push({
          id: rawId,
          nome: itemName,
          preco: 0,
          formattedPreco: 'Incluso no plano',
          isIncludedInPlan: true,
        });
      }
    }
  });

  const totalPrice = plan.precoBase + extrasTotal;
  const isStartingFrom = Boolean(plan.isStartingFrom) || complexFeatures.length > 0;

  const formattedBasePrice = plan.isStartingFrom
    ? `A partir de R$ ${plan.precoBase.toLocaleString('pt-BR')}`
    : `R$ ${plan.precoBase.toLocaleString('pt-BR')}`;

  const formattedTotalPrice = isStartingFrom
    ? `A partir de R$ ${totalPrice.toLocaleString('pt-BR')}`
    : `R$ ${totalPrice.toLocaleString('pt-BR')}`;

  const hasComplexFeatures = complexFeatures.length > 0;
  let scopeNotice: string | undefined = undefined;

  if (hasComplexFeatures) {
    scopeNotice = 'Contém itens sujeitos à avaliação técnica de escopo. O orçamento final será refinado pela equipe NexaWeb.';
  }

  return {
    planId: plan.id,
    planName: plan.nome,
    basePrice: plan.precoBase,
    formattedBasePrice,
    extrasTotal,
    formattedExtrasTotal: extrasTotal > 0 ? `+ R$ ${extrasTotal.toLocaleString('pt-BR')}` : 'R$ 0',
    totalPrice,
    formattedTotalPrice,
    isStartingFrom,
    allowExtras: plan.allowExtras,
    selectedFeatures,
    includedFeatures,
    complexFeatures,
    hasComplexFeatures,
    hasRealtimeFeatures,
    warnings,
    scopeNotice,
  };
}

export function getFeatureById(id: string): ExtraFeature | undefined {
  return resolveCanonicalFeature(id);
}

export function getSuggestedFeaturesForSegment(segmentId: string): ExtraFeature[] {
  const preset = SEGMENT_PRESETS[segmentId];
  if (!preset) return [];
  return preset.suggestedFeatureIds
    .map((id) => OFFICIAL_EXTRA_FEATURES.find((f) => f.id === id))
    .filter(Boolean) as ExtraFeature[];
}
