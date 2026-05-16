import { Inbox } from 'lucide-react';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

export function EmptyState({
  title = 'No leads found',
  description = 'Try adjusting your filters or create a new lead.',
  actionLabel = 'Create Lead',
  actionTo = '/leads/new',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionTo && (
        <Link to={actionTo} className="mt-6">
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
