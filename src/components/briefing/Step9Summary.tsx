import React from 'react';
import {
  Edit2,
  Send,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { NexawebPlan } from '../../data/servicesData';
import { SegmentBriefingConfig } from '../../data/segmentBriefingSchemas';
import { getSiteObjectives, getVisualStyles } from './briefingTypes';
import { findAdvancedFeatureById } from '../../data/advancedFeaturesData';
import { BudgetCalculationResult } from '../../utils/pricingEngine';
import { useTranslation } from '../../contexts/LanguageContext';

interface Step9SummaryProps {
  activePlanObj: NexawebPlan;
  startMode: 'propria' | 'plano' | null;
  selectedModel: string;
  modelApproach: 'exact' | 'inspiration';
  businessName: string;
  siteObjective: string;
  businessLocation: string;
  businessBranches: string;
  googleMapsLink: string;
  segmentConfig: SegmentBriefingConfig;
  selectedPrimaryOptions: string[];
  selectedSecondaryOptions: string[];
  selectedFeatures: string[];
  operatingSchedule: string;
  teamDescription: string;
  freeServicesText: string;
  selectedAdvancedFeatures: string[];
  advancedFeaturesLimit: number;
  budgetCalculation?: BudgetCalculationResult;
  visualStyle: string;
  colorMode: 'suggest' | 'brand' | 'custom' | '';
  customColorDetails: string;
  customProjectIdea: string;
  customReferenceLink: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  specificNotes: string;
  attachedFiles: File[];
  isSubmitting: boolean;
  submissionSuccess: {
    projectId: string;
    message: string;
    isOfflineFallback?: boolean;
  } | null;
  submissionError: string | null;
  copied?: boolean;
  onSubmit: () => void;
  onCopy?: () => void;
  onRetry: () => void;
  onOfflineProtocol: () => void;
  onEditStep: (step: number) => void;
  onNavigate: (tab: any) => void;
}

export const Step9Summary: React.FC<Step9SummaryProps> = ({
  activePlanObj,
  startMode,
  selectedModel,
  modelApproach,
  businessName,
  siteObjective,
  businessLocation,
  businessBranches,
  googleMapsLink,
  segmentConfig,
  selectedPrimaryOptions,
  selectedSecondaryOptions,
  selectedFeatures,
  operatingSchedule,
  teamDescription,
  freeServicesText,
  selectedAdvancedFeatures,
  advancedFeaturesLimit,
  budgetCalculation,
  visualStyle,
  colorMode,
  customColorDetails,
  customProjectIdea,
  customReferenceLink,
  contactName,
  contactPhone,
  contactEmail,
  specificNotes,
  attachedFiles,
  isSubmitting,
  submissionSuccess,
  submissionError,
  onSubmit,
  onRetry,
  onOfflineProtocol,
  onEditStep,
  onNavigate,
}) => {
  const { t, language } = useTranslation();

  const objectives = getSiteObjectives(language);
  const visualStyles = getVisualStyles(language);

  const objectiveLabel =
    objectives.find((o) => o.id === siteObjective)?.label || siteObjective;

  const styleLabel =
    visualStyles.find((s) => s.id === visualStyle)?.label || visualStyle || t.briefing.step9.toDefine;

  const colorModeLabel = (() => {
    if (colorMode === 'suggest') return t.briefing.step9.suggestedPalette;
    if (colorMode === 'brand') return t.briefing.step9.existingBrandColors;
    if (colorMode === 'custom') {
      return customColorDetails
        ? `${t.briefing.step9.specificTones}: ${customColorDetails}`
        : t.briefing.step9.specificTones;
    }
    return t.briefing.step9.toDefine;
  })();

  const modelApproachLabel = modelApproach === 'exact'
    ? t.briefing.step9.exactModel
    : t.briefing.step9.inspiredModel;

  const filesCountText = attachedFiles.length > 0
    ? t.briefing.step9.photosAttached.replace('{count}', String(attachedFiles.length))
    : t.briefing.step9.noFilesAttached;

  // Quando o briefing é concluído com sucesso, exibe exclusivamente a tela de aprovação/sucesso
  if (submissionSuccess) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 space-y-3 animate-in fade-in duration-150">
        <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{t.briefing.step9.successTitle}</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          {submissionSuccess.message}
        </p>
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between text-xs">
          <span className="text-slate-400">{t.briefing.step9.protocolLabel}:</span>
          <span className="font-mono font-bold text-emerald-400">
            {submissionSuccess.projectId}
          </span>
        </div>
        <div className="pt-1.5 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('portal')}
            className="min-h-[44px] h-11 flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-xs shadow-sm shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
          >
            <span>{t.briefing.step9.trackInPortal}</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="min-h-[44px] h-11 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center transition-all duration-150 cursor-pointer"
          >
            <span>{t.briefing.step9.backToHome}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Cabeçalho da Etapa 9 */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
          {t.briefing.step9.title}
        </h2>
        <p className="text-xs text-slate-300">
          {t.briefing.step9.subtitle}
        </p>
      </div>

      {/* Card Resumo Estruturado com Ações Rápidas de Edição */}
      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-4 shadow-sm text-xs">
        {/* Bloco 1: Plano & Origem com Cálculo Unificado */}
        <div className="border-b border-slate-800/80 pb-3.5 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                {t.briefing.step9.selectedPlan}
              </span>
              <span className="text-sm font-bold text-white">
                {t.briefing.planPrefix} {activePlanObj.nome}
              </span>
              <span className="text-[10.5px] text-slate-400 block mt-0.5">
                {t.briefing.step9.estimatedTimeline}: {activePlanObj.prazo}
              </span>
              {selectedModel && (
                <span className="text-[10.5px] text-cyan-300 block mt-0.5">
                  {selectedModel} ({modelApproachLabel})
                </span>
              )}
            </div>
            <div className="text-right flex items-center gap-2">
              <span className="text-sm sm:text-base font-mono font-bold text-cyan-300">
                {budgetCalculation ? budgetCalculation.formattedTotalPrice : activePlanObj.preco}
              </span>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
                title={t.briefing.step9.editStep.replace('{step}', '1')}
                aria-label={t.briefing.step9.editStep.replace('{step}', '1')}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Discriminação transparente do orçamento */}
          {budgetCalculation && (
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>{t.services.price} ({activePlanObj.nome}):</span>
                <span className="font-mono text-slate-200">{budgetCalculation.formattedBasePrice}</span>
              </div>

              {budgetCalculation.selectedFeatures.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-slate-850">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                    {t.briefing.step9.advancedFeatures}:
                  </span>
                  {budgetCalculation.selectedFeatures.map((feat) => (
                    <div key={feat.id} className="flex items-center justify-between text-slate-300 pl-1">
                      <span>• {feat.nome} {feat.isRealtime ? '(Realtime)' : ''}:</span>
                      <span className="font-mono text-amber-300 font-semibold">{feat.formattedPreco}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-slate-400 pt-0.5">
                    <span>Extras:</span>
                    <span className="font-mono text-amber-300">{budgetCalculation.formattedExtrasTotal}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-800 font-bold text-xs">
                <span className="text-white">{t.briefing.step9.estimatedBudget}:</span>
                <span className="font-mono text-cyan-300">{budgetCalculation.formattedTotalPrice}</span>
              </div>

              {budgetCalculation.scopeNotice && (
                <div className="mt-1 p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[10.5px] text-amber-300 flex items-start gap-1.5 leading-snug">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                  <span>{budgetCalculation.scopeNotice}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bloco 2: Informações Principais */}
        <div className="space-y-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t.briefing.step9.businessIdentification}
            </span>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>{t.onboarding.editStep}</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">{t.briefing.step9.businessName}:</span>
            <span className="font-bold text-white text-right">{businessName || '—'}</span>
          </div>

          {siteObjective && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.briefing.step9.objective}:</span>
              <span className="font-semibold text-cyan-300 text-right">
                {objectiveLabel}
              </span>
            </div>
          )}

          {businessLocation && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.briefing.step9.location}:</span>
              <span className="text-white text-right">{businessLocation}</span>
            </div>
          )}

          {businessBranches && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.briefing.step9.branches}:</span>
              <span className="text-white text-right">{businessBranches}</span>
            </div>
          )}

          {googleMapsLink && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.briefing.step9.googleMaps}:</span>
              <span className="text-cyan-400 truncate max-w-[180px] text-right underline">
                Link
              </span>
            </div>
          )}
        </div>

        {/* Bloco 3: Segmento */}
        <div className="space-y-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t.briefing.step9.segment}
            </span>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>{t.onboarding.editStep}</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">{t.briefing.step9.segment}:</span>
            <span className="font-bold text-white text-right flex items-center gap-1.5">
              <span>{segmentConfig.icon}</span>
              <span>{segmentConfig.name}</span>
            </span>
          </div>
        </div>

        {/* Bloco 4: Necessidades & Conteúdo do Nicho */}
        <div className="space-y-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t.briefing.step9.scopeItems}
            </span>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>{t.onboarding.editStep}</span>
            </button>
          </div>

          {selectedPrimaryOptions.length > 0 && (
            <div>
              <span className="text-slate-400 block mb-1">
                {segmentConfig.primaryOptionsLabel}:
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedPrimaryOptions.map((opt) => (
                  <span
                    key={opt}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-cyan-300 border border-slate-800"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedSecondaryOptions.length > 0 && (
            <div className="pt-1">
              <span className="text-slate-400 block mb-1">
                {segmentConfig.secondaryOptionsLabel}:
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedSecondaryOptions.map((opt) => (
                  <span
                    key={opt}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-indigo-300 border border-slate-800"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedFeatures.length > 0 && (
            <div className="pt-1">
              <span className="text-slate-400 block mb-1">
                {segmentConfig.featuresLabel}:
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedFeatures.map((feat) => (
                  <span
                    key={feat}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-emerald-300 border border-slate-800"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {operatingSchedule && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">{t.briefing.step4.scheduleLabel}:</span>
              <span className="text-white text-right">{operatingSchedule}</span>
            </div>
          )}

          {teamDescription && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.briefing.step4.teamLabel}:</span>
              <span className="text-white text-right">{teamDescription}</span>
            </div>
          )}

          {freeServicesText && (
            <div className="pt-1">
              <span className="text-slate-400 block mb-0.5">{t.briefing.step4.servicesDetailsLabel}:</span>
              <p className="text-[10.5px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                {freeServicesText}
              </p>
            </div>
          )}
        </div>

        {/* Bloco 5: Funcionalidades Adicionais */}
        <div className="space-y-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t.briefing.step9.advancedFeatures} ({selectedAdvancedFeatures.length} / {advancedFeaturesLimit})
            </span>
            <button
              type="button"
              onClick={() => onEditStep(5)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>{t.onboarding.editStep}</span>
            </button>
          </div>

          {selectedAdvancedFeatures.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedAdvancedFeatures.map((featId) => {
                const feat = findAdvancedFeatureById(featId);
                return (
                  <span
                    key={featId}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-amber-300 border border-slate-800 flex items-center gap-1"
                  >
                    <span>{feat ? feat.nome : featId}</span>
                    {feat?.isComplex && (
                      <span className="text-[8.5px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">
                        {t.briefing.step5.advancedEvaluation}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-[11px] text-slate-500 italic block">
              {advancedFeaturesLimit === 0
                ? t.services.scopeClosed
                : t.briefing.step9.noneSelected}
            </span>
          )}
        </div>

        {/* Bloco 6: Visual & Cores */}
        <div className="space-y-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t.briefing.step9.visualIdentity}
            </span>
            <button
              type="button"
              onClick={() => onEditStep(6)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>{t.onboarding.editStep}</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">{t.briefing.step9.style}:</span>
            <span className="font-semibold text-white text-right">{styleLabel}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">{t.briefing.step9.colors}:</span>
            <span className="text-white text-right">{colorModeLabel}</span>
          </div>
        </div>

        {/* Bloco 7: Conteúdo & Contato */}
        <div className="space-y-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t.briefing.step7.badge}
            </span>
            <button
              type="button"
              onClick={() => onEditStep(7)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>{t.onboarding.editStep}</span>
            </button>
          </div>

          {customProjectIdea && (
            <div>
              <span className="text-slate-400 block mb-0.5">{t.briefing.step9.projectIdea}:</span>
              <p className="text-[10.5px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                {customProjectIdea}
              </p>
            </div>
          )}

          {customReferenceLink && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.briefing.step9.referenceLink}:</span>
              <span className="text-cyan-400 truncate max-w-[180px] text-right underline">
                {customReferenceLink}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <span className="text-slate-400">{t.briefing.step9.responsibleContact}:</span>
            <span className="font-bold text-white text-right">{contactName || '—'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">{t.briefing.step9.phone}:</span>
            <span className="font-mono text-cyan-300 text-right">{contactPhone || '—'}</span>
          </div>

          {contactEmail && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{t.briefing.step9.email}:</span>
              <span className="text-white text-right">{contactEmail}</span>
            </div>
          )}

          {specificNotes && (
            <div className="pt-1">
              <span className="text-slate-400 block mb-0.5">{t.briefing.step9.notes}:</span>
              <p className="text-[10.5px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                {specificNotes}
              </p>
            </div>
          )}
        </div>

        {/* Bloco 8: Arquivos */}
        <div className="space-y-2 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t.briefing.step9.attachedFiles}
            </span>
            <button
              type="button"
              onClick={() => onEditStep(8)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>{t.onboarding.editStep}</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">{t.briefing.step9.attachedFiles}:</span>
            <span className="font-mono font-bold text-cyan-300">
              {filesCountText}
            </span>
          </div>
        </div>
      </div>

      {/* Erro de Envio com Opção de Protocolo Offline */}
      {submissionError && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 space-y-2.5 animate-in fade-in">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{t.briefing.step9.errorTitle}</span>
          </div>
          <p className="text-xs text-slate-300">
            {submissionError}
          </p>
          <div className="pt-1 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onRetry}
              disabled={isSubmitting}
              className="min-h-[44px] flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>{t.briefing.retry}</span>
            </button>
            <button
              type="button"
              onClick={onOfflineProtocol}
              className="min-h-[44px] flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t.briefing.step9.generateOfflineProtocol}</span>
            </button>
          </div>
        </div>
      )}

      {/* Botão de Envio Oficial da Etapa 9 */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full min-h-[44px] h-11 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-xs shadow-sm shadow-indigo-950/40 border border-indigo-400/20 flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{t.briefing.submitting}</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>{t.briefing.step9.reviewAndSubmit}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
