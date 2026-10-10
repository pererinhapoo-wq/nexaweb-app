import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PortfolioProject } from '../types';
import {
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Layers,
  Globe,
  Tag,
  Check,
} from 'lucide-react';
import { BackButton } from './BackButton';
import { useTranslation } from '../contexts/LanguageContext';
import {
  getSegmentConfig,
  buildImageFallbackChain,
  isImageCachedLoaded,
  cacheImageLoaded,
  cacheImageFailed,
} from '../utils/imageService';

interface ProjectDetailScreenProps {
  project: PortfolioProject;
  onBack: () => void;
  onStartBriefing: (project: PortfolioProject, approach: 'exact' | 'inspiration') => void;
}

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  project,
  onBack,
  onStartBriefing,
}) => {
  const { t } = useTranslation();

  // 1. Lista de Imagens Reais do segmento (exibe até 5 imagens por projeto)
  const imageList = useMemo(() => {
    if (project.imagens && project.imagens.length > 0) {
      return project.imagens.slice(0, 5);
    }
    if (project.imagemUrl) {
      return [project.imagemUrl];
    }
    return ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'];
  }, [project.imagemUrl, project.imagens]);

  const hasMultipleImages = imageList.length > 1;

  // Slides estendidos para loop infinito fluido com prévia à direita
  const extendedSlides = useMemo(() => {
    if (imageList.length <= 1) return imageList;
    return [
      imageList[imageList.length - 1], // Slot 0: clone do último para recuo suave
      ...imageList,                    // Slots 1 .. N: slides originais
      imageList[0],                    // Slot N+1: clone do primeiro
      imageList[1 % imageList.length], // Slot N+2: clone do segundo para prévia no slot N+1
    ];
  }, [imageList]);

  // Estado da Galeria (Slot ativo no trilho estendido)
  const [activeSlot, setActiveSlot] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const [loadedUrls, setLoadedUrls] = useState<Record<string, boolean>>({});
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});

  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Gesto de Swipe no celular
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const isHorizontalIntentRef = useRef<boolean | null>(null);

  // Mouse drag para preview desktop
  const isMouseDownRef = useRef<boolean>(false);
  const mouseStartXRef = useRef<number>(0);
  const mouseDeltaXRef = useRef<number>(0);

  // 2. Abordagem do Modelo: Formato padrão para o briefing
  const selectedApproach: 'exact' | 'inspiration' = 'exact';

  const planName = project.planoId ? project.planoId.toUpperCase() : 'PROFISSIONAL';

  // Validação estrita da URL do site
  const hasValidUrl = Boolean(
    project.linkDemo &&
      project.linkDemo.trim() !== '' &&
      (project.linkDemo.startsWith('http://') || project.linkDemo.startsWith('https://'))
  );

  const hostname = hasValidUrl
    ? (() => {
        try {
          return new URL(project.linkDemo).hostname;
        } catch {
          return 'nexaweb.app';
        }
      })()
    : t.projectDetail?.inDevelopment || 'Em desenvolvimento';

  // Índice real correspondente para a UI (0 até N - 1)
  const currentImageIndex = useMemo(() => {
    if (imageList.length <= 1) return 0;
    if (activeSlot === 0) return imageList.length - 1;
    if (activeSlot >= imageList.length + 1) return (activeSlot - 1) % imageList.length;
    return activeSlot - 1;
  }, [activeSlot, imageList.length]);

  // Pré-carregamento otimizado na memória para fluidez imediata
  const preloadedUrlsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    imageList.forEach((url) => {
      if (url && !preloadedUrlsRef.current.has(url)) {
        preloadedUrlsRef.current.add(url);
        const img = new Image();
        img.src = url;
      }
    });
  }, [imageList]);

  // Pausa temporária na troca automática durante ou logo após qualquer interação
  const pauseAutoPlayTemporarily = useCallback(() => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 4500);
  }, []);

  // Navegação para a próxima imagem com transição suave
  const handleNext = useCallback(() => {
    if (!hasMultipleImages) return;
    setIsTransitioning(true);
    setActiveSlot((prev) => prev + 1);
    pauseAutoPlayTemporarily();
  }, [hasMultipleImages, pauseAutoPlayTemporarily]);

  // Navegação para a imagem anterior
  const handlePrev = useCallback(() => {
    if (!hasMultipleImages) return;
    setIsTransitioning(true);
    setActiveSlot((prev) => prev - 1);
    pauseAutoPlayTemporarily();
  }, [hasMultipleImages, pauseAutoPlayTemporarily]);

  // Salto direto para um índice específico (via controles discretos de paginação)
  const handleGoTo = useCallback(
    (targetIndex: number) => {
      if (!hasMultipleImages) return;
      setIsTransitioning(true);
      setActiveSlot(targetIndex + 1);
      pauseAutoPlayTemporarily();
    },
    [hasMultipleImages, pauseAutoPlayTemporarily]
  );

  // Conclusão da transição CSS para reposicionamento instantâneo do loop infinito
  const handleTransitionEnd = () => {
    if (activeSlot >= imageList.length + 1) {
      setIsTransitioning(false);
      setActiveSlot(1);
    } else if (activeSlot <= 0) {
      setIsTransitioning(false);
      setActiveSlot(imageList.length);
    }
  };

  // Reabilita transições no próximo frame após um salto instantâneo de loop
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Troca automática de imagens a cada 5 segundos com respeito a movimento reduzido e pausas
  useEffect(() => {
    if (!hasMultipleImages) return;

    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const appReduced = document.documentElement.classList.contains('reduced-motion');
      if (prefersReduced || appReduced) return;
    }

    if (isPaused || isUserInteracting) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [hasMultipleImages, isPaused, isUserInteracting, handleNext]);

  // Handlers de toque para swipe natural no celular
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsUserInteracting(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchDeltaXRef.current = 0;
    isHorizontalIntentRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - (touchStartYRef.current || 0);

    if (isHorizontalIntentRef.current === null && (Math.abs(deltaX) > 7 || Math.abs(deltaY) > 7)) {
      isHorizontalIntentRef.current = Math.abs(deltaX) > Math.abs(deltaY) * 1.3;
    }

    if (isHorizontalIntentRef.current === true) {
      touchDeltaXRef.current = deltaX;
    }
  };

  const handleTouchEnd = () => {
    setIsUserInteracting(false);
    pauseAutoPlayTemporarily();
    if (touchStartXRef.current === null) return;
    const delta = touchDeltaXRef.current;
    if (isHorizontalIntentRef.current === true && Math.abs(delta) > 30) {
      if (delta < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchDeltaXRef.current = 0;
    isHorizontalIntentRef.current = null;
  };

  // Handlers para mouse (desktop preview e hover pause)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsUserInteracting(true);
    isMouseDownRef.current = true;
    mouseStartXRef.current = e.clientX;
    mouseDeltaXRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    mouseDeltaXRef.current = e.clientX - mouseStartXRef.current;
  };

  const handleMouseUp = () => {
    setIsUserInteracting(false);
    pauseAutoPlayTemporarily();
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    if (Math.abs(mouseDeltaXRef.current) > 30) {
      if (mouseDeltaXRef.current < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    mouseDeltaXRef.current = 0;
  };

  const handleMouseEnter = () => {
    setIsUserInteracting(true);
  };

  const handleMouseLeave = () => {
    setIsUserInteracting(false);
    if (isMouseDownRef.current) {
      handleMouseUp();
    }
  };

  const handleStart = () => {
    onStartBriefing(project, selectedApproach);
  };

  return (
    <div className="space-y-4 pb-10 sm:pb-12 animate-in fade-in duration-200">
      {/* 1. Barra superior com botão Voltar alinhado à esquerda na mesma margem do título e badge do plano */}
      <div className="flex items-center justify-between gap-2 pt-1.5 sm:pt-2">
        <BackButton
          onClick={onBack}
          label={t.header?.back || 'Voltar'}
          className="!justify-start -ml-1.5"
        />
        <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          {t.briefing?.planPrefix || 'Plano'} {planName}
        </span>
      </div>

      {/* 2. Galeria de Cartões com Profundidade Sutil e Prévia Discreta da Próxima Imagem */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div
          className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden select-none p-2.5 sm:p-3"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Trilho horizontal dos cartões com transição lateral suave */}
          <div
            onTransitionEnd={handleTransitionEnd}
            className="flex h-full will-change-transform"
            style={{
              transform: hasMultipleImages
                ? `translateX(calc(-${activeSlot} * (100% - 34px))) translateZ(0)`
                : 'none',
              transition: isTransitioning
                ? 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)'
                : 'none',
            }}
          >
            {extendedSlides.map((imgSrc, slotIdx) => {
              const isCurrent = hasMultipleImages ? slotIdx === activeSlot : true;
              const isNext = hasMultipleImages ? slotIdx === activeSlot + 1 : false;
              const originalUrl = imgSrc;
              const activeUrl = imageOverrides[originalUrl] || originalUrl;
              const isLoaded = Boolean(loadedUrls[originalUrl]);
              const isFailed = Boolean(failedUrls[originalUrl]);

              return (
                <div
                  key={`slot-${slotIdx}-${originalUrl}`}
                  onClick={() => {
                    if (isNext) {
                      handleNext();
                    }
                  }}
                  style={{
                    width: hasMultipleImages ? 'calc(100% - 46px)' : '100%',
                    marginRight: hasMultipleImages ? '12px' : '0px',
                    flexShrink: 0,
                  }}
                  className={`relative h-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border select-none transition-all duration-500 ${
                    isCurrent
                      ? 'border-slate-700/80 shadow-2xl shadow-slate-950/90 scale-100 opacity-100 z-10'
                      : isNext
                      ? 'border-slate-800/80 shadow-md scale-[0.94] opacity-55 hover:opacity-75 cursor-pointer z-0'
                      : 'border-slate-800/50 shadow-sm scale-[0.9] opacity-25 z-0 pointer-events-none'
                  }`}
                >
                  {/* Skeleton Shimmer enquanto imagem carrega */}
                  {!isLoaded && !isFailed && (
                    <div className="absolute inset-0 bg-slate-800/60 animate-pulse pointer-events-none z-0" />
                  )}

                  {!isFailed ? (
                    <img
                      src={activeUrl}
                      alt={`Demonstração ${project.titulo} - Imagem ${slotIdx}`}
                      loading={slotIdx <= 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      onLoad={() => {
                        cacheImageLoaded(activeUrl);
                        setLoadedUrls((prev) => ({ ...prev, [originalUrl]: true }));
                      }}
                      onError={() => {
                        cacheImageFailed(activeUrl);
                        const chain = buildImageFallbackChain(
                          originalUrl,
                          project.categoria || project.segmentoAlvo
                        );
                        if (activeUrl !== chain[1] && chain[1]) {
                          setImageOverrides((prev) => ({ ...prev, [originalUrl]: chain[1] }));
                        } else if (activeUrl !== chain[2] && chain[2]) {
                          setImageOverrides((prev) => ({ ...prev, [originalUrl]: chain[2] }));
                        } else {
                          setFailedUrls((prev) => ({ ...prev, [originalUrl]: true }));
                        }
                      }}
                      className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ) : (
                    /* Fallback elegante caso a imagem falhe */
                    <div
                      className={`absolute inset-0 w-full h-full bg-gradient-to-br ${project.corDestaque} p-4 flex flex-col justify-between overflow-hidden select-none media-fallback-content`}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-1.5 bg-black/45 px-2.5 py-1 rounded-full border border-white/15">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[10px] font-mono text-white/90 ml-1 truncate max-w-[150px]">
                            {hostname}
                          </span>
                        </div>
                        <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 text-white border border-white/20">
                          {planName}
                        </span>
                      </div>

                      <div className="relative z-10 space-y-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
                          <Globe className="w-3.5 h-3.5 text-cyan-200" />
                          {project.categoria}
                        </span>
                        <h3 className="text-base font-extrabold text-white tracking-tight drop-shadow-md">
                          {project.titulo}
                        </h3>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Badge discreto de contagem sobre o cartão principal */}
          {hasMultipleImages && (
            <div className="absolute top-4 right-4 sm:right-5 z-20 pointer-events-none">
              <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-white border border-slate-700/80 shadow-md">
                {currentImageIndex + 1}/{imageList.length}
              </span>
            </div>
          )}

          {/* Indicadores discretos de paginação (pontos na base do cartão principal) */}
          {hasMultipleImages && (
            <div
              role="tablist"
              aria-label={`Galeria de fotos de ${project.titulo}`}
              className="absolute bottom-3.5 left-2.5 right-[56px] z-20 flex items-center justify-center gap-1 pointer-events-none"
            >
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === currentImageIndex}
                  aria-label={`Ver imagem ${idx + 1} de ${imageList.length}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGoTo(idx);
                  }}
                  className="pointer-events-auto p-1 focus:outline-none cursor-pointer"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex
                        ? 'w-4 bg-cyan-400 shadow-sm shadow-cyan-400/50'
                        : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Botão "Iniciar projeto" posicionado imediatamente abaixo do banner e antes das informações */}
      <div className="flex items-center justify-end relative z-10 pt-0.5">
        <button
          type="button"
          onClick={handleStart}
          aria-label={t.projectDetail.startBriefingBtn || 'Iniciar projeto'}
          className="inline-flex items-center justify-center px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-950/40 hover:shadow-cyan-950/40 transition-all duration-150 active:scale-95 cursor-pointer touch-manipulation"
        >
          <span>{t.projectDetail.startBriefingBtn || 'Iniciar projeto'}</span>
        </button>
      </div>

      {/* Informações Básicas do Projeto */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold text-cyan-400">
            <Globe className="w-3.5 h-3.5" />
            {project.categoria}
          </span>
          <span className="text-slate-500 font-mono text-[11px] truncate max-w-[180px]">
            {hostname}
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          {project.titulo}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {project.descricaoCompleta || project.descricaoCurta}
        </p>
      </div>

      {/* 3. Link Real do Projeto (REMOVIDO botão "Ver site", exibindo SOMENTE o link real clicável) */}
      {hasValidUrl && (
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            {t.projectDetail.realProjectLink}
          </span>
          <div>
            <a
              href={project.linkDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 break-all font-mono text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors active:opacity-75"
            >
              <span>{project.linkDemo}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        </div>
      )}

      {/* 4. Segmento Alvo & Nicho */}
      {project.segmentoAlvo && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            {t.projectDetail.targetSegment}
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {project.segmentoAlvo}
          </p>
        </div>
      )}

      {/* 5. Abordagem para seu Site (Informativo) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            {t.projectDetail.approachTitle}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Opção 1: Quero exatamente este formato */}
          <div className="min-h-[60px] p-3 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-300 flex items-start gap-3">
            <div className="mt-0.5 p-1 rounded-lg shrink-0 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold block text-white">
                {t.projectDetail.exactApproachTitle}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                {t.projectDetail.exactApproachDesc}
              </span>
            </div>
          </div>

          {/* Opção 2: Usar como inspiração para personalizar */}
          <div className="min-h-[60px] p-3 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-300 flex items-start gap-3">
            <div className="mt-0.5 p-1 rounded-lg shrink-0 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold block text-white">
                {t.projectDetail.inspirationApproachTitle}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                {t.projectDetail.inspirationApproachDesc}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Recursos Inclusos / O que este modelo apresenta */}
      {project.recursos && project.recursos.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            {t.projectDetail.featuresShowcaseTitle}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {project.recursos.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Tags & Diferenciais */}
      {project.tags && project.tags.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t.projectDetail.techDifferentialsTitle}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
