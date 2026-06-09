import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold uppercase tracking-wider',
  {
    variants: {
      tone: {
        bio:    'bg-bio-100 text-bio-700',
        white:  'bg-white text-bio-700',
        outline:'border border-bio-100 text-ink/70 bg-white',
        success:'bg-green-100 text-green-700',
        warn:   'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-700',
        dark:   'bg-bio-900 text-white',
      },
      size: {
        xs: 'text-[10px] px-2 py-0.5',
        sm: 'text-xs',
        md: 'text-sm px-3 py-1.5',
      },
    },
    defaultVariants: { tone: 'bio', size: 'sm' },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, size }), className)} {...props} />;
}
