import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { leadService } from '@/services/leadService';
import { LeadForm } from '@/components/leads/LeadForm';
import { LeadFormData, ApiResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/store/AuthContext';

export function CreateLeadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (data: LeadFormData) => {
    try {
      await leadService.createLead(data);
      toast.success('Lead created successfully');
      navigate('/dashboard');
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      toast.error(error.response?.data?.message ?? 'Failed to create lead');
      throw err;
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Create New Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadForm
            onSubmit={handleSubmit}
            submitLabel="Create Lead"
            isAdmin={user?.role === 'admin'}
          />
        </CardContent>
      </Card>
    </div>
  );
}
