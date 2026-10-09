import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { useTheme, ThemeOption } from '../contexts/ThemeContext';
import { Language, AnimationMode, SettingsSubView } from '../types';
import { BackButton } from './BackButton';
import appIcon from '../assets/app-icon.svg';
import {
  getHelpFaq,
  getFeedbackTypes,
  getPrivacyData,
  getTermsData,
} from './settingsData';
import {
  Globe,
  Palette,
  Sun,
  Moon,
  Sparkles,
  Zap,
  ZapOff,
  MessageSquare,
  HelpCircle,
  Mail,
  ShieldCheck,
  FileText,
  Info,
  ExternalLink,
  Check,
  ChevronRight,
  ChevronDown,
  Copy,
  Send,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  Gauge,
  Target,
} from 'lucide-react';

interface SettingsScreenProps {
  activeSubView?: SettingsSubView;
  onNavigateSubView: (subView: SettingsSubView) => void;
  onBack: () => void;
  onOpenContact?: () => void;
}

// Ícone oficial SVG compatível e limpo do Instagram
const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  activeSubView,
  onNavigateSubView,
  onBack,
  onOpenContact,
}) => {
  const { language, setLanguage, t, languages } = useTranslation();
  const { themeMode, setThemeMode, animationMode, setAnimationMode } = useTheme();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Estados da tela de Feedback
  const [feedbackType, setFeedbackType] = useState<string>('Sugestão');
  const [feedbackSubject, setFeedbackSubject] = useState<string>('');
  const [feedbackDescription, setFeedbackDescription] = useState<string>('');
  const [feedbackErrors, setFeedbackErrors] = useState<{ subject?: string; description?: string }>({});
  const [isFeedbackSent, setIsFeedbackSent] = useState<boolean>(false);
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState<boolean>(false);

  // Estados de cópia
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Estados da tela de Ajuda (accordions)
  const [expandedHelpIndex, setExpandedHelpIndex] = useState<number | null>(0);

  // Conteúdos localizados reativos para os 5 idiomas suportados
  const feedbackTypes = useMemo(() => getFeedbackTypes(language), [language]);
  const helpFaq = useMemo(() => getHelpFaq(language), [language]);
  const privacyData = useMemo(() => getPrivacyData(language), [language]);
  const termsData = useMemo(() => getTermsData(language), [language]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleCopy = (text: string, key: string, label: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedKey(key);
      const copiedText =
        language === 'en'
          ? `${label} copied!`
          : language === 'es'
          ? `¡${label} copiado!`
          : language === 'fr'
          ? `${label} copié !`
          : `${label} copiado!`;
      showToast(copiedText);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      showToast(
        language === 'en'
          ? 'Failed to copy'
          : language === 'es'
          ? 'Error al copiar'
          : language === 'fr'
          ? 'Erreur de copie'
          : 'Erro ao copiar'
      );
    }
  };

  const handleLanguageChange = async (newLang: Language) => {
    if (newLang === language) return;
    await setLanguage(newLang);
    const toast =
      newLang === 'en'
        ? 'Language updated successfully!'
        : newLang === 'es'
        ? '¡Idioma actualizado con éxito!'
        : newLang === 'fr'
        ? 'Langue mise à jour avec succès !'
        : 'Idioma atualizado com sucesso!';
    showToast(toast);
  };

  const handleThemeChange = async (mode: ThemeOption) => {
    if (mode === themeMode) return;
    await setThemeMode(mode);
    const toast =
      mode === 'light'
        ? (language === 'en' ? 'Light theme applied!' : 'Tema claro aplicado!')
        : mode === 'dark'
        ? (language === 'en' ? 'AMOLED Dark theme applied!' : 'Tema escuro AMOLED aplicado!')
        : (language === 'en' ? 'Original theme applied!' : 'Tema original aplicado!');
    showToast(toast);
  };

  const handleAnimationChange = async (mode: AnimationMode) => {
    if (mode === animationMode) return;
    await setAnimationMode(mode);
    const toast =
      mode === 'reduced'
        ? (language === 'en' ? 'Reduced motion enabled!' : 'Animações reduzidas ativadas!')
        : (language === 'en' ? 'Smooth animations enabled!' : 'Animações ativadas!');
    showToast(toast);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { subject?: string; description?: string } = {};

    if (!feedbackSubject.trim()) {
      errors.subject =
        language === 'en'
          ? 'Please enter the feedback subject.'
          : language === 'es'
          ? 'Por favor, ingrese el asunto del comentario.'
          : language === 'fr'
          ? 'Veuillez renseigner l’objet de votre retour.'
          : 'Por favor, informe o assunto do feedback.';
    }
    if (!feedbackDescription.trim()) {
      errors.description =
        language === 'en'
          ? 'Please describe your feedback in detail.'
          : language === 'es'
          ? 'Por favor, describa su comentario en detalle.'
          : language === 'fr'
          ? 'Veuillez décrire votre retour en détail.'
          : 'Por favor, descreva seu feedback em detalhes.';
    }

    if (Object.keys(errors).length > 0) {
      setFeedbackErrors(errors);
      return;
    }

    setFeedbackErrors({});
    setIsFeedbackSubmitting(true);

    setTimeout(() => {
      setIsFeedbackSubmitting(false);
      setIsFeedbackSent(true);

      const subjectEncoded = encodeURIComponent(`[Feedback NexaWeb - ${feedbackType}] ${feedbackSubject}`);
      const bodyEncoded = encodeURIComponent(
        `Olá equipe NexaWeb,\n\nTipo de Feedback: ${feedbackType}\nAssunto: ${feedbackSubject}\n\nDescrição:\n${feedbackDescription}\n\n---\nEnviado através do NexaWeb App`
      );

      const mailtoUrl = `mailto:nexaweeb@gmail.com?subject=${subjectEncoded}&body=${bodyEncoded}`;
      window.location.href = mailtoUrl;
    }, 450);
  };

  const resetFeedbackForm = () => {
    setFeedbackSubject('');
    setFeedbackDescription('');
    setFeedbackType('Sugestão');
    setFeedbackErrors({});
    setIsFeedbackSent(false);
  };

  // Idioma ativo para rótulo na tela principal
  const currentLangObj = languages.find((l) => l.code === language) || languages[0];
  const currentLanguageLabel = currentLangObj
    ? `${currentLangObj.flag} ${currentLangObj.nativeName || currentLangObj.name}`
    : language === 'en'
    ? 'English (US)'
    : 'Português (Brasil)';

  const currentThemeLabel =
    themeMode === 'light'
      ? t.settings.themeLight
      : themeMode === 'dark'
      ? t.settings.themeDark
      : language === 'en'
      ? 'Original (Default)'
      : language === 'es'
      ? 'Original (Predeterminado)'
      : language === 'fr'
      ? 'Original (Par défaut)'
      : 'Original (Padrão)';

  const currentAnimationLabel =
    animationMode === 'reduced' ? t.settings.animationsReduced : t.settings.animationsEnabled;

  // Cabeçalho unificado compartilhado por todas as telas de Configurações
  const renderScreenHeader = (title: string, subtitle?: string) => (
    <div className="flex items-center gap-2 py-1">
      <BackButton
        onClick={onBack}
        label={
          t.header?.back ||
          (language === 'en'
            ? 'Back'
            : language === 'es'
            ? 'Volver'
            : language === 'fr'
            ? 'Retour'
            : 'Voltar')
        }
      />
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <h1 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  // Contêiner compartilhado padronizado para as subtelas internas de Configurações
  const SubViewContainer: React.FC<{
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }> = ({ title, subtitle, children }) => (
    <div className="w-full space-y-2.5 animate-in fade-in slide-in-from-right-2 duration-150">
      {renderScreenHeader(title, subtitle)}
      <div className="w-full">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-2.5 pb-2 transition-colors duration-200 overflow-x-hidden">
      {/* Toast flutuante de confirmação */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-xl shadow-indigo-950/60 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150 border border-indigo-400/40"
        >
          <Check className="w-3.5 h-3.5 text-cyan-300 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          1. SUBTELA: IDIOMA (Lista Completa de Idiomas Restaurada)
          ========================================================================= */}
      {activeSubView === 'language' && (
        <SubViewContainer
          title={
            language === 'en'
              ? 'App Language'
              : language === 'es'
              ? 'Idioma de la aplicación'
              : language === 'fr'
              ? 'Langue de l’application'
              : language === 'pt-PT'
              ? 'Idioma da aplicação'
              : 'Idioma do aplicativo'
          }
          subtitle={
            language === 'en'
              ? 'Select the interface display language'
              : language === 'es'
              ? 'Seleccione el idioma de visualización de la app'
              : language === 'fr'
              ? 'Sélectionnez la langue d’affichage de l’application'
              : language === 'pt-PT'
              ? 'Selecione o idioma de exibição da aplicação'
              : 'Selecione o idioma de exibição do aplicativo'
          }
        >
          <div className="space-y-2" role="radiogroup" aria-label="Idioma do aplicativo">
            {languages.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleLanguageChange(item.code)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-150 min-h-[48px] active:scale-[0.985] cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/40'
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0 select-none" role="img" aria-label={item.name}>
                      {item.flag}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-[13px] font-bold ${isSelected ? 'text-cyan-200' : 'text-white'}`}>
                        {item.nativeName || item.name}
                      </p>
                      <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isSelected ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                        {t.languageModal?.active || (language === 'en' ? 'Active' : language === 'es' ? 'Activo' : language === 'fr' ? 'Actif' : 'Ativo')}
                      </span>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700" aria-hidden="true" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </SubViewContainer>
      )}

      {/* =========================================================================
          2. SUBTELA: TEMA
          ========================================================================= */}
      {activeSubView === 'theme' && (
        <SubViewContainer
          title={t.settings?.theme || 'Tema'}
          subtitle={t.settings?.themeDesc || 'Escolha a aparência visual do NexaWeb App'}
        >
          <div className="space-y-2" role="radiogroup" aria-label="Tema da interface">
            {/* Opção 1: Original (Padrão) */}
            <button
              type="button"
              role="radio"
              aria-checked={themeMode === 'original'}
              onClick={() => handleThemeChange('original')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-150 min-h-[48px] active:scale-[0.985] cursor-pointer ${
                themeMode === 'original'
                  ? 'bg-indigo-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs sm:text-[13px] font-bold ${themeMode === 'original' ? 'text-cyan-200' : 'text-white'}`}>
                      Original
                    </p>
                    <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {t.settings?.themeOfficial || 'Padrão Oficial'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                    {language === 'en'
                      ? 'Official NexaWeb dark Slate aesthetics'
                      : language === 'es'
                      ? 'Identidad oficial NexaWeb en tonos Slate oscuros'
                      : language === 'fr'
                      ? 'Identité officielle NexaWeb aux tons Slate sombres'
                      : 'Identidade oficial NexaWeb em tons Slate escuros refinados'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {themeMode === 'original' ? (
                  <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shadow-sm shadow-cyan-400/40">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700" aria-hidden="true" />
                )}
              </div>
            </button>

            {/* Opção 2: Claro */}
            <button
              type="button"
              role="radio"
              aria-checked={themeMode === 'light'}
              onClick={() => handleThemeChange('light')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-150 min-h-[48px] active:scale-[0.985] cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-indigo-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs sm:text-[13px] font-bold ${themeMode === 'light' ? 'text-cyan-200' : 'text-white'}`}>
                      {t.settings?.themeLight || 'Claro'}
                    </p>
                    <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {language === 'en' ? 'Day Mode' : language === 'es' ? 'Modo Día' : language === 'fr' ? 'Mode Jour' : 'Modo Dia'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                    {language === 'en'
                      ? 'Light background with smooth contrast for bright environments'
                      : language === 'es'
                      ? 'Fondo claro con contraste suave para ambientes iluminados'
                      : language === 'fr'
                      ? 'Fond clair au contraste doux pour environnements lumineux'
                      : 'Fundo claro com contraste suave para ambientes bem iluminados'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {themeMode === 'light' ? (
                  <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shadow-sm shadow-cyan-400/40">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700" aria-hidden="true" />
                )}
              </div>
            </button>

            {/* Opção 3: Escuro AMOLED */}
            <button
              type="button"
              role="radio"
              aria-checked={themeMode === 'dark'}
              onClick={() => handleThemeChange('dark')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-150 min-h-[48px] active:scale-[0.985] cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-indigo-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs sm:text-[13px] font-bold ${themeMode === 'dark' ? 'text-cyan-200' : 'text-white'}`}>
                      {t.settings?.themeDark || 'Escuro'}
                    </p>
                    <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      AMOLED Black
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                    {language === 'en'
                      ? 'Pure black background with maximum energy savings on OLED screens'
                      : language === 'es'
                      ? 'Negro puro con máximo ahorro de energía en pantallas OLED'
                      : language === 'fr'
                      ? 'Noir pur absolu avec économie maximale d’énergie sur écrans OLED'
                      : language === 'pt-PT'
                      ? 'Preto puro absoluto com máxima poupança de energia em ecrãs OLED'
                      : 'Preto puro absoluto com máxima economia de energia em telas OLED'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {themeMode === 'dark' ? (
                  <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shadow-sm shadow-cyan-400/40">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700" aria-hidden="true" />
                )}
              </div>
            </button>
          </div>
        </SubViewContainer>
      )}

      {/* =========================================================================
          3. SUBTELA: ANIMAÇÕES
          ========================================================================= */}
      {activeSubView === 'animations' && (
        <SubViewContainer
          title={t.settings?.animations || 'Animações'}
          subtitle={t.settings?.animationsDesc || 'Controle os efeitos visuais e transições de tela'}
        >
          <div className="space-y-2" role="radiogroup" aria-label={t.settings?.animations || 'Modo de animações'}>
            {/* Opção 1: Ativadas */}
            <button
              type="button"
              role="radio"
              aria-checked={animationMode === 'enabled'}
              onClick={() => handleAnimationChange('enabled')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-150 min-h-[48px] active:scale-[0.985] cursor-pointer ${
                animationMode === 'enabled'
                  ? 'bg-indigo-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs sm:text-[13px] font-bold ${animationMode === 'enabled' ? 'text-cyan-200' : 'text-white'}`}>
                      {t.settings?.animationsEnabled || 'Ativadas'}
                    </p>
                    <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {t.settings?.animationsEnabledBadge || (language === 'en' ? 'Recommended' : language === 'es' ? 'Recomendado' : language === 'fr' ? 'Recommandé' : 'Recomendado')}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                    {language === 'en'
                      ? 'Smooth transitions and tactile micro-interactions enabled'
                      : language === 'es'
                      ? 'Transiciones fluidas y microinteracciones táctiles activadas'
                      : language === 'fr'
                      ? 'Transitions fluides et micro-interactions tactiles activées'
                      : 'Transições fluidas e microinterações táteis ativadas'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {animationMode === 'enabled' ? (
                  <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shadow-sm shadow-cyan-400/40">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700" aria-hidden="true" />
                )}
              </div>
            </button>

            {/* Opção 2: Reduzidas */}
            <button
              type="button"
              role="radio"
              aria-checked={animationMode === 'reduced'}
              onClick={() => handleAnimationChange('reduced')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-150 min-h-[48px] active:scale-[0.985] cursor-pointer ${
                animationMode === 'reduced'
                  ? 'bg-indigo-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/40'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <ZapOff className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs sm:text-[13px] font-bold ${animationMode === 'reduced' ? 'text-cyan-200' : 'text-white'}`}>
                      {t.settings?.animationsReduced || 'Reduzidas'}
                    </p>
                    <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {language === 'en' ? 'Accessibility' : language === 'es' ? 'Accesibilidad' : language === 'fr' ? 'Accessibilité' : 'Acessibilidade'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                    {t.settings?.animationsReducedDesc || (language === 'en' ? 'Instant transitions for fast navigation' : 'Transições instantâneas para navegação ágil')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {animationMode === 'reduced' ? (
                  <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shadow-sm shadow-cyan-400/40">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700" aria-hidden="true" />
                )}
              </div>
            </button>
          </div>
        </SubViewContainer>
      )}

      {/* =========================================================================
          4. SUBTELA: FEEDBACK
          ========================================================================= */}
      {activeSubView === 'feedback' && (
        <SubViewContainer
          title={language === 'en' ? 'Feedback' : language === 'es' ? 'Comentarios' : language === 'fr' ? 'Commentaires' : 'Feedback'}
          subtitle={
            language === 'en'
              ? 'Send suggestions, report issues or share compliments'
              : language === 'es'
              ? 'Envíe sugerencias, reporte problemas o comparta comentarios'
              : language === 'fr'
              ? 'Envoyez des suggestions, signalez un problème ou partagez vos retours'
              : language === 'pt-PT'
              ? 'Envie sugestões, reporte problemas ou partilhe elogios'
              : 'Envie sugestões, relate problemas ou compartilhe seu elogio'
          }
        >
          {isFeedbackSent ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-11 h-11 rounded-full bg-emerald-500/15 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400 shadow-md">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  {language === 'en'
                    ? 'Feedback ready to send!'
                    : language === 'es'
                    ? '¡Comentario listo para enviar!'
                    : language === 'fr'
                    ? 'Retour prêt à être envoyé !'
                    : 'Feedback pronto para envio!'}
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {language === 'en'
                    ? 'Your email client has been opened with your pre-filled feedback for the official NexaWeb team.'
                    : language === 'es'
                    ? 'Su cliente de correo se abrió con los datos listos para el equipo oficial NexaWeb.'
                    : language === 'fr'
                    ? 'Votre client email s’est ouvert avec vos informations préremplies pour l’équipe NexaWeb.'
                    : 'Seu cliente de e-mail foi aberto com os dados preenchidos para envio à equipe oficial NexaWeb.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1 text-slate-300">
                <p className="font-semibold text-cyan-300 truncate">[{feedbackType}] {feedbackSubject}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2">{feedbackDescription}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `[${feedbackType}] ${feedbackSubject}\n\n${feedbackDescription}`,
                      'feedback-body',
                      language === 'en' ? 'Feedback text' : language === 'es' ? 'Texto del comentario' : language === 'fr' ? 'Texte' : 'Texto do feedback'
                    )
                  }
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>
                    {language === 'en' ? 'Copy feedback text' : language === 'es' ? 'Copiar texto del comentario' : language === 'fr' ? 'Copier le texte' : 'Copiar texto do feedback'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={resetFeedbackForm}
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  <span>
                    {language === 'en' ? 'Send another feedback' : language === 'es' ? 'Enviar otro comentario' : language === 'fr' ? 'Envoyer un autre retour' : 'Enviar outro feedback'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-2.5">
              {/* Tipo de feedback */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">
                  {language === 'en' ? 'Feedback Type' : language === 'es' ? 'Tipo de Comentario' : language === 'fr' ? 'Type de Retour' : 'Tipo de Feedback'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFeedbackType(type.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all min-h-[40px] cursor-pointer text-center ${
                        feedbackType === type.id
                          ? 'bg-indigo-600/30 border-cyan-400 text-cyan-200 shadow-sm ring-1 ring-cyan-400/40'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campo Assunto */}
              <div className="space-y-1">
                <label htmlFor="feedback-subject" className="text-xs font-bold text-slate-300 block">
                  {language === 'en' ? 'Subject' : language === 'es' ? 'Asunto' : language === 'fr' ? 'Objet' : 'Assunto'}
                </label>
                <input
                  id="feedback-subject"
                  type="text"
                  value={feedbackSubject}
                  onChange={(e) => {
                    setFeedbackSubject(e.target.value);
                    if (feedbackErrors.subject) {
                      setFeedbackErrors((prev) => ({ ...prev, subject: undefined }));
                    }
                  }}
                  placeholder={
                    language === 'en'
                      ? 'e.g. Suggestion for briefing wizard'
                      : language === 'es'
                      ? 'Ej: Sugerencia para el asistente de briefing'
                      : language === 'fr'
                      ? 'Ex : Suggestion pour le briefing'
                      : 'Ex: Sugestão para o assistente de briefing'
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    feedbackErrors.subject
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-slate-800 focus:border-cyan-400'
                  }`}
                />
                {feedbackErrors.subject && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 pt-0.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{feedbackErrors.subject}</span>
                  </p>
                )}
              </div>

              {/* Campo Descrição */}
              <div className="space-y-1">
                <label htmlFor="feedback-desc" className="text-xs font-bold text-slate-300 block">
                  {language === 'en' ? 'Detailed description' : language === 'es' ? 'Descripción detallada' : language === 'fr' ? 'Description détaillée' : 'Descrição detalhada'}
                </label>
                <textarea
                  id="feedback-desc"
                  rows={4}
                  value={feedbackDescription}
                  onChange={(e) => {
                    setFeedbackDescription(e.target.value);
                    if (feedbackErrors.description) {
                      setFeedbackErrors((prev) => ({ ...prev, description: undefined }));
                    }
                  }}
                  placeholder={
                    language === 'en'
                      ? 'Describe your suggestion, difficulty or compliment in detail...'
                      : language === 'es'
                      ? 'Describa detalladamente su sugerencia, dificultad o felicitación...'
                      : language === 'fr'
                      ? 'Décrivez en détail votre suggestion, difficulté ou commentaire...'
                      : 'Descreva detalhadamente sua sugestão, dificuldade encontrada ou comentário...'
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-xs text-white placeholder-slate-500 focus:outline-none transition-colors resize-none ${
                    feedbackErrors.description
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-slate-800 focus:border-cyan-400'
                  }`}
                />
                {feedbackErrors.description && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 pt-0.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{feedbackErrors.description}</span>
                  </p>
                )}
              </div>

              {/* Nota sobre canal oficial de envio */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {language === 'en'
                    ? 'The official feedback channel is monitored directly by the NexaWeb team via '
                    : language === 'es'
                    ? 'El canal oficial de comentarios es monitoreado directamente por el equipo NexaWeb vía '
                    : language === 'fr'
                    ? 'Le canal officiel est suivi directement par l’équipe NexaWeb à l’adresse '
                    : 'O canal oficial de feedback é monitorado diretamente pela equipe NexaWeb através do e-mail '}
                  <strong>nexaweeb@gmail.com</strong>.
                </p>
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={isFeedbackSubmitting}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 transition-all cursor-pointer active:scale-[0.985] disabled:opacity-70"
              >
                {isFeedbackSubmitting ? (
                  <span>
                    {language === 'en' ? 'Preparing to send...' : language === 'es' ? 'Preparando envío...' : language === 'fr' ? 'Préparation...' : 'Preparando envio...'}
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {language === 'en'
                        ? 'Send Feedback via Official Email'
                        : language === 'es'
                        ? 'Enviar Comentario vía Correo Oficial'
                        : language === 'fr'
                        ? 'Envoyer via Email Officiel'
                        : 'Enviar Feedback via E-mail Oficial'}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}
        </SubViewContainer>
      )}

      {/* =========================================================================
          5. SUBTELA: AJUDA
          ========================================================================= */}
      {activeSubView === 'help' && (
        <SubViewContainer
          title={language === 'en' ? 'Help & Guidance' : language === 'es' ? 'Ayuda & Guías' : language === 'fr' ? 'Aide & Guides' : 'Ajuda & Orientações'}
          subtitle={
            language === 'en'
              ? 'Practical guides on plans, demos and briefing'
              : language === 'es'
              ? 'Guías prácticas sobre planes, demostraciones y briefing'
              : language === 'fr'
              ? 'Guides pratiques sur les formules, démos et briefing'
              : language === 'pt-PT'
              ? 'Guias práticos sobre planos, demonstrações e briefing'
              : 'Guias práticos sobre planos, demonstrações e briefing'
          }
        >
          <div className="space-y-2">
            {helpFaq.map((item, idx) => {
              const isExpanded = expandedHelpIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800/80 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedHelpIndex(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-850/60 transition-colors cursor-pointer min-h-[46px]"
                    aria-expanded={isExpanded}
                  >
                    <span className="text-xs font-bold text-white pr-2">
                      {item.title}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/70 text-xs text-slate-300 leading-relaxed whitespace-pre-line animate-in fade-in duration-150">
                      {item.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {onOpenContact && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenContact}
                className="w-full min-h-[46px] flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer active:scale-[0.985]"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>
                  {language === 'en'
                    ? 'Speak directly with NexaWeb team'
                    : language === 'es'
                    ? 'Hablar directamente con el equipo NexaWeb'
                    : language === 'fr'
                    ? 'Contacter directement l’équipe NexaWeb'
                    : language === 'pt-PT'
                    ? 'Falar diretamente com a equipa NexaWeb'
                    : 'Falar diretamente com a equipe NexaWeb'}
                </span>
              </button>
            </div>
          )}
        </SubViewContainer>
      )}

      {/* =========================================================================
          6. SUBTELA: INSTAGRAM OFICIAL
          ========================================================================= */}
      {activeSubView === 'instagram' && (
        <SubViewContainer
          title="Instagram Oficial"
          subtitle="Canal verificado de comunicação e portfólio da NexaWeb"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-md">
                <InstagramIcon className="w-5 h-5 text-rose-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-white">NexaWeb</h2>
                  <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Oficial
                  </span>
                </div>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">@nexaw1</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Acompanhe novidades, demonstrações em primeira mão de novos layouts, dicas práticas de posicionamento digital e bastidores da criação de sites profissionais.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="truncate">https://www.instagram.com/nexaw1/</span>
              <button
                type="button"
                onClick={() =>
                  handleCopy('https://www.instagram.com/nexaw1/', 'insta-link', 'Link do Instagram')
                }
                className="p-1 text-slate-400 hover:text-cyan-400 cursor-pointer ml-2"
                title="Copiar link"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href="https://www.instagram.com/nexaw1/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all active:scale-[0.985]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir perfil no Instagram</span>
              </a>
              <button
                type="button"
                onClick={() =>
                  handleCopy('https://www.instagram.com/nexaw1/', 'insta-link', 'Link do Instagram')
                }
                className="min-h-[44px] px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer active:scale-[0.985] flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar link</span>
              </button>
            </div>
          </div>
        </SubViewContainer>
      )}

      {/* =========================================================================
          7. SUBTELA: E-MAIL OFICIAL
          ========================================================================= */}
      {activeSubView === 'email' && (
        <SubViewContainer
          title="E-mail de Contato"
          subtitle="Canal oficial para propostas, envio de materiais e suporte"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-md">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-white">Equipe NexaWeb</h2>
                  <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Verificado
                  </span>
                </div>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">nexaweeb@gmail.com</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Utilize nosso endereço oficial para esclarecer dúvidas sobre propostas, enviar fotos, logotipos e textos para o seu site ou solicitar assistência técnica.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="truncate">nexaweeb@gmail.com</span>
              <button
                type="button"
                onClick={() =>
                  handleCopy('nexaweeb@gmail.com', 'email-addr', 'E-mail')
                }
                className="p-1 text-slate-400 hover:text-cyan-400 cursor-pointer ml-2"
                title="Copiar e-mail"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400">
              <p>⏱️ <strong>Prazo médio de retorno:</strong> Até 1 dia útil em horário comercial.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href="mailto:nexaweeb@gmail.com"
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md transition-all active:scale-[0.985]"
              >
                <Mail className="w-4 h-4" />
                <span>Iniciar e-mail agora</span>
              </a>
              <button
                type="button"
                onClick={() =>
                  handleCopy('nexaweeb@gmail.com', 'email-addr', 'E-mail')
                }
                className="min-h-[44px] px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer active:scale-[0.985] flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar e-mail</span>
              </button>
            </div>
          </div>
        </SubViewContainer>
      )}

      {/* =========================================================================
          8. SUBTELA: PRIVACIDADE
          ========================================================================= */}
      {activeSubView === 'privacy' && (
        <SubViewContainer
          title="Privacidade"
          subtitle="Compromisso com a segurança e privacidade das suas informações"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3.5 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-white">
                  Política de Privacidade & Dados
                </h2>
                <p className="text-[10.5px] text-slate-400">Diretrizes da NexaWeb</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 text-xs leading-relaxed space-y-1">
              <p className="font-semibold text-white">Status da Política Formal:</p>
              <p className="text-[11.5px] text-slate-300">
                O documento formal completo da Política de Privacidade está em processo de estruturação jurídica para publicação oficial no site <strong>nexaweeb.vercel.app</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white">Compromissos vigentes da NexaWeb:</h3>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Finalidade comercial exclusiva:</strong> As informações fornecidas no briefing (nome, telefone, empresa, preferências) são utilizadas apenas para alinhamento de propostas e atendimento ao seu projeto.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Não compartilhamento:</strong> Não vendemos, não alugamos e não compartilhamos seus dados com terceiros ou anunciantes.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Armazenamento seguro do rascunho:</strong> O rascunho do formulário de briefing fica armazenado unicamente no armazenamento local do seu próprio aparelho, não sendo transmitido sem sua ação de envio.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              Para esclarecer qualquer dúvida sobre privacidade e tratamento de dados, escreva para <strong>nexaweeb@gmail.com</strong>.
            </div>
          </div>
        </SubViewContainer>
      )}

      {/* =========================================================================
          9. SUBTELA: TERMOS DE USO
          ========================================================================= */}
      {activeSubView === 'terms' && (
        <SubViewContainer
          title="Termos de Uso"
          subtitle="Condições gerais de serviço e contratação de projetos"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3.5 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-white">
                  Termos & Condições de Serviço
                </h2>
                <p className="text-[10.5px] text-slate-400">Contratação de sites profissionais</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs leading-relaxed space-y-1">
              <p className="font-semibold text-white">Status dos Termos Formais:</p>
              <p className="text-[11.5px] text-slate-300">
                Os termos gerais formais de contratação estão em fase de consolidação contratual definitiva e podem ser consultados diretamente com nossos especialistas durante a validação da sua proposta.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white">Diretrizes gerais aplicáveis:</h3>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Transparência comercial:</strong> Todos os planos (Essencial, Profissional e Personalizado), valores base e recursos adicionais são informados com clareza nas abas de Serviços e Briefing.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Validação prévia:</strong> Todo projeto depende da aprovação mútua da proposta comercial e do cronograma antes de qualquer cobrança ou entrega definitiva.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Demonstrações conceituais:</strong> Os projetos interativos exibidos no portfólio são modelos de demonstração para apresentar a qualidade e as capacidades técnicas da agência.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              Dúvidas comerciais ou solicitações de contrato formal podem ser enviadas para <strong>nexaweeb@gmail.com</strong>.
            </div>
          </div>
        </SubViewContainer>
      )}

      {/* =========================================================================
          10. SUBTELA: SOBRE O APLICATIVO
          ========================================================================= */}
      {activeSubView === 'about' && (
        <SubViewContainer
          title="Sobre o Aplicativo"
          subtitle="Informações sobre a aplicação e a agência NexaWeb"
        >
          {/* Card de Identidade da Aplicação */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-3 shadow-sm text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-950 border border-indigo-500/30 p-2 flex items-center justify-center shadow-lg shadow-indigo-950/40">
              <img
                src={appIcon}
                alt="Logotipo NexaWeb App"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h2 className="text-base font-bold text-white tracking-tight">NexaWeb App</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-mono font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  v1.0
                </span>
                <span className="text-[11px] text-slate-400">• Mobile Ready</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Aplicativo oficial da NexaWeb. Conheça nossos planos, serviços, portfólio de demonstrações e inicie o projeto do seu site profissional com máxima agilidade e alto padrão.
            </p>
          </div>

          {/* Pilares de Qualidade */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-2.5 mt-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-cyan-400">
              Pilares de Qualidade NexaWeb
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold">
                  <Gauge className="w-3.5 h-3.5 shrink-0" />
                  <span>Performance Extrema</span>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-normal">
                  Carregamento ultra-rápido otimizado para mobile para não perder nenhum cliente em potencial.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-semibold">
                  <Palette className="w-3.5 h-3.5 shrink-0" />
                  <span>Design Sob Medida</span>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-normal">
                  Identidade visual moderna e elegante para transmitir máxima autoridade no seu nicho.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
                  <Smartphone className="w-3.5 h-3.5 shrink-0" />
                  <span>Mobile First</span>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-normal">
                  Experiência fluida e impecável em smartphones, tablets e computadores.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
                  <Target className="w-3.5 h-3.5 shrink-0" />
                  <span>Foco em Conversão</span>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-normal">
                  Gatilhos estratégicos pensados para transformar visitantes em contatos e novos clientes.
                </p>
              </div>
            </div>
          </div>

          {/* Links e Rodapé */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-2 text-xs text-slate-300 mt-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/70">
              <span className="text-slate-400">Site Oficial:</span>
              <a
                href="https://nexaweeb.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>nexaweeb.vercel.app</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/70">
              <span className="text-slate-400">Instagram:</span>
              <a
                href="https://www.instagram.com/nexaw1/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>@nexaw1</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">E-mail:</span>
              <span className="font-mono text-slate-200">nexaweeb@gmail.com</span>
            </div>
          </div>
        </SubViewContainer>
      )}

      {/* =========================================================================
          TELA PRINCIPAL DE CONFIGURAÇÕES (MENU DE OPÇÕES INDEPENDENTES)
          ========================================================================= */}
      {!activeSubView && (
        <div className="space-y-3 animate-in fade-in duration-150">
          {renderScreenHeader(
            t.settings?.title || 'Configurações',
            t.settings?.subtitle || 'Preferências do aplicativo, ajuda e canais oficiais'
          )}

          {/* GRUPO 1: PREFERÊNCIAS */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Preferências
              </span>
              <div className="flex-1 h-px bg-slate-800/80" />
            </div>

            <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 divide-y divide-slate-800/60 overflow-hidden shadow-sm">
              {/* 1.1 Idioma */}
              <button
                type="button"
                onClick={() => onNavigateSubView('language')}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-850/60 transition-colors cursor-pointer min-h-[56px] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      Idioma
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {currentLanguageLabel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                    {currentLangObj?.short || (language === 'en' ? 'EN' : 'BR')}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

              {/* 1.2 Tema */}
              <button
                type="button"
                onClick={() => onNavigateSubView('theme')}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-850/60 transition-colors cursor-pointer min-h-[56px] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      Tema
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {currentThemeLabel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[11px] font-medium text-slate-400 capitalize hidden sm:inline">
                    {themeMode}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

              {/* 1.3 Animações */}
              <button
                type="button"
                onClick={() => onNavigateSubView('animations')}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-850/60 transition-colors cursor-pointer min-h-[56px] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      Animações
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {currentAnimationLabel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                    {animationMode === 'reduced' ? 'Reduzidas' : 'Suaves'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            </div>
          </div>

          {/* GRUPO 2: AJUDA E PARTICIPAÇÃO */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Ajuda e participação
              </span>
              <div className="flex-1 h-px bg-slate-800/80" />
            </div>

            <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 divide-y divide-slate-800/60 overflow-hidden shadow-sm">
              {/* 2.1 Feedback */}
              <button
                type="button"
                onClick={() => onNavigateSubView('feedback')}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-850/60 transition-colors cursor-pointer min-h-[56px] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      Feedback
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      Envie sugestões, relate problemas ou elogios
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              {/* 2.2 Ajuda */}
              <button
                type="button"
                onClick={() => onNavigateSubView('help')}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-850/60 transition-colors cursor-pointer min-h-[56px] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      Ajuda
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      Orientações sobre planos, projetos e briefing
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            </div>
          </div>

          {/* GRUPO 3: NEXAWEB OFICIAL */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                NexaWeb oficial
              </span>
              <div className="flex-1 h-px bg-slate-800/80" />
            </div>

            <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 divide-y divide-slate-800/60 overflow-hidden shadow-sm">
              {/* 3.1 Instagram oficial */}
              <button
                type="button"
                onClick={() => onNavigateSubView('instagram')}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-850/60 transition-colors cursor-pointer min-h-[56px] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                    <InstagramIcon className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      Instagram oficial
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      @nexaw1
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              {/* 3.2 E-mail de contato */}
              <button
                type="button"
                onClick={() => onNavigateSubView('email')}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-850/60 transition-colors cursor-pointer min-h-[56px] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      E-mail de contato
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      nexaweeb@gmail.com
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            </div>
          </div>

          {/* GRUPO 4: INFORMAÇÕES */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Informações
              </span>
              <div className="flex-1 h-px bg-slate-800/80" />
            </div>

            <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 divide-y divide-slate-800/60 overflow-hidden shadow-sm">
              {/* 4.1 Privacidade */}
              <button
                type="button"
                onClick={() => onNavigateSubView('privacy')}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-850/60 transition-colors cursor-pointer min-h-[56px] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      Privacidade
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      Política de privacidade e proteção de dados
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              {/* 4.2 Termos de Uso */}
              <button
                type="button"
                onClick={() => onNavigateSubView('terms')}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-850/60 transition-colors cursor-pointer min-h-[56px] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      Termos de Uso
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      Condições gerais de serviço e contratação
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

              {/* 4.3 Sobre o aplicativo */}
              <button
                type="button"
                onClick={() => onNavigateSubView('about')}
                className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-850/60 transition-colors cursor-pointer min-h-[56px] group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      Sobre o aplicativo
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      NexaWeb App • v1.0
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
