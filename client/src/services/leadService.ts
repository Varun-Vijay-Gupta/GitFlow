import { api } from './api';
import {
  ApiResponse,
  Lead,
  LeadFilters,
  LeadFormData,
  PaginationMeta,
} from '@/types';

interface LeadsResponse {
  leads: Lead[];
  pagination: PaginationMeta;
}

export const leadService = {
  getLeads: async (filters: LeadFilters) => {
    const params: Record<string, string | number> = {
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      sort: filters.sort ?? 'latest',
    };
    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.search?.trim()) params.search = filters.search.trim();

    const res = await api.get<ApiResponse<LeadsResponse>>('/leads', { params });
    return res.data;
  },

  getLeadById: async (id: string) => {
    const res = await api.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data: LeadFormData) => {
    const res = await api.post<ApiResponse<{ lead: Lead }>>('/leads', data);
    return res.data;
  },

  updateLead: async (id: string, data: Partial<LeadFormData>) => {
    const res = await api.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id: string) => {
    const res = await api.delete<ApiResponse>(`/leads/${id}`);
    return res.data;
  },

  exportCsv: async (filters: LeadFilters) => {
    const params: Record<string, string> = {
      sort: filters.sort ?? 'latest',
    };
    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.search?.trim()) params.search = filters.search.trim();

    const res = await api.get('/leads/export/csv', {
      params,
      responseType: 'blob',
    });
    return res.data as Blob;
  },
};
