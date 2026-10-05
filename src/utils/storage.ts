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
};

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
  if (val === 'light' || val === 'auto') return val;
  return 'dark'; // Dark é o padrão oficial
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
