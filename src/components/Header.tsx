import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  showMenu?: boolean;
}

export const Header: React.FC<HeaderProps> = React.memo(({ onOpenMenu, showMenu = true }) => {
  if (!showMenu) return null;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/60 px-3 sm:px-4 py-1.5 transition-colors">
      <div className="max-w-3xl mx-auto flex items-center min-h-[42px]">
        {/* Lado Esquerdo: Botão Menu Hamburger ☰ (compacto, 38x38 touch-target com padding acessível) */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="w-9 h-9 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-all -ml-0.5 cursor-pointer"
          aria-label="Abrir Menu"
          title="Menu"
        >
          <Menu className="w-4.5 h-4.5 text-slate-200" />
        </button>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

