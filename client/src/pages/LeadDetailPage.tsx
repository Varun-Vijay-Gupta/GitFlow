import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { leadService } from '@/services/leadService';
import { Lead, ApiResponse } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/store/AuthContext';

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    leadService
      .getLeadById(id)
      .then((res) => {
        if (res.data?.lead) setLead(res.data.lead);
      })
      .catch(() => toast.error('Lead not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Delete this lead?')) return;
    try {
      await leadService.deleteLead(id);
      toast.success('Lead deleted');
      navigate('/dashboard');
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      toast.error(error.response?.data?.message ?? 'Failed to delete');
    }
  };

  if (isLoading) return <Spinner />;
  if (!lead) {
    return <p className="text-center text-muted-foreground">Lead not found.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to dashboard
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{lead.name}</CardTitle>
            <p className="mt-1 text-muted-foreground">{lead.email}</p>
          </div>
          <Badge status={lead.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Source</p>
              <p>{lead.source}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p>{formatDate(lead.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Updated</p>
              <p>{formatDate(lead.updatedAt)}</p>
            </div>
            {lead.createdBy && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created by</p>
                <p>{lead.createdBy.name}</p>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="flex gap-2 pt-4">
              <Link to={`/leads/${lead._id}/edit`}>
                <Button variant="outline">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
