import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { SegmentBriefingConfig } from '../../data/segmentBriefingSchemas';
import { BackButton } from '../BackButton';

interface Step4NeedsProps {
  segmentConfig: SegmentBriefingConfig;
  selectedPrimaryOptions: string[];
  togglePrimaryOption: (opt: string) => void;
  selectedSecondaryOptions: string[];
  toggleSecondaryOption: (opt: string) => void;
  selectedFeatures: string[];
  toggleFeature: (feat: string) => void;
  operatingSchedule: string;
  setOperatingSchedule: (val: string) => void;
  teamDescription: string;
  setTeamDescription: (val: string) => void;
  freeServicesText: string;
  setFreeServicesText: (val: string) => void;
  onNext: () => void;
  onPrev?: () => void;
}

export const Step4Needs: React.FC<Step4NeedsProps> = ({
  segmentConfig,
  selectedPrimaryOptions,
  togglePrimaryOption,
  selectedSecondaryOptions,
  toggleSecondaryOption,
  selectedFeatures,
  toggleFeature,
  operatingSchedule,
  setOperatingSchedule,
  teamDescription,
  setTeamDescription,
  freeServicesText,
  setFreeServicesText,
  onNext,
  onPrev,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Cabeçalho da Etapa 4 */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
            Escopo do Segmento
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {segmentConfig.name}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
          <span>{segmentConfig.icon}</span>
          <span>Conteúdo para {segmentConfig.name}</span>
        </h2>
        <p className="text-[11px] text-slate-400">
          {segmentConfig.tagline}
        </p>
      </div>

      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        {/* Opção Primária do Segmento */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
            1. {segmentConfig.primaryOptionsLabel}
          </label>
          <p className="text-[10.5px] text-slate-400">
            Selecione as opções que farão parte da estrutura do site:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {segmentConfig.primaryOptions.map((opt) => {
              const isChecked = selectedPrimaryOptions.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => togglePrimaryOption(opt)}
                  className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Opção Secundária do Segmento */}
        {segmentConfig.secondaryOptions.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <label className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
              2. {segmentConfig.secondaryOptionsLabel}
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {segmentConfig.secondaryOptions.map((opt) => {
                const isChecked = selectedSecondaryOptions.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleSecondaryOption(opt)}
                    className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
                      isChecked
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Diferenciais da Estrutura */}
        {segmentConfig.features.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <label className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
              3. {segmentConfig.featuresLabel}
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {segmentConfig.features.map((feat) => {
                const isChecked = selectedFeatures.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => toggleFeature(feat)}
                    className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
                      isChecked
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{feat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Horários & Atendimento */}
        <div className="pt-2 border-t border-slate-800/80">
          <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
            4. Horários de Funcionamento ou Atendimento (opcional)
          </label>
          <input
            type="text"
            value={operatingSchedule}
            onChange={(e) => setOperatingSchedule(e.target.value)}
            placeholder={segmentConfig.schedulePlaceholder}
            className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 scroll-mt-20"
          />
        </div>

        {/* Equipe / Profissionais */}
        <div>
          <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
            5. Equipe / Professores / Atendimento (opcional)
          </label>
          <input
            type="text"
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            placeholder={segmentConfig.teamPlaceholder}
            className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 scroll-mt-20"
          />
        </div>

        {/* Detalhes Adicionais dos Serviços */}
        <div>
          <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
            6. Detalhes Adicionais dos Serviços ou Produtos (opcional)
          </label>
          <textarea
            value={freeServicesText}
            onChange={(e) => setFreeServicesText(e.target.value)}
            rows={3}
            placeholder={segmentConfig.defaultServicesPlaceholder}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none scroll-mt-20"
          />
        </div>
      </div>

      {/* Ações de Navegação da Etapa 4 */}
      <div className="pt-0.5 pb-0.5 flex items-center justify-between gap-3 w-full">
        {onPrev ? (
          <BackButton
            onClick={onPrev}
            label="Voltar"
          />
        ) : (
          <div className="w-11 h-11 shrink-0" aria-hidden="true" />
        )}

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
