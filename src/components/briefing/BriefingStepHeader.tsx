import React from 'react';
import { BackButton } from '../BackButton';
import { BriefingStep, BRIEFING_STEP_NAMES } from './briefingTypes';
import { useTranslation } from '../../contexts/LanguageContext';

const BRIEFING_STEP_NAMES_EN: Record<BriefingStep, string> = {
  1: 'Type / Starting Point',
  2: 'Main Information',
  3: 'Industry / Niche',
  4: 'Requirements',
  5: 'Features',
  6: 'Visual Style',
  7: 'Content & Inspirations',
  8: 'Files',
  9: 'Summary & Submit',
};

interface BriefingStepHeaderProps {
  currentStep: BriefingStep;
  totalSteps?: number;
  planName: string;
  planPrice: string;
  canGoBack: boolean;
  onBackAction: () => void;
}

export const BriefingStepHeader: React.FC<BriefingStepHeaderProps> = ({
  currentStep,
  totalSteps = 9,
  planName,
  planPrice,
  canGoBack,
  onBackAction,
}) => {
  const { language } = useTranslation();
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));
  const stepName =
    language === 'en'
      ? BRIEFING_STEP_NAMES_EN[currentStep] || BRIEFING_STEP_NAMES[currentStep]
      : BRIEFING_STEP_NAMES[currentStep];

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 sm:p-3.5 shadow-sm space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {canGoBack && (
            <BackButton
              onClick={onBackAction}
              label={language === 'en' ? 'Exit to Home' : 'Sair para o início'}
              className="-ml-1 shrink-0"
            />
          )}

          <div className="min-w-0 flex flex-col justify-center">
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 w-fit">
              {language === 'en' ? `Step ${currentStep} of ${totalSteps}` : `Etapa ${currentStep} de ${totalSteps}`}
            </span>
            <span className="text-xs sm:text-[13px] font-bold text-white truncate mt-0.5">
              {stepName}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          {planPrice ? (
            <>
              <span className="text-[9.5px] font-mono text-slate-400 block uppercase">
                {language === 'en' ? `Plan ${planName}` : `Plano ${planName}`}
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {planPrice}
              </span>
            </>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">
              {language === 'en' ? 'No plan selected' : 'Sem plano selecionado'}
            </span>
          )}
        </div>
      </div>

      {/* Barra de Progresso Real */}
      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Indicador de passos informativo discreto (não duplicar botões de voltar) */}
      <div className="grid grid-cols-9 gap-1" aria-hidden="true">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
          <div
            key={stepNum}
            className={`h-1.5 rounded-full transition-colors ${
              stepNum === currentStep
                ? 'bg-cyan-400 shadow-sm'
                : stepNum < currentStep
                ? 'bg-indigo-600'
                : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
