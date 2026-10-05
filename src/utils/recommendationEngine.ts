import {
  OnboardingAnswers,
  ProjectRecommendation,
  Language,
  PortfolioProject,
  AlternativePlanOption,
} from '../types';
import { getNexawebPlans } from '../data/servicesData';
import { getPortfolioProjects } from '../data/portfolioData';
import { Translations } from '../locales/pt-BR';

export function calculateRecommendation(
  answers: OnboardingAnswers,
  lang: Language,
  t: Translations
): ProjectRecommendation {
  const plans = getNexawebPlans(lang);
  const projects = getPortfolioProjects(lang);

  // 1. Determina o plano principal
  let recommendedPlanId: 'essencial' | 'profissional' | 'personalizado' = 'profissional';

  if (answers.customization === 'custom') {
    recommendedPlanId = 'personalizado';
  } else if (answers.interest === 'landing_page' || answers.customization === 'simple') {
    recommendedPlanId = 'essencial';
  } else if (answers.interest === 'ecommerce' || answers.objective === 'sell') {
    recommendedPlanId = answers.customization === 'need_help' ? 'profissional' : 'personalizado';
  } else {
    recommendedPlanId = 'profissional';
  }

  const selectedPlan = plans.find((p) => p.id === recommendedPlanId) || plans[1];

  // 2. Determina o plano alternativo
  let alternativePlan: AlternativePlanOption | undefined;

  if (recommendedPlanId === 'profissional') {
    const alt = plans.find((p) => p.id === 'essencial') || plans[0];
    const altReason =
      lang === 'en'
        ? 'Ideal if you prefer a leaner starting point with lightning-fast delivery.'
        : lang === 'es'
        ? 'Ideal si prefiere un punto de partida más ágil con entrega inmediata.'
        : lang === 'fr'
        ? 'Idéal si vous souhaitez démarrer avec une formule plus légère et ultra rapide.'
        : lang === 'pt-PT'
        ? 'Ideal se preferir um ponto de partida mais ágil com entrega rápida.'
        : 'Ideal caso você prefira um ponto de partida mais enxuto e entrega ágil.';

    alternativePlan = {
      id: alt.id,
      nome: alt.nome,
      tagline: alt.tagline,
      corIdentidade: alt.corIdentidade,
      motivo: altReason,
    };
  } else if (recommendedPlanId === 'essencial') {
    const alt = plans.find((p) => p.id === 'profissional') || plans[1];
    const altReason =
      lang === 'en'
        ? 'Recommended if you want complete Google SEO optimization and multiple sections.'
        : lang === 'es'
        ? 'Recomendado si desea posicionamiento SEO en Google y múltiples secciones.'
        : lang === 'fr'
        ? 'Recommandé si vous souhaitez un référencement SEO complet et plusieurs sections.'
        : lang === 'pt-PT'
        ? 'Recomendado se pretender otimização completa de SEO no Google e múltiplas secções.'
        : 'Recomendado se quiser otimização completa de SEO no Google e mais seções.';

    alternativePlan = {
      id: alt.id,
      nome: alt.nome,
      tagline: alt.tagline,
      corIdentidade: alt.corIdentidade,
      motivo: altReason,
    };
  } else {
    // personalizado
    const alt = plans.find((p) => p.id === 'profissional') || plans[1];
    const altReason =
      lang === 'en'
        ? 'A high-impact turnkey solution ready for fast launch.'
        : lang === 'es'
        ? 'Una solución de alto impacto lista para un lanzamiento rápido.'
        : lang === 'fr'
        ? 'Une solution clé en main à fort impact prête pour un lancement rapide.'
        : lang === 'pt-PT'
        ? 'Uma solução de elevado impacto pronta para um lançamento rápido.'
        : 'Uma solução pronta de alto impacto para lançamento rápido.';

    alternativePlan = {
      id: alt.id,
      nome: alt.nome,
      tagline: alt.tagline,
      corIdentidade: alt.corIdentidade,
      motivo: altReason,
    };
  }

  // 3. Mapeamento dos projetos do portfólio relacionados ao segmento
  let matchedProjects: PortfolioProject[] = [];

  switch (answers.segment) {
    case 'barber': {
      const p1 = projects.find((p) => p.id === 'demo-barbearia-kings');
      const p2 = projects.find((p) => p.id === 'demo-salao-premium');
      matchedProjects = [p1, p2].filter(Boolean) as PortfolioProject[];
      break;
    }
    case 'beauty': {
      const p1 = projects.find((p) => p.id === 'demo-salao-premium');
      const p2 = projects.find((p) => p.id === 'demo-barbearia-kings');
      matchedProjects = [p1, p2].filter(Boolean) as PortfolioProject[];
      break;
    }
    case 'fitness': {
      const p1 = projects.find((p) => p.id === 'demo-academia-premium');
      const p2 = projects.find((p) => p.id === 'demo-clinica-saude');
      matchedProjects = [p1, p2].filter(Boolean) as PortfolioProject[];
      break;
    }
    case 'realEstate': {
      const p1 = projects.find((p) => p.id === 'demo-imobiliaria-premium');
      matchedProjects = [p1].filter(Boolean) as PortfolioProject[];
      break;
    }
    case 'clinic': {
      const p1 = projects.find((p) => p.id === 'demo-clinica-saude');
      const p2 = projects.find((p) => p.id === 'demo-academia-premium');
      matchedProjects = [p1, p2].filter(Boolean) as PortfolioProject[];
      break;
    }
    case 'food': {
      const p1 = projects.find((p) => p.id === 'demo-restaurante-premium');
      matchedProjects = [p1].filter(Boolean) as PortfolioProject[];
      break;
    }
    case 'retail':
    case 'ecommerce': {
      const p1 = projects.find((p) => p.id === 'demo-restaurante-premium');
      const p2 = projects.find((p) => p.id === 'demo-salao-premium');
      matchedProjects = [p1, p2].filter(Boolean) as PortfolioProject[];
      break;
    }
    case 'services':
    case 'other':
    default: {
      const p1 = projects.find((p) => p.id === 'demo-imobiliaria-premium');
      const p2 = projects.find((p) => p.id === 'demo-salao-premium');
      matchedProjects = [p1, p2].filter(Boolean) as PortfolioProject[];
      break;
    }
  }

  if (matchedProjects.length === 0) {
    matchedProjects = projects.slice(0, 2);
  }

  // 4. Construção dos 3 motivos estratégicos "Por que recomendamos este plano?"
  const reasonsList: string[] = [];

  if (lang === 'en') {
    if (recommendedPlanId === 'essencial') {
      reasonsList.push('Ultra-fast single-page structure engineered for high conversion.');
      reasonsList.push('Optimized call-to-actions pointing directly to your commercial WhatsApp.');
      reasonsList.push('Excellent cost-benefit ratio for immediate digital market presence.');
    } else if (recommendedPlanId === 'personalizado') {
      reasonsList.push('100% tailor-made architecture built around your unique workflow.');
      reasonsList.push('Dedicated integration for booking, catalogs, and customer pipelines.');
      reasonsList.push('Personal consultation and priority technical accompaniment from NexaWeb.');
    } else {
      reasonsList.push('Perfect balance of multi-section authority and Google SEO indexing.');
      reasonsList.push('Interactive catalog and smart contact forms designed for your audience.');
      reasonsList.push('The most chosen plan by established companies seeking customer growth.');
    }
  } else if (lang === 'es') {
    if (recommendedPlanId === 'essencial') {
      reasonsList.push('Estructura de página única ultra rápida enfocada en captar clientes.');
      reasonsList.push('Llamadas a la acción directas hacia su WhatsApp de atención comercial.');
      reasonsList.push('Excelente relación calidad-precio para ganar presencia digital inmediata.');
    } else if (recommendedPlanId === 'personalizado') {
      reasonsList.push('Arquitectura 100% exclusiva ajustada a los procesos de su negocio.');
      reasonsList.push('Módulos específicos para catálogos, reservas o gestión de contactos.');
      reasonsList.push('Acompañamiento estratégico prioritario y directo con el equipo NexaWeb.');
    } else {
      reasonsList.push('Equilibrio ideal entre autoridad de marca y posicionamiento en Google.');
      reasonsList.push('Catálogo interactivo y formularios inteligentes que generan confianza.');
      reasonsList.push('El plan más elegido por empresas consolidadas que buscan crecimiento.');
    }
  } else if (lang === 'fr') {
    if (recommendedPlanId === 'essencial') {
      reasonsList.push('Structure d’une page ultra rapide conçue pour une conversion maximale.');
      reasonsList.push('Appels à l’action stratégiques orientés directement vers votre WhatsApp commercial.');
      reasonsList.push('Meilleur rapport qualité-prix pour s’imposer immédiatement sur le web.');
    } else if (recommendedPlanId === 'personalizado') {
      reasonsList.push('Architecture 100% sur mesure conçue selon vos objectifs exclusifs.');
      reasonsList.push('Intégration d’outils dédiés (prise de rdv, catalogues dynamiques, CRM).');
      reasonsList.push('Accompagnement prioritaire et conseil stratégique direct avec NexaWeb.');
    } else {
      reasonsList.push('Équilibre parfait entre crédibilité de marque et visibilité naturelle sur Google.');
      reasonsList.push('Catalogue interactif et formulaires qualifiés adaptés à votre secteur.');
      reasonsList.push('La formule la plus plébiscitée par les entreprises pour accélérer leur croissance.');
    }
  } else if (lang === 'pt-PT') {
    if (recommendedPlanId === 'essencial') {
      reasonsList.push('Estrutura de página única ultra veloz focada em conversão ágil.');
      reasonsList.push('Botões diretos para o WhatsApp comercial da sua empresa.');
      reasonsList.push('Excelente relação qualidade-preço para iniciar presença digital com autoridade.');
    } else if (recommendedPlanId === 'personalizado') {
      reasonsList.push('Arquitetura 100% exclusiva desenhada para os processos da sua empresa.');
      reasonsList.push('Integração de sistemas próprios (marcações, catálogo e gestão de contactos).');
      reasonsList.push('Acompanhamento estratégico prioritário e direto com a equipa NexaWeb.');
    } else {
      reasonsList.push('Equilíbrio ideal entre autoridade de marca e indexação completa no Google.');
      reasonsList.push('Catálogo interativo e formulários inteligentes que transmitem confiança.');
      reasonsList.push('O plano mais escolhido por empresas consolidadas que procuram crescer.');
    }
  } else {
    // pt-BR
    if (recommendedPlanId === 'essencial') {
      reasonsList.push('Estrutura de página única ultra rápida com foco em conversão imediata.');
      reasonsList.push('Botões diretos para o WhatsApp comercial da sua empresa.');
      reasonsList.push('Excelente custo-benefício para estabelecer presença profissional imediata.');
    } else if (recommendedPlanId === 'personalizado') {
      reasonsList.push('Arquitetura 100% exclusiva desenhada para as necessidades da sua empresa.');
      reasonsList.push('Integração de sistemas específicos (agendamentos, catálogo dinâmico e CRM).');
      reasonsList.push('Acompanhamento estratégico prioritário direto com os especialistas NexaWeb.');
    } else {
      reasonsList.push('Equilíbrio perfeito entre autoridade de marca e otimização completa no Google.');
      reasonsList.push('Catálogo interativo e formulário inteligente de captação de clientes.');
      reasonsList.push('O plano mais escolhido por negócios consolidados que buscam novos clientes.');
    }
  }

  // 5. Labels traduzidos
  const segmentLabels: Record<string, string> = {
    beauty: t.segments.beauty,
    barber: t.segments.barber,
    fitness: t.segments.fitness,
    realEstate: t.segments.realEstate,
    clinic: t.segments.clinic,
    food: t.segments.food,
    services: t.segments.services,
    retail: t.segments.retail,
    other: t.segments.other,
  };

  const objectiveLabels: Record<string, string> = {
    contacts: t.onboarding.q3OptContacts,
    company: t.onboarding.q3OptCompany,
    sell: t.onboarding.q3OptSell,
    services: t.onboarding.q3OptServices,
    brand: t.onboarding.q3OptBrand,
    presence: t.onboarding.q3OptPresence,
    not_sure: t.onboarding.q3OptNotSure,
  };

  const interestLabels: Record<string, string> = {
    new_site: t.onboarding.q1OptNewSite,
    renew_site: t.onboarding.q1OptRenewSite,
    ecommerce: t.onboarding.q1OptEcommerce,
    landing_page: t.onboarding.q1OptLandingPage,
    not_sure: t.onboarding.q1OptNotSure,
  };

  const customizationLabels: Record<string, string> = {
    simple: t.onboarding.q5OptSimple,
    complete: t.onboarding.q5OptComplete,
    custom: t.onboarding.q5OptCustom,
    need_help: t.onboarding.q5OptNeedHelp,
  };

  const websiteLangLabels: Record<string, string> = {
    'pt-BR': t.project.langPtBr,
    'pt-PT': t.project.langPtPt,
    en: t.project.langEn,
    es: t.project.langEs,
    fr: t.project.langFr,
    'pt-en': t.project.langPtEn,
    other: t.project.langOther,
  };

  const keyFeatures = [
    ...selectedPlan.recursos.slice(0, 3),
    ...(matchedProjects[0]?.recursos.slice(0, 2) || []),
  ];

  return {
    planId: selectedPlan.id,
    planName: selectedPlan.nome,
    planTagline: selectedPlan.tagline,
    planColor: selectedPlan.corIdentidade,
    projectId: matchedProjects[0]?.id,
    projectTitle: matchedProjects[0]?.titulo,
    matchedProjects,
    alternativePlan,
    segmentKey: answers.segment,
    segmentLabel: segmentLabels[answers.segment] || t.segments.services,
    objectiveLabel: objectiveLabels[answers.objective] || t.onboarding.q3OptContacts,
    websiteLanguageLabel: websiteLangLabels[answers.websiteLanguage] || t.project.langPtBr,
    interestLabel: interestLabels[answers.interest] || t.onboarding.q1OptNewSite,
    customizationLabel: customizationLabels[answers.customization] || t.onboarding.q5OptComplete,
    reason: selectedPlan.descricao,
    reasonsList,
    keyFeatures,
  };
}
