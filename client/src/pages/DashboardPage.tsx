import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useAuth } from '@/store/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { leadService } from '@/services/leadService';
import { Lead, LeadFilters, PaginationMeta, ApiResponse } from '@/types';
import { LeadFiltersBar } from '@/components/leads/LeadFiltersBar';
import { LeadTable } from '@/components/leads/LeadTable';
import { Pagination } from '@/components/leads/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const defaultPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  totalPages: 1,
  totalRecords: 0,
};

export function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: 10,
    sort: 'latest',
    search: '',
    status: '',
    source: '',
  });

  const debouncedSearch = useDebounce(filters.search, 500);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await leadService.getLeads({
        ...filters,
        search: debouncedSearch,
      });
      if (res.data) {
        setLeads(res.data.leads);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      toast.error(error.response?.data?.message ?? 'Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await leadService.deleteLead(id);
      toast.success('Lead deleted');
      fetchLeads();
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      toast.error(error.response?.data?.message ?? 'Failed to delete lead');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await leadService.exportCsv({
        ...filters,
        search: debouncedSearch,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gigflow-leads-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track your sales leads
          </p>
        </div>
        <Link to="/leads/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pagination.totalRecords}</p>
          </CardContent>
        </Card>
      </div>

      <LeadFiltersBar
        filters={filters}
        onChange={setFilters}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {isLoading ? (
        <Spinner />
      ) : leads.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <LeadTable leads={leads} isAdmin={!!isAdmin} onDelete={handleDelete} />
          <Pagination
            pagination={pagination}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </>
      )}
    </div>
  );
}
