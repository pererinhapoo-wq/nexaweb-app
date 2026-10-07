import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation, LanguageOption } from '../contexts/LanguageContext';
import { X, Globe, Check, Search } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, languages, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnimCode, setSelectedAnimCode] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const savedScrollYRef = useRef<number>(0);

  // Normalização de string para busca sem acentos (ex.: "portugues" acha "Português")
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Reset de busca ao abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedAnimCode(null);
    }
  }, [isOpen]);

  // Scroll lock, Android Back & ESC handling sem vazamento de histórico
  useEffect(() => {
    if (!isOpen) return;

    // Salva scroll atual da janela para não causar salto ao fechar
    savedScrollYRef.current = window.scrollY;

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

    const handleAndroidBack = () => {
      onClose();
    };

    try {
      window.history.pushState({ languageModalOpen: true }, '');
    } catch {}

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('backbutton', handleAndroidBack);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('backbutton', handleAndroidBack);

      // Se fechou via clique no modal e o state ainda está na pilha, recua sem navegar
      if (!isPoppingDueToBack && window.history.state?.languageModalOpen) {
        try {
          window.history.back();
        } catch {}
      }

      // Restaura scroll original se houve micro-deslocamento
      if (typeof window !== 'undefined' && savedScrollYRef.current !== undefined) {
        window.scrollTo({ top: savedScrollYRef.current, behavior: 'instant' as ScrollBehavior });
      }
    };
  }, [isOpen, onClose]);

  // Lista filtrada em tempo real (Português, Inglês, nativo e código)
  const filteredLanguages = useMemo(() => {
    const q = normalize(searchQuery.trim());
    if (!q) return languages;

    // Mapeamento extra de termos comuns PT / EN
    const aliasMap: Record<string, string[]> = {
      'pt-br': ['brasil', 'brazil', 'portugues', 'portuguese'],
      'pt-pt': ['portugal', 'portugues', 'portuguese', 'europa'],
      en: ['ingles', 'english', 'usa', 'estados unidos', 'american'],
      es: ['espanhol', 'spanish', 'castellano', 'espanol'],
      fr: ['frances', 'french', 'francais', 'franca'],
      de: ['alemao', 'german', 'deutsch', 'alemanha'],
      it: ['italiano', 'italian', 'italia'],
      ja: ['japones', 'japanese', 'nihongo', 'japao'],
      zh: ['chines', 'chinese', 'mandarim', 'china'],
    };

    return languages.filter((item) => {
      const matchName = normalize(item.name).includes(q);
      const matchNative = normalize(item.nativeName).includes(q);
      const matchCode = normalize(item.code).includes(q);
      const matchShort = normalize(item.short).includes(q);
      const aliases = aliasMap[item.code.toLowerCase()] || [];
      const matchAlias = aliases.some((a) => a.includes(q) || q.includes(a));

      return matchName || matchNative || matchCode || matchShort || matchAlias;
    });
  }, [languages, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = async (opt: LanguageOption) => {
    if (!opt.available) return;
    setSelectedAnimCode(opt.code);

    // Microinteração curta (140ms) antes de fechar para feedback visual nítido
    setTimeout(async () => {
      await setLanguage(opt.code);
      onClose();
    }, 140);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 touch-pan-y"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[82dvh] sm:max-h-[75vh] flex flex-col overflow-hidden pb-4 sm:pb-3 safe-area-pb animate-in slide-in-from-bottom-3 sm:zoom-in-95 duration-200 will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior de puxar (Mobile drag handle discreto) */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden shrink-0" aria-hidden="true">
          <div className="w-10 h-1 bg-slate-700/80 rounded-full" />
        </div>

        {/* Cabeçalho do Seletor */}
        <div className="px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <h2 id="language-modal-title" className="font-bold text-xs sm:text-sm text-white truncate">
                {t.languageModal.title}
              </h2>
              <p className="text-[10.5px] text-slate-400 truncate">
                {t.languageModal.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors shrink-0 -mr-1"
            aria-label={t.languageModal.close}
            title={t.languageModal.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Campo de Pesquisa Instantânea */}
        <div className="px-4 pt-2.5 pb-2 shrink-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar idioma / Search language..."
              className="w-full min-h-[42px] bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-9 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-colors font-sans"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="min-h-[36px] min-w-[36px] absolute right-1.5 flex items-center justify-center text-slate-400 hover:text-white rounded-lg transition-colors"
                aria-label="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Lista de Opções Compactas */}
        <div className="px-4 py-1 overflow-y-auto space-y-1.5 flex-1 overscroll-contain no-scrollbar">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((item) => {
              const isSelected = language === item.code;
              const isAnimating = selectedAnimCode === item.code;
              const isAvailable = item.available;

              return (
                <button
                  key={item.code}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => handleSelect(item)}
                  className={`w-full min-h-[46px] flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-all duration-150 active:scale-[0.985] ${
                    !isAvailable
                      ? 'opacity-40 cursor-not-allowed bg-slate-950/30 border-slate-850'
                      : isSelected || isAnimating
                      ? 'bg-indigo-600/15 border-cyan-500 text-white shadow-sm ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-850/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base sm:text-lg shrink-0 select-none" role="img" aria-label={item.name}>
                      {item.flag}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block text-white truncate leading-tight">
                        {item.nativeName}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate leading-tight mt-0.5">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {!isAvailable && (
                      <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/60">
                        {t.onboarding.comingSoonBadge}
                      </span>
                    )}
                    {(isSelected || isAnimating) && (
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-sm animate-in zoom-in-75 duration-150">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            /* Estado Vazio de Pesquisa */
            <div className="py-8 px-4 text-center space-y-2">
              <Search className="w-6 h-6 text-slate-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-300">
                Nenhum idioma encontrado para &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-[11px] text-slate-500">
                Tente buscar pelo nome em português, inglês ou código (ex: BR, EN, ES, FR).
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-300 text-xs font-medium transition-colors"
              >
                Limpar pesquisa
              </button>
            </div>
          )}
        </div>

        {/* Rodapé informativo discreto */}
        <div className="px-4 pt-2 border-t border-slate-800/80 text-[10.5px] text-slate-500 text-center shrink-0">
          {t.languageModal.availableNotice}
        </div>
      </div>
    </div>
  );
};
