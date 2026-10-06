import React, { useState, useEffect } from 'react';
import { ViewTab, PortfolioProject, ProjectRecommendation } from '../types';
import { getPortfolioProjects } from '../data/portfolioData';
import { ProjectCardImage } from './ProjectCardImage';
import {
  Sparkles,
  Layers,
  Users,
  FolderKanban,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Zap,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface HomeScreenProps {
  onNavigate: (tab: ViewTab) => void;
  recommendation: ProjectRecommendation | null;
  onOpenRecommendation: () => void;
  onSelectProject: (project: PortfolioProject) => void;
  onSelectPlan: (planId: string) => void;
  onOpenContact: () => void;
  onStartQuiz?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  recommendation,
  onOpenRecommendation,
  onSelectProject,
  onSelectPlan,
  onOpenContact,
  onStartQuiz,
}) => {
  const { language } = useTranslation();

  // Carrega apenas os 4 projetos em destaque para máxima performance
  const featuredProjects = getPortfolioProjects(language)
    .filter((p) => p.destaqueHome)
    .slice(0, 4);

  // Mini-banner rotativo suave e compacto
  const highlights = [
    {
      icon: Zap,
      text: 'Sites de alta conversão otimizados para WhatsApp',
      color: 'text-amber-400',
    },
    {
      icon: Smartphone,
      text: 'Design responsivo e veloz para qualquer celular',
      color: 'text-cyan-400',
    },
    {
      icon: ShieldCheck,
      text: 'Projetos profissionais entregues em até 7 dias',
      color: 'text-emerald-400',
    },
  ];

  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHighlightIndex((prev) => (prev + 1) % highlights.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [highlights.length]);

  const activeHighlight = highlights[currentHighlightIndex];
  const HighlightIcon = activeHighlight.icon;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      {/* 1. CABEÇALHO COMPACTO & AMIGÁVEL */}
      <section className="pt-0.5">
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
          <span>Olá</span>
          <span className="inline-block select-none">👋</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          O que você quer fazer hoje?
        </p>
      </section>

      {/* 2. BANNER COMPACTO ROTATIVO SUAVE */}
      <section
        onClick={() => setCurrentHighlightIndex((prev) => (prev + 1) % highlights.length)}
        className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2.5 cursor-pointer active:scale-[0.99] transition-all"
        title="Toque para alternar destaque"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
            <HighlightIcon className={`w-3.5 h-3.5 ${activeHighlight.color}`} />
          </div>
          <p className="text-[11.5px] font-semibold text-slate-200 truncate">
            {activeHighlight.text}
          </p>
        </div>

        {/* Indicadores discretos */}
        <div className="flex items-center gap-1 shrink-0">
          {highlights.map((_, idx) => (
            <span
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentHighlightIndex ? 'bg-cyan-400 w-3' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 3. AÇÃO PRINCIPAL / CTA: "Criar meu site" */}
      <section>
        <button
          type="button"
          onClick={() => onNavigate('project')}
          className="w-full text-left p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-950/40 border border-indigo-400/30 transition-all duration-150 active:scale-[0.985] group flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-extrabold text-white block leading-snug">
                Criar meu site
              </span>
              <span className="text-[11px] text-indigo-100/90 block truncate mt-0.5">
                Inicie o briefing oficial em poucos passos
              </span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </button>
      </section>

      {/* 4. ATALHOS COMPACTOS (Encontrar clientes, Meus leads, Portfólio) */}
      <section className="grid grid-cols-3 gap-2">
        {/* Atalho 1: Encontrar clientes */}
        <button
          type="button"
          onClick={() => onNavigate('services')}
          className="min-h-[50px] p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left flex flex-col justify-between transition-all active:scale-[0.97]"
        >
          <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-1">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-white block leading-tight truncate">
              Encontrar clientes
            </span>
            <span className="text-[9.5px] text-slate-500 block truncate">
              Planos & soluções
            </span>
          </div>
        </button>

        {/* Atalho 2: Meus leads */}
        <button
          type="button"
          onClick={() => onNavigate('admin')}
          className="min-h-[50px] p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left flex flex-col justify-between transition-all active:scale-[0.97]"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-white block leading-tight truncate">
              Meus leads
            </span>
            <span className="text-[9.5px] text-slate-500 block truncate">
              Painel da equipe
            </span>
          </div>
        </button>

        {/* Atalho 3: Portfólio */}
        <button
          type="button"
          onClick={() => onNavigate('portfolio')}
          className="min-h-[50px] p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left flex flex-col justify-between transition-all active:scale-[0.97]"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-1">
            <FolderKanban className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-white block leading-tight truncate">
              Portfólio
            </span>
            <span className="text-[9.5px] text-slate-500 block truncate">
              Ver demonstrações
            </span>
          </div>
        </button>
      </section>

      {/* 5. "ME AJUDA A ESCOLHER UM PLANO" (ÁREA SECUNDÁRIA) */}
      <section>
        <button
          type="button"
          onClick={() => (onStartQuiz ? onStartQuiz() : onOpenRecommendation())}
          className="w-full text-left p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all active:scale-[0.985] flex items-center justify-between gap-2.5"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 text-cyan-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                Não sabe qual plano escolher?
              </span>
              <span className="text-[10.5px] text-slate-400 block truncate">
                Responda 2 perguntas e descubra o plano ideal.
              </span>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-cyan-400 shrink-0 flex items-center gap-0.5">
            Descobrir <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </section>

      {/* 6. PROJETOS EM DESTAQUE (CARD INTEIRO CLICÁVEL, MÁXIMO 4 CARDS) */}
      <section className="space-y-2.5 pt-0.5">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Projetos em destaque
          </h2>

          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grid de 2 colunas: Card inteiro é clicável sem botão interno */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {featuredProjects.map((project) => {
            const planBadge = project.planoId ? project.planoId.toUpperCase() : 'PROFISSIONAL';

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-slate-700 transition-all duration-150 flex flex-col justify-between cursor-pointer active:scale-[0.98] group"
              >
                <div>
                  <ProjectCardImage
                    project={project}
                    aspectRatio="compact"
                    badge={planBadge}
                  />

                  <div className="p-2.5 space-y-0.5">
                    <span className="text-[10px] font-semibold text-cyan-400 block truncate">
                      {project.categoria}
                    </span>
                    <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {project.titulo}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
