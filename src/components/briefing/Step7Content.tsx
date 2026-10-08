import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BackButton } from '../BackButton';

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
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Cabeçalho da Etapa 7 */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
            Conteúdo & Contato
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            Plano {planName}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-extrabold text-white">
          Conteúdo, Inspirações & Responsável
        </h2>
        <p className="text-[11px] text-slate-400">
          Compartilhe suas ideias sobre o projeto e informe os dados para alinhamento.
        </p>
      </div>

      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        {/* 1. Descrição Livre & Particularidades (Opcional) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
            1. Ideia do Projeto & Particularidades (opcional)
          </label>
          <p className="text-[10.5px] text-slate-400">
            Conte com suas palavras o que imagina para o site, diferenciais ou detalhes importantes:
          </p>
          <textarea
            value={customProjectIdea}
            onChange={(e) => setCustomProjectIdea(e.target.value)}
            rows={3}
            placeholder="Ex: Quero um site moderno focado em atrair clientes da minha região. Gostaria que tivesse destaque para os depoimentos e botão rápido para agendar pelo WhatsApp..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none scroll-mt-24"
          />
        </div>

        {/* 2. Link de Referência ou Inspiração (Opcional) */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            2. Link de Referência ou Inspiração (opcional)
          </label>
          <input
            type="url"
            value={customReferenceLink}
            onChange={(e) => setCustomReferenceLink(e.target.value)}
            placeholder="https://exemplo.com.br ou instagram.com/..."
            className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 scroll-mt-24"
          />
        </div>

        {/* 3. Dados do Responsável pelo Projeto */}
        <div className="pt-2 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
              3. Dados do Responsável pelo Projeto *
            </label>
            <span className="text-[10px] text-slate-400">Campos com * obrigatórios</span>
          </div>

          <div>
            <span className="text-[10.5px] text-slate-300 block mb-1">Seu Nome Completo *</span>
            <input
              type="text"
              value={contactName}
              onChange={(e) => {
                setContactName(e.target.value);
                onClearError();
              }}
              placeholder="Ex: João da Silva"
              className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 scroll-mt-24"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <span className="text-[10.5px] text-slate-300 block mb-1">WhatsApp para Contato *</span>
              <input
                type="tel"
                inputMode="tel"
                value={contactPhone}
                onChange={(e) => {
                  setContactPhone(e.target.value);
                  onClearError();
                }}
                placeholder="Ex: (11) 99999-9999"
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono scroll-mt-24"
              />
            </div>

            <div>
              <span className="text-[10.5px] text-slate-300 block mb-1">E-mail (opcional)</span>
              <input
                type="email"
                inputMode="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Ex: contato@empresa.com.br"
                className="w-full min-h-[46px] bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 scroll-mt-24"
              />
            </div>
          </div>

          <div>
            <span className="text-[10.5px] text-slate-300 block mb-1">Observações Adicionais (opcional)</span>
            <textarea
              value={specificNotes}
              onChange={(e) => setSpecificNotes(e.target.value)}
              rows={2}
              placeholder="Ex: Melhor horário para contato, preferência de atendimento via WhatsApp..."
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
