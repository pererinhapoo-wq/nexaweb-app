import React from 'react';
import { ChevronRight, FileCheck, Info } from 'lucide-react';
import { ImageUploadField } from '../ImageUploadField';

interface Step8FilesProps {
  attachedFiles: File[];
  setAttachedFiles: (files: File[]) => void;
  planName: string;
  onNext: () => void;
}

export const Step8Files: React.FC<Step8FilesProps> = ({
  attachedFiles,
  setAttachedFiles,
  planName,
  onNext,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Cabeçalho da Etapa 8 */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/40 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
            Arquivos & Imagens
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            Plano {planName}
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-extrabold text-white">
          Logo & Fotos do Negócio
        </h2>
        <p className="text-[11px] text-slate-400">
          Envie sua identidade visual e imagens para usarmos no site (até 6 arquivos).
        </p>
      </div>

      <div className="rounded-2xl p-4 sm:p-5 bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        {/* Upload de Imagens */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
              Arquivos do Projeto (opcional · limite de 6)
            </label>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">
              {attachedFiles.length} de 6 adicionados
            </span>
          </div>

          <ImageUploadField
            files={attachedFiles}
            onChange={setAttachedFiles}
            maxFiles={6}
          />
        </div>

        {/* Dica Informativa */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Não tem fotos profissionais ou logotipo agora?</span>
          </div>
          <p className="leading-relaxed pl-5 text-[10.5px]">
            Sem problemas! Se ainda não tiver imagens próprias, nossa equipe selecionará fotos profissionais de alta qualidade em bancos de imagem especializados no seu segmento para a primeira versão do site.
          </p>
        </div>
      </div>

      {/* Ação Principal */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>Avançar para Revisão & Resumo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
