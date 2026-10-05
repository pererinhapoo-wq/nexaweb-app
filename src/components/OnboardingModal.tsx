import React, { useState, useEffect } from 'react';
import { useTranslation, LanguageOption } from '../contexts/LanguageContext';
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
  ArrowLeft,
  X,
  Check,
  Globe2,
  Edit3,
} from 'lucide-react';

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
  initialStep = 0,
}) => {
  const { language, setLanguage, languages, t } = useTranslation();

  const [step, setStep] = useState<number>(initialStep);

  // Respostas com valores padrão inteligentes
  const [interest, setInterest] = useState<InterestOption>('new_site');
  const [segment, setSegment] = useState<string>('services');
  const [objective, setObjective] = useState<ObjectiveOption>('contacts');
  const [websiteLanguage, setWebsiteLanguage] = useState<WebsiteLanguage>(
    language === 'pt-PT' ? 'pt-PT' : language === 'en' ? 'en' : language === 'es' ? 'es' : language === 'fr' ? 'fr' : 'pt-BR'
  );
  const [customization, setCustomization] = useState<CustomizationOption>('complete');

  // Sincroniza step inicial quando reaberto
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
    }
  }, [isOpen, initialStep]);

  // Lock de scroll e suporte seguro ao botão voltar físico do Android
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handlePopState = () => {
      setStep((prev) => {
        if (prev > 0) return prev - 1;
        onClose();
        return 0;
      });
    };

    window.history.pushState({ onboardingOpen: true }, '');
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Seleção rápida de idioma na etapa 0
  const handleSelectLanguage = async (item: LanguageOption) => {
    if (!item.available) return;
    await setLanguage(item.code);
    if (item.code === 'pt-BR' || item.code === 'pt-PT' || item.code === 'en' || item.code === 'es' || item.code === 'fr') {
      setWebsiteLanguage(item.code);
    }
  };

  const handleNext = () => {
    // 0 = Boas-vindas/Idioma, 1 = Interesse, 2 = Segmento, 3 = Objetivo, 4 = Idioma Site, 5 = Customização, 6 = Resumo/Revisão
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Finaliza e envia dados para o motor de recomendação
      const answers: OnboardingAnswers = {
        interest,
        segment,
        objective,
        websiteLanguage,
        customization,
      };
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const segmentsOptions: { id: string; label: string; icon: string }[] = [
    { id: 'barber', label: t.segments.barber, icon: '💈' },
    { id: 'beauty', label: t.segments.beauty, icon: '💅' },
    { id: 'fitness', label: t.segments.fitness, icon: '🏋️' },
    { id: 'realEstate', label: t.segments.realEstate, icon: '🏢' },
    { id: 'clinic', label: t.segments.clinic, icon: '🩺' },
    { id: 'food', label: t.segments.food, icon: '🍽️' },
    { id: 'services', label: t.segments.services, icon: '💼' },
    { id: 'retail', label: t.segments.retail, icon: '🛍️' },
    { id: 'other', label: t.segments.other, icon: '🌐' },
  ];

  const getInterestTitle = (key: InterestOption): string => {
    switch (key) {
      case 'new_site': return t.onboarding.q1OptNewSite;
      case 'renew_site': return t.onboarding.q1OptRenewSite;
      case 'ecommerce': return t.onboarding.q1OptEcommerce;
      case 'landing_page': return t.onboarding.q1OptLandingPage;
      case 'not_sure': return t.onboarding.q1OptNotSure;
    }
  };

  const getObjectiveTitle = (key: ObjectiveOption): string => {
    switch (key) {
      case 'contacts': return t.onboarding.q3OptContacts;
      case 'company': return t.onboarding.q3OptCompany;
      case 'sell': return t.onboarding.q3OptSell;
      case 'services': return t.onboarding.q3OptServices;
      case 'brand': return t.onboarding.q3OptBrand;
      case 'presence': return t.onboarding.q3OptPresence;
      case 'not_sure': return t.onboarding.q3OptNotSure;
    }
  };

  const getCustomizationTitle = (key: CustomizationOption): string => {
    switch (key) {
      case 'simple': return t.onboarding.q5OptSimple;
      case 'complete': return t.onboarding.q5OptComplete;
      case 'custom': return t.onboarding.q5OptCustom;
      case 'need_help': return t.onboarding.q5OptNeedHelp;
    }
  };

  const getWebsiteLangTitle = (key: WebsiteLanguage): string => {
    switch (key) {
      case 'pt-BR': return t.project.langPtBr;
      case 'pt-PT': return t.project.langPtPt;
      case 'en': return t.project.langEn;
      case 'es': return t.project.langEs;
      case 'fr': return t.project.langFr;
      case 'pt-en': return t.project.langPtEn;
      case 'other': return t.project.langOther;
    }
  };

  const currentSegmentObj = segmentsOptions.find((s) => s.id === segment) || segmentsOptions[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && step > 0) onClose();
      }}
    >
      <div
        className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header do Onboarding */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-indigo-600/30">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm text-white flex items-center gap-1.5 leading-none">
                NexaWeb
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {t.header.official}
                </span>
              </span>
              {step > 0 && (
                <p className="text-[10px] text-cyan-400 font-semibold mt-0.5">
                  {step <= 5 ? `${step} ${t.onboarding.stepIndicator} 5` : t.onboarding.reviewStepTitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {t.onboarding.btnSkip}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label={t.portfolio.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar (para etapas 1 a 6) */}
        {step > 0 && (
          <div className="w-full h-1 bg-slate-800 shrink-0">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${Math.min(100, (step / 5) * 100)}%` }}
            />
          </div>
        )}

        {/* Corpo do Conteúdo com Hierarquia Responsiva */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* ETAPA 0: Bem-vindo + Escolha do Idioma */}
          {step === 0 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-center space-y-1.5 pt-1 pb-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-950">
                  <Globe2 className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {t.onboarding.welcomeTitle}
                </h2>
                <p className="text-xs text-slate-300">
                  {t.onboarding.welcomeSubtitle}
                </p>
                <p className="text-xs font-semibold text-cyan-400">
                  {t.onboarding.chooseLanguage}
                </p>
              </div>

              {/* Grid Responsiva de Idiomas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {languages.map((item) => {
                  const isSelected = language === item.code;
                  const isAvailable = item.available;

                  return (
                    <button
                      key={item.code}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleSelectLanguage(item)}
                      className={`min-h-[46px] flex items-center justify-between p-2.5 rounded-xl border text-left transition-all active:scale-[0.98] ${
                        !isAvailable
                          ? 'opacity-40 cursor-not-allowed bg-slate-950/40 border-slate-850'
                          : isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg shrink-0" role="img" aria-label={item.name}>
                          {item.flag}
                        </span>
                        <div className="min-w-0">
                          <span className="text-xs font-bold block text-white truncate">
                            {item.nativeName}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 ml-2">
                        {!isAvailable && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {t.onboarding.comingSoonBadge}
                          </span>
                        )}
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                {t.onboarding.chooseLanguageDesc}
              </p>
            </div>
          )}

          {/* ETAPA 1: O que você está procurando? */}
          {step === 1 && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {t.onboarding.q1Title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.onboarding.q1Subtitle}
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'new_site', title: t.onboarding.q1OptNewSite, desc: t.onboarding.q1OptNewSiteDesc },
                  { id: 'renew_site', title: t.onboarding.q1OptRenewSite, desc: t.onboarding.q1OptRenewSiteDesc },
                  { id: 'ecommerce', title: t.onboarding.q1OptEcommerce, desc: t.onboarding.q1OptEcommerceDesc },
                  { id: 'landing_page', title: t.onboarding.q1OptLandingPage, desc: t.onboarding.q1OptLandingPageDesc },
                  { id: 'not_sure', title: t.onboarding.q1OptNotSure, desc: t.onboarding.q1OptNotSureDesc },
                ].map((item) => {
                  const isSelected = interest === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setInterest(item.id as InterestOption)}
                      className={`min-h-[50px] w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold block text-white">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ETAPA 2: Segmento */}
          {step === 2 && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {t.onboarding.q2Title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.onboarding.q2Subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {segmentsOptions.map((item) => {
                  const isSelected = segment === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSegment(item.id)}
                      className={`min-h-[46px] flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">{item.icon}</span>
                        <span className="text-xs font-semibold block text-white truncate">
                          {item.label}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-1.5 ${
                          isSelected
                            ? 'bg-cyan-600 border-cyan-500 text-white'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ETAPA 3: Objetivo Principal */}
          {step === 3 && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {t.onboarding.q3Title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.onboarding.q3Subtitle}
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'contacts', label: t.onboarding.q3OptContacts },
                  { id: 'company', label: t.onboarding.q3OptCompany },
                  { id: 'sell', label: t.onboarding.q3OptSell },
                  { id: 'services', label: t.onboarding.q3OptServices },
                  { id: 'brand', label: t.onboarding.q3OptBrand },
                  { id: 'presence', label: t.onboarding.q3OptPresence },
                  { id: 'not_sure', label: t.onboarding.q3OptNotSure },
                ].map((item) => {
                  const isSelected = objective === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setObjective(item.id as ObjectiveOption)}
                      className={`min-h-[46px] w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-semibold block text-white pr-2">
                        {item.label}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ETAPA 4: Idioma do Site */}
          {step === 4 && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {t.onboarding.q4Title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.onboarding.q4Subtitle}
                </p>
                <div className="mt-2 p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-[11px] text-cyan-300 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  <span>{t.onboarding.q4Note}</span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'pt-BR', label: t.project.langPtBr },
                  { id: 'pt-PT', label: t.project.langPtPt },
                  { id: 'en', label: t.project.langEn },
                  { id: 'es', label: t.project.langEs },
                  { id: 'fr', label: t.project.langFr },
                  { id: 'pt-en', label: t.project.langPtEn },
                  { id: 'other', label: t.project.langOther },
                ].map((item) => {
                  const isSelected = websiteLanguage === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setWebsiteLanguage(item.id as WebsiteLanguage)}
                      className={`min-h-[46px] w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-semibold block text-white pr-2">
                        {item.label}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ETAPA 5: Nível de Personalização */}
          {step === 5 && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {t.onboarding.q5Title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.onboarding.q5Subtitle}
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'simple', title: t.onboarding.q5OptSimple, desc: t.onboarding.q5OptSimpleDesc },
                  { id: 'complete', title: t.onboarding.q5OptComplete, desc: t.onboarding.q5OptCompleteDesc },
                  { id: 'custom', title: t.onboarding.q5OptCustom, desc: t.onboarding.q5OptCustomDesc },
                  { id: 'need_help', title: t.onboarding.q5OptNeedHelp, desc: t.onboarding.q5OptNeedHelpDesc },
                ].map((item) => {
                  const isSelected = customization === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCustomization(item.id as CustomizationOption)}
                      className={`min-h-[50px] w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold block text-white">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ETAPA 6: Resumo Compacto antes de continuar (Requisito 6) */}
          {step === 6 && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {t.onboarding.reviewStepTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.onboarding.reviewStepSubtitle}
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                {/* 1. Interesse */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {t.recommendation.interestLabel}
                    </span>
                    <span className="text-xs font-semibold text-white block truncate">
                      {getInterestTitle(interest)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0"
                    title={t.onboarding.editStep}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{t.onboarding.editStep}</span>
                  </button>
                </div>

                {/* 2. Segmento */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {t.recommendation.segmentLabel}
                    </span>
                    <span className="text-xs font-semibold text-white block truncate">
                      {currentSegmentObj.icon} {currentSegmentObj.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0"
                    title={t.onboarding.editStep}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{t.onboarding.editStep}</span>
                  </button>
                </div>

                {/* 3. Objetivo */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {t.recommendation.objectiveLabel}
                    </span>
                    <span className="text-xs font-semibold text-white block truncate">
                      {getObjectiveTitle(objective)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0"
                    title={t.onboarding.editStep}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{t.onboarding.editStep}</span>
                  </button>
                </div>

                {/* 4. Idioma do site */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {t.recommendation.siteLanguageLabel}
                    </span>
                    <span className="text-xs font-semibold text-white block truncate">
                      {getWebsiteLangTitle(websiteLanguage)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0"
                    title={t.onboarding.editStep}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{t.onboarding.editStep}</span>
                  </button>
                </div>

                {/* 5. Estilo / Customização */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {t.recommendation.customizationLabel}
                    </span>
                    <span className="text-xs font-semibold text-white block truncate">
                      {getCustomizationTitle(customization)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0"
                    title={t.onboarding.editStep}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{t.onboarding.editStep}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer com botões de navegação */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="min-h-[44px] flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.onboarding.btnBack}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="min-h-[44px] flex-1 max-w-xs flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 transition-all active:scale-[0.98] ml-auto"
          >
            <span>{step === 6 ? t.onboarding.btnSeeRecommendation : t.onboarding.btnContinue}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
