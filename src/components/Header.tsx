import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({ onOpenMenu }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/60 px-3 sm:px-4 py-1.5 transition-colors">
      <div className="max-w-3xl mx-auto relative flex items-center justify-between min-h-[42px]">
        {/* Lado Esquerdo: Botão Menu Hamburger ☰ (compacto, 38x38 touch-target com padding acessível) */}
        <div className="flex items-center z-10">
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

        {/* Centro Absoluto: Somente o N estilizado discreto e refinado */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center pointer-events-auto">
            <span className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-[11px] font-black text-slate-950 font-mono select-none shadow-sm shadow-indigo-500/20">
              N
            </span>
          </div>
        </div>

        {/* Lado Direito: Espaçador vazio simétrico (36px) para garantir centro exato da tela */}
        <div className="w-9 h-9 z-10 pointer-events-none" aria-hidden="true" />
      </div>
    </header>
  );
});

Header.displayName = 'Header';

