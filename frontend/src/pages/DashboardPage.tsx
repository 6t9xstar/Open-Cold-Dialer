import React from "react";
import { useLeads } from "@/hooks/useLeads";
import { useCallLogs } from "@/hooks/useCallLogs";
import {
  Users,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  PhoneMissed,
  TrendingUp,
} from "lucide-react";

export function DashboardPage() {
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: callLogs, isLoading: logsLoading } = useCallLogs();

  const totalLeads = leads?.length ?? 0;
  const newLeads = leads?.filter((l) => l.status === "new").length ?? 0;
  const contactedLeads = leads?.filter((l) => l.status === "contacted").length ?? 0;
  const interestedLeads = leads?.filter((l) => l.status === "interested").length ?? 0;
  const convertedLeads = leads?.filter((l) => l.status === "converted").length ?? 0;
  const totalCalls = callLogs?.length ?? 0;
  const answeredCalls = (callLogs ?? []).filter((l) => l.outcome === "answered").length ?? 0;
  const avgDuration =
    totalCalls > 0 && callLogs
      ? Math.round(
          callLogs.reduce((sum, l) => sum + (l.duration_seconds ?? 0), 0) /
            totalCalls
        )
      : 0;

  const stats = [
    {
      label: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "brand",
      bgClass: "bg-brand-50",
      iconClass: "text-brand-600",
    },
    {
      label: "New Today",
      value: newLeads,
      icon: TrendingUp,
      color: "emerald",
      bgClass: "bg-emerald-50",
      iconClass: "text-emerald-600",
    },
    {
      label: "Interested",
      value: interestedLeads,
      icon: CheckCircle,
      color: "amber",
      bgClass: "bg-amber-50",
      iconClass: "text-amber-600",
    },
    {
      label: "Total Calls",
      value: totalCalls,
      icon: Phone,
      color: "blue",
      bgClass: "bg-blue-50",
      iconClass: "text-blue-600",
    },
    {
      label: "Answered",
      value: answeredCalls,
      icon: Phone,
      color: "green",
      bgClass: "bg-green-50",
      iconClass: "text-green-600",
    },
    {
      label: "Avg Duration",
      value: `${avgDuration}s`,
      icon: Clock,
      color: "purple",
      bgClass: "bg-purple-50",
      iconClass: "text-purple-600",
    },
  ];

  if (leadsLoading || logsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgClass}`}>
                  <Icon className={`w-6 h-6 ${stat.iconClass}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Lead Status Distribution
          </h2>
          <div className="space-y-3">
            {[
              { label: "New", count: newLeads, color: "bg-brand-500" },
              { label: "Contacted", count: contactedLeads, color: "bg-blue-500" },
              { label: "Interested", count: interestedLeads, color: "bg-amber-500" },
              { label: "Not Interested", count: (leads ?? []).filter((l) => l.status === "not_interested").length, color: "bg-gray-400" },
              { label: "Converted", count: convertedLeads, color: "bg-green-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="flex-1 text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          {callLogs?.length === 0 ? (
            <p className="text-sm text-gray-500">No call activity yet</p>
          ) : (
            <div className="space-y-3">
              {(callLogs ?? [])
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .slice(0, 5)
                .map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {log.outcome}
                      </p>
                      <p className="text-xs text-gray-500">
                        {log.duration_seconds}s
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
