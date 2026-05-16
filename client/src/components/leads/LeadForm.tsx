import { FormEvent, useState } from 'react';
import { LeadFormData, LEAD_SOURCES, LEAD_STATUSES } from '@/types';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface LeadFormProps {
  initialData?: LeadFormData;
  onSubmit: (data: LeadFormData) => Promise<void>;
  submitLabel?: string;
  isAdmin?: boolean;
}

const defaultData: LeadFormData = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website',
};

export function LeadForm({
  initialData,
  onSubmit,
  submitLabel = 'Save Lead',
  isAdmin = true,
}: LeadFormProps) {
  const [form, setForm] = useState<LeadFormData>(initialData ?? defaultData);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="John Doe"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="john@example.com"
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as LeadFormData['status'] })
            }
            disabled={!isAdmin && !!initialData}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select
            id="source"
            value={form.source}
            onChange={(e) =>
              setForm({ ...form, source: e.target.value as LeadFormData['source'] })
            }
          >
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
}
