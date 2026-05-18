import { axiosInstance } from './axiosInstance';
import { ApiResponse } from '../types';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Organic' | 'Referral' | 'LinkedIn' | 'Twitter' | 'Direct' | 'Other' | 'Website' | 'Instagram';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: PaginationData;
}

export interface GetLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  sort?: 'latest' | 'oldest';
}

export const leadsApi = {
  getLeads: async (params: GetLeadsParams) => {
    const response = await axiosInstance.get<ApiResponse<LeadsResponse>>('/leads', { params });
    return response.data.data;
  },

  createLead: async (data: Partial<Lead>) => {
    const response = await axiosInstance.post<ApiResponse<Lead>>('/leads', data);
    return response.data.data;
  },

  updateLead: async (id: string, data: Partial<Lead>) => {
    const response = await axiosInstance.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return response.data.data;
  },

  deleteLead: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/leads/${id}`);
    return response.data;
  },

  exportLeads: async (params: Omit<GetLeadsParams, 'page' | 'limit'>) => {
    const response = await axiosInstance.get<ApiResponse<Lead[]>>('/leads/export', { params });
    return response.data.data;
  },
};
