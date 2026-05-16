import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Lead } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '@/lib/utils';

interface LeadTableProps {
  leads: Lead[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export function LeadTable({ leads, isAdmin, onDelete }: LeadTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">Email</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="hidden px-4 py-3 text-left font-medium md:table-cell">Source</th>
            <th className="hidden px-4 py-3 text-left font-medium lg:table-cell">Created</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-b transition-colors hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{lead.name}</td>
              <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                {lead.email}
              </td>
              <td className="px-4 py-3">
                <Badge status={lead.status} />
              </td>
              <td className="hidden px-4 py-3 md:table-cell">{lead.source}</td>
              <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Link to={`/leads/${lead._id}`}>
                    <Button variant="ghost" size="icon" aria-label="View">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  {isAdmin && (
                    <>
                      <Link to={`/leads/${lead._id}/edit`}>
                        <Button variant="ghost" size="icon" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        onClick={() => onDelete(lead._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
