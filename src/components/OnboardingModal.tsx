import React, { useState, useEffect } from 'react';
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
  ArrowLeft,
  Check,
  Rocket,
  RefreshCw,
  Layout,
  MessageSquare,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
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

    window.history.pushState({ onboardingOpen: true }, '');
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('popstate', handlePopState);
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
  const interestOptions: { id: InterestOption; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'new_site',
      title: 'Criar um site novo',
      subtitle: 'Lançar um site exclusivo para o meu negócio',
      icon: <Rocket className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'renew_site',
      title: 'Modernizar site existente',
      subtitle: 'Melhorar layout, velocidade e presença online',
      icon: <RefreshCw className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'landing_page',
      title: 'Página rápida ou catálogo',
      subtitle: 'Foco direto em conversão ou apresentação de serviços',
      icon: <Layout className="w-4 h-4 text-emerald-400" />,
    },
  ];

  // Opções da Etapa 2
  const segmentOptions: { id: string; label: string; icon: string }[] = [
    { id: 'barber', label: 'Barbearia & Salão', icon: '💈' },
    { id: 'beauty', label: 'Estética & Beleza', icon: '💅' },
    { id: 'clinic', label: 'Saúde & Clínica', icon: '🩺' },
    { id: 'food', label: 'Gastronomia', icon: '🍽️' },
    { id: 'realEstate', label: 'Imobiliária', icon: '🏢' },
    { id: 'fitness', label: 'Academia & Fitness', icon: '🏋️' },
    { id: 'services', label: 'Serviços & Consultoria', icon: '💼' },
    { id: 'retail', label: 'Comércio & Loja', icon: '🛍️' },
    { id: 'other', label: 'Outro Segmento', icon: '🌐' },
  ];

  // Opções da Etapa 3
  const objectiveOptions: { id: ObjectiveOption; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'contacts',
      title: 'Atrair clientes & Contatos',
      subtitle: 'Receber contatos diretos, ligações e agendamentos',
      icon: <MessageSquare className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'company',
      title: 'Apresentação & Credibilidade',
      subtitle: 'Transmitir autoridade, catálogo de serviços e história',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'sell',
      title: 'Catálogo ou venda online',
      subtitle: 'Vitrine digital com produtos, fotos, valores e pedidos',
      icon: <ShoppingBag className="w-4 h-4 text-amber-400" />,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full sm:max-w-lg max-h-[92vh] sm:max-h-[86vh] bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header do Onboarding */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 shrink-0">
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
            aria-label="Pular introdução e entrar no aplicativo"
          >
            Pular
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
                  ? 'animate-in fade-in slide-in-from-right-4 duration-200'
                  : 'animate-in fade-in slide-in-from-left-4 duration-200'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Primeiro Acesso
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  O que você busca criar hoje?
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Selecione seu ponto de partida para direcionarmos o melhor formato:
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
                  ? 'animate-in fade-in slide-in-from-right-4 duration-200'
                  : 'animate-in fade-in slide-in-from-left-4 duration-200'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Ramo de Atuação
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Qual é o seu segmento?
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Adaptamos layouts, recursos e demonstrações ao seu nicho:
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {segmentOptions.map((seg) => {
                  const isSelected = segment === seg.id;
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setSegment(seg.id)}
                      className={`min-h-[52px] p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'bg-indigo-950/50 border-cyan-500/80 ring-1 ring-cyan-500/40 text-white shadow-sm'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <span className="text-lg shrink-0" role="img" aria-label={seg.label}>
                        {seg.icon}
                      </span>
                      <span className="text-xs font-semibold leading-tight line-clamp-2 flex-1">
                        {seg.label}
                      </span>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                      )}
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
                  ? 'animate-in fade-in slide-in-from-right-4 duration-200'
                  : 'animate-in fade-in slide-in-from-left-4 duration-200'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Objetivo Estratégico
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Qual o foco principal do site?
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Isso define as funcionalidades essenciais e o formato da página:
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
        </div>

        {/* Footer com Botões por Etapa */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
          {/* Botão "Voltar": Só aparece a partir da etapa 2 */}
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-850 hover:bg-slate-800 active:scale-[0.98] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <div />
          )}

          {/* Botão Principal: "Próximo" nas etapas 1 e 2 | "Começar a usar" na etapa 3 */}
          <button
            type="button"
            onClick={handleNext}
            className={`min-h-[48px] flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-950/50 transition-all ${
              step === 1 ? 'w-full' : 'flex-1 max-w-xs ml-auto'
            }`}
          >
            <span>{step === 3 ? 'Começar a usar' : 'Próximo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
