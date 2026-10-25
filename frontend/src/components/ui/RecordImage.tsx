'use client';

import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { ImageOff } from 'lucide-react';
import { cn, getImageUrl, type ImageLike } from '@/lib/utils';

interface RecordImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: ImageLike;
}

/** Record-owned media only: never substitute a different record's image. */
export function RecordImage({ src, alt = '', className, onError, ...props }: RecordImageProps) {
  const url = getImageUrl(src);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (!url || failedUrl === url) {
    return (
      <div role="img" aria-label={`${alt}: image unavailable`}
        className={cn('flex h-full w-full flex-col items-center justify-center gap-3 bg-ink-900 p-6 text-center text-stone-300', className)}>
        <ImageOff className="h-8 w-8 text-bronze-300" aria-hidden />
        <span className="text-xs tracking-wide">{url ? 'Image unavailable' : 'Photography coming soon'}</span>
      </div>
    );
  }

  return <img {...props} src={url} alt={alt} className={className}
    onError={(event) => { setFailedUrl(url); onError?.(event); }} />;
}
