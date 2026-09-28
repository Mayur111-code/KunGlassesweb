'use client';

import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { mediaApi } from '@/services';
import { getErrorMessage } from '@/lib/api';

const isSafeUrl = (value: string) => {
  try { const url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:'; } catch { return false; }
};
const verifyImage = (url: string) => new Promise<boolean>((resolve) => {
  const image = new Image(); image.onload = () => resolve(true); image.onerror = () => resolve(false); image.src = url;
});

export function ImagePicker({ value, onChange, altText = '', label = 'Image' }: { value: string; onChange: (url: string) => void; altText?: string; label?: string }) {
  const [source, setSource] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const useUrl = async () => {
    const trimmed = url.trim();
    if (!isSafeUrl(trimmed)) return setError('Please enter a valid image URL.');
    if (!(await verifyImage(trimmed))) return setError('Unable to load image from this URL.');
    setError(''); onChange(trimmed);
  };
  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true); setError('');
    try { const res = await mediaApi.upload([file], 'cms', altText); onChange(res.data.items[0].secureUrl); }
    catch (err) { setError(getErrorMessage(err) || 'Image upload failed. Please try again.'); }
    finally { setUploading(false); event.target.value = ''; }
  };
  return <div className="space-y-3">
    <div className="inline-flex rounded-lg bg-neutral-100 p-1 text-sm">
      <button type="button" onClick={() => setSource('upload')} className={`rounded-md px-3 py-1.5 ${source === 'upload' ? 'bg-white font-semibold text-navy-950 shadow-sm' : 'text-neutral-500'}`}>Upload Image</button>
      <button type="button" onClick={() => setSource('url')} className={`rounded-md px-3 py-1.5 ${source === 'url' ? 'bg-white font-semibold text-navy-950 shadow-sm' : 'text-neutral-500'}`}>Image URL</button>
    </div>
    {source === 'upload' ? <>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={upload} />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{uploading ? 'Uploading…' : 'Choose Image'}</Button>
    </> : <div className="flex flex-col gap-2 sm:flex-row"><input value={url} onChange={(e) => setUrl(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm" placeholder="https://example.com/image.jpg" /><Button type="button" variant="outline" onClick={useUrl}>Preview</Button></div>}
    {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
    {value && <div className="flex items-center gap-3 rounded-lg border border-neutral-200 p-2"><img src={value} alt={altText || label} className="h-16 w-20 rounded object-cover" onError={() => setError('Unable to load image from this URL.')} /><span className="min-w-0 flex-1 truncate text-xs text-neutral-500">{value}</span><button type="button" onClick={() => onChange('')} className="rounded p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${label}`}><Trash2 className="h-4 w-4" /></button></div>}
  </div>;
}

export function ImageGalleryPicker({ images, onChange, altText = '' }: { images: string[]; onChange: (images: string[]) => void; altText?: string }) {
  const [url, setUrl] = useState(''); const [error, setError] = useState(''); const [uploading, setUploading] = useState(false); const ref = useRef<HTMLInputElement>(null);
  const addUrl = async () => { const trimmed = url.trim(); if (!isSafeUrl(trimmed)) return setError('Please enter a valid image URL.'); if (!(await verifyImage(trimmed))) return setError('Unable to load image from this URL.'); setError(''); onChange([...images, trimmed]); setUrl(''); };
  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => { const files = Array.from(event.target.files ?? []); if (!files.length) return; setUploading(true); setError(''); try { const res = await mediaApi.upload(files, 'cms', altText); onChange([...images, ...res.data.items.map((item) => item.secureUrl)]); } catch (err) { setError(getErrorMessage(err) || 'Image upload failed. Please try again.'); } finally { setUploading(false); event.target.value = ''; } };
  const move = (index: number, delta: number) => { const target = index + delta; if (target < 0 || target >= images.length) return; const next = [...images]; [next[index], next[target]] = [next[target], next[index]]; onChange(next); };
  return <div className="space-y-3"><div className="flex flex-col gap-2 sm:flex-row"><input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="hidden" onChange={upload} /><Button type="button" variant="outline" onClick={() => ref.current?.click()} disabled={uploading}>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}Upload Images</Button><input value={url} onChange={(e) => setUrl(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm" placeholder="Paste external image URL" /><Button type="button" variant="outline" onClick={addUrl}><ImagePlus className="h-4 w-4" />Add URL</Button></div>{error && <p className="text-xs text-red-600" role="alert">{error}</p>}<div className="grid gap-2">{images.map((image, index) => <div key={`${image}-${index}`} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-2"><img src={image} alt={altText || `Gallery image ${index + 1}`} className="h-12 w-16 rounded object-cover" onError={() => setError('Unable to load image from this URL.')} /><span className="min-w-0 flex-1 truncate text-xs text-neutral-500">{image}</span><button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="p-1.5 disabled:opacity-30" aria-label="Move image up"><ArrowUp className="h-4 w-4" /></button><button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} className="p-1.5 disabled:opacity-30" aria-label="Move image down"><ArrowDown className="h-4 w-4" /></button><button type="button" onClick={() => onChange(images.filter((_, i) => i !== index))} className="p-1.5 text-red-600" aria-label="Remove image"><Trash2 className="h-4 w-4" /></button></div>)}</div></div>;
}
