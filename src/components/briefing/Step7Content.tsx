import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BackButton } from '../BackButton';
import { useTranslation } from '../../contexts/LanguageContext';

interface Step7ContentProps {
  customProjectIdea: string;
  setCustomProjectIdea: (val: string) => void;
  customReferenceLink: string;
  setCustomReferenceLink: (val: string) => void;
  contactName: string;
  setContactName: (val: string) => void;
  contactPhone: string;
  setContactPhone: (val: string) => void;
  contactEmail: string;
  setContactEmail: (val: string) => void;
  specificNotes: string;
  setSpecificNotes: (val: string) => void;
  planName: string;
  onNext: () => void;
  onPrev?: () => void;
  onClearError: () => void;
  highlightedFieldId?: string | null;
}

export const Step7Content: React.FC<Step7ContentProps> = ({
  customProjectIdea,
  setCustomProjectIdea,
  customReferenceLink,
  setCustomReferenceLink,
  contactName,
  setContactName,
  contactPhone,
  setContactPhone,
  contactEmail,
  setContactEmail,
  specificNotes,
  setSpecificNotes,
  planName,
  onNext,
  onPrev,
  onClearError,
  highlightedFieldId,
}) => {
  const { t, language } = useTranslation();

  const requiredNotice = language === 'en'
    ? 'Fields with * are required'
    : language === 'es'
    ? 'Campos con * obligatorios'
    : language === 'fr'
    ? 'Champs avec * obligatoires'
    : 'Campos com * obrigatórios';

  const ideaInstruction = language === 'en'
    ? 'In your own words, describe your vision for the website, key differentiators, or important details:'
    : language === 'es'
    ? 'Describa con sus propias palabras lo que imagina para el sitio, diferenciales o detalles importantes:'
    : language === 'fr'
    ? 'Décrivez avec vos propres mots ce que vous imaginez pour le site, vos atouts ou points d’attention :'
    : 'Conte com suas palavras o que imagina para o site, diferenciais ou detalhes importantes:';

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Cabeçalho da Etapa 7 */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
            {t.briefing.step7.badge}
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {t.briefing.planPrefix} {planName}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-extrabold text-white">
          {t.briefing.step7.title}
        </h2>
        <p className="text-[11px] text-slate-400">
          {t.briefing.step7.subtitle}
        </p>
      </div>

      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        {/* 1. Descrição Livre & Particularidades (Opcional) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
            {t.briefing.step7.ideaLabel}
          </label>
          <p className="text-[10.5px] text-slate-400">
            {ideaInstruction}
          </p>
          <textarea
            value={customProjectIdea}
            onChange={(e) => setCustomProjectIdea(e.target.value)}
            rows={3}
            placeholder={t.briefing.step7.ideaPlaceholder}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none scroll-mt-24"
          />
        </div>

        {/* 2. Link de Referência ou Inspiração (Opcional) */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            {t.briefing.step7.refLinkLabel}
          </label>
          <input
            type="url"
            value={customReferenceLink}
            onChange={(e) => setCustomReferenceLink(e.target.value)}
            placeholder={t.briefing.step7.refLinkPlaceholder}
            className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 scroll-mt-24"
          />
        </div>

        {/* 3. Dados do Responsável pelo Projeto */}
        <div className="pt-2 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
              {t.briefing.step7.responsibleLabel}
            </label>
            <span className="text-[10px] text-slate-400">{requiredNotice}</span>
          </div>

          <div>
            <span className="text-[10.5px] text-slate-300 block mb-1">
              {t.briefing.step7.responsibleName}
            </span>
            <input
              id="briefing-field-contact-name"
              type="text"
              value={contactName}
              onChange={(e) => {
                setContactName(e.target.value);
                onClearError();
              }}
              placeholder={t.briefing.step7.responsibleNamePlaceholder}
              className={`w-full min-h-[46px] bg-slate-950 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 scroll-mt-24 transition-all duration-300 ${
                highlightedFieldId === 'briefing-field-contact-name'
                  ? 'border-rose-500 ring-2 ring-rose-500/70'
                  : 'border-slate-800'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <span className="text-[10.5px] text-slate-300 block mb-1">
                {t.briefing.step7.responsiblePhone}
              </span>
              <input
                id="briefing-field-contact-phone"
                type="tel"
                inputMode="tel"
                value={contactPhone}
                onChange={(e) => {
                  setContactPhone(e.target.value);
                  onClearError();
                }}
                placeholder={t.briefing.step7.responsiblePhonePlaceholder}
                className={`w-full min-h-[46px] bg-slate-950 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono scroll-mt-24 transition-all duration-300 ${
                  highlightedFieldId === 'briefing-field-contact-phone'
                    ? 'border-rose-500 ring-2 ring-rose-500/70'
                    : 'border-slate-800'
                }`}
              />
            </div>

            <div>
              <span className="text-[10.5px] text-slate-300 block mb-1">
                {t.briefing.step7.responsibleEmail}
              </span>
              <input
                type="email"
                inputMode="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder={t.briefing.step7.responsibleEmailPlaceholder}
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 scroll-mt-24"
              />
            </div>
          </div>

          <div>
            <span className="text-[10.5px] text-slate-300 block mb-1">
              {t.briefing.step7.specificNotesLabel}
            </span>
            <textarea
              value={specificNotes}
              onChange={(e) => setSpecificNotes(e.target.value)}
              rows={2}
              placeholder={t.briefing.step7.specificNotesPlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none scroll-mt-24"
            />
          </div>
        </div>
      </div>

      {/* Ações de Navegação da Etapa 7 */}
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
