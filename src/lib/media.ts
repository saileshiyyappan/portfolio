export interface ImageObjectLike {
  src?: unknown;
  caption?: unknown;
  description?: unknown;
  type?: unknown;
}

export function resolveImageSrc(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const src = value.trim();
    return src || undefined;
  }

  if (value && typeof value === 'object' && 'src' in value) {
    const src = (value as ImageObjectLike).src;
    if (typeof src === 'string' && src.trim()) return src.trim();
  }

  return undefined;
}

export function resolveMediaCaption(value: unknown): string | undefined {
  if (!value || typeof value !== 'object' || !('caption' in value)) return undefined;
  const caption = (value as ImageObjectLike).caption;
  return typeof caption === 'string' && caption.trim() ? caption : undefined;
}

export function resolveMediaDescription(value: unknown): string | undefined {
  if (!value || typeof value !== 'object' || !('description' in value)) return undefined;
  const description = (value as ImageObjectLike).description;
  return typeof description === 'string' && description.trim() ? description : undefined;
}
