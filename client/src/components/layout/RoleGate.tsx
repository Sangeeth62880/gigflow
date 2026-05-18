import React from 'react';
import { useAuthStore } from '@/store/authStore';

interface RoleGateProps {
  allowedRoles: ('admin' | 'sales')[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ allowedRoles, children, fallback = null }: RoleGateProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
