import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import {
  OnboardingAnswers,
  InterestOption,
  ObjectiveOption,
  WebsiteLanguage,
  CustomizationOption,
} from '../types';
import {
  Sparkles,
  ArrowRight,
  Check,
  Rocket,
  RefreshCw,
  Layout,
  MessageSquare,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { BackButton } from './BackButton';
import { setOnboardingCompleted, saveOnboardingAnswers } from '../utils/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: OnboardingAnswers) => void;
  initialStep?: number;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialStep = 1,
}) => {
  const { language, t } = useTranslation();

  // Etapas: 1 = O que precisa | 2 = Segmento | 3 = Foco do site
  const [step, setStep] = useState<number>(initialStep || 1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Respostas
  const [interest, setInterest] = useState<InterestOption>('new_site');
  const [segment, setSegment] = useState<string>('services');
  const [objective, setObjective] = useState<ObjectiveOption>('contacts');
  const [websiteLanguage] = useState<WebsiteLanguage>(
    language === 'pt-PT' ? 'pt-PT' : language === 'en' ? 'en' : language === 'es' ? 'es' : language === 'fr' ? 'fr' : 'pt-BR'
  );
  const [customization] = useState<CustomizationOption>('complete');

  // Sincroniza step inicial quando reaberto
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep || 1);
      setDirection('forward');
    }
  }, [isOpen, initialStep]);

  // Lock de scroll e suporte ao botão voltar do Android
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handlePopState = () => {
      setStep((prev) => {
        if (prev > 1) {
          setDirection('backward');
          return prev - 1;
        }
        onClose();
        return 1;
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStep((prev) => {
          if (prev > 1) {
            setDirection('backward');
            return prev - 1;
          }
          onClose();
          return 1;
        });
      }
    };

    window.history.pushState({ onboardingOpen: true }, '');
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Pular: abandona o onboarding, salva padrões, marca como concluído e entra no app
  const handleSkip = async () => {
    const defaultAnswers: OnboardingAnswers = {
      interest,
      segment,
      objective,
      websiteLanguage,
      customization,
    };
    await saveOnboardingAnswers(defaultAnswers);
    await setOnboardingCompleted(true);
    onClose();
  };

  // Próximo ou Começar a usar
  const handleNext = async () => {
    if (step < 3) {
      setDirection('forward');
      setStep((prev) => prev + 1);
    } else {
      const answers: OnboardingAnswers = {
        interest,
        segment,
        objective,
        websiteLanguage,
        customization,
      };
      await saveOnboardingAnswers(answers);
      await setOnboardingCompleted(true);
      onComplete(answers);
    }
  };

  // Voltar (somente etapas 2 e 3)
  const handleBack = () => {
    if (step > 1) {
      setDirection('backward');
      setStep((prev) => prev - 1);
    }
  };

  // Opções da Etapa 1
  const interestOptions = useMemo(() => [
    {
      id: 'new_site' as InterestOption,
      title: t.onboarding.interestNewSite,
      subtitle: t.onboarding.interestNewSiteDesc,
      icon: <Rocket className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'renew_site' as InterestOption,
      title: t.onboarding.interestRenewSite,
      subtitle: t.onboarding.interestRenewSiteDesc,
      icon: <RefreshCw className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'landing_page' as InterestOption,
      title: t.onboarding.interestLandingPage,
      subtitle: t.onboarding.interestLandingPageDesc,
      icon: <Layout className="w-4 h-4 text-emerald-400" />,
    },
  ], [t]);

  // Opções da Etapa 2
  const segmentOptions = useMemo(() => [
    { id: 'barber', label: t.segments.barber, icon: '💈' },
    { id: 'beauty', label: t.segments.beauty, icon: '💅' },
    { id: 'clinic', label: t.segments.clinic, icon: '🩺' },
    { id: 'food', label: t.segments.food, icon: '🍽️' },
    { id: 'realEstate', label: t.segments.realEstate, icon: '🏢' },
    { id: 'fitness', label: t.segments.fitness, icon: '🏋️' },
    { id: 'services', label: t.segments.services, icon: '💼' },
    { id: 'retail', label: t.segments.retail, icon: '🛍️' },
    { id: 'other', label: t.segments.other, icon: '🌐' },
  ], [t]);

  // Opções da Etapa 3
  const objectiveOptions = useMemo(() => [
    {
      id: 'contacts' as ObjectiveOption,
      title: t.onboarding.objContacts,
      subtitle: t.onboarding.objContactsDesc,
      icon: <MessageSquare className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'company' as ObjectiveOption,
      title: t.onboarding.objCompany,
      subtitle: t.onboarding.objCompanyDesc,
      icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'sell' as ObjectiveOption,
      title: t.onboarding.objSell,
      subtitle: t.onboarding.objSellDesc,
      icon: <ShoppingBag className="w-4 h-4 text-amber-400" />,
    },
  ], [t]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full sm:max-w-lg max-h-[85dvh] sm:max-h-[85vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden pb-1 safe-area-pb animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
      >
        {/* Mobile drag handle discreto */}
        <div className="pt-2 pb-0.5 flex justify-center sm:hidden shrink-0" aria-hidden="true">
          <div className="w-10 h-1 bg-slate-700/80 rounded-full" />
        </div>

        {/* Header do Onboarding */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 shrink-0">
          {/* Lado Esquerdo: Marca NexaWeb */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-indigo-600/30 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-sm text-white flex items-center gap-1.5 leading-none">
                NexaWeb
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {t.header?.official || 'Oficial'}
                </span>
              </span>
            </div>
          </div>

          {/* Centro: Indicador Discreto de Progresso (01 / 03 + Dots) */}
          <div className="flex items-center gap-2 shrink-0 px-2">
            <span className="font-mono text-xs font-bold text-cyan-300">
              0{step} <span className="text-slate-600">/</span> 03
            </span>
            <div className="flex items-center gap-1" aria-hidden="true">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step === i
                      ? 'w-4 bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-sm shadow-cyan-400/50'
                      : step > i
                      ? 'w-1.5 bg-indigo-500/60'
                      : 'w-1.5 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Lado Direito: Botão "Pular" Confortável e Secundário (Sem X) */}
          <button
            type="button"
            onClick={handleSkip}
            className="min-h-[44px] min-w-[56px] px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/70 active:scale-95 transition-all flex items-center justify-center shrink-0"
            aria-label={t.onboarding.btnSkip || 'Pular'}
          >
            {t.onboarding.btnSkip || 'Pular'}
          </button>
        </div>

        {/* Barra de Progresso Fina e Suave */}
        <div className="w-full h-1 bg-slate-800 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Conteúdo Dinâmico das 3 Telas */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* ============================================================== */}
          {/* ETAPA 1 DE 3: BOAS-VINDAS & OBJETIVO INICIAL                   */}
          {/* ============================================================== */}
          {step === 1 && (
            <div
              key="step-1"
              className={`space-y-4 ${
                direction === 'forward'
                  ? 'animate-in fade-in slide-in-from-right-2 duration-150'
                  : 'animate-in fade-in slide-in-from-left-2 duration-150'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  {t.onboarding.firstAccessBadge}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {t.onboarding.step1Title}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.onboarding.step1Subtitle}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {interestOptions.map((opt) => {
                  const isSelected = interest === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setInterest(opt.id)}
                      className={`min-h-[58px] w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'bg-indigo-950/50 border-cyan-500/80 ring-1 ring-cyan-500/40 text-white shadow-md shadow-indigo-950/40'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-500/40'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        {opt.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-white block truncate">
                          {opt.title}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                          {opt.subtitle}
                        </span>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                            : 'border-slate-700 bg-slate-900/50'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* ETAPA 2 DE 3: SEGMENTO DO NEGÓCIO                              */}
          {/* ============================================================== */}
          {step === 2 && (
            <div
              key="step-2"
              className={`space-y-4 ${
                direction === 'forward'
                  ? 'animate-in fade-in slide-in-from-right-2 duration-150'
                  : 'animate-in fade-in slide-in-from-left-2 duration-150'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  {t.recommendation?.segmentLabel || 'Ramo de Atuação'}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {t.onboarding.step2Title}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.onboarding.step2Subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {segmentOptions.map((seg) => {
                  const isSelected = segment === seg.id;
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setSegment(seg.id)}
                      className={`min-h-[46px] p-2.5 rounded-xl border text-left transition-all active:scale-[0.99] flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-indigo-950/60 border-cyan-500/80 ring-1 ring-cyan-500/30 text-white shadow-sm'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      {/* Ícone discreto em container próprio */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-500/30'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                        aria-hidden="true"
                      >
                        <span>{seg.icon}</span>
                      </div>

                      {/* Área própria para o texto */}
                      <div className="flex-1 min-w-0 pr-1">
                        <span className="text-xs font-semibold block leading-tight text-slate-200 line-clamp-2">
                          {seg.label}
                        </span>
                      </div>

                      {/* Controle de seleção alinhado e discreto */}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-sm'
                            : 'border-slate-700 bg-slate-900/60'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* ETAPA 3 DE 3: FOCO PRINCIPAL DO SITE                           */}
          {/* ============================================================== */}
          {step === 3 && (
            <div
              key="step-3"
              className={`space-y-4 ${
                direction === 'forward'
                  ? 'animate-in fade-in slide-in-from-right-2 duration-150'
                  : 'animate-in fade-in slide-in-from-left-2 duration-150'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  {t.recommendation?.objectiveLabel || 'Objetivo Estratégico'}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {t.onboarding.step3Title}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.onboarding.step3Subtitle}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {objectiveOptions.map((opt) => {
                  const isSelected = objective === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setObjective(opt.id)}
                      className={`min-h-[50px] w-full p-2.5 sm:p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all active:scale-[0.985] ${
                        isSelected
                          ? 'bg-indigo-950/50 border-cyan-500/80 ring-1 ring-cyan-500/40 text-white shadow-sm'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-500/40'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        {opt.icon}
                      </div>

                      <div className="flex-1 min-w-0 pr-1">
                        <span className="text-xs font-bold text-white block leading-snug line-clamp-2">
                          {opt.title}
                        </span>
                        <span className="text-[10.5px] text-slate-400 block leading-tight mt-0.5 line-clamp-2">
                          {opt.subtitle}
                        </span>
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-sm'
                            : 'border-slate-700 bg-slate-900/50'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer com Botões por Etapa */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
          {/* Botão de retorno: Só aparece a partir da etapa 2 */}
          {step > 1 ? (
            <BackButton
              onClick={handleBack}
              label={t.onboarding.btnBack || 'Voltar'}
            />
          ) : (
            <div className="w-11 h-11 shrink-0" aria-hidden="true" />
          )}

          {/* Botão Principal: "Próximo" nas etapas 1 e 2 | "Começar a usar" na etapa 3 */}
          <button
            type="button"
            onClick={handleNext}
            className={`min-h-[48px] flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-950/50 transition-all ${
              step === 1 ? 'w-full' : 'flex-1 max-w-xs ml-auto'
            }`}
          >
            <span>
              {step === 3
                ? t.recommendation?.startProjectBtn || 'Começar a usar'
                : t.onboarding?.btnContinue || 'Próximo'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
