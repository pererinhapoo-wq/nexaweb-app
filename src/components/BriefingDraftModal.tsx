import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface BriefingDraftModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onDiscard: () => void;
}

export const BriefingDraftModal: React.FC<BriefingDraftModalProps> = ({
  isOpen,
  onContinue,
  onDiscard,
}) => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();

  // Bloqueio de scroll do body enquanto o modal estiver aberto
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isLight = resolvedTheme === 'light';
  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[2px] animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefing-draft-title"
    >
      <div
        className={`w-full max-w-sm rounded-2xl p-5 sm:p-6 shadow-2xl border transition-all animate-in zoom-in-95 duration-150 space-y-4 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/15'
            : isDark
            ? 'bg-zinc-950 border-zinc-800 text-white shadow-black'
            : 'bg-slate-900 border-slate-800 text-white shadow-slate-950/60'
        }`}
      >
        {/* Ícone e Cabeçalho */}
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isLight
                ? 'bg-cyan-50 text-cyan-600'
                : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h2
              id="briefing-draft-title"
              className={`text-sm sm:text-base font-extrabold leading-snug tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {t.draftModal.title}
            </h2>
            <p
              className={`text-xs leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              {t.draftModal.desc}
            </p>
          </div>
        </div>

        {/* Ações: Dois botões claramente distinguíveis */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Botão Fechar (Descarta o rascunho e limpa o storage) */}
          <button
            type="button"
            onClick={onDiscard}
            className={`min-h-[44px] py-2.5 px-3.5 rounded-xl text-xs font-bold border transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center text-center ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : isDark
                ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {t.draftModal.close}
          </button>

          {/* Botão Continuar (Restaura o briefing salvo e prossegue) */}
          <button
            type="button"
            onClick={onContinue}
            className="min-h-[44px] py-2.5 px-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center text-center"
          >
            {t.draftModal.continue}
          </button>
        </div>
      </div>
    </div>
  );
};
