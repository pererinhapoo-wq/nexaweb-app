import React, { useState } from 'react';
import { Lightbulb, Layers, Check, ChevronRight } from 'lucide-react';
import { NexawebPlan } from '../../data/servicesData';
import { useTranslation } from '../../contexts/LanguageContext';

interface Step1OriginProps {
  startMode: 'propria' | 'plano' | null;
  setStartMode: (mode: 'propria' | 'plano') => void;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  activePlanObj: NexawebPlan;
  plans: NexawebPlan[];
  hasInitialPlan: boolean;
  hasSavedData?: boolean;
  onResetBriefing?: () => void;
  onNext: () => void;
  highlightedFieldId?: string | null;
  onClearError?: () => void;
}

export const Step1Origin: React.FC<Step1OriginProps> = ({
  startMode,
  setStartMode,
  selectedPlan,
  setSelectedPlan,
  activePlanObj,
  plans,
  hasInitialPlan,
  hasSavedData,
  onResetBriefing,
  onNext,
  highlightedFieldId,
  onClearError,
}) => {
  const { t } = useTranslation();
  const [showPlanGrid, setShowPlanGrid] = useState<boolean>(!hasInitialPlan);

  const collapseLabel = 'Recolher';
  const changePlanQuestion = 'Deseja mudar o plano escolhido?';
  const customStepHeading = 'Vamos estruturar seu site exclusivo passo a passo.';
  const customStepSub = 'Nas próximas etapas, você definirá o nome do seu negócio, objetivo principal, segmento e todas as funcionalidades necessárias.';

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {hasSavedData && onResetBriefing && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">{t.briefing.draftNotice}</span>
          <button
            type="button"
            onClick={onResetBriefing}
            className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors cursor-pointer"
          >
            {t.briefing.startNewFromScratch}
          </button>
        </div>
      )}

      {/* Cabeçalho da Etapa 1 */}
      <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
          {t.briefing.step1.title}
        </h2>
        <p className="text-xs text-slate-300">
          {t.briefing.step1.subtitle}
        </p>
      </div>

      {/* 2 Opções de Entrada Canônicas */}
      <div
        id="briefing-field-origin-options"
        className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-2xl p-0.5 transition-all duration-300 ${
          highlightedFieldId === 'briefing-field-origin-options'
            ? 'ring-2 ring-rose-500/70'
            : ''
        }`}
      >
        {/* Opção 1: Ideia própria / Sob medida */}
        <button
          type="button"
          onClick={() => {
            setStartMode('propria');
            onClearError?.();
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[92px] active:scale-[0.98] cursor-pointer ${
            startMode === 'propria'
              ? 'bg-indigo-600/20 border-cyan-500 text-white shadow-md ring-1 ring-cyan-500/40'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-4 h-4" />
            </div>
            {startMode === 'propria' && (
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              {t.briefing.step1.optCustomTitle}
            </span>
            <span className="text-[10.5px] text-slate-400 leading-tight block mt-0.5">
              {t.briefing.step1.optCustomDesc}
            </span>
          </div>
        </button>

        {/* Opção 2: Escolher direto um Plano */}
        <button
          type="button"
          onClick={() => {
            setStartMode('plano');
            setShowPlanGrid(true);
            onClearError?.();
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[92px] active:scale-[0.98] cursor-pointer ${
            startMode === 'plano'
              ? 'bg-indigo-600/20 border-cyan-500 text-white shadow-md ring-1 ring-cyan-500/40'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            {startMode === 'plano' && (
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              {t.briefing.step1.optPlanTitle}
            </span>
            <span className="text-[10.5px] text-slate-400 leading-tight block mt-0.5">
              {t.briefing.step1.optPlanDesc}
            </span>
          </div>
        </button>
      </div>

      {/* Conteúdo Contextual de Cada Modo */}
      {startMode === 'propria' && (
        <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-2 shadow-sm animate-in fade-in duration-150">
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
            {t.services.customBadge}
          </span>
          <p className="text-xs text-white font-bold">
            {customStepHeading}
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {customStepSub}
          </p>
        </div>
      )}

      {startMode === 'plano' && (
        <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-3 shadow-sm animate-in fade-in duration-150">
          {hasInitialPlan && selectedPlan && !showPlanGrid ? (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                    {t.briefing.step1.selectedPlanBadge}
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-white">
                    {t.briefing.planPrefix} {activePlanObj.nome}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  {activePlanObj.preco}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {activePlanObj.descricao} · {t.services.estimatedTimeline}: {activePlanObj.prazo}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10.5px] text-slate-400">
                  {changePlanQuestion}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPlanGrid(true)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold underline cursor-pointer"
                >
                  {t.briefing.step1.changePlan}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-white">
                  {t.briefing.step1.choosePlanTitle}
                </span>
                {hasInitialPlan && (
                  <button
                    type="button"
                    onClick={() => setShowPlanGrid(false)}
                    className="text-[10.5px] text-slate-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    {collapseLabel}
                  </button>
                )}
              </div>

              <div
                id="briefing-field-plan-grid"
                className={`grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl p-0.5 transition-all duration-300 ${
                  highlightedFieldId === 'briefing-field-plan-grid'
                    ? 'ring-2 ring-rose-500/70'
                    : ''
                }`}
              >
                {plans.map((p) => {
                  const isSelected = selectedPlan === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPlan(p.id);
                        onClearError?.();
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.985] flex flex-col justify-between ${
                        isSelected
                          ? 'bg-indigo-600/20 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black uppercase tracking-wider text-white">
                            {t.briefing.planPrefix} {p.nome}
                          </span>
                          <span className="text-xs font-mono font-black text-cyan-300">
                            {p.preco}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-300 line-clamp-1 mb-1.5">
                          {p.tagline}
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10.5px]">
                        <span className="text-slate-400 text-[10px]">{p.prazo}</span>
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-2 h-2 stroke-[3]" />}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ação Principal da Etapa 1 */}
      <div className="pt-0.5 pb-0.5 flex items-center justify-end w-full">
        <button
          type="button"
          onClick={onNext}
          className="min-h-[44px] h-11 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-xs shadow-sm shadow-indigo-950/30 border border-indigo-400/20 inline-flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer shrink-0 ml-auto"
        >
          <span>{t.briefing.continue}</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 -mr-0.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
