import React from 'react';
import { BriefingStep, getBriefingStepNames } from './briefingTypes';
import { useTranslation } from '../../contexts/LanguageContext';

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
}) => {
  const { language, t } = useTranslation();
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));
  const stepNames = getBriefingStepNames(language);
  const stepName = stepNames[currentStep];

  const stepIndicatorText = t.briefing.stepIndicator
    .replace('{current}', String(currentStep))
    .replace('{total}', String(totalSteps));

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 sm:p-3.5 shadow-sm space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex flex-col justify-center">
          <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 w-fit">
            {stepIndicatorText}
          </span>
          <span className="text-xs sm:text-[13px] font-bold text-white truncate mt-0.5">
            {stepName}
          </span>
        </div>

        <div className="text-right shrink-0">
          {planPrice ? (
            <>
              <span className="text-[9.5px] font-mono text-slate-400 block uppercase">
                {t.briefing.planPrefix} {planName}
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {planPrice}
              </span>
            </>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">
              {t.briefing.noPlanSelected}
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

      {/* Indicador de passos informativo discreto */}
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
