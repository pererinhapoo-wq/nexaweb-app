import React from 'react';
import { PortfolioProject } from '../types';
import { ProjectCardImage } from './ProjectCardImage';
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
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface ProjectDetailScreenProps {
  project: PortfolioProject;
  onBack: () => void;
  onStartBriefing: (project: PortfolioProject) => void;
}

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  project,
  onBack,
  onStartBriefing,
}) => {
  const { t } = useTranslation();

  const planName = project.planoId ? project.planoId.toUpperCase() : 'PROFISSIONAL';

  const handleOpenLiveSite = () => {
    if (project.linkDemo) {
      window.open(project.linkDemo, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* Top Bar Contextual */}
      <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Voltar</span>
        </button>

        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          Plano {planName}
        </span>
      </div>

      {/* Hero Preview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <ProjectCardImage
          project={project}
          aspectRatio="video"
          badge={planName}
        />

        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold text-cyan-400">
              <Globe className="w-3.5 h-3.5" />
              {project.categoria}
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              {new URL(project.linkDemo).hostname}
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

      {/* Segmento Alvo & Nicho */}
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

      {/* O que este modelo apresenta / Recursos Inclusos */}
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

      {/* Tags & Diferenciais */}
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

      {/* Nota de Padrão NexaWeb */}
      <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-400 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Projeto conceito oficial NexaWeb. Solicite este mesmo padrão adaptado para as cores, logotipo e conteúdo do seu negócio.
        </span>
      </div>

      {/* Barra de Ações Fixa no Rodapé Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 shadow-2xl">
        <div className="max-w-3xl mx-auto flex items-center gap-2.5">
          {/* Botão Secundário: Ver site no ar (externo) */}
          <button
            type="button"
            onClick={handleOpenLiveSite}
            className="min-h-[48px] flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs border border-slate-700 hover:border-cyan-500/50 transition-all active:scale-[0.98]"
          >
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            <span>Ver site no ar</span>
          </button>

          {/* Botão Principal: Quero esse site (inicia o Briefing com este projeto pré-selecionado) */}
          <button
            type="button"
            onClick={() => onStartBriefing(project)}
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
