import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useCallLogs } from "@/hooks/useCallLogs";
import { Search, Filter, Phone } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { Database } from "@/types/database";

type Lead = Database["public"]["Tables"]["leads"]["Row"];

export function CallHistoryPage() {
  const { data: callLogs, isLoading } = useCallLogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState<string>("all");

  const leadIds = [...new Set((callLogs ?? []).map((l) => l.lead_id).filter(Boolean))];
  const { data: leadsMap } = useQuery<Record<string, Lead>>({
    queryKey: ["leads", "batch", ...leadIds],
    queryFn: async () => {
      if (leadIds.length === 0) return {};
      const { data, error } = await supabase.from("leads").select("*").in("id", leadIds);
      if (error) throw error;
      const map: Record<string, Lead> = {};
      (data ?? []).forEach((l: Lead) => { map[l.id] = l; });
      return map;
    },
    enabled: leadIds.length > 0,
  });

  const filtered = (callLogs ?? []).filter((log) => {
    const matchesOutcome = outcomeFilter === "all" || log.outcome === outcomeFilter;
    const q = searchQuery.toLowerCase();
    const lead = log.lead_id ? leadsMap?.[log.lead_id] : null;
    const leadName = lead ? `${lead.first_name ?? ""} ${lead.last_name ?? ""}`.toLowerCase() : "";
    const matchesSearch = !q || leadName.includes(q) || (log.notes ?? "").toLowerCase().includes(q);
    return matchesOutcome && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Call History</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by lead name or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
          >
            <option value="all">All Outcomes</option>
            <option value="answered">Answered</option>
            <option value="no_answer">No Answer</option>
            <option value="busy">Busy</option>
            <option value="voicemail">Voicemail</option>
            <option value="dnc">DNC</option>
            <option value="wrong_number">Wrong Number</option>
            <option value="disconnected">Disconnected</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Lead</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Outcome</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Duration</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Notes</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((log) => {
                const lead = log.lead_id ? leadsMap?.[log.lead_id] : null;
                const leadName = lead ? `${lead.first_name ?? ""} ${lead.last_name ?? ""}`.trim() || lead.phone || "—" : "—";
                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium text-gray-900">{leadName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={log.outcome} /></td>
                    <td className="px-4 py-3 text-gray-600">{log.duration_seconds}s</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{log.notes ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{log.created_at ? new Date(log.created_at).toLocaleString() : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">No call records found</div>
        )}
      </div>
    </div>
  );
}
