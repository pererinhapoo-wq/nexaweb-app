import React from 'react';
import { BackButton } from './BackButton';
import { useTranslation } from '../contexts/LanguageContext';

interface HeaderProps {
  onOpenMenu: () => void;
  showMenu?: boolean;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  onOpenMenu,
  showMenu = true,
  onBack,
  showBackButton = false,
}) => {
  const { t, language } = useTranslation();

  if (!showMenu && !showBackButton) return null;

  const backLabel =
    t.header?.back ||
    (language === 'en'
      ? 'Back'
      : language === 'es'
      ? 'Volver'
      : language === 'fr'
      ? 'Retour'
      : 'Voltar');

  const menuLabel =
    language === 'en'
      ? 'Open Menu'
      : language === 'es'
      ? 'Abrir Menú'
      : language === 'fr'
      ? 'Ouvrir le Menu'
      : 'Abrir Menu';

  return (
    <header className="w-full bg-transparent border-0 shadow-none px-4 pt-3.5 sm:pt-4 pb-0 transition-colors">
      <div className="max-w-3xl mx-auto flex items-center min-h-[40px] justify-between">
        {/* Lado Esquerdo: Botão Voltar (quando aplicável) OU Gatilho do Menu Lateral */}
        <div className="flex items-center gap-2">
          {showBackButton && onBack && (
            <BackButton
              onClick={onBack}
              label={backLabel}
            />
          )}
          {showMenu && !showBackButton && (
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label={menuLabel}
              title={menuLabel}
              className="nexa-sidebar-trigger inline-flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] -ml-2 bg-transparent border-0 text-slate-200 hover:text-white active:scale-95 transition-all duration-150 cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-indigo-400"
            >
              <span
                aria-hidden="true"
                className="text-[24px] leading-none select-none text-current"
                style={{
                  fontFamily: '"Noto Sans Balinese", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Segoe UI Symbol", sans-serif'
                }}
              >
                ᯓ
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

