import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onCreateLead: () => void;
}

export function EmptyState({ hasFilters, onClearFilters, onCreateLead }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Users className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {hasFilters ? 'No leads found' : 'No leads yet'}
      </h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">
        {hasFilters 
          ? 'Try adjusting your filters or search query to find what you are looking for.' 
          : 'Get started by creating your first lead.'}
      </p>
      <div className="mt-6 flex gap-3">
        {hasFilters ? (
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        ) : (
          <Button onClick={onCreateLead}>
            Create Lead
          </Button>
        )}
      </div>
    </div>
  );
}
