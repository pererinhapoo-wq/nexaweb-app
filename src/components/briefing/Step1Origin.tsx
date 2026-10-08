import React, { useState } from 'react';
import { Lightbulb, Layers, Check, ChevronRight } from 'lucide-react';
import { NexawebPlan } from '../../data/servicesData';

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
}) => {
  const [showPlanGrid, setShowPlanGrid] = useState<boolean>(!hasInitialPlan);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {hasSavedData && onResetBriefing && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Existe um rascunho em andamento para este plano.</span>
          <button
            type="button"
            onClick={onResetBriefing}
            className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors"
          >
            Começar novo do zero
          </button>
        </div>
      )}

      {/* Cabeçalho da Etapa 1 */}
      <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
          Como você deseja começar seu site?
        </h2>
        <p className="text-xs text-slate-300">
          Escolha uma das 2 opções simples para dar início ao seu projeto:
        </p>
      </div>

      {/* 2 Opções de Entrada Canônicas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Opção 1: Ideia própria / Sob medida */}
        <button
          type="button"
          onClick={() => setStartMode('propria')}
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
              1. Ideia própria / Sob medida
            </span>
            <span className="text-[10.5px] text-slate-400 leading-tight block mt-0.5">
              Projeto criado do seu jeito
            </span>
          </div>
        </button>

        {/* Opção 2: Escolher direto um Plano */}
        <button
          type="button"
          onClick={() => {
            setStartMode('plano');
            setShowPlanGrid(true);
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
              2. Escolher direto um Plano
            </span>
            <span className="text-[10.5px] text-slate-400 leading-tight block mt-0.5">
              Conhecer os 4 planos oficiais
            </span>
          </div>
        </button>
      </div>

      {/* Conteúdo Contextual de Cada Modo */}
      {startMode === 'propria' && (
        <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-2 shadow-sm animate-in fade-in duration-150">
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
            Projeto Sob Medida
          </span>
          <p className="text-xs text-white font-bold">
            Vamos estruturar seu site exclusivo passo a passo.
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Nas próximas etapas, você definirá o nome do seu negócio, objetivo principal, segmento e todas as funcionalidades necessárias.
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
                    Plano Selecionado
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-white">
                    Plano {activePlanObj.nome}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  {activePlanObj.preco}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {activePlanObj.descricao} · Prazo previsto: {activePlanObj.prazo}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10.5px] text-slate-400">
                  Deseja mudar o plano escolhido?
                </span>
                <button
                  type="button"
                  onClick={() => setShowPlanGrid(true)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold underline"
                >
                  Alterar plano
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-white">
                  Selecione um dos 4 Planos Oficiais
                </span>
                {hasInitialPlan && (
                  <button
                    type="button"
                    onClick={() => setShowPlanGrid(false)}
                    className="text-[10.5px] text-slate-400 hover:text-cyan-300 underline"
                  >
                    Recolher
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plans.map((p) => {
                  const isSelected = selectedPlan === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.985] flex flex-col justify-between ${
                        isSelected
                          ? 'bg-indigo-600/20 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black uppercase tracking-wider text-white">
                            Plano {p.nome}
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
          <span>Avançar</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 -mr-0.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
