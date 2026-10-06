import React from 'react';
import { ViewTab, ProjectRecommendation } from '../types';
import { getPortfolioProjects, getPortfolioCategories } from '../data/portfolioData';
import { getNexawebPlans } from '../data/servicesData';
import { ProjectCardImage } from './ProjectCardImage';
import {
  Layers,
  Briefcase,
  Sparkles,
  ArrowRight,
  Zap,
  Smartphone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Check,
  Globe,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface HomeScreenProps {
  onNavigate: (tab: ViewTab) => void;
  recommendation: ProjectRecommendation | null;
  onOpenRecommendation: () => void;
  onOpenOnboarding: () => void;
  onSelectProjectForBriefing?: (projectTitle: string) => void;
  onSelectPlan?: (planId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  recommendation,
  onOpenRecommendation,
  onOpenOnboarding,
  onSelectProjectForBriefing,
  onSelectPlan,
}) => {
  const { language, t } = useTranslation();

  const allProjects = getPortfolioProjects(language);
  const categories = getPortfolioCategories(language);
  const plans = getNexawebPlans(language);

  // Seleciona exatamente 3 a 4 projetos reais em destaque para a Home
  const featuredProjects = allProjects.filter((p) => p.destaqueHome).slice(0, 4);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. HERO — IDENTIDADE NEXAWEB */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/25 p-5 sm:p-6 shadow-xl shadow-indigo-950/30">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>NexaWeb Oficial</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NexaWeb
          </h1>
          <p className="text-base sm:text-lg font-bold text-cyan-400 mt-0.5">
            Sites profissionais para o seu negócio.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg leading-relaxed">
            Desenvolvemos sites profissionais de alta performance, modernos e focados em destacar sua marca e gerar mais contatos.
          </p>

          {/* 2. APRESENTAÇÃO CURTA — DIFERENCIAIS */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-900/70 rounded-xl p-2.5 border border-slate-800 text-center">
              <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="text-[11px] text-slate-200 font-bold block">{t.home.speedTitle}</span>
              <span className="text-[10px] text-slate-400 block truncate">{t.home.speedSubtitle}</span>
            </div>
            <div className="bg-slate-900/70 rounded-xl p-2.5 border border-slate-800 text-center">
              <Smartphone className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <span className="text-[11px] text-slate-200 font-bold block">{t.home.mobileTitle}</span>
              <span className="text-[10px] text-slate-400 block truncate">{t.home.mobileSubtitle}</span>
            </div>
            <div className="bg-slate-900/70 rounded-xl p-2.5 border border-slate-800 text-center">
              <MessageCircle className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[11px] text-slate-200 font-bold block">{t.home.conversionTitle}</span>
              <span className="text-[10px] text-slate-400 block truncate">{t.home.conversionSubtitle}</span>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER DE RECOMENDAÇÃO INTELIGENTE (se preenchido) */}
      {recommendation && (
        <section className="rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/35 p-4 shadow-md space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">
                  {t.home.recommendationBannerTitle}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {recommendation.planName} • {recommendation.segmentLabel}
                </p>
              </div>
            </div>

            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
              Personalizado
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onOpenRecommendation}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-indigo-950/50 hover:from-indigo-500 hover:to-cyan-400 transition-all"
            >
              <span>{t.home.viewRecommendationBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onOpenOnboarding}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              title={t.home.redoQuestionsBtn}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.home.redoQuestionsBtn}</span>
            </button>
          </div>
        </section>
      )}

      {/* 3 & 4. CTAs PRINCIPAIS: CONHECER SERVIÇOS & INICIAR PROJETO */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* CTA 1: Conhecer os Serviços */}
        <button
          type="button"
          onClick={() => onNavigate('services')}
          className="min-h-[52px] w-full text-left group relative flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all duration-150 shadow-md active:scale-[0.985]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-indigo-500/20 transition-all shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base text-white group-hover:text-indigo-300 transition-colors">
                  Conhecer Serviços
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  4 Planos
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Essencial, Profissional, Sob Medida e Premium
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-all shrink-0">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* CTA 2: Iniciar um Projeto */}
        <button
          type="button"
          onClick={() => onNavigate('project')}
          className="min-h-[52px] w-full text-left group relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 hover:from-indigo-900/50 hover:to-slate-850 border border-indigo-500/40 hover:border-indigo-400 transition-all duration-150 shadow-md shadow-indigo-950/20 active:scale-[0.985]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white flex items-center justify-center group-hover:scale-105 shadow-md shadow-indigo-600/30 transition-all shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                  Iniciar Projeto
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Briefing
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Preencha a proposta do site da sua empresa
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-300 transition-all shrink-0">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </section>

      {/* 5. ALGUNS PROJETOS REAIS (APENAS 3 A 4 PROJETOS SELECIONADOS COM IMAGENS REAIS E BOTÃO "VER SITE") */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>Projetos em Destaque</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Modelos e sites reais desenvolvidos pela NexaWeb
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredProjects.map((project) => {
            const catName = categories.find((c) => c.id === project.categoria)?.nome || project.categoria;
            const planName = project.planoId ? project.planoId.toUpperCase() : 'PROFISSIONAL';

            return (
              <div
                key={project.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md hover:border-slate-700 transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  {/* Imagem do Projeto com Proporção Perfeita Mobile */}
                  <ProjectCardImage
                    project={project}
                    aspectRatio="card"
                    badge={planName}
                  />

                  {/* Informações do Card */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <span className="font-semibold text-slate-400">
                        {catName}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        Plano {planName}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                      {project.titulo}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {project.descricaoCurta}
                    </p>
                  </div>
                </div>

                {/* Botões de Ação do Card: "Ver site" com URL REAL */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <a
                    href={project.linkDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 font-bold text-xs border border-slate-700 hover:border-cyan-500/40 transition-all active:scale-[0.98]"
                  >
                    <span>Ver site</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>

                  {onSelectProjectForBriefing && (
                    <button
                      type="button"
                      onClick={() => onSelectProjectForBriefing(project.titulo)}
                      className="min-h-[44px] flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-950 transition-all active:scale-[0.98]"
                    >
                      <span>Quero este</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. DESTAQUE DE QUALIDADE & PADRÃO NEXAWEB */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Qualidade & Padrão NexaWeb</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Cada projeto é estruturado para proporcionar velocidade máxima de carregamento, navegação limpa em smartphones e direcionamento estratégico para o seu negócio.
        </p>
        <div className="pt-1 flex items-center justify-between">
          <a
            href="https://nexaweeb.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Conhecer o site oficial da NexaWeb</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 7. PLANOS REAIS DA NEXAWEB EM DESTAQUE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Nossos Planos Oficiais</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Modelos estruturados para cada momento do seu negócio
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>Ver detalhes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`p-4 rounded-2xl bg-slate-900 border transition-all ${
                p.id === 'profissional'
                  ? 'border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                  : p.id === 'essencial'
                  ? 'border-blue-500/30'
                  : p.id === 'personalizado'
                  ? 'border-purple-500/30'
                  : 'border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-white tracking-tight">
                  {p.nome}
                </span>
                <span className="text-xs font-black font-mono text-cyan-300">
                  {p.preco}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {p.descricao}
              </p>
              {p.prazo && (
                <span className="text-[10px] text-slate-500 font-mono mt-1.5 block">
                  Prazo médio: {p.prazo}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. CTA FINAL — INICIAR UM PROJETO */}
      <section className="rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-cyan-950/60 border border-indigo-500/40 p-5 sm:p-6 text-center space-y-3.5 shadow-xl">
        <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            Pronto para colocar seu site no ar?
          </h2>
          <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1 leading-relaxed">
            Inicie seu briefing agora mesmo ou converse com nossa equipe pelos canais oficiais da NexaWeb.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onNavigate('project')}
            className="min-h-[46px] w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span>Iniciar Projeto Agora</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="min-h-[46px] w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
          >
            Comparar Planos
          </button>
        </div>
      </section>
    </div>
  );
};
