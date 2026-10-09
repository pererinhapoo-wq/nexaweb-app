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
    const altReason = 'Ideal caso você prefira um ponto de partida mais enxuto e entrega ágil.';

    alternativePlan = {
      id: alt.id,
      nome: alt.nome,
      tagline: alt.tagline,
      corIdentidade: alt.corIdentidade,
      motivo: altReason,
    };
  } else if (recommendedPlanId === 'essencial') {
    const alt = plans.find((p) => p.id === 'profissional') || plans[1];
    const altReason = 'Recomendado se quiser otimização completa de SEO no Google e mais seções.';

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
    const altReason = 'Uma solução pronta de alto impacto para lançamento rápido.';

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

  if (recommendedPlanId === 'essencial') {
    reasonsList.push('Estrutura de página única ultra rápida com foco em conversão imediata.');
    reasonsList.push('Botões diretos para os canais de contato da sua empresa.');
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
