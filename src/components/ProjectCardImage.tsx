import React, { useState } from 'react';
import { PortfolioProject } from '../types';
import { Sparkles, Globe } from 'lucide-react';

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

  // Sistema de imagem: 1. Imagem manual/admin -> 2. Captura automática via URL real -> 3. Fallback estilizado
  const autoCaptureUrl = project.imagemUrl || `https://image.thum.io/get/width/720/crop/480/noanimate/${project.linkDemo}`;

  const aspectClass =
    aspectRatio === 'compact'
      ? 'aspect-[16/8]'
      : aspectRatio === 'video'
      ? 'aspect-[16/9]'
      : 'aspect-[16/10]';

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-900 border-b border-slate-800/80 ${aspectClass} ${className}`}
    >
      {/* 1. Camada de Imagem Real / Automática */}
      {!imageError && (
        <img
          src={autoCaptureUrl}
          alt={`Demonstração ${project.titulo}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 2. Camada de Fallback Sofisticada (ativa enquanto carrega ou se falhar) */}
      {(!imageLoaded || imageError) && (
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-to-br ${project.corDestaque} p-4 flex flex-col justify-between overflow-hidden select-none`}
        >
          {/* Luz de fundo decorativa */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-28 h-28 bg-black/20 rounded-full blur-xl pointer-events-none" />

          {/* Top Bar com Mock do Navegador */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
              <span className="w-2 h-2 rounded-full bg-rose-400/90" />
              <span className="w-2 h-2 rounded-full bg-amber-400/90" />
              <span className="w-2 h-2 rounded-full bg-emerald-400/90" />
              <span className="text-[10px] font-mono text-white/90 ml-1 truncate max-w-[130px] sm:max-w-[180px]">
                {new URL(project.linkDemo).hostname}
              </span>
            </div>

            {badge && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 text-white border border-white/20">
                {badge}
              </span>
            )}
          </div>

          {/* Central Title & Category */}
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
              <Globe className="w-3 h-3 text-cyan-200" />
              <span>{project.categoria}</span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-md truncate">
              {project.titulo}
            </h4>
            <p className="text-[11px] text-white/90 line-clamp-1">
              {project.descricaoCurta}
            </p>
          </div>
        </div>
      )}

      {/* 3. Badge Sobreposta Fixa no Canto Superior Direito se imagem real carregou */}
      {imageLoaded && !imageError && (
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
          {badge && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 shadow-md">
              {badge}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>
      )}
    </div>
  );
};
