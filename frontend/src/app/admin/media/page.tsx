'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Eye,
  X,
  Image as ImageIcon,
  Loader2,
  FileImage,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Modal } from '@/components/admin/Modal';
import { mediaApi } from '@/services';
import { getErrorMessage } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import type { MediaItem, Pagination } from '@/types';

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<MediaItem | null>(null);
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const [externalAlt, setExternalAlt] = useState('');
  const [urlPreviewError, setUrlPreviewError] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      params.set('page', String(page));
      params.set('limit', '20');
      params.set('sort', '-createdAt');
      const res = await mediaApi.getAll(undefined, `?${params.toString()}`);
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      await mediaApi.upload(Array.from(files));
      setMessage(`${files.length} file(s) uploaded successfully`);
      fetchItems();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await mediaApi.remove(deleting._id);
      setMessage('Media deleted');
      setDeleting(null);
      fetchItems();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const addExternalImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = new URL(externalUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('invalid');
    } catch {
      setError('Please enter a valid image URL.');
      return;
    }
    if (urlPreviewError) { setError('Unable to load image from this URL.'); return; }
    setUploading(true);
    setError('');
    try {
      await mediaApi.addExternal(externalUrl.trim(), externalAlt.trim(), 'external');
      setMessage('External image added to the media library');
      setExternalUrl(''); setExternalAlt(''); setUrlModalOpen(false); fetchItems();
    } catch (err) { setError(getErrorMessage(err) || 'Unable to load image from this URL.'); }
    finally { setUploading(false); }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => setMessage('URL copied to clipboard'),
      () => setError('Failed to copy URL')
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X className="h-4 w-4" /></button>
        </div>
      )}
      {message && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center justify-between">
          {message}
          <button onClick={() => setMessage('')}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media..."
              className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
        </div>
        <label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <span className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition-colors">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload
          </span>
        </label>
        <Button type="button" variant="outline" onClick={() => { setUrlPreviewError(false); setUrlModalOpen(true); }}><ImageIcon className="h-4 w-4" /> Add Image URL</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
          <ImageIcon className="h-10 w-10 mb-3" />
          <p className="text-sm">No media files yet</p>
          <p className="text-xs mt-1">Upload your first images above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="group relative rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-neutral-50 flex items-center justify-center relative">
                <img
                  src={item.secureUrl}
                  alt={item.altText || item.fileName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setPreviewUrl(item.secureUrl)}
                    className="rounded-lg bg-white/90 p-2 text-navy-700 hover:bg-white transition-colors"
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => copyUrl(item.secureUrl)}
                    className="rounded-lg bg-white/90 p-2 text-navy-700 hover:bg-white transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(item)}
                    className="rounded-lg bg-white/90 p-2 text-red-600 hover:bg-white transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-navy-800 truncate">{item.fileName || 'External image'}</p>
                <p className="text-[10px] text-neutral-400">{item.sourceType === 'url' ? 'External URL' : formatBytes(item.fileSize || 0)} &middot; {formatDateTime(item.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                p === page ? 'bg-brand-orange text-white' : 'bg-neutral-100 text-navy-600 hover:bg-neutral-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewUrl(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-neutral-300"><X className="h-8 w-8" /></button>
          <img src={previewUrl} alt="Preview" className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain" />
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete Media"
        message={`Are you sure you want to permanently delete "${deleting?.fileName}"? This cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        danger
      />
      <Modal open={urlModalOpen} onClose={() => setUrlModalOpen(false)} title="Add External Image URL" maxWidth="max-w-lg">
        <form onSubmit={addExternalImage} className="space-y-4">
          <p className="text-sm text-neutral-500">The image remains hosted at its original HTTPS URL and is not uploaded to ImageKit.</p>
          <label className="block text-sm font-medium text-navy-900">Image URL<input required type="url" value={externalUrl} onChange={(e) => { setExternalUrl(e.target.value); setUrlPreviewError(false); }} placeholder="https://example.com/image.jpg" className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" /></label>
          <label className="block text-sm font-medium text-navy-900">Alt text<input value={externalAlt} onChange={(e) => setExternalAlt(e.target.value)} placeholder="Describe the image" className="mt-1.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" /></label>
          {externalUrl && <img src={externalUrl} alt="Preview" onLoad={() => setUrlPreviewError(false)} onError={() => setUrlPreviewError(true)} className="h-40 w-full rounded-lg border border-neutral-200 object-contain" />}
          {urlPreviewError && <p className="text-sm text-red-600" role="alert">Unable to load image from this URL.</p>}
          <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={() => setUrlModalOpen(false)}>Cancel</Button><Button type="submit" disabled={uploading || urlPreviewError}>{uploading && <Loader2 className="h-4 w-4 animate-spin" />}Add image</Button></div>
        </form>
      </Modal>
    </div>
  );
}
