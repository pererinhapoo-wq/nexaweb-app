import { Preferences } from '@capacitor/preferences';
import { Lead } from '../types';

const STORAGE_KEY = 'nexaweb_leads_v1';

// Leitura síncrona imediata via localStorage para manter compatibilidade e inicialização instantânea sem flickers
export function getStoredLeads(): Lead[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Erro ao ler leads síncronos:', err);
    return [];
  }
}

// Leitura assíncrona que prioriza @capacitor/preferences (nativo no Android / fallback na Web)
export async function getStoredLeadsNative(): Promise<Lead[]> {
  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    if (value) {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        // Atualiza o cache local
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, value);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Erro ao ler do @capacitor/preferences, usando fallback local:', err);
  }
  return getStoredLeads();
}

// Gravação que persiste tanto no localStorage quanto no @capacitor/preferences nativo do Android
export function saveStoredLeads(leads: Lead[]): void {
  const json = JSON.stringify(leads);

  // 1. Persistência imediata no localStorage
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, json);
    }
  } catch (err) {
    console.warn('Erro ao salvar no localStorage:', err);
  }

  // 2. Persistência nativa segura no Android (SharedPreferences via Capacitor)
  Preferences.set({
    key: STORAGE_KEY,
    value: json,
  }).catch((err) => {
    console.warn('Erro ao persistir no @capacitor/preferences:', err);
  });
}
