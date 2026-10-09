import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { getCanonicalSegments, SegmentBriefingConfig } from '../../data/segmentBriefingSchemas';
import { BackButton } from '../BackButton';
import { useTranslation } from '../../contexts/LanguageContext';

interface Step3SegmentProps {
  selectedSegment: string;
  onSelectSegment: (segmentKey: string) => void;
  segmentConfig: SegmentBriefingConfig;
  onNext: () => void;
  onPrev?: () => void;
  highlightedFieldId?: string | null;
  onClearError?: () => void;
}

export const Step3Segment: React.FC<Step3SegmentProps> = ({
  selectedSegment,
  onSelectSegment,
  segmentConfig,
  onNext,
  onPrev,
  highlightedFieldId,
  onClearError,
}) => {
  const { t, language } = useTranslation();
  const canonicalSegments = getCanonicalSegments(language);

  const activeSegmentName = selectedSegment
    ? canonicalSegments[selectedSegment]?.name || segmentConfig.name
    : t.briefing.step3.toSelect;

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Cabeçalho da Etapa 3 */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
            {t.briefing.step3.badge}
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {activeSegmentName}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-extrabold text-white">
          {t.briefing.step3.title}
        </h2>
        <p className="text-[11px] text-slate-400">
          {t.briefing.step3.subtitle}
        </p>
      </div>

      {/* Grid Compacta de Segmentos */}
      <div
        id="briefing-field-segment-grid"
        className={`rounded-2xl p-4 sm:p-5 bg-slate-900 border space-y-3 shadow-sm transition-all duration-300 ${
          highlightedFieldId === 'briefing-field-segment-grid'
            ? 'border-rose-500 ring-2 ring-rose-500/70'
            : 'border-slate-800'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.values(canonicalSegments).map((seg) => {
            const isSelected = selectedSegment === seg.segmentKey;
            return (
              <button
                key={seg.segmentKey}
                type="button"
                onClick={() => {
                  onSelectSegment(seg.segmentKey);
                  onClearError?.();
                }}
                className={`min-h-[48px] p-2.5 rounded-xl border text-left transition-all active:scale-[0.99] flex items-center justify-between gap-2.5 cursor-pointer ${
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

      {/* Ações de Navegação da Etapa 3 */}
      <div className="pt-0.5 pb-0.5 flex items-center justify-between gap-3 w-full">
        {onPrev ? (
          <BackButton
            onClick={onPrev}
            label={t.briefing.back}
          />
        ) : (
          <div className="w-11 h-11 shrink-0" aria-hidden="true" />
        )}

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
