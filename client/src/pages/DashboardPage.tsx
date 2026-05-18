import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, TrendingUp, Compass, Calendar, ArrowRight } from 'lucide-react';
import { leadsApi } from '@/api/leadsApi';
import { useAuthStore } from '@/store/authStore';

export function DashboardPage() {
  const { user } = useAuthStore();

  // Fetch all leads (unpaginated) using exportLeads endpoint to calculate real analytics metrics
  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['all-leads-analytics'],
    queryFn: () => leadsApi.exportLeads({ sort: 'latest' }),
  });

  // Calculate Metrics
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const contactedLeads = leads.filter((l) => l.status === 'Contacted').length;
  const qualifiedLeads = leads.filter((l) => l.status === 'Qualified').length;
  const lostLeads = leads.filter((l) => l.status === 'Lost').length;

  const conversionRate = totalLeads ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  // Source Distribution Calculation
  const sources = ['Website', 'Instagram', 'Referral', 'LinkedIn', 'Twitter', 'Organic', 'Direct', 'Other'];
  const sourceMetrics = sources.map((src) => {
    const count = leads.filter((l) => l.source === src).length;
    const percentage = totalLeads ? Math.round((count / totalLeads) * 100) : 0;
    return { name: src, count, percentage };
  }).sort((a, b) => b.count - a.count);

  // Status Chart Data
  const statusBars = [
    { label: 'New', count: newLeads, color: 'bg-blue-500', text: 'text-blue-500' },
    { label: 'Contacted', count: contactedLeads, color: 'bg-amber-500', text: 'text-amber-500' },
    { label: 'Qualified', count: qualifiedLeads, color: 'bg-emerald-500', text: 'text-emerald-500' },
    { label: 'Lost', count: lostLeads, color: 'bg-rose-500', text: 'text-rose-500' },
  ];
  const maxStatusCount = Math.max(...statusBars.map((s) => s.count), 1);

  // Get 4 most recent leads for Activity Feed
  const recentLeads = leads.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Welcome Back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-muted">
          Here is your sales pipeline analytics and lead conversion summary.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-sm text-muted animate-pulse">
          Loading metrics and pipeline graphs...
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          Failed to fetch dashboard metrics. Please reload the page.
        </div>
      ) : (
        <>
          {/* Metrics Panel */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Metric 1 */}
            <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">Total Leads</p>
                <div className="rounded-lg bg-surface-card p-2 text-body">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-ink">{totalLeads}</span>
                <span className="text-xs font-semibold text-emerald-600">Active</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">Conversion Rate</p>
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-ink">{conversionRate}%</span>
                <span className="text-xs font-semibold text-muted">Qualified ratio</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">Qualified Leads</p>
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <Compass className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-ink">{qualifiedLeads}</span>
                <span className="text-xs font-semibold text-indigo-600">Ready to close</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">Pending Actions</p>
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-ink">{newLeads + contactedLeads}</span>
                <span className="text-xs font-semibold text-amber-600">New & Contacted</span>
              </div>
            </div>
          </div>

          {/* Graphics Section */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Leads by Status bar chart */}
            <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-sm space-y-6">
              <h2 className="font-semibold text-ink">Leads by Pipeline Status</h2>
              <div className="flex items-end justify-between h-48 pt-4 px-4">
                {statusBars.map((bar) => {
                  const heightPercentage = Math.max((bar.count / maxStatusCount) * 100, 4); // minimum height to show label nicely
                  return (
                    <div key={bar.label} className="flex flex-col items-center flex-1 space-y-2">
                      <div className="text-xs font-bold text-slate-700">{bar.count}</div>
                      <div 
                        className={`w-12 rounded-t-md ${bar.color} transition-all duration-500`}
                        style={{ height: `${heightPercentage * 1.2}px` }}
                      ></div>
                      <div className="text-xs font-semibold text-muted-soft">{bar.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leads by Source horizontal bars */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-slate-900">Leads by Channel Source</h2>
              <div className="space-y-3.5">
                {sourceMetrics.slice(0, 5).map((metric) => (
                  <div key={metric.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-600">{metric.name}</span>
                      <span className="text-slate-900 font-bold">{metric.count} ({metric.percentage}%)</span>
                    </div>
                    <div className="w-full bg-surface-soft h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${metric.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Activity Feed: 2 columns */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Recent Lead Actions</h2>
                <Link to="/leads" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  View Leads Directory
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {recentLeads.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-400">
                  No leads recorded in the database yet.
                </div>
              ) : (
                <div className="divide-y divide-hairline-soft">
                  {recentLeads.map((lead) => (
                    <div key={lead._id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                        <p className="text-xs text-slate-500">
                          {lead.email} • Source: <span className="font-semibold">{lead.source}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            lead.status === 'Qualified'
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                              : lead.status === 'Contacted'
                              ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                              : lead.status === 'Lost'
                              ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                              : 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                          }`}
                        >
                          {lead.status}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-xl border border-slate-200 bg-amber-500/10 p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="rounded-lg bg-amber-500 text-white w-10 h-10 flex items-center justify-center shadow-sm">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-4">Smart Lead Management</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Easily record incoming sales requests, evaluate conversion statistics, export data spreadsheets, and track customer lifecycles natively.
                </p>
              </div>

              <div className="space-y-2">
                <Link to="/leads">
                  <button className="w-full rounded-lg bg-amber-600 py-2.5 px-4 text-xs font-semibold text-white shadow hover:bg-amber-700 transition-colors">
                    Manage Pipeline Table
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
