import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

/**
 * Botão Voltar unificado do NexaWeb App:
 * - Ícone ChevronLeft fino e moderno (stroke-[1.75] ~ stroke-[2], 18-20px);
 * - Sem caixa/quadrado pesado, sem borda grossa, sem fundo escuro permanente, sem sombra pesada;
 * - Área de toque confortável (min 44x44px);
 * - Feedback suave e discreto no hover/active mantendo a identidade visual;
 * - Respeita o fluxo normal de layout, sem risco de overflow ou corte.
 */
export const BackButton: React.FC<BackButtonProps> = React.memo(({
  onClick,
  label = 'Voltar',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] -ml-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/40 active:bg-slate-800/60 active:scale-95 transition-all cursor-pointer shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/60 ${className}`}
      aria-label={label}
      title={label}
    >
      <ChevronLeft className="w-5 h-5 text-current stroke-[2] shrink-0 transition-transform group-active:-translate-x-0.5" />
    </button>
  );
});

BackButton.displayName = 'BackButton';
