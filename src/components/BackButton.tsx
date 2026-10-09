import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

/**
 * Botão Voltar unificado do NexaWeb App:
 * - Ícone ChevronLeft fino e moderno (strokeWidth 1.5, tamanho visual ~19px);
 * - Visual minimalista, sem quadrado pesado, sem borda grossa, sem fundo permanente, sem sombra;
 * - Área de toque acessível e confortável (44x44px);
 * - Feedback sutil e fluido ao toque;
 * - Totalmente compatível com os temas Original, Claro e Escuro;
 * - Alinhamento seguro, sem margens negativas frágeis, sem risco de overflow ou corte.
 */
export const BackButton: React.FC<BackButtonProps> = React.memo(({
  onClick,
  label,
  className = '',
}) => {
  const { t } = useTranslation();
  const resolvedLabel = label || t?.header?.back || 'Voltar';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`nexa-back-button inline-flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] transition-all duration-150 cursor-pointer shrink-0 border-0 bg-transparent shadow-none outline-none focus:outline-none active:scale-95 group ${className}`}
      aria-label={resolvedLabel}
      title={resolvedLabel}
    >
      <ChevronLeft
        size={19}
        strokeWidth={1.5}
        className="text-current shrink-0 transition-transform duration-150 group-active:-translate-x-0.5"
      />
    </button>
  );
});

BackButton.displayName = 'BackButton';


