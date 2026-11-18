"use client";

import React, { useState } from "react";
import { Image as ImageIcon, ExternalLink, Download } from "lucide-react";

interface MediaContentRendererProps {
  content: string;
}

// Regex para identificar imagens no padrão Markdown ![alt](url) ou links isolados para imagem/media
const IMAGE_MARKDOWN_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;
const MEDIA_LINK_REGEX = /\[([^\]]*)\]\((https?:\/\/[^\s)]+\.(?:jpg|jpeg|png|webp|gif)|(?:\/media\/[^\s)]+))\)/gi;
const RAW_MEDIA_URL_REGEX = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|webp|gif)|\/media\/[^\s]+\.(?:jpg|jpeg|png|webp|gif))/gi;

export function MediaContentRenderer({ content }: MediaContentRendererProps) {
  // Coletor de mídias encontradas no texto
  const foundImages: { alt: string; url: string }[] = [];

  // 1. Markdown imagens ![alt](url)
  let match: RegExpExecArray | null;
  const mdRegex = new RegExp(IMAGE_MARKDOWN_REGEX);
  while ((match = mdRegex.exec(content)) !== null) {
    foundImages.push({ alt: match[1] || "Design gerado", url: match[2] });
  }

  // 2. Links normais apontando para imagem ou /media/
  const linkRegex = new RegExp(MEDIA_LINK_REGEX);
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    if (!foundImages.some((img) => img.url === url)) {
      foundImages.push({ alt: match[1] || "Visual gerado", url });
    }
  }

  // 3. URLs brutas de mídia
  const rawRegex = new RegExp(RAW_MEDIA_URL_REGEX);
  while ((match = rawRegex.exec(content)) !== null) {
    const url = match[1];
    if (!foundImages.some((img) => img.url === url)) {
      foundImages.push({ alt: "Criativo publicitário", url });
    }
  }

  // Normaliza o URL: se for /media/... ou se for mock atlas-ai.com/media/...
  const normalizeMediaUrl = (rawUrl: string): string => {
    if (rawUrl.includes("atlas-ai.com/media/")) {
      const pathPart = rawUrl.split("atlas-ai.com/media/")[1];
      return `/media/${pathPart}`;
    }
    return rawUrl;
  };

  return (
    <div className="space-y-4">
      {/* Texto formatado */}
      <div className="whitespace-pre-wrap leading-relaxed">
        {content}
      </div>

      {/* Cards de imagem gerada */}
      {foundImages.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 max-w-md">
          {foundImages.map((img, idx) => {
            const finalUrl = normalizeMediaUrl(img.url);
            return <ImagePreviewCard key={idx} alt={img.alt} url={finalUrl} />;
          })}
        </div>
      )}
    </div>
  );
}

function ImagePreviewCard({ alt, url }: { alt: string; url: string }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0f] p-2 shadow-2xl transition-all duration-300 hover:border-white/20">
      <div className="relative aspect-[4/5] max-h-[380px] w-full overflow-hidden rounded-lg bg-black/60 flex items-center justify-center">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#121214] text-gray-400">
            <ImageIcon className="w-6 h-6 animate-pulse text-indigo-400" />
            <span className="text-xs font-medium">Carregando imagem do criativo...</span>
          </div>
        )}

        {hasError ? (
          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-200">Criativo de Design Registrado</p>
              <p className="text-[11px] text-gray-400 mt-1 max-w-[240px]">
                {alt || "Arte Publicitária Gerada para Feed / Story"}
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span>Abrir link da imagem</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={url}
            alt={alt}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        )}
      </div>

      <div className="mt-2.5 px-1 pb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-gray-300 truncate max-w-[220px]" title={alt}>
          {alt}
        </span>
        <a
          href={url}
          target="_blank"
          download
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Download className="w-3 h-3" />
          <span>Baixar</span>
        </a>
      </div>
    </div>
  );
}
