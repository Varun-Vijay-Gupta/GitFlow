import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { leadService } from '@/services/leadService';
import { LeadForm } from '@/components/leads/LeadForm';
import { LeadFormData, ApiResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/store/AuthContext';

export function EditLeadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [initialData, setInitialData] = useState<LeadFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    leadService
      .getLeadById(id)
      .then((res) => {
        if (res.data?.lead) {
          const { name, email, status, source } = res.data.lead;
          setInitialData({ name, email, status, source });
        }
      })
      .catch(() => toast.error('Lead not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (data: LeadFormData) => {
    if (!id) return;
    try {
      await leadService.updateLead(id, data);
      toast.success('Lead updated successfully');
      navigate(`/leads/${id}`);
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      toast.error(error.response?.data?.message ?? 'Failed to update lead');
      throw err;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <p className="text-center text-muted-foreground">
        Only admins can edit leads.
      </p>
    );
  }

  if (isLoading) return <Spinner />;

  if (!initialData) {
    return <p className="text-center text-muted-foreground">Lead not found.</p>;
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Edit Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel="Update Lead"
            isAdmin
          />
        </CardContent>
      </Card>
    </div>
  );
}
