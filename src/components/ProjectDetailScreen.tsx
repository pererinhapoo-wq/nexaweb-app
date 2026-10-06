import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PortfolioProject } from '../types';
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Layers,
  Globe,
  Tag,
  ShieldCheck,
  Send,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

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

  // 1. Lista de Imagens Reais estável com useMemo (Suporte a imagem única ou múltiplas perspectivas)
  const imageList = useMemo(() => {
    const defaultCaptureUrl =
      project.imagemUrl ||
      `https://image.thum.io/get/width/900/crop/550/noanimate/${project.linkDemo}`;

    return project.imagens && project.imagens.length > 0
      ? project.imagens
      : [defaultCaptureUrl];
  }, [project.imagemUrl, project.linkDemo, project.imagens]);

  const hasMultipleImages = imageList.length > 1;

  // Estado do Carrossel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [isInteracting, setIsInteracting] = useState(false);

  // Gesto de Swipe no celular
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef<number>(0);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 2. Abordagem do Modelo: Exatamente o mesmo formato OU Inspiração para personalizar
  const [selectedApproach, setSelectedApproach] = useState<'exact' | 'inspiration'>('exact');

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
    : 'Em desenvolvimento';

  // Navegação manual de imagem
  const handlePrevImage = useCallback(() => {
    setIsInteracting(true);
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1));
  }, [imageList.length]);

  const handleNextImage = useCallback(() => {
    setIsInteracting(true);
    setCurrentImageIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));
  }, [imageList.length]);

  // Pré-carregamento sob demanda SOMENTE da próxima imagem
  useEffect(() => {
    if (hasMultipleImages) {
      const nextIdx = (currentImageIndex + 1) % imageList.length;
      const img = new Image();
      img.src = imageList[nextIdx];
    }
  }, [currentImageIndex, imageList, hasMultipleImages]);

  // Autoplay lento suave apenas quando houver múltiplas imagens e o usuário não estiver interagindo
  useEffect(() => {
    if (!hasMultipleImages || isInteracting) return;

    autoplayTimerRef.current = setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
    }, 6000);

    return () => {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    };
  }, [currentImageIndex, hasMultipleImages, isInteracting, imageList.length]);

  // Retoma autoplay após 8s de inatividade do usuário
  useEffect(() => {
    if (!isInteracting) return;
    const resumeTimer = setTimeout(() => {
      setIsInteracting(false);
    }, 8000);
    return () => clearTimeout(resumeTimer);
  }, [isInteracting]);

  // Handlers de toque para swipe natural no mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchDeltaXRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null) return;
    const delta = touchDeltaXRef.current;
    if (delta < -45) {
      handleNextImage();
    } else if (delta > 45) {
      handlePrevImage();
    }
    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  };

  const handleOpenLiveSite = () => {
    if (hasValidUrl) {
      window.open(project.linkDemo, '_blank', 'noopener,noreferrer');
    }
  };

  const handleStart = () => {
    onStartBriefing(project, selectedApproach);
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* 1. Barra de Acesso e Voltar Contextual */}
      <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold active:scale-95"
          aria-label="Voltar para a tela anterior"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Voltar</span>
        </button>

        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          Plano {planName}
        </span>
      </div>

      {/* 2. Carrossel / Imagem Principal */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div
          className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsInteracting(true)}
        >
          {/* Skeleton Shimmer enquanto imagem carrega */}
          {!loadedImages[currentImageIndex] && !failedImages[currentImageIndex] && (
            <div className="absolute inset-0 bg-slate-800/60 animate-pulse pointer-events-none z-0" />
          )}

          {/* Imagem Real */}
          {!failedImages[currentImageIndex] ? (
            <img
              key={`img-${currentImageIndex}`}
              src={imageList[currentImageIndex]}
              alt={`Demonstração ${project.titulo} - Imagem ${currentImageIndex + 1}`}
              loading={currentImageIndex === 0 ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={() =>
                setLoadedImages((prev) => ({ ...prev, [currentImageIndex]: true }))
              }
              onError={() =>
                setFailedImages((prev) => ({ ...prev, [currentImageIndex]: true }))
              }
              className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
                loadedImages[currentImageIndex] ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            /* Fallback elegante caso a captura falhe */
            <div
              className={`absolute inset-0 w-full h-full bg-gradient-to-br ${project.corDestaque} p-4 flex flex-col justify-between overflow-hidden select-none`}
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

          {/* Badge de Posição: Apenas se houver múltiplas imagens */}
          {hasMultipleImages && (
            <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white border border-slate-700/80 shadow-md">
                {currentImageIndex + 1}/{imageList.length}
              </span>
            </div>
          )}

          {/* Botões de Troca Manual: Apenas se houver múltiplas imagens */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="min-h-[44px] min-w-[44px] absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white/90 hover:text-white border border-slate-700/80 shadow-lg active:scale-95 transition-all"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                className="min-h-[44px] min-w-[44px] absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white/90 hover:text-white border border-slate-700/80 shadow-lg active:scale-95 transition-all"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Indicadores / Dots: Apenas se houver múltiplas imagens */}
              <div className="absolute bottom-2.5 left-0 right-0 z-20 flex items-center justify-center gap-1.5 pointer-events-none">
                {imageList.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsInteracting(true);
                      setCurrentImageIndex(idx);
                    }}
                    className={`pointer-events-auto h-1.5 transition-all rounded-full ${
                      idx === currentImageIndex
                        ? 'w-6 bg-cyan-400'
                        : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Ir para a imagem ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Informações Básicas do Projeto */}
        <div className="p-4 sm:p-5 space-y-3">
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
      </div>

      {/* 3. Segmento Alvo & Nicho */}
      {project.segmentoAlvo && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Segmento Alvo
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {project.segmentoAlvo}
          </p>
        </div>
      )}

      {/* 4. Escolha da Abordagem do Modelo (Antes de iniciar o briefing) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Abordagem para seu Site
          </label>
          <span className="text-[10px] text-slate-400 font-medium">
            Selecione uma opção
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Opção A: Quero exatamente este formato */}
          <button
            type="button"
            onClick={() => setSelectedApproach('exact')}
            className={`min-h-[60px] p-3 rounded-xl border text-left transition-all active:scale-[0.99] flex items-start gap-3 ${
              selectedApproach === 'exact'
                ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/50 text-white shadow-md'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div
              className={`mt-0.5 p-1 rounded-lg shrink-0 ${
                selectedApproach === 'exact'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold block text-white">
                Quero exatamente este formato
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                Mesma estrutura visual, adaptada com seus textos, logotipo, fotos e contatos.
              </span>
            </div>
          </button>

          {/* Opção B: Usar como inspiração para personalizar */}
          <button
            type="button"
            onClick={() => setSelectedApproach('inspiration')}
            className={`min-h-[60px] p-3 rounded-xl border text-left transition-all active:scale-[0.99] flex items-start gap-3 ${
              selectedApproach === 'inspiration'
                ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50 text-white shadow-md'
                : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div
              className={`mt-0.5 p-1 rounded-lg shrink-0 ${
                selectedApproach === 'inspiration'
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold block text-white">
                Usar como inspiração para personalizar
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                Referência estética com liberdade para definir seções, cores e módulos específicos.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Recursos Inclusos / O que este modelo apresenta */}
      {project.recursos && project.recursos.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            O que este modelo apresenta
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

      {/* 6. Tags & Diferenciais */}
      {project.tags && project.tags.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Diferenciais & Tecnologia
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

      {/* 7. Nota de Padrão NexaWeb */}
      <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-400 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Projeto conceito oficial NexaWeb. Ao solicitar, este mesmo padrão é entregue publicado com seu domínio, identidade e conteúdo.
        </span>
      </div>

      {/* 8. Barra de Ações Fixa no Rodapé Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-2xl">
        <div className="max-w-3xl mx-auto flex items-center gap-2.5">
          {/* Botão Secundário: Ver site no ar */}
          <button
            type="button"
            onClick={handleOpenLiveSite}
            disabled={!hasValidUrl}
            className={`min-h-[48px] flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl border font-bold text-xs transition-all active:scale-[0.98] ${
              hasValidUrl
                ? 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-slate-700 hover:border-cyan-500/50'
                : 'bg-slate-900/50 text-slate-500 border-slate-800 cursor-not-allowed opacity-60'
            }`}
            title={hasValidUrl ? 'Abrir site oficial em nova guia' : 'Demonstração sem link público'}
          >
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            <span>{hasValidUrl ? 'Ver site no ar' : 'Site em homologação'}</span>
          </button>

          {/* Botão Principal: Quero esse site */}
          <button
            type="button"
            onClick={handleStart}
            className="min-h-[48px] flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 transition-all active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>Quero esse site</span>
          </button>
        </div>
      </div>
    </div>
  );
};
