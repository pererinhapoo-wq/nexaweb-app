import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { VISUAL_STYLES } from './briefingTypes';

interface Step6VisualProps {
  visualStyle: string;
  setVisualStyle: (val: string) => void;
  colorMode: 'suggest' | 'brand' | 'custom' | '';
  setColorMode: (val: 'suggest' | 'brand' | 'custom') => void;
  customColorDetails: string;
  setCustomColorDetails: (val: string) => void;
  planName: string;
  onNext: () => void;
}

export const Step6Visual: React.FC<Step6VisualProps> = ({
  visualStyle,
  setVisualStyle,
  colorMode,
  setColorMode,
  customColorDetails,
  setCustomColorDetails,
  planName,
  onNext,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Cabeçalho da Etapa 6 */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
            Identidade Visual & Cores
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            Plano {planName}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-extrabold text-white">
          Estética & Personalidade Visual
        </h2>
        <p className="text-[11px] text-slate-400">
          Escolha o estilo e a paleta de cores que melhor traduzem sua marca.
        </p>
      </div>

      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        {/* 1. Estilo Visual do Site (5 estilos canônicos) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
            1. Estilo Visual Desejado
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {VISUAL_STYLES.map((st) => {
              const isChecked = visualStyle === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setVisualStyle(st.id)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.99] flex flex-col justify-between ${
                    isChecked
                      ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{st.label}</span>
                    {isChecked && (
                      <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    {st.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Cores & Identidade Visual */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <label className="text-[11px] font-bold text-white uppercase tracking-wider block">
            2. Paleta de Cores
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setColorMode('suggest')}
              className={`min-h-[46px] p-2.5 rounded-xl border text-left text-xs transition-all ${
                colorMode === 'suggest'
                  ? 'bg-cyan-950/40 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span className="block font-bold">Sugestão NexaWeb</span>
              <span className="block text-[10px] text-slate-500">Harmonia para o segmento</span>
            </button>

            <button
              type="button"
              onClick={() => setColorMode('brand')}
              className={`min-h-[46px] p-2.5 rounded-xl border text-left text-xs transition-all ${
                colorMode === 'brand'
                  ? 'bg-indigo-950/40 border-indigo-500 text-white font-bold ring-1 ring-indigo-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span className="block font-bold">Minhas Cores</span>
              <span className="block text-[10px] text-slate-500">Identidade existente</span>
            </button>

            <button
              type="button"
              onClick={() => setColorMode('custom')}
              className={`min-h-[46px] p-2.5 rounded-xl border text-left text-xs transition-all ${
                colorMode === 'custom'
                  ? 'bg-purple-950/40 border-purple-500 text-white font-bold ring-1 ring-purple-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span className="block font-bold">Tons Específicos</span>
              <span className="block text-[10px] text-slate-500">Sob medida</span>
            </button>
          </div>

          {Boolean(colorMode && colorMode !== 'suggest') && (
            <input
              type="text"
              value={customColorDetails}
              onChange={(e) => setCustomColorDetails(e.target.value)}
              placeholder="Ex: Azul marinho, dourado e branco..."
              className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 mt-1 scroll-mt-20"
            />
          )}
        </div>
      </div>

      {/* Ação Principal */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>Avançar para Conteúdo & Inspirações</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
