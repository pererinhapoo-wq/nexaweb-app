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
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 active:scale-95 transition-all -ml-1"
            aria-label="Abrir Menu"
            title="Menu"
          >
            <Menu className="w-5 h-5 text-slate-200" />
          </button>
        </div>

        {/* Centro Absoluto: "Nexa" visualmente centralizado na tela, independente da largura dos botões */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[11px] font-black text-slate-950 font-mono select-none shadow-sm">
              N
            </span>
            <span className="font-extrabold text-base tracking-tight text-white select-none">
              Nexa
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

