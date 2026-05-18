import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Lead } from '@/api/leadsApi';
import { LeadRow } from './LeadRow';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onRowClick: (lead: Lead) => void;
}

export function LeadTable({ leads, isLoading, onRowClick }: LeadTableProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-hairline border-t-ink"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-canvas shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-hairline">
          <thead className="bg-surface-soft">
            <tr>
              <th scope="col" className="sticky top-0 bg-surface-soft py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-ink sm:pl-6">
                Name
              </th>
              <th scope="col" className="sticky top-0 bg-surface-soft px-3 py-3.5 text-left text-sm font-semibold text-ink">
                Email
              </th>
              <th scope="col" className="sticky top-0 bg-surface-soft px-3 py-3.5 text-left text-sm font-semibold text-ink">
                Status
              </th>
              <th scope="col" className="sticky top-0 bg-surface-soft px-3 py-3.5 text-left text-sm font-semibold text-ink">
                Source
              </th>
              <th scope="col" className="sticky top-0 bg-surface-soft px-3 py-3.5 text-left text-sm font-semibold text-ink">
                Created
              </th>
              {isAdmin && (
                <th scope="col" className="sticky top-0 bg-surface-soft px-3 py-3.5 text-left text-sm font-semibold text-ink">
                  Created By
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline bg-canvas">
            {leads.map((lead) => (
              <LeadRow 
                key={lead._id} 
                lead={lead} 
                isAdmin={isAdmin} 
                onClick={onRowClick} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
