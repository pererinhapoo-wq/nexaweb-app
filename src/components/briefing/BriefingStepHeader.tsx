import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { BriefingStep, BRIEFING_STEP_NAMES } from './briefingTypes';

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
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {canGoBack && (
            <button
              type="button"
              onClick={onBackAction}
              className="min-h-[44px] min-w-[44px] -ml-1 rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
              aria-label="Voltar para a etapa anterior"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>
          )}

          <div className="min-w-0 flex flex-col">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 w-fit">
              Etapa {currentStep} de {totalSteps}
            </span>
            <span className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
              {BRIEFING_STEP_NAMES[currentStep]}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">
            Plano {planName}
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {planPrice}
          </span>
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
