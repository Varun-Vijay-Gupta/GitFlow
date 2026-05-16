import { api } from './api';
import { ApiResponse, User } from '@/types';

interface AuthData {
  user: User;
  token: string;
}

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const res = await api.post<ApiResponse<AuthData>>('/auth/register', data);
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await api.post<ApiResponse<AuthData>>('/auth/login', {
      email,
      password,
    });
    return res.data;
  },

  logout: async () => {
    const res = await api.post<ApiResponse>('/auth/logout');
    return res.data;
  },

  getMe: async () => {
    const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data;
  },
};
