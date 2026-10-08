import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { WebsiteLanguage } from '../../types';
import { SITE_OBJECTIVES } from './briefingTypes';
import { BackButton } from '../BackButton';

interface Step2MainInfoProps {
  businessName: string;
  setBusinessName: (val: string) => void;
  siteObjective: string;
  setSiteObjective: (val: string) => void;
  siteLanguage: WebsiteLanguage;
  setSiteLanguage: (val: WebsiteLanguage) => void;
  businessLocation: string;
  setBusinessLocation: (val: string) => void;
  businessBranches: string;
  setBusinessBranches: (val: string) => void;
  googleMapsLink: string;
  setGoogleMapsLink: (val: string) => void;
  planName: string;
  onNext: () => void;
  onPrev?: () => void;
  onClearError: () => void;
  highlightedFieldId?: string | null;
}

export const Step2MainInfo: React.FC<Step2MainInfoProps> = ({
  businessName,
  setBusinessName,
  siteObjective,
  setSiteObjective,
  siteLanguage,
  setSiteLanguage,
  businessLocation,
  setBusinessLocation,
  businessBranches,
  setBusinessBranches,
  googleMapsLink,
  setGoogleMapsLink,
  planName,
  onNext,
  onPrev,
  onClearError,
  highlightedFieldId,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Cabeçalho da Etapa 2 */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
            Informações Principais
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            Plano {planName}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-extrabold text-white">
          Identificação & Propósito do Projeto
        </h2>
        <p className="text-[11px] text-slate-400">
          Defina o nome, objetivo principal e detalhes de atendimento do seu negócio.
        </p>
      </div>

      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        {/* 1. Nome do Negócio ou Projeto * */}
        <div>
          <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
            1. Nome do Negócio ou Projeto *
          </label>
          <input
            id="briefing-field-business-name"
            type="text"
            value={businessName}
            onChange={(e) => {
              setBusinessName(e.target.value);
              onClearError();
            }}
            placeholder="Ex: Minha Empresa, Studio Bella, Barbearia Nobre..."
            className={`w-full min-h-[46px] bg-slate-950 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 scroll-mt-20 transition-all duration-300 ${
              highlightedFieldId === 'briefing-field-business-name'
                ? 'border-rose-500 ring-2 ring-rose-500/70'
                : 'border-slate-800'
            }`}
          />
        </div>

        {/* 2. Objetivo Principal do Site */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
              2. Objetivo Principal do Site *
            </label>
            <span className="text-[10px] text-slate-400">Selecione uma opção</span>
          </div>
          <p className="text-[10.5px] text-slate-400">
            Qual é a prioridade número 1 do site para o seu negócio?
          </p>

          <div
            id="briefing-field-site-objective"
            className={`grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 rounded-2xl p-0.5 transition-all duration-300 ${
              highlightedFieldId === 'briefing-field-site-objective'
                ? 'ring-2 ring-rose-500/70'
                : ''
            }`}
          >
            {SITE_OBJECTIVES.map((obj) => {
              const isChecked = siteObjective === obj.id;
              return (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => {
                    setSiteObjective(obj.id);
                    onClearError();
                  }}
                  className={`min-h-[46px] p-2.5 rounded-xl border text-left transition-all active:scale-[0.99] flex items-center justify-between gap-2.5 ${
                    isChecked
                      ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-1.5">
                    <span className="text-xs font-bold block leading-snug">
                      {obj.label}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight block mt-0.5 line-clamp-2">
                      {obj.desc}
                    </span>
                  </div>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isChecked
                        ? 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-sm'
                        : 'border-slate-700 bg-slate-900/60'
                    }`}
                  >
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Idioma do Futuro Site */}
        <div className="pt-2 border-t border-slate-800/80">
          <label className="text-[11px] font-bold text-white uppercase tracking-wider block mb-1">
            3. Idioma do Futuro Site
          </label>
          <select
            value={siteLanguage}
            onChange={(e) => setSiteLanguage(e.target.value as WebsiteLanguage)}
            className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 scroll-mt-20"
          >
            <option value="pt-BR">🇧🇷 Português (Brasil)</option>
            <option value="pt-PT">🇵🇹 Português (Portugal)</option>
            <option value="en">🇺🇸 Inglês (English)</option>
            <option value="es">🇪🇸 Espanhol (Español)</option>
            <option value="fr">🇫🇷 Francês (Français)</option>
            <option value="pt-en">🌐 Bilíngue (Português + Inglês)</option>
          </select>
        </div>

        {/* 4. Localização & Filiais (Opcionais pertinentes) */}
        <div className="pt-2 border-t border-slate-800/80 space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
              4. Localização ou Região Atendida (opcional)
            </label>
            <input
              type="text"
              value={businessLocation}
              onChange={(e) => setBusinessLocation(e.target.value)}
              placeholder="Ex: São Paulo - SP, Brasil e exterior, ou 100% online..."
              className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 scroll-mt-20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Unidades / Filiais (opcional)
              </label>
              <input
                type="text"
                value={businessBranches}
                onChange={(e) => setBusinessBranches(e.target.value)}
                placeholder="Ex: 1 sede física, Matriz e filial..."
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 scroll-mt-20"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Google Maps / Link (opcional)
              </label>
              <input
                type="url"
                value={googleMapsLink}
                onChange={(e) => setGoogleMapsLink(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 scroll-mt-20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ações de Navegação da Etapa 2 */}
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
