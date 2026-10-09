import React from 'react';
import { ChevronRight, Info } from 'lucide-react';
import { ImageUploadField } from '../ImageUploadField';
import { BackButton } from '../BackButton';
import { useTranslation } from '../../contexts/LanguageContext';

interface Step8FilesProps {
  attachedFiles: File[];
  setAttachedFiles: (files: File[]) => void;
  planName: string;
  onNext: () => void;
  onPrev?: () => void;
}

export const Step8Files: React.FC<Step8FilesProps> = ({
  attachedFiles,
  setAttachedFiles,
  planName,
  onNext,
  onPrev,
}) => {
  const { t } = useTranslation();

  const filesCountText = t.briefing.step8.filesCount.replace('{count}', String(attachedFiles.length));

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Cabeçalho da Etapa 8 */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
            {t.briefing.step8.badge}
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {t.briefing.planPrefix} {planName}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-extrabold text-white">
          {t.briefing.step8.title}
        </h2>
        <p className="text-[11px] text-slate-400">
          {t.briefing.step8.subtitle}
        </p>
      </div>

      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        {/* Upload de Imagens */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
              {t.briefing.step8.filesLabel}
            </label>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">
              {filesCountText}
            </span>
          </div>

          <ImageUploadField
            files={attachedFiles}
            onChange={setAttachedFiles}
            maxFiles={6}
          />
        </div>

        {/* Dica Informativa */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{t.briefing.step8.noPhotosHintTitle}</span>
          </div>
          <p className="leading-relaxed pl-5 text-[10.5px]">
            {t.briefing.step8.noPhotosHintDesc}
          </p>
        </div>
      </div>

      {/* Ações de Navegação da Etapa 8 */}
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
