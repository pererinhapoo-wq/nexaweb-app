import React, { useState } from 'react';
import { PortfolioProject } from '../types';
import { Globe } from 'lucide-react';

interface ProjectCardImageProps {
  project: PortfolioProject;
  aspectRatio?: 'video' | 'card' | 'compact';
  className?: string;
  badge?: string;
}

export const ProjectCardImage: React.FC<ProjectCardImageProps> = ({
  project,
  aspectRatio = 'card',
  className = '',
  badge,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Captura proporcional do site real (800x500 = 16:10, ideal para mobile e desktop)
  const autoCaptureUrl =
    project.imagemUrl ||
    `https://image.thum.io/get/width/800/crop/500/noanimate/${project.linkDemo}`;

  const aspectClass =
    aspectRatio === 'compact'
      ? 'aspect-[16/9]'
      : aspectRatio === 'video'
      ? 'aspect-[16/9]'
      : 'aspect-[16/10]';

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-950 border-b border-slate-800/80 ${aspectClass} ${className}`}
    >
      {/* 0. Placeholder leve de carregamento enquanto a imagem baixa */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-slate-800/40 pointer-events-none z-0" />
      )}

      {/* 1. Imagem Real com Lazy Loading e enquadramento inteligente */}
      {!imageError && (
        <img
          src={autoCaptureUrl}
          alt={`Demonstração ${project.titulo}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover object-top transition-opacity duration-200 ease-out will-change-[opacity] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 2. Fallback elegante de gradiente caso a imagem falhe ou demore */}
      {(!imageLoaded || imageError) && (
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-to-br ${project.corDestaque} p-3.5 flex flex-col justify-between overflow-hidden select-none`}
        >
          {/* Luz de fundo suave decorativa */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

          {/* Barra superior estilo navegador */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9.5px] font-mono text-white/90 ml-0.5 truncate max-w-[130px]">
                {new URL(project.linkDemo).hostname}
              </span>
            </div>

            {badge && (
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 text-white border border-white/20">
                {badge}
              </span>
            )}
          </div>

          {/* Informações da demo */}
          <div className="relative z-10 space-y-0.5">
            <div className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-white/80">
              <Globe className="w-3 h-3 text-cyan-200" />
              <span>{project.categoria}</span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight drop-shadow-md truncate">
              {project.titulo}
            </h4>
          </div>
        </div>
      )}

      {/* 3. Badge do plano no canto quando imagem real está carregada */}
      {imageLoaded && !imageError && badge && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 pointer-events-none">
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/85 text-cyan-300 border border-cyan-500/30 shadow-md">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
};
