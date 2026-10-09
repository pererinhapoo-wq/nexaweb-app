import React from 'react';
import { Check, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { AdvancedFeatureGroup, AdvancedFeatureItem } from '../../data/advancedFeaturesData';
import { BackButton } from '../BackButton';
import { useTranslation } from '../../contexts/LanguageContext';

interface Step5FeaturesProps {
  planName: string;
  advancedFeaturesLimit: number;
  selectedAdvancedFeatures: string[];
  groupedAdvancedFeatures: AdvancedFeatureGroup[];
  featureLimitMessage: string | null;
  handleToggleAdvancedFeature: (feature: AdvancedFeatureItem) => void;
  onNext: () => void;
  onPrev?: () => void;
}

export const Step5Features: React.FC<Step5FeaturesProps> = ({
  planName,
  advancedFeaturesLimit,
  selectedAdvancedFeatures,
  groupedAdvancedFeatures,
  featureLimitMessage,
  handleToggleAdvancedFeature,
  onNext,
  onPrev,
}) => {
  const { t, language } = useTranslation();

  const optionsSuffix = language === 'en' ? 'options' : language === 'es' ? 'opciones' : language === 'fr' ? 'options' : 'opções';
  const optionSuffix = language === 'en' ? 'option' : language === 'es' ? 'opción' : language === 'fr' ? 'option' : 'opção';
  const availabilityNotice = language === 'en'
    ? 'Availability subject to technical feasibility analysis of the project.'
    : language === 'es'
    ? 'Disponibilidad según análisis de viabilidad técnica del proyecto.'
    : language === 'fr'
    ? 'Disponibilité soumise à l’analyse de faisabilité technique du projet.'
    : 'Disponibilidade conforme análise de viabilidade do projeto.';

  const countText = t.briefing.step5.selectedCount
    .replace('{count}', String(selectedAdvancedFeatures.length))
    .replace('{limit}', String(advancedFeaturesLimit));

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Cabeçalho da Etapa 5 */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
            {t.briefing.step5.badge}
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {t.briefing.planPrefix} {planName}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-extrabold text-white">
          {t.briefing.step5.title}
        </h2>
        <p className="text-[11px] text-slate-400">
          {t.briefing.step5.subtitle}
        </p>
      </div>

      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-3.5 shadow-sm">
        {/* Header com Contador Oficial */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-2 border-b border-slate-800/80">
          <div>
            <span className="text-xs font-bold text-white block">
              {t.briefing.step5.selectionTitle}
            </span>
            <span className="text-[10.5px] text-slate-400">
              {t.briefing.step5.limitForPlan} {planName}
            </span>
          </div>

          {/* Contador Oficial */}
          <div className="self-start sm:self-auto">
            <div
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-colors ${
                advancedFeaturesLimit === 0
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  : selectedAdvancedFeatures.length >= advancedFeaturesLimit
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'bg-slate-950 text-cyan-400 border-slate-800'
              }`}
            >
              <span>{countText}</span>
            </div>
          </div>
        </div>

        {/* Aviso para o Plano Essencial */}
        {advancedFeaturesLimit === 0 && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 text-[11px] text-blue-300 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-blue-400" />
              <span>{t.briefing.step5.essentialAlertTitle}</span>
            </p>
            <p className="text-slate-300 leading-relaxed pl-5.5">
              {t.briefing.step5.essentialAlertDesc}
            </p>
          </div>
        )}

        {/* Alerta Discreto de Limite Atingido */}
        {featureLimitMessage && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="leading-tight">{featureLimitMessage}</span>
          </div>
        )}

        {/* Categorias Dinâmicas Filtradas para o Segmento */}
        <div className="space-y-3 pt-1">
          {groupedAdvancedFeatures.map(({ category, items }) => (
            <div
              key={category}
              className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>{category}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {items.length} {items.length === 1 ? optionSuffix : optionsSuffix}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((feat) => {
                  const isChecked = selectedAdvancedFeatures.includes(feat.id);
                  const isLimitReached =
                    !isChecked &&
                    (advancedFeaturesLimit === 0 ||
                      selectedAdvancedFeatures.length >= advancedFeaturesLimit);

                  return (
                    <div
                      key={feat.id}
                      onClick={() => handleToggleAdvancedFeature(feat)}
                      className={`p-2.5 rounded-xl border text-left transition-all active:scale-[0.99] flex flex-col justify-between ${
                        isChecked
                          ? 'cursor-pointer bg-cyan-500/15 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/30'
                          : isLimitReached
                          ? 'cursor-not-allowed bg-slate-950/50 border-slate-850 opacity-65 hover:opacity-85'
                          : 'cursor-pointer bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1.5 mb-1">
                          <span className="text-xs font-bold leading-snug">
                            {feat.nome}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isChecked
                                ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                                : 'border-slate-700'
                            }`}
                          >
                            {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                        </div>

                        <p className="text-[10.5px] text-slate-400 leading-snug">
                          {feat.descricao}
                        </p>
                      </div>

                      {/* Tag Oficial de Complexidade */}
                      {feat.isComplex && (
                        <div className="pt-2 mt-1.5 border-t border-slate-800/50 flex flex-col gap-0.5">
                          <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9.5px] font-bold">
                            <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                            <span>{t.briefing.step5.advancedEvaluation}</span>
                          </div>
                          <span className="text-[9px] text-amber-400/75 leading-tight">
                            {availabilityNotice}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ações de Navegação da Etapa 5 */}
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
