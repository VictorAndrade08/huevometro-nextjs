import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tilt?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, tilt, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white border border-bio-100 rounded-2xl shadow-sm',
        tilt && 'card-tilt',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';
