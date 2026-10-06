import React from 'react';
import { ViewTab, PortfolioProject, ProjectRecommendation } from '../types';
import { getPortfolioProjects } from '../data/portfolioData';
import { getNexawebPlans } from '../data/servicesData';
import { ProjectCardImage } from './ProjectCardImage';
import {
  Layers,
  Sparkles,
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface HomeScreenProps {
  onNavigate: (tab: ViewTab) => void;
  recommendation: ProjectRecommendation | null;
  onOpenRecommendation: () => void;
  onSelectProject: (project: PortfolioProject) => void;
  onSelectPlan: (planId: string) => void;
  onOpenContact: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  recommendation,
  onOpenRecommendation,
  onSelectProject,
  onSelectPlan,
  onOpenContact,
}) => {
  const { language, t } = useTranslation();

  const allProjects = getPortfolioProjects(language);
  const plans = getNexawebPlans(language);

  // Seleciona 4 projetos em destaque para visualização compacta
  const featuredProjects = allProjects.filter((p) => p.destaqueHome).slice(0, 4);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      {/* 1. Card de Boas-Vindas & Ações Rápidas do App */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Aplicativo Oficial
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Crie o site do seu negócio
            </h2>
          </div>

          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Botões de Ação Rápida */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onNavigate('project')}
            className="min-h-[44px] flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-indigo-950/40 transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Iniciar Briefing</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="min-h-[44px] flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs border border-slate-700 transition-all active:scale-[0.98]"
          >
            <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ver Modelos</span>
          </button>
        </div>
      </section>

      {/* Banner de Recomendação Salva (se já respondeu perguntas) */}
      {recommendation && (
        <section className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
              <CheckCircle2 className="w-3 h-3 text-cyan-400" />
              <span>Plano Recomendado</span>
            </div>
            <p className="text-xs font-bold text-white truncate mt-0.5">
              {recommendation.planName} · {recommendation.segmentLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenRecommendation}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 flex items-center gap-1 transition-all"
          >
            <span>Ver</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* 2. PROJETOS EM DESTAQUE (Cards Menores, Proporcionais e Clicáveis) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Demonstrações em Destaque
            </h3>
            <p className="text-[11px] text-slate-500">
              Toque em um modelo para ver os detalhes
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors"
          >
            <span>Ver todos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grid Compacto de Projetos (2 colunas em mobile e tablets para visualização rápida) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {featuredProjects.map((project) => {
            const planBadge = project.planoId ? project.planoId.toUpperCase() : 'PROFISSIONAL';

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-indigo-500/50 transition-all duration-150 flex flex-col justify-between cursor-pointer active:scale-[0.985] group"
              >
                <div>
                  {/* Imagem Proporcional Compacta com Fallback Automático */}
                  <ProjectCardImage
                    project={project}
                    aspectRatio="compact"
                    badge={planBadge}
                  />

                  {/* Informações Compactas do Card */}
                  <div className="p-3 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold text-cyan-400/90 truncate max-w-[120px]">
                        {project.categoria}
                      </span>
                      <span className="font-mono text-slate-500">
                        {planBadge}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {project.titulo}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {project.descricaoCurta}
                    </p>
                  </div>
                </div>

                {/* Rodapé do Card com Ação de Ver Detalhes */}
                <div className="px-3 pb-3 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-[10px] text-slate-500 font-medium">Toque para ver detalhes</span>
                  <span className="font-bold text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Detalhes <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PLANOS OFICIAIS NEXAWEB (Visualização Compacta em Abas/Cards) */}
      <section className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Nossos 4 Planos
            </h3>
            <p className="text-[11px] text-slate-500">
              Soluções transparentes para cada momento do seu negócio
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors"
          >
            <span>Tabela</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => onSelectPlan(plan.id)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between cursor-pointer transition-all active:scale-[0.98] ${
                plan.destaque
                  ? 'bg-indigo-950/40 border-indigo-500/50 text-white shadow-sm ring-1 ring-indigo-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                  {plan.nome}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white block mt-0.5">
                  {plan.preco}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 line-clamp-1 mt-1.5">
                {plan.tagline}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ATALHOS RÁPIDOS ÚTEIS (Portal do Cliente & Suporte) */}
      <section className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => onNavigate('portal')}
          className="min-h-[46px] p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block leading-tight">Área do Cliente</span>
              <span className="text-[10px] text-slate-500 block">Status do projeto</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
        </button>

        <button
          type="button"
          onClick={onOpenContact}
          className="min-h-[46px] p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block leading-tight">Falar com a Equipe</span>
              <span className="text-[10px] text-slate-500 block">Canais oficiais</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
        </button>
      </section>
    </div>
  );
};
