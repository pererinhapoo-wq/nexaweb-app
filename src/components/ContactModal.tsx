import React, { useEffect } from 'react';
import { X, Instagram, Mail, Globe, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let isPoppingDueToBack = false;
    const handlePopState = () => {
      isPoppingDueToBack = true;
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.history.pushState({ contactOpen: true }, '');
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      if (!isPoppingDueToBack && window.history.state?.contactOpen) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 space-y-4 max-h-[85dvh] sm:max-h-[85vh] overflow-y-auto no-scrollbar safe-area-pb animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Mobile drag handle discreto */}
        <div className="pt-0.5 pb-1 flex justify-center sm:hidden shrink-0" aria-hidden="true">
          <div className="w-10 h-1 bg-slate-700/80 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/70 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white">{t.contactModal.title}</h2>
              <p className="text-[10.5px] text-slate-400">{t.contactModal.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 min-h-[32px] min-w-[32px] flex items-center justify-center p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors -mr-0.5 active:scale-95"
            aria-label={t.draftModal.close}
            title={t.draftModal.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informação Institucional */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>{t.contactModal.professionalService}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {t.contactModal.serviceDesc}
          </p>
        </div>

        {/* Canais Oficiais Reais */}
        <div className="space-y-2.5">
          {/* 1. Instagram */}
          <a
            href="https://www.instagram.com/nexaw1/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-850 border border-slate-800 hover:border-pink-500/40 transition-all group min-h-[50px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center text-white shrink-0 shadow-sm">
                <div className="w-full h-full bg-slate-950/50 rounded-[10px] flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors block">
                  {t.contactModal.instagram}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">@nexaw1</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-pink-300 transition-colors" />
          </a>

          {/* 2. E-mail */}
          <a
            href="mailto:nexaweeb@gmail.com"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 transition-all group min-h-[50px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Mail className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors block">
                  {t.contactModal.email}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">nexaweeb@gmail.com</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors" />
          </a>

          {/* 3. Site Oficial */}
          <a
            href="https://nexaweeb.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 transition-all group min-h-[50px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Globe className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors block">
                  {t.contactModal.website}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">nexaweeb.vercel.app</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-300 transition-colors" />
          </a>
        </div>

        {/* Botão de Fechar */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
          >
            {t.draftModal.close}
          </button>
        </div>
      </div>
    </div>
  );
};
