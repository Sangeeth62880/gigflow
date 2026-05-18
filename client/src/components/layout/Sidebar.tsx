import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, LayoutDashboard, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { RoleGate } from './RoleGate';

export function Sidebar() {
  const { user } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-hairline bg-surface-soft">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold tracking-tight text-ink">GigFlow</h1>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto pt-4">
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-pill transition-colors ${
                  isActive
                    ? 'bg-canvas text-ink shadow-sm ring-1 ring-hairline'
                    : 'text-muted hover:bg-surface-card hover:text-ink'
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}

          <RoleGate allowedRoles={['admin']}>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-pill transition-colors mt-4 ${
                  isActive
                    ? 'bg-canvas text-ink shadow-sm ring-1 ring-hairline'
                    : 'text-muted hover:bg-surface-card hover:text-ink'
                }`
              }
            >
              <Settings
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              Settings
            </NavLink>
          </RoleGate>
        </nav>
      </div>

      <div className="border-t border-hairline p-4">
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-card text-sm font-medium text-muted">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-ink">{user?.name}</p>
            <p className="text-xs text-muted-soft capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
