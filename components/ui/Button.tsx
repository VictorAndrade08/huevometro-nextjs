import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-display font-semibold tracking-tight transition-all rounded-2xl focus:outline-none focus:ring-2 focus:ring-bio-500/40 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'btn-bio',
        ghost:   'btn-ghost',
        white:   'bg-white text-bio-700 hover:bg-bio-50 shadow-lg',
        dark:    'bg-bio-900 text-white hover:bg-bio-800',
      },
      size: {
        sm: 'text-xs px-3 py-2 rounded-lg',
        md: 'text-sm px-5 py-3',
        lg: 'text-lg px-8 py-4 rounded-2xl',
        xl: 'text-xl px-10 py-5 rounded-2xl font-extrabold',
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', block: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
