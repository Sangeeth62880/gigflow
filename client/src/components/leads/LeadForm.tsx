import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi, Lead } from '@/api/leadsApi';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Organic', 'Referral', 'LinkedIn', 'Twitter', 'Direct', 'Other', 'Website', 'Instagram']),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

export function LeadForm({ lead, onSuccess, onCancel }: LeadFormProps) {
  const [apiError, setApiError] = useState('');
  const queryClient = useQueryClient();
  const isEditing = !!lead;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead || {
      status: 'New',
      source: 'Organic',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: LeadFormData) => {
      return isEditing ? leadsApi.updateLead(lead._id, data) : leadsApi.createLead(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      onSuccess();
    },
    onError: (error: any) => {
      setApiError(error.response?.data?.message || 'An error occurred');
    },
  });

  const onSubmit = (data: LeadFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      <Input
        label="Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Select
        label="Status"
        {...register('status')}
        error={errors.status?.message}
        options={[
          { label: 'New', value: 'New' },
          { label: 'Contacted', value: 'Contacted' },
          { label: 'Qualified', value: 'Qualified' },
          { label: 'Lost', value: 'Lost' },
        ]}
      />

      <Select
        label="Source"
        {...register('source')}
        error={errors.source?.message}
        options={[
          { label: 'Organic', value: 'Organic' },
          { label: 'Referral', value: 'Referral' },
          { label: 'LinkedIn', value: 'LinkedIn' },
          { label: 'Twitter', value: 'Twitter' },
          { label: 'Direct', value: 'Direct' },
          { label: 'Website', value: 'Website' },
          { label: 'Instagram', value: 'Instagram' },
          { label: 'Other', value: 'Other' },
        ]}
      />

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={mutation.isPending}>
          {isEditing ? 'Save Changes' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
}
