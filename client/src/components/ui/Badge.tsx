import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { LeadStatus } from '@/types';

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Contacted: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  Qualified: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  Lost: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: LeadStatus;
}

export function Badge({ className, status, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        status ? statusStyles[status] : 'bg-secondary text-secondary-foreground',
        className
      )}
      {...props}
    >
      {children ?? status}
    </span>
  );
}
