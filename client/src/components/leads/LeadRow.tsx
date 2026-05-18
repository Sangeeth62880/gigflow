import React from 'react';
import { Lead } from '@/api/leadsApi';
import { Badge } from '../ui/Badge';
import { formatDate } from '@/utils/formatDate';

interface LeadRowProps {
  lead: Lead;
  isAdmin: boolean;
  onClick: (lead: Lead) => void;
}

export function LeadRow({ lead, isAdmin, onClick }: LeadRowProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'New': return 'default';
      case 'Contacted': return 'info';
      case 'Qualified': return 'success';
      case 'Lost': return 'danger';
      default: return 'default';
    }
  };

  return (
    <tr 
      className="cursor-pointer hover:bg-surface-soft transition-colors"
      onClick={() => onClick(lead)}
    >
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-ink sm:pl-6">
        {lead.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted">
        {lead.email}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted">
        <Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted">
        {lead.source}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted">
        {formatDate(lead.createdAt)}
      </td>
      {isAdmin && (
        <td className="whitespace-nowrap px-3 py-4 text-sm text-muted">
          {lead.createdBy.name}
        </td>
      )}
    </tr>
  );
}
