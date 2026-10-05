import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import { ALL_STATUSES, STATUS_CONFIG } from '../utils/statusConfig';
import { cleanWhatsAppNumber, generateApproachMessage } from '../utils/messageGenerator';
import {
  X,
  Building2,
  MapPin,
  Briefcase,
  Phone,
  Instagram,
  Globe,
  FileText,
  Copy,
  Check,
  Send,
  Edit2,
  Trash2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateMessage: (id: string, message: string) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
  onUpdateMessage,
  onEditLead,
  onDeleteLead,
}) => {
  if (!isOpen || !lead) return null;

  const [copied, setCopied] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [currentNotes, setCurrentNotes] = useState(lead.observacoes || '');
  const [editingMessage, setEditingMessage] = useState(false);
  const [approachMessage, setApproachMessage] = useState(
    lead.mensagemAbordagem ||
      generateApproachMessage({
        nomeEmpresa: lead.nomeEmpresa,
        segmento: lead.segmento,
        cidade: lead.cidade,
      })
  );

  const meta = STATUS_CONFIG[lead.status];
  const cleanPhone = cleanWhatsAppNumber(lead.whatsapp);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(approachMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = approachMessage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleSaveNotes = () => {
    onUpdateNotes(lead.id, currentNotes);
    setEditingNotes(false);
  };

  const handleSaveMessage = () => {
    onUpdateMessage(lead.id, approachMessage);
    setEditingMessage(false);
  };

  const handleRegenerateMessage = () => {
    const fresh = generateApproachMessage({
      nomeEmpresa: lead.nomeEmpresa,
      segmento: lead.segmento,
      cidade: lead.cidade,
    });
    setApproachMessage(fresh);
    onUpdateMessage(lead.id, fresh);
  };

  // WhatsApp open link with encoded approach message
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(approachMessage)}`
    : undefined;

  // Instagram profile url
  const instagramHandle = lead.instagram
    ? lead.instagram.replace('@', '').trim()
    : '';
  const instagramUrl = instagramHandle
    ? `https://instagram.com/${instagramHandle}`
    : undefined;

  // Site url
  const siteUrl = lead.site
    ? lead.site.startsWith('http')
      ? lead.site
      : `https://${lead.site}`
    : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${meta.badgeClass}`}
            >
              {lead.status}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onEditLead(lead);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Editar dados cadastrais"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Deseja remover "${lead.nomeEmpresa}" dos seus leads?`)) {
                  onDeleteLead(lead.id);
                  onClose();
                }
              }}
              className="p-1.5 text-rose-400/80 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
              title="Excluir lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Header Lead Info */}
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              {lead.nomeEmpresa}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-indigo-300">
                <Briefcase className="w-3.5 h-3.5" />
                {lead.segmento}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {lead.cidade}
              </span>
            </div>
          </div>

          {/* Quick Contact Buttons Row */}
          <div className="grid grid-cols-3 gap-2">
            {/* WhatsApp */}
            {cleanPhone ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-center transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[11px] font-semibold">WhatsApp</span>
                <span className="text-[10px] text-emerald-400/80 truncate w-full">
                  {lead.whatsapp}
                </span>
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-slate-500 text-center opacity-60">
                <Phone className="w-4 h-4 mb-1" />
                <span className="text-[11px] font-medium">Sem WhatsApp</span>
              </div>
            )}

            {/* Instagram */}
            {instagramUrl ? (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-center transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <Instagram className="w-4 h-4 text-pink-400" />
                </div>
                <span className="text-[11px] font-semibold">Instagram</span>
                <span className="text-[10px] text-pink-400/80 truncate w-full">
                  @{instagramHandle}
                </span>
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-slate-500 text-center opacity-60">
                <Instagram className="w-4 h-4 mb-1" />
                <span className="text-[11px] font-medium">Sem Instagram</span>
              </div>
            )}

            {/* Site */}
            {siteUrl ? (
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-center transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <Globe className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-[11px] font-semibold">Website</span>
                <span className="text-[10px] text-cyan-400/80 truncate w-full">
                  Acessar
                </span>
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-slate-500 text-center opacity-60">
                <Globe className="w-4 h-4 mb-1" />
                <span className="text-[11px] font-medium">Sem Site</span>
              </div>
            )}
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Status do Funil
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {ALL_STATUSES.map((st) => {
                const isSelected = lead.status === st;
                const conf = STATUS_CONFIG[st];
                return (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(lead.id, st)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? `${conf.bgClass} ${conf.textClass} ${conf.borderClass} ring-1 ring-indigo-500/40 font-bold`
                        : 'bg-slate-950/50 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${conf.dotClass}`} />
                    <span>{st}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mensagem de Abordagem & Copiar */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Send className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">
                  Mensagem de Abordagem
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleRegenerateMessage}
                  className="p-1 text-slate-400 hover:text-indigo-400 rounded-md transition-colors"
                  title="Regenerar mensagem padrão"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditingMessage(!editingMessage)}
                  className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 px-1.5 py-0.5 rounded"
                >
                  {editingMessage ? 'Fechar' : 'Editar'}
                </button>
              </div>
            </div>

            {editingMessage ? (
              <div className="space-y-2">
                <textarea
                  rows={6}
                  value={approachMessage}
                  onChange={(e) => setApproachMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSaveMessage}
                  className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  Salvar Nova Mensagem
                </button>
              </div>
            ) : (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {approachMessage}
              </div>
            )}

            {/* Actions for Message */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {/* Botão Copiar Mensagem */}
              <button
                onClick={handleCopyMessage}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs border transition-all ${
                  copied
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Mensagem Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-300" />
                    <span>Copiar Mensagem</span>
                  </>
                )}
              </button>

              {/* Botão Abrir no WhatsApp se tiver telefone */}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar no WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* Observações */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Observações
              </span>
              <button
                onClick={() => setEditingNotes(!editingNotes)}
                className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300"
              >
                {editingNotes ? 'Cancelar' : 'Editar notas'}
              </button>
            </div>

            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={currentNotes}
                  onChange={(e) => setCurrentNotes(e.target.value)}
                  placeholder="Escreva anotações sobre este lead..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSaveNotes}
                  className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  Salvar Observações
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 rounded-xl p-3 border border-slate-850 min-h-[50px]">
                {lead.observacoes || (
                  <span className="text-slate-500 italic">
                    Nenhuma observação registrada. Clique em 'Editar notas' para adicionar detalhes.
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
