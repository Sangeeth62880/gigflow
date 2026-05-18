import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { leadsApi } from '../api/leadsApi';
import { useDebounce } from './useDebounce';

export function useLeads() {
  const [searchParams] = useSearchParams();
  
  const page = Number(searchParams.get('page')) || 1;
  const searchRaw = searchParams.get('search') || '';
  const status = searchParams.get('status') || undefined;
  const source = searchParams.get('source') || undefined;
  const sort = (searchParams.get('sort') as 'latest' | 'oldest') || 'latest';

  const search = useDebounce(searchRaw, 300);

  const queryParams = {
    page,
    limit: 10,
    ...(search && { search }),
    ...(status && { status }),
    ...(source && { source }),
    sort,
  };

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['leads', queryParams],
    queryFn: () => leadsApi.getLeads(queryParams),
    placeholderData: (previousData) => previousData, // keep previous data while fetching
  });

  return {
    leads: data?.leads || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
    activeFiltersCount: [search, status, source].filter(Boolean).length,
  };
}
