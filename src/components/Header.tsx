import React from 'react';
import { Menu } from 'lucide-react';
import { BackButton } from './BackButton';

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
  if (!showMenu && !showBackButton) return null;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/60 px-3 sm:px-4 py-1.5 transition-colors">
      <div className="max-w-3xl mx-auto flex items-center min-h-[42px] justify-between">
        {/* Lado Esquerdo: Botão Voltar (quando aplicável) e Botão Menu Hamburger ☰ */}
        <div className="flex items-center gap-1.5">
          {showBackButton && onBack && (
            <BackButton
              onClick={onBack}
              label="Voltar"
              className="-ml-1"
            />
          )}
          {showMenu && (
            <button
              type="button"
              onClick={onOpenMenu}
              className="w-9 h-9 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-all -ml-0.5 cursor-pointer"
              aria-label="Abrir Menu"
              title="Menu"
            >
              <Menu className="w-4.5 h-4.5 text-slate-200" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

