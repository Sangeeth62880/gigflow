import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Users, Server, Radio, Sliders, ToggleLeft, ToggleRight } from 'lucide-react';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export function SettingsPage() {
  const { user: currentUser } = useAuthStore();
  const [autoAssign, setAutoAssign] = useState(true);
  const [strictValidation, setStrictValidation] = useState(true);
  const [rateLimit, setRateLimit] = useState(500);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: authApi.getUsers,
    enabled: currentUser?.role === 'admin',
  });

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <Shield className="h-12 w-12 text-error animate-pulse" />
        <h3 className="mt-4 text-lg font-semibold text-ink">Access Denied</h3>
        <p className="mt-2 text-sm text-muted max-w-sm">
          Only administrators have access to system settings and user management profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">System Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Monitor system metrics, manage registered users, and configure application routing profiles.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-surface-soft p-2 text-ink">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-soft">Database Node</p>
              <p className="text-sm font-bold text-ink mt-0.5">Primary MongoDB Atlas</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-xs font-semibold text-success">Connected & Healthy</span>
          </div>
        </div>

        <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-surface-soft p-2 text-ink">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-soft">Network Latency</p>
              <p className="text-sm font-bold text-ink mt-0.5">24ms (Cluster average)</p>
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-muted">
            Node location: US-East-1 (AWS)
          </div>
        </div>

        <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-surface-soft p-2 text-ink">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-soft">Security Profile</p>
              <p className="text-sm font-bold text-ink mt-0.5">TLS 1.3 / JWT Encrypted</p>
            </div>
          </div>
          <div className="mt-4 text-xs font-semibold text-ink">
            Strict RBAC Enforcement
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: User Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-hairline bg-canvas shadow-sm overflow-hidden">
            <div className="border-b border-hairline px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted" />
                <h2 className="font-semibold text-ink">User & Agent Directory</h2>
              </div>
              <span className="rounded-pill bg-surface-soft px-3 py-1 text-xs font-semibold text-ink">
                {users?.length || 0} Registered
              </span>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-sm text-muted animate-pulse">
                Fetching user profiles...
              </div>
            ) : error ? (
              <div className="p-8 text-center text-sm text-error">
                Failed to load system users.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-hairline text-left text-sm">
                  <thead className="bg-surface-soft font-semibold text-ink">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft text-body">
                    {users?.map((usr: any) => (
                      <tr key={usr._id} className="hover:bg-surface-soft transition-colors">
                        <td className="px-6 py-4 font-medium text-ink">{usr.name}</td>
                        <td className="px-6 py-4 text-muted">{usr.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-semibold capitalize ${
                              usr.role === 'admin'
                                ? 'bg-ink text-canvas'
                                : 'bg-surface-strong text-ink'
                            }`}
                          >
                            {usr.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                            <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Configurations */}
        <div className="space-y-6">
          <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-hairline-soft pb-3">
              <Sliders className="h-5 w-5 text-muted" />
              <h2 className="font-semibold text-ink">App Toggles</h2>
            </div>

            {/* Toggle 1 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">Lead Auto-Assignment</p>
                <p className="text-xs text-muted">Balance leads automatically among Sales agents</p>
              </div>
              <button
                onClick={() => setAutoAssign(!autoAssign)}
                className="text-muted hover:text-ink transition-colors focus:outline-none"
              >
                {autoAssign ? (
                  <ToggleRight className="h-8 w-8 text-ink" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-muted-soft" />
                )}
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">Strict Request Validation</p>
                <p className="text-xs text-muted">Reject malformed JSON schemas at server level</p>
              </div>
              <button
                onClick={() => setStrictValidation(!strictValidation)}
                className="text-muted hover:text-ink transition-colors focus:outline-none"
              >
                {strictValidation ? (
                  <ToggleRight className="h-8 w-8 text-ink" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-muted-soft" />
                )}
              </button>
            </div>

            {/* Slider Config */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">Global Rate Limit</p>
                <span className="text-xs font-bold text-ink bg-surface-soft px-2 py-0.5 rounded-md">
                  {rateLimit} req/min
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                value={rateLimit}
                onChange={(e) => setRateLimit(Number(e.target.value))}
                className="w-full h-1 bg-surface-strong rounded-lg appearance-none cursor-pointer accent-ink"
              />
              <p className="text-[10px] text-muted-soft">
                Rate limiting blocks automated DDoS behaviors dynamically.
              </p>
            </div>

            {/* Simulated Sync Button */}
            <div className="pt-4 border-t border-hairline-soft">
              <Button className="w-full" size="sm">
                Apply System Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
