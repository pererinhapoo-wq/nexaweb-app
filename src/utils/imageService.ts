/**
 * Serviço Centralizado de Imagens, Segmentos e Fallback Seguro da NexaWeb
 * Garante carregamento eficiente, imagens coerentes com cada nicho de negócio,
 * e proteção em 3 níveis contra falhas de rede.
 */

export interface SegmentVisualConfig {
  key: string;
  label: string;
  primaryImage: string;
  secondaryImage: string;
  gradient: string;
}

// Mapeamento oficial de imagens representativas por segmento
export const SEGMENT_VISUAL_MAP: Record<string, SegmentVisualConfig> = {
  academia: {
    key: 'academia',
    label: 'Academia & Fitness',
    primaryImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-cyan-600 via-blue-600 to-indigo-800',
  },
  restaurante: {
    key: 'restaurante',
    label: 'Restaurante & Gastronomia',
    primaryImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-orange-600 via-amber-600 to-red-700',
  },
  barbearia: {
    key: 'barbearia',
    label: 'Barbearia & Estética Masculina',
    primaryImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-amber-600 via-orange-600 to-stone-800',
  },
  clinica: {
    key: 'clinica',
    label: 'Clínica & Saúde',
    primaryImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-indigo-600 via-sky-600 to-blue-900',
  },
  imobiliaria: {
    key: 'imobiliaria',
    label: 'Imobiliária & Imóveis',
    primaryImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-emerald-600 via-teal-600 to-slate-800',
  },
  loja: {
    key: 'loja',
    label: 'Loja & Comércio',
    primaryImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-purple-600 via-pink-600 to-rose-800',
  },
  engenharia: {
    key: 'engenharia',
    label: 'Engenharia & Construção',
    primaryImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-blue-700 via-indigo-800 to-slate-900',
  },
  salao: {
    key: 'salao',
    label: 'Salão & Beleza',
    primaryImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-pink-600 via-rose-500 to-amber-500',
  },
  pet: {
    key: 'pet',
    label: 'Pet Shop & Veterinária',
    primaryImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-amber-500 via-emerald-600 to-teal-800',
  },
  criador: {
    key: 'criador',
    label: 'Criador de Conteúdo & Mídia',
    primaryImage: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-fuchsia-600 via-purple-600 to-indigo-800',
  },
  hotel: {
    key: 'hotel',
    label: 'Hotel & Pousada',
    primaryImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-sky-600 via-teal-600 to-indigo-900',
  },
  arquitetura: {
    key: 'arquitetura',
    label: 'Arquitetura & Design de Interiores',
    primaryImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-stone-700 via-zinc-800 to-cyan-900',
  },
  tecnologia: {
    key: 'tecnologia',
    label: 'Tecnologia & Inovação',
    primaryImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-indigo-600 via-blue-600 to-cyan-700',
  },
  juridico: {
    key: 'juridico',
    label: 'Jurídico & Consultoria',
    primaryImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-amber-700 via-stone-800 to-slate-900',
  },
};

export const GLOBAL_SAFE_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

// Cache global em memória de status de URLs na sessão
const loadedUrlsCache = new Set<string>();
const failedUrlsCache = new Set<string>();

/**
 * Normaliza qualquer texto de categoria, segmento ou título para a chave canônica
 */
export function normalizeSegmentKey(text?: string): string {
  if (!text) return 'tecnologia';
  const clean = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (clean.includes('acad') || clean.includes('fit') || clean.includes('trein') || clean.includes('cross')) {
    return 'academia';
  }
  if (clean.includes('restaur') || clean.includes('gastro') || clean.includes('pizz') || clean.includes('bist') || clean.includes('culin')) {
    return 'restaurante';
  }
  if (clean.includes('barb') || clean.includes('king') || clean.includes('corte')) {
    return 'barbearia';
  }
  if (clean.includes('clin') || clean.includes('saud') || clean.includes('medic') || clean.includes('odonto') || clean.includes('dent')) {
    return 'clinica';
  }
  if (clean.includes('imob') || clean.includes('imove') || clean.includes('corret')) {
    return 'imobiliaria';
  }
  if (clean.includes('loj') || clean.includes('comerc') || clean.includes('ecom') || clean.includes('varej') || clean.includes('mod')) {
    return 'loja';
  }
  if (clean.includes('eng') || clean.includes('const') || clean.includes('obr') || clean.includes('lotead')) {
    return 'engenharia';
  }
  if (clean.includes('sal') || clean.includes('belez') || clean.includes('estet') || clean.includes('spa') || clean.includes('cabel')) {
    return 'salao';
  }
  if (clean.includes('pet') || clean.includes('vet') || clean.includes('anim') || clean.includes('tosa')) {
    return 'pet';
  }
  if (clean.includes('criad') || clean.includes('midia') || clean.includes('conteud') || clean.includes('influenc') || clean.includes('video')) {
    return 'criador';
  }
  if (clean.includes('hot') || clean.includes('pous') || clean.includes('hosped') || clean.includes('resort')) {
    return 'hotel';
  }
  if (clean.includes('arq') || clean.includes('interio') || clean.includes('urban')) {
    return 'arquitetura';
  }
  if (clean.includes('jurid') || clean.includes('advoc') || clean.includes('direit') || clean.includes('legal')) {
    return 'juridico';
  }
  if (clean.includes('tec') || clean.includes('soft') || clean.includes('digit') || clean.includes('app')) {
    return 'tecnologia';
  }

  return 'tecnologia';
}

/**
 * Retorna as configurações visuais do segmento (imagens e gradiente)
 */
export function getSegmentConfig(segmentOrCategory?: string): SegmentVisualConfig {
  const key = normalizeSegmentKey(segmentOrCategory);
  return SEGMENT_VISUAL_MAP[key] || SEGMENT_VISUAL_MAP['tecnologia'];
}

/**
 * Constrói a sequência de fallback seguro em 3 níveis:
 * Nível 1: Imagem principal especificada
 * Nível 2: Imagem alternativa oficial do segmento
 * Nível 3: Fallback genérico seguro
 */
export function buildImageFallbackChain(
  primaryUrl: string,
  segmentOrCategory?: string
): string[] {
  const segmentConfig = getSegmentConfig(segmentOrCategory);
  const chain: string[] = [];

  // Nível 1
  if (primaryUrl && primaryUrl.trim()) {
    chain.push(primaryUrl.trim());
  }

  // Nível 2 (imagem do segmento se for diferente da primária)
  if (!chain.includes(segmentConfig.primaryImage)) {
    chain.push(segmentConfig.primaryImage);
  } else if (!chain.includes(segmentConfig.secondaryImage)) {
    chain.push(segmentConfig.secondaryImage);
  }

  // Nível 3 (fallback global seguro garantido)
  if (!chain.includes(GLOBAL_SAFE_FALLBACK_IMAGE)) {
    chain.push(GLOBAL_SAFE_FALLBACK_IMAGE);
  }

  return chain;
}

/**
 * Helpers para o cache em sessão
 */
export function isImageCachedLoaded(url: string): boolean {
  return loadedUrlsCache.has(url);
}

export function isImageCachedFailed(url: string): boolean {
  return failedUrlsCache.has(url);
}

export function cacheImageLoaded(url: string): void {
  loadedUrlsCache.add(url);
  failedUrlsCache.delete(url);
}

export function cacheImageFailed(url: string): void {
  failedUrlsCache.add(url);
}
