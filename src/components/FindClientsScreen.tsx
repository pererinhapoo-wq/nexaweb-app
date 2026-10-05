import React, { useState } from 'react';
import { MapPin, Briefcase, Search, Sparkles, Plus, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface FindClientsScreenProps {
  onPreFillLead: (cidade: string, segmento: string) => void;
}

export const FindClientsScreen: React.FC<FindClientsScreenProps> = ({ onPreFillLead }) => {
  const [cidade, setCidade] = useState('');
  const [segmento, setSegmento] = useState('');
  const [buscaRealizada, setBuscaRealizada] = useState<{
    cidade: string;
    segmento: string;
    timestamp: Date;
  } | null>(null);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cidade.trim() && !segmento.trim()) return;

    setBuscaRealizada({
      cidade: cidade.trim(),
      segmento: segmento.trim(),
      timestamp: new Date(),
    });
  };

  const sugestoesSegmentos = [
    'Clínica Médica / Estética',
    'Restaurante / Delivery',
    'Advocacia & Jurídico',
    'Energia Solar / Elétrica',
    'Construção & Reformas',
    'Contabilidade & Finanças',
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Encontrar Clientes
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            V1
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Defina a localização e o nicho de mercado desejado para a prospecção da NexaWeb.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-slate-950/40">
        <form onSubmit={handleBuscar} className="space-y-4">
          {/* Campo de cidade */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Cidade ou Região
            </label>
            <div className="relative">
              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: São Paulo, Campinas, Curitiba..."
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          {/* Campo de segmento */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              Segmento de Atuação
            </label>
            <div className="relative">
              <input
                type="text"
                value={segmento}
                onChange={(e) => setSegmento(e.target.value)}
                placeholder="Ex: Estética, Restaurante, Advocacia..."
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors"
              />
            </div>

            {/* Quick Segment tags */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {sugestoesSegmentos.map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => setSegmento(sug)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Botão Buscar */}
          <button
            type="submit"
            disabled={!cidade.trim() && !segmento.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </button>
        </form>
      </div>

      {/* Resultado / Estado pós-busca */}
      {buscaRealizada ? (
        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Critérios de Prospecção Definidos
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {buscaRealizada.segmento && (
                  <span className="font-semibold text-indigo-300">
                    {buscaRealizada.segmento}
                  </span>
                )}
                {buscaRealizada.cidade && buscaRealizada.segmento && ' • '}
                {buscaRealizada.cidade && (
                  <span className="font-semibold text-cyan-300">
                    {buscaRealizada.cidade}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Aviso claro sobre a V1 e preparação do Radar */}
          <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-3.5 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-cyan-300">
                Módulo Radar de Clientes (Planejado para V2)
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Nesta versão inicial V1, a busca automática via APIs externas ainda não está ativa conforme as diretrizes do projeto. A arquitetura já está estruturada para receber o Radar de Clientes.
              </p>
            </div>
          </div>

          {/* Ação útil imediata para o usuário */}
          <div className="pt-1">
            <button
              onClick={() => onPreFillLead(buscaRealizada.cidade, buscaRealizada.segmento)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500/50 text-white transition-all text-xs font-semibold group"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Cadastrar lead com estes dados em Meus Leads</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Explanatory card when no search performed yet */
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 space-y-1">
            <span className="font-medium text-slate-300 block">
              Como funciona nesta etapa?
            </span>
            <p className="text-[11px] leading-relaxed">
              Preencha a cidade e o segmento desejado para direcionar a sua prospecção. Você poderá cadastrar empresas encontradas manualmente em <strong>Meus Leads</strong> para acompanhar o funil completo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
