import React, { useState } from 'react';
import { Layout, Lightbulb, Layers, Check, ChevronRight, ExternalLink } from 'lucide-react';
import { PortfolioProject } from '../../types';
import { NexawebPlan } from '../../data/servicesData';

interface Step1OriginProps {
  startMode: 'amostra' | 'propria' | 'plano';
  setStartMode: (mode: 'amostra' | 'propria' | 'plano') => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  modelApproach: 'exact' | 'inspiration';
  setModelApproach: (approach: 'exact' | 'inspiration') => void;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  activePlanObj: NexawebPlan;
  plans: NexawebPlan[];
  filteredDemos: PortfolioProject[];
  sampleFilter: string;
  setSampleFilter: (cat: string) => void;
  selectedProjectObj: PortfolioProject | null;
  handleSelectDemo: (proj: PortfolioProject) => void;
  hasInitialPlan: boolean;
  hasSavedData?: boolean;
  onResetBriefing?: () => void;
  onNext: () => void;
}

export const Step1Origin: React.FC<Step1OriginProps> = ({
  startMode,
  setStartMode,
  selectedModel,
  modelApproach,
  setModelApproach,
  selectedPlan,
  setSelectedPlan,
  activePlanObj,
  plans,
  filteredDemos,
  sampleFilter,
  setSampleFilter,
  selectedProjectObj,
  handleSelectDemo,
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
          Escolha uma das 3 opções simples para dar início ao seu projeto:
        </p>
      </div>

      {/* 3 Opções de Entrada Canônicas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Opção 1: Amostra */}
        <button
          type="button"
          onClick={() => setStartMode('amostra')}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[92px] active:scale-[0.98] ${
            startMode === 'amostra'
              ? 'bg-indigo-600/20 border-cyan-500 text-white shadow-md ring-1 ring-cyan-500/40'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-cyan-400">
              <Layout className="w-4 h-4" />
            </div>
            {startMode === 'amostra' && (
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              1. A partir de uma amostra
            </span>
            <span className="text-[10.5px] text-slate-400 leading-tight block mt-0.5">
              Demonstrações reais publicadas
            </span>
          </div>
        </button>

        {/* Opção 2: Ideia própria / Sob medida */}
        <button
          type="button"
          onClick={() => setStartMode('propria')}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[92px] active:scale-[0.98] ${
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
              2. Ideia própria / Sob medida
            </span>
            <span className="text-[10.5px] text-slate-400 leading-tight block mt-0.5">
              Projeto criado do seu jeito
            </span>
          </div>
        </button>

        {/* Opção 3: Escolher direto um Plano */}
        <button
          type="button"
          onClick={() => {
            setStartMode('plano');
            setShowPlanGrid(true);
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[92px] active:scale-[0.98] ${
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
              3. Escolher direto um Plano
            </span>
            <span className="text-[10.5px] text-slate-400 leading-tight block mt-0.5">
              Conhecer os 4 planos oficiais
            </span>
          </div>
        </button>
      </div>

      {/* Conteúdo Contextual de Cada Modo */}
      {startMode === 'amostra' && (
        <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm">
          {selectedProjectObj ? (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                    Amostra Selecionada
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-white">
                    {selectedProjectObj.titulo}
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  Plano {selectedProjectObj.planoId}
                </span>
              </div>

              <p className="text-[11px] text-slate-300">
                {selectedProjectObj.descricaoCurta}
              </p>

              {/* Abordagem desejada */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Como você deseja utilizar este modelo?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setModelApproach('exact')}
                    className={`min-h-[44px] p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      modelApproach === 'exact'
                        ? 'bg-cyan-950/50 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>Quero exatamente este formato</span>
                    {modelApproach === 'exact' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setModelApproach('inspiration')}
                    className={`min-h-[44px] p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      modelApproach === 'inspiration'
                        ? 'bg-indigo-950/50 border-indigo-500 text-white font-bold ring-1 ring-indigo-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>Usar como inspiração sob medida</span>
                    {modelApproach === 'inspiration' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-white">
                  Selecione uma Demonstração Publicada
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {filteredDemos.length} modelos
                </span>
              </div>

              {/* Filtros rápidos por nicho */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'fitness', label: 'Academia' },
                  { id: 'gastronomia', label: 'Restaurante' },
                  { id: 'clinica', label: 'Clínica' },
                  { id: 'imobiliaria', label: 'Imobiliária' },
                  { id: 'loja', label: 'Loja' },
                  { id: 'barbearia', label: 'Barbearia' },
                  { id: 'beleza', label: 'Salão' },
                  { id: 'engenharia', label: 'Engenharia' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSampleFilter(cat.id)}
                    className={`min-h-[34px] px-2.5 py-1 rounded-lg text-[10.5px] font-semibold whitespace-nowrap transition-colors ${
                      sampleFilter === cat.id
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid de Demonstrações Reais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto no-scrollbar pr-0.5">
                {filteredDemos.map((proj) => {
                  const isSelected = selectedModel === proj.titulo;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectDemo(proj)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between active:scale-[0.98] ${
                        isSelected
                          ? 'bg-indigo-600/20 border-cyan-500 ring-1 ring-cyan-500/40 shadow-sm'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase bg-slate-800 text-slate-300">
                            Plano {proj.planoId}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">
                          {proj.titulo}
                        </h4>
                        <p className="text-[10.5px] text-slate-400 line-clamp-1 mt-0.5">
                          {proj.descricaoCurta}
                        </p>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10.5px]">
                        <span className="text-cyan-300 font-medium truncate">
                          {proj.segmentoAlvo.split(',')[0]}
                        </span>
                        <a
                          href={proj.linkDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 shrink-0 ml-1 underline"
                        >
                          <span>Ver demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {startMode === 'propria' && (
        <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-2 shadow-sm">
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
        <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
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
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="min-h-[48px] w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>Continuar para Informações</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
