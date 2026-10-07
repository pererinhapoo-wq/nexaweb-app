import { Preferences } from '@capacitor/preferences';
import { OnboardingAnswers, WebsiteLanguage, ThemeMode, AnimationMode } from '../types';

const KEYS = {
  LANGUAGE: 'nexaweb_app_language',
  ONBOARDING_COMPLETED: 'nexaweb_onboarding_completed',
  ONBOARDING_ANSWERS: 'nexaweb_onboarding_answers',
  WEBSITE_LANGUAGE: 'nexaweb_website_language',
  FAVORITES: 'nexaweb_portfolio_favorites',
  THEME: 'nexaweb_app_theme',
  ANIMATIONS: 'nexaweb_animations',
  BRIEFING_DRAFT_PREFIX: 'nexaweb_briefing_draft_',
};

export interface BriefingDraftData {
  step?: number;
  selectedPlan: string;
  selectedSegment?: string;
  selectedModel?: string;
  modelApproach?: 'exact' | 'inspiration';
  startType?: 'modelo' | 'propria' | 'plano';
  businessName?: string;
  siteObjective?: string;
  businessLocation?: string;
  googleMapsLink?: string;
  siteLanguage?: WebsiteLanguage;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  specificNotes?: string;
  selectedAdvancedFeatures?: string[];
  // Essencial
  essentialServices?: string;
  essentialColorMode?: 'suggest' | 'brand' | 'custom';
  essentialCustomColors?: string;
  // Personalizado
  visualStyle?: string;
  customSections?: string[];
  customColorMode?: 'suggest' | 'custom';
  customColors?: string;
  freeVision?: string;
  // Profissional / Premium
  selectedFeatureIds?: string[];
  accessProfiles?: string[];
  referenceLink?: string;
  strategicVision?: string;
  // Premium
  premiumColorMode?: 'suggest' | 'brand' | 'custom';
  premiumCustomColors?: string;
  updatedAt?: number;
}

export function getBriefingDraftKey(planId: string): string {
  return `${KEYS.BRIEFING_DRAFT_PREFIX}${planId}`;
}

export function getBriefingDraftSync(planId: string): BriefingDraftData | null {
  const key = getBriefingDraftKey(planId);
  try {
    const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignora erro de JSON
  }
  return null;
}

export async function getBriefingDraft(planId: string): Promise<BriefingDraftData | null> {
  const sync = getBriefingDraftSync(planId);
  if (sync) return sync;
  const key = getBriefingDraftKey(planId);
  try {
    const val = await getStorageItem(key);
    if (val) return JSON.parse(val);
  } catch {
    // Ignora erro
  }
  return null;
}

// Cache em memória do último rascunho salvo por plano para evitar I/O redundante em disco e bridge nativa
const lastSavedDraftMap: Record<string, string> = {};

export async function saveBriefingDraft(planId: string, draft: BriefingDraftData): Promise<void> {
  const key = getBriefingDraftKey(planId);
  const draftContentKey = JSON.stringify(draft);

  // Se o conteúdo do rascunho não mudou, evita nova escrita em disco/Preferences
  if (lastSavedDraftMap[planId] === draftContentKey) {
    return;
  }
  lastSavedDraftMap[planId] = draftContentKey;

  const dataToSave = { ...draft, updatedAt: Date.now() };
  try {
    const str = JSON.stringify(dataToSave);
    sessionStorage.setItem(key, str);
    await setStorageItem(key, str); // setStorageItem já persiste em Preferences e localStorage
  } catch {
    // Ignora possíveis erros de quota
  }
}

export async function clearBriefingDraft(planId: string): Promise<void> {
  delete lastSavedDraftMap[planId];
  const key = getBriefingDraftKey(planId);
  try {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch {
    // Ignora
  }
  try {
    await Preferences.remove({ key });
  } catch {
    // Ignora
  }
}

export async function getStorageItem(key: string): Promise<string | null> {
  try {
    const { value } = await Preferences.get({ key });
    if (value !== null && value !== undefined) return value;
  } catch {
    // Falha nativa, tenta localStorage
  }

  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function setStorageItem(key: string, value: string): Promise<void> {
  try {
    await Preferences.set({ key, value });
  } catch {
    // Ignora
  }

  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignora
  }
}

export async function isOnboardingCompleted(): Promise<boolean> {
  const val = await getStorageItem(KEYS.ONBOARDING_COMPLETED);
  return val === 'true';
}

export async function setOnboardingCompleted(completed: boolean): Promise<void> {
  await setStorageItem(KEYS.ONBOARDING_COMPLETED, completed ? 'true' : 'false');
}

export async function getSavedOnboardingAnswers(): Promise<OnboardingAnswers | null> {
  const val = await getStorageItem(KEYS.ONBOARDING_ANSWERS);
  if (!val) return null;
  try {
    return JSON.parse(val) as OnboardingAnswers;
  } catch {
    return null;
  }
}

export async function saveOnboardingAnswers(answers: OnboardingAnswers): Promise<void> {
  await setStorageItem(KEYS.ONBOARDING_ANSWERS, JSON.stringify(answers));
  if (answers.websiteLanguage) {
    await setStorageItem(KEYS.WEBSITE_LANGUAGE, answers.websiteLanguage);
  }
}

export async function getSavedWebsiteLanguage(): Promise<WebsiteLanguage | null> {
  const val = await getStorageItem(KEYS.WEBSITE_LANGUAGE);
  return (val as WebsiteLanguage) || null;
}

export async function getFavoriteProjects(): Promise<string[]> {
  const val = await getStorageItem(KEYS.FAVORITES);
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function toggleFavoriteProject(projectId: string): Promise<string[]> {
  const current = await getFavoriteProjects();
  let updated: string[];
  if (current.includes(projectId)) {
    updated = current.filter((id) => id !== projectId);
  } else {
    updated = [...current, projectId];
  }
  await setStorageItem(KEYS.FAVORITES, JSON.stringify(updated));
  return updated;
}

export async function getSavedTheme(): Promise<ThemeMode> {
  const val = await getStorageItem(KEYS.THEME);
  if (val === 'original' || val === 'light' || val === 'dark') return val;
  if (val === 'official') return 'original';
  if (val === 'auto' || val === 'system') return 'original';
  return 'original'; // Padrão Oficial: Original
}

export async function saveTheme(theme: ThemeMode): Promise<void> {
  await setStorageItem(KEYS.THEME, theme);
}

export async function getSavedAnimationMode(): Promise<AnimationMode> {
  const val = await getStorageItem(KEYS.ANIMATIONS);
  if (val === 'reduced') return 'reduced';
  return 'enabled'; // Enabled é o padrão
}

export async function saveAnimationMode(mode: AnimationMode): Promise<void> {
  await setStorageItem(KEYS.ANIMATIONS, mode);
}
