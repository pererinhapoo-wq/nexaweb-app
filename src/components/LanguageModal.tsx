import React, { useEffect } from 'react';
import { useTranslation, LanguageOption } from '../contexts/LanguageContext';
import { Language } from '../types';
import { X, Globe, Check } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, languages, t } = useTranslation();

  // Scroll lock & Android back button
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.history.pushState({ modalOpen: true }, '');
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = async (opt: LanguageOption) => {
    if (!opt.available) return;
    await setLanguage(opt.code);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[88vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 id="language-modal-title" className="font-bold text-sm text-white">
                {t.languageModal.title}
              </h2>
              <p className="text-[11px] text-slate-400">
                {t.languageModal.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors -mr-1"
            aria-label={t.languageModal.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Options List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {languages.map((item) => {
            const isSelected = language === item.code;
            const isAvailable = item.available;

            return (
              <button
                key={item.code}
                type="button"
                disabled={!isAvailable}
                onClick={() => handleSelect(item)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  !isAvailable
                    ? 'opacity-50 cursor-not-allowed bg-slate-950/40 border-slate-850'
                    : isSelected
                    ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl shrink-0" role="img" aria-label={item.name}>
                    {item.flag}
                  </span>
                  <div>
                    <span className="text-xs font-bold block text-white">
                      {item.nativeName}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {item.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isAvailable && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {t.onboarding.comingSoonBadge}
                    </span>
                  )}
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-500 text-center">
          {t.languageModal.availableNotice}
        </div>
      </div>
    </div>
  );
};
