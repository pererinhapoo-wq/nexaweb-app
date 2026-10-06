import {
  OFFICIAL_EXTRA_FEATURES,
  OFFICIAL_PLANS_COMMERCIAL,
  SEGMENT_PRESETS,
  ExtraFeature,
} from '../data/commercialRules';

export interface BudgetBreakdownItem {
  id: string;
  nome: string;
  preco: number;
  formattedPreco: string;
  isRealtime?: boolean;
  isSuggestedBySegment?: boolean;
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
  warnings: string[];
}

export function calculateBudget(
  planId: string,
  selectedFeatureIds: string[] = [],
  segmentId?: string
): BudgetCalculationResult {
  const plan = OFFICIAL_PLANS_COMMERCIAL[planId] || OFFICIAL_PLANS_COMMERCIAL['profissional'];

  // Evita duplicidade usando conjunto único de IDs canônicos
  const uniqueFeatureIds = Array.from(new Set(selectedFeatureIds));

  const segmentPreset = segmentId ? SEGMENT_PRESETS[segmentId] : null;
  const suggestedIds = segmentPreset ? segmentPreset.suggestedFeatureIds : [];

  const warnings: string[] = [];
  const selectedFeatures: BudgetBreakdownItem[] = [];
  let extrasTotal = 0;

  // Se for Essencial: plano fechado
  if (!plan.allowExtras && uniqueFeatureIds.length > 0) {
    warnings.push('O plano Essencial possui escopo fechado. Recursos extras exigem o plano Profissional ou Personalizado.');
  }

  uniqueFeatureIds.forEach((featId) => {
    const feat = OFFICIAL_EXTRA_FEATURES.find((f) => f.id === featId);
    if (!feat) return;

    // Validação de Realtime: permitido somente em Personalizado e Premium
    if (feat.isRealtime && !plan.allowRealtime) {
      warnings.push(`O recurso "${feat.nome}" é exclusivo para os planos Personalizado e Premium.`);
    }

    // Se o plano permite extras, contabiliza o valor oficial
    if (plan.allowExtras) {
      // Se for realtime e o plano não permitir, não cobra nem adiciona ao cálculo
      if (feat.isRealtime && !plan.allowRealtime) {
        return;
      }

      extrasTotal += feat.preco;
      selectedFeatures.push({
        id: feat.id,
        nome: feat.nome,
        preco: feat.preco,
        formattedPreco: `+ R$ ${feat.preco.toLocaleString('pt-BR')}`,
        isRealtime: feat.isRealtime,
        isSuggestedBySegment: suggestedIds.includes(feat.id),
      });
    }
  });

  const totalPrice = plan.precoBase + extrasTotal;
  const isStartingFrom = Boolean(plan.isStartingFrom);

  const formattedBasePrice = isStartingFrom
    ? `A partir de R$ ${plan.precoBase.toLocaleString('pt-BR')}`
    : `R$ ${plan.precoBase.toLocaleString('pt-BR')}`;

  const formattedTotalPrice = isStartingFrom
    ? `A partir de R$ ${totalPrice.toLocaleString('pt-BR')}`
    : `R$ ${totalPrice.toLocaleString('pt-BR')}`;

  return {
    planId: plan.id,
    planName: plan.nome,
    basePrice: plan.precoBase,
    formattedBasePrice,
    extrasTotal,
    formattedExtrasTotal: `+ R$ ${extrasTotal.toLocaleString('pt-BR')}`,
    totalPrice,
    formattedTotalPrice,
    isStartingFrom,
    allowExtras: plan.allowExtras,
    selectedFeatures,
    warnings,
  };
}

export function getFeatureById(id: string): ExtraFeature | undefined {
  return OFFICIAL_EXTRA_FEATURES.find((f) => f.id === id);
}

export function getSuggestedFeaturesForSegment(segmentId: string): ExtraFeature[] {
  const preset = SEGMENT_PRESETS[segmentId];
  if (!preset) return [];
  return preset.suggestedFeatureIds
    .map((id) => getFeatureById(id))
    .filter(Boolean) as ExtraFeature[];
}
