import { flagUrl } from '@/lib/teams';
import { cn } from '@/lib/utils';

interface FlagProps {
  code:      string;
  alt?:      string;
  size?:     number;
  className?: string;
}

export function Flag({ code, alt, size = 24, className }: FlagProps) {
  if (!code || code === 'xx') {
    return (
      <span
        className={cn('inline-block bg-bio-100/10 border border-bio-100/20 rounded-sm shrink-0', className)}
        style={{ width: size * 1.5, height: size }}
        aria-label={alt ?? 'Bandera no disponible'}
      />
    );
  }
  const width = size >= 80 ? 320 : size >= 40 ? 160 : 80;
  return (
    <img
      src={flagUrl(code, width)}
      alt={alt ?? code.toUpperCase()}
      className={cn('inline-block rounded-sm object-cover shadow-sm shrink-0', className)}
      style={{ height: size, width: size * 1.5, maxWidth: size * 1.5 }}
      loading="lazy"
    />
  );
}
