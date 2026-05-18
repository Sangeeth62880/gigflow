import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Lead, leadsApi } from '@/api/leadsApi';
import { formatDate } from '@/utils/formatDate';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { LeadForm } from './LeadForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
}

export function LeadDetail({ lead, onClose }: LeadDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const canEditOrDelete = user?.role === 'admin' || user?._id === lead.createdBy._id;

  const deleteMutation = useMutation({
    mutationFn: () => leadsApi.deleteLead(lead._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      onClose();
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteMutation.mutate();
    }
  };

  if (isEditing) {
    return (
      <div className="p-4">
        <h3 className="mb-4 text-lg font-medium text-slate-900">Edit Lead</h3>
        <LeadForm 
          lead={lead} 
          onSuccess={() => setIsEditing(false)} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{lead.name}</h3>
          <p className="text-sm text-slate-500">{lead.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">Status</p>
            <Badge className="mt-1" variant={
              lead.status === 'Qualified' ? 'success' : 
              lead.status === 'Lost' ? 'danger' : 
              lead.status === 'Contacted' ? 'info' : 'default'
            }>
              {lead.status}
            </Badge>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">Source</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{lead.source}</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-200 pt-4">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Created At</span>
            <span className="text-sm font-medium text-slate-900">{formatDate(lead.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Last Updated</span>
            <span className="text-sm font-medium text-slate-900">{formatDate(lead.updatedAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Created By</span>
            <span className="text-sm font-medium text-slate-900">{lead.createdBy.name}</span>
          </div>
        </div>
      </div>

      {canEditOrDelete && (
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending}>
            Delete
          </Button>
          <Button onClick={() => setIsEditing(true)}>
            Edit Lead
          </Button>
        </div>
      )}
    </div>
  );
}
