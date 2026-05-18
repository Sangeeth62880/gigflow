import { axiosInstance } from './axiosInstance';
import { AuthResponse, ApiResponse, User } from '../types';
import { LoginInput, RegisterInput } from '../utils/validators';

export const authApi = {
  login: async (credentials: LoginInput) => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  
  register: async (data: RegisterInput) => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  getUsers: async () => {
    const response = await axiosInstance.get<ApiResponse<User[]>>('/auth/users');
    return response.data.data;
  }
};
