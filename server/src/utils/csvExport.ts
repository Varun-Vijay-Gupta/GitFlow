import { ILead } from '../models/Lead';

export const leadsToCsv = (leads: ILead[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At', 'Updated At'];
  const rows = leads.map((lead) => [
    escapeCsv(lead.name),
    escapeCsv(lead.email),
    lead.status,
    lead.source,
    lead.createdAt.toISOString(),
    lead.updatedAt.toISOString(),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

const escapeCsv = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};
