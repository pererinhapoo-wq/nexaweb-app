import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ViewTab, PortfolioProject, ProjectRecommendation } from '../types';
import { getPortfolioProjects, getPortfolioCategories } from '../data/portfolioData';
import { ProjectCardImage } from './ProjectCardImage';
import {
  getSegmentConfig,
  GLOBAL_SAFE_FALLBACK_IMAGE,
} from '../utils/imageService';
import {
  Sparkles,
  Layers,
  Users,
  FolderKanban,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Scissors,
  Dumbbell,
  UtensilsCrossed,
  Stethoscope,
  Building2,
  HardHat,
  ShoppingBag,
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface BannerSlide {
  id: string;
  segmento: string;
  titulo: string;
  subtitulo: string;
  imagemUrl: string;
  projectId: string;
}

// Banners oficiais dos segmentos da NexaWeb com fotografias profissionais reais de cada segmento
const getBannerSlides = (lang: string): BannerSlide[] => {
  if (lang === 'en') {
    return [
      {
        id: 'banner-geral',
        segmento: 'Professional Websites',
        titulo: 'Your business deserves a professional website',
        subtitulo: 'Modern, ultra-fast projects engineered for your brand.',
        imagemUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        projectId: 'demo-vertex-digital',
      },
      {
        id: 'banner-academia',
        segmento: 'Gym & Fitness',
        titulo: 'More power for your fitness center',
        subtitulo: 'Showcase memberships, classes and attract new members on mobile.',
        imagemUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        projectId: 'demo-academia-premium',
      },
      {
        id: 'banner-restaurante',
        segmento: 'Restaurant & Gastronomy',
        titulo: 'Your menu always in the spotlight',
        subtitulo: 'Mouth-watering photography, specials and direct reservation channel.',
        imagemUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        projectId: 'demo-restaurante-premium',
      },
      {
        id: 'banner-barbearia',
        segmento: 'Barbershop & Grooming',
        titulo: 'Elevate your barbershop brand',
        subtitulo: 'Seamless haircut bookings and bold brand presence.',
        imagemUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
        projectId: 'demo-barbearia-kings',
      },
      {
        id: 'banner-clinica',
        segmento: 'Clinic & Healthcare',
        titulo: 'Authority for your medical practice',
        subtitulo: 'Compassionate design focused on specialties and trust.',
        imagemUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
        projectId: 'demo-clinica-saude',
      },
      {
        id: 'banner-imobiliaria',
        segmento: 'Real Estate & Properties',
        titulo: 'Stunning visuals for luxury real estate',
        subtitulo: 'Exclusive showcase for brokers and high-end properties.',
        imagemUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        projectId: 'demo-imobiliaria-premium',
      },
      {
        id: 'banner-engenharia',
        segmento: 'Engineering & Construction',
        titulo: 'Solid foundations for your company',
        subtitulo: 'Technical project presentation and established market authority.',
        imagemUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
        projectId: 'demo-engenharia-premium',
      },
      {
        id: 'banner-loja',
        segmento: 'Store & Retail',
        titulo: 'Your store ready to drive sales',
        subtitulo: 'Modern display for collections, brands and featured products.',
        imagemUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
        projectId: 'demo-loja-premium',
      },
    ];
  }

  return [
    {
      id: 'banner-geral',
      segmento: 'Sites Profissionais',
      titulo: 'Seu negócio merece um site profissional',
      subtitulo: 'Projetos modernos, rápidos e pensados para sua marca.',
      imagemUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      projectId: 'demo-vertex-digital',
    },
    {
      id: 'banner-academia',
      segmento: 'Academia & Fitness',
      titulo: 'Mais energia para sua academia',
      subtitulo: 'Apresente planos, modalidades e atraia novos alunos no celular.',
      imagemUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      projectId: 'demo-academia-premium',
    },
    {
      id: 'banner-restaurante',
      segmento: 'Restaurante & Gastronomia',
      titulo: 'Seu cardápio sempre em destaque',
      subtitulo: 'Fotos apetitosas, pratos do dia e canal direto para reservas.',
      imagemUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      projectId: 'demo-restaurante-premium',
    },
    {
      id: 'banner-barbearia',
      segmento: 'Barbearia & Estética',
      titulo: 'Destaque sua barbearia',
      subtitulo: 'Agendamentos ágeis de cortes e identidade marcante.',
      imagemUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80&q=80',
      projectId: 'demo-barbearia-kings',
    },
    {
      id: 'banner-clinica',
      segmento: 'Clínica & Saúde',
      titulo: 'Credibilidade para sua clínica',
      subtitulo: 'Design humanizado focado em especialidades e confiança.',
      imagemUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      projectId: 'demo-clinica-saude',
    },
    {
      id: 'banner-imobiliaria',
      segmento: 'Imobiliária & Imóveis',
      titulo: 'Imóveis com visual imponente',
      subtitulo: 'Vitrine exclusiva para corretores e imobiliárias de alto padrão.',
      imagemUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      projectId: 'demo-imobiliaria-premium',
    },
    {
      id: 'banner-engenharia',
      segmento: 'Engenharia & Obras',
      titulo: 'Solidez para sua construtora',
      subtitulo: 'Apresentação técnica de projetos e autoridade no mercado.',
      imagemUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      projectId: 'demo-engenharia-premium',
    },
    {
      id: 'banner-loja',
      segmento: 'Loja & Comércio',
      titulo: 'Sua loja pronta para vender',
      subtitulo: 'Vitrine moderna para coleções, marcas e produtos exclusivos.',
      imagemUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      projectId: 'demo-loja-premium',
    },
  ];
};

// Componente do Banner Principal com transição suave, swipe horizontal e troca automática lenta
const MainHeroBanner = React.memo<{
  allProjects: PortfolioProject[];
  onSelectProject: (project: PortfolioProject) => void;
  onNavigate: (tab: ViewTab) => void;
  language?: string;
}>(({ allProjects, onSelectProject, onNavigate, language = 'pt-BR' }) => {
  const slides = useMemo(() => getBannerSlides(language), [language]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchDeltaX = useRef<number>(0);
  const isHorizontalIntent = useRef<boolean | null>(null);
  const isSwiping = useRef<boolean>(false);

  const isMouseDown = useRef<boolean>(false);
  const mouseStartX = useRef<number>(0);
  const mouseDeltaX = useRef<number>(0);

  // Handlers para gestos de toque no celular diferenciando intenção horizontal de vertical
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
    isHorizontalIntent.current = null;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    // Trava intenção após 8px de movimento
    if (isHorizontalIntent.current === null && (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8)) {
      isHorizontalIntent.current = Math.abs(deltaX) > Math.abs(deltaY) * 1.3;
    }

    if (isHorizontalIntent.current === true) {
      touchDeltaX.current = deltaX;
      if (Math.abs(deltaX) > 12) {
        isSwiping.current = true;
      }
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalIntent.current === true && isSwiping.current) {
      if (touchDeltaX.current < -35) {
        // Deslizar para a esquerda -> próximo
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      } else if (touchDeltaX.current > 35) {
        // Deslizar para a direita -> anterior
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
    isHorizontalIntent.current = null;
    setTimeout(() => {
      isSwiping.current = false;
    }, 60);
  };

  // Handlers para mouse (desktop preview)
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    mouseStartX.current = e.clientX;
    mouseDeltaX.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    mouseDeltaX.current = e.clientX - mouseStartX.current;
    if (Math.abs(mouseDeltaX.current) > 10) {
      isSwiping.current = true;
    }
  };

  const handleMouseUp = () => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    if (Math.abs(mouseDeltaX.current) > 35) {
      if (mouseDeltaX.current < 0) {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
    setTimeout(() => {
      isSwiping.current = false;
    }, 60);
  };

  const handleSlideClick = (slide: BannerSlide) => {
    if (isSwiping.current) return;
    const project = allProjects.find((p) => p.id === slide.projectId);
    if (project) {
      onSelectProject(project);
    } else {
      onNavigate('portfolio');
    }
  };

  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-md">
      {/* Contêiner de slides em carrossel */}
      <div
        className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-56 overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="flex w-full h-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translate3d(-${currentIndex * 100}%, 0, 0)` }}
        >
          {slides.map((slide, idx) => {
            const currentImg = imageOverrides[slide.id] || slide.imagemUrl;
            return (
              <div
                key={slide.id}
                className="w-full h-full flex-shrink-0 relative overflow-hidden"
                onClick={() => handleSlideClick(slide)}
                title={language === 'en' ? 'Tap to view details of this industry' : 'Toque para ver detalhes deste segmento'}
              >
                {/* Imagem do segmento com fallback automático */}
                <img
                  src={currentImg}
                  alt={slide.titulo}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={() => {
                    setImageOverrides((prev) => {
                      const active = prev[slide.id] || slide.imagemUrl;
                      const segmentFallback = getSegmentConfig(slide.segmento).primaryImage;
                      if (active !== segmentFallback) {
                        return { ...prev, [slide.id]: segmentFallback };
                      }
                      return { ...prev, [slide.id]: GLOBAL_SAFE_FALLBACK_IMAGE };
                    });
                  }}
                  className="w-full h-full object-cover select-none pointer-events-none transform scale-[1.02] transition-transform duration-1000"
                />

                {/* Overlays em gradiente para máxima legibilidade do texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Textos sobrepostos sobre a imagem */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4.5 flex flex-col justify-end pointer-events-none z-10 hero-banner-content">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-cyan-300 border border-white/20 w-fit mb-1.5 shadow-sm">
                    {slide.segmento}
                  </span>

                  <h2 className="text-sm sm:text-base font-extrabold text-white leading-tight line-clamp-1 drop-shadow-md">
                    {slide.titulo}
                  </h2>

                  <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-1 mt-0.5 leading-normal drop-shadow-sm">
                    {slide.subtitulo}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicadores discretos (bolinhas) no canto inferior direito com área de toque confortável */}
        <div
          role="tablist"
          aria-label={language === 'en' ? 'Main hero banners navigation' : 'Navegação dos banners principais'}
          className="absolute bottom-2 right-2 flex items-center z-20 pointer-events-auto"
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={language === 'en' ? `Go to banner ${idx + 1} of ${slides.length}` : `Ir para banner ${idx + 1} de ${slides.length}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setCurrentIndex(idx);
              }}
              className="min-h-[32px] min-w-[20px] flex items-center justify-center p-1"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'bg-cyan-400 w-3.5 shadow-sm'
                    : 'bg-white/40 hover:bg-white/70 w-1.5'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
});

MainHeroBanner.displayName = 'MainHeroBanner';

// Card de destaque memorizado
const FeaturedProjectCard = React.memo<{
  project: PortfolioProject;
  categoryLabel?: string;
  onSelectProject: (project: PortfolioProject) => void;
  priority?: boolean;
}>(({ project, categoryLabel, onSelectProject, priority }) => {
  const planBadge = project.planoId ? project.planoId.toUpperCase() : 'PROFISSIONAL';

  return (
    <div
      onClick={() => onSelectProject(project)}
      className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition-all duration-150 flex flex-col justify-between cursor-pointer active:scale-[0.985] group"
    >
      <div>
        <ProjectCardImage
          project={project}
          aspectRatio="compact"
          badge={planBadge}
          priority={priority}
        />

        <div className="p-2 sm:p-2.5 space-y-0.5">
          <span className="text-[9.5px] font-semibold text-cyan-400 block truncate">
            {categoryLabel || project.categoria}
          </span>
          <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {project.titulo}
          </h3>
        </div>
      </div>
    </div>
  );
});

FeaturedProjectCard.displayName = 'FeaturedProjectCard';

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
  onOpenRecommendation,
  onSelectProject,
  onStartQuiz,
}) => {
  const { language, t } = useTranslation();

  // Carrega todos os projetos e categorias para mapeamento e navegação
  const allProjects = useMemo(() => {
    return getPortfolioProjects(language);
  }, [language]);

  const allCategories = useMemo(() => {
    return getPortfolioCategories(language);
  }, [language]);

  const categoryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    allCategories.forEach((c) => map.set(c.id, c.nome));
    return map;
  }, [allCategories]);

  // Seleciona exatamente 6 projetos de segmentos representativos para a seção compacta
  const featuredProjects = useMemo(() => {
    const desiredOrder = [
      'demo-barbearia-kings',
      'demo-academia-premium',
      'demo-restaurante-premium',
      'demo-clinica-saude',
      'demo-imobiliaria-premium',
      'demo-loja-premium',
    ];

    const mapped = desiredOrder
      .map((id) => allProjects.find((p) => p.id === id))
      .filter(Boolean) as PortfolioProject[];

    return mapped.length >= 4 ? mapped : allProjects.slice(0, 6);
  }, [allProjects]);

  const popularChips = useMemo(() => [
    { label: language === 'en' ? 'Barbershop' : 'Barbearia', icon: Scissors, id: 'demo-barbearia-kings' },
    { label: language === 'en' ? 'Gym & Fitness' : 'Academia', icon: Dumbbell, id: 'demo-academia-premium' },
    { label: language === 'en' ? 'Restaurant' : 'Restaurante', icon: UtensilsCrossed, id: 'demo-restaurante-premium' },
    { label: language === 'en' ? 'Clinic' : 'Clínica', icon: Stethoscope, id: 'demo-clinica-saude' },
    { label: language === 'en' ? 'Real Estate' : 'Imóveis', icon: Building2, id: 'demo-imobiliaria-premium' },
    { label: language === 'en' ? 'Engineering' : 'Engenharia', icon: HardHat, id: 'demo-engenharia-premium' },
    { label: language === 'en' ? 'Store & Retail' : 'Loja', icon: ShoppingBag, id: 'demo-loja-premium' },
  ], [language]);

  return (
    <div className="space-y-4 pb-4 animate-in fade-in duration-150 overflow-x-hidden">
      {/* 1. CABEÇALHO COMPACTO & AMIGÁVEL */}
      <section className="pt-0 flex items-center justify-between">
        <div>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>{language === 'en' ? 'Hello' : language === 'es' ? 'Hola' : language === 'fr' ? 'Bonjour' : 'Olá'}</span>
            <span className="inline-block select-none text-xs">👋</span>
          </h1>
          <p className="text-[11.5px] text-slate-400 mt-0.5">
            {language === 'en' ? 'What would you like to do today?' : language === 'es' ? '¿Qué te gustaría hacer hoy?' : language === 'fr' ? "Que souhaitez-vous faire aujourd'hui ?" : 'O que você quer fazer hoje?'}
          </p>
        </div>
      </section>

      {/* 2. BANNER PRINCIPAL COM IMAGENS REAIS DOS SEGMENTOS E SWIPE */}
      <MainHeroBanner
        allProjects={allProjects}
        onSelectProject={onSelectProject}
        onNavigate={onNavigate}
        language={language}
      />

      {/* 3. AÇÃO PRINCIPAL / CTA COMPACTO: "CRIAR MEU SITE" */}
      <section>
        <button
          type="button"
          onClick={() => onNavigate('project')}
          className="w-full text-left p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-950/40 border border-indigo-400/25 transition-all duration-150 active:scale-[0.985] group flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-extrabold text-white block leading-snug">
                {language === 'en' ? 'CREATE MY WEBSITE' : language === 'es' ? 'CREAR MI SITIO' : language === 'fr' ? 'CRÉER MON SITE' : 'CRIAR MEU SITE'}
              </span>
              <span className="text-[10.5px] text-indigo-100/90 block truncate mt-0.5">
                {language === 'en' ? 'Start the official briefing in a few steps' : 'Inicie o briefing oficial em poucos passos'}
              </span>
            </div>
          </div>

          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </div>
        </button>
      </section>

      {/* 4. SEGMENTOS RÁPIDOS / ATALHOS EM FORMATO APP */}
      <section className="space-y-1.5">
        <div className="px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {language === 'en' ? 'Popular Industries' : 'Segmentos Populares'}
          </span>
        </div>

        {/* Chips compactos com ícones dos segmentos */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          {popularChips.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => {
                  const proj = allProjects.find((p) => p.id === cat.id);
                  if (proj) {
                    onSelectProject(proj);
                  } else {
                    onNavigate('portfolio');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 active:scale-95 text-slate-300 hover:text-white text-[11px] font-semibold shrink-0 transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. ATALHOS COMPACTOS (Serviços, Meus leads, Portfólio) */}
      <section className="grid grid-cols-3 gap-2">
        {/* Atalho 1: Serviços */}
        <button
          type="button"
          onClick={() => onNavigate('services')}
          className="min-h-[48px] p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left flex flex-col justify-between transition-all active:scale-[0.97] cursor-pointer"
        >
          <div className="w-6.5 h-6.5 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-1">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10.5px] font-bold text-white block leading-tight truncate">
              {language === 'en' ? 'Services' : 'Serviços'}
            </span>
            <span className="text-[9px] text-slate-500 block truncate">
              {language === 'en' ? 'Plans & solutions' : 'Planos & soluções'}
            </span>
          </div>
        </button>

        {/* Atalho 2: Meus leads */}
        <button
          type="button"
          onClick={() => onNavigate('admin')}
          className="min-h-[48px] p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left flex flex-col justify-between transition-all active:scale-[0.97]"
        >
          <div className="w-6.5 h-6.5 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10.5px] font-bold text-white block leading-tight truncate">
              {language === 'en' ? 'My leads' : 'Meus leads'}
            </span>
            <span className="text-[9px] text-slate-500 block truncate">
              {language === 'en' ? 'Team dashboard' : 'Painel da equipe'}
            </span>
          </div>
        </button>

        {/* Atalho 3: Portfólio */}
        <button
          type="button"
          onClick={() => onNavigate('portfolio')}
          className="min-h-[48px] p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left flex flex-col justify-between transition-all active:scale-[0.97]"
        >
          <div className="w-6.5 h-6.5 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-1">
            <FolderKanban className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10.5px] font-bold text-white block leading-tight truncate">
              {t.nav.portfolio}
            </span>
            <span className="text-[9px] text-slate-500 block truncate">
              {language === 'en' ? 'Live Demos' : 'Demonstrações'}
            </span>
          </div>
        </button>
      </section>

      {/* 6. "ME AJUDA A ESCOLHER UM PLANO" (ÁREA SECUNDÁRIA) */}
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
                {t.services.questionsTitle || (language === 'en' ? 'Need help choosing a plan?' : 'Não sabe qual plano escolher?')}
              </span>
              <span className="text-[10.5px] text-slate-400 block truncate">
                {language === 'en' ? 'Answer 2 questions to find your ideal plan.' : 'Responda 2 perguntas e descubra o plano ideal.'}
              </span>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-cyan-400 shrink-0 flex items-center gap-0.5">
            {language === 'en' ? 'Discover' : 'Descobrir'} <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </section>

      {/* 7. PROJETOS EM DESTAQUE (COMPACTO, 6 PROJETOS) */}
      <section className="space-y-2.5 pt-0.5">
        <div className="px-0.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {language === 'en' ? 'Featured projects' : 'Projetos em destaque'}
          </h2>
        </div>

        {/* Grid de 2 colunas compacto com 6 projetos */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {featuredProjects.map((project, idx) => (
            <FeaturedProjectCard
              key={project.id}
              project={project}
              categoryLabel={categoryNameMap.get(project.categoria) || project.categoria}
              onSelectProject={onSelectProject}
              priority={idx < 2}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
