import { Search, Download } from 'lucide-react';
import { LeadFilters, LEAD_SOURCES, LEAD_STATUSES } from '@/types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onChange: (filters: LeadFilters) => void;
  onExport: () => void;
  isExporting?: boolean;
}

export function LeadFiltersBar({
  filters,
  onChange,
  onExport,
  isExporting,
}: LeadFiltersBarProps) {
  return (
    <div className="grid gap-4 rounded-lg border bg-card p-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="space-y-2 lg:col-span-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={filters.search ?? ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={filters.status ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              status: (e.target.value || '') as LeadFilters['status'],
              page: 1,
            })
          }
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Source</Label>
        <Select
          value={filters.source ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              source: (e.target.value || '') as LeadFilters['source'],
              page: 1,
            })
          }
        >
          <option value="">All sources</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sort</Label>
        <Select
          value={filters.sort ?? 'latest'}
          onChange={(e) =>
            onChange({
              ...filters,
              sort: e.target.value as 'latest' | 'oldest',
              page: 1,
            })
          }
        >
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
        </Select>
      </div>

      <div className="flex items-end lg:col-span-5">
        <Button variant="outline" onClick={onExport} isLoading={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
