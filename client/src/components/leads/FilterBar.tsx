import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset page to 1 when filters change
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('search', e.target.value);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasFilters = Array.from(searchParams.keys()).some(k => ['search', 'status', 'source'].includes(k));

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative max-w-xs flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          placeholder="Search leads..."
          defaultValue={searchParams.get('search') || ''}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-40">
          <Select
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'New', value: 'New' },
              { label: 'Contacted', value: 'Contacted' },
              { label: 'Qualified', value: 'Qualified' },
              { label: 'Lost', value: 'Lost' },
            ]}
            value={searchParams.get('status') || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          />
        </div>

        <div className="w-40">
          <Select
            options={[
              { label: 'All Sources', value: '' },
              { label: 'Organic', value: 'Organic' },
              { label: 'Referral', value: 'Referral' },
              { label: 'LinkedIn', value: 'LinkedIn' },
              { label: 'Twitter', value: 'Twitter' },
              { label: 'Direct', value: 'Direct' },
              { label: 'Website', value: 'Website' },
              { label: 'Instagram', value: 'Instagram' },
              { label: 'Other', value: 'Other' },
            ]}
            value={searchParams.get('source') || ''}
            onChange={(e) => handleFilterChange('source', e.target.value)}
          />
        </div>

        <div className="w-40">
          <Select
            options={[
              { label: 'Latest First', value: 'latest' },
              { label: 'Oldest First', value: 'oldest' },
            ]}
            value={searchParams.get('sort') || 'latest'}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          />
        </div>

        {hasFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="ml-auto flex items-center gap-2">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
