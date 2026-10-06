import React, { useState, useMemo, useRef } from 'react';
import { PortfolioProject } from '../types';
import { Globe } from 'lucide-react';

interface ProjectCardImageProps {
  project: PortfolioProject;
  aspectRatio?: 'video' | 'card' | 'compact';
  className?: string;
  badge?: string;
  enableSwipe?: boolean;
}

// Cache em memória de URLs de imagens já carregadas nesta sessão
const loadedImageUrls = new Set<string>();
const failedImageUrls = new Set<string>();

export const ProjectCardImage: React.FC<ProjectCardImageProps> = React.memo(({
  project,
  aspectRatio = 'card',
  className = '',
  badge,
  enableSwipe = true,
}) => {
  // Lista de imagens reais do segmento
  const images = useMemo(() => {
    if (project.imagens && project.imagens.length > 0) {
      return project.imagens;
    }
    if (project.imagemUrl) {
      return [project.imagemUrl];
    }
    return ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'];
  }, [project.imagens, project.imagemUrl]);

  const [activeIdx, setActiveIdx] = useState(0);
  const currentUrl = images[activeIdx] || images[0];

  const [imageError, setImageError] = useState(() => failedImageUrls.has(currentUrl));
  const [imageLoaded, setImageLoaded] = useState(() => loadedImageUrls.has(currentUrl));

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

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

  // Suporte a swipe suave caso o card possua múltiplas imagens
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipe || images.length <= 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!enableSwipe || images.length <= 1 || touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - (touchStartY.current || 0);

    // Se foi movimento horizontal evidente
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      e.stopPropagation(); // Evita abrir o card no swipe
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
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-950 border-b border-slate-800/80 ${aspectClass} ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 0. Placeholder leve de carregamento */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-slate-800/40 pointer-events-none z-0" />
      )}

      {/* 1. Imagem Real do Segmento com Lazy Loading */}
      {!imageError && (
        <img
          key={currentUrl}
          src={currentUrl}
          alt={`Segmento ${project.titulo}`}
          loading="lazy"
          decoding="async"
          onLoad={() => {
            loadedImageUrls.add(currentUrl);
            setImageLoaded(true);
          }}
          onError={() => {
            failedImageUrls.add(currentUrl);
            setImageError(true);
          }}
          className={`w-full h-full object-cover object-center transition-opacity duration-200 ease-out will-change-[opacity] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 2. Fallback elegante de gradiente se a imagem falhar */}
      {(!imageLoaded || imageError) && (
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-to-br ${project.corDestaque} p-3 flex flex-col justify-between overflow-hidden select-none`}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full border border-white/15">
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
              <span>{project.categoria}</span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight drop-shadow-md truncate">
              {project.titulo}
            </h4>
          </div>
        </div>
      )}

      {/* 3. Badge do plano quando imagem está visível */}
      {badge && !imageError && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 pointer-events-none">
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-sm text-cyan-300 border border-cyan-500/30 shadow-md">
            {badge}
          </span>
        </div>
      )}

      {/* 4. Indicadores pequenos e discretos (bolinhas) se houver múltiplas fotos - SEM SETAS */}
      {images.length > 1 && !imageError && (
        <div className="absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-1 pointer-events-none">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-200 ${
                i === activeIdx
                  ? 'w-3.5 bg-cyan-400 shadow-sm'
                  : 'w-1 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ProjectCardImage.displayName = 'ProjectCardImage';
