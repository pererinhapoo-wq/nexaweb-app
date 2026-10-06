import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UPLOAD_RULES } from '../data/commercialRules';

interface ImageUploadFieldProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  files,
  onChange,
  disabled = false,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const combined = [...files, ...newFiles];

    // 1. Limite de quantidade
    if (combined.length > UPLOAD_RULES.maxFiles) {
      setErrorMessage(`Limite máximo de ${UPLOAD_RULES.maxFiles} imagens atingido. Remova algumas para adicionar novas.`);
      return;
    }

    // 2. Validação individual de tamanho e formato
    for (const file of newFiles) {
      if (file.size > UPLOAD_RULES.maxSizeBytes) {
        setErrorMessage(`O arquivo "${file.name}" excede o limite oficial de ${UPLOAD_RULES.maxSizeMB} MB.`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrorMessage(`O arquivo "${file.name}" não é uma imagem válida.`);
        return;
      }
    }

    onChange(combined);
    // Limpa o valor para permitir re-seleção do mesmo arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setErrorMessage(null);
    const updated = files.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 block">
          Imagens e Referências Visuais
        </label>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          {files.length} / {UPLOAD_RULES.maxFiles} imagens
        </span>
      </div>

      {/* Regra comercial informada com clareza ao usuário */}
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Envie logotipos, fotos de produtos, espaço ou referências visuais que deseja ver no site. Limite oficial: até 6 imagens de no máximo 10 MB cada.
      </p>

      {/* Botão de Seleção / Drop Area */}
      {files.length < UPLOAD_RULES.maxFiles && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="w-full min-h-[52px] p-3 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-950/60 hover:bg-slate-900/60 transition-all flex items-center justify-center gap-2.5 text-slate-300 hover:text-cyan-300 text-xs font-semibold group cursor-pointer active:scale-[0.99]"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Upload className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="block leading-tight font-bold text-white group-hover:text-cyan-300">
              Toque para selecionar imagens
            </span>
            <span className="text-[10px] text-slate-500 block">
              JPG, PNG, WebP ou GIF (máx. 10 MB cada)
            </span>
          </div>
        </button>
      )}

      {/* Input nativo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Mensagem de Erro de Validação */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid de Previews de Imagens Selecionadas */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {files.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <div
                key={`${file.name}-${idx}`}
                className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-sm flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full bg-slate-900 relative overflow-hidden">
                  <img
                    src={previewUrl}
                    alt={`Anexo ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => URL.revokeObjectURL(previewUrl)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-md"
                    title="Remover imagem"
                    aria-label={`Remover imagem ${file.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-2 bg-slate-900/90 border-t border-slate-800 text-[10px]">
                  <p className="font-semibold text-slate-300 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-slate-500 font-mono">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
