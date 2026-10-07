import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({ onOpenMenu }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 py-2 transition-colors">
      <div className="max-w-3xl mx-auto relative flex items-center justify-between min-h-[44px]">
        {/* Lado Esquerdo: Botão Menu Hamburger ☰ */}
        <div className="flex items-center z-10">
          <button
            type="button"
            onClick={onOpenMenu}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-all -ml-1 cursor-pointer"
            aria-label="Abrir Menu"
            title="Menu"
          >
            <Menu className="w-5 h-5 text-slate-200" />
          </button>
        </div>

        {/* Centro Absoluto: Somente o N estilizado aprovado para o app */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center pointer-events-auto">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-black text-slate-950 font-mono select-none shadow-sm shadow-indigo-500/20">
              N
            </span>
          </div>
        </div>

        {/* Lado Direito: Espaçador vazio simétrico (44px) para garantir centro exato da tela */}
        <div className="w-[44px] h-[44px] z-10 pointer-events-none" aria-hidden="true" />
      </div>
    </header>
  );
});

Header.displayName = 'Header';

