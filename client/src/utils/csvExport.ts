import { Lead } from '@/api/leadsApi';
import { formatDate } from './formatDate';

export function downloadLeadsCSV(leads: Lead[], filename = 'leads_export.csv') {
  if (!leads.length) return;

  const headers = ['Name', 'Email', 'Status', 'Source', 'Created By', 'Created At'];

  const rows = leads.map((lead) => [
    `"${lead.name.replace(/"/g, '""')}"`,
    `"${lead.email.replace(/"/g, '""')}"`,
    lead.status,
    lead.source,
    `"${lead.createdBy.name.replace(/"/g, '""')}"`,
    formatDate(lead.createdAt),
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
