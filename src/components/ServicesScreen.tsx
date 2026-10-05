import React from 'react';
import { ViewTab } from '../types';
import { getNexawebPlans } from '../data/servicesData';
import { Check, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

interface ServicesScreenProps {
  onSelectPlan: (planId: string) => void;
  onNavigate: (tab: ViewTab) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({
  onSelectPlan,
}) => {
  const { language, t } = useTranslation();
  const plans = getNexawebPlans(language);

  const getThemeStyles = (cor: 'azul' | 'dourado' | 'roxo') => {
    switch (cor) {
      case 'azul':
        return {
          cardBorder: 'border-blue-500/30 hover:border-blue-500/60',
          badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          gradientBar: 'from-blue-600 to-cyan-500',
          iconColor: 'text-cyan-400',
          btnBg: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40',
        };
      case 'dourado':
        return {
          cardBorder: 'border-amber-500/40 hover:border-amber-500/70',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          gradientBar: 'from-amber-500 via-orange-500 to-amber-600',
          iconColor: 'text-amber-400',
          btnBg: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold shadow-amber-900/40',
        };
      case 'roxo':
        return {
          cardBorder: 'border-purple-500/30 hover:border-purple-500/60',
          badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          gradientBar: 'from-purple-600 to-indigo-600',
          iconColor: 'text-purple-400',
          btnBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/40',
        };
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            {t.services.title}
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {t.services.badge}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {t.services.subtitle}
        </p>
      </div>

      {/* Plans List */}
      <div className="space-y-5">
        {plans.map((plan) => {
          const theme = getThemeStyles(plan.corIdentidade);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl bg-slate-900/90 border ${theme.cardBorder} p-5 transition-all duration-150 shadow-lg`}
            >
              {/* Highlight badge for Profissional */}
              {plan.destaque && (
                <div className="absolute -top-3 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide shadow-md shadow-amber-950">
                  <Sparkles className="w-3 h-3 text-slate-950 fill-current" />
                  {t.services.mostPopular}
                </div>
              )}

              {/* Header of the plan */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white tracking-tight">
                      {plan.nome}
                    </h2>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${theme.badgeBg}`}
                    >
                      {plan.corIdentidade === 'azul'
                        ? t.services.essentialBadge
                        : plan.corIdentidade === 'dourado'
                        ? t.services.featuredBadge
                        : t.services.customBadge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-300 mt-0.5">
                    {plan.tagline}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                {plan.descricao}
              </p>

              {/* Feature list */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] font-semibold text-slate-300 block">
                  {t.services.whatsIncluded}
                </span>
                {plan.recursos.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className={`w-3 h-3 ${theme.iconColor}`} />
                    </div>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-5 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${theme.btnBg}`}
                >
                  <span>{t.services.requestPlan}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom assurance box */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>{t.services.questionsTitle}</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.services.questionsDesc}
        </p>
      </div>
    </div>
  );
};
