import React, { useState, useEffect } from 'react';
import { ViewTab, WebsiteLanguage } from '../types';
import { getNexawebPlans } from '../data/servicesData';
import { getPortfolioProjects } from '../data/portfolioData';
import {
  Sparkles,
  Check,
  Copy,
  Layout,
  Store,
  Lightbulb,
  MessageSquare,
  Globe2
} from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface ProjectScreenProps {
  initialPlan?: string;
  initialModel?: string;
  onNavigate: (tab: ViewTab) => void;
}

export const ProjectScreen: React.FC<ProjectScreenProps> = ({
  initialPlan,
  initialModel,
  onNavigate
}) => {
  const { language, t } = useTranslation();

  const plans = getNexawebPlans(language);
  const portfolioProjects = getPortfolioProjects(language);

  const [startType, setStartType] = useState<'modelo' | 'segmento' | 'propria'>('modelo');
  const [selectedModel, setSelectedModel] = useState<string>(initialModel || portfolioProjects[0]?.titulo || '');
  const [selectedSegment, setSelectedSegment] = useState<string>('services');
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan || 'profissional');
  const [siteLanguage, setSiteLanguage] = useState<WebsiteLanguage>('pt');

  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync props if changed externally
  useEffect(() => {
    if (initialPlan) setSelectedPlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    if (initialModel) {
      setStartType('modelo');
      setSelectedModel(initialModel);
    }
  }, [initialModel]);

  const segmentsOptions: { id: string; label: string }[] = [
    { id: 'beauty', label: t.segments.beauty },
    { id: 'health', label: t.segments.health },
    { id: 'food', label: t.segments.food },
    { id: 'realEstate', label: t.segments.realEstate },
    { id: 'services', label: t.segments.services },
    { id: 'retail', label: t.segments.retail },
    { id: 'other', label: t.segments.other },
  ];

  const planObj = plans.find((p) => p.id === selectedPlan) || plans[1];

  const getSiteLanguageLabel = (langCode: WebsiteLanguage): string => {
    switch (langCode) {
      case 'pt':
        return t.project.langPt;
      case 'en':
        return t.project.langEn;
      case 'pt-en':
        return t.project.langBoth;
    }
  };

  const getOriginText = (targetLang: 'pt' | 'en'): string => {
    const segmentLabel = segmentsOptions.find((s) => s.id === selectedSegment)?.label || selectedSegment;

    if (targetLang === 'en') {
      if (startType === 'modelo') return `Based on demo: ${selectedModel}`;
      if (startType === 'segmento') return `Industry: ${segmentLabel}`;
      return 'Custom idea / Tailor-made project from scratch';
    }

    if (startType === 'modelo') return `Baseado no modelo: ${selectedModel}`;
    if (startType === 'segmento') return `Segmento: ${segmentLabel}`;
    return 'Ideia própria / Projeto sob medida do zero';
  };

  const generateBriefingMessage = (): string => {
    // 1. Mensagem em Inglês
    if (siteLanguage === 'en') {
      const origin = getOriginText('en');
      return `Hello NexaWeb! I would like to request a website project:
- *Company/Business:* ${businessName || 'To be defined'}
- *Contact Name:* ${contactName || 'Not provided'}
- *WhatsApp Contact:* ${contactWhatsapp || 'Not provided'}
- *Starting Point:* ${origin}
- *Interested Plan:* Plan ${planObj.nome} (${planObj.tagline})
- *Website Language:* 🇺🇸 English
- *What I need:* ${description || 'I would like more information and guidance from the team'}`;
    }

    // 2. Mensagem Bilíngue (Português + English)
    if (siteLanguage === 'pt-en') {
      const originPt = getOriginText('pt');
      const originEn = getOriginText('en');
      return `Olá NexaWeb! / Hello NexaWeb!
Solicitação de Projeto de Site Bilíngue / Bilingual Website Project Request:
- *Empresa / Company:* ${businessName || 'A definir / TBD'}
- *Responsável / Contact:* ${contactName || 'Não informado / N/A'}
- *WhatsApp:* ${contactWhatsapp || 'Não informado / N/A'}
- *Ponto de Partida / Starting Point:* ${originPt} (${originEn})
- *Plano / Plan:* ${planObj.nome} (${planObj.tagline})
- *Idioma do Site / Website Language:* 🌎 Português + English (Bilíngue)
- *O que preciso / What I need:* ${description || 'Quero mais informações e orientação da equipe / Seeking guidance'}`;
    }

    // 3. Mensagem em Português (padrão)
    const origin = getOriginText('pt');
    return `Olá NexaWeb! Gostaria de solicitar um projeto de site:
- *Empresa/Negócio:* ${businessName || 'Ainda a definir'}
- *Responsável:* ${contactName || 'Não informado'}
- *WhatsApp de Contato:* ${contactWhatsapp || 'Não informado'}
- *Ponto de Partida:* ${origin}
- *Plano de Interesse:* Plano ${planObj.nome} (${planObj.tagline})
- *Idioma do Site:* 🇧🇷 Português
- *O que preciso:* ${description || 'Quero mais informações e orientação da equipe'}`;
  };

  const handleCopyBriefing = async () => {
    const text = generateBriefingMessage();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendWhatsapp = () => {
    const text = encodeURIComponent(generateBriefingMessage());
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const currentSegmentLabel = segmentsOptions.find((s) => s.id === selectedSegment)?.label || selectedSegment;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            {t.project.title}
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {t.project.badge}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {t.project.subtitle}
        </p>
      </div>

      {/* Step 1: Como prefere começar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
            1
          </div>
          <h2 className="text-sm font-bold text-white">
            {t.project.step1Title}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Opção Modelo */}
          <button
            type="button"
            onClick={() => setStartType('modelo')}
            className={`p-2.5 sm:p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
              startType === 'modelo'
                ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Layout className={`w-4 h-4 mb-2 ${startType === 'modelo' ? 'text-cyan-400' : 'text-slate-500'}`} />
            <div>
              <span className="text-xs font-bold block leading-tight truncate">{t.project.optModelTitle}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{t.project.optModelSub}</span>
            </div>
          </button>

          {/* Opção Segmento */}
          <button
            type="button"
            onClick={() => setStartType('segmento')}
            className={`p-2.5 sm:p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
              startType === 'segmento'
                ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Store className={`w-4 h-4 mb-2 ${startType === 'segmento' ? 'text-amber-400' : 'text-slate-500'}`} />
            <div>
              <span className="text-xs font-bold block leading-tight truncate">{t.project.optSegmentTitle}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{t.project.optSegmentSub}</span>
            </div>
          </button>

          {/* Opção Ideia Própria */}
          <button
            type="button"
            onClick={() => setStartType('propria')}
            className={`p-2.5 sm:p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
              startType === 'propria'
                ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Lightbulb className={`w-4 h-4 mb-2 ${startType === 'propria' ? 'text-purple-400' : 'text-slate-500'}`} />
            <div>
              <span className="text-xs font-bold block leading-tight truncate">{t.project.optCustomTitle}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{t.project.optCustomSub}</span>
            </div>
          </button>
        </div>

        {/* Detalhes da escolha */}
        {startType === 'modelo' && (
          <div className="pt-2 border-t border-slate-800/80">
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              {t.project.selectModelLabel}
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {portfolioProjects.map((p) => (
                <option key={p.id} value={p.titulo}>
                  {p.titulo}
                </option>
              ))}
            </select>
          </div>
        )}

        {startType === 'segmento' && (
          <div className="pt-2 border-t border-slate-800/80">
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              {t.project.selectSegmentLabel}
            </label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {segmentsOptions.map((seg) => (
                <option key={seg.id} value={seg.id}>
                  {seg.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {startType === 'propria' && (
          <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg">
            {t.project.customDesc}
          </div>
        )}
      </div>

      {/* Step 2: Escolha do Plano */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
              2
            </div>
            <h2 className="text-sm font-bold text-white">
              {t.project.step2Title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {t.project.viewPlansLink}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? plan.corIdentidade === 'azul'
                      ? 'bg-blue-950/40 border-blue-500 text-white'
                      : plan.corIdentidade === 'dourado'
                      ? 'bg-amber-950/40 border-amber-500 text-white'
                      : 'bg-purple-950/40 border-purple-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold block">{plan.nome}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{plan.tagline}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Idioma do Site (Novo Requisito Obrigatório) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
            3
          </div>
          <div className="flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">
              {t.project.step3Title}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Opção Português */}
          <button
            type="button"
            onClick={() => setSiteLanguage('pt')}
            className={`py-2.5 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
              siteLanguage === 'pt'
                ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {t.project.langPt}
          </button>

          {/* Opção English */}
          <button
            type="button"
            onClick={() => setSiteLanguage('en')}
            className={`py-2.5 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
              siteLanguage === 'en'
                ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {t.project.langEn}
          </button>

          {/* Opção Bilíngue */}
          <button
            type="button"
            onClick={() => setSiteLanguage('pt-en')}
            className={`py-2.5 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
              siteLanguage === 'pt-en'
                ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {t.project.langBoth}
          </button>
        </div>
      </div>

      {/* Step 4: Informações do Projeto */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
            4
          </div>
          <h2 className="text-sm font-bold text-white">
            {t.project.step4Title}
          </h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              {t.project.businessNameLabel}
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t.project.businessNamePlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              {t.project.needsLabel}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.project.needsPlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                {t.project.yourNameLabel}
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder={t.project.yourNamePlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                {t.project.whatsappLabel}
              </label>
              <input
                type="tel"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                placeholder={t.project.whatsappPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 5: Preview e Envio */}
      <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 space-y-3.5 shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">
            {t.project.step5Title}
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {t.project.step5Desc}
        </p>

        {/* Briefing summary preview box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-300 space-y-1">
          <div className="text-cyan-400 font-semibold text-[10px] uppercase">{t.project.summaryTitle}</div>
          <div>• {t.project.summaryCompany}: {businessName || t.project.toDefine}</div>
          <div>• {t.project.summaryStartingPoint}: {startType === 'modelo' ? selectedModel : startType === 'segmento' ? currentSegmentLabel : t.project.customIdea}</div>
          <div>• {t.project.summaryPlan}: {planObj.nome} ({planObj.tagline})</div>
          <div>• {t.project.summaryLanguage}: {getSiteLanguageLabel(siteLanguage)}</div>
          <div>• {t.project.summaryContact}: {contactName || t.project.notInformed} {contactWhatsapp ? `• ${contactWhatsapp}` : ''}</div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleSendWhatsapp}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>{t.project.sendWhatsappBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyBriefing}
            className={`py-3 px-4 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-1.5 ${
              copied
                ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-cyan-400" />
                <span>{t.project.copiedBtn}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t.project.copySummaryBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
