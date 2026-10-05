import { LeadStatus } from '../types';

export interface StatusMeta {
  label: LeadStatus;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
  dotClass: string;
  descricao: string;
}

export const STATUS_CONFIG: Record<LeadStatus, StatusMeta> = {
  Novo: {
    label: 'Novo',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dotClass: 'bg-blue-400',
    descricao: 'Lead recém identificado ou cadastrado',
  },
  Contatado: {
    label: 'Contatado',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotClass: 'bg-amber-400',
    descricao: 'Mensagem de abordagem enviada',
  },
  Respondeu: {
    label: 'Respondeu',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/30',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    dotClass: 'bg-purple-400',
    descricao: 'Cliente retornou o primeiro contato',
  },
  Interessado: {
    label: 'Interessado',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
    descricao: 'Demonstrou interesse em proposta ou reunião',
  },
  Fechado: {
    label: 'Fechado',
    bgClass: 'bg-green-500/20',
    textClass: 'text-green-300',
    borderClass: 'border-green-500/40',
    badgeClass: 'bg-green-500/20 text-green-300 border-green-500/40',
    dotClass: 'bg-green-400',
    descricao: 'Contrato fechado com sucesso!',
  },
  Perdido: {
    label: 'Perdido',
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/30',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dotClass: 'bg-rose-400',
    descricao: 'Sem interesse ou sem retorno no momento',
  },
};

export const ALL_STATUSES: LeadStatus[] = [
  'Novo',
  'Contatado',
  'Respondeu',
  'Interessado',
  'Fechado',
  'Perdido',
];
