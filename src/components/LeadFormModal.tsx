import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import { ALL_STATUSES } from '../utils/statusConfig';
import { X, Building2, MapPin, Briefcase, Phone, Instagram, Globe, FileText, Check } from 'lucide-react';
import { generateApproachMessage } from '../utils/messageGenerator';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  initialLead?: Lead | null;
  defaultCidade?: string;
  defaultSegmento?: string;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialLead,
  defaultCidade = '',
  defaultSegmento = '',
}) => {
  if (!isOpen) return null;

  const [nomeEmpresa, setNomeEmpresa] = useState(initialLead?.nomeEmpresa || '');
  const [segmento, setSegmento] = useState(
    initialLead?.segmento || defaultSegmento || ''
  );
  const [cidade, setCidade] = useState(
    initialLead?.cidade || defaultCidade || ''
  );
  const [whatsapp, setWhatsapp] = useState(initialLead?.whatsapp || '');
  const [instagram, setInstagram] = useState(initialLead?.instagram || '');
  const [site, setSite] = useState(initialLead?.site || '');
  const [status, setStatus] = useState<LeadStatus>(initialLead?.status || 'Novo');
  const [observacoes, setObservacoes] = useState(initialLead?.observacoes || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomeEmpresa.trim()) {
      setError('Por favor, informe o nome da empresa.');
      return;
    }
    if (!segmento.trim()) {
      setError('Por favor, informe o segmento de atuação.');
      return;
    }
    if (!cidade.trim()) {
      setError('Por favor, informe a cidade.');
      return;
    }

    const agora = new Date().toISOString();
    const mensagemGerada =
      initialLead?.mensagemAbordagem ||
      generateApproachMessage({
        nomeEmpresa: nomeEmpresa.trim(),
        segmento: segmento.trim(),
        cidade: cidade.trim(),
      });

    const leadToSave: Lead = {
      id: initialLead ? initialLead.id : `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      nomeEmpresa: nomeEmpresa.trim(),
      segmento: segmento.trim(),
      cidade: cidade.trim(),
      whatsapp: whatsapp.trim() || undefined,
      instagram: instagram.trim() || undefined,
      site: site.trim() || undefined,
      observacoes: observacoes.trim() || undefined,
      status,
      mensagemAbordagem: mensagemGerada,
      dataCriacao: initialLead ? initialLead.dataCriacao : agora,
      dataAtualizacao: agora,
    };

    onSave(leadToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">
                {initialLead ? 'Editar Lead' : 'Novo Lead'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {initialLead ? 'Atualize as informações do contato' : 'Cadastre uma nova empresa no funil'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Nome da Empresa */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Nome da Empresa *
            </label>
            <input
              type="text"
              value={nomeEmpresa}
              onChange={(e) => {
                setNomeEmpresa(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ex: Clínica Alpha, Pizzaria Bella..."
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500"
              required
            />
          </div>

          {/* Segmento & Cidade em 2 colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                Segmento *
              </label>
              <input
                type="text"
                value={segmento}
                onChange={(e) => {
                  setSegmento(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ex: Estética, Odonto, Gastronomia..."
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                Cidade *
              </label>
              <input
                type="text"
                value={cidade}
                onChange={(e) => {
                  setCidade(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ex: São Paulo - SP"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp / Telefone
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ex: (11) 98765-4321 ou 11987654321"
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500"
            />
          </div>

          {/* Instagram & Site */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                Instagram
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@perfil.empresa"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Site Atual
              </label>
              <input
                type="text"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                placeholder="Ex: www.empresa.com.br"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Status Inicial */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Status Inicial
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {ALL_STATUSES.map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    status === st
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Observações
            </label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Não tem site ainda, o Instagram tem 5k seguidores, postam diariamente..."
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
