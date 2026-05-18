import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { leadsApi, Lead } from '@/api/leadsApi';
import { downloadLeadsCSV } from '@/utils/csvExport';
import { FilterBar } from '@/components/leads/FilterBar';
import { LeadTable } from '@/components/leads/LeadTable';
import { Pagination } from '@/components/leads/Pagination';
import { EmptyState } from '@/components/leads/EmptyState';
import { LeadForm } from '@/components/leads/LeadForm';
import { LeadDetail } from '@/components/leads/LeadDetail';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { leads, pagination, isLoading, error, activeFiltersCount } = useLeads();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const search = searchParams.get('search') || undefined;
      const status = searchParams.get('status') || undefined;
      const source = searchParams.get('source') || undefined;
      const sort = (searchParams.get('sort') as 'latest' | 'oldest') || 'latest';

      const data = await leadsApi.exportLeads({ search, status, source, sort });
      downloadLeadsCSV(data);
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm font-medium text-red-800">Failed to load leads. Please try again.</p>
      </div>
    );
  }

  const showEmptyState = !isLoading && leads.length === 0;

  return (
    <>
      <div className="mb-8 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Leads Directory</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage, edit, and export your active sales leads
          </p>
        </div>
        <div className="mt-4 flex sm:ml-4 sm:mt-0 gap-3">
          <Button variant="outline" onClick={handleExport} isLoading={isExporting} className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Lead
          </Button>
        </div>
      </div>

      <FilterBar />

      {showEmptyState ? (
        <EmptyState 
          hasFilters={activeFiltersCount > 0} 
          onClearFilters={clearFilters}
          onCreateLead={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <LeadTable 
            leads={leads} 
            isLoading={isLoading} 
            onRowClick={setSelectedLead} 
          />
          {pagination && <Pagination data={pagination} />}
        </div>
      )}

      {/* Create Lead Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Lead"
      >
        <LeadForm 
          onSuccess={() => setIsCreateModalOpen(false)}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Lead Detail Panel */}
      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Lead Details"
      >
        {selectedLead && (
          <LeadDetail 
            lead={selectedLead} 
            onClose={() => setSelectedLead(null)} 
          />
        )}
      </Modal>
    </>
  );
}
