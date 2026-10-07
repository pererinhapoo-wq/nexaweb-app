import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { CANONICAL_SEGMENTS, SegmentBriefingConfig } from '../../data/segmentBriefingSchemas';

interface Step3SegmentProps {
  selectedSegment: string;
  onSelectSegment: (segmentKey: string) => void;
  segmentConfig: SegmentBriefingConfig;
  onNext: () => void;
}

export const Step3Segment: React.FC<Step3SegmentProps> = ({
  selectedSegment,
  onSelectSegment,
  segmentConfig,
  onNext,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Cabeçalho da Etapa 3 */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
            Segmento de Atuação
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {selectedSegment ? segmentConfig.name : 'A selecionar'}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-extrabold text-white">
          Qual é o segmento principal do seu negócio?
        </h2>
        <p className="text-[11px] text-slate-400">
          Personalizamos a estrutura, serviços sugeridos e opções do site com base no seu nicho.
        </p>
      </div>

      {/* Grid Compacta de Segmentos */}
      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.values(CANONICAL_SEGMENTS).map((seg) => {
            const isSelected = selectedSegment === seg.segmentKey;
            return (
              <button
                key={seg.segmentKey}
                type="button"
                onClick={() => onSelectSegment(seg.segmentKey)}
                className={`min-h-[48px] p-2.5 rounded-xl border text-left transition-all active:scale-[0.99] flex items-center justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-indigo-950/70 border-cyan-500/80 ring-1 ring-cyan-500/30 text-white shadow-sm'
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

                {/* Nome do segmento */}
                <div className="flex-1 min-w-0 pr-1">
                  <span className="text-xs font-semibold block leading-tight text-slate-200 line-clamp-1">
                    {seg.name}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight block line-clamp-1 mt-0.5">
                    {seg.tagline}
                  </span>
                </div>

                {/* Controle de seleção discreto */}
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

      {/* Ação Principal */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>Avançar para Necessidades</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
