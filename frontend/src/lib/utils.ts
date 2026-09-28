export const KUN_COMPANY_ADDRESS =
  'KUN Glass & Aluminium\nS. No. 349/2/3, Lohkare Mala,\nNear Golden Universal School,\nOpposite Ceramic House Showroom,\nBehind Tuljai Hotel,\nAurangabad-Takli Link Road,\nNashik - 422003, Maharashtra, India';

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '—';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (date: string | Date | undefined): string => {
  if (!date) return '—';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const formatWhatsAppNumber = (number: string): string => {
  let digits = number.replace(/\D/g, '');
  if (digits.length === 10) digits = `91${digits}`;
  return digits;
};

export const buildWhatsAppLink = (number: string, message: string): string => {
  const formatted = formatWhatsAppNumber(number);
  return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
};

export const buildTelLink = (number: string): string => {
  const digits = number.replace(/\D/g, '');
  return `tel:+${digits}`;
};

export const buildMailtoLink = (email: string, subject?: string): string => {
  return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
};

export const truncate = (text: string, length: number): string => {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

export type ImageLike =
  | string
  | { url?: string | null; secureUrl?: string | null; filePath?: string | null; sourceType?: string | null }
  | null
  | undefined;

export const getImageUrl = (image: ImageLike, fallback = ''): string => {
  if (!image) return fallback;

  if (typeof image === 'string') {
    return image.trim() || fallback;
  }

  const directUrl = image.url ?? image.secureUrl ?? '';
  if (directUrl.trim()) return directUrl.trim();

  if (image.filePath) {
    const endpoint = (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? 'https://ik.imagekit.io').replace(/\/$/, '');
    return `${endpoint}/${image.filePath.replace(/^\/+/, '')}`;
  }

  return fallback;
};

export const getInitials = (name?: string): string => {
  if (!name) return 'K';
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};