import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { PortfolioProject } from '../types';
import { Globe } from 'lucide-react';
import {
  getSegmentConfig,
  buildImageFallbackChain,
  isImageCachedLoaded,
  isImageCachedFailed,
  cacheImageLoaded,
  cacheImageFailed,
  GLOBAL_SAFE_FALLBACK_IMAGE,
} from '../utils/imageService';

interface ProjectCardImageProps {
  project: PortfolioProject;
  aspectRatio?: 'video' | 'card' | 'compact';
  className?: string;
  badge?: string;
  enableSwipe?: boolean;
  priority?: boolean;
}

export const ProjectCardImage: React.FC<ProjectCardImageProps> = React.memo(({
  project,
  aspectRatio = 'card',
  className = '',
  badge,
  enableSwipe = true,
  priority = false,
}) => {
  // Lista de imagens estritamente pertencentes a este projeto
  const images = useMemo(() => {
    if (project.imagens && project.imagens.length > 0) {
      return project.imagens;
    }
    if (project.imagemUrl) {
      return [project.imagemUrl];
    }
    return [GLOBAL_SAFE_FALLBACK_IMAGE];
  }, [project.imagens, project.imagemUrl]);

  const [activeIdx, setActiveIdx] = useState(0);
  const currentPrimaryUrl = images[activeIdx] || images[0];

  // Cadeia de fallback em 3 níveis para a imagem ativa
  const fallbackChain = useMemo(() => {
    return buildImageFallbackChain(
      currentPrimaryUrl,
      project.categoria || project.segmentoAlvo
    );
  }, [currentPrimaryUrl, project.categoria, project.segmentoAlvo]);

  const [chainIndex, setChainIndex] = useState(0);
  const activeUrl = fallbackChain[chainIndex] || fallbackChain[0];

  const [imageLoaded, setImageLoaded] = useState(() => isImageCachedLoaded(activeUrl));
  const [hasFatalError, setHasFatalError] = useState(() => isImageCachedFailed(activeUrl) && chainIndex >= fallbackChain.length - 1);

  // Reset chain when activeIdx changes
  useEffect(() => {
    setChainIndex(0);
    setHasFatalError(false);
    setImageLoaded(isImageCachedLoaded(images[activeIdx] || images[0]));
  }, [activeIdx, images]);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const isHorizontalIntent = useRef<boolean | null>(null);
  const hasSwiped = useRef<boolean>(false);
  const swipeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mouse drag refs para preview desktop
  const isMouseDown = useRef<boolean>(false);
  const mouseStartX = useRef<number>(0);
  const mouseDeltaX = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (swipeTimer.current) clearTimeout(swipeTimer.current);
    };
  }, []);

  const aspectClass =
    aspectRatio === 'compact'
      ? 'aspect-[16/9]'
      : aspectRatio === 'video'
      ? 'aspect-[16/9]'
      : 'aspect-[16/10]';

  const demoHostname = useMemo(() => {
    try {
      return new URL(project.linkDemo).hostname;
    } catch {
      return 'nexaweb.app';
    }
  }, [project.linkDemo]);

  const segmentConfig = useMemo(() => {
    return getSegmentConfig(project.categoria || project.segmentoAlvo);
  }, [project.categoria, project.segmentoAlvo]);

  // Handlers para swipe lateral seguro diferenciando intenção horizontal de vertical
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipe || images.length <= 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
    isHorizontalIntent.current = null;
    hasSwiped.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipe || images.length <= 1 || touchStartX.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - (touchStartY.current || 0);

    // Trava a intenção após os primeiros 8px de movimento
    if (isHorizontalIntent.current === null && (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8)) {
      // Se horizontal for dominante, trava como swipe do carrossel
      isHorizontalIntent.current = Math.abs(deltaX) > Math.abs(deltaY) * 1.3;
    }

    if (isHorizontalIntent.current === true) {
      touchDeltaX.current = deltaX;
      if (Math.abs(deltaX) > 14) {
        hasSwiped.current = true;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!enableSwipe || images.length <= 1 || touchStartX.current === null) return;
    const deltaX = touchDeltaX.current;

    if (isHorizontalIntent.current === true && Math.abs(deltaX) > 32) {
      e.stopPropagation(); // Evita acionar clique de navegação do card pai
      if (deltaX < 0) {
        // Próxima imagem
        setActiveIdx((prev) => (prev + 1) % images.length);
      } else {
        // Imagem anterior
        setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchDeltaX.current = 0;
    isHorizontalIntent.current = null;

    // Mantém a flag de swipe ativa brevemente para impedir cliques acidentais
    if (swipeTimer.current) clearTimeout(swipeTimer.current);
    swipeTimer.current = setTimeout(() => {
      hasSwiped.current = false;
    }, 140);
  };

  // Suporte a mouse drag suave para preview
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enableSwipe || images.length <= 1) return;
    isMouseDown.current = true;
    mouseStartX.current = e.clientX;
    mouseDeltaX.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    const deltaX = e.clientX - mouseStartX.current;
    mouseDeltaX.current = deltaX;
    if (Math.abs(deltaX) > 12) {
      hasSwiped.current = true;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    if (Math.abs(mouseDeltaX.current) > 32) {
      e.stopPropagation();
      if (mouseDeltaX.current < 0) {
        setActiveIdx((prev) => (prev + 1) % images.length);
      } else {
        setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    if (swipeTimer.current) clearTimeout(swipeTimer.current);
    swipeTimer.current = setTimeout(() => {
      hasSwiped.current = false;
    }, 140);
  };

  // Trata erro de carregamento progredindo na cadeia de fallback
  const handleImageError = useCallback(() => {
    cacheImageFailed(activeUrl);
    if (chainIndex < fallbackChain.length - 1) {
      // Tenta próximo nível do fallback (imagem alternativa do segmento)
      setChainIndex((prev) => prev + 1);
    } else {
      // Falha total de rede: ativa fallback genérico seguro visual
      setHasFatalError(true);
    }
  }, [activeUrl, chainIndex, fallbackChain.length]);

  const handleImageLoad = useCallback(() => {
    cacheImageLoaded(activeUrl);
    setImageLoaded(true);
    setHasFatalError(false);
  }, [activeUrl]);

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-950 border-b border-slate-800/80 touch-pan-y ${aspectClass} ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClickCapture={(e) => {
        if (hasSwiped.current) {
          e.stopPropagation();
        }
      }}
    >
      {/* 0. Skeleton discreto de carregamento para evitar layout shift */}
      {!imageLoaded && !hasFatalError && (
        <div className="absolute inset-0 bg-slate-800/40 animate-pulse pointer-events-none z-0" />
      )}

      {/* 1. Imagem Real com Fallback Automático e Lazy Loading */}
      {!hasFatalError && (
        <img
          key={activeUrl}
          src={activeUrl}
          alt={`Segmento ${segmentConfig.label} - ${project.titulo}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover object-center transition-opacity duration-200 ease-out will-change-[opacity] select-none ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 2. Fallback Seguro Visual de Nível 3 (se todas as URLs falharem) */}
      {hasFatalError && (
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-to-br ${
            project.corDestaque || segmentConfig.gradient
          } p-3.5 flex flex-col justify-between overflow-hidden select-none`}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5 bg-black/45 px-2 py-0.5 rounded-full border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] font-mono text-white/90 ml-0.5 truncate max-w-[130px]">
                {demoHostname}
              </span>
            </div>

            {badge && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 text-white border border-white/20">
                {badge}
              </span>
            )}
          </div>

          <div className="relative z-10 space-y-0.5">
            <div className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-white/80">
              <Globe className="w-3 h-3 text-cyan-200" />
              <span>{segmentConfig.label}</span>
            </div>
            <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-tight drop-shadow-md truncate">
              {project.titulo}
            </h4>
          </div>
        </div>
      )}

      {/* 3. Badge do plano quando a imagem está visível */}
      {badge && !hasFatalError && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 pointer-events-none">
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-sm text-cyan-300 border border-cyan-500/30 shadow-md">
            {badge}
          </span>
        </div>
      )}

      {/* 4. Indicadores discretos e funcionais (bolinhas) se houver múltiplas fotos - SEM SETAS */}
      {images.length > 1 && !hasFatalError && (
        <div
          role="tablist"
          aria-label={`Galeria de imagens de ${project.titulo}`}
          className="absolute bottom-1.5 left-0 right-0 z-10 flex items-center justify-center gap-0.5 pointer-events-none"
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Ver imagem ${i + 1} de ${images.length}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveIdx(i);
              }}
              className="pointer-events-auto min-h-[28px] min-w-[20px] flex items-center justify-center p-1 focus:outline-none"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === activeIdx
                    ? 'w-3.5 bg-cyan-400 shadow-sm'
                    : 'w-1.5 bg-white/45 hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

ProjectCardImage.displayName = 'ProjectCardImage';
